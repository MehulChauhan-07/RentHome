import { useState, useMemo, useEffect } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { Header } from "@/components/Header";
import { mockProperties } from "@/data/mockProperties";
import { PropertyFilters } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Grid, List, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.location) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.type) count++;
    if (filters.minBedrooms) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // Location filter
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        const locationMatch =
          property.location.city.toLowerCase().includes(searchTerm) ||
          property.location.state.toLowerCase().includes(searchTerm) ||
          property.location.address.toLowerCase().includes(searchTerm);
        if (!locationMatch) return false;
      }

      // Price filters
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;

      // Property type filter
      if (filters.type && property.type !== filters.type) return false;

      // Bedroom filter
      if (filters.minBedrooms && property.bedrooms < filters.minBedrooms)
        return false;

      return true;
    });
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent animate-fade-in">
              Find Your Perfect Rental
            </h1>
            <p className="text-lg text-muted-foreground animate-fade-in delay-100">
              Browse through {mockProperties.length}+ verified properties
            </p>
          </div>
        </div>
      </section>

      {/* Search and Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Desktop Search Filters */}
          <div className="hidden md:block">
            <SearchFilters onFiltersChange={setFilters} className="mb-8" />
          </div>

          {/* Mobile Search Filters */}
          <div className="md:hidden mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  className="w-full flex justify-between"
                  variant="outline"
                >
                  <span className="flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter Properties
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Properties</SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
                  <SearchFilters
                    onFiltersChange={setFilters}
                    className="py-2"
                    vertical={true}
                  />
                </ScrollArea>
                <SheetFooter className="flex flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">View Results</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Header */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-8 w-40" />
                ) : (
                  `${filteredProperties.length} Properties Available`
                )}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-5 w-48 mt-2" />
                ) : (
                  `Showing ${filteredProperties.length} of ${mockProperties.length} properties`
                )}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="mr-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Properties Grid/List */}
          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`${
                    viewMode === "list" ? "flex" : ""
                  } animate-pulse`}
                >
                  <div
                    className={`${
                      viewMode === "list" ? "w-80 flex-shrink-0" : ""
                    }`}
                  >
                    <Skeleton
                      className={`${
                        viewMode === "list" ? "h-full" : "h-48"
                      } w-full rounded-lg`}
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex gap-4 mb-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProperties.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }
            >
              {filteredProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PropertyCard property={property} viewMode={viewMode} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-semibold mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters to find more properties.
              </p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;
