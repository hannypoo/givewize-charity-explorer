import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "rare-diseases", label: "Rare Diseases" },
  { value: "medical-health", label: "Medical & Health" },
  { value: "education", label: "Education" },
  { value: "hunger-food-security", label: "Hunger & Food Security" },
  { value: "animal-welfare", label: "Animal Welfare" },
  { value: "child-welfare", label: "Child Welfare" },
  { value: "environment-climate", label: "Environment & Climate" },
  { value: "emergency-relief", label: "Emergency Relief" },
  { value: "housing-homelessness", label: "Housing & Homelessness" },
  { value: "mental-health", label: "Mental Health" },
  { value: "veterans", label: "Veterans" },
  { value: "arts-culture", label: "Arts & Culture" },
  { value: "human-rights", label: "Human Rights" },
  { value: "disability-services", label: "Disability Services" },
  { value: "senior-services", label: "Senior Services" },
  { value: "community-development", label: "Community Development" },
  { value: "faith-based", label: "Faith-Based" },
  { value: "international-development", label: "International Development" },
];

const geographicScopes = [
  { value: "all", label: "All Scopes" },
  { value: "local", label: "Local" },
  { value: "national", label: "National" },
  { value: "global", label: "Global" },
];

interface CharityFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedScope: string;
  onScopeChange: (value: string) => void;
}

export function CharityFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedScope,
  onScopeChange,
}: CharityFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search by Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search charities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Geographic Scope Filter */}
      <div className="space-y-2">
        <Label>Geographic Scope</Label>
        <Select value={selectedScope} onValueChange={onScopeChange}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select scope" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {geographicScopes.map((scope) => (
              <SelectItem key={scope.value} value={scope.value}>
                {scope.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
