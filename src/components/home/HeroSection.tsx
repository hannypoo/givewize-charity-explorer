import { Link } from "react-router-dom";
import { ArrowRight, Shield, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Deep navy background with warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy" />
      
      {/* Decorative gold accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[15%] h-[400px] w-[400px] rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-20 left-[10%] h-[300px] w-[300px] rounded-full bg-gold/8 blur-[100px]" />
        <div className="absolute top-1/2 right-[40%] h-[200px] w-[200px] rounded-full bg-gold-light/5 blur-[80px]" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:40px_40px]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Editorial Typography */}
          <div className="text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-medium text-gold border border-gold/20 mb-8">
              <Shield className="h-4 w-4" />
              <span>Trusted by 10,000+ Generous Hearts</span>
            </div>

            {/* Large editorial headline */}
            <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6">
              Give With
              <span className="block mt-2 gold-gradient">
                Purpose.
              </span>
              <span className="block text-primary-foreground/90 mt-2">
                Give With
              </span>
              <span className="block gold-gradient mt-2">
                Confidence.
              </span>
            </h1>

            {/* Subheadline with warmth */}
            <p className="text-lg md:text-xl text-primary-foreground/70 max-w-lg leading-relaxed mb-10">
              Discover vetted charities matched to your values. 
              <span className="text-gold font-medium"> Complete transparency. </span>
              Real impact.
            </p>

            {/* CTAs with gold accent */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="group text-base px-8 py-6 rounded-full bg-gold hover:bg-gold-dark text-accent-foreground font-semibold shadow-gold-lg transition-all duration-300 hover:shadow-gold hover:-translate-y-0.5"
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
                className="text-base px-8 py-6 rounded-full border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
                asChild
              >
                <Link to="/charities">Explore All Charities</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-8 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse" />
                <span>71 Vetted Charities</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold" />
                <span>100% Transparent</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-gold" />
                <span>AI-Powered Matching</span>
              </div>
            </div>
          </div>

          {/* Right Column - Floating Logo Card */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-gold/20 via-gold-light/10 to-gold/20 blur-2xl animate-float" />
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-card/95 to-card rounded-3xl p-8 shadow-elevated ring-1 ring-gold/20">
                {/* Gold accent line */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
                
                {/* Logo container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full" />
                  <div className="relative bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-6 ring-2 ring-gold/30 shadow-gold">
                    <img 
                      src={givewizeIcon} 
                      alt="GiveWiZe" 
                      className="h-32 w-32 object-contain"
                    />
                  </div>
                </div>

                {/* Stats below logo */}
                <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="text-2xl font-bold text-foreground">71</div>
                    <div className="text-xs text-muted-foreground">Charities</div>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <div className="text-2xl font-bold text-gold">A+</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
                  </div>
                </div>

                {/* Sparkle decoration */}
                <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-gold animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
