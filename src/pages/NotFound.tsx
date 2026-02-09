import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found", "The page you're looking for doesn't exist or may have been moved.");

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(220, 72%, 50%) 0%, hsl(220, 60%, 40%) 50%, hsl(220, 50%, 30%) 100%)' }}>
        <div className="absolute top-32 left-[20%] w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-[15%] w-64 h-64 bg-orange/10 rounded-full blur-[80px]" />

        <div className="container relative flex flex-col items-center justify-center min-h-[60vh] text-center py-16">
          <div className="glass-dark rounded-2xl p-8 md:p-12 max-w-lg w-full">
            <div className="text-8xl font-bold text-white/20 mb-4">404</div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Page not found
            </h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              The page you're looking for doesn't exist or may have been moved.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                className="gradient-orange text-accent-foreground font-semibold px-6 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
                asChild
              >
                <Link to="/charities">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Charities
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
