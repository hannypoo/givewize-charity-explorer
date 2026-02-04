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
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Dynamic background based on scroll */}
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled 
            ? "bg-card/95 backdrop-blur-xl shadow-soft border-b border-border/50" 
            : "bg-transparent"
        }`} 
      />
      
      <div className="container relative flex h-18 py-4 items-center justify-between">
        {/* Logo - Bubble Style with Gold accent */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Gold glow on hover */}
            <div className="absolute inset-0 bg-gold/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Navy bubble container with gold ring */}
            <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-navy to-navy-dark p-1.5 ring-2 ring-gold/40 shadow-gold group-hover:ring-gold/60 group-hover:shadow-gold-lg transition-all duration-300">
              <img 
                src={givewizeIcon} 
                alt="GiveWiZe" 
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
          </div>
          <span className={`font-display text-xl font-bold transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-primary-foreground"
          }`}>
            GiveWiZe
          </span>
        </Link>

        {/* Desktop Navigation - Pill style */}
        <nav className="hidden md:flex items-center">
          <div className={`flex items-center gap-1 rounded-full p-1.5 transition-all duration-300 ${
            isScrolled 
              ? "bg-muted/50 ring-1 ring-border/50" 
              : "bg-primary-foreground/10 ring-1 ring-primary-foreground/20"
          }`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground hover:bg-background/80" 
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
                activeClassName={isScrolled 
                  ? "text-foreground bg-background shadow-sm ring-1 ring-border/50" 
                  : "text-primary-foreground bg-primary-foreground/15"
                }
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
            className={`transition-colors ${
              isScrolled 
                ? "text-muted-foreground hover:text-foreground" 
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            }`}
            asChild
          >
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button 
            size="sm" 
            className="rounded-full bg-gold hover:bg-gold-dark text-accent-foreground font-semibold shadow-gold group"
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
          className={`md:hidden ${
            isScrolled 
              ? "text-foreground hover:bg-muted" 
              : "text-primary-foreground hover:bg-primary-foreground/10"
          }`}
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
          className="fixed inset-0 top-[72px] z-40 bg-navy/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Slides from right */}
      <div
        className={`fixed top-[72px] right-0 z-50 h-[calc(100vh-72px)] w-72 bg-card/98 backdrop-blur-xl border-l border-border shadow-elevated transform transition-transform duration-300 ease-out md:hidden ${
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
              className="w-full rounded-xl border-border"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button 
              className="w-full rounded-xl bg-gold hover:bg-gold-dark text-accent-foreground font-semibold shadow-gold"
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
