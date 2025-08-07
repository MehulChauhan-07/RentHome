import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  Award, 
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "50,000+", label: "Happy Renters" },
    { number: "99%", label: "Verified Properties" },
    { number: "24/7", label: "Customer Support" }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Our Mission",
      description: "To make finding and renting homes simple, transparent, and accessible for everyone."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community First",
      description: "Building trust between renters and property owners through verified listings and direct communication."
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Quality Assured",
      description: "Every property is verified and every owner is authenticated to ensure the best experience."
    }
  ];

  const features = [
    "Verified property listings",
    "Direct owner contact",
    "Advanced search filters",
    "Mobile-friendly platform",
    "Secure messaging system",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              About RentHome
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transforming the Way
              <span className="block text-primary-foreground/90">People Find Homes</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              We're on a mission to make home rental simple, secure, and stress-free for everyone. 
              Connect directly with verified property owners and find your perfect home.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These principles guide everything we do and help us create the best experience for our users
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover-scale">
                <CardContent className="p-0">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    RentHome was founded with a simple belief: finding a home shouldn't be complicated, 
                    expensive, or stressful. We saw too many people struggling with unreliable listings, 
                    hidden fees, and poor communication.
                  </p>
                  <p>
                    That's why we built a platform that connects renters directly with property owners, 
                    eliminating middlemen and creating transparent, honest relationships.
                  </p>
                  <p>
                    Today, we're proud to serve thousands of users across the country, helping them 
                    find their perfect homes while building lasting connections in communities.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our community and discover why thousands choose RentHome for their rental needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/properties')}
            >
              Browse Properties
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/contact')}
            >
              Contact Us
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;