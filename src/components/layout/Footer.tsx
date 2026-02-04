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
    <footer className="bg-foreground text-background border-t-3 border-foreground">
      {/* Marquee stripe */}
      <div className="h-3 marquee-stripe" />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-background border-3 border-background p-1">
                <img 
                  src={givewizeIcon} 
                  alt="GiveWiZe" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-black text-xl uppercase">
                GiveWiZe
              </span>
            </Link>
            <p className="text-sm text-background/70 text-center md:text-left font-medium">
              Empowering thoughtful giving through transparency.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center">
            <div className="bg-accent border-3 border-background px-3 py-1 mb-4 -rotate-1">
              <span className="text-xs font-black uppercase text-accent-foreground">Navigate</span>
            </div>
            <nav className="flex flex-col items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-bold text-background/70 hover:text-accent uppercase transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Stats */}
          <div className="flex justify-center md:justify-end">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary border-3 border-background p-4 text-center">
                <div className="text-2xl font-black">71</div>
                <div className="text-xs font-bold uppercase">Charities</div>
              </div>
              <div className="bg-accent border-3 border-background p-4 text-center">
                <div className="text-2xl font-black text-accent-foreground">A+</div>
                <div className="text-xs font-bold uppercase text-accent-foreground">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t-3 border-background/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50 font-bold uppercase">
            © 2025 GiveWiZe. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-background/50 uppercase">
            <Link to="#" className="hover:text-accent transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
