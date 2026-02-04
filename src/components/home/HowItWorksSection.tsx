import { Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Heart,
    title: "Share your values",
    description: "Take a quick quiz to tell us what causes matter most to you.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get matched",
    description: "Our AI matches you with vetted charities aligned with your priorities.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Give confidently",
    description: "Review transparent financials and donate with peace of mind.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background geometric accent */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-primary/5 -skew-x-12 origin-top-left hidden lg:block" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-4">
          <div className="flex items-start gap-4">
            <div className="w-1 h-16 bg-primary hidden md:block" />
            <div>
              <span className="text-xs font-semibold text-coral uppercase tracking-widest mb-2 block">
                Process
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                How it works
              </h2>
            </div>
          </div>
        </div>

        {/* Steps with geometric layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="relative group"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-[2px] bg-border z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-coral rotate-45" />
                </div>
              )}
              
              {/* Card */}
              <div className="relative bg-card border-2 border-border p-6 group-hover:border-primary transition-colors">
                {/* Large step number */}
                <span className="absolute top-4 right-4 text-5xl font-bold text-border group-hover:text-primary/20 transition-colors">
                  {step.number}
                </span>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-primary flex items-center justify-center mb-6">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <h3 className="font-bold text-foreground text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="rounded-none bg-coral hover:bg-coral-dark text-accent-foreground font-semibold shadow-coral group px-10 py-6"
            asChild
          >
            <Link to="/quiz">
              Start the Quiz
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
