import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  { value: "local", label: "Local" },
  { value: "national", label: "National" },
  { value: "global", label: "Global" },
];

interface CharityFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedScopes: string[];
  onScopeToggle: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function CharityFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedScopes,
  onScopeToggle,
  onClearFilters,
  hasActiveFilters,
}: CharityFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-foreground font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search charities..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card border-border focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Category</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border shadow-lg z-50">
            {categories.map((category) => (
              <SelectItem 
                key={category.value} 
                value={category.value}
                className="hover:bg-secondary"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Geographic Scope Filter */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Geographic Scope</Label>
        <div className="space-y-2">
          {geographicScopes.map((scope) => (
            <div key={scope.value} className="flex items-center space-x-2">
              <Checkbox
                id={`scope-${scope.value}`}
                checked={selectedScopes.includes(scope.value)}
                onCheckedChange={() => onScopeToggle(scope.value)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={`scope-${scope.value}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {scope.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-primary hover:underline font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
