import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-background to-secondary/50 py-28 md:py-36 lg:py-48 overflow-hidden">
      {/* Rich decorative blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 -left-24 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo with glow effect */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
              <div className="relative rounded-2xl bg-card p-3 shadow-xl shadow-primary/10 ring-1 ring-primary/10">
                <img 
                  src={givewizeIcon} 
                  alt="" 
                  className="h-16 w-16 object-contain rounded-lg"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Pill badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            <Sparkles className="h-4 w-4" />
            <span>Trusted by 10,000+ donors</span>
          </div>

          {/* Headline with gradient */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08]">
            Give With{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Confidence.
            </span>
            <br />
            Give With{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-primary bg-clip-text text-transparent">
              Purpose.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Find vetted charities matched to your values—with complete financial transparency.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="group text-base px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
              asChild
            >
              <Link to="/quiz">
                Take the Quiz
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 rounded-full border-2 border-primary/30 text-primary bg-card/50 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
              asChild
            >
              <Link to="/charities">Explore Charities</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>71 Vetted Charities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>100% Transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>AI-Powered Matching</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
