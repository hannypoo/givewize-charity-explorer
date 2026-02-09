export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type?: "cards" | "scale";
  options?: { id: string; label: string }[];
  multiSelect?: boolean;
  maxSelections?: number;
  scaleLabels?: { low: string; high: string };
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "causes",
    question: "What causes matter most to you?",
    subtitle: "Select up to 3",
    type: "cards",
    multiSelect: true,
    maxSelections: 3,
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
    options: [
      { id: "local", label: "Local" },
      { id: "national", label: "National" },
      { id: "global", label: "Global" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "personal",
    question: "Have you been personally affected by...",
    subtitle: "Select all that apply",
    type: "cards",
    multiSelect: true,
    options: [
      { id: "medical-condition", label: "A medical condition" },
      { id: "rare-disease", label: "A rare disease" },
      { id: "food-insecurity", label: "Food insecurity" },
      { id: "natural-disaster", label: "A natural disaster" },
      { id: "none", label: "None of the above" },
    ],
  },
  {
    id: "efficiency",
    question: "How important is financial efficiency to you?",
    subtitle: "How much of each dollar goes directly to programs",
    type: "scale",
    scaleLabels: { low: "Not important", high: "Very important" },
  },
  {
    id: "age",
    question: "What's your organization age preference?",
    type: "cards",
    options: [
      { id: "established", label: "Established (10+ years)" },
      { id: "growing", label: "Growing (5-10 years)" },
      { id: "new", label: "New (under 5 years)" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "transparency",
    question: "What transparency matters most to you?",
    type: "cards",
    options: [
      { id: "financial", label: "Financial reports" },
      { id: "impact", label: "Impact metrics" },
      { id: "programs", label: "Program updates" },
      { id: "all", label: "All equally important" },
    ],
  },
  {
    id: "engagement",
    question: "How do you want to engage?",
    type: "cards",
    options: [
      { id: "donate-once", label: "Donate once" },
      { id: "recurring", label: "Recurring giving" },
      { id: "volunteer", label: "Volunteer" },
      { id: "advocacy", label: "Advocacy" },
    ],
  },
  {
    id: "taxBenefits",
    question: "How important are tax benefits?",
    subtitle: "Getting a tax deduction for your donation",
    type: "scale",
    scaleLabels: { low: "Not important", high: "Very important" },
  },
  {
    id: "orgSize",
    question: "What size organization do you prefer?",
    type: "cards",
    options: [
      { id: "large", label: "Large (100K+ served)" },
      { id: "medium", label: "Medium" },
      { id: "small", label: "Small & personal" },
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
    options: [
      { id: "high-efficiency", label: "High Efficiency" },
      { id: "transparency", label: "Transparency" },
      { id: "community-ratings", label: "Community Ratings" },
      { id: "annual-reports", label: "Annual Reports" },
      { id: "established", label: "Established Org" },
      { id: "global-reach", label: "Global Reach" },
    ],
  },
];
