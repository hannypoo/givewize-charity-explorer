import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { quizQuestions, QUIZ_TIERS, tierEndIndex, tierStartIndex } from "@/data/quizQuestions";
import { usePageTitle } from "@/hooks/usePageTitle";

type Answers = Record<string, string | string[] | number>;

const STORAGE_KEY = "givewize-quiz-progress";

function loadSavedProgress(): { step: number; answers: Answers } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.step === "number" && parsed.answers) return parsed;
  } catch { /* ignore corrupt data */ }
  return null;
}

/** Determine which tier a step index falls within */
function getTierForStep(step: number): 1 | 2 | 3 {
  if (step <= tierEndIndex(1)) return 1;
  if (step <= tierEndIndex(2)) return 2;
  return 3;
}

const QuizFlow = () => {
  usePageTitle("Quiz", "Answer a few quick questions to discover charities that align with your values, giving preferences, and impact goals.");
  const navigate = useNavigate();
  const location = useLocation();

  // Resume state from results page (for tier 2/3 continuation)
  const resumeState = location.state as { answers?: Answers; startStep?: number } | null;

  const saved = loadSavedProgress();
  const initialStep = resumeState?.startStep ?? saved?.step ?? 0;
  const initialAnswers = resumeState?.answers ?? saved?.answers ?? {};

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [showResume, setShowResume] = useState(!resumeState && !!saved && saved.step > 0);

  // Persist progress to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step: currentStep, answers }));
  }, [currentStep, answers]);

  const currentQuestion = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const currentTier = getTierForStep(currentStep);
  const currentTierMeta = QUIZ_TIERS[currentTier - 1];

  const handleSelectAnswer = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      const currentSelections = (answers[currentQuestion.id] as string[]) || [];
      if (optionId === "none") {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: ["none"] }));
        return;
      }
      if (currentSelections.includes(optionId)) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: currentSelections.filter((id) => id !== optionId),
        }));
        return;
      }
      const withoutNone = currentSelections.filter((id) => id !== "none");
      if (currentQuestion.maxSelections && withoutNone.length >= currentQuestion.maxSelections) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: [...withoutNone, optionId] }));
    } else {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    }
  };

  const handleScaleSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    const tierEnd = tierEndIndex(currentTier);
    if (currentStep === tierEnd) {
      // End of a tier → navigate to results with current tier
      navigate("/quiz/results", { state: { answers, tier: currentTier } });
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // At first question of Tier 2/3 → go back to previous tier results
    if (currentTier > 1 && currentStep === tierStartIndex(currentTier)) {
      const prevTier = (currentTier - 1) as 1 | 2 | 3;
      navigate("/quiz/results", { state: { answers, tier: prevTier } });
      return;
    }
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    else navigate("/quiz");
  };

  const currentAnswer = answers[currentQuestion.id];
  const canProceed = () => {
    if (currentQuestion.type === "scale") return typeof currentAnswer === "number";
    if (currentQuestion.multiSelect) return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    return !!currentAnswer;
  };

  const isSelected = (optionId: string) => {
    if (currentQuestion.multiSelect) return Array.isArray(currentAnswer) && currentAnswer.includes(optionId);
    return currentAnswer === optionId;
  };

  const selectionCount =
    currentQuestion.multiSelect && Array.isArray(currentAnswer)
      ? currentAnswer.filter((id) => id !== "none").length
      : 0;

  // Dynamic button label
  const getNextLabel = () => {
    const tierEnd = tierEndIndex(currentTier);
    if (currentStep === tierEnd) {
      if (currentTier === 3) return "See Final Results";
      return `See ${currentTierMeta.label} Results`;
    }
    return "Next";
  };

  // Keyboard navigation: Enter=next, 1-5=scale, ArrowLeft/Right=back/next
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && canProceed()) {
        e.preventDefault();
        handleNext();
        return;
      }
      if (currentQuestion.type === "scale" && e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        handleScaleSelect(Number(e.key));
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleBack();
      }
      if (e.key === "ArrowRight" && canProceed()) {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <Layout>
      <div className="bg-quiz-flow min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative overflow-hidden">
        {/* Light orbs */}
        <div className="absolute top-32 right-[20%] w-72 h-72 bg-white/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-[10%] w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

        <div className="container relative max-w-2xl py-8 md:py-12">
          {/* Resume prompt */}
          {showResume && (
            <div className="glass-dark rounded-2xl p-4 mb-6 flex items-center justify-between animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
              <p className="text-sm text-white/70">
                Welcome back! Continue from question {currentStep + 1}?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setCurrentStep(0);
                    setAnswers({});
                    setShowResume(false);
                  }}
                >
                  Start over
                </Button>
                <Button
                  size="sm"
                  className="gradient-orange text-accent-foreground font-semibold rounded-xl"
                  onClick={() => setShowResume(false)}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Segmented Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Question {currentStep + 1} of {totalSteps}</span>
              <span>{currentTierMeta.label}</span>
            </div>
            <div className="flex gap-1 h-2">
              {QUIZ_TIERS.map((t) => {
                const start = tierStartIndex(t.tier);
                const end = tierEndIndex(t.tier);
                const width = `${(t.questionCount / totalSteps) * 100}%`;
                const isCompleted = currentStep > end;
                const isActive = currentTier === t.tier;
                const progressInTier = isActive
                  ? ((currentStep - start + 1) / t.questionCount) * 100
                  : 0;

                return (
                  <div
                    key={t.tier}
                    className="relative rounded-full overflow-hidden bg-white/15"
                    style={{ width }}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted || isActive ? "gradient-orange" : ""
                      }`}
                      style={{ width: isCompleted ? "100%" : isActive ? `${progressInTier}%` : "0%" }}
                    />
                  </div>
                );
              })}
            </div>
            {/* Tier labels */}
            <div className="flex gap-1 mt-1.5">
              {QUIZ_TIERS.map((t) => {
                const width = `${(t.questionCount / totalSteps) * 100}%`;
                const isCompleted = currentStep > tierEndIndex(t.tier);
                const isActive = currentTier === t.tier;
                return (
                  <div key={t.tier} className="flex items-center gap-1" style={{ width }}>
                    {isCompleted && <Check className="h-3 w-3 text-orange-light shrink-0" />}
                    <span className={`text-xs truncate ${
                      isActive ? "text-white/80 font-medium" : isCompleted ? "text-orange-light/70" : "text-white/30"
                    }`}>
                      {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Card */}
          <div key={currentStep} className="glass-dark rounded-2xl p-6 md:p-8 mb-6 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 text-center">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-white/60 text-center mb-2">{currentQuestion.subtitle}</p>
            )}
            {currentQuestion.maxSelections && (
              <p className="text-sm text-white/50 text-center mb-6">
                {selectionCount} of {currentQuestion.maxSelections} selected
              </p>
            )}
            {!currentQuestion.maxSelections && currentQuestion.subtitle && <div className="mb-6" />}
            {!currentQuestion.subtitle && !currentQuestion.maxSelections && <div className="mb-6" />}

            {/* Scale */}
            {currentQuestion.type === "scale" && (
              <div className="py-4">
                <div className="flex justify-between gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isActive = currentAnswer === value;
                    return (
                      <button
                        key={value}
                        onClick={() => handleScaleSelect(value)}
                        aria-label={`Rate ${value} out of 5${currentQuestion.scaleLabels ? ` — ${value === 1 ? currentQuestion.scaleLabels.low : value === 5 ? currentQuestion.scaleLabels.high : ""}` : ""}`}
                        aria-pressed={isActive}
                        className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 ${
                          isActive
                            ? "border-orange bg-orange text-accent-foreground"
                            : "border-white/20 bg-white/10 text-white hover:border-white/40"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
                {currentQuestion.scaleLabels && (
                  <div className="flex justify-between text-sm text-white/50">
                    <span>{currentQuestion.scaleLabels.low}</span>
                    <span>{currentQuestion.scaleLabels.high}</span>
                  </div>
                )}
              </div>
            )}

            {/* Cards */}
            {(currentQuestion.type === "cards" || !currentQuestion.type) && currentQuestion.options && (
              <div
                className={`grid gap-3 ${
                  currentQuestion.options.length <= 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {currentQuestion.options.map((option) => {
                  const selected = isSelected(option.id);
                  const atMax =
                    currentQuestion.maxSelections && selectionCount >= currentQuestion.maxSelections && !selected;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                      disabled={!!atMax}
                      aria-pressed={selected}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selected
                          ? "border-orange bg-orange/20 text-white"
                          : atMax
                          ? "border-white/10 bg-white/5 opacity-40 cursor-not-allowed"
                          : "border-white/15 bg-white/10 hover:border-white/30 hover:bg-white/15 text-white"
                      }`}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full gradient-orange flex items-center justify-center">
                          <Check className="h-3 w-3 text-accent-foreground" />
                        </div>
                      )}
                      <span className="font-medium text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation — sticky on mobile for easy thumb access */}
          <div className="fixed bottom-0 left-0 right-0 z-30 md:static md:z-auto">
            <div className="flex items-center justify-between px-4 py-3 md:p-0 bg-black/60 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none border-t border-white/10 md:border-0">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gradient-orange text-accent-foreground font-semibold px-8 rounded-2xl glow-orange hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {getNextLabel()}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          {/* Keyboard hints (desktop only) */}
          <p className="hidden md:block text-center text-xs text-white/30 mt-3">
            Keyboard: Enter to continue{currentQuestion.type === "scale" ? ", 1–5 to select" : ""}, arrow keys to navigate
          </p>
          {/* Spacer to prevent content from being hidden behind sticky nav on mobile */}
          <div className="h-16 md:hidden" />
        </div>
      </div>
    </Layout>
  );
};

export default QuizFlow;
