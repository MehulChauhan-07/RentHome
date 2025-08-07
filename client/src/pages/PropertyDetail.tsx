import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Bed, Bath, Square, Star, Phone, Mail, Calendar, Home } from 'lucide-react';
import { mockProperties } from '@/data/mockProperties';
import { Header } from '@/components/Header';

export const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const property = mockProperties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleContactOwner = () => {
    console.log('Contact owner:', property.owner);
  };

  const handleScheduleViewing = () => {
    console.log('Schedule viewing for:', property.title);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Images */}
            <div className="relative h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-property-featured text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Featured Property
                </Badge>
              )}
            </div>

            {/* Property Title and Price */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}</span>
                </div>
                <Badge 
                  className={`${
                    property.isAvailable 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-destructive text-destructive-foreground'
                  }`}
                >
                  {property.isAvailable ? 'Available for Rent' : 'Currently Rented'}
                </Badge>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <div className="text-4xl font-bold text-property-price">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-muted-foreground">per month</div>
              </div>
            </div>

            {/* Property Details */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <div className="font-medium">{property.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <div className="font-medium">{property.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <div className="font-medium">{property.area}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <div className="font-medium capitalize">{property.type}</div>
                    <div className="text-sm text-muted-foreground">Type</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </Card>

            {/* Amenities */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="justify-start">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Owner Card */}
            <Card className="p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Contact Property Owner</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="font-medium">{property.owner.name}</div>
                  <div className="text-sm text-muted-foreground">Property Owner</div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{property.owner.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{property.owner.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-primary"
                  onClick={handleContactOwner}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleContactOwner}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleScheduleViewing}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <strong>Listed:</strong> {new Date(property.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Updated:</strong> {new Date(property.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};