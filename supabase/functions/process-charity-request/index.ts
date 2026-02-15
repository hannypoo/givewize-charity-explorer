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
  };
}

// ── Website scraping ────────────────────────────────────────────────

async function scrapeWebsite(url: string): Promise<{
  mission?: string;
  description?: string;
  programs?: string[];
  targetPopulation?: string;
}> {
  const result: {
    mission?: string;
    description?: string;
    programs?: string[];
    targetPopulation?: string;
  } = {};

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "GiveWiZe Charity Bot/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return result;

    const html = await res.text();

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

    // Look for mission statement patterns in page text
    // Strip HTML tags for text search
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");

    // Look for "our mission" or "mission statement" sections
    const missionPatterns = [
      /(?:our\s+mission|mission\s+statement)[:\s]+([^.]+\.[^.]*\.)/i,
      /(?:our\s+mission|mission\s+statement)[:\s]+([^.]+\.)/i,
      /mission[:\s]+(?:to\s+)([^.]+\.)/i,
    ];
    for (const pattern of missionPatterns) {
      const match = textContent.match(pattern);
      if (match?.[1] && match[1].length > 20 && match[1].length < 500) {
        result.mission = match[1].trim();
        break;
      }
    }

    // Look for programs/services in list items near keywords
    const programSection = textContent.match(
      /(?:programs?|services?|what\s+we\s+do|our\s+work)[:\s]+([\s\S]{50,800}?)(?:learn\s+more|read\s+more|contact|donate|©)/i
    );
    if (programSection?.[1]) {
      // Try to split into individual programs
      const lines = programSection[1]
        .split(/[•\-–—|]|\d+\.\s/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5 && s.length < 100);
      if (lines.length >= 2) {
        result.programs = lines.slice(0, 10);
      }
    }

    // Look for target population
    const popPatterns = [
      /(?:we\s+serve|serving|helping|supporting)\s+([^.]{10,100})/i,
      /(?:target\s+population|who\s+we\s+serve)[:\s]+([^.]+\.)/i,
    ];
    for (const pattern of popPatterns) {
      const match = textContent.match(pattern);
      if (match?.[1] && match[1].length > 10) {
        result.targetPopulation = match[1].trim();
        break;
      }
    }
  } catch (e) {
    console.error("Website scrape failed:", e);
  }

  return result;
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

    // ── 5b. Scrape the charity website for missing data ───────────
    if (mappedCharity.website) {
      const scraped = await scrapeWebsite(mappedCharity.website);
      if (scraped.mission && !mappedCharity.mission_statement) {
        mappedCharity.mission_statement = scraped.mission;
      }
      if (scraped.description) {
        if (!mappedCharity.mission_statement) {
          mappedCharity.mission_statement = scraped.description;
        }
        if (!mappedCharity.full_description) {
          mappedCharity.full_description = scraped.description;
        } else if (scraped.description.length > 50) {
          // Prepend website description to the ProPublica-generated one
          mappedCharity.full_description = scraped.description + " " + mappedCharity.full_description;
        }
      }
      if (scraped.programs && !mappedCharity.programs_list) {
        mappedCharity.programs_list = scraped.programs;
      }
      if (scraped.targetPopulation && !mappedCharity.target_population) {
        mappedCharity.target_population = scraped.targetPopulation;
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
    const scores = computeGivewizeScores(mappedCharity);

    // ── 7. Decide ───────────────────────────────────────────────────
    const hasNameAndCategory =
      !!mappedCharity.name &&
      mappedCharity.name !== "Unknown Organization" &&
      !!mappedCharity.primary_category;

    const isVerifiedOrProbable =
      verificationStatus === "verified" || verificationStatus === "probable";

    const missingFields = findMissingFields(mappedCharity);

    let decision: string;

    if (verificationStatus === "unverified") {
      // ── Flag for review — unverified organization ───────────────
      await supabase
        .from("charity_requests")
        .update({
          status: "needs_review",
          computed_scores: scores,
          verification_status: verificationStatus,
          propublica_data: propublicaData,
          admin_notes: "Flagged for manual review: unverified organization",
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
          })
          .eq("id", charity_request_id);
      } else {
        decision = "auto_approved";
        await supabase
          .from("charity_requests")
          .update({
            status: "auto_approved",
            auto_approved: true,
            charity_id: inserted.id,
            computed_scores: scores,
            verification_status: verificationStatus,
            propublica_data: propublicaData,
            admin_notes: `Auto-approved. Charity ID: ${inserted.id}. Score: ${scores.overall}`,
          })
          .eq("id", charity_request_id);

        return new Response(
          JSON.stringify({
            status: "auto_approved",
            charity_name: mappedCharity.name,
            score: scores.overall,
            charity_id: inserted.id,
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
          admin_notes: missingFields.length > 0
            ? `Missing data (${missingFields.join(", ")}) but no contact email to request info`
            : "Flagged for manual review",
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
