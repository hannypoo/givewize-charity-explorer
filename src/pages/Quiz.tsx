import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Quiz = () => {
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

          <p className="text-lg md:text-xl text-white/60 text-center max-w-md mb-12">
            Answer a few questions and we'll match you with charities that align with your values
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
            <div className="glass-dark rounded-2xl px-5 py-3 flex items-center gap-3">
              <Clock className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70">Takes ~3 minutes</span>
            </div>
            <div className="glass-dark rounded-2xl px-5 py-3 flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-white/70" />
              <span className="text-sm text-white/70">No account required</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
