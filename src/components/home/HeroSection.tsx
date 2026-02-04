import { Link } from "react-router-dom";
import { ArrowRight, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-background py-20 md:py-28 lg:py-36">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[15%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-[10%] h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative smiley */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Smile className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-tight">
            Give With Confidence.
            <br />
            Give With Purpose.
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-xl mx-auto leading-relaxed">
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
