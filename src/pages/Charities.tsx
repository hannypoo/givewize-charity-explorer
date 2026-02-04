import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
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
import { mockCharities } from "@/data/mockCharities";

const ITEMS_PER_PAGE = 9;

const Charities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL params
  const initialCategory = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedScope, setSelectedScope] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter charities based on current filters
  const filteredCharities = useMemo(() => {
    return mockCharities.filter((charity) => {
      const matchesSearch =
        searchQuery === "" ||
        charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        charity.mission.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || charity.category === selectedCategory;

      const matchesScope =
        selectedScope === "all" || charity.geographicScope === selectedScope;

      return matchesSearch && matchesCategory && matchesScope;
    });
  }, [searchQuery, selectedCategory, selectedScope]);

  // Paginate results
  const totalPages = Math.ceil(filteredCharities.length / ITEMS_PER_PAGE);
  const paginatedCharities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCharities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCharities, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    // Update URL params
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  const handleScopeChange = (value: string) => {
    setSelectedScope(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedScope("all");
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "all" || selectedScope !== "all";

  const FiltersContent = (
    <CharityFilters
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      selectedScope={selectedScope}
      onScopeChange={handleScopeChange}
    />
  );

  return (
    <Layout>
      <div className="bg-secondary/30 py-8 md:py-12">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Explore Charities
          </h1>
          <p className="mt-2 text-muted-foreground">
            Discover vetted organizations making a real impact
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-foreground">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              {FiltersContent}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredCharities.length} charities found
              </p>
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        !
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      Filters
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-auto p-1 text-xs"
                        >
                          Clear all
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{FiltersContent}</div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results count (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedCharities.length} of {filteredCharities.length} charities
              </p>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Charity Grid */}
            <CharityGrid charities={paginatedCharities} />

            {/* Pagination */}
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
                    {[...Array(totalPages)].map((_, i) => (
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
    </Layout>
  );
};

export default Charities;
