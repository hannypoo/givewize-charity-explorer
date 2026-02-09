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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div 
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled ? "glass-nav" : "bg-transparent"
        }`} 
      />
      
      <div className="container relative flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 rounded-xl gradient-blue p-1 glow-blue group-hover:scale-105 transition-all duration-300">
            <img 
              src={givewizeIcon} 
              alt="GiveWiZe" 
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <span className={`font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-white"}`}>
            GiveWi<span className="text-orange-light">Z</span>e
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                isScrolled 
                  ? "text-foreground/60 hover:text-foreground hover:bg-foreground/5" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              activeClassName={isScrolled ? "text-primary bg-primary/5 font-semibold" : "text-white bg-white/15 font-semibold"}
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
            className={`font-medium rounded-xl transition-colors duration-300 ${
              isScrolled 
                ? "text-foreground/60 hover:text-foreground hover:bg-foreground/5" 
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
            asChild
          >
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button 
            size="sm" 
            className="gradient-orange text-accent-foreground font-semibold rounded-xl glow-orange hover:scale-[1.02] transition-all duration-300"
            asChild
          >
            <Link to="/quiz" className="flex items-center gap-1.5">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden rounded-xl transition-colors duration-300 ${isScrolled ? "text-foreground hover:bg-foreground/5" : "text-white hover:bg-white/10"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        role="dialog"
        aria-label="Navigation menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 glass-strong transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 text-sm font-medium text-foreground/60 rounded-xl transition-all hover:text-foreground hover:bg-foreground/5"
              activeClassName="text-primary bg-primary/5 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-xl font-medium"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button 
              className="w-full gradient-orange text-accent-foreground font-semibold rounded-xl glow-orange"
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
