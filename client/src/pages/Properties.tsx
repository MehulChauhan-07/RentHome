import { useState, useMemo } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Header } from '@/components/Header';
import { mockProperties } from '@/data/mockProperties';
import { PropertyFilters } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

const Properties = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
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
      if (filters.minBedrooms && property.bedrooms < filters.minBedrooms) return false;

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Header */}
      <section className="bg-gradient-subtle py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Your Perfect Rental
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse through {mockProperties.length}+ verified properties
            </p>
          </div>
        </div>
      </section>

      {/* Search and Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Search Filters */}
          <SearchFilters 
            onFiltersChange={setFilters}
            className="mb-8"
          />

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {filteredProperties.length} Properties Available
              </h2>
              <p className="text-muted-foreground">
                Showing {filteredProperties.length} of {mockProperties.length} properties
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Properties Grid/List */}
          {filteredProperties.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search filters to find more properties.
              </p>
              <Button onClick={() => setFilters({})}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;