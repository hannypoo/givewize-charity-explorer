import { Link } from "react-router-dom";
import logoImage from "@/assets/givewize-logo-transparent.jpg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/charities", label: "Explore" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="bg-[#374151] border-t border-[#4B5563]">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="GiveWiZe" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-400">
              Give With Confidence
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[#4B5563]">
          <p className="text-sm text-gray-500 text-center">
            © 2025 GiveWiZe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
