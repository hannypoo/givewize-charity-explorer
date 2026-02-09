import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, ChevronRight, X, ArrowUpDown } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CharityFilters } from "@/components/charities/CharityFilters";
import { CharityGrid } from "@/components/charities/CharityGrid";
import { CharityGridSkeleton } from "@/components/charities/CharityCardSkeleton";
import { charityRowToCard } from "@/components/charities/CharityCard";
import { getCombinedRating, getGivewizeScore } from "@/lib/charityUtils";
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
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDebounce } from "@/hooks/useDebounce";
import { categoryHierarchy } from "@/data/categoryHierarchy";

const ITEMS_PER_PAGE = 12;

const categoryLabelMap = new Map(
  categoryHierarchy.flatMap((g) => g.subcategories.map((s) => [s.value, s.label]))
);

const scopeLabels: Record<string, string> = {
  local: "Local",
  national: "National",
  global: "Global",
};

/** Read array from a URLSearchParams key (comma-separated) */
function getParamArray(params: URLSearchParams, key: string): string[] {
  const v = params.get(key);
  return v ? v.split(",").filter(Boolean) : [];
}

/** Read number from a URLSearchParams key */
function getParamNumber(params: URLSearchParams, key: string, fallback = 0): number {
  const v = params.get(key);
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

const Charities = () => {
  usePageTitle("Explore Charities", "Browse and filter vetted charities by category, rating, and impact. Find organizations that align with your values.");
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params on mount
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => getParamArray(searchParams, "categories"));
  const [selectedScopes, setSelectedScopes] = useState<string[]>(() => getParamArray(searchParams, "scopes"));
  const [minGivewizeScore, setMinGivewizeScore] = useState(() => getParamNumber(searchParams, "minScore"));
  const [minCommunityRating, setMinCommunityRating] = useState(() => getParamNumber(searchParams, "minRating"));
  const [keyFactors, setKeyFactors] = useState<string[]>(() => getParamArray(searchParams, "factors"));
  const [currentPage, setCurrentPage] = useState(() => getParamNumber(searchParams, "page", 1));
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "name-asc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Sync all filter state to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (selectedScopes.length) params.set("scopes", selectedScopes.join(","));
    if (minGivewizeScore > 0) params.set("minScore", String(minGivewizeScore));
    if (minCommunityRating > 0) params.set("minRating", String(minCommunityRating));
    if (keyFactors.length) params.set("factors", keyFactors.join(","));
    if (currentPage > 1) params.set("page", String(currentPage));
    if (sortBy !== "name-asc") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategories, selectedScopes, minGivewizeScore, minCommunityRating, keyFactors, currentPage, sortBy, setSearchParams]);

  // Scroll to results area when page changes (skip initial render)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }, [currentPage]);

  const filters: FilterState = {
    searchQuery: debouncedSearch,
    selectedCategories,
    selectedScopes,
    minGivewizeScore,
    minCommunityRating,
    keyFactors,
  };

  const { data: charities = [], isLoading, error, refetch } = useCharities(filters);

  // Client-side GiveWiZe score filter (score_overall is computed, not stored in DB)
  const filteredCharities = useMemo(() => {
    if (minGivewizeScore <= 0) return charities;
    return charities.filter((c) => getGivewizeScore(c) >= minGivewizeScore);
  }, [charities, minGivewizeScore]);

  const sortedCharities = useMemo(() => {
    const sorted = [...filteredCharities];
    switch (sortBy) {
      case "name-asc": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "rating-desc": sorted.sort((a, b) => (getCombinedRating(b) ?? 0) - (getCombinedRating(a) ?? 0)); break;
      case "newest": sorted.sort((a, b) => (b.year_founded ?? 0) - (a.year_founded ?? 0)); break;
    }
    return sorted;
  }, [filteredCharities, sortBy]);

  const cardCharities = useMemo(
    () => sortedCharities.map(charityRowToCard),
    [sortedCharities]
  );

  const totalPages = Math.ceil(cardCharities.length / ITEMS_PER_PAGE);

  // Reset to page 1 if current page exceeds available pages (e.g., after filter change)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const safePage = totalPages > 0 && currentPage > totalPages ? 1 : currentPage;
  const paginatedCharities = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return cardCharities.slice(start, start + ITEMS_PER_PAGE);
  }, [cardCharities, safePage]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleCategoryToggle = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    setCurrentPage(1);
  }, []);

  const handleScopeToggle = useCallback((value: string) => {
    setSelectedScopes((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
    setCurrentPage(1);
  }, []);

  const handleKeyFactorToggle = useCallback((value: string) => {
    setKeyFactors((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
    setCurrentPage(1);
  }, []);

  const handleGivewizeScoreChange = useCallback((v: number) => {
    setMinGivewizeScore(v);
    setCurrentPage(1);
  }, []);

  const handleCommunityRatingChange = useCallback((v: number) => {
    setMinCommunityRating(v);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedScopes([]);
    setMinGivewizeScore(0);
    setMinCommunityRating(0);
    setKeyFactors([]);
    setCurrentPage(1);
  }, []);

  const activeFilterCount =
    (searchQuery !== "" ? 1 : 0) +
    selectedCategories.length +
    selectedScopes.length +
    (minGivewizeScore > 0 ? 1 : 0) +
    (minCommunityRating > 0 ? 1 : 0) +
    keyFactors.length;

  const hasActiveFilters = activeFilterCount > 0;

  const FiltersContent = (
    <CharityFilters
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      selectedCategories={selectedCategories}
      onCategoryToggle={handleCategoryToggle}
      selectedScopes={selectedScopes}
      onScopeToggle={handleScopeToggle}
      minGivewizeScore={minGivewizeScore}
      onGivewizeScoreChange={handleGivewizeScoreChange}
      minCommunityRating={minCommunityRating}
      onCommunityRatingChange={handleCommunityRatingChange}
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
                        {activeFilterCount}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Mobile Filter + Sort Bar */}
              <div className="lg:hidden mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70" role="status" aria-live="polite">
                    {isLoading
                      ? "Loading charities..."
                      : `Showing ${paginatedCharities.length} of ${cardCharities.length} charities`}
                  </p>
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="border-border">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {activeFilterCount}
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
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-white/50" />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    aria-label="Sort charities"
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1"
                  >
                    <option value="name-asc" className="bg-slate-800">Name A–Z</option>
                    <option value="name-desc" className="bg-slate-800">Name Z–A</option>
                    <option value="rating-desc" className="bg-slate-800">Highest Rated</option>
                    <option value="newest" className="bg-slate-800">Newest</option>
                  </select>
                </div>
              </div>

              {/* Results count + Sort (desktop) */}
              <div ref={resultsRef} className="hidden lg:flex items-center justify-between mb-6 scroll-mt-24">
                <p className="text-sm text-white/70" role="status" aria-live="polite">
                  {isLoading
                    ? "Loading charities..."
                    : `Showing ${paginatedCharities.length} of ${cardCharities.length} charities`}
                </p>
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-white/50" />
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    aria-label="Sort charities"
                    className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                  >
                    <option value="name-asc" className="bg-slate-800">Name A–Z</option>
                    <option value="name-desc" className="bg-slate-800">Name Z–A</option>
                    <option value="rating-desc" className="bg-slate-800">Highest Rated</option>
                    <option value="newest" className="bg-slate-800">Newest</option>
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white">
                      Search: "{searchQuery}"
                      <button onClick={() => handleSearchChange("")} aria-label="Remove search filter" className="ml-1 hover:text-white/60"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {selectedCategories.map((cat) => (
                    <span key={cat} className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white">
                      {categoryLabelMap.get(cat) || cat}
                      <button onClick={() => handleCategoryToggle(selectedCategories.filter((c) => c !== cat))} aria-label={`Remove ${categoryLabelMap.get(cat) || cat} filter`} className="ml-1 hover:text-white/60"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  {selectedScopes.map((scope) => (
                    <span key={scope} className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white">
                      {scopeLabels[scope] || scope}
                      <button onClick={() => handleScopeToggle(scope)} aria-label={`Remove ${scopeLabels[scope] || scope} filter`} className="ml-1 hover:text-white/60"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  {minGivewizeScore > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white">
                      Score {minGivewizeScore}+
                      <button onClick={() => { setMinGivewizeScore(0); setCurrentPage(1); }} aria-label="Remove score filter" className="ml-1 hover:text-white/60"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {minCommunityRating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white">
                      Community {minCommunityRating}+
                      <button onClick={() => { setMinCommunityRating(0); setCurrentPage(1); }} aria-label="Remove community rating filter" className="ml-1 hover:text-white/60"><X className="h-3 w-3" /></button>
                    </span>
                  )}
                  {keyFactors.map((factor) => (
                    <span key={factor} className="inline-flex items-center gap-1 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs text-white">
                      {factor.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      <button onClick={() => handleKeyFactorToggle(factor)} aria-label={`Remove ${factor} filter`} className="ml-1 hover:text-white/60"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <button
                    onClick={clearFilters}
                    className="text-xs text-white/50 hover:text-white underline underline-offset-2"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {isLoading ? (
                <CharityGridSkeleton count={ITEMS_PER_PAGE} />
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-lg font-medium text-white">Failed to load charities</p>
                  <p className="mt-1 text-white/60 mb-4">Something went wrong. Please try again.</p>
                  <Button
                    onClick={() => refetch()}
                    className="gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <CharityGrid charities={paginatedCharities} />
              )}

              {totalPages > 1 && (
                <nav className="mt-8" aria-label="Charity results pagination">
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
                </nav>
              )}
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Charities;
