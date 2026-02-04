import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Geometric background pattern */}
      <div className="absolute inset-0 geometric-dots opacity-50" />
      
      {/* Geometric accent shapes */}
      <div className="absolute top-20 right-[10%] w-64 h-64 border-2 border-primary/20 rotate-45 hidden lg:block" />
      <div className="absolute bottom-32 left-[5%] w-40 h-40 bg-coral/10 rotate-12 hidden lg:block" />
      <div className="absolute top-40 left-[15%] w-24 h-24 border-2 border-coral/20 hidden lg:block" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Geometric badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-semibold text-primary mb-8">
              <div className="w-2 h-2 bg-coral rotate-45" />
              <span>TRUSTED BY 10,000+ DONORS</span>
            </div>

            {/* Headline with geometric accent */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
              Give with
              <span className="relative inline-block ml-3">
                <span className="text-primary">purpose.</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-coral" />
              </span>
              <br />
              Give with
              <span className="relative inline-block ml-3">
                <span className="text-primary">confidence.</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-coral" />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mb-10">
              Find vetted charities matched to your values. Complete financial transparency for every organization.
            </p>

            {/* CTAs with geometric style */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="group text-base px-8 py-6 rounded-none bg-coral hover:bg-coral-dark text-accent-foreground font-semibold shadow-coral transition-all hover:-translate-y-0.5"
                asChild
              >
                <Link to="/quiz">
                  Find Your Cause
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-6 rounded-none border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-all"
                asChild
              >
                <Link to="/charities">Explore Charities</Link>
              </Button>
            </div>

            {/* Stats row - geometric boxes */}
            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">71</span>
                </div>
                <span className="text-sm text-muted-foreground">Vetted<br />Charities</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-coral flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">100%<br />Transparent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border-2 border-primary flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">AI-Powered<br />Matching</span>
              </div>
            </div>
          </div>

          {/* Right Column - Geometric Logo Display */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Geometric frame layers */}
              <div className="absolute -inset-8 border-2 border-primary/30 rotate-3" />
              <div className="absolute -inset-4 border-2 border-coral/30 -rotate-2" />
              
              {/* Main card */}
              <div className="relative bg-card border-2 border-foreground p-10 shadow-elevated">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-coral" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-primary" />
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-primary" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-coral" />

                {/* Logo */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto border-2 border-primary p-2">
                    <img 
                      src={givewizeIcon} 
                      alt="GiveWiZe" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-2 border-border p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">71</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Charities</div>
                  </div>
                  <div className="border-2 border-border p-4 text-center">
                    <div className="text-2xl font-bold text-coral">A+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Rating</div>
                  </div>
                </div>
              </div>

              {/* Floating geometric elements */}
              <div className="absolute -top-12 -right-12 w-8 h-8 bg-coral rotate-45" />
              <div className="absolute -bottom-8 -left-8 w-6 h-6 border-2 border-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
