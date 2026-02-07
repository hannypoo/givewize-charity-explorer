import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CharityFilters } from "@/components/charities/CharityFilters";
import { CharityGrid } from "@/components/charities/CharityGrid";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getTransformedCharities } from "@/data/charityTransform";

const ITEMS_PER_PAGE = 12;

const categoryLabels: Record<string, string> = {
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

const staticCharities = getTransformedCharities();

const Charities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredCharities = useMemo(() => {
    return staticCharities
      .map((charity, index) => ({
        id: String(index + 1),
        name: charity.name,
        category: charity.primary_category,
        categoryLabel: categoryLabels[charity.primary_category] || charity.primary_category,
        geographicScope: charity.geographic_scope,
        mission: charity.mission_statement || "",
        logoUrl: charity.logo_url || undefined,
      }))
      .filter((charity) => {
        const matchesSearch =
          searchQuery === "" ||
          charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          charity.mission.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || charity.category === selectedCategory;
        const matchesScope =
          selectedScopes.length === 0 || selectedScopes.includes(charity.geographicScope);
        return matchesSearch && matchesCategory && matchesScope;
      });
  }, [searchQuery, selectedCategory, selectedScopes]);

  const totalPages = Math.ceil(filteredCharities.length / ITEMS_PER_PAGE);
  const paginatedCharities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCharities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCharities, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  const handleScopeToggle = (value: string) => {
    setSelectedScopes((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedScopes([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "all" || selectedScopes.length > 0;

  const FiltersContent = (
    <CharityFilters
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      selectedScopes={selectedScopes}
      onScopeToggle={handleScopeToggle}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="gradient-orange pt-24 pb-10 md:pb-14 -mt-16">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-accent-foreground md:text-4xl">
            Explore Charities
          </h1>
          <p className="mt-2 text-accent-foreground/80">
            Discover vetted organizations making a real impact
          </p>
        </div>
      </div>

      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, hsl(28, 80%, 62%) 0%, hsl(220, 72%, 50%) 15%, hsl(220, 72%, 50%) 100%)' }}>
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 rounded-xl bg-card p-6 shadow-soft">
                <h2 className="font-semibold text-foreground mb-6">Filters</h2>
                {FiltersContent}
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6 flex items-center justify-between">
                <p className="text-sm text-white/70">
                  {filteredCharities.length} charities found
                </p>
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="border-border">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-card">
                    <SheetHeader>
                      <SheetTitle className="text-foreground">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">{FiltersContent}</div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results count (desktop) */}
              <div className="hidden lg:block mb-6">
                <p className="text-sm text-white/70">
                  Showing {paginatedCharities.length} of {filteredCharities.length} charities
                </p>
              </div>

              <CharityGrid charities={paginatedCharities} />

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Charities;
