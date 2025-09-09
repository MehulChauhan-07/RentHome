import { Button } from "@/components/ui/button";
import { Home, User, Menu, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    return () => navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleNavigation("/")}
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
            onClick={handleNavigation("/properties")}
          >
            Properties
          </button>
          <button
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={handleNavigation("/about")}
          >
            About
          </button>
          <button
            className="text-muted-foreground hover:text-primary transition-colors"
            onClick={handleNavigation("/contact")}
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
              <DropdownMenuItem onClick={handleNavigation("/demo/user")}>
                User Experience
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigation("/demo/admin")}>
                Admin Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Auth Buttons & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          <Button className="bg-gradient-primary hidden md:flex">
            List Property
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 py-4">
                <h3 className="text-lg font-semibold mb-2">Menu</h3>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleNavigation("/properties")}
                  >
                    Properties
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleNavigation("/about")}
                  >
                    About
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleNavigation("/contact")}
                  >
                    Contact
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleNavigation("/demo/user")}
                  >
                    User Demo
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={handleNavigation("/demo/admin")}
                  >
                    Admin Demo
                  </Button>
                </SheetClose>
                <hr className="my-2" />
                <SheetClose asChild>
                  <Button className="bg-gradient-primary w-full">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    List Property
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
