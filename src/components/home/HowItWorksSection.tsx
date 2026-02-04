import { Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Heart,
    title: "Share Your Values",
    description: "Tell us what causes matter most to you through a quick, personalized quiz.",
    accent: "01",
  },
  {
    icon: Sparkles,
    title: "Get Matched",
    description: "Our AI matches you with vetted charities aligned with your priorities.",
    accent: "02",
  },
  {
    icon: ShieldCheck,
    title: "Give Confidently",
    description: "Review transparent financials and donate with complete peace of mind.",
    accent: "03",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-plum via-plum-dark to-[hsl(290,45%,10%)]" />
      
      {/* Colorful blurred orbs for glassmorphism */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[5%] left-[5%] h-[500px] w-[500px] rounded-full bg-rose/30 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] h-[450px] w-[450px] rounded-full bg-[hsl(320,50%,45%)]/25 blur-[90px]" />
        <div className="absolute top-[40%] right-[30%] h-[300px] w-[300px] rounded-full bg-rose-light/20 blur-[70px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header in glass card */}
        <div className="text-center mb-20">
          <div className="inline-block bg-white/10 backdrop-blur-2xl rounded-[2rem] px-12 py-10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            <span className="text-rose font-semibold text-sm tracking-wide uppercase mb-4 block">
              Simple Process
            </span>
            <h2 className="font-display text-editorial text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Three Steps to
              <span className="rose-gradient"> Meaningful Impact</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              We've made giving simple, transparent, and rewarding.
            </p>
          </div>
        </div>

        {/* Steps - Stacked glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="group relative"
              style={{ transform: `translateY(${index * 10}px)` }}
            >
              {/* Glass card */}
              <div className="relative h-full flex flex-col items-center text-center p-10 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/25 shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500 hover:bg-white/15 hover:border-white/35 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                {/* Inner highlight */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Large step number */}
                <span className="absolute top-6 left-6 text-7xl font-bold text-white/5 group-hover:text-rose/10 transition-colors duration-500">
                  {step.accent}
                </span>
                
                {/* Icon in glass circle */}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl ring-2 ring-rose/30 mb-8 shadow-[0_8px_30px_rgba(210,140,130,0.3)] group-hover:ring-rose/50 transition-all">
                  <step.icon className="h-9 w-9 text-rose" />
                </div>
                
                {/* Content */}
                <h3 className="relative font-display text-xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="relative text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA in glass pill */}
        <div className="text-center">
          <div className="inline-block bg-white/5 backdrop-blur-xl rounded-full p-2 border border-white/15">
            <Button 
              size="lg" 
              className="rounded-full bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-white font-semibold px-10 py-6 text-base shadow-[0_8px_30px_rgba(210,140,130,0.4)] group"
              asChild
            >
              <Link to="/quiz">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
