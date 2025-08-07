import { Property } from '@/types/property';
import apartment1 from '@/assets/apartment1.jpg';
import house1 from '@/assets/house1.jpg';
import studio1 from '@/assets/studio1.jpg';
import villa1 from '@/assets/villa1.jpg';
import condo1 from '@/assets/condo1.jpg';
import townhouse1 from '@/assets/townhouse1.jpg';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Luxury Apartment',
    description: 'Beautiful contemporary apartment with stunning city views, modern amenities, and excellent location. Perfect for professionals and small families.',
    price: 2500,
    location: {
      address: '123 Downtown Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: [apartment1],
    amenities: ['Air Conditioning', 'Parking', 'Gym', 'Pool', 'Security'],
    isAvailable: true,
    isFeatured: true,
    owner: {
      id: 'owner1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1-555-0123'
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Charming Family House',
    description: 'Spacious family home with beautiful garden, quiet neighborhood, and excellent schools nearby. Perfect for families with children.',
    price: 3200,
    location: {
      address: '456 Maple Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210'
    },
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    images: [house1],
    amenities: ['Garden', 'Garage', 'Air Conditioning', 'Fireplace'],
    isAvailable: true,
    isFeatured: false,
    owner: {
      id: 'owner2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1-555-0124'
    },
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Cozy Studio Downtown',
    description: 'Perfect studio apartment for students or young professionals. Modern design with all amenities included in a prime downtown location.',
    price: 1500,
    location: {
      address: '789 City Center',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    images: [studio1],
    amenities: ['Wi-Fi', 'Air Conditioning', 'Security', 'Laundry'],
    isAvailable: true,
    isFeatured: false,
    owner: {
      id: 'owner3',
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+1-555-0125'
    },
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12'
  },
  {
    id: '4',
    title: 'Luxury Villa with Pool',
    description: 'Stunning villa with private pool, Mediterranean architecture, and breathtaking views. Perfect for luxury living and entertaining.',
    price: 5500,
    location: {
      address: '321 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139'
    },
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    area: 4000,
    images: [villa1],
    amenities: ['Pool', 'Garden', 'Ocean View', 'Security', 'Garage', 'Gym'],
    isAvailable: true,
    isFeatured: true,
    owner: {
      id: 'owner4',
      name: 'Maria Rodriguez',
      email: 'maria@example.com',
      phone: '+1-555-0126'
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08'
  },
  {
    id: '5',
    title: 'Modern Condo Complex',
    description: 'Contemporary condominium in a modern building with excellent amenities and city views. Great for urban living.',
    price: 2800,
    location: {
      address: '555 High Rise Blvd',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    images: [condo1],
    amenities: ['City View', 'Gym', 'Concierge', 'Parking', 'Security'],
    isAvailable: true,
    isFeatured: false,
    owner: {
      id: 'owner5',
      name: 'David Wilson',
      email: 'david@example.com',
      phone: '+1-555-0127'
    },
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: '6',
    title: 'Historic Townhouse',
    description: 'Charming townhouse in historic district with modern renovations while preserving original character. Walking distance to shops and restaurants.',
    price: 2200,
    location: {
      address: '888 Heritage Lane',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101'
    },
    type: 'townhouse',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    images: [townhouse1],
    amenities: ['Historic Character', 'Renovated', 'Walking Distance', 'Parking'],
    isAvailable: true,
    isFeatured: false,
    owner: {
      id: 'owner6',
      name: 'Emily Brown',
      email: 'emily@example.com',
      phone: '+1-555-0128'
    },
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11'
  }
];