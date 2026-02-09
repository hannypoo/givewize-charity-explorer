import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { quizQuestions } from "@/data/quizQuestions";
import { usePageTitle } from "@/hooks/usePageTitle";

type Answers = Record<string, string | string[] | number>;

const QuizFlow = () => {
  usePageTitle("Quiz");
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const currentQuestion = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

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
    if (currentStep < totalSteps - 1) setCurrentStep((prev) => prev + 1);
    else navigate("/quiz/results", { state: { answers } });
  };

  const handleBack = () => {
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
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span>Question {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full gradient-orange rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-dark rounded-2xl p-6 md:p-8 mb-6">
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
                {currentStep === totalSteps - 1 ? "See Results" : "Next"}
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
