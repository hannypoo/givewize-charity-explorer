import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, KeyRound, User, Loader2, Check, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";

const Auth = () => {
  usePageTitle("Sign In", "Sign in or create an account to save favorites, track donations, and get personalized charity matches.");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading, signIn, signUp } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const redirectTo = (location.state as { from?: string })?.from || "/profile";

  // Already logged in — redirect away
  if (!authLoading && user) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  const passwordsMatch = tab === "signup" && password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = tab === "signup" && confirmPassword.length > 0 && password !== confirmPassword;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (tab === "signup") {
      if (!displayName.trim()) e.displayName = "Display name is required";
      if (password !== confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (tab === "signin") {
        await signIn(email, password);
        toast.success("Welcome back!");
      } else {
        await signUp(email, password, displayName.trim());
        toast.success("Account created! Welcome to GiveWiZe.");
      }
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      // Provide helpful recovery suggestions
      if (msg.includes("Invalid login credentials")) {
        toast.error("Invalid email or password. Try again or create an account.");
      } else if (msg.includes("User already registered")) {
        toast.error("An account with this email already exists. Try signing in instead.");
        setTab("signin");
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220, 72%, 50%) 0%, hsl(220, 60%, 40%) 50%, hsl(220, 50%, 30%) 100%)' }}>
        <div className="absolute top-32 right-[20%] w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-[15%] w-64 h-64 bg-orange/10 rounded-full blur-[80px]" />

        <div className="container relative flex flex-col items-center justify-center py-20 md:py-28">
          <div className="glass-dark rounded-2xl p-8 md:p-10 max-w-sm w-full animate-fade-in-up" style={{ animationDuration: "0.4s" }}>
            {/* Tab Toggle */}
            <div className="flex rounded-xl bg-white/10 p-1 mb-8">
              <button
                onClick={() => { setTab("signin"); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === "signin" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/70"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab("signup"); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === "signup" ? "bg-white/20 text-white" : "text-white/50 hover:text-white/70"}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <Label htmlFor="displayName" className="text-white/70 text-sm">Display Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      disabled={isSubmitting}
                      className="pl-10 bg-white/10 border-white/15 text-white placeholder:text-white/30 rounded-xl"
                    />
                  </div>
                  {errors.displayName && <p className="text-xs text-red-400 mt-1">{errors.displayName}</p>}
                </div>
              )}

              <div>
                <Label htmlFor="email" className="text-white/70 text-sm">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="pl-10 bg-white/10 border-white/15 text-white placeholder:text-white/30 rounded-xl"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-white/70 text-sm">Password</Label>
                <div className="relative mt-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete={tab === "signin" ? "current-password" : "new-password"}
                    disabled={isSubmitting}
                    className="pl-10 bg-white/10 border-white/15 text-white placeholder:text-white/30 rounded-xl"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              {tab === "signup" && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-white/70 text-sm">Confirm Password</Label>
                  <div className="relative mt-1">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={isSubmitting}
                      className={`pl-10 pr-10 bg-white/10 border-white/15 text-white placeholder:text-white/30 rounded-xl ${
                        passwordsMatch ? "border-emerald-400/50" : passwordsMismatch ? "border-red-400/50" : ""
                      }`}
                    />
                    {passwordsMatch && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                    )}
                    {passwordsMismatch && (
                      <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                    )}
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                  {passwordsMatch && <p className="text-xs text-emerald-400 mt-1">Passwords match</p>}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300 mt-2"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {tab === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
