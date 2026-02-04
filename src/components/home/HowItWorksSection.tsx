import { Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Heart,
    title: "Share Values",
    description: "Take a quick quiz to tell us what causes matter most to you.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get Matched",
    description: "Our AI matches you with vetted charities aligned with your priorities.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Give Confident",
    description: "Review transparent financials and donate with peace of mind.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Diagonal stripe accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 origin-top-right hidden lg:block" />
      
      <div className="container relative">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-block bg-primary border-3 border-foreground px-3 py-1 mb-4 rotate-1 brutal-shadow-sm">
            <span className="text-xs font-black uppercase text-primary-foreground">Process</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight">
            How it works
          </h2>
        </div>

        {/* Steps - Brutalist cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="relative group"
              style={{ transform: `rotate(${index === 1 ? '1' : index === 2 ? '-1' : '0'}deg)` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-6 h-3 border-t-3 border-r-3 border-foreground z-10" />
              )}
              
              {/* Card with stacked effect */}
              <div className="absolute top-2 left-2 w-full h-full bg-accent border-3 border-foreground hidden group-hover:block" />
              
              <div className="relative bg-card border-3 border-foreground p-6 brutal-shadow group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all">
                {/* Step number - huge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-foreground border-3 border-foreground flex items-center justify-center rotate-6">
                  <span className="text-lg font-black text-background">{step.number}</span>
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-primary border-3 border-foreground flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                
                <h3 className="font-black text-foreground text-xl uppercase mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
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
            className="bg-accent hover:bg-accent text-accent-foreground font-black uppercase border-3 border-foreground brutal-shadow-lg hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all px-12 py-6 text-lg"
            asChild
          >
            <Link to="/quiz">
              Start Quiz Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
