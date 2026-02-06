import { Heart, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Heart,
    title: "Share Your Values",
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
    title: "Give Confidently",
    description: "Review transparent financials and donate with peace of mind.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-how-it-works">
      {/* Light orbs */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-[15%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-white/80">How it works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Three simple steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[calc(100%+0.25rem)] w-[calc(100%-3.5rem)] h-px">
                  <div className="w-full h-full border-t-2 border-dashed border-white/20" />
                </div>
              )}
              
              <div className="glass-dark rounded-2xl p-6 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white text-sm font-bold mb-4">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-bold text-white text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
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
            className="bg-white text-foreground font-semibold rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 px-10 py-6 text-base"
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
