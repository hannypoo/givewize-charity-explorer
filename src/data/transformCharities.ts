import charitiesData from "./charities-import.json";

// Map primary_category values to database enum values
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

// Map geographic scope to database enum
const scopeMap: Record<string, string> = {
  "Global": "global",
  "National": "national",
  "Local": "local",
  "Regional": "national",
};

interface RawCharity {
  id: string;
  starred?: boolean;
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

function parseYearFounded(value: string | number | undefined): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  const match = value.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

function parsePeopleServed(value: string | number | undefined): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  // Extract first number from string like "30,000,000+"
  const cleaned = value.replace(/[,+]/g, "");
  const match = cleaned.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function parsePercentage(
  financials: RawCharity["financials"],
  field: "program" | "admin" | "fundraising"
): number | null {
  if (!financials) return null;
  
  // Try nested object first
  if (field === "program") {
    const nested = financials.program_expenses?.percentage;
    const flat = financials.program_expense_percentage;
    return nested ?? flat ?? null;
  }
  if (field === "admin") {
    const nested = financials.admin_expenses?.percentage;
    const flat = financials.administrative_expense_percentage;
    return nested ?? flat ?? null;
  }
  if (field === "fundraising") {
    const nested = financials.fundraising_expenses?.percentage;
    const flat = financials.fundraising_expense_percentage;
    return nested ?? flat ?? null;
  }
  return null;
}

function isValidUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.includes(".")) {
    return `https://${url}`;
  }
  return null;
}

function isValidLogoUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  // Skip placeholder text
  if (url.toLowerCase().includes("contact") || url.toLowerCase().includes("to be")) {
    return null;
  }
  return isValidUrl(url);
}

function isValidAnnualReportUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  // Skip placeholder text
  if (url.toLowerCase().includes("not publicly") || url.toLowerCase().includes("contact")) {
    return null;
  }
  return isValidUrl(url);
}

export function transformCharities() {
  const rawCharities = (charitiesData as { charities: RawCharity[] }).charities;
  
  return rawCharities.map((charity) => {
    const primaryCategory = categoryMap[charity.classification.primary_category.toUpperCase()] || "medical-health";
    const geographicScope = scopeMap[charity.classification.geographic_scope || "National"] || "national";
    
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

// Export for use in import script
export const transformedCharities = transformCharities();
