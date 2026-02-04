import { Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "1",
    icon: Heart,
    title: "Share your values",
    description: "Take a quick quiz to tell us what causes matter most to you.",
  },
  {
    number: "2",
    icon: Sparkles,
    title: "Get matched",
    description: "Our AI matches you with vetted charities aligned with your priorities.",
  },
  {
    number: "3",
    icon: ShieldCheck,
    title: "Give confidently",
    description: "Review transparent financials and donate with peace of mind.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      {/* Organic blob accents */}
      <div className="absolute top-10 right-[10%] w-64 h-64 bg-accent/5 blob-shape blur-3xl hidden lg:block" />
      <div className="absolute bottom-10 left-[5%] w-48 h-48 bg-primary/5 blob-shape blur-3xl hidden lg:block" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-3">
            <span className="w-8 h-[2px] bg-primary rounded-full" />
            How it works
            <span className="w-8 h-[2px] bg-primary rounded-full" />
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
            Three simple steps
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Finding the right charity has never been easier
          </p>
        </div>

        {/* Steps with organic styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="relative group"
            >
              {/* Connecting curve on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-8">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path 
                      d="M0,10 Q50,20 100,10" 
                      fill="none" 
                      stroke="hsl(var(--border))" 
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>
                </div>
              )}
              
              {/* Card */}
              <div className="relative bg-card rounded-3xl border border-border p-8 text-center hover:shadow-card transition-all duration-300 group-hover:border-primary/20">
                {/* Step number bubble */}
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-warm">
                  <span className="text-sm font-bold text-accent-foreground">{step.number}</span>
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                
                <h3 className="font-semibold text-foreground text-lg mb-3">
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
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-warm group px-10 py-6"
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
