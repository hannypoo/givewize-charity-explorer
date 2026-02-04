// Script to generate SQL insert statements from the charity data
// Run this in the browser console or as a utility

import charitiesData from "./charities-import.json";

interface RawCharity {
  id: string;
  basic: {
    name: string;
    ein?: string;
    website?: string;
    year_founded?: string | number;
    logo_url?: string;
  };
  classification: {
    primary_category: string;
    mission_statement?: string;
    geographic_scope?: string;
  };
  location?: {
    headquarters?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  programs?: {
    full_description?: string;
    programs_list?: string[];
    target_population?: string;
    people_served_annually?: string | number;
  };
  financials?: {
    program_expenses?: { percentage?: number | null };
    admin_expenses?: { percentage?: number | null };
    fundraising_expenses?: { percentage?: number | null };
    program_expense_percentage?: number | null;
    administrative_expense_percentage?: number | null;
    fundraising_expense_percentage?: number | null;
  };
  transparency?: {
    complete_990_filed?: boolean | null;
    annual_report_url?: string | null;
    financials_published?: boolean | null;
  };
  scores?: {
    givewize_algorithm?: {
      overall?: number | null;
      financial_efficiency?: number | null;
      transparency?: number | null;
      longevity?: number | null;
      impact?: number | null;
    };
    community_rating?: {
      average?: number | null;
      review_count?: number | null;
    };
  };
}

const categoryMap: Record<string, string> = {
  "RARE DISEASES": "rare-diseases",
  "MEDICAL & HEALTH": "medical-health",
  "MEDICAL/HEALTH": "medical-health",
  "EDUCATION": "education",
  "HUNGER & FOOD SECURITY": "hunger-food-security",
  "HUNGER/FOOD SECURITY": "hunger-food-security",
  "ANIMAL WELFARE": "animal-welfare",
  "CHILD WELFARE": "child-welfare",
  "ENVIRONMENT & CLIMATE": "environment-climate",
  "ENVIRONMENT/CLIMATE": "environment-climate",
  "EMERGENCY RELIEF": "emergency-relief",
  "HOUSING & HOMELESSNESS": "housing-homelessness",
  "MENTAL HEALTH": "mental-health",
  "VETERANS": "veterans",
  "ARTS & CULTURE": "arts-culture",
  "HUMAN RIGHTS": "human-rights",
  "DISABILITY SERVICES": "disability-services",
  "SENIOR SERVICES": "senior-services",
  "COMMUNITY DEVELOPMENT": "community-development",
  "FAITH-BASED": "faith-based",
  "INTERNATIONAL DEVELOPMENT": "international-development",
};

const scopeMap: Record<string, string> = {
  "Global": "global",
  "National": "national", 
  "Local": "local",
  "Regional": "national",
};

function parseYearFounded(value: string | number | undefined): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  const match = value.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

function parsePeopleServed(value: string | number | undefined): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  const cleaned = value.replace(/[,+]/g, "");
  const match = cleaned.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function parsePercentage(
  financials: RawCharity["financials"],
  field: "program" | "admin" | "fundraising"
): number | null {
  if (!financials) return null;
  
  if (field === "program") {
    return financials.program_expenses?.percentage ?? financials.program_expense_percentage ?? null;
  }
  if (field === "admin") {
    return financials.admin_expenses?.percentage ?? financials.administrative_expense_percentage ?? null;
  }
  if (field === "fundraising") {
    return financials.fundraising_expenses?.percentage ?? financials.fundraising_expense_percentage ?? null;
  }
  return null;
}

function isValidUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.includes(".") && !url.toLowerCase().includes("contact") && !url.toLowerCase().includes("to be")) {
    return `https://${url}`;
  }
  return null;
}

function isValidLogoUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.toLowerCase().includes("contact") || url.toLowerCase().includes("to be")) return null;
  return isValidUrl(url);
}

function isValidAnnualReportUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.toLowerCase().includes("not publicly") || url.toLowerCase().includes("contact")) return null;
  return isValidUrl(url);
}

export function getTransformedCharities() {
  const rawCharities = (charitiesData as { charities: RawCharity[] }).charities;
  
  return rawCharities.map((charity) => {
    const catKey = charity.classification.primary_category.toUpperCase();
    const primaryCategory = (categoryMap[catKey] || "medical-health") as "rare-diseases" | "medical-health" | "education" | "hunger-food-security" | "animal-welfare" | "child-welfare" | "environment-climate" | "emergency-relief" | "housing-homelessness" | "mental-health" | "veterans" | "arts-culture" | "human-rights" | "disability-services" | "senior-services" | "community-development" | "faith-based" | "international-development";
    const geographicScope = (scopeMap[charity.classification.geographic_scope || "National"] || "national") as "local" | "national" | "global";
    
    return {
      name: charity.basic.name,
      ein: charity.basic.ein?.includes("verify") || charity.basic.ein?.includes("collected") ? null : charity.basic.ein || null,
      website: isValidUrl(charity.basic.website),
      year_founded: parseYearFounded(charity.basic.year_founded),
      logo_url: isValidLogoUrl(charity.basic.logo_url),
      primary_category: primaryCategory,
      geographic_scope: geographicScope,
      mission_statement: charity.classification.mission_statement || null,
      headquarters: charity.location?.headquarters || null,
      city: charity.location?.city === "N/A" ? null : charity.location?.city || null,
      state: charity.location?.state === "N/A" ? null : charity.location?.state || null,
      country: charity.location?.country || "USA",
      full_description: charity.programs?.full_description || null,
      programs_list: charity.programs?.programs_list || null,
      target_population: charity.programs?.target_population || null,
      people_served_annually: parsePeopleServed(charity.programs?.people_served_annually),
      program_expense_percentage: parsePercentage(charity.financials, "program"),
      admin_expense_percentage: parsePercentage(charity.financials, "admin"),
      fundraising_expense_percentage: parsePercentage(charity.financials, "fundraising"),
      complete_990_filed: charity.transparency?.complete_990_filed ?? null,
      annual_report_url: isValidAnnualReportUrl(charity.transparency?.annual_report_url),
      financials_published: charity.transparency?.financials_published ?? null,
      score_overall: charity.scores?.givewize_algorithm?.overall ?? null,
      score_financial_efficiency: charity.scores?.givewize_algorithm?.financial_efficiency ?? null,
      score_transparency: charity.scores?.givewize_algorithm?.transparency ?? null,
      score_longevity: charity.scores?.givewize_algorithm?.longevity ?? null,
      score_impact: charity.scores?.givewize_algorithm?.impact ?? null,
      community_rating_average: charity.scores?.community_rating?.average ?? null,
      community_rating_count: charity.scores?.community_rating?.review_count ?? 0,
    };
  });
}
