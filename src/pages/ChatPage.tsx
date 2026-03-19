import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Map, Send, Smile, Minimize2, Maximize2 } from "lucide-react";
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

  const [isLoading, setIsLoading] = useState(true);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiTypingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [sessionEnded, setSessionEnded] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);

  const [imageSearchOn, setImageSearchOn] = useState(false);
  const [skillMapOn, setSkillMapOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedPanel, setExpandedPanel] = useState<"rive" | "image" | "skill" | null>(null);

  const [latestAiText, setLatestAiText] = useState("");
  const [displayedAiText, setDisplayedAiText] = useState("");
  const [isTypingResponse, setIsTypingResponse] = useState(false);

  const greetingText = `Hi${firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!`;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "greeting", sender: "ai", text: greetingText },
  ]);

  const hasSidePanels = imageSearchOn || skillMapOn;
  const isSpeakerView = expandedPanel !== null;

  // Reset to gallery view when all side panels are turned off
  useEffect(() => {
    if (!hasSidePanels && expandedPanel !== null) {
      setExpandedPanel(null);
    }
  }, [hasSidePanels, expandedPanel]);

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
      const timeoutId = setTimeout(() => setShowGreeting(true), 800);
      return () => clearTimeout(timeoutId);
    }
  }, [showContent]);

  useEffect(() => {
    if (!showGreeting) return;

    let i = 0;
    typingRef.current = setInterval(() => {
      i += 1;
      setTypedText(greetingText.slice(0, i));

      if (i >= greetingText.length && typingRef.current) {
        clearInterval(typingRef.current);
      }
    }, 45);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [showGreeting, greetingText]);

  useEffect(() => {
    if (showGreeting && typedText === greetingText) {
      setLatestAiText(greetingText);
      setDisplayedAiText(greetingText);
    }
  }, [showGreeting, typedText, greetingText]);

  useEffect(() => {
    if (!latestAiText || latestAiText === greetingText) return;

    setDisplayedAiText("");
    setIsTypingResponse(true);
    let i = 0;

    if (aiTypingRef.current) clearInterval(aiTypingRef.current);

    aiTypingRef.current = setInterval(() => {
      i += 1;
      setDisplayedAiText(latestAiText.slice(0, i));

      if (i >= latestAiText.length) {
        if (aiTypingRef.current) clearInterval(aiTypingRef.current);
        setIsTypingResponse(false);
      }
    }, 35);

    return () => {
      if (aiTypingRef.current) clearInterval(aiTypingRef.current);
    };
  }, [latestAiText, greetingText]);

  const { rive, RiveComponent } = useRive({
    src: "/animations/robocat.riv",
    stateMachines: "State Machine",
    artboard: "Catbot",
    autoplay: false,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // Secondary small Rive for thumbnail in speaker view
  const { rive: thumbRive, RiveComponent: ThumbRiveComponent } = useRive({
    src: "/animations/robocat.riv",
    stateMachines: "State Machine",
    artboard: "Catbot",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (showContent && rive) rive.play();
  }, [showContent, rive]);

  useEffect(() => {
    if (!rive) return;

    const syncLayout = () => {
      window.dispatchEvent(new Event("resize"));
      (rive as unknown as { resizeDrawingSurfaceToCanvas?: () => void }).resizeDrawingSurfaceToCanvas?.();
    };

    const rafId = requestAnimationFrame(syncLayout);
    const timeoutId = window.setTimeout(syncLayout, 1050);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [rive, hasSidePanels, expandedPanel]);

  const handleDisconnect = () => {
    setSessionEnded(true);
    setTimeout(() => setShowContinueModal(true), 1000);
  };

  const handleSendMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const aiText = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      const aiMsg: ChatMessage = { id: `ai-${Date.now()}`, sender: "ai", text: aiText };
      setChatMessages((prev) => [...prev, aiMsg]);
      setLatestAiText(aiText);
    }, 1200 + Math.random() * 800);
  }, []);

  const handleInlineSend = () => {
    if (!message.trim()) return;
    handleSendMessage(message.trim());
    setMessage("");
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
        <ContinueLearningModal open={showContinueModal} onClose={() => setShowContinueModal(false)} />
      </>
    );
  }

  const responseBubbleText = displayedAiText || typedText;
  const showResponseCursor =
    isTypingResponse || (showGreeting && !displayedAiText && typedText.length < greetingText.length);

  const responseBubble = (
    <div
      className={`rounded-xl border border-border/30 bg-card/40 p-3 backdrop-blur-sm transition-opacity duration-700 ${
        responseBubbleText ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="min-h-[1rem] text-center text-sm text-foreground">
        {responseBubbleText}
        {showResponseCursor && (
          <span className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-foreground align-text-bottom" />
        )}
      </p>
    </div>
  );

  const inlineChatWithResponse = (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      {responseBubble}
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-primary">
          <Smile className="h-4 w-4" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInlineSend()}
          placeholder="Type something here..."
          className="h-8 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button size="icon" className="h-8 w-8 flex-shrink-0 bg-primary hover:bg-primary/90" onClick={handleInlineSend}>
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const panels = [
    { key: "rive" as const, active: true },
    { key: "image" as const, active: imageSearchOn },
    { key: "skill" as const, active: skillMapOn },
  ].filter((panel) => panel.active);

  const renderThumbnailContent = (key: "rive" | "image" | "skill") => {
    if (key === "rive") {
      return (
        <div className="flex h-full w-full items-center justify-center p-1">
          <ThumbRiveComponent className="h-full w-full" />
        </div>
      );
    }

    if (key === "image") {
      return (
        <div className="h-full w-full overflow-hidden">
          <ImageSearchPanel className="pointer-events-none" />
        </div>
      );
    }

    return (
      <div className="relative h-full w-full overflow-hidden">
        <SkillMapPanel className="pointer-events-none" hideTitle />
      </div>
    );
  };

  const renderExpandedContent = (key: "rive" | "image" | "skill") => {
    if (key === "rive") {
      return null; // Rive is rendered persistently outside
    }

    if (key === "image") {
      return (
        <div className="h-full overflow-auto p-4">
          <div className="mx-auto w-full max-w-2xl max-h-full overflow-hidden rounded-md">
            <ImageSearchPanel className="w-full" variant="expanded" />
          </div>
        </div>
      );
    }

    return <SkillMapPanel />;
  };

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-background">
      <div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000"
        style={{ opacity: isLoading ? 1 : 0, pointerEvents: isLoading ? "auto" : "none" }}
      >
        <div className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
        <p className="text-sm italic text-muted-foreground transition-opacity duration-500">{LOADING_STATES[loadingIndex]}</p>
      </div>

      <div
        className={`flex items-center justify-between border-b border-border/50 bg-card/30 px-4 py-2 transition-opacity duration-[2000ms] ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Quick Start</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Image Search</span>
            <Switch checked={imageSearchOn} onCheckedChange={setImageSearchOn} />
          </div>
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Skill Map</span>
            <Switch checked={skillMapOn} onCheckedChange={setSkillMapOn} />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={`flex min-h-0 flex-1 flex-col transition-all duration-500 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}>
            {hasSidePanels && isSpeakerView ? (
              <>
                <div className="flex justify-center gap-1.5 px-4 pt-1.5">
                  {panels.map((panel) => (
                    <div
                      key={panel.key}
                      className={`h-[68px] w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-300 ${
                        expandedPanel === panel.key
                          ? "border-secondary bg-card/40"
                          : "border-border/40 bg-card/20 hover:border-secondary/40"
                      }`}
                      onClick={() => setExpandedPanel(panel.key)}
                    >
                      {renderThumbnailContent(panel.key)}
                    </div>
                  ))}
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  {/* Persistent Rive in speaker view - shown when rive is expanded */}
                  <div className={`flex flex-1 items-center justify-center px-4 py-1.5 ${expandedPanel === "rive" ? "" : "hidden"}`}>
                    <div className="h-full w-full max-h-[380px] max-w-[380px]">
                      <RiveComponent className="h-full w-full" />
                    </div>
                  </div>

                  {/* Non-rive expanded content */}
                  {expandedPanel && expandedPanel !== "rive" && (
                    <div className="flex min-h-0 px-4 py-1.5" style={{ flex: "1 1 0%", maxHeight: "calc(100% - 100px)" }}>
                      <div className="relative mx-auto h-full w-full max-w-3xl overflow-auto rounded-lg border border-border/40 bg-card/20">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 z-10 h-8 w-8 bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground"
                          onClick={() => setExpandedPanel(null)}
                          title="Back to Gallery View"
                        >
                          <Minimize2 className="h-4 w-4" />
                        </Button>
                        <div className="h-full w-full">{renderExpandedContent(expandedPanel)}</div>
                      </div>
                    </div>
                  )}

                  {/* Minimize button for rive speaker */}
                  {expandedPanel === "rive" && (
                    <div className="flex justify-center pb-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setExpandedPanel(null)}
                        title="Back to Gallery View"
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {!chatOpen && <div className="flex-shrink-0 flex items-center justify-center px-4 py-2">{inlineChatWithResponse}</div>}
                </div>
              </>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col justify-center">
                <div className={`px-4 pt-6 ${hasSidePanels ? "flex-shrink-0" : "flex items-center justify-center"}`}>
                  <div className="mx-auto w-full max-w-5xl">
                    <div
                      className="flex gap-3 transition-all duration-1000 ease-in-out"
                      style={{ height: hasSidePanels ? (imageSearchOn && skillMapOn ? 280 : 480) : 580 }}
                    >
                      {/* Rive - always rendered, smoothly resizes via width % */}
                      <div
                        className="overflow-hidden rounded-lg transition-[width] duration-1000 ease-in-out"
                        style={{ width: hasSidePanels ? "50%" : "100%", flexShrink: 0 }}
                        onClick={hasSidePanels ? () => setExpandedPanel("rive") : undefined}
                      >
                        <div className={`flex items-center justify-center p-2 h-full ${hasSidePanels ? "cursor-pointer" : ""}`}>
                          <div className="h-full w-full transition-[max-width,max-height] duration-1000 ease-in-out" style={{ maxHeight: hasSidePanels ? 320 : 550, maxWidth: hasSidePanels ? 320 : 550 }}>
                            <RiveComponent className="h-full w-full" />
                          </div>
                        </div>
                      </div>

                      {/* Image Search */}
                      <div
                        className="relative overflow-hidden rounded-lg border border-border/50 bg-card/20 transition-all duration-1000 ease-in-out cursor-pointer hover:border-secondary/50"
                        style={{ width: imageSearchOn ? "50%" : "0%", flexShrink: 0, opacity: imageSearchOn ? 1 : 0 }}
                        onClick={() => imageSearchOn && setExpandedPanel("image")}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 z-10 h-7 w-7 bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground"
                          onClick={(e) => { e.stopPropagation(); setExpandedPanel("image"); }}
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="h-full w-full min-w-[300px]">
                          <ImageSearchPanel />
                        </div>
                      </div>

                      {/* Skill Map (beside rive when no image search) */}
                      <div
                        className="relative overflow-hidden rounded-lg border border-border/50 bg-card/20 transition-all duration-1000 ease-in-out cursor-pointer hover:border-secondary/50"
                        style={{ width: skillMapOn && !imageSearchOn ? "50%" : "0%", flexShrink: 0, opacity: skillMapOn && !imageSearchOn ? 1 : 0 }}
                        onClick={() => skillMapOn && !imageSearchOn && setExpandedPanel("skill")}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 z-10 h-7 w-7 bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground"
                          onClick={(e) => { e.stopPropagation(); setExpandedPanel("skill"); }}
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="h-full w-full min-w-[300px]">
                          <SkillMapPanel />
                        </div>
                      </div>
                    </div>

                    {imageSearchOn && skillMapOn && (
                      <div className="mt-3 flex justify-center">
                        <div
                          className="h-[280px] w-[55%] cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-card/20 transition-all duration-1000 ease-in-out hover:border-secondary/50"
                          onClick={() => setExpandedPanel("skill")}
                        >
                          <SkillMapPanel />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!chatOpen && (
                  <div className="flex flex-1 items-center justify-center px-4 py-2">
                    {inlineChatWithResponse}
                  </div>
                )}
              </div>
            )}
          </div>

          <VideoConferenceToolbar onDisconnect={handleDisconnect} onToggleChat={() => setChatOpen((v) => !v)} isChatOpen={chatOpen} />
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${chatOpen ? "w-80" : "w-0"}`}>
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
