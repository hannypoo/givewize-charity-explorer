import { Link } from "react-router-dom";
import givewizeIcon from "@/assets/givewize-icon.jpg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/charities", label: "Explore" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/50" />
      
      <div className="container relative py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl gradient-blue p-1 shadow-glow">
                <img 
                  src={givewizeIcon} 
                  alt="GiveWiZe" 
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <span className="font-bold text-xl text-foreground">
                GiveWiZe
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Empowering thoughtful giving through transparency.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-primary mb-4">Navigate</span>
            <nav className="flex flex-col items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-end">
            <div className="flex gap-3">
              <div className="glass rounded-2xl p-5 text-center glow-soft">
                <div className="text-2xl font-bold text-foreground">71</div>
                <div className="text-xs text-muted-foreground">Charities</div>
              </div>
              <div className="glass rounded-2xl p-5 text-center glow-soft">
                <div className="text-2xl font-bold text-accent">A+</div>
                <div className="text-xs text-muted-foreground">Rated</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 GiveWiZe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
