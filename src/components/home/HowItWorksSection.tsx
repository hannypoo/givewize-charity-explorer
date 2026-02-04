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
    <section className="py-20 md:py-28">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Three simple steps to find your perfect charity match.
          </p>
        </div>

        {/* Steps - Clean cards with numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {steps.map((step) => (
            <div 
              key={step.title} 
              className="relative p-6 rounded-xl bg-card border border-border"
            >
              {/* Step number */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                {step.number}
              </div>
              
              <h3 className="font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="rounded-xl bg-accent hover:bg-terracotta-dark text-accent-foreground font-medium shadow-soft"
            asChild
          >
            <Link to="/quiz">
              Start the quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
