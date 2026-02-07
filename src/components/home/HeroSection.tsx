import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28 lg:pb-36 -mt-16 overflow-hidden bg-hero">
      {/* Soft light orbs for depth */}
      <div className="absolute top-10 left-[10%] w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-[15%] w-72 h-72 bg-orange/15 rounded-full blur-[100px]" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Glass badge */}
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
            <Sparkles className="h-4 w-4 text-orange-light" />
            <span className="text-sm font-medium text-white/80">
              Trusted by 10,000+ donors worldwide
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Give with
            <span className="relative mx-3">
              <span className="relative z-10 text-orange-light">confidence</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 2 80 2 100 6C120 10 160 4 198 8" stroke="hsl(28, 90%, 70%)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              </svg>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Discover vetted charities matched to your values. Transparent financials, real impact tracking, zero guesswork.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Button
              size="lg"
              className="text-base px-8 py-6 gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
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
              className="text-base px-8 py-6 gradient-orange font-semibold rounded-2xl text-accent-foreground hover:scale-[1.02] transition-all duration-300 glow-orange"
              asChild
            >
              <Link to="/auth">Sign Up</Link>
            </Button>
          </div>

          {/* Glass stat cards */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-dark rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">71</div>
                <div className="text-xs text-white/60">Vetted Charities</div>
              </div>
            </div>
            <div className="glass-dark rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center glow-orange">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-xs text-white/60">Transparent</div>
              </div>
            </div>
            <div className="glass-dark rounded-2xl px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-orange-light" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">A+</div>
                <div className="text-xs text-white/60">Top Rated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
