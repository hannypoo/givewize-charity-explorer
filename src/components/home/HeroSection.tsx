import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative bg-[#F8FAFC] py-28 md:py-36 lg:py-44">
      {/* Subtle decorative blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-[20%] h-80 w-80 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-16 left-[15%] h-64 w-64 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative icon - subtle accent */}
          <div className="mb-8 flex justify-center">
            <img 
              src={givewizeIcon} 
              alt="" 
              className="h-16 w-16 object-contain opacity-90"
              aria-hidden="true"
            />
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#1a365d] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
            Give With Confidence.
            <br />
            Give With Purpose.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-xl text-lg text-[#6B7280] md:text-xl leading-relaxed">
            Find vetted charities matched to your values—with complete financial transparency.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="text-base px-8 py-6 rounded-full bg-[#4A90D9] hover:bg-[#3d7fc4] text-white shadow-lg shadow-primary/20"
              asChild
            >
              <Link to="/quiz">
                Take the Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 rounded-full border-2 border-[#4A90D9] text-[#4A90D9] bg-transparent hover:bg-[#4A90D9]/5"
              asChild
            >
              <Link to="/charities">Explore Charities</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
