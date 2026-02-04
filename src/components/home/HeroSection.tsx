import { Link } from "react-router-dom";
import { ArrowRight, Shield, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Vibrant gradient background with multiple color stops */}
      <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum-dark to-[hsl(300,40%,12%)]" />
      
      {/* Large colorful blurred orbs - the key to glassmorphism backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[700px] w-[700px] rounded-full bg-rose/40 blur-[120px]" />
        <div className="absolute top-[20%] -left-[15%] h-[600px] w-[600px] rounded-full bg-[hsl(320,60%,50%)]/30 blur-[100px]" />
        <div className="absolute -bottom-[10%] right-[20%] h-[500px] w-[500px] rounded-full bg-rose-light/25 blur-[90px]" />
        <div className="absolute top-[50%] left-[40%] h-[400px] w-[400px] rounded-full bg-[hsl(280,50%,40%)]/30 blur-[80px]" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content in glass card */}
          <div className="relative">
            {/* Main content glass card */}
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-12 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              {/* Inner glow effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Glass pill badge */}
              <div className="relative inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-xl px-5 py-2.5 text-sm font-medium text-rose-light border border-white/25 mb-8 shadow-lg">
                <Shield className="h-4 w-4" />
                <span>Trusted by 10,000+ Generous Hearts</span>
              </div>

              {/* Headline */}
              <h1 className="relative text-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 leading-[1.1]">
                Give With
                <span className="block rose-gradient mt-2">
                  Purpose.
                </span>
                <span className="block text-white/90 mt-2">
                  Give With
                </span>
                <span className="block rose-gradient mt-2">
                  Confidence.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="relative text-lg md:text-xl text-white/70 max-w-md leading-relaxed mb-10">
                Discover vetted charities matched to your values. 
                <span className="text-rose font-medium"> Complete transparency. </span>
                Real impact.
              </p>

              {/* CTAs */}
              <div className="relative flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="group text-base px-8 py-6 rounded-2xl bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-white font-semibold shadow-[0_8px_30px_rgba(210,140,130,0.4)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(210,140,130,0.5)] hover:-translate-y-1"
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
                  className="text-base px-8 py-6 rounded-2xl border-2 border-white/30 text-white bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  asChild
                >
                  <Link to="/charities">Explore Charities</Link>
                </Button>
              </div>
            </div>

            {/* Floating glass trust badges */}
            <div className="flex flex-wrap gap-3 mt-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/20 shadow-lg">
                <div className="h-2 w-2 rounded-full bg-rose animate-pulse" />
                <span className="text-sm text-white/80">71 Vetted Charities</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/20 shadow-lg">
                <Shield className="h-4 w-4 text-rose" />
                <span className="text-sm text-white/80">100% Transparent</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/20 shadow-lg">
                <Heart className="h-4 w-4 text-rose" />
                <span className="text-sm text-white/80">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Right Column - Layered Glass Cards */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Background decorative glass card */}
              <div className="absolute -top-8 -left-8 w-72 h-72 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 rotate-6" />
              
              {/* Middle decorative glass card */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-rose/10 backdrop-blur-xl rounded-[2rem] border border-rose/20 -rotate-3" />
              
              {/* Main glass card with logo */}
              <div className="relative bg-white/15 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/30 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
                {/* Top highlight gradient */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-[2rem] pointer-events-none" />
                
                {/* Rose gold accent line */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-rose to-transparent" />
                
                {/* Logo in glass container */}
                <div className="relative mb-8">
                  <div className="absolute -inset-4 bg-rose/20 blur-2xl rounded-full" />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-[0_10px_40px_rgba(210,140,130,0.3)] ring-2 ring-white/50">
                    <img 
                      src={givewizeIcon} 
                      alt="GiveWiZe" 
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                </div>

                {/* Stats in nested glass cards */}
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-center">
                    <div className="text-3xl font-bold text-white">71</div>
                    <div className="text-xs text-white/60 mt-1">Charities</div>
                  </div>
                  <div className="p-5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-center">
                    <div className="text-3xl font-bold text-rose">A+</div>
                    <div className="text-xs text-white/60 mt-1">Avg Rating</div>
                  </div>
                </div>

                {/* Sparkle decorations */}
                <Sparkles className="absolute -top-5 -right-5 h-10 w-10 text-rose drop-shadow-lg" />
                <Sparkles className="absolute -bottom-3 -left-3 h-6 w-6 text-rose-light drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave transition */}
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
