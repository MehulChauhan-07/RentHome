import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Search, 
  Heart, 
  MessageSquare,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProperties } from '@/data/mockProperties';

const UserDemo = () => {
  const navigate = useNavigate();
  const demoProperty = mockProperties[0];

  const userFeatures = [
    {
      icon: <Search className="h-6 w-6 text-primary" />,
      title: "Smart Search",
      description: "Find properties using advanced filters for location, price, type, and amenities"
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Save Favorites",
      description: "Bookmark properties you love and compare them easily"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Direct Contact",
      description: "Message property owners directly through our secure platform"
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: "Reviews & Ratings",
      description: "Read authentic reviews from previous tenants"
    }
  ];

  const searchSteps = [
    { step: "1", title: "Set Your Criteria", desc: "Location, budget, property type" },
    { step: "2", title: "Browse Results", desc: "View matching properties with photos" },
    { step: "3", title: "Contact Owner", desc: "Send inquiry directly to property owner" },
    { step: "4", title: "Schedule Visit", desc: "Arrange property viewing" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <User className="h-4 w-4 mr-2" />
              Renter Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Experience RentHome
              <span className="block text-primary-foreground/90">As a Renter</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover how easy it is to find your perfect rental home with our 
              user-friendly platform and powerful search tools.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/properties')}
            >
              Try Live Search
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* User Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Renters
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to find and secure your ideal rental property
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userFeatures.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover-scale">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Property Card */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Property Listing Preview
            </h2>
            <p className="text-muted-foreground text-lg">
              See how properties are displayed with all the details you need
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={demoProperty.images[0]} 
                  alt={demoProperty.title}
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
                <Badge variant="secondary" className="absolute top-4 right-4">
                  Available
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{demoProperty.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {demoProperty.location.address}, {demoProperty.location.city}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${demoProperty.price}/mo
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4">{demoProperty.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="font-bold">{demoProperty.bedrooms}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{demoProperty.bathrooms}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{demoProperty.area}</div>
                    <div className="text-sm text-muted-foreground">sq ft</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Contact Owner
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Search Process */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How to Find Your Home
            </h2>
            <p className="text-muted-foreground text-lg">
              Follow these simple steps to discover your perfect rental
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {searchSteps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Search?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of renters who've found their dream homes through RentHome
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/properties')}
            >
              Start Searching Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/demo/admin')}
            >
              View Admin Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDemo;