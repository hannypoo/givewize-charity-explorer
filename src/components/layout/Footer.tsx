import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import givewizeIcon from "@/assets/givewize-icon.jpg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/charities", label: "Explore" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl p-1.5">
                <img 
                  src={givewizeIcon} 
                  alt="GiveWiZe" 
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <span className="font-bold text-lg text-foreground">
                GiveWiZe
              </span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Empowering thoughtful giving through transparency.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-foreground mb-4">
              Navigate
            </span>
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
            <div className="flex gap-4">
              <div className="bg-secondary rounded-2xl p-4 text-center min-w-[80px]">
                <div className="text-xl font-bold text-primary">71</div>
                <div className="text-xs text-muted-foreground">Charities</div>
              </div>
              <div className="bg-accent/10 rounded-2xl p-4 text-center min-w-[80px]">
                <div className="text-xl font-bold text-accent">A+</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-accent" /> © 2025 GiveWiZe
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
