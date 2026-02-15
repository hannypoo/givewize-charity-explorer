import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Loader2, Check, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTitle } from "@/hooks/usePageTitle";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  usePageTitle("Reset Password", "Set a new password for your GiveWiZe account.");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Wait for Supabase to process the auth code from the URL
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setIsReady(true);
      }
    });
    // Also check if already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const passwordsMatch = newPassword.length > 0 && confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const passwordsMismatch = confirmNewPassword.length > 0 && newPassword !== confirmNewPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully!");
      navigate("/profile", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password.");
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
            {!isReady ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-white/50 mx-auto mb-4" />
                <p className="text-white/50 text-sm">Verifying your reset link...</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-2">Set New Password</h2>
                <p className="text-white/50 text-sm mb-6">Enter your new password below.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword" className="text-white/70 text-sm">New Password</Label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        className="pl-10 bg-white/10 border-white/15 text-white placeholder:text-white/30 rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword" className="text-white/70 text-sm">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300 mt-2"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Password
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPassword;
