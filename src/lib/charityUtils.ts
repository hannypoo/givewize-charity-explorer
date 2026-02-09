import type { Tables } from "@/integrations/supabase/types";

type Charity = Tables<"charities">;

// ── Compute GiveWiZe scores client-side from raw data ─────────────────
export interface ComputedScores {
  financial_efficiency: number;
  transparency: number;
  longevity: number;
  impact: number;
  overall: number;
}

export function computeGivewizeScores(charity: Charity): ComputedScores {
  // Financial Efficiency (0-5)
  let fe = 2.5;
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

  // Transparency (0-5)
  let tp = 0;
  const validEin = charity.ein && !charity.ein.includes("verify") && !charity.ein.includes("contact");
  if (validEin) tp += 1.0;
  if (charity.complete_990_filed) tp += 1.0;
  if (charity.financials_published) tp += 1.0;
  if (charity.annual_report_url) tp += 1.25;
  if (charity.program_expense_percentage != null) tp += 0.75;
  tp = Math.min(5, tp);

  // Longevity (0-5)
  let lg = 2.5;
  if (charity.year_founded) {
    const age = new Date().getFullYear() - charity.year_founded;
    if (age >= 50) lg = 5.0;
    else if (age >= 30) lg = 4.5;
    else if (age >= 20) lg = 4.0;
    else if (age >= 10) lg = 3.5;
    else if (age >= 5) lg = 3.0;
    else lg = 2.0;
  }

  // Impact (0-5)
  let imp = 2.0;
  if (charity.people_served_annually != null) {
    const ps = charity.people_served_annually;
    if (ps >= 1000000) imp = 5.0;
    else if (ps >= 500000) imp = 4.5;
    else if (ps >= 100000) imp = 4.0;
    else if (ps >= 10000) imp = 3.5;
    else if (ps >= 1000) imp = 3.0;
    else if (ps >= 100) imp = 2.5;
    else imp = 2.0;
  }
  if (charity.programs_list && charity.programs_list.length >= 8) imp = Math.min(5, imp + 0.5);
  else if (charity.programs_list && charity.programs_list.length >= 4) imp = Math.min(5, imp + 0.25);

  // Overall: weighted average (Financial 35%, Transparency 25%, Impact 25%, Longevity 15%)
  const overall = fe * 0.35 + tp * 0.25 + imp * 0.25 + lg * 0.15;

  return {
    financial_efficiency: Math.round(fe * 10) / 10,
    transparency: Math.round(tp * 10) / 10,
    longevity: Math.round(lg * 10) / 10,
    impact: Math.round(imp * 10) / 10,
    overall: Math.round(overall * 10) / 10,
  };
}

export function getGivewizeScore(charity: Charity): number {
  if (charity.score_overall != null) return Number(charity.score_overall);
  return computeGivewizeScores(charity).overall;
}

export function getCombinedRating(charity: Charity): number | null {
  const givewize = getGivewizeScore(charity);
  const community = charity.community_rating_average != null ? Number(charity.community_rating_average) : null;

  if (community != null) {
    return givewize * 0.6 + community * 0.4;
  }
  return givewize;
}

export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    "rare-diseases": "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #C4B5FD 100%)",
    "medical-health": "linear-gradient(135deg, #DC2626 0%, #F87171 50%, #FCA5A5 100%)",
    "education": "linear-gradient(135deg, #2563EB 0%, #60A5FA 50%, #93C5FD 100%)",
    "hunger-food-security": "linear-gradient(135deg, #D97706 0%, #FBBF24 50%, #FDE68A 100%)",
    "animal-welfare": "linear-gradient(135deg, #059669 0%, #34D399 50%, #6EE7B7 100%)",
    "child-welfare": "linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)",
    "environment-climate": "linear-gradient(135deg, #16A34A 0%, #4ADE80 50%, #86EFAC 100%)",
    "emergency-relief": "linear-gradient(135deg, #EA580C 0%, #FB923C 50%, #FDBA74 100%)",
    "housing-homelessness": "linear-gradient(135deg, #0891B2 0%, #22D3EE 50%, #67E8F9 100%)",
    "mental-health": "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #DDD6FE 100%)",
    "veterans": "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #93C5FD 100%)",
    "arts-culture": "linear-gradient(135deg, #BE185D 0%, #F472B6 50%, #FBCFE8 100%)",
    "human-rights": "linear-gradient(135deg, #B91C1C 0%, #EF4444 50%, #FCA5A5 100%)",
    "disability-services": "linear-gradient(135deg, #0D9488 0%, #2DD4BF 50%, #99F6E4 100%)",
    "senior-services": "linear-gradient(135deg, #92400E 0%, #D97706 50%, #FDE68A 100%)",
    "community-development": "linear-gradient(135deg, #4338CA 0%, #818CF8 50%, #C7D2FE 100%)",
    "faith-based": "linear-gradient(135deg, #7E22CE 0%, #A855F7 50%, #D8B4FE 100%)",
    "international-development": "linear-gradient(135deg, #0E7490 0%, #06B6D4 50%, #67E8F9 100%)",
  };
  return gradients[category] || "linear-gradient(135deg, #2563EB 0%, #60A5FA 50%, #93C5FD 100%)";
}

export const categoryLabels: Record<string, string> = {
  "rare-diseases": "Rare Diseases",
  "medical-health": "Medical & Health",
  "education": "Education",
  "hunger-food-security": "Hunger & Food Security",
  "animal-welfare": "Animal Welfare",
  "child-welfare": "Child Welfare",
  "environment-climate": "Environment & Climate",
  "emergency-relief": "Emergency Relief",
  "housing-homelessness": "Housing & Homelessness",
  "mental-health": "Mental Health",
  "veterans": "Veterans",
  "arts-culture": "Arts & Culture",
  "human-rights": "Human Rights",
  "disability-services": "Disability Services",
  "senior-services": "Senior Services",
  "community-development": "Community Development",
  "faith-based": "Faith-Based",
  "international-development": "International Development",
};

export const scopeLabels: Record<string, string> = {
  local: "Local",
  national: "National",
  global: "Global",
};

export function getKeyStandoutBadge(charity: Charity): { label: string; color: string } | null {
  if (charity.program_expense_percentage != null && charity.program_expense_percentage >= 80) {
    return { label: "High Efficiency", color: "bg-emerald-100 text-emerald-800" };
  }
  const score = getGivewizeScore(charity);
  if (score >= 4.0) {
    return { label: "Top Rated", color: "bg-blue-100 text-blue-800" };
  }
  if (charity.community_rating_average != null && Number(charity.community_rating_average) >= 4.0) {
    return { label: "Community Favorite", color: "bg-amber-100 text-amber-800" };
  }
  if (charity.ein) {
    return { label: "Tax Deductible", color: "bg-sky-100 text-sky-800" };
  }
  return null;
}
