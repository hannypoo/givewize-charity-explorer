import { Link } from "react-router-dom";
import { ArrowRight, Heart, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36 overflow-hidden">
      {/* Soft gradient background */}
      <div className="absolute inset-0 gradient-warm" />
      
      {/* Organic blob shapes */}
      <div className="absolute top-20 right-[5%] w-72 h-72 bg-primary/5 blob-shape blur-3xl hidden lg:block" />
      <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-accent/8 blob-shape blur-3xl hidden lg:block" />
      <div className="absolute top-40 left-[30%] w-48 h-48 bg-primary/3 blob-shape blur-2xl hidden lg:block" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Soft badge */}
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-5 py-2.5 text-sm font-medium text-accent mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 10,000+ donors</span>
            </div>

            {/* Warm, friendly headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] mb-6">
              Give with
              <span className="relative inline-block mx-3 text-primary">
                heart.
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q25,0 50,8 T100,8" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              <br />
              Give with
              <span className="relative inline-block mx-3 text-primary">
                confidence.
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q25,0 50,8 T100,8" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10">
              Discover charities that align with your values. Every organization is vetted for transparency and real-world impact.
            </p>

            {/* Rounded CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                size="lg" 
                className="group text-base px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow transition-all hover:shadow-lg hover:-translate-y-0.5"
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
                className="text-base px-8 py-6 rounded-full border-2 border-muted-foreground/20 text-foreground hover:bg-secondary hover:border-primary/30 transition-all"
                asChild
              >
                <Link to="/charities">Explore Charities</Link>
              </Button>
            </div>

            {/* Soft stat pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">71 Charities</span>
              </div>
              <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">100% Vetted</span>
              </div>
              <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">10K+ Donors</span>
              </div>
            </div>
          </div>

          {/* Right Column - Organic Logo Display */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Soft glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 rounded-[3rem] blur-2xl scale-110" />
              
              {/* Main card with organic shape */}
              <div className="relative bg-card/80 backdrop-blur-sm rounded-[2.5rem] p-10 shadow-elevated border border-border/50">
                {/* Logo with soft container */}
                <div className="relative mb-8">
                  <div className="w-36 h-36 mx-auto bg-gradient-to-br from-primary/10 to-accent/5 rounded-[2rem] p-4 shadow-soft">
                    <img 
                      src={givewizeIcon} 
                      alt="GiveWiZe" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  {/* Floating accent */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full shadow-warm" />
                </div>

                {/* Stats with organic styling */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">71</div>
                    <div className="text-xs text-muted-foreground font-medium">Charities</div>
                  </div>
                  <div className="bg-accent/10 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent">A+</div>
                    <div className="text-xs text-muted-foreground font-medium">Rated</div>
                  </div>
                </div>
              </div>

              {/* Floating organic elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-accent/20 rounded-full blur-sm" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-primary/20 rounded-full blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
