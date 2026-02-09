import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function PageFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ background: "linear-gradient(180deg, hsl(220, 60%, 30%) 0%, hsl(220, 50%, 20%) 100%)" }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-white/60" />
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
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<Help />} />
            <Route path="/request-charity" element={<RequestCharity />} />
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
