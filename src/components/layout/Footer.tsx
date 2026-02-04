import { Link } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
import givewizeIcon from "@/assets/givewize-icon.jpg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/charities", label: "Explore" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-plum to-plum-dark border-t border-white/10">
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 group mb-5">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-white/90 to-white/70 p-1.5 ring-2 ring-rose/40 shadow-rose group-hover:ring-rose/60 transition-all">
                <img 
                  src={givewizeIcon} 
                  alt="GiveWiZe" 
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <span className="font-display text-xl font-bold text-primary-foreground">
                GiveWiZe
              </span>
            </Link>
            <p className="text-primary-foreground/50 text-sm text-center md:text-left max-w-xs leading-relaxed">
              Empowering thoughtful giving through transparency and personalized matching.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold text-rose text-sm uppercase tracking-wide mb-5">
              Navigate
            </h4>
            <nav className="flex flex-col items-center gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-primary-foreground/50 hover:text-rose transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mission Statement */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h4 className="font-semibold text-rose text-sm uppercase tracking-wide mb-5">
              Our Promise
            </h4>
            <p className="text-primary-foreground/50 text-sm max-w-xs leading-relaxed">
              Every charity is vetted. Every dollar is tracked. Your trust is our foundation.
            </p>
            <div className="flex items-center gap-2 mt-5 text-rose">
              <Heart className="h-4 w-4 fill-rose" />
              <span className="text-sm font-medium">Made with love</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/30">
            © 2025 GiveWiZe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/30">
            <Link to="#" className="hover:text-rose transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-rose transition-colors">Terms</Link>
            <Link to="#" className="hover:text-rose transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
