import { Heart, Sparkles, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Heart,
    title: "Share Your Values",
    description: "Tell us what causes matter most to you through a quick quiz.",
  },
  {
    icon: Sparkles,
    title: "Get Matched",
    description: "We'll match you with vetted charities aligned with your priorities.",
  },
  {
    icon: ShieldCheck,
    title: "Give Confidently",
    description: "Review transparent financials and donate with peace of mind.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-[#1a365d] sm:text-4xl">
            How It Works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.title} 
              className="relative flex flex-col items-center text-center p-8 bg-[#F8FAFC] rounded-2xl shadow-sm"
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-sm font-medium text-[#9CA3AF]">
                {String(index + 1).padStart(2, '0')}
              </span>
              
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4A90D9]/10 mb-5">
                <step.icon className="h-7 w-7 text-[#4A90D9]" />
              </div>
              
              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-[#1F2937] mb-2">
                {step.title}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
