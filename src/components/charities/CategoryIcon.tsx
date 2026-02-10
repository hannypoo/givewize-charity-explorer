import {
  Heart, Stethoscope, GraduationCap, Utensils, PawPrint, Baby, Leaf,
  Siren, Home, Brain, Medal, Palette, Scale, Accessibility, UserRound,
  Users, Church, Globe, Building2,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "rare-diseases": Heart,
  "medical-health": Stethoscope,
  "education": GraduationCap,
  "hunger-food-security": Utensils,
  "animal-welfare": PawPrint,
  "child-welfare": Baby,
  "environment-climate": Leaf,
  "emergency-relief": Siren,
  "housing-homelessness": Home,
  "mental-health": Brain,
  "veterans": Medal,
  "arts-culture": Palette,
  "human-rights": Scale,
  "disability-services": Accessibility,
  "senior-services": UserRound,
  "community-development": Users,
  "faith-based": Church,
  "international-development": Globe,
};

export function getCategoryIcon(category: string): React.ElementType {
  return categoryIcons[category] || Building2;
}
