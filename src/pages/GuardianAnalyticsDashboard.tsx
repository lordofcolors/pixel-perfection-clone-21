import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsSidebar } from "@/components/guardian/AnalyticsSidebar";
import { AnalyticsContent } from "@/components/guardian/AnalyticsContent";

export default function GuardianAnalyticsDashboard() {
  const guardianName = "Alex Guardian";
  const learners = [{ name: "Jake" }, { name: "Mia" }];

  useEffect(() => {
    document.title = "Guardian - Analytics";
    const desc = "Overview of learners' progress and activity.";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AnalyticsSidebar />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Learner analytics</h1>
          </header>
          <main className="p-6 space-y-6">
            <AnalyticsContent guardianName={guardianName} learners={learners} activeView="guardian" />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
