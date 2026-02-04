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
      {/* Clean background */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-subtle" 
            : "bg-background"
        }`} 
      />
      
      <div className="container relative flex h-16 items-center justify-between">
        {/* Simple logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-white p-1 shadow-subtle ring-1 ring-border">
            <img 
              src={givewizeIcon} 
              alt="GiveWiZe" 
              className="h-full w-full object-contain rounded-md"
            />
          </div>
          <span className="font-semibold text-lg text-foreground">
            GiveWiZe
          </span>
        </Link>

        {/* Desktop Navigation - Simple links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-secondary"
              activeClassName="text-foreground bg-secondary"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button 
            size="sm" 
            className="rounded-lg bg-accent hover:bg-terracotta-dark text-accent-foreground font-medium shadow-subtle"
            asChild
          >
            <Link to="/quiz" className="flex items-center gap-1.5">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
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
          className="fixed inset-0 top-16 z-40 bg-foreground/5 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Clean slide panel */}
      <div
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-background border-l border-border shadow-elevated transform transition-transform duration-200 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary rounded-lg"
              activeClassName="text-foreground bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-lg"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button 
              className="w-full rounded-lg bg-accent hover:bg-terracotta-dark text-accent-foreground"
              asChild
            >
              <Link to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                Get started
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
