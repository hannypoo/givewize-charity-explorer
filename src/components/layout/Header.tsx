import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Clean background with bottom accent */}
      <div 
        className={`absolute inset-0 transition-all duration-200 ${
          isScrolled 
            ? "bg-background shadow-soft" 
            : "bg-background"
        }`} 
      />
      {/* Geometric accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-coral to-primary" />
      
      <div className="container relative flex h-16 items-center justify-between">
        {/* Logo - Geometric style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 border-2 border-primary p-1 group-hover:border-coral transition-colors">
            <img 
              src={givewizeIcon} 
              alt="GiveWiZe" 
              className="h-full w-full object-contain"
            />
            {/* Corner accent */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-coral" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">
            GiveWiZe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
              activeClassName="text-foreground"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-coral transition-all group-hover:w-full" />
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground font-medium"
            asChild
          >
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button 
            size="sm" 
            className="rounded-none bg-coral hover:bg-coral-dark text-accent-foreground font-semibold shadow-coral group"
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
          className="md:hidden text-foreground"
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
          className="fixed inset-0 top-16 z-40 bg-foreground/10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-background border-l-2 border-primary shadow-elevated transform transition-transform duration-200 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary border-l-2 border-transparent hover:border-coral"
              activeClassName="text-foreground border-coral bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 pt-6 border-t-2 border-border flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-none border-2 border-foreground"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button 
              className="w-full rounded-none bg-coral hover:bg-coral-dark text-accent-foreground font-semibold"
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
