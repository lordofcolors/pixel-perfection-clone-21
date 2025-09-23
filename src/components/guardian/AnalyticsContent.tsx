import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionTranscriptModal } from "./SessionTranscriptModal";
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
  
  // Check if any skills exist across all learners
  const setupData = getGuardianSetup();
  const skills = setupData?.skills || {};
  console.log('AnalyticsContent - setupData:', setupData);
  console.log('AnalyticsContent - skills:', skills);
  const hasAnySkills = Object.keys(skills).some(person => skills[person]?.length > 0);
  console.log('AnalyticsContent - hasAnySkills:', hasAnySkills);
  
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

  // Show empty state dashboard if no skills exist
  if (!hasAnySkills && isParentView) {
    return (
      <div className="space-y-6">
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

  // Dashboard with stats when skills exist
  const totalSessions = learners.reduce((acc, learner) => {
    const learnerSkills = skills[learner.name] || [];
    return acc + learnerSkills.length;
  }, 0);
  
  const activeLearners = learners.filter(learner => (skills[learner.name] || []).length > 0).length;
  const totalLearningTime = `${totalSessions * 15}m 30s`;
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome to Parent Dashboard, {guardianName}! 🌳</h1>
        <p className="text-muted-foreground">Track your family's learning journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Average Engagement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalLearningTime}</div>
            <div className="text-sm text-muted-foreground">Learning Time</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{activeLearners}</div>
            <div className="text-sm text-muted-foreground">Active Learners</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Learner Progress Cards */}
      <section className="grid gap-4 sm:grid-cols-2">
        {learners.map((learner) => {
          const learnerSkills = skills[learner.name] || [];
          const hasLearnerSkill = learnerSkills.length > 0;
          
          if (!hasLearnerSkill) {
            return (
              <Card key={learner.name} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelectView(learners.indexOf(learner))}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {learner.name} • Ready to Start
                    <span className="text-sm font-normal text-primary">Click to switch →</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🎯</div>
                    <p className="text-sm text-muted-foreground">
                      No lessons completed yet. Switch to {learner.name}'s account to get started!
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          return (
            <Card key={learner.name} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onSelectView(learners.indexOf(learner))}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {learner.name} • Learning Progress
                  <span className="text-sm font-normal text-primary">View details →</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">{learnerSkills.length}</div>
                    <div className="text-muted-foreground">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">{learnerSkills.length * 15}m</div>
                    <div className="text-muted-foreground">Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-primary">95%</div>
                    <div className="text-muted-foreground">Completion</div>
                  </div>
                </div>
                
                {/* Recent Sessions */}
                <div className="border-t pt-3 space-y-3">
                  <div className="text-sm font-medium">Recent Sessions:</div>
                  <div className="space-y-2">
                    {learnerSkills.slice(0, 2).map((skill, idx) => {
                      const skillName = typeof skill === 'object' && skill?.title ? skill.title : `Skill ${idx + 1}`;
                      return (
                        <div 
                          key={idx} 
                          className="border rounded-lg p-3 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 group"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSession("session-1", learner.name);
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">{skillName}</div>
                            <div className="text-xs text-primary group-hover:underline">View transcript →</div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium text-primary">15m</div>
                              <div className="text-muted-foreground">Duration</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-primary">12</div>
                              <div className="text-muted-foreground">Messages</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-primary">95%</div>
                              <div className="text-muted-foreground">Complete</div>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center gap-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed</span>
                            <span className="text-xs text-muted-foreground">{idx === 0 ? '1h ago' : '2h ago'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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