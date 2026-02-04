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
    <section className="py-24 md:py-32 bg-gradient-to-br from-plum via-plum-dark to-plum relative overflow-hidden">
      {/* Decorative glass orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] h-[350px] w-[350px] rounded-full bg-rose/15 blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-[20%] right-[15%] h-[280px] w-[280px] rounded-full bg-rose-light/10 blur-[80px]" />
        <div className="absolute top-[50%] right-[30%] h-[200px] w-[200px] rounded-full bg-plum-light/15 blur-[70px] animate-float" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-rose font-semibold text-sm tracking-wide uppercase mb-4 block">
            Simple Process
          </span>
          <h2 className="font-display text-editorial text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Three Steps to
            <span className="rose-gradient"> Meaningful Impact</span>
          </h2>
          <p className="text-primary-foreground/60 text-lg max-w-2xl mx-auto">
            We've made giving simple, transparent, and rewarding.
          </p>
        </div>

        {/* Steps - Glass cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step) => (
            <div 
              key={step.title} 
              className="group relative flex flex-col items-center text-center p-10 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:border-rose/30 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
            >
              {/* Large step number */}
              <span className="absolute top-8 left-8 text-6xl font-bold text-white/5 group-hover:text-rose/10 transition-colors">
                {step.accent}
              </span>
              
              {/* Icon with rose gold glow */}
              <div className="relative flex h-18 w-18 items-center justify-center rounded-2xl bg-rose/20 ring-2 ring-rose/30 mb-8 shadow-rose group-hover:shadow-rose-lg transition-all">
                <step.icon className="h-9 w-9 text-rose" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-xl font-bold text-primary-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-primary-foreground/60 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="rounded-2xl bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-accent-foreground font-semibold px-12 py-7 text-base shadow-rose-lg group"
            asChild
          >
            <Link to="/quiz">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
