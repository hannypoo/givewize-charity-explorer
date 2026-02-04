import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  type?: "cards" | "scale";
  options?: {
    id: string;
    label: string;
  }[];
  multiSelect?: boolean;
  maxSelections?: number;
  scaleLabels?: { low: string; high: string };
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "causes",
    question: "What causes matter most to you?",
    subtitle: "Select up to 3",
    type: "cards",
    multiSelect: true,
    maxSelections: 3,
    options: [
      { id: "rare-diseases", label: "Rare Diseases" },
      { id: "medical-health", label: "Medical & Health" },
      { id: "education", label: "Education" },
      { id: "hunger-food-security", label: "Hunger & Food Security" },
      { id: "animal-welfare", label: "Animal Welfare" },
      { id: "child-welfare", label: "Children & Youth" },
      { id: "environment-climate", label: "Environment & Climate" },
      { id: "emergency-relief", label: "Emergency Relief" },
      { id: "disability-services", label: "Disability Rights" },
      { id: "human-rights", label: "Human Rights" },
    ],
  },
  {
    id: "geographic",
    question: "What geographic impact do you prefer?",
    type: "cards",
    options: [
      { id: "local", label: "Local" },
      { id: "national", label: "National" },
      { id: "global", label: "Global" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "personal",
    question: "Have you been personally affected by...",
    subtitle: "Select all that apply",
    type: "cards",
    multiSelect: true,
    options: [
      { id: "medical-condition", label: "A medical condition" },
      { id: "rare-disease", label: "A rare disease" },
      { id: "food-insecurity", label: "Food insecurity" },
      { id: "natural-disaster", label: "A natural disaster" },
      { id: "none", label: "None of the above" },
    ],
  },
  {
    id: "efficiency",
    question: "How important is financial efficiency to you?",
    subtitle: "How much of each dollar goes directly to programs",
    type: "scale",
    scaleLabels: { low: "Not important", high: "Very important" },
  },
  {
    id: "age",
    question: "What's your organization age preference?",
    type: "cards",
    options: [
      { id: "established", label: "Established (10+ years)" },
      { id: "growing", label: "Growing (5-10 years)" },
      { id: "new", label: "New (under 5 years)" },
      { id: "no-preference", label: "No preference" },
    ],
  },
  {
    id: "transparency",
    question: "What transparency matters most to you?",
    type: "cards",
    options: [
      { id: "financial", label: "Financial reports" },
      { id: "impact", label: "Impact metrics" },
      { id: "programs", label: "Program updates" },
      { id: "all", label: "All equally important" },
    ],
  },
];

type Answers = Record<string, string | string[] | number>;

const QuizFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const currentQuestion = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelectAnswer = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      const currentSelections = (answers[currentQuestion.id] as string[]) || [];
      
      // Handle "None" option - clears other selections
      if (optionId === "none") {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: ["none"],
        }));
        return;
      }

      // If clicking on an already selected item, remove it
      if (currentSelections.includes(optionId)) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: currentSelections.filter((id) => id !== optionId),
        }));
        return;
      }

      // Remove "none" if selecting something else
      const withoutNone = currentSelections.filter((id) => id !== "none");

      // Check max selections
      if (currentQuestion.maxSelections && withoutNone.length >= currentQuestion.maxSelections) {
        return; // Don't add more
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: [...withoutNone, optionId],
      }));
    } else {
      // Single select
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    }
  };

  const handleScaleSelect = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Quiz complete - navigate to results
      console.log("Quiz completed with answers:", answers);
      navigate("/quiz/results", { state: { answers } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/quiz");
    }
  };

  const currentAnswer = answers[currentQuestion.id];
  
  const canProceed = () => {
    if (currentQuestion.type === "scale") {
      return typeof currentAnswer === "number";
    }
    if (currentQuestion.multiSelect) {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return !!currentAnswer;
  };

  const isSelected = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      return Array.isArray(currentAnswer) && currentAnswer.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  const selectionCount = currentQuestion.multiSelect && Array.isArray(currentAnswer) 
    ? currentAnswer.filter(id => id !== "none").length 
    : 0;

  return (
    <Layout>
      <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">
        <div className="container max-w-2xl py-8 md:py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-[#6B7280] mb-2">
              <span>Question {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#4A90D9] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a365d] mb-2 text-center">
              {currentQuestion.question}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-[#6B7280] text-center mb-2">
                {currentQuestion.subtitle}
              </p>
            )}
            {currentQuestion.maxSelections && (
              <p className="text-sm text-[#9CA3AF] text-center mb-6">
                {selectionCount} of {currentQuestion.maxSelections} selected
              </p>
            )}
            {!currentQuestion.maxSelections && currentQuestion.subtitle && (
              <div className="mb-6" />
            )}
            {!currentQuestion.subtitle && !currentQuestion.maxSelections && (
              <div className="mb-6" />
            )}

            {/* Scale Type Question */}
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
                            ? "border-[#4A90D9] bg-[#4A90D9] text-white"
                            : "border-gray-200 bg-white text-[#1F2937] hover:border-[#4A90D9]/50"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
                {currentQuestion.scaleLabels && (
                  <div className="flex justify-between text-sm text-[#6B7280]">
                    <span>{currentQuestion.scaleLabels.low}</span>
                    <span>{currentQuestion.scaleLabels.high}</span>
                  </div>
                )}
              </div>
            )}

            {/* Card Type Question */}
            {(currentQuestion.type === "cards" || !currentQuestion.type) && currentQuestion.options && (
              <div className={`grid gap-3 ${
                currentQuestion.options.length <= 4 
                  ? "grid-cols-1 sm:grid-cols-2" 
                  : "grid-cols-2 sm:grid-cols-3"
              }`}>
                {currentQuestion.options.map((option) => {
                  const selected = isSelected(option.id);
                  const atMax = currentQuestion.maxSelections 
                    && selectionCount >= currentQuestion.maxSelections 
                    && !selected;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectAnswer(option.id)}
                      disabled={atMax}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selected
                          ? "border-[#4A90D9] bg-[#4A90D9]/5"
                          : atMax
                          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 bg-white hover:border-[#4A90D9]/50 hover:shadow-sm"
                      }`}
                    >
                      {/* Selected checkmark */}
                      {selected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#4A90D9] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <span className={`font-medium text-sm ${selected ? "text-[#4A90D9]" : "text-[#1F2937]"}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="text-[#6B7280] hover:text-[#1F2937]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-[#4A90D9] hover:bg-[#3d7fc4] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === totalSteps - 1 ? "See Results" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizFlow;
