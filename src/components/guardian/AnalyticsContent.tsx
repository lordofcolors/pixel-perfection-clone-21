import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SessionTranscriptModal } from "./SessionTranscriptModal";
import { EmptyStateDashboard } from "./EmptyStateDashboard";
import { AssignmentDialog } from "./AssignmentDialog";
import { getGuardianSetup, getAssignmentsForLearner } from "@/lib/store";

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
  const [showAllLessons, setShowAllLessons] = useState<{[key: string]: boolean}>({});
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedLearnerForAssignment, setSelectedLearnerForAssignment] = useState<string>("");
  
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
  const totalLessons = learners.reduce((acc, learner) => {
    const learnerSkills = skills[learner.name] || [];
    return acc + learnerSkills.length;
  }, 0);
  
  const activeLearners = learners.filter(learner => (skills[learner.name] || []).length > 0).length;
  const totalLearningTime = `${totalLessons * 15}m 30s`;
  const skillsInProgress = totalLessons;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <p className="text-muted-foreground">Track progress and assign lessons to your children</p>
      </div>

      {/* Welcome Header - Always show */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="text-2xl">🎯</div>
            Welcome to Your Parent Dashboard, {guardianName}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Your family's learning journey starts here. Track progress, view lesson transcripts, and monitor engagement across all your children's accounts.
            </p>
            <div className="bg-white/50 dark:bg-background/50 rounded-lg p-4 border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                📚 What You Can Track:
              </h4>
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Real-time progress tracking
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Lesson completion analytics
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Session transcript access
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Time spent monitoring
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{activeLearners}</div>
            <div className="text-sm text-muted-foreground">Active Learners</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{skillsInProgress}</div>
            <div className="text-sm text-muted-foreground">Skills in Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalLessons}</div>
            <div className="text-sm text-muted-foreground">Total Lessons Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalLearningTime}</div>
            <div className="text-sm text-muted-foreground">Learning Time</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Learners Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👥 Your Learners - Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 items-stretch">{/* Added items-stretch for equal heights */}
            {learners.map((learner) => {
              const learnerSkills = skills[learner.name] || [];
              const hasLearnerSkill = learnerSkills.length > 0;
              
              return (
                <Card key={learner.name} className="border-2 h-full">
                  <CardContent className="p-6 h-full">
                    <div className="flex flex-col h-full">
                      {/* Header with both CTAs */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{learner.name}</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLearnerForAssignment(learner.name);
                              setAssignmentDialogOpen(true);
                            }}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Assign
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => onSelectView(learners.indexOf(learner))}
                          >
                            Switch Account
                          </Button>
                        </div>
                      </div>
                      
                      {!hasLearnerSkill ? (
                        // Empty State Layout
                        <div className="flex flex-col flex-1 min-h-[400px]">
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="text-center py-4">
                              <div className="text-4xl mb-2">🎯</div>
                              <p className="text-sm text-muted-foreground">
                                Ready to start their learning journey
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Populated State Layout
                        <div className="flex flex-col flex-1 min-h-[400px]">
                          <div className="flex-1 space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="font-semibold text-primary">{learnerSkills.length}</div>
                                <div className="text-muted-foreground">Skills</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-primary">{learnerSkills.length}</div>
                                <div className="text-muted-foreground">Lessons</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-primary">{learnerSkills.length * 15}m</div>
                                <div className="text-muted-foreground">Time</div>
                              </div>
                            </div>

                            {/* Recent Lessons */}
                            <div className="border-t pt-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">Recent Lessons:</div>
                                {learnerSkills.length > 3 && (
                                  <button 
                                    className="text-xs text-primary hover:underline"
                                    onClick={() => setShowAllLessons(prev => ({
                                      ...prev,
                                      [learner.name]: !prev[learner.name]
                                    }))}
                                  >
                                    {showAllLessons[learner.name] ? 'Show Less' : 'View All'}
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                {learnerSkills.slice(0, showAllLessons[learner.name] ? learnerSkills.length : 3).map((skill, idx) => {
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
                                      
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="text-center">
                                          <div className="font-medium text-primary">15m</div>
                                          <div className="text-muted-foreground">Duration</div>
                                        </div>
                                        <div className="text-center">
                                          <div className="font-medium text-primary">12</div>
                                          <div className="text-muted-foreground">Messages</div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-2 flex items-center gap-2">
                                        {idx === 0 ? (
                                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">In Progress</span>
                                        ) : (
                                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed</span>
                                        )}
                                        <span className="text-xs text-muted-foreground">{idx === 0 ? '1h ago' : '2h ago'}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <SessionTranscriptModal 
        session={selectedSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <AssignmentDialog 
        open={assignmentDialogOpen}
        onOpenChange={setAssignmentDialogOpen}
        learnerName={selectedLearnerForAssignment}
      />
    </div>
  );
}