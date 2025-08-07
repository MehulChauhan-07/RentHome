import { Button } from '@/components/ui/button';
import { Home, User, Menu, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">RentHome</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => navigate('/properties')}
          >
            Properties
          </button>
          <button 
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate('/about')}
          >
            About
          </button>
          <button 
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={() => navigate('/contact')}
          >
            Contact
          </button>
          
          {/* Demo Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                Demo
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate('/demo/user')}>
                User Experience
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/demo/admin')}>
                Admin Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button className="bg-gradient-primary">
            List Property
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};