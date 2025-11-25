import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { GuardianDashboardSidebar } from "@/components/guardian/GuardianDashboardSidebar";
import { AnalyticsContent } from "@/components/guardian/AnalyticsContent";
import { getGuardianSetup } from "@/lib/store";

export default function GuardianAnalyticsDashboard() {
  const setup = getGuardianSetup();
  const guardianName = setup?.guardianName || "Tree Guardian";
  const learners = setup?.learners || [{ name: "Jake" }, { name: "Mia" }];

  useEffect(() => {
    document.title = "Guardian - Family Dashboard";
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
        <GuardianDashboardSidebar guardianName={guardianName} />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Family Dashboard</h1>
          </header>
          <main className="p-6 space-y-6">
            <AnalyticsContent 
              guardianName={guardianName} 
              learners={learners} 
              activeView="guardian" 
              onSelectView={() => {}} 
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
