import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuardianSetup from "./pages/GuardianSetup";
import LearnerDashboard from "./pages/LearnerDashboard";
import LearnerSkillSelection from "./pages/LearnerSkillSelection";
import LearnerAccount from "./pages/LearnerAccount";
import LearnerBilling from "./pages/LearnerBilling";
import GuardianManageDashboard from "./pages/GuardianManageDashboard";
import GuardianAnalyticsDashboard from "./pages/GuardianAnalyticsDashboard";
import GuardianAccount from "./pages/GuardianAccount";
import GuardianBilling from "./pages/GuardianBilling";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes - Guardian */}
          <Route path="/guardian-setup" element={
            <ProtectedRoute><GuardianSetup /></ProtectedRoute>
          } />
          <Route path="/guardian/manage" element={
            <ProtectedRoute><GuardianManageDashboard /></ProtectedRoute>
          } />
          <Route path="/guardian/separate" element={
            <ProtectedRoute><GuardianAnalyticsDashboard /></ProtectedRoute>
          } />
          <Route path="/guardian/account" element={
            <ProtectedRoute><GuardianAccount /></ProtectedRoute>
          } />
          <Route path="/guardian/billing" element={
            <ProtectedRoute><GuardianBilling /></ProtectedRoute>
          } />
          
          {/* Protected routes - Learner */}
          <Route path="/learner" element={
            <ProtectedRoute><LearnerDashboard /></ProtectedRoute>
          } />
          <Route path="/learner/add-skill" element={
            <ProtectedRoute><LearnerSkillSelection /></ProtectedRoute>
          } />
          <Route path="/learner/account" element={
            <ProtectedRoute><LearnerAccount /></ProtectedRoute>
          } />
          <Route path="/learner/billing" element={
            <ProtectedRoute><LearnerBilling /></ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
