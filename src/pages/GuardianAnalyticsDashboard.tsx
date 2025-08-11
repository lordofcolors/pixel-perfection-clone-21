import { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsSidebar } from "@/components/guardian/AnalyticsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function GuardianAnalyticsDashboard() {
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
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Average completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">72%</div>
                  <Progress value={72} className="mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Lessons completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">34</div>
                  <p className="text-sm text-muted-foreground">Across all learners</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">5 days</div>
                  <p className="text-sm text-muted-foreground">Longest: 12 days</p>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Jake • 1: Leash Skills and Safety</span><span className="text-muted-foreground">2h ago</span></div>
                  <div className="flex justify-between"><span>Mia • 0: Assessment</span><span className="text-muted-foreground">1d ago</span></div>
                  <div className="flex justify-between"><span>Jake • 2: Meeting Other Dogs Safely</span><span className="text-muted-foreground">3d ago</span></div>
                </CardContent>
              </Card>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
