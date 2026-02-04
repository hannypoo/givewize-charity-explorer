import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-background py-24 md:py-32 lg:py-40">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[15%] h-72 w-72 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-10 left-[10%] h-56 w-56 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-[1.1]">
            Give With Confidence.
            <br />
            Give With Purpose.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
            Find vetted charities matched to your values—with complete financial transparency.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="text-base px-8 py-6 rounded-full shadow-soft"
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
              className="text-base px-8 py-6 rounded-full border-primary text-primary hover:bg-primary/5"
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
