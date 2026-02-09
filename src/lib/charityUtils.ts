import type { Tables } from "@/integrations/supabase/types";

type Charity = Tables<"charities">;

export function getCombinedRating(charity: Charity): number | null {
  const givewize = charity.score_overall != null ? Number(charity.score_overall) : null;
  const community = charity.community_rating_average != null ? Number(charity.community_rating_average) : null;

  if (givewize != null && community != null) {
    return givewize * 0.6 + community * 0.4;
  }
  if (givewize != null) return givewize;
  if (community != null) return community;
  return null;
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
  if (charity.score_overall != null && Number(charity.score_overall) >= 4.0) {
    return { label: "Top Rated", color: "bg-blue-100 text-blue-800" };
  }
  if (charity.community_rating_average != null && Number(charity.community_rating_average) >= 4.0) {
    return { label: "Community Favorite", color: "bg-amber-100 text-amber-800" };
  }
  if (charity.complete_990_filed && charity.financials_published) {
    return { label: "Transparent", color: "bg-purple-100 text-purple-800" };
  }
  if (charity.ein) {
    return { label: "Tax Deductible", color: "bg-sky-100 text-sky-800" };
  }
  return null;
}
