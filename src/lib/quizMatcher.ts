import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { getGivewizeScore } from "@/lib/charityUtils";

type Charity = Tables<"charities">;

export interface QuizAnswers {
  causes?: string[];
  geographic?: string;
  efficiency?: number;
  age?: string;
  transparency?: string;
  taxBenefits?: number;
  orgSize?: string;
  keyFactors?: string[];
}

export interface MatchedCharity {
  charity: Charity;
  matchPercent: number;
  whyMatch: string;
}

// Each scoring dimension returns 0–1 and reports whether it was actually answered
interface DimensionResult {
  score: number;
  active: boolean; // true if the user answered this dimension
  baseWeight: number; // how important this dimension is relative to others
}

function scoreCategory(charity: Charity, causes: string[] | undefined): DimensionResult {
  const active = !!causes && causes.length > 0;
  const score = active
    ? (causes!.includes(charity.primary_category) ? 1.0 : 0.0)
    : 0.5;
  return { score, active, baseWeight: 5 };
}

function scoreGeographic(charity: Charity, geo: string | undefined): DimensionResult {
  const active = !!geo && geo !== "no-preference";
  const score = active
    ? (charity.geographic_scope === geo ? 1.0 : 0.2)
    : 0.5;
  return { score, active, baseWeight: 3 };
}

function scoreFinancialEfficiency(charity: Charity, efficiencyPref: number | undefined): DimensionResult {
  const active = !!efficiencyPref && efficiencyPref > 1;
  if (!active) return { score: 0.5, active: false, baseWeight: 2 };
  const pep = Number(charity.program_expense_percentage) || 0;
  if (pep === 0) return { score: 0.3, active: true, baseWeight: 2 };
  const normalized = Math.min(1, pep / 100);
  const weight = efficiencyPref! / 5;
  return { score: normalized * weight + (1 - weight) * 0.5, active: true, baseWeight: 2 };
}

function scoreKeyFactors(charity: Charity, factors: string[] | undefined): DimensionResult {
  const active = !!factors && factors.length > 0;
  if (!active) return { score: 0.5, active: false, baseWeight: 3 };
  let matches = 0;
  if (factors!.includes("high-efficiency") && Number(charity.program_expense_percentage) >= 80) matches++;
  if (factors!.includes("transparency") && charity.complete_990_filed && charity.financials_published) matches++;
  if (factors!.includes("community-ratings") && Number(charity.community_rating_average) >= 4.0) matches++;
  if (factors!.includes("annual-reports") && charity.annual_report_url) matches++;
  if (factors!.includes("established") && charity.year_founded && (new Date().getFullYear() - charity.year_founded) >= 20) matches++;
  if (factors!.includes("global-reach") && charity.geographic_scope === "global") matches++;
  return { score: matches / factors!.length, active: true, baseWeight: 3 };
}

function scoreTransparency(charity: Charity, transparencyPref: string | undefined): DimensionResult {
  if (!transparencyPref) return { score: 0.5, active: false, baseWeight: 2 };
  if (transparencyPref === "all") {
    let tp = 0;
    if (charity.complete_990_filed) tp++;
    if (charity.financials_published) tp++;
    if (charity.people_served_annually) tp++;
    if (charity.programs_list && charity.programs_list.length > 0) tp++;
    return { score: tp / 4, active: true, baseWeight: 2 };
  }
  let s = 0.3;
  if (transparencyPref === "financial" && charity.financials_published) s = 1;
  else if (transparencyPref === "impact" && charity.people_served_annually) s = 1;
  else if (transparencyPref === "programs" && charity.programs_list && charity.programs_list.length > 0) s = 1;
  return { score: s, active: true, baseWeight: 2 };
}

function scoreAge(charity: Charity, agePref: string | undefined): DimensionResult {
  const active = !!agePref && agePref !== "no-preference";
  if (!active) return { score: 0.5, active: false, baseWeight: 2 };
  const charityAge = charity.year_founded ? new Date().getFullYear() - charity.year_founded : 0;
  let s = 0.3;
  if (agePref === "established" && charityAge >= 10) s = 1;
  else if (agePref === "growing" && charityAge >= 5 && charityAge < 10) s = 1;
  else if (agePref === "new" && charityAge < 5) s = 1;
  return { score: s, active: true, baseWeight: 2 };
}

function scoreOrgSize(charity: Charity, sizePref: string | undefined): DimensionResult {
  const active = !!sizePref && sizePref !== "no-preference";
  if (!active) return { score: 0.5, active: false, baseWeight: 2 };
  const psa = charity.people_served_annually || 0;
  let s = 0.3;
  if (sizePref === "large" && psa >= 100000) s = 1;
  else if (sizePref === "medium" && psa >= 10000 && psa < 100000) s = 1;
  else if (sizePref === "small" && psa < 10000 && psa > 0) s = 1;
  return { score: s, active: true, baseWeight: 2 };
}

function generateWhyMatch(charity: Charity, answers: QuizAnswers): string {
  const reasons: string[] = [];

  if (answers.causes?.includes(charity.primary_category)) {
    reasons.push(`matches your interest in ${charity.primary_category.replace(/-/g, " ")}`);
  }
  if (answers.geographic && answers.geographic !== "no-preference" && charity.geographic_scope === answers.geographic) {
    reasons.push(`aligns with your ${charity.geographic_scope} impact preference`);
  }
  if (Number(charity.program_expense_percentage) >= 80) {
    reasons.push(`${charity.program_expense_percentage}% of funds go directly to programs`);
  }
  const givewizeScore = getGivewizeScore(charity);
  if (givewizeScore >= 4.0) {
    reasons.push(`high GiveWiZe score of ${givewizeScore.toFixed(1)}`);
  }
  if (charity.complete_990_filed && charity.financials_published) {
    reasons.push("strong financial transparency");
  }

  if (reasons.length === 0) {
    reasons.push("aligns with your overall giving preferences");
  }

  const sentence = reasons.slice(0, 3).join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

export async function matchCharities(answers: QuizAnswers): Promise<MatchedCharity[]> {
  const { data: charities, error } = await supabase
    .from("charities")
    .select("*");

  if (error || !charities) return [];

  const scored = charities.map((charity) => {
    const dimensions: DimensionResult[] = [
      scoreCategory(charity, answers.causes),
      scoreGeographic(charity, answers.geographic),
      scoreFinancialEfficiency(charity, answers.efficiency),
      scoreKeyFactors(charity, answers.keyFactors),
      scoreTransparency(charity, answers.transparency),
      scoreAge(charity, answers.age),
      scoreOrgSize(charity, answers.orgSize),
    ];

    // Quality score — always contributes as a tiebreaker
    const gwScore = getGivewizeScore(charity);
    const qualityDim: DimensionResult = { score: gwScore / 5, active: true, baseWeight: 1.5 };
    dimensions.push(qualityDim);

    // Dynamic weighting: only active (answered) dimensions get their full weight.
    // Inactive dimensions get a tiny weight so they don't dominate.
    let totalWeight = 0;
    let weightedSum = 0;
    for (const dim of dimensions) {
      const w = dim.active ? dim.baseWeight : 0.1;
      weightedSum += dim.score * w;
      totalWeight += w;
    }

    const rawScore = totalWeight > 0 ? weightedSum / totalWeight : 0.5;

    return {
      charity,
      rawScore,
      whyMatch: generateWhyMatch(charity, answers),
    };
  });

  scored.sort((a, b) => b.rawScore - a.rawScore);
  const top = scored.slice(0, 8);

  // Normalize against ALL charities for a meaningful spread
  const allScores = scored.map((s) => s.rawScore);
  const maxAll = Math.max(...allScores);
  const minAll = Math.min(...allScores);
  const range = maxAll - minAll || 0.01;

  return top.map((s) => ({
    charity: s.charity,
    matchPercent: Math.round(55 + ((s.rawScore - minAll) / range) * 40),
    whyMatch: s.whyMatch,
  }));
}
