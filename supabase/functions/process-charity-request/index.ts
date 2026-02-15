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
  K: "hunger-food-security",
  L: "housing-homelessness",
  O: "child-welfare",
  Q: "international-development",
  X: "faith-based",
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

interface PropublicaOrg {
  organization?: {
    name?: string;
    ein?: string;
    city?: string;
    state?: string;
    ntee_code?: string;
    ruling_date?: string;
    subsection_code?: number;
    [key: string]: unknown;
  };
  filings_with_data?: Array<{
    totfuncexpns?: number;
    totprgmrevnue?: number;
    totrevenue?: number;
    pct_compnsatncurrofcrs?: number;
    tax_prd_yr?: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

interface MappedCharity {
  name: string;
  ein: string | null;
  city: string | null;
  state: string | null;
  country: string;
  year_founded: number | null;
  program_expense_percentage: number | null;
  admin_expense_percentage: number | null;
  fundraising_expense_percentage: number | null;
  complete_990_filed: boolean;
  financials_published: boolean;
  primary_category: string;
  geographic_scope: string;
  mission_statement: string | null;
}

function mapPropublicaToCharity(data: PropublicaOrg): MappedCharity {
  const org = data.organization ?? {};
  const filings = data.filings_with_data ?? [];
  // Latest filing is the first in the array
  const latest = filings.length > 0 ? filings[0] : null;

  // Parse year_founded from ruling_date (format: "YYYY-MM" or "YYYY-MM-DD" or just year)
  let yearFounded: number | null = null;
  if (org.ruling_date) {
    const parsed = parseInt(String(org.ruling_date).substring(0, 4), 10);
    if (!isNaN(parsed) && parsed > 1800 && parsed <= new Date().getFullYear()) {
      yearFounded = parsed;
    }
  }

  // Compute expense percentages from latest filing
  let programExpPct: number | null = null;
  let adminExpPct: number | null = null;
  let fundraisingExpPct: number | null = null;

  if (latest && latest.totfuncexpns && latest.totfuncexpns > 0) {
    const totalExpenses = latest.totfuncexpns;

    // ProPublica filings may include program service expenses directly
    if (latest.totprgmrevnue != null) {
      // totprgmrevnue in ProPublica context often maps to program service expenses
      // but the actual field for program expenses varies; use the ratio if available
      const programExp = latest.totprgmrevnue;
      if (programExp > 0 && programExp <= totalExpenses) {
        programExpPct = Math.round((programExp / totalExpenses) * 100);
      }
    }

    // Admin percentage from officer compensation ratio
    if (latest.pct_compnsatncurrofcrs != null) {
      adminExpPct = Math.round(latest.pct_compnsatncurrofcrs * 100) / 100;
    }

    // Fundraising = remainder (rough estimate)
    if (programExpPct != null && adminExpPct != null) {
      fundraisingExpPct = Math.max(0, 100 - programExpPct - adminExpPct);
    }
  }

  // Determine geographic scope
  const name = org.name ?? "Unknown Organization";
  const nteeCode = org.ntee_code ?? "";
  let geographicScope = "national";
  if (
    name.toLowerCase().includes("international") ||
    nteeCode.toUpperCase().startsWith("Q")
  ) {
    geographicScope = "global";
  }

  // Mission statement from latest filing (if available)
  const missionStatement: string | null =
    (latest as Record<string, unknown>)?.mission ?? null;

  return {
    name,
    ein: org.ein ? String(org.ein) : null,
    city: org.city ?? null,
    state: org.state ?? null,
    country: "USA",
    year_founded: yearFounded,
    program_expense_percentage: programExpPct,
    admin_expense_percentage: adminExpPct,
    fundraising_expense_percentage: fundraisingExpPct,
    complete_990_filed: filings.length > 0,
    financials_published: filings.length > 0,
    primary_category: nteeToCategorySlug(nteeCode),
    geographic_scope: geographicScope,
    mission_statement:
      typeof missionStatement === "string" ? missionStatement : null,
  };
}

// ── Missing fields check ────────────────────────────────────────────

function findMissingFields(charity: MappedCharity): string[] {
  const missing: string[] = [];
  if (!charity.mission_statement) missing.push("mission_statement");
  // website is not returned by ProPublica, so it is always "missing" unless
  // the original request contained one -- the caller should merge before checking.
  missing.push("website");
  if (!charity.primary_category || charity.primary_category === "community-development") {
    // community-development is the fallback, could be genuinely correct but
    // we flag it so a human can confirm
    missing.push("primary_category");
  }
  if (charity.program_expense_percentage == null)
    missing.push("program_expense_percentage");
  if (charity.year_founded == null) missing.push("year_founded");
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
        ein: request.ein ?? null,
        city: null,
        state: null,
        country: request.country ?? "USA",
        year_founded: null,
        program_expense_percentage: null,
        admin_expense_percentage: null,
        fundraising_expense_percentage: null,
        complete_990_filed: false,
        financials_published: false,
        primary_category: "community-development",
        geographic_scope: "national",
        mission_statement: null,
      };
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
      if (submitted.mission_statement && !mappedCharity.mission_statement) {
        mappedCharity.mission_statement = submitted.mission_statement as string;
      }
      if (submitted.primary_category && mappedCharity.primary_category === "community-development") {
        mappedCharity.primary_category = submitted.primary_category as string;
      }
      if (submitted.year_founded && !mappedCharity.year_founded) {
        mappedCharity.year_founded = submitted.year_founded as number;
      }
      if (submitted.program_expense_percentage && !mappedCharity.program_expense_percentage) {
        mappedCharity.program_expense_percentage = submitted.program_expense_percentage as number;
      }
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

    let decision: string;

    if (isVerifiedOrProbable && scores.overall >= 2.0 && hasNameAndCategory) {
      // ── Auto-approve: insert into charities table ─────────────────
      const { data: inserted, error: insertError } = await supabase
        .from("charities")
        .insert({
          name: mappedCharity.name,
          ein: mappedCharity.ein,
          city: mappedCharity.city,
          state: mappedCharity.state,
          country: mappedCharity.country,
          year_founded: mappedCharity.year_founded,
          program_expense_percentage: mappedCharity.program_expense_percentage,
          admin_expense_percentage: mappedCharity.admin_expense_percentage,
          fundraising_expense_percentage: mappedCharity.fundraising_expense_percentage,
          complete_990_filed: mappedCharity.complete_990_filed,
          financials_published: mappedCharity.financials_published,
          primary_category: mappedCharity.primary_category,
          geographic_scope: mappedCharity.geographic_scope,
          mission_statement: mappedCharity.mission_statement,
          score_financial_efficiency: scores.financial_efficiency,
          score_transparency: scores.transparency,
          score_longevity: scores.longevity,
          score_impact: scores.impact,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Failed to insert charity:", insertError);
        await supabase
          .from("charity_requests")
          .update({
            status: "needs_review",
            admin_notes: `Auto-approve insert failed: ${insertError.message}`,
          })
          .eq("id", charity_request_id);

        decision = "needs_review";
      } else {
        await supabase
          .from("charity_requests")
          .update({
            status: "auto_approved",
            auto_approved: true,
            admin_notes: `Auto-approved. Charity ID: ${inserted.id}. GiveWiZe Score: ${scores.overall}`,
          })
          .eq("id", charity_request_id);

        decision = "auto_approved";

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
    } else if (scores.overall < 2.0 || verificationStatus === "unverified") {
      // ── Flag for review ───────────────────────────────────────────
      const reasons: string[] = [];
      if (scores.overall < 2.0) reasons.push(`low score (${scores.overall})`);
      if (verificationStatus === "unverified") reasons.push("unverified organization");

      await supabase
        .from("charity_requests")
        .update({
          status: "needs_review",
          admin_notes: `Flagged for manual review: ${reasons.join(", ")}`,
        })
        .eq("id", charity_request_id);

      decision = "needs_review";
    } else {
      // ── Request info if missing critical data & contact available ──
      const missingFields = findMissingFields(mappedCharity);
      const contactEmail = request.charity_contact_email ?? null;

      if (missingFields.length > 0 && contactEmail) {
        // Invoke send-info-request edge function
        try {
          await supabase.functions.invoke("send-info-request", {
            body: {
              charity_request_id,
              contact_email: contactEmail,
              charity_name: mappedCharity.name,
              missing_fields: missingFields,
            },
          });
        } catch (e) {
          console.error("Failed to invoke send-info-request:", e);
        }

        await supabase
          .from("charity_requests")
          .update({
            status: "needs_info",
            admin_notes: `Requested additional info for: ${missingFields.join(", ")}`,
          })
          .eq("id", charity_request_id);

        decision = "needs_info";
      } else {
        // No contact email or no missing fields, flag for review
        await supabase
          .from("charity_requests")
          .update({
            status: "needs_review",
            admin_notes: missingFields.length > 0
              ? `Missing data (${missingFields.join(", ")}) but no contact email to request info`
              : "Flagged for manual review",
          })
          .eq("id", charity_request_id);

        decision = "needs_review";
      }
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
