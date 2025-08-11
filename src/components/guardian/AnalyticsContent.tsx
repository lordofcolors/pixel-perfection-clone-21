import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ViewType = "guardian" | number;

interface AnalyticsContentProps {
  guardianName: string;
  learners: { name: string }[];
  activeView: ViewType;
}

export function AnalyticsContent({ guardianName, learners, activeView }: AnalyticsContentProps) {
  // Mock data keyed by learner name
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

  const values = learners
    .map((l) => data[l.name as keyof typeof data])
    .filter(Boolean) as Array<(typeof data)[keyof typeof data]>;

  const avgCompletion = values.length
    ? Math.round(values.reduce((a, b) => a + b.completion, 0) / values.length)
    : 0;
  const totalCompleted = values.reduce((a, b) => a + b.completedLessons, 0);

  const combinedRecent = learners.flatMap((l) => {
    const d = data[l.name as keyof typeof data];
    return d ? d.recent.slice(0, 1).map((r) => ({ who: l.name, ...r })) : [];
  });

  const isGuardian = activeView === "guardian";
  const viewingLabel = isGuardian ? guardianName : learners[activeView].name;

  const renderSummaryCards = () => {
    if (isGuardian) {
      return (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Average completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{avgCompletion}%</div>
              <Progress value={avgCompletion} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lessons completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totalCompleted}</div>
              <p className="text-sm text-muted-foreground">Across all learners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{Math.max(...values.map((v) => v.streak)) || 0} days</div>
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
            <div className="text-2xl font-semibold">{d?.completion ?? 0}%</div>
            <Progress value={d?.completion ?? 0} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lessons completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{d?.completedLessons ?? 0}</div>
            <p className="text-sm text-muted-foreground">Completed so far</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{d?.streak ?? 0} days</div>
          </CardContent>
        </Card>
      </section>
    );
  };

  const renderRecent = () => {
    if (isGuardian) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {combinedRecent.map((r, idx) => (
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
          {(d?.recent ?? []).map((r, idx) => (
            <div className="flex justify-between" key={idx}>
              <span>{r.label}</span>
              <span className="text-muted-foreground">{r.when}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderPerLearner = () => {
    if (!isGuardian) return null;
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
                <div className="text-sm">Completion: <strong>{d?.completion ?? 0}%</strong></div>
                <div className="text-sm">Completed lessons: <strong>{d?.completedLessons ?? 0}</strong></div>
                <div className="text-sm">Streak: <strong>{d?.streak ?? 0} days</strong></div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    );
  };

  return (
    <div className="space-y-6">
      {renderSummaryCards()}
      <section>{renderRecent()}</section>
      {renderPerLearner()}
      <p className="sr-only">Currently viewing: {viewingLabel}</p>
    </div>
  );
}
