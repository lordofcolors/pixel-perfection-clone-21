import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManageSidebar } from "@/components/guardian/ManageSidebar";
import { AnalyticsContent } from "@/components/guardian/AnalyticsContent";
import { getGuardianSetup } from "@/lib/store";

export default function GuardianManageDashboard() {
  const [activeView, setActiveView] = useState<"guardian" | "dashboard" | number>("guardian");
  const data = getGuardianSetup();
  const guardianName = data?.guardianName || "Tree Guardian";
  const learners = data?.learners || [{ name: "Jake" }, { name: "Mia" }];

  useEffect(() => {
    document.title = "Guardian - Manage Learners";
    const desc = "Manage learners and follow each curriculum.";
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

  const viewingLabel = activeView === "guardian" ? guardianName 
    : activeView === "dashboard" ? "Family Dashboard"
    : learners[activeView].name;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ManageSidebar
          learners={learners}
          guardianName={guardianName}
          activeView={activeView}
          onSelectView={setActiveView}
        />

        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Managing</h1>
            <span className="ml-2 text-muted-foreground">Currently viewing: {viewingLabel}</span>
          </header>

          <main className="p-6 space-y-6">
            <AnalyticsContent 
              guardianName={guardianName} 
              learners={learners} 
              activeView={activeView} 
              onSelectView={setActiveView}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
