import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore Charities" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Give<span className="text-primary">WiZe</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="text-primary"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button size="sm" className="bg-accent hover:bg-accent/90" asChild>
            <Link to="/quiz">Take the Quiz</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border animate-slide-in">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-md"
                activeClassName="text-primary bg-secondary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" asChild>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button className="bg-accent hover:bg-accent/90" asChild>
                <Link to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                  Take the Quiz
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
