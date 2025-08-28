import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IndividualLearnerAnalytics } from "./IndividualLearnerAnalytics";
import { SessionTranscriptModal } from "./SessionTranscriptModal";
import { SafetyNotificationDropdown } from "./SafetyNotificationDropdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type ViewType = "guardian" | number;

interface AnalyticsContentProps {
  guardianName: string;
  learners: { name: string }[];
  activeView: ViewType;
  onSelectView: (view: ViewType) => void;
}

// Mock session data - would come from your analytics service
const mockSessionData = {
  "session-1": {
    id: "session-1",
    title: "Fashion Basics",
    duration: "15 minutes",
    messagesCount: 12,
    completionRate: 95,
    status: "completed" as const,
    learnerName: "Jake",
    completedAt: "2024-01-15 14:30",
    transcript: [
      {
        timestamp: "02:27:00 PM",
        speaker: "Assistant" as const,
        content: "Hey Andrew! I'm A, welcome to your first lesson on fashion! Ready to get started?"
      },
      {
        timestamp: "02:27:18 PM",
        speaker: "You" as const,
        content: "Uh, yeah."
      },
      {
        timestamp: "02:27:18 PM",
        speaker: "Assistant" as const,
        content: "Great! And I gotta say, I like your outfit! The white tee is a clean look, and I dig the layered necklace. Now, what style are you going for? Like, what interests you the most in fashion?"
      },
      {
        timestamp: "02:28:01 PM",
        speaker: "You" as const,
        content: "fashion trends"
      },
      {
        timestamp: "02:28:01 PM",
        speaker: "Assistant" as const,
        content: "Perfect choice! Are you familiar with any trends right now? Like streetwear, casual, minimalist, vintage, or any other styles that catch your eye?"
      }
    ]
  },
  "session-2": {
    id: "session-2",
    title: "Pet Training Session",
    duration: "12 minutes",
    messagesCount: 8,
    completionRate: 88,
    status: "flagged" as const,
    learnerName: "Mia",
    completedAt: "2024-01-14 16:45",
    transcript: [
      {
        timestamp: "04:45:00 PM",
        speaker: "Assistant" as const,
        content: "Hi Mia! Let's talk about training your dog today. What specific behavior would you like to work on?"
      },
      {
        timestamp: "04:45:30 PM",
        speaker: "You" as const,
        content: "My dog won't listen and I'm getting really frustrated. Sometimes I feel like giving up on everything."
      },
      {
        timestamp: "04:45:45 PM",
        speaker: "Assistant" as const,
        content: "I understand that training can be challenging. It sounds like you're feeling overwhelmed. That's completely normal when working with pets. Let's focus on some positive training techniques that can help.",
        flagged: true
      }
    ]
  }
};

// Mock safety issues - would come from your content moderation service
const mockSafetyIssues = [
  {
    id: "safety-1",
    learnerName: "Jake",
    lessonTitle: "Math Adventure",
    flaggedContent: "I want to hurt myself",
    severity: "high" as const,
    timestamp: "2h ago",
    sessionId: "session-1"
  },
  {
    id: "safety-2",
    learnerName: "Mia",
    lessonTitle: "Creative Writing",
    flaggedContent: "I feel like nobody cares about me",
    severity: "medium" as const,
    timestamp: "4h ago",
    sessionId: "session-2"
  },
  {
    id: "safety-3",
    learnerName: "Mia",
    lessonTitle: "Language Arts",
    flaggedContent: "Everyone hates me and I should just give up",
    severity: "high" as const,
    timestamp: "2d ago",
    sessionId: "session-2"
  }
];

export function AnalyticsContent({ guardianName, learners, activeView, onSelectView }: AnalyticsContentProps) {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [safetyIssues, setSafetyIssues] = useState([...mockSafetyIssues]);
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

  const handleViewSession = (sessionId: string, learnerName: string) => {
    const session = mockSessionData[sessionId as keyof typeof mockSessionData];
    if (session) {
      setSelectedSession(session);
      setModalOpen(true);
    }
  };

  const handleDismissSafetyIssue = (issueId: string) => {
    setSafetyIssues(issues => issues.filter(issue => issue.id !== issueId));
  };

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
      <div className="flex justify-end">
        <SafetyNotificationDropdown 
          issues={safetyIssues}
          onViewSession={handleViewSession}
          onDismiss={handleDismissSafetyIssue}
        />
      </div>
      
      {/* Family Aggregation Stats */}
      {renderSummaryCards()}
      
      {/* Individual Child Analytics with Tab Navigation */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Individual Learning Analytics</h2>
        <Tabs defaultValue={learners[0]?.name || "jake"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {learners.map((learner) => (
              <TabsTrigger key={learner.name} value={learner.name} className="capitalize">
                {learner.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {learners.map((learner) => (
            <TabsContent key={learner.name} value={learner.name} className="space-y-4">
              <IndividualLearnerAnalytics 
                learners={[learner]}
                onViewSession={handleViewSession}
                activeView={0}
                onSelectView={() => {}}
                showOnlyIndividual={true}
                learnerName={learner.name}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <SessionTranscriptModal 
        session={selectedSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      
      <p className="sr-only">Currently viewing: {viewingLabel}</p>
    </div>
  );
}
