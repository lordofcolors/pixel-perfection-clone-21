import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { EmptyLearnerDashboard } from "@/components/learner/EmptyLearnerDashboard";
import { LearnerAssignments } from "@/components/learner/LearnerAssignments";
import { AssignmentNotifications } from "@/components/learner/AssignmentNotifications";
import { LearnerWelcomeModal } from "@/components/learner/LearnerWelcomeModal";
import { useLocation } from "react-router-dom";
import { getOnboardingName, getAssignmentsForLearner } from "@/lib/store";

export default function LearnerDashboard() {
  const location = useLocation();
  const learnerName = ((location.state as any)?.firstName as string | undefined) || getOnboardingName();
  const hasAssignments = getAssignmentsForLearner(learnerName || "").length > 0;
  
  // Show welcome modal on every visit to learner dashboard
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  useEffect(() => {
    document.title = "Learner Dashboard - Curriculum";
    const desc = "Browse your curriculum and lessons.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <AppSidebar learnerName={learnerName} />

        <SidebarInset>
          <header className="h-16 flex items-center justify-between border-b px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              <h1 className="text-lg font-semibold">Chat with A</h1>
            </div>
            <div className="flex items-center">
              <AssignmentNotifications learnerName={learnerName || "Learner"} />
            </div>
          </header>

          <main className="p-6">
            <EmptyLearnerDashboard learnerName={learnerName || "Learner"} />
          </main>
        </SidebarInset>
      </div>

      <LearnerWelcomeModal 
        open={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        learnerName={learnerName || "Learner"}
      />
    </SidebarProvider>
  );
}
