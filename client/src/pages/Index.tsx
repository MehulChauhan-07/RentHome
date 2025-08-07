import { useState, useMemo } from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchFilters } from '@/components/SearchFilters';
import { Header } from '@/components/Header';
import { mockProperties } from '@/data/mockProperties';
import { PropertyFilters } from '@/types/property';

const Index = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});

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
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover amazing rental properties in your area with our comprehensive house rent platform
            </p>
          </div>
        </div>
      </section>

      {/* Search and Results */}
      <section className="py-8 -mt-8">
        <div className="container mx-auto px-4">
          {/* Search Filters */}
          <SearchFilters 
            onFiltersChange={setFilters}
            className="mb-8"
          />

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {filteredProperties.length} Properties Available
            </h2>
            <div className="text-muted-foreground">
              Showing {filteredProperties.length} of {mockProperties.length} properties
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters to find more properties.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
