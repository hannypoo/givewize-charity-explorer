import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";

// Lazy-loaded routes for code splitting
const Charities = lazy(() => import("./pages/Charities"));
const CharityDetail = lazy(() => import("./pages/CharityDetail"));
const Quiz = lazy(() => import("./pages/Quiz"));
const QuizFlow = lazy(() => import("./pages/QuizFlow"));
const QuizResults = lazy(() => import("./pages/QuizResults"));
const About = lazy(() => import("./pages/About"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const ImportCharities = lazy(() => import("./pages/ImportCharities"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Help = lazy(() => import("./pages/Help"));
const RequestCharity = lazy(() => import("./pages/RequestCharity"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function ScrollToTop() {
  useScrollToTop();
  return null;
}

const loadingMessages = [
  "Don't lose your smile, we'll get you there soon :)",
  "Good things come to those who wait!",
  "Brewing up some goodness for you...",
  "Hang tight, magic is happening!",
  "Almost there, stay awesome!",
  "Loading some generosity your way...",
  "Great things take a moment!",
  "Your kindness is worth the wait :)",
];

function PageFallback() {
  const [msgIndex, setMsgIndex] = useState(() => Math.floor(Math.random() * loadingMessages.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ background: "linear-gradient(180deg, hsl(220, 60%, 30%) 0%, hsl(220, 50%, 20%) 100%)" }}
    >
      <span className="text-6xl animate-breathe" role="img" aria-label="Loading">
        😊
      </span>
      <p className="text-white/60 text-lg font-medium text-center px-6 transition-opacity duration-500">
        {loadingMessages[msgIndex]}
      </p>
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/charities" element={<Charities />} />
            <Route path="/charities/:id" element={<CharityDetail />} />
            <Route path="/explore" element={<Navigate to="/charities" replace />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/start" element={<QuizFlow />} />
            <Route path="/quiz/results" element={<QuizResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<Help />} />
            <Route path="/request-charity" element={<RequestCharity />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/import" element={<ImportCharities />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
