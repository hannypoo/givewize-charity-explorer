import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Charities from "./pages/Charities";
import CharityDetail from "./pages/CharityDetail";
import Quiz from "./pages/Quiz";
import QuizFlow from "./pages/QuizFlow";
import QuizResults from "./pages/QuizResults";
import About from "./pages/About";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
