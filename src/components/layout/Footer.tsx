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
    <footer className="bg-foreground text-background">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-primary via-coral to-primary" />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 border-2 border-background/30 p-1">
                <img 
                  src={givewizeIcon} 
                  alt="GiveWiZe" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-bold text-lg">
                GiveWiZe
              </span>
            </Link>
            <p className="text-sm text-background/60 text-center md:text-left">
              Empowering thoughtful giving through transparency.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-coral mb-4">
              Navigate
            </span>
            <nav className="flex flex-col items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-background/60 hover:text-coral transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-end">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-background/20 p-4 text-center">
                <div className="text-2xl font-bold text-coral">71</div>
                <div className="text-xs text-background/50 uppercase tracking-wide">Charities</div>
              </div>
              <div className="border border-background/20 p-4 text-center">
                <div className="text-2xl font-bold text-primary">A+</div>
                <div className="text-xs text-background/50 uppercase tracking-wide">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">
            © 2025 GiveWiZe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/40">
            <Link to="#" className="hover:text-coral transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-coral transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
