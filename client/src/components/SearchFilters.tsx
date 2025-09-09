import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Search,
  MapPin,
  Home,
  DollarSign,
  Bed,
  Tag,
  CheckCircle,
} from "lucide-react";
import { PropertyFilters } from "@/types/property";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchFiltersProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  className?: string;
  vertical?: boolean;
}

export const SearchFilters = ({
  onFiltersChange,
  className,
  vertical = false,
}: SearchFiltersProps) => {
  const [filters, setFilters] = useState<PropertyFilters>({});

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <Card
      className={`p-6 ${
        vertical ? "bg-transparent shadow-none" : "bg-gradient-card shadow-card"
      } ${className}`}
    >
      <div
        className={
          vertical
            ? "flex flex-col gap-6"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        }
      >
        {/* Location Search */}
        <div>
          {vertical && <Label className="text-sm mb-2 block">Location</Label>}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="City, State"
              className="pl-10"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          {vertical && (
            <Label className="text-sm mb-2 block">Property Type</Label>
          )}
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              handleFilterChange("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <Home className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Price */}
        <div>
          {vertical && <Label className="text-sm mb-2 block">Min Price</Label>}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="number"
              placeholder="Min Price"
              className="pl-10"
              value={filters.minPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "minPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        {/* Max Price */}
        <div>
          {vertical && <Label className="text-sm mb-2 block">Max Price</Label>}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="number"
              placeholder="Max Price"
              className="pl-10"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                handleFilterChange(
                  "maxPrice",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          {vertical && <Label className="text-sm mb-2 block">Bedrooms</Label>}
          <Select
            value={filters.minBedrooms?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange(
                "minBedrooms",
                value === "any" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <Bed className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!vertical && (
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear Filters
          </Button>
          <Button className="bg-gradient-primary">
            <Search className="h-4 w-4 mr-2" />
            Search Properties
          </Button>
        </div>
      )}
    </Card>
  );
};
