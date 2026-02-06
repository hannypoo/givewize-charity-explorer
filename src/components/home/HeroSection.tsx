import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden section-gradient-warm">
      {/* Soft decorative orbs */}
      <div className="absolute top-10 left-[15%] w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-[10%] w-72 h-72 bg-accent/12 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-glow/5 rounded-full blur-[120px]" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Glass badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground/70">
              Trusted by 10,000+ donors worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 tracking-tight">
            Give with
            <span className="relative mx-3">
              <span className="relative z-10 bg-gradient-to-r from-primary to-blue-light bg-clip-text text-transparent">confidence</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 2 80 2 100 6C120 10 160 4 198 8" stroke="hsl(25, 95%, 58%)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Discover vetted charities matched to your values. Transparent financials, real impact tracking, zero guesswork.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Button
              size="lg"
              className="text-base px-8 py-6 gradient-blue text-primary-foreground font-semibold rounded-2xl glow-blue hover:scale-[1.02] transition-all duration-300"
              asChild
            >
              <Link to="/quiz">
                Find Your Cause
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 glass font-semibold rounded-2xl text-foreground hover:shadow-lg transition-all duration-300"
              asChild
            >
              <Link to="/charities">Explore Charities</Link>
            </Button>
          </div>

          {/* Glass stat cards */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-strong rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-blue flex items-center justify-center glow-blue">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-foreground">71</div>
                <div className="text-xs text-muted-foreground">Vetted Charities</div>
              </div>
            </div>
            <div className="glass-strong rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center glow-orange">
                <TrendingUp className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-foreground">100%</div>
                <div className="text-xs text-muted-foreground">Transparent</div>
              </div>
            </div>
            <div className="glass-strong rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-foreground">A+</div>
                <div className="text-xs text-muted-foreground">Top Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
