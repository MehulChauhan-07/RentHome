import { Property } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Star, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard = ({ property, viewMode = 'grid' }: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleContactOwner = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle contact logic here
    console.log('Contact owner:', property.owner);
  };

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-card-hover animate-fade-in ${
        property.isFeatured ? 'ring-2 ring-property-featured shadow-featured' : 'shadow-card'
      } ${viewMode === 'list' ? 'flex' : ''}`}
      onClick={handleViewDetails}
    >
      {/* Property Image */}
      <div className={`relative overflow-hidden ${
        viewMode === 'list' ? 'w-80 flex-shrink-0 h-full' : 'h-48'
      }`}>
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Featured Badge */}
        {property.isFeatured && (
          <Badge className="absolute top-3 left-3 bg-property-featured text-white">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}

        {/* Availability Badge */}
        <Badge 
          className={`absolute top-3 right-3 ${
            property.isAvailable 
              ? 'bg-success text-success-foreground' 
              : 'bg-destructive text-destructive-foreground'
          }`}
        >
          {property.isAvailable ? 'Available' : 'Rented'}
        </Badge>
      </div>

      {/* Property Details */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* Price and Type */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location.city}, {property.location.state}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-property-price">
              ${property.price.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>
        </div>

        {/* Property Info */}
        <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} beds
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} baths
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.area} sqft
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {property.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-gradient-primary"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleContactOwner}
            className="px-3"
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleContactOwner}
            className="px-3"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};