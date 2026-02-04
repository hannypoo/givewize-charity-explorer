import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import givewizeIcon from "@/assets/givewize-icon.jpg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/charities", label: "Explore" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50" />
      
      <div className="container relative flex h-16 items-center justify-between">
        {/* Logo - Bubble Style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Bubble container */}
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-1.5 ring-1 ring-primary/20 shadow-sm group-hover:ring-primary/40 group-hover:shadow-md transition-all duration-300">
              <img 
                src={givewizeIcon} 
                alt="GiveWiZe" 
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
          </div>
          <span className="font-display text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            GiveWiZe
          </span>
        </Link>

        {/* Desktop Navigation - Pill style */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 rounded-full bg-muted/50 p-1 ring-1 ring-border/50">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-full transition-all duration-200 hover:text-foreground hover:bg-background/80"
                activeClassName="text-foreground bg-background shadow-sm ring-1 ring-border/50"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button 
            size="sm" 
            className="rounded-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 group"
            asChild
          >
            <Link to="/quiz" className="flex items-center gap-1.5">
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground hover:bg-muted"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 z-40 bg-foreground/10 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slides from right */}
      <div
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted rounded-xl"
              activeClassName="text-foreground bg-muted"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-xl"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button 
              className="w-full rounded-xl bg-primary shadow-md shadow-primary/20"
              asChild
            >
              <Link to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
