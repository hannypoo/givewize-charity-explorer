import { Link } from "react-router-dom";
import { Lock, ArrowRight, Mail, KeyRound } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const Auth = () => {
  usePageTitle("Sign In", "Account features are coming soon. Explore vetted charities and take the quiz to find your perfect match.");
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220, 72%, 50%) 0%, hsl(220, 60%, 40%) 50%, hsl(220, 50%, 30%) 100%)' }}>
        <div className="absolute top-32 right-[20%] w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-[15%] w-64 h-64 bg-orange/10 rounded-full blur-[80px]" />

        <div className="container relative flex flex-col items-center justify-center py-20 md:py-28">
          <div className="glass-dark rounded-2xl p-8 md:p-10 max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-white/60" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Sign In
            </h1>
            <p className="text-white/50 text-sm mb-8">
              Account features are coming soon. In the meantime, explore charities and take the quiz!
            </p>

            {/* Preview form fields (disabled) */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/15">
                <Mail className="h-4 w-4 text-white/30" />
                <span className="text-sm text-white/30">Email address</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 border border-white/15">
                <KeyRound className="h-4 w-4 text-white/30" />
                <span className="text-sm text-white/30">Password</span>
              </div>
            </div>

            <Button
              disabled
              className="w-full gradient-orange text-accent-foreground font-semibold rounded-2xl opacity-50 cursor-not-allowed mb-6"
            >
              Coming Soon
            </Button>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link to="/quiz">
                  Take the Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full border-white/25 text-white hover:bg-white/15 rounded-2xl"
                asChild
              >
                <Link to="/charities">Browse Charities</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
