import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManageSidebar } from "@/components/guardian/ManageSidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { AnalyticsContent } from "@/components/guardian/AnalyticsContent";
import { SkillSelectionView } from "@/components/guardian/SkillSelectionView";
import { EmptyLearnerDashboard } from "@/components/learner/EmptyLearnerDashboard";
import { AssignmentNotifications } from "@/components/learner/AssignmentNotifications";
import { SafetyNotificationDropdown, MOCK_SAFETY_ALERTS } from "@/components/guardian/SafetyNotificationDropdown";
import { SessionTranscriptModal } from "@/components/guardian/SessionTranscriptModal";
import { getGuardianSetup } from "@/lib/store";

// Mock session data for safety alerts
const MOCK_SESSIONS: { [key: string]: any } = {
  "session-1": {
    id: "session-1",
    title: "Interview Practice Session",
    duration: "12 min",
    messagesCount: 24,
    completionRate: 75,
    status: "flagged",
    learnerName: "Jake",
    completedAt: "2 hours ago",
    transcript: [
      { timestamp: "2:30 PM", speaker: "Assistant", content: "Let's practice answering common interview questions. How would you describe yourself?" },
      { timestamp: "2:31 PM", speaker: "You", content: "I'm okay at some things I guess..." },
      { timestamp: "2:32 PM", speaker: "Assistant", content: "That's a start! Can you think of specific strengths you have?" },
      { timestamp: "2:33 PM", speaker: "You", content: "I've been feeling really down lately and sometimes I don't want to do anything...", flagged: true },
      { timestamp: "2:34 PM", speaker: "Assistant", content: "I hear you, and I want you to know those feelings are valid. Would you like to talk about what's been making you feel this way?" },
      { timestamp: "2:35 PM", speaker: "You", content: "It's just hard sometimes, you know?" },
    ]
  },
  "session-2": {
    id: "session-2",
    title: "Public Speaking Exercise",
    duration: "8 min",
    messagesCount: 16,
    completionRate: 50,
    status: "flagged",
    learnerName: "Mia",
    completedAt: "Yesterday",
    transcript: [
      { timestamp: "4:00 PM", speaker: "Assistant", content: "Today we'll work on speaking confidently in front of groups. How do you feel about presenting?" },
      { timestamp: "4:01 PM", speaker: "You", content: "I hate it. Everyone stares at me." },
      { timestamp: "4:02 PM", speaker: "Assistant", content: "That can feel uncomfortable. What specifically worries you about people looking at you?" },
      { timestamp: "4:03 PM", speaker: "You", content: "Nobody at school likes me and I feel like I'm all alone...", flagged: true },
      { timestamp: "4:04 PM", speaker: "Assistant", content: "I'm sorry you're feeling that way. Feeling alone can be really hard. Can you tell me more about what's happening at school?" },
    ]
  },
  "session-3": {
    id: "session-3",
    title: "Confidence Building",
    duration: "15 min",
    messagesCount: 30,
    completionRate: 90,
    status: "flagged",
    learnerName: "Jake",
    completedAt: "2 days ago",
    transcript: [
      { timestamp: "11:00 AM", speaker: "Assistant", content: "Let's work on building your confidence today. What's a situation where you'd like to feel more confident?" },
      { timestamp: "11:01 AM", speaker: "You", content: "When people are mean to me" },
      { timestamp: "11:02 AM", speaker: "Assistant", content: "That's a really important area. Can you tell me about a recent time when someone was mean to you?" },
      { timestamp: "11:03 AM", speaker: "You", content: "Sometimes I get so angry I just want to break things...", flagged: true },
      { timestamp: "11:04 AM", speaker: "Assistant", content: "It sounds like you're experiencing some really strong emotions. It's okay to feel angry, but let's talk about healthy ways to handle those feelings." },
    ]
  }
};

export default function GuardianManageDashboard() {
  const [activeView, setActiveView] = useState<"guardian" | "dashboard" | "skillSelection" | number>("guardian");
  const [previousView, setPreviousView] = useState<"guardian" | "dashboard" | number>("guardian");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [safetyAlerts] = useState(MOCK_SAFETY_ALERTS);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [transcriptModalOpen, setTranscriptModalOpen] = useState(false);
  
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
    : activeView === "skillSelection" ? "New Skill"
    : learners[activeView].name;

  const isLearnerView = typeof activeView === "number";
  const currentLearner = isLearnerView ? learners[activeView] : null;

  const handleViewSession = (sessionId: string, learnerName: string) => {
    const session = MOCK_SESSIONS[sessionId];
    if (session) {
      setSelectedSession(session);
      setTranscriptModalOpen(true);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isLearnerView ? (
          <AppSidebar learnerName={currentLearner?.name} />
        ) : (
          <ManageSidebar
            learners={learners}
            guardianName={guardianName}
            activeView={activeView}
            onSelectView={(view) => {
              if (view !== "skillSelection") {
                setPreviousView(activeView !== "skillSelection" ? activeView : previousView);
              }
              setActiveView(view);
            }}
            onCreateSkill={(targetIndex?: number) => {
              const nextIndex = typeof targetIndex === 'number'
                ? targetIndex
                : (typeof activeView === 'number' ? activeView : 0);
              setPreviousView(nextIndex);
              setActiveView("skillSelection");
            }}
            refreshTrigger={refreshTrigger}
            createForIndex={typeof previousView === 'number' ? previousView : (typeof activeView === 'number' ? activeView : undefined)}
          />
        )}

        <SidebarInset>
          <header className="h-16 flex items-center justify-between border-b px-3">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="mr-2" />
              {isLearnerView ? (
                <h1 className="text-lg font-semibold">Chat with A</h1>
              ) : (
                <>
                  <h1 className="text-base font-semibold">Managing</h1>
                  <span className="ml-2 text-muted-foreground">Currently viewing: {viewingLabel}</span>
                </>
              )}
            </div>
            <div className="flex items-center">
              {isLearnerView && currentLearner ? (
                <AssignmentNotifications learnerName={currentLearner.name} />
              ) : (
                <SafetyNotificationDropdown 
                  issues={safetyAlerts}
                  onViewSession={handleViewSession}
                />
              )}
            </div>
          </header>

          <main className="p-6">
            {isLearnerView ? (
              <EmptyLearnerDashboard learnerName={currentLearner?.name || "Learner"} />
            ) : activeView === "skillSelection" ? (
              <SkillSelectionView
                guardianName={guardianName}
                learners={learners}
                onBack={() => setActiveView(previousView)}
                onSkillCreated={() => setRefreshTrigger(prev => prev + 1)}
                activeView={previousView}
              />
            ) : (
              <AnalyticsContent 
                guardianName={guardianName} 
                learners={learners} 
                activeView={activeView} 
                onSelectView={setActiveView}
              />
            )}
          </main>
        </SidebarInset>
      </div>

      <SessionTranscriptModal
        session={selectedSession}
        open={transcriptModalOpen}
        onOpenChange={setTranscriptModalOpen}
      />
    </SidebarProvider>
  );
}
