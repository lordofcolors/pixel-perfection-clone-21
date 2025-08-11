import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManageSidebar } from "@/components/guardian/ManageSidebar";

export default function GuardianManageDashboard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const learners = [
    { name: "Jake" },
    { name: "Mia" },
  ];

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ManageSidebar learners={learners} activeIndex={activeIndex} onSelectLearner={setActiveIndex} />

        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Managing learners</h1>
            <span className="ml-2 text-muted-foreground">Currently viewing: {learners[activeIndex].name}</span>
          </header>

          <main className="p-6 space-y-4">
            <section>
              <h2 className="text-lg font-medium">Progress summary</h2>
              <p className="text-sm text-muted-foreground">This is a mock view. Choose a lesson in the left tree under {learners[activeIndex].name}.</p>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
