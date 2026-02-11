import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, User, LogOut, Heart, ChevronDown, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import givewizeIcon from "@/assets/givewize-icon.svg";
import { toast } from "sonner";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/charities", label: "Explore" },
  { to: "/quiz", label: "Quiz" },
  { to: "/about", label: "About" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (showDropdown) setShowDropdown(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, showDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const initials = (profile?.display_name || user?.email || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = async () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isScrolled ? "glass-nav" : "bg-transparent"
        }`}
      />

      <div className="container relative flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 rounded-xl gradient-blue p-1 glow-blue group-hover:scale-105 transition-all duration-300">
            <img
              src={givewizeIcon}
              alt="GiveWiZe"
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <span className={`font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? "text-foreground" : "text-white"}`}>
            GiveWi<span className="text-orange-light">Z</span>e
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                isScrolled
                  ? "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
              activeClassName={isScrolled ? "text-primary bg-primary/5 font-semibold" : "text-white bg-white/15 font-semibold"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  isScrolled
                    ? "hover:bg-foreground/5"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {initials}
                </div>
                <span className={`text-sm font-medium ${isScrolled ? "text-foreground/80" : "text-white/80"}`}>
                  {profile?.display_name || "Account"}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showDropdown ? "rotate-180" : ""} ${isScrolled ? "text-foreground/50" : "text-white/50"}`} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-border py-1 z-50 animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
                  <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </Link>
                  <Link to="/profile#my-charities" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    My Charities
                  </Link>
                  <button
                    onClick={async () => {
                      setShowDropdown(false);
                      const url = `${window.location.origin}/auth`;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: "Join GiveWiZe", text: "Discover and support amazing charities with GiveWiZe!", url });
                        } catch { /* user cancelled */ }
                      } else {
                        await navigator.clipboard.writeText(url);
                        toast.success("Invite link copied to clipboard!");
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                  >
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                    Invite a Friend
                  </button>
                  <div className="border-t border-border my-1" />
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors w-full text-left">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className={`font-medium rounded-xl transition-colors duration-300 ${
                  isScrolled
                    ? "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                asChild
              >
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button
                size="sm"
                className="gradient-orange text-accent-foreground font-semibold rounded-xl glow-orange hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link to="/quiz" className="flex items-center gap-1.5">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`md:hidden rounded-xl transition-colors duration-300 ${isScrolled ? "text-foreground hover:bg-foreground/5" : "text-white hover:bg-white/10"}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        role="dialog"
        aria-label="Navigation menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 glass-strong transform transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 text-sm font-medium text-foreground/60 rounded-xl transition-all hover:text-foreground hover:bg-foreground/5"
              activeClassName="text-primary bg-primary/5 font-semibold"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-foreground">{profile?.display_name || "Account"}</span>
                </div>
                <Button variant="outline" className="w-full rounded-xl font-medium" asChild>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl font-medium"
                  onClick={async () => {
                    setIsMobileMenuOpen(false);
                    const url = `${window.location.origin}/auth`;
                    if (navigator.share) {
                      try {
                        await navigator.share({ title: "Join GiveWiZe", text: "Discover and support amazing charities with GiveWiZe!", url });
                      } catch { /* user cancelled */ }
                    } else {
                      await navigator.clipboard.writeText(url);
                      toast.success("Invite link copied to clipboard!");
                    }
                  }}
                >
                  Invite a Friend
                </Button>
                <Button variant="outline" className="w-full rounded-xl font-medium" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full rounded-xl font-medium"
                  asChild
                >
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  className="w-full gradient-orange text-accent-foreground font-semibold rounded-xl glow-orange"
                  asChild
                >
                  <Link to="/quiz" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
