import { Link } from "react-router-dom";
import { ArrowRight, Zap, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Marquee stripe accent */}
      <div className="absolute top-0 left-0 right-0 h-3 marquee-stripe" />
      
      <div className="container relative">
        {/* Asymmetric layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main content - takes more space */}
          <div className="lg:col-span-7 pt-8">
            {/* Brutalist badge */}
            <div className="inline-block bg-accent border-3 border-foreground px-4 py-2 brutal-shadow mb-8 -rotate-1">
              <span className="text-sm font-black uppercase tracking-wider text-accent-foreground">
                ★ 10,000+ Donors Trust Us ★
              </span>
            </div>

            {/* MASSIVE headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-foreground uppercase leading-[0.9] mb-6 tracking-tight">
              Give
              <span className="block text-primary">With</span>
              <span className="block relative">
                Purpose
                <div className="absolute -bottom-2 left-0 w-full h-4 bg-accent -rotate-1" />
              </span>
            </h1>

            {/* Subheadline in a box */}
            <div className="bg-secondary border-3 border-foreground p-4 brutal-shadow max-w-md mb-8 rotate-1">
              <p className="text-lg font-bold text-foreground">
                Find vetted charities. Complete transparency. Zero BS.
              </p>
            </div>

            {/* Brutalist CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button 
                size="lg" 
                className="group text-base px-8 py-6 bg-primary hover:bg-primary border-3 border-foreground text-primary-foreground font-black uppercase tracking-wide brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
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
                className="text-base px-8 py-6 bg-background border-3 border-foreground text-foreground font-black uppercase tracking-wide brutal-shadow hover:bg-accent hover:text-accent-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                asChild
              >
                <Link to="/charities">Explore</Link>
              </Button>
            </div>

            {/* Raw stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-foreground text-background px-4 py-2 border-3 border-foreground">
                <span className="font-black text-xl">71</span>
                <span className="text-sm ml-1">CHARITIES</span>
              </div>
              <div className="bg-accent text-accent-foreground px-4 py-2 border-3 border-foreground">
                <span className="font-black text-xl">100%</span>
                <span className="text-sm ml-1">VETTED</span>
              </div>
              <div className="bg-primary text-primary-foreground px-4 py-2 border-3 border-foreground">
                <span className="font-black text-xl">A+</span>
                <span className="text-sm ml-1">RATED</span>
              </div>
            </div>
          </div>

          {/* Right side - Brutalist card stack */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative mt-12">
              {/* Stacked cards effect */}
              <div className="absolute top-4 left-4 w-full h-full bg-accent border-3 border-foreground" />
              <div className="absolute top-2 left-2 w-full h-full bg-primary border-3 border-foreground" />
              
              {/* Main card */}
              <div className="relative bg-card border-3 border-foreground p-8">
                {/* Corner label */}
                <div className="absolute -top-4 -right-4 bg-accent border-3 border-foreground px-3 py-1 rotate-6">
                  <span className="text-xs font-black uppercase">Featured</span>
                </div>

                {/* Logo */}
                <div className="w-32 h-32 mx-auto border-3 border-foreground p-2 mb-6 bg-background brutal-shadow">
                  <img 
                    src={givewizeIcon} 
                    alt="GiveWiZe" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-center font-black text-2xl uppercase mb-4">GiveWiZe</h3>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary border-3 border-foreground p-3 text-center brutal-shadow-sm">
                    <Zap className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-bold uppercase">AI Match</div>
                  </div>
                  <div className="bg-secondary border-3 border-foreground p-3 text-center brutal-shadow-sm">
                    <Star className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-bold uppercase">Top Rated</div>
                  </div>
                  <div className="bg-secondary border-3 border-foreground p-3 text-center brutal-shadow-sm">
                    <Eye className="h-5 w-5 mx-auto mb-1" />
                    <div className="text-xs font-bold uppercase">Transparent</div>
                  </div>
                  <div className="bg-accent border-3 border-foreground p-3 text-center brutal-shadow-sm">
                    <span className="text-lg font-black">71</span>
                    <div className="text-xs font-bold uppercase">Causes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
