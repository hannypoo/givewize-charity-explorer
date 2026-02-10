export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type?: "cards" | "scale";
  options?: { id: string; label: string }[];
  multiSelect?: boolean;
  maxSelections?: number;
  scaleLabels?: { low: string; high: string };
  tier: 1 | 2 | 3;
}

export interface QuizTier {
  tier: 1 | 2 | 3;
  label: string;
  specificity: string;
  questionCount: number;
}

export const QUIZ_TIERS: QuizTier[] = [
  { tier: 1, label: "Quick Match", specificity: "Somewhat specific", questionCount: 3 },
  { tier: 2, label: "Refined Match", specificity: "Specific", questionCount: 3 },
  { tier: 3, label: "Deep Match", specificity: "Very specific", questionCount: 2 },
];

/** First question index for a given tier (0-based) */
export function tierStartIndex(tier: 1 | 2 | 3): number {
  if (tier === 1) return 0;
  if (tier === 2) return 3;
  return 6; // tier 3
}

/** Last question index (inclusive) for a given tier */
export function tierEndIndex(tier: 1 | 2 | 3): number {
  if (tier === 1) return 2;
  if (tier === 2) return 5;
  return 7; // tier 3
}

export const quizQuestions: QuizQuestion[] = [
  // ── Tier 1: Quick Match (3 Qs) ──
  {
    id: "causes",
    question: "What causes matter most to you?",
    subtitle: "Select up to 3",
    type: "cards",
    multiSelect: true,
    maxSelections: 3,
    tier: 1,
    options: [
      { id: "rare-diseases", label: "Rare Diseases" },
      { id: "medical-health", label: "Medical & Health" },
      { id: "education", label: "Education" },
      { id: "hunger-food-security", label: "Hunger & Food Security" },
      { id: "animal-welfare", label: "Animal Welfare" },
      { id: "child-welfare", label: "Children & Youth" },
      { id: "environment-climate", label: "Environment & Climate" },
      { id: "emergency-relief", label: "Emergency Relief" },
      { id: "disability-services", label: "Disability Rights" },
      { id: "human-rights", label: "Human Rights" },
    ],
  },
  {
    id: "geographic",
    question: "What geographic impact do you prefer?",
    type: "cards",
    tier: 1,
    options: [
      { id: "local", label: "Local" },
      { id: "national", label: "National" },
      { id: "global", label: "Global" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "keyFactors",
    question: "Which factors matter most to you?",
    subtitle: "Select up to 3",
    type: "cards",
    multiSelect: true,
    maxSelections: 3,
    tier: 1,
    options: [
      { id: "high-efficiency", label: "High Efficiency" },
      { id: "transparency", label: "Transparency" },
      { id: "community-ratings", label: "Community Ratings" },
      { id: "annual-reports", label: "Annual Reports" },
      { id: "established", label: "Established Org" },
      { id: "global-reach", label: "Global Reach" },
    ],
  },
  // ── Tier 2: Refined Match (3 Qs) ──
  {
    id: "efficiency",
    question: "How important is financial efficiency to you?",
    subtitle: "How much of each dollar goes directly to programs",
    type: "scale",
    tier: 2,
    scaleLabels: { low: "Not important", high: "Very important" },
  },
  {
    id: "orgSize",
    question: "What size organization do you prefer?",
    type: "cards",
    tier: 2,
    options: [
      { id: "large", label: "Large (100K+ served)" },
      { id: "medium", label: "Medium" },
      { id: "small", label: "Small & personal" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "transparency",
    question: "What transparency matters most to you?",
    type: "cards",
    tier: 2,
    options: [
      { id: "financial", label: "Financial reports" },
      { id: "impact", label: "Impact metrics" },
      { id: "programs", label: "Program updates" },
      { id: "all", label: "All equally important" },
    ],
  },
  // ── Tier 3: Deep Match (2 Qs) ──
  {
    id: "age",
    question: "What's your organization age preference?",
    type: "cards",
    tier: 3,
    options: [
      { id: "established", label: "Established (10+ years)" },
      { id: "growing", label: "Growing (5-10 years)" },
      { id: "new", label: "New (under 5 years)" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "taxBenefits",
    question: "How important are tax benefits?",
    subtitle: "Getting a tax deduction for your donation",
    type: "scale",
    tier: 3,
    scaleLabels: { low: "Not important", high: "Very important" },
  },
];
