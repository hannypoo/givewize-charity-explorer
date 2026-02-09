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
    <footer className="relative overflow-hidden bg-footer">
      <div className="container relative py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl gradient-blue p-1 glow-blue">
                <img 
                  src={givewizeIcon} 
                  alt="GiveWiZe" 
                  className="h-full w-full object-contain rounded-lg"
                />
              </div>
              <span className="font-bold text-xl text-white">
                GiveWiZe
              </span>
            </Link>
            <p className="text-sm text-white/50 text-center md:text-left">
              Empowering thoughtful giving through transparency.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Navigate</span>
            <nav className="flex flex-col items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-end">
            <div className="flex gap-3">
              <div className="glass-dark rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-white">71</div>
                <div className="text-xs text-white/50">Charities</div>
              </div>
              <div className="glass-dark rounded-2xl p-5 text-center">
                <div className="text-2xl font-bold text-orange-light">A+</div>
                <div className="text-xs text-white/50">Rated</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2026 GiveWiZe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link to="#" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
