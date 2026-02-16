import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// ── NTEE major code → GiveWiZe category ────────────────────────────
const NTEE_TO_CATEGORY: Record<string, string> = {
  A: "arts-culture",
  B: "education",
  C: "environment-climate",
  D: "animal-welfare",
  E: "medical-health",
  G: "medical-health",
  H: "medical-health",
  F: "mental-health",
  I: "human-rights",
  R: "human-rights",
  J: "human-rights",       // Employment/jobs
  K: "hunger-food-security",
  L: "housing-homelessness",
  N: "community-development", // Recreation/sports
  O: "child-welfare",
  P: "community-development", // Human services (broad)
  Q: "international-development",
  S: "community-development", // Community improvement
  T: "community-development", // Philanthropy/voluntarism
  U: "education",             // Science & technology
  W: "community-development", // Public/societal benefit
  X: "faith-based",
  Y: "community-development", // Mutual/membership benefit
};

function nteeToCategorySlug(nteeCode: string | null | undefined): string {
  if (!nteeCode || nteeCode.length === 0) return "community-development";
  const letter = nteeCode.charAt(0).toUpperCase();
  return NTEE_TO_CATEGORY[letter] ?? "community-development";
}

// ── Scoring algorithm (port of charityUtils.ts) ─────────────────────

interface CharityLike {
  ein?: string | null;
  program_expense_percentage?: number | null;
  complete_990_filed?: boolean | null;
  financials_published?: boolean | null;
  annual_report_url?: string | null;
  year_founded?: number | null;
  people_served_annually?: number | null;
  target_population_size?: number | null;
  programs_list?: string[] | null;
}

interface ComputedScores {
  financial_efficiency: number | null;
  transparency: number;
  longevity: number | null;
  impact: number | null;
  overall: number;
}

function computeGivewizeScores(charity: CharityLike): ComputedScores {
  // Financial Efficiency (0-5) -- null if no program expense data
  let fe: number | null = null;
  if (charity.program_expense_percentage != null) {
    const pep = charity.program_expense_percentage;
    if (pep >= 90) fe = 5.0;
    else if (pep >= 85) fe = 4.5;
    else if (pep >= 80) fe = 4.0;
    else if (pep >= 75) fe = 3.5;
    else if (pep >= 70) fe = 3.0;
    else if (pep >= 60) fe = 2.5;
    else if (pep >= 50) fe = 2.0;
    else fe = 1.5;
  }

  // Transparency (0-5) -- always computable from checklist
  let tp = 0;
  const einStr = charity.ein ? String(charity.ein) : "";
  const validEin =
    einStr.length > 0 &&
    !einStr.includes("verify") &&
    !einStr.includes("contact");
  if (validEin) tp += 1.0;
  if (charity.complete_990_filed) tp += 1.0;
  if (charity.financials_published) tp += 1.0;
  if (charity.annual_report_url) tp += 1.25;
  if (charity.program_expense_percentage != null) tp += 0.75;
  tp = Math.min(5, tp);

  // Longevity (0-5) -- null if no founding year; floor of 3.0
  let lg: number | null = null;
  if (charity.year_founded) {
    const age = new Date().getFullYear() - charity.year_founded;
    if (age >= 50) lg = 5.0;
    else if (age >= 30) lg = 4.5;
    else if (age >= 20) lg = 4.0;
    else if (age >= 10) lg = 3.5;
    else lg = 3.0;
  }

  // Impact (0-5) -- coverage-based if target_population_size available
  let imp: number | null = null;
  if (charity.people_served_annually != null) {
    const ps = charity.people_served_annually;
    const tps = charity.target_population_size;

    if (tps != null && tps > 0) {
      const coverage = ps / tps;
      if (coverage >= 0.5) imp = 5.0;
      else if (coverage >= 0.25) imp = 4.5;
      else if (coverage >= 0.1) imp = 4.0;
      else if (coverage >= 0.05) imp = 3.5;
      else imp = 3.0;
    } else {
      if (ps >= 1_000_000) imp = 5.0;
      else if (ps >= 500_000) imp = 4.5;
      else if (ps >= 100_000) imp = 4.0;
      else if (ps >= 10_000) imp = 3.5;
      else imp = 3.0;
    }
    // Programs list bonus
    if (charity.programs_list && charity.programs_list.length >= 8)
      imp = Math.min(5, imp + 0.5);
    else if (charity.programs_list && charity.programs_list.length >= 4)
      imp = Math.min(5, imp + 0.25);
  } else if (charity.programs_list && charity.programs_list.length > 0) {
    if (charity.programs_list.length >= 8) imp = 4.0;
    else if (charity.programs_list.length >= 4) imp = 3.5;
    else imp = 3.0;
  }

  // Overall: weighted average of available components
  // Weights: FE 35%, TP 30%, IMP 25%, LG 10%
  const components: { score: number; weight: number }[] = [];
  if (fe != null) components.push({ score: fe, weight: 0.35 });
  components.push({ score: tp, weight: 0.3 });
  if (imp != null) components.push({ score: imp, weight: 0.25 });
  if (lg != null) components.push({ score: lg, weight: 0.1 });

  const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
  const overall =
    components.reduce((sum, c) => sum + c.score * c.weight, 0) / totalWeight;

  return {
    financial_efficiency: fe != null ? Math.round(fe * 10) / 10 : null,
    transparency: Math.round(tp * 10) / 10,
    longevity: lg != null ? Math.round(lg * 10) / 10 : null,
    impact: imp != null ? Math.round(imp * 10) / 10 : null,
    overall: Math.round(overall * 10) / 10,
  };
}

// ── ProPublica helpers ──────────────────────────────────────────────

// deno-lint-ignore no-explicit-any
type PropublicaOrg = Record<string, any>;

interface MappedCharity {
  name: string;
  ein: string | null;
  city: string | null;
  state: string | null;
  country: string;
  headquarters: string | null;
  year_founded: number | null;
  website: string | null;
  mission_statement: string | null;
  full_description: string | null;
  program_expense_percentage: number | null;
  admin_expense_percentage: number | null;
  fundraising_expense_percentage: number | null;
  complete_990_filed: boolean;
  financials_published: boolean;
  primary_category: string;
  geographic_scope: string;
  annual_report_url: string | null;
  people_served_annually: number | null;
  target_population: string | null;
  programs_list: string[] | null;
  logo_url: string | null;
}

function formatEin(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).replace(/\D/g, "");
  if (s.length === 9) return `${s.slice(0, 2)}-${s.slice(2)}`;
  return s.length > 0 ? s : null;
}

function mapPropublicaToCharity(data: PropublicaOrg): MappedCharity {
  const org = data.organization ?? {};
  const filings = data.filings_with_data ?? [];
  const latest = filings.length > 0 ? filings[0] : null;

  // Parse year_founded from ruling_date
  let yearFounded: number | null = null;
  if (org.ruling_date) {
    const parsed = parseInt(String(org.ruling_date).substring(0, 4), 10);
    if (!isNaN(parsed) && parsed > 1800 && parsed <= new Date().getFullYear()) {
      yearFounded = parsed;
    }
  }

  // Expense percentages: ProPublica API v2 does NOT expose the 990 Part IX
  // expense breakdown (program/admin/fundraising). totprgmrevnue is program
  // service REVENUE, not expenses. We leave these null and request them from
  // the charity via the info-request email flow.
  const programExpPct: number | null = null;
  const adminExpPct: number | null = null;
  const fundraisingExpPct: number | null = null;

  // Name and geographic scope
  const name = org.name ?? "Unknown Organization";
  const nteeCode = org.ntee_code ?? "";
  let geographicScope = "national";

  // Detect global scope from name, NTEE code, or mission content
  const nameLower = name.toLowerCase();
  const missionLower = (latest?.mission || org.mission || "").toLowerCase();
  const globalKeywords = ["international", "global", "worldwide", "world", "countries"];
  if (
    nteeCode.toUpperCase().startsWith("Q") ||
    globalKeywords.some(kw => nameLower.includes(kw)) ||
    globalKeywords.some(kw => missionLower.includes(kw))
  ) {
    geographicScope = "global";
  }

  // Location
  const city = org.city ?? null;
  const state = org.state ?? null;
  const headquarters = city && state ? `${city}, ${state}` : city || state || null;

  // Mission statement — ProPublica stores in filing or org level
  let mission: string | null = null;
  if (latest?.mission) mission = String(latest.mission);
  else if (org.mission) mission = String(org.mission);

  // Tax-exempt subsection → description for full_description
  const subsectionCode = org.subsection_code;
  const taxStatus = subsectionCode === 3 ? "501(c)(3) tax-exempt" :
    subsectionCode ? `501(c)(${subsectionCode}) tax-exempt` : "tax-exempt";
  const incomeStr = org.income_amount ? `$${Number(org.income_amount).toLocaleString()}` : null;
  const assetStr = org.asset_amount ? `$${Number(org.asset_amount).toLocaleString()}` : null;

  let fullDesc = `${name} is a ${taxStatus} nonprofit organization`;
  if (headquarters) fullDesc += ` based in ${headquarters}`;
  if (yearFounded) fullDesc += `, established in ${yearFounded}`;
  fullDesc += ".";
  if (incomeStr) fullDesc += ` Annual revenue: ${incomeStr}.`;
  if (assetStr) fullDesc += ` Total assets: ${assetStr}.`;
  if (nteeCode) fullDesc += ` NTEE classification: ${nteeCode}.`;

  return {
    name,
    ein: formatEin(org.ein),
    city,
    state,
    country: "USA",
    headquarters,
    year_founded: yearFounded,
    website: null, // ProPublica doesn't provide website — merged from request later
    mission_statement: mission,
    full_description: fullDesc,
    program_expense_percentage: programExpPct,
    admin_expense_percentage: adminExpPct,
    fundraising_expense_percentage: fundraisingExpPct,
    complete_990_filed: filings.length > 0,
    financials_published: filings.length > 0,
    primary_category: nteeToCategorySlug(nteeCode),
    geographic_scope: geographicScope,
    annual_report_url: null,
    people_served_annually: null,
    target_population: null,
    programs_list: null,
    logo_url: null,
  };
}

// ── Claude API helper ────────────────────────────────────────────────

async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1024,
): Promise<string | null> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set");
    return null;
  }
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      console.error("Claude API error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.content?.[0]?.text ?? null;
  } catch (e) {
    console.error("Claude API call failed:", e);
    return null;
  }
}

function truncateForLlm(text: string, maxChars = 40000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n...[truncated]";
}

/** Extract a JSON object from a Claude response that may contain markdown fences or preamble text. */
function extractJsonFromResponse(raw: string): unknown | null {
  // Strategy 1: Try parsing the raw string directly
  try { return JSON.parse(raw); } catch { /* continue */ }

  // Strategy 2: Strip markdown code fences (```json ... ```)
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/i);
  if (fenceMatch?.[1]) {
    try { return JSON.parse(fenceMatch[1].trim()); } catch { /* continue */ }
  }

  // Strategy 3: Find the first { ... } block in the response
  const braceStart = raw.indexOf("{");
  const braceEnd = raw.lastIndexOf("}");
  if (braceStart !== -1 && braceEnd > braceStart) {
    try { return JSON.parse(raw.slice(braceStart, braceEnd + 1)); } catch { /* continue */ }
  }

  return null;
}

// ── Agent 1: Profile Enrichment Agent ────────────────────────────────

const ENRICHMENT_SYSTEM_PROMPT = `You are a charity data extraction specialist. Given raw HTML from a nonprofit's website pages, extract structured data. Return ONLY valid JSON with these fields:
- mission: string | null (the organization's mission statement, 1-3 sentences)
- description: string | null (a brief description of what they do)
- programs: string[] | null (list of distinct program/service names, max 12)
- targetPopulation: string | null (who they serve)
- logoUrl: string | null (og:image or primary logo URL)
- annualReportUrl: string | null (link to annual report PDF/page)
- hasDonateButton: boolean (whether the site has a donate link/button)

Rules:
- For programs, extract ONLY actual program/service names, not navigation items, taglines, or generic headings
- Mission should be their stated mission, not marketing copy
- Return null for any field you cannot confidently determine
- Do NOT fabricate or infer data that isn't explicitly present`;

interface EnrichmentMetrics {
  used_claude: boolean;
  fields_extracted: string[];
  fallback_used: boolean;
  duration_ms: number;
}

async function enrichWithClaude(
  pages: { url: string; html: string }[],
): Promise<{ result: WebsiteScrapResult; metrics: EnrichmentMetrics }> {
  const metrics: EnrichmentMetrics = {
    used_claude: false,
    fields_extracted: [],
    fallback_used: false,
    duration_ms: 0,
  };

  const start = Date.now();
  const combinedHtml = pages
    .map((p) => `--- PAGE: ${p.url} ---\n${p.html}`)
    .join("\n\n");
  const truncated = truncateForLlm(combinedHtml);

  const raw = await callClaude(
    ENRICHMENT_SYSTEM_PROMPT,
    `Extract structured charity data from these website pages:\n\n${truncated}`,
    1024,
  );
  metrics.duration_ms = Date.now() - start;

  if (!raw) {
    return { result: {}, metrics };
  }

  try {
    const parsed = extractJsonFromResponse(raw);
    if (!parsed || typeof parsed !== "object") {
      console.error("Agent 1: Could not extract JSON from response:", raw.slice(0, 200));
      return { result: {}, metrics };
    }
    metrics.used_claude = true;
    // deno-lint-ignore no-explicit-any
    const data = parsed as any;

    const result: WebsiteScrapResult = {};
    if (data.mission) { result.mission = data.mission; metrics.fields_extracted.push("mission"); }
    if (data.description) { result.description = data.description; metrics.fields_extracted.push("description"); }
    if (data.programs && Array.isArray(data.programs) && data.programs.length > 0) {
      result.programs = data.programs.slice(0, 12);
      metrics.fields_extracted.push("programs");
    }
    if (data.targetPopulation) { result.targetPopulation = data.targetPopulation; metrics.fields_extracted.push("targetPopulation"); }
    if (data.logoUrl) { result.logoUrl = data.logoUrl; metrics.fields_extracted.push("logoUrl"); }
    if (data.annualReportUrl) { result.annualReportUrl = data.annualReportUrl; metrics.fields_extracted.push("annualReportUrl"); }
    if (typeof data.hasDonateButton === "boolean") { result.hasDonateButton = data.hasDonateButton; metrics.fields_extracted.push("hasDonateButton"); }

    return { result, metrics };
  } catch (e) {
    console.error("Failed to parse Claude enrichment response:", e);
    return { result: {}, metrics };
  }
}

// ── Agent 2: Quality Review Agent ─────────────────────────────────

const REVIEW_SYSTEM_PROMPT = `You are a nonprofit profile quality reviewer for GiveWiZe, a charity discovery platform. Review this charity profile and assess its quality and accuracy.

Return ONLY valid JSON with:
- overall_quality: "excellent" | "good" | "needs_review" | "poor"
- confidence_score: number 0-100 (how confident you are in the profile's accuracy)
- red_flags: string[] (any concerning issues found)
- suggestions: string[] (improvements that could be made)
- category_correct: boolean (is the assigned category appropriate for this org?)
- suggested_category: string | null (only if category_correct is false, use one of: rare-diseases, medical-health, education, hunger-food-security, animal-welfare, child-welfare, environment-climate, emergency-relief, housing-homelessness, mental-health, veterans, arts-culture, human-rights, disability-services, senior-services, community-development, faith-based, international-development)

Quality criteria:
- "excellent": Has mission, expense data, programs, and consistent data
- "good": Has mission and at least one of expense data or programs
- "needs_review": Missing critical data or data seems inconsistent
- "poor": Very sparse or data appears inaccurate/suspicious

Red flag examples: expense ratios don't sum near 100%, mission seems auto-generated, name doesn't match described activities, suspiciously high people_served numbers`;

interface ReviewMetrics {
  overall_quality: string;
  confidence_score: number;
  red_flags: string[];
  category_overridden: boolean;
  duration_ms: number;
}

interface ReviewResult {
  overall_quality: string;
  confidence_score: number;
  red_flags: string[];
  suggestions: string[];
  category_correct: boolean;
  suggested_category: string | null;
}

async function reviewProfileWithClaude(
  profile: MappedCharity,
  scores: ComputedScores,
  verificationStatus: string,
): Promise<{ review: ReviewResult | null; metrics: ReviewMetrics }> {
  const metrics: ReviewMetrics = {
    overall_quality: "unknown",
    confidence_score: 0,
    red_flags: [],
    category_overridden: false,
    duration_ms: 0,
  };

  const start = Date.now();

  const profileSummary = JSON.stringify({
    name: profile.name,
    ein: profile.ein,
    category: profile.primary_category,
    mission: profile.mission_statement,
    description: profile.full_description,
    programs: profile.programs_list,
    target_population: profile.target_population,
    website: profile.website,
    year_founded: profile.year_founded,
    geographic_scope: profile.geographic_scope,
    program_expense_pct: profile.program_expense_percentage,
    admin_expense_pct: profile.admin_expense_percentage,
    fundraising_expense_pct: profile.fundraising_expense_percentage,
    people_served_annually: profile.people_served_annually,
    scores,
    verification_status: verificationStatus,
  }, null, 2);

  const raw = await callClaude(
    REVIEW_SYSTEM_PROMPT,
    `Review this charity profile:\n\n${profileSummary}`,
    1024,
  );
  metrics.duration_ms = Date.now() - start;

  if (!raw) return { review: null, metrics };

  // deno-lint-ignore no-explicit-any
  const parsed = extractJsonFromResponse(raw) as any;
  if (!parsed || typeof parsed !== "object") {
    console.error("Agent 2: Could not extract JSON from response:", raw.slice(0, 500));
    return { review: null, metrics };
  }

  const review: ReviewResult = {
    overall_quality: parsed.overall_quality ?? "needs_review",
    confidence_score: typeof parsed.confidence_score === "number" ? parsed.confidence_score : 50,
    red_flags: Array.isArray(parsed.red_flags) ? parsed.red_flags : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    category_correct: parsed.category_correct !== false,
    suggested_category: parsed.suggested_category ?? null,
  };

  metrics.overall_quality = review.overall_quality;
  metrics.confidence_score = review.confidence_score;
  metrics.red_flags = review.red_flags;

  return { review, metrics };
}

// ── Website scraping ────────────────────────────────────────────────

interface WebsiteScrapResult {
  mission?: string;
  description?: string;
  programs?: string[];
  targetPopulation?: string;
  logoUrl?: string;
  annualReportUrl?: string;
  hasDonateButton?: boolean;
}

function extractTextContent(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#?\w+;/gi, " ")
    .replace(/\s+/g, " ");
}

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "GiveWiZe Charity Bot/1.0" },
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function scrapeWebsiteRegex(
  baseUrl: string,
  homeHtml: string,
  aboutHtml: string | null,
  programsHtml: string | null,
): Promise<WebsiteScrapResult> {
  const result: WebsiteScrapResult = {};

  try {
    const html = homeHtml;

    // Extract meta description
    const metaDescMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i
    ) ?? html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i
    );
    if (metaDescMatch?.[1]) {
      result.description = metaDescMatch[1].trim();
    }

    // Extract OG description (often more detailed)
    const ogDescMatch = html.match(
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i
    ) ?? html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i
    );
    if (ogDescMatch?.[1] && (!result.description || ogDescMatch[1].length > result.description.length)) {
      result.description = ogDescMatch[1].trim();
    }

    // Extract og:image for logo
    const ogImageMatch = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) ?? html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
    if (ogImageMatch?.[1]) {
      let imgUrl = ogImageMatch[1].trim();
      if (imgUrl.startsWith("/")) imgUrl = baseUrl + imgUrl;
      if (imgUrl.match(/^https?:\/\/.+\.(png|jpg|jpeg|svg|webp|gif)/i) || imgUrl.match(/^https?:\/\//)) {
        result.logoUrl = imgUrl;
      }
    }

    // Check for donate button/link
    const donatePattern = /<a[^>]+href=["'][^"']*donat[^"']*["'][^>]*>/i;
    const donateButtonPattern = /(?:donate|give\s+now|support\s+us|make\s+a\s+(?:gift|donation))/i;
    result.hasDonateButton = donatePattern.test(html) || donateButtonPattern.test(html);

    // Search for annual report links
    const annualReportMatch = html.match(
      /<a[^>]+href=["']([^"']*annual[_-]?report[^"']*)["']/i
    ) ?? html.match(
      /<a[^>]+href=["']([^"']*\.pdf[^"']*)["'][^>]*>[^<]*annual\s*report/i
    );
    if (annualReportMatch?.[1]) {
      let reportUrl = annualReportMatch[1].trim();
      if (reportUrl.startsWith("/")) reportUrl = baseUrl + reportUrl;
      result.annualReportUrl = reportUrl;
    }

    // Extract text content from all pages
    const textContent = extractTextContent(html);
    const aboutText = aboutHtml ? extractTextContent(aboutHtml) : "";
    const combinedText = textContent + " " + aboutText;

    // Look for "our mission" or "mission statement" sections
    const missionPatterns = [
      /(?:our\s+mission|mission\s+statement)[:\s]+([^.]+\.[^.]*\.)/i,
      /(?:our\s+mission|mission\s+statement)[:\s]+([^.]+\.)/i,
      /mission[:\s]+(?:to\s+)([^.]+\.)/i,
    ];
    for (const pattern of missionPatterns) {
      const match = combinedText.match(pattern);
      if (match?.[1] && match[1].length > 20 && match[1].length < 500) {
        result.mission = match[1].trim();
        break;
      }
    }

    // Extract programs from subpages first, then homepage
    const programsText = programsHtml ? extractTextContent(programsHtml) : "";
    const programSearchText = programsText.length > 200 ? programsText : combinedText;

    // Strategy 1: Look for a programs/services section with bullet-style items
    const programSection = programSearchText.match(
      /(?:programs?|services?|what\s+we\s+do|our\s+work)[:\s]+([\s\S]{50,800}?)(?:learn\s+more|read\s+more|contact|donate|©)/i
    );
    if (programSection?.[1]) {
      const lines = programSection[1]
        .split(/[•\-–—|]|\d+\.\s/)
        .map((s: string) => s.trim())
        .filter(
          (s: string) =>
            s.length > 5 &&
            s.length < 100 &&
            !s.includes("©") &&
            !/^(we |our |you |interested|typical|learn more)/i.test(s) &&
            s.split(" ").length <= 10,
        );
      if (lines.length >= 2) {
        result.programs = lines.slice(0, 12);
      }
    }

    // Strategy 2: Extract h2/h3/h4 headings from the programs/services subpage
    if (!result.programs && programsHtml) {
      const headingMatches = programsHtml.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi);
      const headings: string[] = [];
      for (const m of headingMatches) {
        const text = m[1].replace(/<[^>]+>/g, "").replace(/&\w+;/g, " ").trim();
        if (text.length > 3 && text.length < 80) headings.push(text);
      }
      const filtered = headings.filter(
        (h) =>
          !/^(menu|navigation|footer|header|home|contact|donate|search|follow|©|info|action|submit|sign up|subscribe|get started|back to top)$/i.test(h) &&
          !/^\d+$/.test(h) &&
          !h.includes("©") &&
          !/^(we |our |you |interested|typical|learn more|read more)/i.test(h) &&
          h.split(" ").length <= 8,
      );
      if (filtered.length >= 2) {
        result.programs = filtered.slice(0, 12);
      }
    }

    // Strategy 3: Extract from nav links pointing to service/program subpages
    if (!result.programs && homeHtml) {
      const navLinkMatches = homeHtml.matchAll(
        /<a[^>]+href=["'][^"']*(?:program|service|what-we-do|our-work)[^"']*["'][^>]*>([^<]{3,60})<\/a>/gi,
      );
      const navPrograms: string[] = [];
      for (const m of navLinkMatches) {
        const text = m[1].replace(/&\w+;/g, " ").trim();
        if (text.length > 3 && text.length < 60) navPrograms.push(text);
      }
      if (navPrograms.length >= 2) {
        result.programs = navPrograms.slice(0, 12);
      }
    }

    // Look for annual report on about page too
    if (!result.annualReportUrl && aboutHtml) {
      const aboutReportMatch = aboutHtml.match(
        /<a[^>]+href=["']([^"']*annual[_-]?report[^"']*)["']/i
      );
      if (aboutReportMatch?.[1]) {
        let reportUrl = aboutReportMatch[1].trim();
        if (reportUrl.startsWith("/")) reportUrl = baseUrl + reportUrl;
        result.annualReportUrl = reportUrl;
      }
    }

    // Look for target population
    const popPatterns = [
      /(?:we\s+serve|serving|helping|supporting)\s+([^.]{10,100})/i,
      /(?:target\s+population|who\s+we\s+serve)[:\s]+([^.]+\.)/i,
    ];
    for (const pattern of popPatterns) {
      const match = combinedText.match(pattern);
      if (match?.[1] && match[1].length > 10) {
        result.targetPopulation = match[1].trim();
        break;
      }
    }
  } catch (e) {
    console.error("Website regex scrape failed:", e);
  }

  return result;
}

async function scrapeWebsite(
  url: string,
): Promise<{ result: WebsiteScrapResult; enrichmentMetrics: EnrichmentMetrics }> {
  const defaultMetrics: EnrichmentMetrics = {
    used_claude: false,
    fields_extracted: [],
    fallback_used: false,
    duration_ms: 0,
  };

  try {
    // Normalize base URL
    const baseUrl = url.replace(/\/+$/, "");

    // Fetch homepage + common subpages in parallel
    const pagePaths = ["", "/about", "/programs", "/what-we-do", "/services", "/our-work"];
    const pageResults = await Promise.all(
      pagePaths.map((path) => fetchPage(`${baseUrl}${path}`)),
    );
    const [homeHtml, aboutHtml, ...programPages] = pageResults;
    const programsHtml = programPages.find((p) => p && p.length > 500) ?? null;

    if (!homeHtml) return { result: {}, enrichmentMetrics: defaultMetrics };

    // Build pages array for Claude (only pages that returned content)
    const fetchedPages: { url: string; html: string }[] = [];
    pagePaths.forEach((path, i) => {
      if (pageResults[i]) {
        fetchedPages.push({ url: `${baseUrl}${path}`, html: pageResults[i]! });
      }
    });

    // ── Agent 1: Try Claude extraction first ──────────────────────
    const { result: claudeResult, metrics } = await enrichWithClaude(fetchedPages);

    // Check if Claude returned useful data (at least 2 fields)
    if (metrics.used_claude && metrics.fields_extracted.length >= 2) {
      console.log(`Agent 1: Claude extracted ${metrics.fields_extracted.length} fields: ${metrics.fields_extracted.join(", ")}`);
      return { result: claudeResult, enrichmentMetrics: metrics };
    }

    // ── Fallback: regex extraction ────────────────────────────────
    console.log("Agent 1: Falling back to regex extraction");
    metrics.fallback_used = true;
    const regexResult = await scrapeWebsiteRegex(baseUrl, homeHtml, aboutHtml, programsHtml);
    return { result: regexResult, enrichmentMetrics: metrics };
  } catch (e) {
    console.error("Website scrape failed:", e);
    return { result: {}, enrichmentMetrics: defaultMetrics };
  }
}

// ── Charity Navigator scraping ───────────────────────────────────────

interface CNData {
  starRating: number | null;       // 0-4 scale
  programExpPct: number | null;    // e.g. 85.3
  adminExpPct: number | null;
  fundraisingExpPct: number | null;
  reviewCount: number;
}

async function scrapeCharityNavigator(ein: string): Promise<CNData | null> {
  const einNoDash = ein.replace(/-/g, "");
  const url = `https://www.charitynavigator.org/ein/${einNoDash}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const result: CNData = {
      starRating: null,
      programExpPct: null,
      adminExpPct: null,
      fundraisingExpPct: null,
      reviewCount: 0,
    };

    // Try __NEXT_DATA__ JSON blob first (Next.js structured data)
    const nextDataMatch = html.match(/<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (nextDataMatch?.[1]) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        // Navigate the Next.js page props to find charity data
        const props = nextData?.props?.pageProps;
        if (props) {
          // Star rating
          if (props.overallRating != null) result.starRating = Number(props.overallRating);
          else if (props.currentRating?.overall != null) result.starRating = Number(props.currentRating.overall);
          else if (props.charity?.currentRating?.overall != null) result.starRating = Number(props.charity.currentRating.overall);

          // Expense percentages
          const financials = props.financials ?? props.charity?.financials;
          if (financials) {
            if (financials.programExpenses != null) result.programExpPct = Number(financials.programExpenses);
            if (financials.adminExpenses != null) result.adminExpPct = Number(financials.adminExpenses);
            if (financials.fundraisingExpenses != null) result.fundraisingExpPct = Number(financials.fundraisingExpenses);
          }
        }
      } catch { /* JSON parse failed, fall through to regex */ }
    }

    // Fallback: extract raw dollar amounts from embedded JSON and compute percentages
    // CN embeds data like: "totalProgramExpense":18434435,"totalFundraisingExpense":991654,"totalAdministrativeExpense":2361818
    // These are escaped JSON strings in the HTML (\" not ")
    if (result.programExpPct == null || result.adminExpPct == null || result.fundraisingExpPct == null) {
      const totalExpMatch = html.match(/totalExpense\\?":\s*(\d+)/);
      const progExpMatch = html.match(/totalProgramExpense\\?":\s*(\d+)/);
      const adminExpMatch = html.match(/totalAdministrativeExpense\\?":\s*(\d+)/);
      const fundExpMatch = html.match(/totalFundraisingExpense\\?":\s*(\d+)/);

      const totalExp = totalExpMatch ? parseInt(totalExpMatch[1], 10) : 0;
      if (totalExp > 0) {
        if (result.programExpPct == null && progExpMatch) {
          result.programExpPct = (parseInt(progExpMatch[1], 10) / totalExp) * 100;
        }
        if (result.adminExpPct == null && adminExpMatch) {
          result.adminExpPct = (parseInt(adminExpMatch[1], 10) / totalExp) * 100;
        }
        if (result.fundraisingExpPct == null && fundExpMatch) {
          result.fundraisingExpPct = (parseInt(fundExpMatch[1], 10) / totalExp) * 100;
        }
      }
    }

    // Fallback: regex for rendered percentage text (e.g. "Program Expense Ratio: 81.28%")
    if (result.programExpPct == null) {
      const progMatch = html.match(/program\s*(?:expenses?|expense\s*ratio)?[:\s]*?([\d.]+)\s*%/i);
      if (progMatch?.[1]) result.programExpPct = parseFloat(progMatch[1]);
    }
    if (result.adminExpPct == null) {
      const adminMatch = html.match(/admin(?:istrative)?\s*(?:expenses?|expense\s*ratio)?[:\s]*?([\d.]+)\s*%/i);
      if (adminMatch?.[1]) result.adminExpPct = parseFloat(adminMatch[1]);
    }
    if (result.fundraisingExpPct == null) {
      const fundMatch = html.match(/fundraising\s*(?:expenses?|expense\s*ratio)?[:\s]*?([\d.]+)\s*%/i);
      if (fundMatch?.[1]) result.fundraisingExpPct = parseFloat(fundMatch[1]);
    }

    // Star rating from HTML (e.g. "4 star" or "3-Star")
    if (result.starRating == null) {
      const starMatch = html.match(/(\d)\s*[-\s]?\s*star/i);
      if (starMatch?.[1]) result.starRating = parseInt(starMatch[1], 10);
    }

    // Validate expense percentages (should be between 0 and 100)
    if (result.programExpPct != null && (result.programExpPct < 0 || result.programExpPct > 100)) result.programExpPct = null;
    if (result.adminExpPct != null && (result.adminExpPct < 0 || result.adminExpPct > 100)) result.adminExpPct = null;
    if (result.fundraisingExpPct != null && (result.fundraisingExpPct < 0 || result.fundraisingExpPct > 100)) result.fundraisingExpPct = null;

    // Only return if we got at least some useful data
    if (result.starRating != null || result.programExpPct != null) {
      return result;
    }
    return null;
  } catch (e) {
    console.error("Charity Navigator scrape failed:", e);
    return null;
  }
}

// ── Online review sources insertion ──────────────────────────────────

// deno-lint-ignore no-explicit-any
async function insertOnlineReviewSources(
  supabase: any,
  charityId: string,
  cnData: CNData | null,
  ein: string | null,
): Promise<void> {
  const einNoDash = ein ? ein.replace(/-/g, "") : null;

  const rows = [
    {
      charity_id: charityId,
      source_name: "charity_navigator",
      display_name: "Charity Navigator",
      rating: cnData?.starRating != null ? cnData.starRating : null,
      max_rating: 4,
      rating_scale: "numeric",
      review_count: cnData?.reviewCount ?? 0,
      source_url: einNoDash ? `https://www.charitynavigator.org/ein/${einNoDash}` : null,
      note: cnData?.starRating != null ? `${cnData.starRating} out of 4 stars` : null,
    },
    {
      charity_id: charityId,
      source_name: "guidestar",
      display_name: "GuideStar / Candid",
      rating: null,
      max_rating: 4,
      rating_scale: "seal",
      review_count: 0,
      source_url: einNoDash ? `https://www.guidestar.org/profile/${einNoDash}` : null,
      note: null,
    },
    {
      charity_id: charityId,
      source_name: "bbb_wise_giving",
      display_name: "BBB Wise Giving Alliance",
      rating: null,
      max_rating: 1,
      rating_scale: "pass_fail",
      review_count: 0,
      source_url: null,
      note: null,
    },
    {
      charity_id: charityId,
      source_name: "greatnonprofits",
      display_name: "GreatNonprofits",
      rating: null,
      max_rating: 5,
      rating_scale: "numeric",
      review_count: 0,
      source_url: einNoDash ? `https://greatnonprofits.org/org/${einNoDash}` : null,
      note: null,
    },
  ];

  const { error } = await supabase.from("online_review_sources").insert(rows);
  if (error) {
    console.error("Failed to insert online_review_sources:", error);
  }
}

// ── Missing fields check ────────────────────────────────────────────
// Only fields that we truly can't find online and need the charity to provide
function findMissingFields(charity: MappedCharity): string[] {
  const missing: string[] = [];
  if (charity.program_expense_percentage == null) missing.push("program_expense_percentage");
  if (charity.admin_expense_percentage == null) missing.push("admin_expense_percentage");
  if (charity.fundraising_expense_percentage == null) missing.push("fundraising_expense_percentage");
  if (charity.people_served_annually == null) missing.push("people_served_annually");
  if (!charity.programs_list) missing.push("programs_list");
  if (!charity.target_population) missing.push("target_population");
  if (!charity.annual_report_url) missing.push("annual_report_url");
  return missing;
}

// ── Requester notification email ─────────────────────────────────────

function buildRequesterNotificationHtml(
  charityName: string,
  score: number | null,
  siteUrl: string,
  charityId: string,
): string {
  const scoreHtml = score != null
    ? `<p style="margin:0 0 20px;color:#cbd5e1;font-size:15px;line-height:1.7;">
        Their GiveWiZe Score is <span style="color:#f97316;font-weight:600;">${score.toFixed(1)}/5.0</span>.
      </p>`
    : "";

  const profileUrl = `${siteUrl}/charity/${charityId}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${charityName} has been added to GiveWiZe</title>
</head>
<body style="margin:0;padding:0;background-color:#0f1225;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f1225;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.3);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1f3a 0%,#2d1b69 100%);padding:32px 40px;text-align:center;">
              <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">Give<span style="color:#f97316;">Wi</span>Ze</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#1e2340;padding:40px;">
              <p style="margin:0 0 20px;color:#f1f5f9;font-size:16px;line-height:1.6;">
                Great news!
              </p>
              <p style="margin:0 0 20px;color:#cbd5e1;font-size:15px;line-height:1.7;">
                The charity you requested, <span style="color:#ffffff;font-weight:600;">${charityName}</span>, has been verified and added to GiveWiZe.
              </p>
              ${scoreHtml}
              <p style="margin:0 0 28px;color:#cbd5e1;font-size:15px;line-height:1.7;">
                You can now view their full profile, compare them with other organizations, and share them with friends.
              </p>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td align="center" style="border-radius:9999px;background-color:#f97316;">
                    <a href="${profileUrl}" target="_blank" style="display:inline-block;padding:14px 36px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;border-radius:9999px;">
                      View Charity Profile
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.5;text-align:center;">
                Thank you for helping us grow our directory.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#161936;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">
                You received this because you requested a charity on GiveWiZe.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

async function notifyRequester(
  requesterEmail: string,
  charityName: string,
  score: number | null,
  charityId: string,
): Promise<boolean> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const siteUrl = Deno.env.get("SITE_URL") || "https://givewize.com";
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set, skipping requester notification");
    return false;
  }

  try {
    const html = buildRequesterNotificationHtml(charityName, score, siteUrl, charityId);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GiveWiZe <noreply@givewize.org>",
        to: requesterEmail,
        subject: `${charityName} has been added to GiveWiZe!`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Failed to notify requester:", err);
      return false;
    }
    console.log(`Requester notification sent to ${requesterEmail}`);
    return true;
  } catch (e) {
    console.error("Requester notification error:", e);
    return false;
  }
}

// ── Main handler ────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { charity_request_id } = await req.json();
    if (!charity_request_id) {
      return new Response(
        JSON.stringify({ error: "charity_request_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 1. Create admin Supabase client ─────────────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── 2. Fetch the charity request & set status = processing ──────
    const { data: request, error: fetchError } = await supabase
      .from("charity_requests")
      .select("*")
      .eq("id", charity_request_id)
      .single();

    if (fetchError || !request) {
      return new Response(
        JSON.stringify({ error: "Charity request not found", details: fetchError?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await supabase
      .from("charity_requests")
      .update({ status: "processing" })
      .eq("id", charity_request_id);

    // ── 3. Check for duplicate by EIN or name ───────────────────────
    let duplicateCharity = null;

    if (request.ein) {
      const { data: byEin } = await supabase
        .from("charities")
        .select("id, name, ein")
        .eq("ein", request.ein)
        .maybeSingle();
      if (byEin) duplicateCharity = byEin;
    }

    if (!duplicateCharity && request.charity_name) {
      const { data: byName } = await supabase
        .from("charities")
        .select("id, name, ein")
        .ilike("name", request.charity_name)
        .maybeSingle();
      if (byName) duplicateCharity = byName;
    }

    if (duplicateCharity) {
      await supabase
        .from("charity_requests")
        .update({
          status: "duplicate",
          admin_notes: `Duplicate of existing charity: ${duplicateCharity.name} (ID: ${duplicateCharity.id})`,
        })
        .eq("id", charity_request_id);

      return new Response(
        JSON.stringify({
          status: "duplicate",
          charity_name: duplicateCharity.name,
          message: `${duplicateCharity.name} is already listed on GiveWiZe. Check our directory to find them!`,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 4. Verify via ProPublica ────────────────────────────────────
    let propublicaData: PropublicaOrg | null = null;
    let verificationStatus: "verified" | "probable" | "unverified" = "unverified";

    // Try by EIN first
    if (request.ein) {
      try {
        const einClean = request.ein.replace(/-/g, "");
        const res = await fetch(
          `https://projects.propublica.org/nonprofits/api/v2/organizations/${einClean}.json`,
        );
        if (res.ok) {
          propublicaData = await res.json();
          verificationStatus = "verified";
        }
      } catch (e) {
        console.error("ProPublica EIN lookup failed:", e);
      }
    }

    // Fallback: search by name
    if (!propublicaData && request.charity_name) {
      try {
        const res = await fetch(
          `https://projects.propublica.org/nonprofits/api/v2/search.json?q=${encodeURIComponent(request.charity_name)}`,
        );
        if (res.ok) {
          const searchResult = await res.json();
          const orgs = searchResult.organizations ?? [];
          if (orgs.length > 0) {
            // Fetch full details for the top result
            const topEin = orgs[0].ein;
            if (topEin) {
              const detailRes = await fetch(
                `https://projects.propublica.org/nonprofits/api/v2/organizations/${topEin}.json`,
              );
              if (detailRes.ok) {
                propublicaData = await detailRes.json();
                verificationStatus = "probable";
              }
            }
          }
        }
      } catch (e) {
        console.error("ProPublica name search failed:", e);
      }
    }

    await supabase
      .from("charity_requests")
      .update({ verification_status: verificationStatus })
      .eq("id", charity_request_id);

    // ── 5. Gather data — map ProPublica to charities schema ─────────
    let mappedCharity: MappedCharity;

    if (propublicaData) {
      mappedCharity = mapPropublicaToCharity(propublicaData);
    } else {
      // Build from request data alone
      mappedCharity = {
        name: request.charity_name ?? "Unknown Organization",
        ein: formatEin(request.ein),
        city: null,
        state: null,
        country: request.country ?? "USA",
        headquarters: null,
        year_founded: null,
        website: null,
        mission_statement: null,
        full_description: null,
        program_expense_percentage: null,
        admin_expense_percentage: null,
        fundraising_expense_percentage: null,
        complete_990_filed: false,
        financials_published: false,
        primary_category: "community-development",
        geographic_scope: "national",
        annual_report_url: null,
        people_served_annually: null,
        target_population: null,
        programs_list: null,
        logo_url: null,
      };
    }

    // Merge fields from the original request
    if (request.charity_website) {
      mappedCharity.website = request.charity_website;
    }
    // Prefer the user-submitted name (the common/public name) over
    // ProPublica's legal corporate name (e.g. "charity: water" vs "Charity Global Inc")
    if (request.charity_name) {
      const oldName = mappedCharity.name;
      mappedCharity.name = request.charity_name;
      // Also fix the full_description if it references the legal name
      if (mappedCharity.full_description && oldName !== request.charity_name) {
        mappedCharity.full_description = mappedCharity.full_description.replace(oldName, request.charity_name);
      }
    }

    // ── 5b. Parallel enrichment: website + Charity Navigator ────────
    const pipelineStart = Date.now();
    let cnData: CNData | null = null;
    let websiteScraped: WebsiteScrapResult = {};
    let enrichmentMetrics: EnrichmentMetrics = {
      used_claude: false,
      fields_extracted: [],
      fallback_used: false,
      duration_ms: 0,
    };

    {
      const enrichmentPromises: Promise<void>[] = [];

      // Scrape charity website
      if (mappedCharity.website) {
        enrichmentPromises.push(
          scrapeWebsite(mappedCharity.website).then(({ result, enrichmentMetrics: m }) => {
            websiteScraped = result;
            enrichmentMetrics = m;
          }),
        );
      }

      // Scrape Charity Navigator for expense data and star rating
      if (mappedCharity.ein) {
        enrichmentPromises.push(
          scrapeCharityNavigator(mappedCharity.ein).then((result) => {
            cnData = result;
          }),
        );
      }

      await Promise.all(enrichmentPromises);
    }

    // Merge website scrape data
    if (websiteScraped.mission && !mappedCharity.mission_statement) {
      mappedCharity.mission_statement = websiteScraped.mission;
    }
    if (websiteScraped.description) {
      if (!mappedCharity.mission_statement) {
        mappedCharity.mission_statement = websiteScraped.description;
      }
      if (!mappedCharity.full_description) {
        mappedCharity.full_description = websiteScraped.description;
      } else if (websiteScraped.description.length > 50) {
        mappedCharity.full_description = websiteScraped.description + " " + mappedCharity.full_description;
      }
    }
    if (websiteScraped.programs && !mappedCharity.programs_list) {
      mappedCharity.programs_list = websiteScraped.programs;
    }
    if (websiteScraped.targetPopulation && !mappedCharity.target_population) {
      mappedCharity.target_population = websiteScraped.targetPopulation;
    }
    if (websiteScraped.logoUrl) {
      mappedCharity.logo_url = websiteScraped.logoUrl;
    }
    if (websiteScraped.annualReportUrl && !mappedCharity.annual_report_url) {
      mappedCharity.annual_report_url = websiteScraped.annualReportUrl;
    }

    // Merge Charity Navigator expense data (fills the biggest gap)
    if (cnData) {
      if (cnData.programExpPct != null && mappedCharity.program_expense_percentage == null) {
        mappedCharity.program_expense_percentage = Math.round(cnData.programExpPct * 10) / 10;
      }
      if (cnData.adminExpPct != null && mappedCharity.admin_expense_percentage == null) {
        mappedCharity.admin_expense_percentage = Math.round(cnData.adminExpPct * 10) / 10;
      }
      if (cnData.fundraisingExpPct != null && mappedCharity.fundraising_expense_percentage == null) {
        mappedCharity.fundraising_expense_percentage = Math.round(cnData.fundraisingExpPct * 10) / 10;
      }
    }

    // Check if there's submitted info-request data to merge
    const { data: infoReqData } = await supabase
      .from("charity_info_requests")
      .select("submitted_data")
      .eq("charity_request_id", charity_request_id)
      .eq("status", "submitted")
      .maybeSingle();

    if (infoReqData?.submitted_data) {
      const submitted = infoReqData.submitted_data as Record<string, unknown>;
      if (submitted.mission_statement && !mappedCharity.mission_statement)
        mappedCharity.mission_statement = submitted.mission_statement as string;
      if (submitted.full_description && !mappedCharity.full_description)
        mappedCharity.full_description = submitted.full_description as string;
      if (submitted.primary_category && mappedCharity.primary_category === "community-development")
        mappedCharity.primary_category = submitted.primary_category as string;
      if (submitted.year_founded && !mappedCharity.year_founded)
        mappedCharity.year_founded = submitted.year_founded as number;
      if (submitted.program_expense_percentage && !mappedCharity.program_expense_percentage)
        mappedCharity.program_expense_percentage = submitted.program_expense_percentage as number;
      if (submitted.admin_expense_percentage && !mappedCharity.admin_expense_percentage)
        mappedCharity.admin_expense_percentage = submitted.admin_expense_percentage as number;
      if (submitted.fundraising_expense_percentage && !mappedCharity.fundraising_expense_percentage)
        mappedCharity.fundraising_expense_percentage = submitted.fundraising_expense_percentage as number;
      if (submitted.website && !mappedCharity.website)
        mappedCharity.website = submitted.website as string;
      if (submitted.people_served_annually && !mappedCharity.people_served_annually)
        mappedCharity.people_served_annually = submitted.people_served_annually as number;
      if (submitted.target_population && !mappedCharity.target_population)
        mappedCharity.target_population = submitted.target_population as string;
      if (submitted.programs_list && !mappedCharity.programs_list)
        mappedCharity.programs_list = submitted.programs_list as string[];
      if (submitted.annual_report_url && !mappedCharity.annual_report_url)
        mappedCharity.annual_report_url = submitted.annual_report_url as string;
      if (submitted.geographic_scope)
        mappedCharity.geographic_scope = submitted.geographic_scope as string;
    }

    // ── 6. Score ────────────────────────────────────────────────────
    // Don't let scraped program headings alone generate an impact score —
    // only count programs_list for impact if people_served_annually is also set
    const scoringInput: CharityLike = {
      ...mappedCharity,
      programs_list: mappedCharity.people_served_annually != null
        ? mappedCharity.programs_list
        : null,
    };
    const scores = computeGivewizeScores(scoringInput);

    // ── 6b. Agent 2: Quality review ─────────────────────────────────
    const { review, metrics: reviewMetrics } = await reviewProfileWithClaude(
      mappedCharity,
      scores,
      verificationStatus,
    );

    let reviewOverrodeDecision = false;
    if (review) {
      console.log(`Agent 2: Quality=${review.overall_quality}, Confidence=${review.confidence_score}, RedFlags=${review.red_flags.length}`);

      // Override category if Agent 2 says it's wrong
      if (!review.category_correct && review.suggested_category) {
        console.log(`Agent 2: Overriding category from "${mappedCharity.primary_category}" to "${review.suggested_category}"`);
        mappedCharity.primary_category = review.suggested_category;
        reviewMetrics.category_overridden = true;
      }

      // Override to needs_review if quality is poor or confidence is very low
      if (review.overall_quality === "poor" || review.confidence_score < 40) {
        reviewOverrodeDecision = true;
      }
    }

    // ── Compute data completeness ───────────────────────────────────
    const allFields = [
      mappedCharity.mission_statement,
      mappedCharity.full_description,
      mappedCharity.program_expense_percentage,
      mappedCharity.admin_expense_percentage,
      mappedCharity.fundraising_expense_percentage,
      mappedCharity.programs_list,
      mappedCharity.target_population,
      mappedCharity.people_served_annually,
      mappedCharity.annual_report_url,
      mappedCharity.logo_url,
      mappedCharity.website,
      mappedCharity.year_founded,
    ];
    const dataCompleteness = Math.round(
      (allFields.filter((f) => f != null && f !== undefined).length / allFields.length) * 100,
    ) / 100;

    // ── 7. Decide ───────────────────────────────────────────────────
    const hasNameAndCategory =
      !!mappedCharity.name &&
      mappedCharity.name !== "Unknown Organization" &&
      !!mappedCharity.primary_category;

    const isVerifiedOrProbable =
      verificationStatus === "verified" || verificationStatus === "probable";

    const missingFields = findMissingFields(mappedCharity);

    let decision: string;

    // Build review summary for admin_notes
    const reviewNotes = review
      ? `AI Review: quality=${review.overall_quality}, confidence=${review.confidence_score}` +
        (review.red_flags.length > 0 ? `, flags=[${review.red_flags.join("; ")}]` : "") +
        (review.suggestions.length > 0 ? `, suggestions=[${review.suggestions.join("; ")}]` : "") +
        (reviewMetrics.category_overridden ? `, category overridden to ${mappedCharity.primary_category}` : "")
      : "";

    // Build pipeline_metrics (populated incrementally, finalized before each update)
    const buildPipelineMetrics = () => ({
      agent1_enrichment: {
        used_claude: enrichmentMetrics.used_claude,
        fields_extracted: enrichmentMetrics.fields_extracted,
        fallback_used: enrichmentMetrics.fallback_used,
        duration_ms: enrichmentMetrics.duration_ms,
      },
      agent2_review: {
        overall_quality: reviewMetrics.overall_quality,
        confidence_score: reviewMetrics.confidence_score,
        red_flags: reviewMetrics.red_flags,
        category_overridden: reviewMetrics.category_overridden,
        duration_ms: reviewMetrics.duration_ms,
      },
      agent3_email: null as { used_claude: boolean; fallback_used: boolean; duration_ms: number } | null,
      total_pipeline_ms: Date.now() - pipelineStart,
      data_completeness: dataCompleteness,
    });

    if (verificationStatus === "unverified") {
      // ── Flag for review — unverified organization ───────────────
      await supabase
        .from("charity_requests")
        .update({
          status: "needs_review",
          computed_scores: scores,
          verification_status: verificationStatus,
          propublica_data: propublicaData,
          admin_notes: `Flagged for manual review: unverified organization. ${reviewNotes}`.trim(),
          pipeline_metrics: buildPipelineMetrics(),
        })
        .eq("id", charity_request_id);

      decision = "needs_review";
    } else if (reviewOverrodeDecision) {
      // ── Agent 2 flagged as poor quality / low confidence ────────
      await supabase
        .from("charity_requests")
        .update({
          status: "needs_review",
          computed_scores: scores,
          verification_status: verificationStatus,
          propublica_data: propublicaData,
          admin_notes: `Flagged by AI Quality Review: ${reviewNotes}`.trim(),
          pipeline_metrics: buildPipelineMetrics(),
        })
        .eq("id", charity_request_id);

      decision = "needs_review";
    } else if (isVerifiedOrProbable && hasNameAndCategory) {
      // ── Auto-approve: profile is complete enough ────────────────
      const { data: inserted, error: insertError } = await supabase
        .from("charities")
        .insert({
          name: mappedCharity.name,
          ein: mappedCharity.ein,
          city: mappedCharity.city,
          state: mappedCharity.state,
          country: mappedCharity.country,
          headquarters: mappedCharity.headquarters,
          year_founded: mappedCharity.year_founded,
          website: mappedCharity.website,
          mission_statement: mappedCharity.mission_statement,
          full_description: mappedCharity.full_description,
          program_expense_percentage: mappedCharity.program_expense_percentage,
          admin_expense_percentage: mappedCharity.admin_expense_percentage,
          fundraising_expense_percentage: mappedCharity.fundraising_expense_percentage,
          complete_990_filed: mappedCharity.complete_990_filed,
          financials_published: mappedCharity.financials_published,
          primary_category: mappedCharity.primary_category,
          geographic_scope: mappedCharity.geographic_scope,
          annual_report_url: mappedCharity.annual_report_url,
          people_served_annually: mappedCharity.people_served_annually,
          target_population: mappedCharity.target_population,
          programs_list: mappedCharity.programs_list,
          logo_url: mappedCharity.logo_url,
          accepts_direct_donation: websiteScraped.hasDonateButton ?? true,
          allows_donation_tracking: false,
          allows_donor_recipient_contact: false,
          offers_donor_perks: false,
          score_financial_efficiency: scores.financial_efficiency,
          score_transparency: scores.transparency,
          score_longevity: scores.longevity,
          score_impact: scores.impact,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Failed to insert charity:", insertError);
        decision = "needs_review";
        await supabase
          .from("charity_requests")
          .update({
            status: "needs_review",
            admin_notes: `Auto-approve insert failed: ${insertError.message}`,
            pipeline_metrics: buildPipelineMetrics(),
          })
          .eq("id", charity_request_id);
      } else {
        // ── 8. Post-insert: online review sources + community rating ──
        const charityId = inserted.id;

        // Insert 4 online_review_sources rows (CN, GuideStar, BBB, GNP)
        await insertOnlineReviewSources(supabase, charityId, cnData, mappedCharity.ein);

        // Compute initial community_rating_average from CN star rating
        if (cnData?.starRating != null) {
          // Normalize CN 0-4 scale to 0-5 scale
          const normalized = (cnData.starRating / 4) * 5;
          const rounded = Math.round(normalized * 100) / 100;
          await supabase
            .from("charities")
            .update({
              community_rating_average: rounded,
              community_rating_count: 1,
            })
            .eq("id", charityId);
        }

        // ── 9. Email charity about remaining missing fields ──────────
        let emailSent = false;
        if (missingFields.length > 0 && request.charity_contact_email) {
          try {
            const emailRes = await fetch(
              `${supabaseUrl}/functions/v1/send-info-request`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${supabaseServiceKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  charity_request_id,
                  contact_email: request.charity_contact_email,
                  missing_fields: missingFields,
                  charity_name: mappedCharity.name,
                  mission_statement: mappedCharity.mission_statement,
                  programs_list: mappedCharity.programs_list,
                }),
              },
            );
            if (emailRes.ok) {
              emailSent = true;
              // Capture Agent 3 metrics from response
              try {
                const emailData = await emailRes.json();
                if (emailData.agent3_metrics) {
                  const pm = buildPipelineMetrics();
                  pm.agent3_email = emailData.agent3_metrics;
                  pm.total_pipeline_ms = Date.now() - pipelineStart;
                  // Update pipeline_metrics with agent3 data
                  await supabase
                    .from("charity_requests")
                    .update({ pipeline_metrics: pm })
                    .eq("id", charity_request_id);
                }
              } catch { /* response already consumed or parse error — non-critical */ }
              console.log(`Info request email sent to ${request.charity_contact_email}`);
            } else {
              const errData = await emailRes.json();
              console.error("send-info-request failed:", errData);
            }
          } catch (e) {
            console.error("Failed to invoke send-info-request:", e);
          }
        }

        // ── 10. Notify requester via email (if they provided one) ──────
        let requesterNotified = false;
        if (request.requester_email) {
          requesterNotified = await notifyRequester(
            request.requester_email,
            mappedCharity.name,
            scores.overall,
            charityId,
          );
        }

        decision = "auto_approved";
        const notes = [`Auto-approved. Charity ID: ${charityId}. Score: ${scores.overall}`];
        if (reviewNotes) notes.push(reviewNotes);
        if (emailSent) notes.push(`Info request emailed to ${request.charity_contact_email} for: ${missingFields.join(", ")}`);
        else if (missingFields.length > 0 && !request.charity_contact_email) notes.push(`Missing data (${missingFields.join(", ")}) but no contact email`);
        if (requesterNotified) notes.push(`Requester notified at ${request.requester_email}`);

        await supabase
          .from("charity_requests")
          .update({
            status: "auto_approved",
            auto_approved: true,
            charity_id: charityId,
            computed_scores: scores,
            verification_status: verificationStatus,
            propublica_data: propublicaData,
            admin_notes: notes.join(". "),
            pipeline_metrics: buildPipelineMetrics(),
          })
          .eq("id", charity_request_id);

        return new Response(
          JSON.stringify({
            status: "auto_approved",
            charity_name: mappedCharity.name,
            score: scores.overall,
            charity_id: charityId,
            email_sent: emailSent,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    } else {
      // ── Fallback: flag for manual review ────────────────────────
      await supabase
        .from("charity_requests")
        .update({
          status: "needs_review",
          computed_scores: scores,
          verification_status: verificationStatus,
          propublica_data: propublicaData,
          admin_notes: (missingFields.length > 0
            ? `Missing data (${missingFields.join(", ")}) but no contact email to request info`
            : "Flagged for manual review") + (reviewNotes ? `. ${reviewNotes}` : ""),
          pipeline_metrics: buildPipelineMetrics(),
        })
        .eq("id", charity_request_id);

      decision = "needs_review";
    }

    return new Response(
      JSON.stringify({
        status: decision,
        charity_name: mappedCharity.name,
        score: scores.overall,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("process-charity-request error:", err);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: err instanceof Error ? err.message : String(err),
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
