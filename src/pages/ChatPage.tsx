/**
 * =============================================================================
 * ChatPage (/chat)
 * =============================================================================
 *
 * The main "Quick Start" learning session page. Uses a unified panel layout
 * where all panels resize in-place — no overlay switching, no Rive duplication.
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useChatSession } from "@/hooks/useChatSession";
import { useRiveAssistant } from "@/hooks/useRiveAssistant";

import { ChatLoadingOverlay } from "@/components/chat/ChatLoadingOverlay";
import { ChatTopBar } from "@/components/chat/ChatTopBar";
import { Canvas } from "@/components/chat/Canvas";
import { VideoConferenceToolbar } from "@/components/chat/VideoConferenceToolbar";
import { ChatTranscriptPanel } from "@/components/chat/ChatTranscriptPanel";
import { SessionEndedView } from "@/components/chat/SessionEndedView";
import { ContinueLearningModal } from "@/components/chat/ContinueLearningModal";

import type { PanelKey } from "@/components/chat/types";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName } = (location.state as { firstName?: string }) || {};

  const session = useChatSession({ firstName });

  // Panel toggles
  const [imageSearchOn, setImageSearchOn] = useState(false);
  const [skillMapOn, setSkillMapOn] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState<PanelKey | null>(null);

  const hasSidePanels = imageSearchOn || skillMapOn || screenShareOn;

  // Auto-reset to gallery when all side panels are turned off
  useEffect(() => {
    if (!hasSidePanels && expandedPanel !== null) {
      setExpandedPanel(null);
    }
  }, [hasSidePanels, expandedPanel]);

  const { RiveComponent } = useRiveAssistant({
    showContent: session.showContent,
    hasSidePanels,
    expandedPanel,
  });

  // Session ended
  if (session.sessionEnded) {
    return (
      <>
        <SessionEndedView
          learnerName={firstName || ""}
          onBackToHome={() => navigate("/")}
          onStartNewSession={session.restartSession}
        />
        <ContinueLearningModal
          open={session.showContinueModal}
          onClose={session.closeContinueModal}
        />
      </>
    );
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <ChatLoadingOverlay
        isLoading={session.isLoading}
        loadingIndex={session.loadingIndex}
      />

      <ChatTopBar
        showContent={session.showContent}
        onBack={() => navigate("/")}
        imageSearchOn={imageSearchOn}
        onImageSearchChange={setImageSearchOn}
        skillMapOn={skillMapOn}
        onSkillMapChange={setSkillMapOn}
      />

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className={`relative flex min-h-0 flex-1 flex-col transition-all duration-500 ease-in-out ${
              session.showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            <UnifiedPanelLayout
              RiveComponent={RiveComponent}
              imageSearchOn={imageSearchOn}
              skillMapOn={skillMapOn}
              screenShareOn={screenShareOn}
              expandedPanel={expandedPanel}
              onExpandPanel={setExpandedPanel}
              chatOpen={chatOpen}
              responseBubbleText={session.responseBubbleText}
              showResponseCursor={session.showResponseCursor}
              inputValue={session.inputValue}
              onInputChange={session.setInputValue}
              onSend={session.handleInlineSend}
            />
          </div>

          <VideoConferenceToolbar
            onDisconnect={session.handleDisconnect}
            onToggleChat={() => setChatOpen((v) => !v)}
            onToggleScreenShare={() => setScreenShareOn((v) => !v)}
            isChatOpen={chatOpen}
            isScreenSharing={screenShareOn}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            chatOpen ? "w-80" : "w-0"
          }`}
        >
          {chatOpen && (
            <ChatTranscriptPanel
              firstName={firstName}
              onClose={() => setChatOpen(false)}
              messages={session.chatMessages}
              onSendMessage={session.sendMessage}
              inputValue={session.inputValue}
              onInputChange={session.setInputValue}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
