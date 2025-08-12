import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GuardianSetup from "./pages/GuardianSetup";
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerAccount from "./pages/LearnerAccount";
import LearnerBilling from "./pages/LearnerBilling";
import GuardianManageDashboard from "./pages/GuardianManageDashboard";
import GuardianAnalyticsDashboard from "./pages/GuardianAnalyticsDashboard";
import GuardianAccount from "./pages/GuardianAccount";
import GuardianBilling from "./pages/GuardianBilling";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/guardian-setup" element={<GuardianSetup />} />
          <Route path="/learner" element={<LearnerDashboard />} />
          <Route path="/learner/account" element={<LearnerAccount />} />
          <Route path="/learner/billing" element={<LearnerBilling />} />
          <Route path="/guardian/manage" element={<GuardianManageDashboard />} />
          <Route path="/guardian/separate" element={<GuardianAnalyticsDashboard />} />
          <Route path="/guardian/account" element={<GuardianAccount />} />
          <Route path="/guardian/billing" element={<GuardianBilling />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
