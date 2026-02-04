import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    description?: string;
  }[];
  multiSelect?: boolean;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "cause",
    question: "What cause matters most to you?",
    options: [
      { id: "health", label: "Health & Medical", description: "Fighting diseases and improving healthcare" },
      { id: "education", label: "Education", description: "Empowering through learning and opportunity" },
      { id: "environment", label: "Environment", description: "Protecting our planet and wildlife" },
      { id: "hunger", label: "Hunger & Poverty", description: "Providing food and fighting poverty" },
      { id: "children", label: "Children & Youth", description: "Supporting the next generation" },
      { id: "animals", label: "Animal Welfare", description: "Protecting and caring for animals" },
    ],
  },
  {
    id: "scope",
    question: "Where do you want your donation to have impact?",
    options: [
      { id: "local", label: "Local Community", description: "Making a difference close to home" },
      { id: "national", label: "National", description: "Supporting causes across the country" },
      { id: "global", label: "Global", description: "Helping communities worldwide" },
    ],
  },
  {
    id: "priority",
    question: "What's most important to you in a charity?",
    options: [
      { id: "efficiency", label: "Financial Efficiency", description: "Most of my donation goes to programs" },
      { id: "transparency", label: "Transparency", description: "Clear reporting and accountability" },
      { id: "impact", label: "Measurable Impact", description: "Proven results and outcomes" },
      { id: "longevity", label: "Track Record", description: "Years of experience and stability" },
    ],
  },
  {
    id: "involvement",
    question: "How would you like to be involved?",
    options: [
      { id: "donate", label: "One-time Donation", description: "Make a single contribution" },
      { id: "monthly", label: "Monthly Giving", description: "Ongoing support with recurring gifts" },
      { id: "volunteer", label: "Volunteer Time", description: "Hands-on involvement" },
      { id: "advocate", label: "Spread Awareness", description: "Share and advocate for the cause" },
    ],
  },
  {
    id: "amount",
    question: "What's your typical donation range?",
    options: [
      { id: "small", label: "Under $50", description: "Every bit helps" },
      { id: "medium", label: "$50 - $250", description: "Meaningful contribution" },
      { id: "large", label: "$250 - $1,000", description: "Significant support" },
      { id: "major", label: "$1,000+", description: "Major gift" },
    ],
  },
];

const QuizFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelectAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
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

  const selectedAnswer = answers[currentQuestion.id];
  const canProceed = !!selectedAnswer;

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
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1a365d] mb-8 text-center">
              {currentQuestion.question}
            </h2>

            {/* Answer Options as Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectAnswer(option.id)}
                    className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#4A90D9] bg-[#4A90D9]/5"
                        : "border-gray-200 bg-white hover:border-[#4A90D9]/50 hover:shadow-sm"
                    }`}
                  >
                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-[#4A90D9] flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <h3 className={`font-semibold mb-1 pr-8 ${isSelected ? "text-[#4A90D9]" : "text-[#1F2937]"}`}>
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className="text-sm text-[#6B7280]">{option.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
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
              disabled={!canProceed}
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
