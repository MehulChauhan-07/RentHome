import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Home, 
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockProperties } from '@/data/mockProperties';

const AdminDemo = () => {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "User Management",
      description: "Manage renters and property owners with full verification system"
    },
    {
      icon: <Home className="h-6 w-6 text-primary" />,
      title: "Property Oversight",
      description: "Review, approve, and monitor all property listings"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Analytics Dashboard",
      description: "Track platform usage, revenue, and performance metrics"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Security & Compliance",
      description: "Ensure platform safety and regulatory compliance"
    }
  ];

  const stats = [
    { label: "Total Users", value: "15,247", change: "+12%", icon: <Users className="h-5 w-5" /> },
    { label: "Active Properties", value: "8,932", change: "+8%", icon: <Home className="h-5 w-5" /> },
    { label: "Monthly Revenue", value: "$94,250", change: "+15%", icon: <TrendingUp className="h-5 w-5" /> },
    { label: "Success Rate", value: "96.8%", change: "+2%", icon: <CheckCircle className="h-5 w-5" /> }
  ];

  const recentActivity = [
    { action: "New property submitted", user: "John Smith", time: "2 min ago", status: "pending" },
    { action: "User verification completed", user: "Sarah Johnson", time: "5 min ago", status: "approved" },
    { action: "Property report filed", user: "Mike Davis", time: "12 min ago", status: "review" },
    { action: "Payment processed", user: "Emma Wilson", time: "18 min ago", status: "completed" }
  ];

  const pendingReviews = [
    { type: "Property", title: "Luxury Downtown Condo", owner: "Alice Brown", priority: "high" },
    { type: "User", title: "Owner Verification", owner: "Robert Chen", priority: "medium" },
    { type: "Report", title: "Property Complaint", owner: "Lisa Garcia", priority: "high" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20">
              <Shield className="h-4 w-4 mr-2" />
              Admin Dashboard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Platform Management
              <span className="block text-primary-foreground/90">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Experience the comprehensive admin dashboard that gives you complete 
              control over your rental platform.
            </p>
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Admin Capabilities
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools to manage your platform effectively and ensure quality
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feature, index) => (
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

      {/* Dashboard Preview */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dashboard Overview
            </h2>
            <p className="text-muted-foreground text-lg">
              Real-time insights and metrics at your fingertips
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-primary">{stat.icon}</div>
                    <Badge variant="secondary" className="text-green-600">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activity & Reviews */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">by {activity.user}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === 'approved' ? 'default' : 
                                 activity.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Pending Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReviews.map((review, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{review.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {review.type} • {review.owner}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={review.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {review.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Management Tools */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Management Tools
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to run your platform efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-scale cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground mb-4">
                  Manage user accounts, verifications, and permissions
                </p>
                <Button variant="outline" className="w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-scale cursor-pointer">
              <CardContent className="p-6 text-center">
                <Home className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Property Control</h3>
                <p className="text-muted-foreground mb-4">
                  Review, approve, and manage property listings
                </p>
                <Button variant="outline" className="w-full">
                  Manage Properties
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-scale cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Platform Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Configure platform rules, policies, and features
                </p>
                <Button variant="outline" className="w-full">
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Manage Your Platform?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Get started with our comprehensive admin tools and take control of your rental business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/contact')}
            >
              Contact Sales
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/demo/user')}
            >
              User Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDemo;