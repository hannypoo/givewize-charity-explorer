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
      {/* Glassmorphic background */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-2xl shadow-glass border-b border-white/50" 
            : "bg-transparent"
        }`} 
      />
      
      <div className="container relative flex h-20 py-4 items-center justify-between">
        {/* Logo with glass bubble */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Rose gold glow on hover */}
            <div className="absolute inset-0 bg-rose/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Glass bubble container */}
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm p-1.5 ring-2 ring-rose/30 shadow-rose group-hover:ring-rose/50 group-hover:shadow-rose-lg transition-all duration-300">
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

        {/* Desktop Navigation - Glass pill */}
        <nav className="hidden md:flex items-center">
          <div className={`flex items-center gap-1 rounded-full p-1.5 transition-all duration-300 ${
            isScrolled 
              ? "bg-muted/60 backdrop-blur-sm ring-1 ring-border/50" 
              : "bg-white/10 backdrop-blur-md ring-1 ring-white/20"
          }`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground hover:bg-white/80" 
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/15"
                }`}
                activeClassName={isScrolled 
                  ? "text-foreground bg-white shadow-soft" 
                  : "text-primary-foreground bg-white/20 backdrop-blur-sm"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Desktop CTA - Rose gold accent */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`transition-colors rounded-full ${
              isScrolled 
                ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            }`}
            asChild
          >
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button 
            size="sm" 
            className="rounded-full bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-accent-foreground font-semibold shadow-rose group px-6"
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
          className={`md:hidden rounded-full ${
            isScrolled 
              ? "text-foreground hover:bg-muted" 
              : "text-primary-foreground hover:bg-white/10"
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
          className="fixed inset-0 top-20 z-40 bg-plum-dark/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Glass slide panel */}
      <div
        className={`fixed top-20 right-0 z-50 h-[calc(100vh-5rem)] w-80 bg-white/95 backdrop-blur-2xl border-l border-border/50 shadow-elevated transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-5 gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-5 py-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary rounded-xl"
              activeClassName="text-foreground bg-secondary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-8 pt-8 border-t border-border flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-border py-6"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-rose to-rose-dark text-accent-foreground font-semibold shadow-rose py-6"
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
