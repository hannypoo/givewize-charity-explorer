import { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { categoryHierarchy } from "@/data/categoryHierarchy";

const geographicScopes = [
  { value: "local", label: "Local" },
  { value: "national", label: "National" },
  { value: "global", label: "Global" },
];

const keyFactorOptions = [
  { value: "high-efficiency", label: "High Efficiency (80%+)" },
  { value: "transparent", label: "Transparent Finances" },
  { value: "established", label: "Established (20+ yrs)" },
  { value: "annual-report", label: "Annual Report" },
];

interface CharityFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (categories: string[]) => void;
  selectedScopes: string[];
  onScopeToggle: (value: string) => void;
  minGivewizeScore: number;
  onGivewizeScoreChange: (value: number) => void;
  minCommunityRating: number;
  onCommunityRatingChange: (value: number) => void;
  keyFactors: string[];
  onKeyFactorToggle: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function CharityFilters({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedScopes,
  onScopeToggle,
  minGivewizeScore,
  onGivewizeScoreChange,
  minCommunityRating,
  onCommunityRatingChange,
  keyFactors,
  onKeyFactorToggle,
  onClearFilters,
  hasActiveFilters,
}: CharityFiltersProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleMajorToggle = (group: typeof categoryHierarchy[number]) => {
    const subValues = group.subcategories.map((s) => s.value);
    const allSelected = subValues.every((v) => selectedCategories.includes(v));

    if (allSelected) {
      onCategoryToggle(selectedCategories.filter((c) => !subValues.includes(c)));
    } else {
      const merged = [...new Set([...selectedCategories, ...subValues])];
      onCategoryToggle(merged);
    }
  };

  const handleSubToggle = (value: string) => {
    if (selectedCategories.includes(value)) {
      onCategoryToggle(selectedCategories.filter((c) => c !== value));
    } else {
      onCategoryToggle([...selectedCategories, value]);
    }
  };

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

      {/* Category Filter - Accordion */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Categories</Label>
        <div className="space-y-1">
          {categoryHierarchy.map((group) => {
            const isExpanded = expandedGroups.includes(group.label);
            const subValues = group.subcategories.map((s) => s.value);
            const selectedCount = subValues.filter((v) => selectedCategories.includes(v)).length;
            const allSelected = selectedCount === subValues.length;

            return (
              <div key={group.label} className="rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={() => handleMajorToggle(group)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => toggleGroup(group.label)}
                    className="flex-1 flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <span>
                      {group.label}
                      {selectedCount > 0 && (
                        <span className="ml-1.5 text-xs text-primary">({selectedCount})</span>
                      )}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {isExpanded && (
                  <div className="px-3 py-2 space-y-1.5 bg-card">
                    {group.subcategories.map((sub) => (
                      <div key={sub.value} className="flex items-center space-x-2 pl-4">
                        <Checkbox
                          id={`cat-${sub.value}`}
                          checked={selectedCategories.includes(sub.value)}
                          onCheckedChange={() => handleSubToggle(sub.value)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={`cat-${sub.value}`}
                          className="text-xs text-muted-foreground cursor-pointer"
                        >
                          {sub.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

      {/* Minimum GiveWize Score */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">
          Min GiveWiZe Score: {minGivewizeScore > 0 ? minGivewizeScore.toFixed(1) : "Any"}
        </Label>
        <Slider
          value={[minGivewizeScore]}
          onValueChange={([v]) => onGivewizeScoreChange(v)}
          min={0}
          max={5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Any</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Minimum Community Rating */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">
          Min Community Rating: {minCommunityRating > 0 ? minCommunityRating.toFixed(1) : "Any"}
        </Label>
        <Slider
          value={[minCommunityRating]}
          onValueChange={([v]) => onCommunityRatingChange(v)}
          min={0}
          max={5}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Any</span>
          <span>5.0</span>
        </div>
      </div>

      {/* Key Factors */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">Key Factors</Label>
        <div className="space-y-2">
          {keyFactorOptions.map((factor) => (
            <div key={factor.value} className="flex items-center space-x-2">
              <Checkbox
                id={`factor-${factor.value}`}
                checked={keyFactors.includes(factor.value)}
                onCheckedChange={() => onKeyFactorToggle(factor.value)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label
                htmlFor={`factor-${factor.value}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {factor.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-sm text-primary hover:underline font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
