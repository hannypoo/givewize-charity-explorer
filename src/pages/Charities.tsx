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
import { mockCharities } from "@/data/mockCharities";

const ITEMS_PER_PAGE = 9;

const Charities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL params
  const initialCategory = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
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
        selectedScopes.length === 0 || selectedScopes.includes(charity.geographicScope);

      return matchesSearch && matchesCategory && matchesScope;
    });
  }, [searchQuery, selectedCategory, selectedScopes]);

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

  const handleScopeToggle = (value: string) => {
    setSelectedScopes((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
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
      <div className="bg-white border-b border-gray-100 py-10 md:py-14">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-[#1a365d] md:text-4xl">
            Explore Charities
          </h1>
          <p className="mt-2 text-[#6B7280]">
            Discover vetted organizations making a real impact
          </p>
        </div>
      </div>

      <div className="bg-[#F8FAFC] min-h-screen">
        <div className="container py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-[#1a365d] mb-6">Filters</h2>
                {FiltersContent}
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6 flex items-center justify-between">
                <p className="text-sm text-[#6B7280]">
                  {filteredCharities.length} charities found
                </p>
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#4A90D9] text-xs text-white">
                          !
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-white">
                    <SheetHeader>
                      <SheetTitle className="text-[#1a365d]">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">{FiltersContent}</div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results count (desktop) */}
              <div className="hidden lg:block mb-6">
                <p className="text-sm text-[#6B7280]">
                  Showing {paginatedCharities.length} of {filteredCharities.length} charities
                </p>
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
      </div>
    </Layout>
  );
};

export default Charities;
