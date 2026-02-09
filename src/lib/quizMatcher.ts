import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Charity = Tables<"charities">;

export interface QuizAnswers {
  causes?: string[];
  geographic?: string;
  personal?: string[];
  efficiency?: number;
  age?: string;
  transparency?: string;
  engagement?: string;
  taxBenefits?: number;
  orgSize?: string;
  keyFactors?: string[];
  employerMatch?: string;
}

export interface MatchedCharity {
  charity: Charity;
  matchPercent: number;
  whyMatch: string;
}

function scoreCategory(charity: Charity, causes: string[]): number {
  if (!causes || causes.length === 0) return 0.5;
  return causes.includes(charity.primary_category) ? 1.0 : 0.0;
}

function scoreGeographic(charity: Charity, geo: string | undefined): number {
  if (!geo || geo === "no-preference") return 0.5;
  return charity.geographic_scope === geo ? 1.0 : 0.2;
}

function scoreFinancialEfficiency(charity: Charity, efficiencyPref: number | undefined): number {
  if (!efficiencyPref || efficiencyPref <= 1) return 0.5;
  const pep = Number(charity.program_expense_percentage) || 0;
  if (pep === 0) return 0.3;
  const normalized = Math.min(1, pep / 100);
  const weight = efficiencyPref / 5;
  return normalized * weight + (1 - weight) * 0.5;
}

function scoreKeyFactors(charity: Charity, factors: string[] | undefined): number {
  if (!factors || factors.length === 0) return 0.5;
  let matches = 0;
  if (factors.includes("high-efficiency") && Number(charity.program_expense_percentage) >= 80) matches++;
  if (factors.includes("transparency") && charity.complete_990_filed && charity.financials_published) matches++;
  if (factors.includes("community-ratings") && Number(charity.community_rating_average) >= 4.0) matches++;
  if (factors.includes("annual-reports") && charity.annual_report_url) matches++;
  if (factors.includes("established") && charity.year_founded && (new Date().getFullYear() - charity.year_founded) >= 20) matches++;
  if (factors.includes("global-reach") && charity.geographic_scope === "global") matches++;
  return factors.length > 0 ? matches / factors.length : 0.5;
}

function scoreTransparencyAgeLongevity(
  charity: Charity,
  agePref: string | undefined,
  transparencyPref: string | undefined,
  taxPref: number | undefined,
  sizePref: string | undefined
): number {
  let score = 0;
  let count = 0;

  // Age preference
  if (agePref && agePref !== "no-preference") {
    count++;
    const charityAge = charity.year_founded ? new Date().getFullYear() - charity.year_founded : 0;
    if (agePref === "established" && charityAge >= 10) score += 1;
    else if (agePref === "growing" && charityAge >= 5 && charityAge < 10) score += 1;
    else if (agePref === "new" && charityAge < 5) score += 1;
    else score += 0.3;
  }

  // Transparency preference
  if (transparencyPref && transparencyPref !== "all") {
    count++;
    if (transparencyPref === "financial" && charity.financials_published) score += 1;
    else if (transparencyPref === "impact" && charity.people_served_annually) score += 1;
    else if (transparencyPref === "programs" && charity.programs_list && charity.programs_list.length > 0) score += 1;
    else score += 0.3;
  } else if (transparencyPref === "all") {
    count++;
    let tp = 0;
    if (charity.complete_990_filed) tp++;
    if (charity.financials_published) tp++;
    if (charity.people_served_annually) tp++;
    if (charity.programs_list && charity.programs_list.length > 0) tp++;
    score += tp / 4;
  }

  // Tax benefits preference
  if (taxPref && taxPref >= 3) {
    count++;
    score += charity.ein ? 1 : 0;
  }

  // Organization size preference
  if (sizePref && sizePref !== "no-preference") {
    count++;
    const psa = charity.people_served_annually || 0;
    if (sizePref === "large" && psa >= 100000) score += 1;
    else if (sizePref === "medium" && psa >= 10000 && psa < 100000) score += 1;
    else if (sizePref === "small" && psa < 10000 && psa > 0) score += 1;
    else score += 0.3;
  }

  return count > 0 ? score / count : 0.5;
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
  if (Number(charity.score_overall) >= 4.0) {
    reasons.push(`high GiveWiZe score of ${Number(charity.score_overall).toFixed(1)}`);
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
    const catScore = scoreCategory(charity, answers.causes || []);
    const geoScore = scoreGeographic(charity, answers.geographic);
    const finScore = scoreFinancialEfficiency(charity, answers.efficiency);
    const factorScore = scoreKeyFactors(charity, answers.keyFactors);
    const comboScore = scoreTransparencyAgeLongevity(
      charity, answers.age, answers.transparency, answers.taxBenefits, answers.orgSize
    );

    const totalScore =
      catScore * 0.30 +
      geoScore * 0.15 +
      finScore * 0.15 +
      factorScore * 0.15 +
      comboScore * 0.25;

    const matchPercent = Math.round(Math.min(99, Math.max(50, totalScore * 100)));

    return {
      charity,
      matchPercent,
      whyMatch: generateWhyMatch(charity, answers),
    };
  });

  scored.sort((a, b) => b.matchPercent - a.matchPercent);
  return scored.slice(0, 8);
}
