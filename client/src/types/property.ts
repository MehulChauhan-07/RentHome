export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  type: 'apartment' | 'house' | 'studio' | 'villa' | 'condo' | 'townhouse';
  bedrooms: number;
  bathrooms: number;
  area: number; // in square feet
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: Property['type'];
  minBedrooms?: number;
  maxBedrooms?: number;
  amenities?: string[];
}