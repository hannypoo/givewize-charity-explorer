import { Link } from "react-router-dom";
import { ClipboardList, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: ClipboardList,
    title: "Take Our Quiz",
    description: "Answer a few questions about your values and causes you care about.",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: Sparkles,
    title: "Get Matched",
    description: "Our AI analyzes your responses to find charities aligned with your priorities.",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: ShieldCheck,
    title: "Give Confidently",
    description: "Review transparent financial data and make an informed donation.",
    color: "bg-primary text-primary-foreground",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            How GiveWiZe Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding the right charity shouldn't be hard. Our simple process helps you 
            discover causes that align with your values.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop only) */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-border hidden lg:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {/* Step number badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary text-sm font-bold text-primary">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} shadow-soft mb-6`}>
                  <step.icon className="h-8 w-8" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" className="shadow-soft" asChild>
            <Link to="/quiz">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
