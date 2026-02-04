import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import givewizeIcon from "@/assets/givewize-icon.jpg";

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Simple logo */}
          <div className="mb-10 flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-white p-2 shadow-soft ring-1 ring-border">
              <img 
                src={givewizeIcon} 
                alt="GiveWiZe" 
                className="h-full w-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Clean headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground tracking-tight leading-[1.1] text-balance mb-6">
            Give with purpose.
            <br />
            <span className="text-primary">Give with confidence.</span>
          </h1>

          {/* Simple subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            Find vetted charities matched to your values. Complete financial transparency for every organization.
          </p>

          {/* Clean CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="text-base px-8 py-6 rounded-xl bg-accent hover:bg-terracotta-dark text-accent-foreground font-medium shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
              asChild
            >
              <Link to="/quiz">
                Find your cause
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 rounded-xl border-border text-foreground hover:bg-secondary transition-all"
              asChild
            >
              <Link to="/charities">Browse charities</Link>
            </Button>
          </div>

          {/* Minimal trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>71 vetted charities</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>100% transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>AI-powered matching</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
