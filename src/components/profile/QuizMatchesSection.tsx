import { Link } from "react-router-dom";
import { Brain, Building2, ArrowRight, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/charities/StarRating";
import { getCombinedRating, categoryLabels } from "@/lib/charityUtils";
import { quizQuestions, QUIZ_TIERS } from "@/data/quizQuestions";
import type { CharityRow } from "@/hooks/useCharities";
import type { Tables } from "@/integrations/supabase/types";

/** Infer tier from which answer keys are present */
function inferTier(answers: Record<string, unknown>): 1 | 2 | 3 {
  const answeredIds = new Set(Object.keys(answers).filter((k) => answers[k] != null));
  const tier3Ids = quizQuestions.filter((q) => q.tier === 3).map((q) => q.id);
  const tier2Ids = quizQuestions.filter((q) => q.tier === 2).map((q) => q.id);
  if (tier3Ids.some((id) => answeredIds.has(id))) return 3;
  if (tier2Ids.some((id) => answeredIds.has(id))) return 2;
  return 1;
}

type QuizResult = Tables<"user_quiz_results">;

export function QuizMatchesSection() {
  const { user } = useAuth();

  const { data: quizResults = [], isLoading: quizLoading } = useQuery({
    queryKey: ["user-quiz-results", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_quiz_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as QuizResult[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const latestResult = quizResults[0];
  const matchedIds = latestResult?.matched_charity_ids || [];

  const { data: matchedCharities = [], isLoading: charitiesLoading } = useQuery({
    queryKey: ["matched-charities", matchedIds],
    queryFn: async () => {
      if (matchedIds.length === 0) return [];
      const { data } = await supabase
        .from("charities")
        .select("*")
        .in("id", matchedIds);
      return (data || []) as CharityRow[];
    },
    enabled: matchedIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = quizLoading || charitiesLoading;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Quiz & Matches</h2>
        <Button size="sm" variant="outline" className="rounded-xl" asChild>
          <Link to="/quiz/start">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            {quizResults.length > 0 ? "Retake Quiz" : "Take Quiz"}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-card rounded-xl p-6 shadow-soft animate-pulse">
          <div className="h-4 w-48 rounded bg-muted mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1].map((i) => <div key={i} className="h-24 rounded-xl bg-muted" />)}
          </div>
        </div>
      ) : quizResults.length === 0 ? (
        <div className="bg-card rounded-xl p-8 shadow-soft text-center">
          <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Take the quiz to discover charities that match your values.</p>
          <Button className="gradient-orange text-accent-foreground font-semibold rounded-xl" asChild>
            <Link to="/quiz/start">
              Start Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Latest quiz info */}
          <div className="bg-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">Latest Results</h3>
                {latestResult.answers && (() => {
                  const t = inferTier(latestResult.answers as Record<string, unknown>);
                  const tierMeta = QUIZ_TIERS[t - 1];
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {tierMeta.label}
                    </span>
                  );
                })()}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(latestResult.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              {matchedIds.length} {matchedIds.length === 1 ? "charity" : "charities"} matched
            </p>
            {quizResults.length > 1 && (
              <p className="text-xs text-muted-foreground">
                You've taken the quiz {quizResults.length} time{quizResults.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Matched charities */}
          {matchedCharities.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedCharities.map((charity) => {
                const combined = getCombinedRating(charity);
                return (
                  <Link
                    key={charity.id}
                    to={`/charities/${charity.id}`}
                    className="bg-card rounded-xl p-5 shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        {charity.logo_url ? (
                          <img src={charity.logo_url} alt={`${charity.name} logo`} loading="lazy" className="h-7 w-7 object-contain rounded" />
                        ) : (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm line-clamp-1">{charity.name}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {categoryLabels[charity.primary_category] || charity.primary_category}
                    </span>
                    {combined != null && (
                      <StarRating rating={combined} size="sm" showValue className="mt-2" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
