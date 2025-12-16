import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ManageSidebar } from "@/components/guardian/ManageSidebar";
import { AppSidebar } from "@/components/learner/AppSidebar";
import { AnalyticsContent } from "@/components/guardian/AnalyticsContent";
import { SkillSelectionView } from "@/components/guardian/SkillSelectionView";
import { EmptyLearnerDashboard } from "@/components/learner/EmptyLearnerDashboard";
import { AssignmentNotifications } from "@/components/learner/AssignmentNotifications";
import { SafetyNotificationDropdown, MOCK_PARENT_NOTIFICATIONS } from "@/components/guardian/SafetyNotificationDropdown";
import { SessionTranscriptModal } from "@/components/guardian/SessionTranscriptModal";
import { getGuardianSetup } from "@/lib/store";

// Mock session data for safety alerts
const MOCK_SESSIONS: { [key: string]: any } = {
  "session-1": {
    id: "session-1",
    title: "Confidence Building",
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
      { timestamp: "2:35 PM", speaker: "You", content: "It's just hard sometimes, you know? I feel like nothing I do matters.", flagged: true },
      { timestamp: "2:36 PM", speaker: "Assistant", content: "It sounds like you're going through a really tough time. What you're feeling is important." },
      { timestamp: "2:37 PM", speaker: "You", content: "Sometimes I think everyone would be better off without me around.", flagged: true },
      { timestamp: "2:38 PM", speaker: "Assistant", content: "I'm really glad you shared that with me. Those thoughts can feel very heavy. Have you talked to anyone else about how you're feeling?" },
    ]
  },
  "session-2": {
    id: "session-2",
    title: "Social Skills Practice",
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
      { timestamp: "4:05 PM", speaker: "You", content: "The other kids are mean to me every day. They say I'm weird and ugly.", flagged: true },
      { timestamp: "4:06 PM", speaker: "Assistant", content: "That sounds really hurtful. No one deserves to be treated that way." },
      { timestamp: "4:07 PM", speaker: "You", content: "I don't even want to go to school anymore. I just want to disappear.", flagged: true },
    ]
  },
  "session-3": {
    id: "session-3",
    title: "Emotion Management",
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
      { timestamp: "11:05 AM", speaker: "You", content: "I punched a wall at home last week. My hand still hurts.", flagged: true },
      { timestamp: "11:06 AM", speaker: "Assistant", content: "I'm concerned about you hurting yourself. Have you talked to a grown-up about what happened?" },
      { timestamp: "11:07 AM", speaker: "You", content: "No, they don't care. Nobody cares about me.", flagged: true },
    ]
  }
};

export default function GuardianManageDashboard() {
  const [activeView, setActiveView] = useState<"guardian" | "dashboard" | "skillSelection" | number>("guardian");
  const [previousView, setPreviousView] = useState<"guardian" | "dashboard" | number>("guardian");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notifications] = useState(MOCK_PARENT_NOTIFICATIONS);
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
                  notifications={notifications}
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
