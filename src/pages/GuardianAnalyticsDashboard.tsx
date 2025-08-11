import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AnalyticsSidebar } from "@/components/guardian/AnalyticsSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function GuardianAnalyticsDashboard() {
  const guardianName = "Alex Guardian";
  const learners = [{ name: "Jake" }, { name: "Mia" }];
  const [activeView, setActiveView] = useState<"guardian" | number>("guardian");

  const data = {
    Jake: {
      completion: 68,
      completedLessons: 14,
      streak: 4,
      recent: [
        { label: "1: Leash Skills and Safety", when: "2h ago" },
        { label: "0: Assessment", when: "2d ago" },
      ],
    },
    Mia: {
      completion: 80,
      completedLessons: 20,
      streak: 6,
      recent: [
        { label: "2: Meeting Other Dogs Safely", when: "1d ago" },
        { label: "1: Leash Skills and Safety", when: "3d ago" },
      ],
    },
  } as const;

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

  const combined = useMemo(() => {
    const values = Object.values(data);
    const avgCompletion = Math.round(values.reduce((a, b) => a + b.completion, 0) / values.length);
    const totalCompleted = values.reduce((a, b) => a + b.completedLessons, 0);
    const recent = [
      { who: "Jake", ...data.Jake.recent[0] },
      { who: "Mia", ...data.Mia.recent[0] },
      { who: "Jake", ...data.Jake.recent[1] },
    ];
    return { avgCompletion, totalCompleted, recent };
  }, [data]);

  const viewingLabel = activeView === "guardian" ? guardianName : learners[activeView].name;

  const renderSummaryCards = () => {
    if (activeView === "guardian") {
      return (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Average completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{combined.avgCompletion}%</div>
              <Progress value={combined.avgCompletion} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lessons completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{combined.totalCompleted}</div>
              <p className="text-sm text-muted-foreground">Across all learners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{Math.max(data.Jake.streak, data.Mia.streak)} days</div>
              <p className="text-sm text-muted-foreground">Longest streak among learners</p>
            </CardContent>
          </Card>
        </section>
      );
    }

    const key = learners[activeView].name as keyof typeof data;
    const d = data[key];
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{d.completion}%</div>
            <Progress value={d.completion} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lessons completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{d.completedLessons}</div>
            <p className="text-sm text-muted-foreground">Completed so far</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{d.streak} days</div>
          </CardContent>
        </Card>
      </section>
    );
  };

  const renderRecentActivity = () => {
    if (activeView === "guardian") {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {combined.recent.map((r, idx) => (
              <div className="flex justify-between" key={idx}>
                <span>{r.who} • {r.label}</span>
                <span className="text-muted-foreground">{r.when}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    const key = learners[activeView].name as keyof typeof data;
    const d = data[key];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent activity • {key}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {d.recent.map((r, idx) => (
            <div className="flex justify-between" key={idx}>
              <span>{r.label}</span>
              <span className="text-muted-foreground">{r.when}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderPerLearnerBreakdown = () => {
    if (activeView !== "guardian") return null;
    return (
      <section className="grid gap-4 sm:grid-cols-2">
        {learners.map((l) => {
          const k = l.name as keyof typeof data;
          const d = data[k];
          return (
            <Card key={l.name}>
              <CardHeader>
                <CardTitle>{l.name} • Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">Completion: <strong>{d.completion}%</strong></div>
                <div className="text-sm">Completed lessons: <strong>{d.completedLessons}</strong></div>
                <div className="text-sm">Streak: <strong>{d.streak} days</strong></div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AnalyticsSidebar
          guardianName={guardianName}
          learners={learners}
          activeView={activeView}
          onSelectView={setActiveView}
        />
        <SidebarInset>
          <header className="h-16 flex items-center border-b px-3">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-base font-semibold">Learner analytics</h1>
            <span className="ml-2 text-muted-foreground">Viewing: {viewingLabel}</span>
          </header>
          <main className="p-6 space-y-6">
            {renderSummaryCards()}
            <section>
              {renderRecentActivity()}
            </section>
            {renderPerLearnerBreakdown()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
