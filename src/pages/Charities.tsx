import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronRight, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CharityFilters } from "@/components/charities/CharityFilters";
import { CharityGrid } from "@/components/charities/CharityGrid";
import { CharityGridSkeleton } from "@/components/charities/CharityCardSkeleton";
import { charityRowToCard } from "@/components/charities/CharityCard";
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
import { useCharities, type CharityFilters as FilterState } from "@/hooks/useCharities";

const ITEMS_PER_PAGE = 12;

const Charities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [minGivewizeScore, setMinGivewizeScore] = useState(0);
  const [minCommunityRating, setMinCommunityRating] = useState(0);
  const [keyFactors, setKeyFactors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false);

  const filters: FilterState = {
    searchQuery,
    selectedCategories,
    selectedScopes,
    minGivewizeScore,
    minCommunityRating,
    keyFactors,
  };

  const { data: charities = [], isLoading, error } = useCharities(filters);

  const cardCharities = useMemo(
    () => charities.map(charityRowToCard),
    [charities]
  );

  const totalPages = Math.ceil(cardCharities.length / ITEMS_PER_PAGE);
  const paginatedCharities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return cardCharities.slice(start, start + ITEMS_PER_PAGE);
  }, [cardCharities, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryToggle = (categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
    if (categories.length === 0) {
      searchParams.delete("category");
    } else if (categories.length === 1) {
      searchParams.set("category", categories[0]);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleScopeToggle = (value: string) => {
    setSelectedScopes((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const handleKeyFactorToggle = (value: string) => {
    setKeyFactors((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedScopes([]);
    setMinGivewizeScore(0);
    setMinCommunityRating(0);
    setKeyFactors([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategories.length > 0 ||
    selectedScopes.length > 0 ||
    minGivewizeScore > 0 ||
    minCommunityRating > 0 ||
    keyFactors.length > 0;

  const FiltersContent = (
    <CharityFilters
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      selectedCategories={selectedCategories}
      onCategoryToggle={handleCategoryToggle}
      selectedScopes={selectedScopes}
      onScopeToggle={handleScopeToggle}
      minGivewizeScore={minGivewizeScore}
      onGivewizeScoreChange={(v) => { setMinGivewizeScore(v); setCurrentPage(1); }}
      minCommunityRating={minCommunityRating}
      onCommunityRatingChange={(v) => { setMinCommunityRating(v); setCurrentPage(1); }}
      keyFactors={keyFactors}
      onKeyFactorToggle={handleKeyFactorToggle}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <Layout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, hsl(28, 80%, 62%) 0%, hsl(28, 70%, 58%) 10%, hsl(30, 50%, 52%) 20%, hsl(25, 35%, 46%) 30%, hsl(220, 40%, 42%) 42%, hsl(220, 72%, 50%) 55%, hsl(220, 72%, 50%) 100%)' }}>
        <div className="pt-24 pb-10 md:pb-14 -mt-16">
          <div className="container">
            <h1 className="font-display text-3xl font-bold text-accent-foreground md:text-4xl">
              Explore Charities
            </h1>
            <p className="mt-2 text-accent-foreground/80">
              Discover vetted organizations making a real impact
            </p>
          </div>
        </div>
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar - Collapsible */}
            <aside className="hidden lg:block shrink-0">
              {desktopFiltersOpen ? (
                <div className="sticky top-24 w-72 rounded-xl bg-card p-6 shadow-soft max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-foreground">Filters</h2>
                    <button
                      onClick={() => setDesktopFiltersOpen(false)}
                      className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      title="Collapse filters"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {FiltersContent}
                </div>
              ) : (
                <div className="sticky top-24">
                  <button
                    onClick={() => setDesktopFiltersOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card shadow-soft text-sm font-medium text-foreground hover:bg-card/80 transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        !
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6 flex items-center justify-between">
                <p className="text-sm text-white/70">
                  {cardCharities.length} charities found
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
                  <SheetContent side="left" className="w-80 bg-card overflow-y-auto">
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
                  {isLoading
                    ? "Loading charities..."
                    : `Showing ${paginatedCharities.length} of ${cardCharities.length} charities`}
                </p>
              </div>

              {isLoading ? (
                <CharityGridSkeleton count={6} />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-lg font-medium text-white">Failed to load charities</p>
                  <p className="mt-1 text-white/60">Please try again later</p>
                </div>
              ) : (
                <CharityGrid charities={paginatedCharities} />
              )}

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
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
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
