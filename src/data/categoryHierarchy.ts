export interface CategoryGroup {
  label: string;
  subcategories: { value: string; label: string }[];
}

export const categoryHierarchy: CategoryGroup[] = [
  {
    label: "Health & Medical",
    subcategories: [
      { value: "rare-diseases", label: "Rare Diseases" },
      { value: "medical-health", label: "Medical & Health" },
      { value: "mental-health", label: "Mental Health" },
    ],
  },
  {
    label: "Human Services",
    subcategories: [
      { value: "child-welfare", label: "Child Welfare" },
      { value: "senior-services", label: "Senior Services" },
      { value: "disability-services", label: "Disability Services" },
      { value: "veterans", label: "Veterans" },
      { value: "housing-homelessness", label: "Housing & Homelessness" },
    ],
  },
  {
    label: "Environment & Animals",
    subcategories: [
      { value: "environment-climate", label: "Environment & Climate" },
      { value: "animal-welfare", label: "Animal Welfare" },
    ],
  },
  {
    label: "Education & Development",
    subcategories: [
      { value: "education", label: "Education" },
      { value: "community-development", label: "Community Development" },
      { value: "international-development", label: "International Development" },
    ],
  },
  {
    label: "Basic Needs",
    subcategories: [
      { value: "hunger-food-security", label: "Hunger & Food Security" },
      { value: "emergency-relief", label: "Emergency Relief" },
    ],
  },
  {
    label: "Culture & Rights",
    subcategories: [
      { value: "arts-culture", label: "Arts & Culture" },
      { value: "human-rights", label: "Human Rights" },
      { value: "faith-based", label: "Faith-Based" },
    ],
  },
];

export function getAllSubcategoryValues(): string[] {
  return categoryHierarchy.flatMap((g) => g.subcategories.map((s) => s.value));
}
