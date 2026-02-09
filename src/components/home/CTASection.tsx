import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-cta">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange/15 rounded-full blur-[150px]" />

      <div className="container relative text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
          <Sparkles className="h-4 w-4 text-orange-light" />
          <span className="text-sm font-medium text-white/80">Ready to make a difference?</span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
          Find a charity that matches
          <br />
          <span className="text-orange-light">your values</span>
        </h2>

        <p className="text-lg text-white/60 mb-10 leading-relaxed">
          Take our 3-minute quiz and discover vetted organizations making the impact you care about most.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-base px-10 py-6 gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
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
            className="text-base px-10 py-6 border-white/25 text-white hover:bg-white/15 rounded-2xl"
            asChild
          >
            <Link to="/charities">Browse Charities</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
