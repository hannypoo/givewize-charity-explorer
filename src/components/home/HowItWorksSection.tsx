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
    <section className="py-24 md:py-32 bg-gradient-to-br from-navy via-navy-dark to-navy relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] h-[300px] w-[300px] rounded-full bg-gold/8 blur-[100px]" />
        <div className="absolute bottom-20 right-[15%] h-[250px] w-[250px] rounded-full bg-gold/6 blur-[80px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header - Centered editorial */}
        <div className="text-center mb-20">
          <span className="text-gold font-semibold text-sm tracking-wide uppercase mb-4 block">
            Simple Process
          </span>
          <h2 className="font-display text-editorial text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Three Steps to
            <span className="gold-gradient"> Meaningful Impact</span>
          </h2>
          <p className="text-primary-foreground/60 text-lg max-w-2xl mx-auto">
            We've made giving simple, transparent, and rewarding.
          </p>
        </div>

        {/* Steps - Editorial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="group relative flex flex-col items-center text-center p-8 md:p-10 bg-card/5 backdrop-blur-sm rounded-3xl border border-primary-foreground/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Large step number - editorial style */}
              <span className="absolute top-6 left-6 text-6xl font-bold text-primary-foreground/5 group-hover:text-gold/10 transition-colors">
                {step.accent}
              </span>
              
              {/* Icon with gold accent */}
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20 ring-2 ring-gold/30 mb-6 shadow-gold">
                <step.icon className="h-8 w-8 text-gold" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
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
            className="rounded-full bg-gold hover:bg-gold-dark text-accent-foreground font-semibold px-10 py-6 text-base shadow-gold-lg group"
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
