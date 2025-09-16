import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { EmptyLearnerDashboard } from "@/components/learner/EmptyLearnerDashboard";
import { useLocation } from "react-router-dom";
import { getOnboardingName } from "@/lib/store";

export default function LearnerDashboard() {
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
  const location = useLocation();
  const learnerName = ((location.state as any)?.firstName as string | undefined) || getOnboardingName();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar learnerName={learnerName} />

        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <nav aria-label="Breadcrumb" className="text-sm opacity-90">
              <span>Master Dog Walking</span>
            </nav>
          </header>

          <main className="p-6">
            <EmptyLearnerDashboard learnerName={learnerName || "Learner"} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
