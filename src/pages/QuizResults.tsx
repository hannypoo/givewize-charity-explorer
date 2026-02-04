import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const QuizResults = () => {
  const location = useLocation();
  const answers = location.state?.answers || {};

  // Mock matched charities based on answers
  const matchedCharities = [
    { id: "1", name: "Sample Health Foundation", match: 95 },
    { id: "2", name: "Education for All", match: 88 },
    { id: "3", name: "Community Care Network", match: 82 },
  ];

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
        <div className="container max-w-2xl py-12 md:py-16">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4A90D9]/10">
              <Sparkles className="h-8 w-8 text-[#4A90D9]" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a365d] text-center mb-4">
            Your Matches Are Ready!
          </h1>
          <p className="text-lg text-[#6B7280] text-center mb-10">
            Based on your answers, here are charities that align with your values.
          </p>

          {/* Matched Charities */}
          <div className="space-y-4 mb-10">
            {matchedCharities.map((charity, index) => (
              <Link
                key={charity.id}
                to={`/charities/${charity.id}`}
                className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-transparent hover:border-[#4A90D9]/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A90D9]/10 text-[#4A90D9] font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#1a365d]">{charity.name}</h3>
                      <p className="text-sm text-[#6B7280]">View charity profile</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#4A90D9]">{charity.match}%</span>
                    <p className="text-xs text-[#9CA3AF]">match</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-[#4A90D9] hover:bg-[#3d7fc4] text-white px-8"
              asChild
            >
              <Link to="/charities">
                Explore All Charities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#4A90D9] text-[#4A90D9] hover:bg-[#4A90D9]/5"
              asChild
            >
              <Link to="/quiz/start">Retake Quiz</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizResults;
