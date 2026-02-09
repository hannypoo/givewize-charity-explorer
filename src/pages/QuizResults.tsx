import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, RefreshCw, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/charities/StarRating";
import { matchCharities, type MatchedCharity, type QuizAnswers } from "@/lib/quizMatcher";
import { getCombinedRating, categoryLabels } from "@/lib/charityUtils";
import { usePageTitle } from "@/hooks/usePageTitle";

const QuizResults = () => {
  usePageTitle("Your Matches", "Your personalized charity matches based on your quiz responses. View profiles, ratings, and why each charity is a great fit.");
  const location = useLocation();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchedCharity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rawAnswers = (location.state as { answers?: Record<string, string | string[] | number> })?.answers;

  useEffect(() => {
    if (!rawAnswers) {
      navigate("/quiz");
      return;
    }

    const quizAnswers: QuizAnswers = {
      causes: Array.isArray(rawAnswers.causes) ? rawAnswers.causes : undefined,
      geographic: typeof rawAnswers.geographic === "string" ? rawAnswers.geographic : undefined,
      personal: Array.isArray(rawAnswers.personal) ? rawAnswers.personal : undefined,
      efficiency: typeof rawAnswers.efficiency === "number" ? rawAnswers.efficiency : undefined,
      age: typeof rawAnswers.age === "string" ? rawAnswers.age : undefined,
      transparency: typeof rawAnswers.transparency === "string" ? rawAnswers.transparency : undefined,
      engagement: typeof rawAnswers.engagement === "string" ? rawAnswers.engagement : undefined,
      taxBenefits: typeof rawAnswers.taxBenefits === "number" ? rawAnswers.taxBenefits : undefined,
      orgSize: typeof rawAnswers.orgSize === "string" ? rawAnswers.orgSize : undefined,
      keyFactors: Array.isArray(rawAnswers.keyFactors) ? rawAnswers.keyFactors : undefined,
    };

    matchCharities(quizAnswers)
      .then((results) => {
        setMatches(results);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Something went wrong finding your matches. Please try again.");
        setIsLoading(false);
      });
  }, [rawAnswers, navigate]);

  return (
    <Layout>
      <div className="bg-quiz-results min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-24 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 right-[15%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

        <div className="container relative max-w-3xl py-10 md:py-14">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-6">
              <span className="text-sm font-medium text-white/80">Your results</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Your Top Charity Matches
            </h1>
            <p className="text-lg text-white/60">
              Based on your quiz responses, here are charities that align with your values.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-white/60 mb-4" />
              <p className="text-white/60">Finding your best matches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-lg text-white/60 mb-6">{error}</p>
              <Button
                size="lg"
                className="gradient-orange text-accent-foreground font-semibold px-8 rounded-2xl"
                asChild
              >
                <Link to="/quiz/start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-white/60 mb-6">No matches found. Try retaking the quiz with different preferences.</p>
              <Button
                size="lg"
                className="gradient-orange text-accent-foreground font-semibold px-8 rounded-2xl"
                asChild
              >
                <Link to="/quiz/start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Matched Charity Cards */}
              <div className="space-y-4 mb-10">
                {matches.map((match) => {
                  const combined = getCombinedRating(match.charity);
                  return (
                    <div
                      key={match.charity.id}
                      className="glass-dark rounded-2xl p-5 md:p-6 hover:bg-white/20 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
                          {match.charity.logo_url ? (
                            <img src={match.charity.logo_url} alt="" loading="lazy" className="h-10 w-10 object-contain rounded-lg" />
                          ) : (
                            <Building2 className="h-7 w-7 text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-white">
                                {match.charity.name}
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-white/80">
                                {categoryLabels[match.charity.primary_category] || match.charity.primary_category}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15">
                              <span className="text-lg font-bold text-orange-light">
                                {match.matchPercent}%
                              </span>
                              <span className="text-xs text-white/60 font-medium">match</span>
                            </div>
                          </div>

                          {combined != null && (
                            <div className="mb-2">
                              <StarRating rating={combined} size="sm" showValue className="[&_span]:text-white/90 [&_svg]:text-white/30" />
                            </div>
                          )}

                          <p className="text-sm text-white/50 mb-3 line-clamp-2">
                            {match.charity.mission_statement}
                          </p>

                          <div className="bg-white/10 rounded-xl p-3 mb-4">
                            <p className="text-xs text-white/40 uppercase tracking-wide font-medium mb-1">
                              Why this match
                            </p>
                            <p className="text-sm text-white/60">{match.whyMatch}</p>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/25 text-white hover:bg-white/15 rounded-xl"
                            asChild
                          >
                            <Link to={`/charities/${match.charity.id}`}>
                              View Profile
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="gradient-orange text-accent-foreground font-semibold px-8 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300"
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
                  className="border-white/25 text-white hover:bg-white/15 rounded-2xl"
                  asChild
                >
                  <Link to="/quiz/start">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retake Quiz
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QuizResults;
