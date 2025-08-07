import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { 
  Home as HomeIcon, 
  Search, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProperties } from '@/data/mockProperties';

const Home = () => {
  const navigate = useNavigate();
  const featuredProperties = mockProperties.filter(p => p.isFeatured).slice(0, 3);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Smart Search",
      description: "Find your perfect home with our advanced filtering system"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Verified Properties",
      description: "All properties are verified and owner-authenticated"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Direct Contact",
      description: "Connect directly with property owners and managers"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              🏠 Find Your Perfect Home
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Dream Home
              <span className="block text-primary-foreground/90">Awaits You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
              Discover thousands of verified rental properties. From cozy studios to luxury villas, 
              find the perfect place to call home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => navigate('/properties')}
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Properties
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate('/about')}
              >
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose RentHome?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We make finding and renting your next home simple, secure, and stress-free
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover-scale">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Properties
            </h2>
            <p className="text-muted-foreground text-lg">
              Handpicked premium properties just for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover-scale cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
                <div className="relative">
                  <img 
                    src={property.images[0]} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {property.location.city}, {property.location.state}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">
                      ${property.price}/mo
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/properties')}
            >
              View All Properties
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Search & Filter", desc: "Use our smart filters to find properties that match your needs" },
              { step: "2", title: "Contact Owner", desc: "Connect directly with verified property owners" },
              { step: "3", title: "Move In", desc: "Complete the paperwork and move into your new home" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-primary text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Home?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of happy renters who found their perfect home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/properties')}
            >
              Start Searching
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/demo/user')}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;