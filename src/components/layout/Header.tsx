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
      {/* Glassmorphic header background */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border-b border-white/50" 
            : "bg-white/5 backdrop-blur-xl"
        }`} 
      />
      
      <div className="container relative flex h-20 py-4 items-center justify-between">
        {/* Logo in glass bubble */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-rose/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {/* Glass container */}
            <div className="relative h-12 w-12 rounded-xl bg-white/80 backdrop-blur-xl p-1.5 ring-2 ring-rose/30 shadow-[0_4px_20px_rgba(210,140,130,0.25)] group-hover:ring-rose/50 group-hover:shadow-[0_8px_30px_rgba(210,140,130,0.35)] transition-all duration-300">
              <img 
                src={givewizeIcon} 
                alt="GiveWiZe" 
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
          </div>
          <span className={`font-display text-xl font-bold transition-colors duration-300 ${
            isScrolled ? "text-foreground" : "text-white"
          }`}>
            GiveWiZe
          </span>
        </Link>

        {/* Desktop Navigation - Glass pill */}
        <nav className="hidden md:flex items-center">
          <div className={`flex items-center gap-1 rounded-full p-1.5 transition-all duration-300 ${
            isScrolled 
              ? "bg-white/60 backdrop-blur-xl ring-1 ring-white/50 shadow-[0_4px_15px_rgba(0,0,0,0.05)]" 
              : "bg-white/10 backdrop-blur-xl ring-1 ring-white/25"
          }`}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground hover:bg-white/80" 
                    : "text-white/70 hover:text-white hover:bg-white/15"
                }`}
                activeClassName={isScrolled 
                  ? "text-foreground bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]" 
                  : "text-white bg-white/20"
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
            className={`transition-colors rounded-full ${
              isScrolled 
                ? "text-muted-foreground hover:text-foreground hover:bg-muted" 
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
            asChild
          >
            <Link to="/auth">Sign In</Link>
          </Button>
          {/* CTA in glass wrapper */}
          <div className="bg-white/10 backdrop-blur-xl rounded-full p-1 ring-1 ring-white/20">
            <Button 
              size="sm" 
              className="rounded-full bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-white font-semibold shadow-[0_4px_20px_rgba(210,140,130,0.35)] group px-5"
              asChild
            >
              <Link to="/quiz" className="flex items-center gap-1.5">
                Get Started
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden rounded-full ${
            isScrolled 
              ? "text-foreground hover:bg-muted" 
              : "text-white hover:bg-white/10"
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
          className="fixed inset-0 top-20 z-40 bg-plum-dark/50 backdrop-blur-md md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Glass panel */}
      <div
        className={`fixed top-20 right-0 z-50 h-[calc(100vh-5rem)] w-80 bg-white/80 backdrop-blur-3xl border-l border-white/50 shadow-[0_0_50px_rgba(0,0,0,0.15)] transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-5 gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-5 py-4 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-white/60 rounded-xl"
              activeClassName="text-foreground bg-white/80 shadow-soft"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-8 pt-8 border-t border-border/50 flex flex-col gap-3">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-border/50 bg-white/50 backdrop-blur-sm py-6"
              asChild
            >
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-rose to-rose-dark text-white font-semibold shadow-rose py-6"
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
