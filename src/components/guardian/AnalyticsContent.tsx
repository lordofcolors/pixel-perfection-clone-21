import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionTranscriptModal } from "./SessionTranscriptModal";
import { SafetyNotificationDropdown } from "./SafetyNotificationDropdown";
import { EmptyStateDashboard } from "./EmptyStateDashboard";
import { getGuardianSetup } from "@/lib/store";

type ViewType = "guardian" | "dashboard" | number;

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
  }
];

export function AnalyticsContent({ guardianName, learners, activeView, onSelectView }: AnalyticsContentProps) {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [safetyIssues, setSafetyIssues] = useState([...mockSafetyIssues]);
  
  // Check if any skills exist across all learners
  const setupData = getGuardianSetup();
  const skills = setupData?.skills || {};
  const hasAnySkills = Object.keys(skills).some(person => skills[person]?.length > 0);
  
  const isChildView = typeof activeView === "number";
  const isParentView = activeView === "guardian" || activeView === "dashboard";

  // For child views, show empty state
  if (isChildView) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <div className="text-6xl">🎯</div>
              <h3 className="text-lg font-semibold">Ready to Learn!</h3>
              <p className="text-muted-foreground">
                Your learning space is ready. Complete your first lesson to see your progress here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  // Show empty state dashboard if no skills exist
  if (!hasAnySkills && isParentView) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <SafetyNotificationDropdown 
            issues={[]} // No safety issues in empty state
            onViewSession={handleViewSession}
            onDismiss={handleDismissSafetyIssue}
          />
        </div>
        
        <EmptyStateDashboard 
          guardianName={guardianName}
          learners={learners}
          onSelectView={onSelectView}
        />

        <SessionTranscriptModal 
          session={selectedSession}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    );
  }

  // Simplified dashboard for when skills exist
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SafetyNotificationDropdown 
          issues={safetyIssues}
          onViewSession={handleViewSession}
          onDismiss={handleDismissSafetyIssue}
        />
      </div>
      
      {/* Session Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💬 Sessions in Learning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {learners.map((learner) => {
            const hasLearnerSkill = skills[learner.name]?.length > 0;
            if (!hasLearnerSkill) return null;
            
            const firstSkill = skills[learner.name]?.[0];
            const skillName = typeof firstSkill === 'object' && firstSkill?.title 
              ? firstSkill.title 
              : "First Skill";
            
            return (
              <div 
                key={learner.name} 
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => handleViewSession("session-1", learner.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{skillName}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>15m 30s</span>
                    <span>•</span>
                    <span>1h ago</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">First lesson</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Completed</span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">Basic concepts</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      {/* Per Learner Overview */}
      <section className="grid gap-4 sm:grid-cols-2">
        {learners.map((l) => {
          const hasLearnerSkill = skills[l.name]?.length > 0;
          if (!hasLearnerSkill) {
            return (
              <Card key={l.name} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelectView(learners.indexOf(l))}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {l.name} • Ready to Start
                    <span className="text-sm font-normal text-primary">Click to switch →</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm text-muted-foreground">
                      No lessons completed yet. Switch to {l.name}'s account to get started!
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          const firstSkill = skills[l.name]?.[0];
          const skillName = typeof firstSkill === 'object' && firstSkill?.title 
            ? firstSkill.title 
            : "First Skill";
          
          return (
            <Card key={l.name} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelectView(learners.indexOf(l))}>
              <CardHeader>
                <CardTitle>{l.name} • Currently Learning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="font-medium">{skillName}</div>
                  <div className="text-sm text-muted-foreground">1 lesson completed • 15m 30s</div>
                </div>
                <div className="border-t pt-3">
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewSession("session-1", l.name);
                    }}
                  >
                    View lesson transcript →
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <SessionTranscriptModal 
        session={selectedSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}