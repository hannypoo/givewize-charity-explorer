import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, RefreshCw, Loader2, Save, Check, Sparkles } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/charities/StarRating";
import { matchCharities, type MatchedCharity, type QuizAnswers } from "@/lib/quizMatcher";
import { getCombinedRating, categoryLabels } from "@/lib/charityUtils";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QUIZ_TIERS, tierStartIndex, quizQuestions } from "@/data/quizQuestions";
import { loadQuizResults, saveQuizResults, clearQuizResults } from "@/lib/quizStorage";

type Answers = Record<string, string | string[] | number>;

/** Count how many of the 8 quiz question IDs have answers */
function countAnsweredFactors(answers: Answers): number {
  return quizQuestions.filter((q) => answers[q.id] != null).length;
}

const QuizResults = () => {
  usePageTitle("Your Matches", "Your personalized charity matches based on your quiz responses. View profiles, ratings, and why each charity is a great fit.");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchedCharity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const savedRef = useRef(false);

  // Resolve answers + tier from multiple sources (priority order)
  const locState = location.state as { answers?: Answers; tier?: 1 | 2 | 3 } | null;
  const storedResults = loadQuizResults();

  const rawAnswers = locState?.answers ?? storedResults?.answers ?? null;
  const tier: 1 | 2 | 3 = locState?.tier ?? storedResults?.tier ?? 1;

  const tierMeta = QUIZ_TIERS[tier - 1];
  const nextTier = tier < 3 ? ((tier + 1) as 2 | 3) : null;
  const nextTierMeta = nextTier ? QUIZ_TIERS[nextTier - 1] : null;
  const answeredCount = rawAnswers ? countAnsweredFactors(rawAnswers) : 0;
  const totalFactors = quizQuestions.length;

  useEffect(() => {
    if (!rawAnswers) {
      // Try Supabase for logged-in user as last resort
      if (user) {
        supabase
          .from("user_quiz_results")
          .select("answers, matched_charity_ids")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .then(({ data, error: fetchError }) => {
            if (fetchError) {
              setError("Could not load your saved results. Please try retaking the quiz.");
              setIsLoading(false);
              return;
            }
            if (data && data[0]) {
              const dbAnswers = data[0].answers as Answers;
              const quizAnswers = buildQuizAnswers(dbAnswers);
              matchCharities(quizAnswers).then((results) => {
                setMatches(results);
                setIsLoading(false);
              }).catch(() => {
                setError("Something went wrong finding your matches. Please try again.");
                setIsLoading(false);
              });
            } else {
              navigate("/quiz");
            }
          });
      } else {
        navigate("/quiz");
      }
      return;
    }

    const quizAnswers = buildQuizAnswers(rawAnswers);

    matchCharities(quizAnswers)
      .then(async (results) => {
        setMatches(results);
        setIsLoading(false);

        // Save to localStorage for persistence through refresh/auth
        saveQuizResults(
          rawAnswers,
          tier,
          results.map((m) => m.charity.id),
        );

        // Auto-save for logged-in users
        if (user && !savedRef.current) {
          savedRef.current = true;
          const { error: saveError } = await supabase.from("user_quiz_results").insert({
            user_id: user.id,
            answers: quizAnswers as any,
            matched_charity_ids: results.map((m) => m.charity.id),
          });
          if (!saveError) {
            setSaved(true);
            clearQuizResults(); // Clear localStorage after successful DB save
            toast.success("Quiz results saved to your profile");
          }
        }
      })
      .catch(() => {
        setError("Something went wrong finding your matches. Please try again.");
        setIsLoading(false);
      });
  }, [rawAnswers, navigate, user]);

  function buildQuizAnswers(answers: Answers): QuizAnswers {
    return {
      causes: Array.isArray(answers.causes) ? answers.causes : undefined,
      geographic: typeof answers.geographic === "string" ? answers.geographic : undefined,
      efficiency: typeof answers.efficiency === "number" ? answers.efficiency : undefined,
      age: typeof answers.age === "string" ? answers.age : undefined,
      transparency: typeof answers.transparency === "string" ? answers.transparency : undefined,
      taxBenefits: typeof answers.taxBenefits === "number" ? answers.taxBenefits : undefined,
      orgSize: typeof answers.orgSize === "string" ? answers.orgSize : undefined,
      keyFactors: Array.isArray(answers.keyFactors) ? answers.keyFactors : undefined,
    };
  }

  const handleRetake = () => {
    clearQuizResults();
    navigate("/quiz/start");
  };

  return (
    <Layout>
      <div className="bg-quiz-results min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-24 left-[10%] w-80 h-80 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-32 right-[15%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

        <div className="container relative max-w-3xl py-10 md:py-14">
          {/* Tier Stepper */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {QUIZ_TIERS.map((t, i) => {
              const isCompleted = t.tier < tier;
              const isCurrent = t.tier === tier;
              return (
                <div key={t.tier} className="flex items-center gap-3">
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-colors ${
                    isCompleted
                      ? "border-orange-light bg-orange-light/20"
                      : isCurrent
                      ? "border-orange-light bg-orange-light/10"
                      : "border-white/20 bg-white/5"
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-orange-light" />
                    ) : (
                      <span className={`text-xs font-bold ${isCurrent ? "text-orange-light" : "text-white/30"}`}>
                        {t.tier}
                      </span>
                    )}
                  </div>
                  {i < QUIZ_TIERS.length - 1 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? "bg-orange-light/40" : "bg-white/15"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            {/* Specificity badge */}
            <div className="inline-flex items-center gap-2 glass-dark rounded-full px-5 py-2.5 mb-6">
              <Sparkles className="h-4 w-4 text-orange-light" />
              <span className="text-sm font-medium text-white/80">{tierMeta.specificity} results</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Your Top Charity Matches
            </h1>
            <p className="text-lg text-white/60">
              {!isLoading && matches.length > 0
                ? `We found ${matches.length} ${matches.length === 1 ? "charity" : "charities"} that align with your values.`
                : "Based on your quiz responses, here are charities that align with your values."}
            </p>
            {/* Context note for partial matches */}
            {tier < 3 && !isLoading && matches.length > 0 && (
              <p className="text-sm text-white/40 mt-2">
                Based on {answeredCount} of {totalFactors} factors. Refine for more differentiated results.
              </p>
            )}
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
                onClick={handleRetake}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake Quiz
              </Button>
            </div>
          ) : (
            <>
              {/* Matched Charity Cards */}
              <div className="space-y-4 mb-10">
                {matches.map((match, index) => {
                  const combined = getCombinedRating(match.charity);
                  return (
                    <div
                      key={match.charity.id}
                      className="glass-dark rounded-2xl p-5 md:p-6 hover:bg-white/20 transition-all duration-300 animate-fade-in-up opacity-0"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
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
                            size="sm"
                            className="gradient-orange text-accent-foreground font-semibold rounded-xl"
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

              {/* Refine Results CTA or Tier 3 completion */}
              {nextTier && nextTierMeta && rawAnswers ? (
                <div className="glass-dark rounded-2xl p-6 mb-6 text-center">
                  <Sparkles className="h-5 w-5 text-orange-light mx-auto mb-2" />
                  <p className="text-white/80 font-medium mb-1">Want more specific results?</p>
                  <p className="text-sm text-white/50 mb-4">
                    Answer {nextTierMeta.questionCount} more question{nextTierMeta.questionCount > 1 ? "s" : ""} to get {nextTierMeta.specificity.toLowerCase()} matches.
                  </p>
                  <Button
                    size="sm"
                    className="gradient-orange text-accent-foreground font-semibold rounded-xl"
                    onClick={() =>
                      navigate("/quiz/start", {
                        state: { answers: rawAnswers, startStep: tierStartIndex(nextTier) },
                      })
                    }
                  >
                    Refine Results
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : tier === 3 ? (
                <div className="glass-dark rounded-2xl p-5 mb-6 text-center">
                  <Check className="h-5 w-5 text-orange-light mx-auto mb-2" />
                  <p className="text-sm text-white/60">
                    You've completed the full Deep Match quiz! These are your most precise matches.
                  </p>
                </div>
              ) : null}

              {/* Save Prompt */}
              {!user && (
                <div className="glass-dark rounded-2xl p-5 mb-6 text-center">
                  <Save className="h-5 w-5 text-orange-light mx-auto mb-2" />
                  <p className="text-sm text-white/70 mb-3">Sign up to save your results and track your matches over time.</p>
                  <Button size="sm" className="gradient-orange text-accent-foreground font-semibold rounded-xl" asChild>
                    <Link to="/auth" state={{ from: "/quiz/results" }}>Create Account</Link>
                  </Button>
                </div>
              )}
              {saved && (
                <div className="glass-dark rounded-2xl p-4 mb-6 text-center">
                  <p className="text-sm text-white/60">Results saved to your <Link to="/profile" className="text-orange-light hover:underline">profile</Link>.</p>
                </div>
              )}

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
                  size="lg"
                  className="gradient-orange text-accent-foreground font-semibold rounded-2xl glow-orange"
                  onClick={handleRetake}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake Quiz
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
