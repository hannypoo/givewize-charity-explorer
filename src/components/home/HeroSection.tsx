import { Link } from "react-router-dom";
import { ArrowRight, Shield, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Rich plum gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum-dark to-plum" />
      
      {/* Glassmorphic decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[20%] h-[450px] w-[450px] rounded-full bg-rose/20 blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-[15%] left-[5%] h-[350px] w-[350px] rounded-full bg-rose-light/15 blur-[80px]" />
        <div className="absolute top-[40%] left-[30%] h-[300px] w-[300px] rounded-full bg-plum-light/20 blur-[90px]" />
        <div className="absolute bottom-[30%] right-[10%] h-[200px] w-[200px] rounded-full bg-rose/10 blur-[60px] animate-float" />
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Glass pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-rose-light border border-white/20 mb-10 shadow-glass">
              <Shield className="h-4 w-4" />
              <span>Trusted by 10,000+ Generous Hearts</span>
            </div>

            {/* Large headline with rose gold gradient */}
            <h1 className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-8 leading-[1.1]">
              Give With
              <span className="block rose-gradient mt-3">
                Purpose.
              </span>
              <span className="block text-primary-foreground/90 mt-3">
                Give With
              </span>
              <span className="block rose-gradient mt-3">
                Confidence.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-primary-foreground/70 max-w-lg leading-relaxed mb-12">
              Discover vetted charities matched to your values. 
              <span className="text-rose font-medium"> Complete transparency. </span>
              Real impact.
            </p>

            {/* CTAs - Glass style */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Button 
                size="lg" 
                className="group text-base px-10 py-7 rounded-2xl bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-accent-foreground font-semibold shadow-rose-lg transition-all duration-300 hover:shadow-rose hover:-translate-y-1"
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
                className="text-base px-10 py-7 rounded-2xl border-2 border-white/25 text-primary-foreground bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:border-white/40 transition-all duration-300"
                asChild
              >
                <Link to="/charities">Explore All Charities</Link>
              </Button>
            </div>

            {/* Trust indicators - Glass style */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <div className="h-2 w-2 rounded-full bg-rose animate-pulse" />
                <span>71 Vetted Charities</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Shield className="h-4 w-4 text-rose" />
                <span>100% Transparent</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                <Heart className="h-4 w-4 text-rose" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Right Column - Floating Glass Card with Logo */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute -inset-12 rounded-[2rem] bg-gradient-to-br from-rose/30 via-rose-light/20 to-rose/30 blur-3xl animate-glow-pulse" />
              
              {/* Main glass card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2rem] p-10 shadow-elevated border border-white/20">
                {/* Rose gold accent line */}
                <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-rose to-transparent rounded-full" />
                
                {/* Logo container with glow */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-rose/30 blur-3xl rounded-full" />
                  <div className="relative bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-sm rounded-2xl p-6 ring-2 ring-rose/40 shadow-rose-lg">
                    <img 
                      src={givewizeIcon} 
                      alt="GiveWiZe" 
                      className="h-28 w-28 object-contain"
                    />
                  </div>
                </div>

                {/* Stats in glass pills */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                    <div className="text-3xl font-bold text-primary-foreground">71</div>
                    <div className="text-xs text-primary-foreground/60 mt-1">Vetted Charities</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                    <div className="text-3xl font-bold text-rose">A+</div>
                    <div className="text-xs text-primary-foreground/60 mt-1">Avg Rating</div>
                  </div>
                </div>

                {/* Decorative sparkles */}
                <Sparkles className="absolute -top-6 -right-6 h-10 w-10 text-rose animate-pulse" />
                <Sparkles className="absolute -bottom-4 -left-4 h-6 w-6 text-rose-light animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth wave transition */}
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
