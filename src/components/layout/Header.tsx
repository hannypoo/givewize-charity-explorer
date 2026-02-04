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
      {/* Solid background with thick border */}
      <div 
        className={`absolute inset-0 transition-all duration-200 bg-background ${
          isScrolled ? "border-b-3 border-foreground" : "border-b-3 border-foreground"
        }`} 
      />
      
      <div className="container relative flex h-16 items-center justify-between">
        {/* Logo - Brutalist style */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 bg-primary border-3 border-foreground p-1 brutal-shadow-sm group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all">
            <img 
              src={givewizeIcon} 
              alt="GiveWiZe" 
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-black text-xl text-foreground uppercase tracking-tight">
            GiveWiZe
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-sm font-bold uppercase text-foreground transition-all hover:bg-accent hover:text-accent-foreground border-3 border-transparent hover:border-foreground"
              activeClassName="bg-secondary border-foreground"
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
            className="text-foreground font-bold uppercase hover:bg-secondary border-3 border-transparent hover:border-foreground"
            asChild
          >
            <Link to="/auth">Sign in</Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-accent hover:bg-accent text-accent-foreground font-black uppercase border-3 border-foreground brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            asChild
          >
            <Link to="/quiz" className="flex items-center gap-1.5">
              Start
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground border-3 border-foreground bg-background"
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
          className="fixed inset-0 top-16 z-40 bg-foreground/20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Brutalist panel */}
      <div
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-background border-l-3 border-foreground transform transition-transform duration-200 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 text-sm font-bold uppercase text-foreground transition-all hover:bg-accent hover:text-accent-foreground border-3 border-transparent hover:border-foreground"
              activeClassName="bg-secondary border-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 pt-6 border-t-3 border-foreground flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full border-3 border-foreground font-bold uppercase"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button 
              className="w-full bg-accent hover:bg-accent text-accent-foreground font-black uppercase border-3 border-foreground brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
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
