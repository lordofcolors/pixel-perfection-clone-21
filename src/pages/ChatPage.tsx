import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Map, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect, useRef } from "react";
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

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName } = (location.state as { firstName?: string }) || {};

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

  const greetingText = `Hi${firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!`;
  const hasSidePanels = imageSearchOn || skillMapOn;
  const activePanelCount = (imageSearchOn ? 1 : 0) + (skillMapOn ? 1 : 0);

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

  const handlePanelClick = (panel: "rive" | "image" | "skill") => {
    setExpandedPanel((prev) => (prev === panel ? null : panel));
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

  // Determine grid layout based on expanded state and active panels
  const isRiveExpanded = expandedPanel === "rive";
  const isImageExpanded = expandedPanel === "image";
  const isSkillExpanded = expandedPanel === "skill";

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
            className={`flex-1 flex gap-2 p-2 transition-all duration-500 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}
          >
            {/* Rive animation panel */}
            <div
              className={`relative rounded-xl border border-border/50 bg-card/20 overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out ${
                !hasSidePanels
                  ? "w-full"
                : expandedPanel === "rive"
                    ? "w-full"
                    : expandedPanel !== null
                      ? "w-24 min-w-[96px] flex-shrink-0"
                      : activePanelCount === 2
                        ? "w-1/3"
                        : "w-1/2"
              }`}
              onClick={() => hasSidePanels && handlePanelClick("rive")}
            >
              {hasSidePanels && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-7 w-7 bg-background/50 hover:bg-background/80"
                  onClick={(e) => { e.stopPropagation(); handlePanelClick("rive"); }}
                >
                  {isRiveExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </Button>
              )}
              <div
                className={`transition-all duration-500 ease-in-out ${
                  expandedPanel && expandedPanel !== "rive"
                    ? "w-[80px] h-[80px]"
                    : hasSidePanels
                      ? "w-[300px] h-[300px]"
                      : "w-[400px] h-[400px] md:w-[550px] md:h-[550px]"
                }`}
              >
                <RiveComponent className="w-full h-full" />
              </div>

              {/* Greeting bubble - show when no panels active */}
              {!hasSidePanels && (
                <div
                  className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-lg rounded-2xl border border-border/50 p-4 bg-card/50 backdrop-blur-sm transition-opacity duration-[2000ms] ${showGreeting ? "opacity-100" : "opacity-0"}`}
                >
                  <p className="text-center text-foreground text-base min-h-[1.5rem]">
                    {typedText}
                    {showGreeting && typedText.length < greetingText.length && (
                      <span className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 animate-pulse align-text-bottom" />
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Image Search panel */}
            {imageSearchOn && (
              <div
                className={`relative rounded-xl border border-border/50 bg-card/20 overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
                  isImageExpanded
                    ? "w-full"
                    : expandedPanel && expandedPanel !== "image"
                      ? "w-24 min-w-[96px] flex-shrink-0"
                      : activePanelCount === 2
                        ? "w-1/3"
                        : "w-1/2"
                }`}
                onClick={() => handlePanelClick("image")}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-7 w-7 bg-background/50 hover:bg-background/80"
                  onClick={(e) => { e.stopPropagation(); handlePanelClick("image"); }}
                >
                  {isImageExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </Button>
                <ImageSearchPanel />
              </div>
            )}

            {/* Skill Map panel */}
            {skillMapOn && (
              <div
                className={`relative rounded-xl border border-border/50 bg-card/20 overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
                  isSkillExpanded
                    ? "w-full"
                    : expandedPanel && expandedPanel !== "skill"
                      ? "w-24 min-w-[96px] flex-shrink-0"
                      : activePanelCount === 2
                        ? "w-1/3"
                        : "w-1/2"
                }`}
                onClick={() => handlePanelClick("skill")}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-7 w-7 bg-background/50 hover:bg-background/80"
                  onClick={(e) => { e.stopPropagation(); handlePanelClick("skill"); }}
                >
                  {isSkillExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </Button>
                <SkillMapPanel />
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
            <ChatTranscriptPanel firstName={firstName} onClose={() => setChatOpen(false)} />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
