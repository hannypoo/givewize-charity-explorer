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
  donorExperience?: string[];
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
  if (!active) return { score: 0.5, active: false, baseWeight: 5 };

  const allCategories = [charity.primary_category, ...(charity.secondary_categories || [])];
  const matchCount = causes!.filter(c => allCategories.includes(c)).length;
  const score = matchCount > 0 ? Math.min(1.0, 0.7 + matchCount * 0.15) : 0.0;
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
  if (!active) return { score: 0.5, active: false, baseWeight: 3 };
  const pep = Number(charity.program_expense_percentage) || 0;
  if (pep === 0) return { score: 0.1, active: true, baseWeight: 3 };
  // Scale: 50%→0, 75%→0.5, 90%+→1.0, amplified by user preference
  const normalized = Math.min(1, Math.max(0, (pep - 50) / 45));
  const weight = efficiencyPref! / 5;
  return { score: normalized * weight + (1 - weight) * 0.5, active: true, baseWeight: 3 };
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
  if (!transparencyPref) return { score: 0.5, active: false, baseWeight: 3 };
  if (transparencyPref === "all") {
    let tp = 0;
    if (charity.complete_990_filed) tp++;
    if (charity.financials_published) tp++;
    if (charity.people_served_annually) tp++;
    if (charity.programs_list && charity.programs_list.length > 0) tp++;
    return { score: tp / 4, active: true, baseWeight: 3 };
  }
  let s = 0.1;
  if (transparencyPref === "financial" && charity.financials_published) s = 1;
  else if (transparencyPref === "impact" && charity.people_served_annually) s = 1;
  else if (transparencyPref === "programs" && charity.programs_list && charity.programs_list.length > 0) s = 1;
  return { score: s, active: true, baseWeight: 3 };
}

function scoreAge(charity: Charity, agePref: string | undefined): DimensionResult {
  const active = !!agePref && agePref !== "no-preference";
  if (!active) return { score: 0.5, active: false, baseWeight: 2.5 };
  const charityAge = charity.year_founded ? new Date().getFullYear() - charity.year_founded : 0;
  let s = 0.15;
  if (agePref === "established" && charityAge >= 10) s = 1;
  else if (agePref === "growing" && charityAge >= 5 && charityAge < 10) s = 1;
  else if (agePref === "new" && charityAge < 5) s = 1;
  // Partial credit for close matches
  else if (agePref === "established" && charityAge >= 5) s = 0.5;
  else if (agePref === "growing" && charityAge >= 3) s = 0.4;
  return { score: s, active: true, baseWeight: 2.5 };
}

function scoreOrgSize(charity: Charity, sizePref: string | undefined): DimensionResult {
  const active = !!sizePref && sizePref !== "no-preference";
  if (!active) return { score: 0.5, active: false, baseWeight: 3 };
  const psa = charity.people_served_annually || 0;
  let s = 0.1;
  if (sizePref === "large" && psa >= 100000) s = 1;
  else if (sizePref === "medium" && psa >= 10000 && psa < 100000) s = 1;
  else if (sizePref === "small" && psa < 10000 && psa > 0) s = 1;
  // Partial credit for adjacent sizes
  else if (sizePref === "large" && psa >= 50000) s = 0.5;
  else if (sizePref === "medium" && (psa >= 5000 || psa >= 100000)) s = 0.4;
  else if (sizePref === "small" && psa === 0) s = 0.6; // unknown size, might be small
  return { score: s, active: true, baseWeight: 3 };
}

function scoreDonorExperience(charity: Charity, features: string[] | undefined): DimensionResult {
  const active = !!features && features.length > 0;
  if (!active) return { score: 0.5, active: false, baseWeight: 3 };
  let matches = 0;
  if (features!.includes("donation-tracking") && charity.allows_donation_tracking) matches++;
  if (features!.includes("donor-perks") && charity.offers_donor_perks) matches++;
  if (features!.includes("recipient-contact") && charity.allows_donor_recipient_contact) matches++;
  if (features!.includes("annual-reports") && charity.annual_report_url) matches++;
  return { score: matches / features!.length, active: true, baseWeight: 3 };
}

function generateWhyMatch(charity: Charity, answers: QuizAnswers): string {
  const reasons: string[] = [];

  if (answers.causes?.includes(charity.primary_category)) {
    reasons.push(`matches your interest in ${charity.primary_category.replace(/-/g, " ")}`);
  } else if (answers.causes?.some(c => (charity.secondary_categories || []).includes(c))) {
    const matched = answers.causes!.filter(c => (charity.secondary_categories || []).includes(c));
    reasons.push(`also works in ${matched[0].replace(/-/g, " ")}`);
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
  if (answers.donorExperience?.length) {
    const featureHits: string[] = [];
    if (answers.donorExperience.includes("donation-tracking") && charity.allows_donation_tracking) featureHits.push("donation tracking");
    if (answers.donorExperience.includes("donor-perks") && charity.offers_donor_perks) featureHits.push("donor perks");
    if (answers.donorExperience.includes("recipient-contact") && charity.allows_donor_recipient_contact) featureHits.push("recipient contact");
    if (featureHits.length > 0) reasons.push(`offers ${featureHits.join(" and ")}`);
  }

  if (reasons.length === 0) {
    reasons.push("aligns with your overall giving preferences");
  }

  const sentence = reasons.slice(0, 3).join(", ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

// Fewer results as specificity increases
const RESULTS_PER_TIER: Record<number, number> = { 1: 8, 2: 5, 3: 3 };

export async function matchCharities(answers: QuizAnswers, tier: 1 | 2 | 3 = 1): Promise<MatchedCharity[]> {
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
      scoreDonorExperience(charity, answers.donorExperience),
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
  const limit = RESULTS_PER_TIER[tier] || 8;
  const top = scored.slice(0, limit);

  // Absolute match percentage: raw score scaled by tier confidence.
  // Fewer answered questions → percentages compressed toward center (less certainty).
  // More answered questions → wider spread reflecting true match quality.
  const confidence: Record<number, number> = { 1: 0.3, 2: 0.65, 3: 1.0 };
  const conf = confidence[tier] || 1;
  const center = 72;

  return top.map((s) => ({
    charity: s.charity,
    matchPercent: Math.round(
      Math.min(97, Math.max(45, center + (s.rawScore * 100 - center) * conf)),
    ),
    whyMatch: s.whyMatch,
  }));
}
