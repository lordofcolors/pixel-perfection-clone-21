import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Flag } from "lucide-react";
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

// Mock conversations data for prototype - prepopulated list
const MOCK_CONVERSATIONS = [
  { id: 1, title: "Public Speaking Session Overview", duration: "16.4s", messages: 2, timestamp: "2026-01-06, 12:05:47 p.m.", isFlagged: false },
  { id: 2, title: "User's Appreciation and Next Steps in Learning", duration: "1m 1.5s", messages: 8, timestamp: "2026-01-06, 12:05:18 p.m.", isFlagged: false },
  { id: 3, title: "Cảm giác chán nản trong cuộc sống", duration: "14.8s", messages: 1, timestamp: "2026-01-06, 11:57:25 a.m.", isFlagged: true },
  { id: 4, title: "Confidence Building Practice", duration: "12m 30s", messages: 24, timestamp: "2026-01-05, 3:45:00 p.m.", isFlagged: true },
  { id: 5, title: "Interview Skills Workshop", duration: "18m 15s", messages: 32, timestamp: "2026-01-05, 2:30:00 p.m.", isFlagged: false },
  { id: 6, title: "Dealing with Stress at School", duration: "8m 45s", messages: 16, timestamp: "2026-01-04, 4:20:00 p.m.", isFlagged: true },
];

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
  const navigate = useNavigate();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAllLessons, setShowAllLessons] = useState<{[key: string]: boolean}>({});
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedLearnerForAssignment, setSelectedLearnerForAssignment] = useState<string>("");
  const [showFlaggedOnly, setShowFlaggedOnly] = useState<{[key: string]: boolean}>({});
  
  // Check if any skills exist across all learners
  const setupData = getGuardianSetup();
  const skills = setupData?.skills || {};
  console.log('AnalyticsContent - setupData:', setupData);
  console.log('AnalyticsContent - skills:', skills);
  const hasAnySkills = Object.keys(skills).some(person => skills[person]?.length > 0);
  console.log('AnalyticsContent - hasAnySkills:', hasAnySkills);
  
  const isChildView = typeof activeView === "number";
  const isParentView = activeView === "guardian" || activeView === "dashboard";

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
        <h2 className="text-2xl font-bold">Family Dashboard</h2>
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
                      {/* Header with Assign CTA */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold">{learner.name}</h3>
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
                      </div>
                      
                      {/* Always show the populated layout with mock conversations for prototype */}
                      {(
                        // Populated State Layout
                        <div className="flex flex-col flex-1 min-h-[400px]">
                          <div className="flex-1 space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="text-center">
                                <div className="font-semibold text-primary">{MOCK_CONVERSATIONS.length}</div>
                                <div className="text-muted-foreground">Skills in Progress</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-primary">{MOCK_CONVERSATIONS.length}</div>
                                <div className="text-muted-foreground">Lessons Completed</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-primary">15m 40.2s</div>
                                <div className="text-muted-foreground">Spent Learning</div>
                              </div>
                            </div>

                            {/* All Conversations with Filter */}
                            <div className="border-t pt-3 space-y-3">
                              <div className="text-sm font-medium">All Conversations</div>
                              
                              {/* Filter Chip Row */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowFlaggedOnly(prev => ({
                                    ...prev,
                                    [learner.name]: !prev[learner.name]
                                  }))}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                    showFlaggedOnly[learner.name]
                                      ? 'bg-destructive text-destructive-foreground'
                                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                  }`}
                                >
                                  <Flag className="h-3 w-3" />
                                  Flagged
                                </button>
                              </div>
                              
                              {/* Conversation List */}
                              <div className="space-y-2">
                                {(() => {
                                  // Use prepopulated mock conversations
                                  const conversations = MOCK_CONVERSATIONS;
                                  
                                  // Filter based on showFlaggedOnly state
                                  const filteredConversations = showFlaggedOnly[learner.name]
                                    ? conversations.filter(c => c.isFlagged)
                                    : conversations;
                                  
                                  // Apply show all/less logic
                                  const displayedConversations = filteredConversations.slice(
                                    0, 
                                    showAllLessons[learner.name] ? filteredConversations.length : 3
                                  );
                                  
                                  if (displayedConversations.length === 0 && showFlaggedOnly[learner.name]) {
                                    return (
                                      <div className="text-center py-4 text-sm text-muted-foreground">
                                        No flagged conversations
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <>
                                      {displayedConversations.map((conv) => (
                                        <div 
                                          key={conv.id} 
                                          className={`border rounded-lg p-3 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200 group ${
                                            conv.isFlagged ? 'border-destructive/50 bg-destructive/5' : ''
                                          }`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewSession("session-1", learner.name);
                                          }}
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <div className="font-medium text-sm">{conv.title}</div>
                                            {conv.isFlagged && (
                                              <Badge variant="destructive" className="text-xs">
                                                FLAGGED
                                              </Badge>
                                            )}
                                          </div>
                                          
                                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                            <span>⏱ {conv.duration}</span>
                                            <span>💬 {conv.messages} messages</span>
                                          </div>
                                          
                                          <div className="text-xs text-muted-foreground">
                                            {conv.timestamp}
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {filteredConversations.length > 3 && (
                                        <button 
                                          className="text-xs text-primary hover:underline w-full text-center py-2"
                                          onClick={() => setShowAllLessons(prev => ({
                                            ...prev,
                                            [learner.name]: !prev[learner.name]
                                          }))}
                                        >
                                          {showAllLessons[learner.name] ? 'Show Less' : `View All (${filteredConversations.length})`}
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          <Button 
                            className="w-full mt-auto" 
                            onClick={() => navigate('/learner', { state: { firstName: learner.name } })}
                          >
                            Switch to {learner.name}'s Account
                          </Button>
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