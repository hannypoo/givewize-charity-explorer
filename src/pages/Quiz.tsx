import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, CheckCircle, ListChecks } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const Quiz = () => {
  usePageTitle("Charity Match Quiz", "Take our 1-minute quiz to discover charities that match your values, causes, and giving preferences.");
  return (
    <Layout>
      <div className="bg-quiz min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-white/5 rounded-full blur-[100px]" />

        <div className="container relative flex flex-col items-center justify-center py-20 md:py-32">
          {/* Glass badge */}
          <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-8">
            <Sparkles className="h-4 w-4 text-orange-light" />
            <span className="text-sm font-medium text-white/80">
              Personalized matching
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight">
            Find Your Perfect
            <br />
            <span className="text-orange-light">Charity Match</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 text-center max-w-md mb-3">
            Answer a few questions and we'll match you with charities that align with your values
          </p>
          <p className="text-sm text-white/40 text-center max-w-md mb-12">
            Start quick. Refine if you want more precision.
          </p>

          <Button
            size="lg"
            className="text-base px-10 py-6 gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
            asChild
          >
            <Link to="/quiz/start">
              Start Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {[
              { icon: <Clock className="h-4 w-4 text-white/70" />, text: "Takes ~1 minute" },
              { icon: <ListChecks className="h-4 w-4 text-white/70" />, text: "As few as 3 questions" },
              { icon: <CheckCircle className="h-4 w-4 text-white/70" />, text: "No account required" },
            ].map((pill, i) => (
              <div
                key={pill.text}
                className="glass-dark rounded-2xl px-5 py-3 flex items-center gap-3 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                {pill.icon}
                <span className="text-sm text-white/70">{pill.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
