import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ChatPage from "./pages/ChatPage";
import GuardianSetup from "./pages/GuardianSetup";
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerSkillSelection from "./pages/LearnerSkillSelection";
import LearnerAccount from "./pages/LearnerAccount";
import LearnerBilling from "./pages/LearnerBilling";
import GuardianManageDashboard from "./pages/GuardianManageDashboard";
import GuardianAnalyticsDashboard from "./pages/GuardianAnalyticsDashboard";
import GuardianAccount from "./pages/GuardianAccount";
import GuardianBilling from "./pages/GuardianBilling";
import GuardianMemoryBank from "./pages/GuardianMemoryBank";
import LearnerMemoryBank from "./pages/LearnerMemoryBank";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/try" element={<LandingPage />} />

          {/* Protected routes */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/onboarding" element={<Index />} />
          <Route path="/guardian-setup" element={<ProtectedRoute><GuardianSetup /></ProtectedRoute>} />
          <Route path="/learner" element={<ProtectedRoute><LearnerDashboard /></ProtectedRoute>} />
          <Route path="/learner/add-skill" element={<ProtectedRoute><LearnerSkillSelection /></ProtectedRoute>} />
          <Route path="/learner/account" element={<ProtectedRoute><LearnerAccount /></ProtectedRoute>} />
          <Route path="/learner/billing" element={<ProtectedRoute><LearnerBilling /></ProtectedRoute>} />
          <Route path="/learner/memory" element={<ProtectedRoute><LearnerMemoryBank /></ProtectedRoute>} />
          <Route path="/guardian/manage" element={<ProtectedRoute><GuardianManageDashboard /></ProtectedRoute>} />
          <Route path="/guardian/separate" element={<ProtectedRoute><GuardianAnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/guardian/account" element={<ProtectedRoute><GuardianAccount /></ProtectedRoute>} />
          <Route path="/guardian/billing" element={<ProtectedRoute><GuardianBilling /></ProtectedRoute>} />
          <Route path="/guardian/memory" element={<ProtectedRoute><GuardianMemoryBank /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
