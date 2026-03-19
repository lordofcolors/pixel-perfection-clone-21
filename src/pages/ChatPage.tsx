import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Map, Send, Smile, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useRef, useCallback } from "react";
import { SessionEndedView } from "@/components/chat/SessionEndedView";
import { ContinueLearningModal } from "@/components/chat/ContinueLearningModal";
import { SkillMapPanel } from "@/components/chat/SkillMapPanel";
import { ImageSearchPanel } from "@/components/chat/ImageSearchPanel";
import { ChatTranscriptPanel } from "@/components/chat/ChatTranscriptPanel";
import { VideoConferenceToolbar } from "@/components/chat/VideoConferenceToolbar";

const LOADING_STATES = [
  "Waking up A…",
  "Teaching A your name…",
  "Calibrating curiosity levels…",
  "Brewing something just for you…",
  "Almost there — A can't wait to meet you…",
];
const LOADING_INTERVAL = 1800;

const AI_RESPONSES = [
  "That's a great question! Let me think about that…",
  "Interesting! Here's what I know about that topic.",
  "I love your curiosity! Let's explore this together.",
  "Great thinking! Let me explain a bit more.",
  "You're doing amazing! Here's what comes next.",
  "That's exactly right! Want to learn more?",
  "Awesome observation! Let me share something cool about that.",
];

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName } = (location.state as { firstName?: string }) || {};
  const [message, setMessage] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Session state
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  // Panel toggles
  const [imageSearchOn, setImageSearchOn] = useState(false);
  const [skillMapOn, setSkillMapOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState<"rive" | "image" | "skill" | null>(null);

  // Chat messages
  const greetingText = `Hi${firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!`;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "greeting", sender: "ai", text: greetingText },
  ]);

  const hasSidePanels = imageSearchOn || skillMapOn;
  const isSpeakerView = expandedPanel !== null;

  // Loading cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => {
        if (prev >= LOADING_STATES.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), LOADING_INTERVAL);
          return prev;
        }
        return prev + 1;
      });
    }, LOADING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => setShowContent(true));
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [isLoading]);

  useEffect(() => {
    if (showContent) {
      const t = setTimeout(() => setShowGreeting(true), 800);
      return () => clearTimeout(t);
    }
  }, [showContent]);

  useEffect(() => {
    if (showGreeting) {
      let i = 0;
      typingRef.current = setInterval(() => {
        i++;
        setTypedText(greetingText.slice(0, i));
        if (i >= greetingText.length && typingRef.current) clearInterval(typingRef.current);
      }, 45);
      return () => { if (typingRef.current) clearInterval(typingRef.current); };
    }
  }, [showGreeting, greetingText]);

  const { rive, RiveComponent } = useRive({
    src: "/animations/robocat.riv",
    stateMachines: "State Machine",
    artboard: "Catbot",
    autoplay: false,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (showContent && rive) rive.play();
  }, [showContent, rive]);

  const handleDisconnect = () => {
    setSessionEnded(true);
    setTimeout(() => setShowContinueModal(true), 1000);
  };

  const handleSendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, sender: "ai", text: aiText };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  }, []);

  const handleInlineSend = () => {
    if (!message.trim()) return;
    handleSendMessage(message.trim());
    setMessage("");
    // Auto-open chat panel to show the conversation
    setChatOpen(true);
  };

  if (sessionEnded) {
    return (
      <>
        <SessionEndedView
          learnerName={firstName || ""}
          onBackToHome={() => navigate("/")}
          onStartNewSession={() => {
            setSessionEnded(false);
            setShowContinueModal(false);
          }}
        />
        <ContinueLearningModal
          open={showContinueModal}
          onClose={() => setShowContinueModal(false)}
        />
      </>
    );
  }

  // Greeting bubble inside Rive tile
  const greetingBubble = (
    <div
      className={`rounded-xl border border-border/30 p-2.5 bg-card/40 backdrop-blur-sm transition-opacity duration-[2000ms] ${showGreeting ? "opacity-100" : "opacity-0"}`}
    >
      <p className="text-center text-foreground text-xs min-h-[1rem]">
        {typedText}
        {showGreeting && typedText.length < greetingText.length && (
          <span className="inline-block w-[2px] h-[0.85em] bg-foreground ml-0.5 animate-pulse align-text-bottom" />
        )}
      </p>
    </div>
  );

  // Inline chat input (no expand button)
  const inlineChatInput = (
    <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
      <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-amber-400">
        <Smile className="w-4 h-4" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleInlineSend()}
        placeholder="Type something here..."
        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
      />
      <Button size="icon" className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90" onClick={handleInlineSend}>
        <Send className="w-3 h-3" />
      </Button>
    </div>
  );

  // Rive tile content with greeting inside
  const riveTileContent = (size: "sm" | "md" | "lg") => {
    const sizeClasses = {
      sm: "w-full h-full",
      md: "w-[180px] h-[180px]",
      lg: "w-[300px] h-[300px] md:w-[380px] md:h-[380px]",
    };
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-2 h-full">
        <div className={sizeClasses[size]}>
          <RiveComponent className="w-full h-full" />
        </div>
        {size !== "sm" && greetingBubble}
      </div>
    );
  };

  const panels = [
    { key: "rive" as const, active: true, label: "A" },
    { key: "image" as const, active: imageSearchOn, label: "Infographic" },
    { key: "skill" as const, active: skillMapOn, label: "Skill Map" },
  ].filter((p) => p.active);

  // Render thumbnail content — actual miniature previews
  const renderThumbnailContent = (key: "rive" | "image" | "skill") => {
    if (key === "rive") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-14 h-14">
            <RiveComponent className="w-full h-full" />
          </div>
        </div>
      );
    }
    if (key === "image") {
      return (
        <div className="w-full h-full overflow-hidden">
          <ImageSearchPanel className="pointer-events-none" />
        </div>
      );
    }
    if (key === "skill") {
      return (
        <div className="w-full h-full overflow-hidden relative">
          <SkillMapPanel className="pointer-events-none" />
        </div>
      );
    }
    return null;
  };

  // Render expanded panel content
  const renderExpandedContent = (key: "rive" | "image" | "skill") => {
    if (key === "rive") return riveTileContent("lg");
    if (key === "image") return <ImageSearchPanel />;
    if (key === "skill") return <SkillMapPanel />;
    return null;
  };

  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-hidden">
      {/* Loading overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-background transition-opacity duration-1000"
        style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? "auto" : "none" }}
      >
        <div className="w-10 h-10 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mb-6" />
        <p className="text-muted-foreground italic text-sm transition-opacity duration-500">
          {LOADING_STATES[loadingIndex]}
        </p>
      </div>

      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card/30 transition-opacity duration-[2000ms] ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">A by Xolv Companion</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Image Search</span>
            <Switch checked={imageSearchOn} onCheckedChange={setImageSearchOn} />
          </div>
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Skill Map</span>
            <Switch checked={skillMapOn} onCheckedChange={setSkillMapOn} />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Panels area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}
          >
            {/* Speaker View: thumbnails at top, expanded panel below with minimize inside */}
            {hasSidePanels && isSpeakerView ? (
              <>
                {/* Thumbnail strip */}
                <div className="flex items-center gap-1.5 px-4 pt-2 justify-center">
                  {panels.map((p) => (
                    <div
                      key={p.key}
                      className={`w-28 h-[72px] rounded-md border overflow-hidden cursor-pointer transition-all duration-300 flex-shrink-0 ${
                        expandedPanel === p.key
                          ? "border-secondary bg-card/40"
                          : "border-border/40 bg-card/20 hover:border-secondary/40"
                      }`}
                      onClick={() => setExpandedPanel(p.key)}
                    >
                      {renderThumbnailContent(p.key)}
                    </div>
                  ))}
                </div>

                {/* Main expanded panel with minimize button inside */}
                <div className="flex-1 flex items-center justify-center px-4 py-2">
                  <div className="w-full h-full max-w-4xl rounded-lg border border-border/40 bg-card/20 overflow-hidden relative">
                    {/* Minimize button — top right of this box */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 h-8 w-8 text-muted-foreground hover:text-foreground bg-background/50 hover:bg-background/80 backdrop-blur-sm"
                      onClick={() => setExpandedPanel(null)}
                      title="Back to Gallery View"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <div className="w-full h-full flex items-center justify-center">
                      {renderExpandedContent(expandedPanel!)}
                    </div>
                  </div>
                </div>

                {/* Inline chat below speaker */}
                {!chatOpen && (
                  <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
                    {inlineChatInput}
                  </div>
                )}
              </>
            ) : hasSidePanels ? (
              /* Gallery View: equal tiles with actual content previews */
              <>
                <div className="flex-1 flex items-center justify-center px-4 pt-2">
                  <div className="flex gap-2 h-[65%] max-h-[420px] w-full max-w-5xl">
                    {/* Rive tile */}
                    <div
                      className="flex-1 rounded-lg border border-border/50 bg-card/20 overflow-hidden cursor-pointer hover:border-secondary/50 transition-all"
                      onClick={() => setExpandedPanel("rive")}
                    >
                      {riveTileContent("md")}
                    </div>
                    {/* Image tile */}
                    {imageSearchOn && (
                      <div
                        className="flex-1 rounded-lg border border-border/50 bg-card/20 overflow-hidden cursor-pointer hover:border-secondary/50 transition-all"
                        onClick={() => setExpandedPanel("image")}
                      >
                        <ImageSearchPanel />
                      </div>
                    )}
                    {/* Skill Map tile */}
                    {skillMapOn && (
                      <div
                        className="flex-1 rounded-lg border border-border/50 bg-card/20 overflow-hidden cursor-pointer hover:border-secondary/50 transition-all"
                        onClick={() => setExpandedPanel("skill")}
                      >
                        <SkillMapPanel />
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline chat below gallery tiles */}
                {!chatOpen && (
                  <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
                    {inlineChatInput}
                  </div>
                )}
              </>
            ) : (
              /* No side panels - just Rive centered */
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                    <RiveComponent className="w-full h-full" />
                  </div>
                  {greetingBubble}
                  <div className="mt-3 w-[85%] max-w-md">
                    {inlineChatInput}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom toolbar */}
          <VideoConferenceToolbar
            onDisconnect={handleDisconnect}
            onToggleChat={() => setChatOpen((v) => !v)}
            isChatOpen={chatOpen}
          />
        </div>

        {/* Chat transcript slide-out panel */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${chatOpen ? "w-80" : "w-0"}`}
        >
          {chatOpen && (
            <ChatTranscriptPanel
              firstName={firstName}
              onClose={() => setChatOpen(false)}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              inputValue={message}
              onInputChange={setMessage}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
