import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const Quiz = () => {
  return (
    <Layout>
      <div className="bg-secondary min-h-[calc(100vh-4rem)]">
        <div className="container flex flex-col items-center justify-center py-20 md:py-32">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-8">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-4">
            Find Your Perfect Charity Match
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-md mb-10">
            Answer a few questions — takes about 2 minutes
          </p>

          <Button 
            size="lg" 
            className="text-base px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
            asChild
          >
            <Link to="/quiz/start">
              Start Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            No account required
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
