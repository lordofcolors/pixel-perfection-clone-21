/**
 * =============================================================================
 * ChatPage (/chat)
 * =============================================================================
 *
 * The main "Quick Start" learning session page. This is a video-conference-
 * inspired interface where the learner interacts with an animated AI assistant
 * ("A") via text chat.
 *
 * Architecture Overview
 * ─────────────────────
 * This page is a thin **orchestrator** that wires together several focused
 * components and hooks:
 *
 *   Hooks:
 *   - `useChatSession`   → loading sequence, typewriter, messages, lifecycle
 *   - `useRiveAssistant`  → Rive animation setup + layout sync
 *
 *   Layout components:
 *   - `ChatLoadingOverlay` → full-screen spinner during init
 *   - `ChatTopBar`         → header with back button + panel toggles
 *   - `GalleryView`        → default grid layout (Rive + side panels)
 *   - `SpeakerView`        → expanded panel overlay with thumbnail strip
 *   - `VideoConferenceToolbar` → bottom bar (screen share, disconnect, chat)
 *   - `ChatTranscriptPanel`    → slide-out chat flyout
 *
 *   End-of-session:
 *   - `SessionEndedView`      → summary after disconnect
 *   - `ContinueLearningModal` → upsell to sign up
 *
 * Panel System
 * ────────────
 * The page supports four panel types (see `PanelKey` in types.ts):
 *   - "rive"   → always present (the AI assistant animation)
 *   - "image"  → infographic panel (toggled via header switch)
 *   - "skill"  → skill map graph (toggled via header switch)
 *   - "screen" → screen share preview (toggled via toolbar button)
 *
 * Two view modes:
 *   1. **Gallery View** — panels shown side-by-side in a grid
 *   2. **Speaker View** — one panel expanded with thumbnails of others
 *
 * Clicking a panel in gallery view switches to speaker view.
 * The gallery DOM stays mounted (hidden via opacity) to preserve Rive state.
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Hooks
import { useChatSession } from "@/hooks/useChatSession";
import { useRiveAssistant } from "@/hooks/useRiveAssistant";

// Layout components
import { ChatLoadingOverlay } from "@/components/chat/ChatLoadingOverlay";
import { ChatTopBar } from "@/components/chat/ChatTopBar";
import { GalleryView } from "@/components/chat/GalleryView";
import { SpeakerView } from "@/components/chat/SpeakerView";
import { VideoConferenceToolbar } from "@/components/chat/VideoConferenceToolbar";
import { ChatTranscriptPanel } from "@/components/chat/ChatTranscriptPanel";

// End-of-session components
import { SessionEndedView } from "@/components/chat/SessionEndedView";
import { ContinueLearningModal } from "@/components/chat/ContinueLearningModal";

// Types
import type { PanelKey } from "@/components/chat/types";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName } = (location.state as { firstName?: string }) || {};

  // -----------------------------------------------------------------------
  // Chat session state (loading, messages, typewriter, lifecycle)
  // -----------------------------------------------------------------------

  const session = useChatSession({ firstName });

  // -----------------------------------------------------------------------
  // Panel toggle state
  // -----------------------------------------------------------------------

  /** Image Search panel (toggled from header). */
  const [imageSearchOn, setImageSearchOn] = useState(false);

  /** Skill Map panel (toggled from header). */
  const [skillMapOn, setSkillMapOn] = useState(false);

  /** Screen Share panel (toggled from toolbar). */
  const [screenShareOn, setScreenShareOn] = useState(false);

  /** Chat transcript flyout (toggled from toolbar). */
  const [chatOpen, setChatOpen] = useState(false);

  /**
   * Which panel is currently expanded in speaker view.
   * null = gallery view (no panel expanded).
   */
  const [expandedPanel, setExpandedPanel] = useState<PanelKey | null>(null);

  // -----------------------------------------------------------------------
  // Derived state
  // -----------------------------------------------------------------------

  /** Whether any side panel (besides Rive) is currently active. */
  const hasSidePanels = imageSearchOn || skillMapOn || screenShareOn;

  /** Whether we're in speaker view (a panel is expanded). */
  const isSpeakerView = expandedPanel !== null;

  // -----------------------------------------------------------------------
  // Auto-reset to gallery when all side panels are turned off
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (!hasSidePanels && expandedPanel !== null) {
      setExpandedPanel(null);
    }
  }, [hasSidePanels, expandedPanel]);

  // -----------------------------------------------------------------------
  // Rive animation setup
  // -----------------------------------------------------------------------

  const { RiveComponent, ThumbRiveComponent } = useRiveAssistant({
    showContent: session.showContent,
    hasSidePanels,
    expandedPanel,
  });

  // -----------------------------------------------------------------------
  // Panel list for speaker view thumbnails
  // -----------------------------------------------------------------------

  const panels = [
    { key: "rive" as const, active: true },
    { key: "image" as const, active: imageSearchOn },
    { key: "skill" as const, active: skillMapOn },
    { key: "screen" as const, active: screenShareOn },
  ];

  // -----------------------------------------------------------------------
  // Session ended → show summary + upsell modal
  // -----------------------------------------------------------------------

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

  // -----------------------------------------------------------------------
  // Main render
  // -----------------------------------------------------------------------

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      {/* Loading overlay (fades out when ready) */}
      <ChatLoadingOverlay
        isLoading={session.isLoading}
        loadingIndex={session.loadingIndex}
      />

      {/* Top bar with back button and panel toggles */}
      <ChatTopBar
        showContent={session.showContent}
        onBack={() => navigate("/")}
        imageSearchOn={imageSearchOn}
        onImageSearchChange={setImageSearchOn}
        skillMapOn={skillMapOn}
        onSkillMapChange={setSkillMapOn}
      />

      {/* Main content area: panels + toolbar + chat flyout */}
      <div className="flex min-h-0 flex-1">
        {/* Left side: panel views + toolbar */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className={`relative flex min-h-0 flex-1 flex-col transition-all duration-500 ease-in-out ${
              session.showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Gallery view (stays mounted; hidden when speaker view is active) */}
            <GalleryView
              RiveComponent={RiveComponent}
              hasSidePanels={hasSidePanels}
              isSpeakerView={isSpeakerView}
              imageSearchOn={imageSearchOn}
              skillMapOn={skillMapOn}
              screenShareOn={screenShareOn}
              onExpandPanel={setExpandedPanel}
              chatOpen={chatOpen}
              responseBubbleText={session.responseBubbleText}
              showResponseCursor={session.showResponseCursor}
              inputValue={session.inputValue}
              onInputChange={session.setInputValue}
              onSend={session.handleInlineSend}
            />

            {/* Speaker view overlay (shown when a panel is expanded) */}
            {hasSidePanels && isSpeakerView && expandedPanel && (
              <SpeakerView
                RiveComponent={RiveComponent}
                ThumbRiveComponent={ThumbRiveComponent}
                panels={panels}
                expandedPanel={expandedPanel}
                onExpandPanel={(key) => setExpandedPanel(key)}
                chatOpen={chatOpen}
                responseBubbleText={session.responseBubbleText}
                showResponseCursor={session.showResponseCursor}
                inputValue={session.inputValue}
                onInputChange={session.setInputValue}
                onSend={session.handleInlineSend}
              />
            )}
          </div>

          {/* Bottom toolbar: screen share, disconnect, chat toggle */}
          <VideoConferenceToolbar
            onDisconnect={session.handleDisconnect}
            onToggleChat={() => setChatOpen((v) => !v)}
            onToggleScreenShare={() => setScreenShareOn((v) => !v)}
            isChatOpen={chatOpen}
            isScreenSharing={screenShareOn}
          />
        </div>

        {/* Right side: chat transcript flyout (slides in/out) */}
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
