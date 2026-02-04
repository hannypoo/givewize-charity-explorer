import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Building2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background py-16 md:py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Discover your perfect charity match</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Give With <span className="text-primary">Confidence</span>.{" "}
            <br className="hidden sm:block" />
            Give With <span className="text-accent">Purpose</span>.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            AI-powered charity matching that helps you find vetted organizations 
            aligned with your values—with complete financial transparency.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 shadow-soft" asChild>
              <Link to="/quiz">
                Take the Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/charities">Explore Charities</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={Building2} value="500+" label="Verified Charities" />
            <StatCard icon={Users} value="10K+" label="Happy Donors" />
            <StatCard icon={TrendingUp} value="$2M+" label="Donated" />
            <StatCard icon={Sparkles} value="15+" label="Cause Categories" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-card shadow-card p-4 border border-border/50">
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-display text-2xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  );
}
