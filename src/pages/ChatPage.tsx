import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Map, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

  // Layout helpers

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
            className={`flex-1 flex items-center justify-center transition-all duration-500 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}
          >
            {/* Panels grid - centered with 4:3 aspect ratio tiles */}
            <div className={`flex gap-1 h-[70%] max-h-[500px] w-full max-w-5xl px-4 ${
              !hasSidePanels ? "justify-center" : ""
            }`}>
              {/* Rive animation panel */}
              <div
                className={`relative rounded-lg bg-card/20 overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out aspect-[4/3] ${
                  !hasSidePanels
                    ? "w-full max-w-2xl"
                    : expandedPanel === "rive"
                      ? "flex-[3]"
                      : expandedPanel !== null
                        ? "flex-[0.5] min-w-[80px]"
                        : "flex-1"
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
                    {expandedPanel === "rive" ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </Button>
                )}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    expandedPanel && expandedPanel !== "rive"
                      ? "w-[60px] h-[60px]"
                      : hasSidePanels
                        ? "w-[250px] h-[250px]"
                        : "w-[350px] h-[350px] md:w-[450px] md:h-[450px]"
                  }`}
                >
                  <RiveComponent className="w-full h-full" />
                </div>

                {/* Greeting bubble - show when no panels active */}
                {!hasSidePanels && (
                  <div
                    className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-md rounded-2xl border border-border/30 p-3 bg-card/40 backdrop-blur-sm transition-opacity duration-[2000ms] ${showGreeting ? "opacity-100" : "opacity-0"}`}
                  >
                    <p className="text-center text-foreground text-sm min-h-[1.5rem]">
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
                  className={`relative rounded-lg bg-card/20 overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
                    expandedPanel === "image"
                      ? "flex-[3]"
                      : expandedPanel !== null
                        ? "flex-[0.5] min-w-[80px]"
                        : "flex-1"
                  }`}
                  onClick={() => handlePanelClick("image")}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-7 w-7 bg-background/50 hover:bg-background/80"
                    onClick={(e) => { e.stopPropagation(); handlePanelClick("image"); }}
                  >
                    {expandedPanel === "image" ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </Button>
                  <ImageSearchPanel />
                </div>
              )}

              {/* Skill Map panel */}
              {skillMapOn && (
                <div
                  className={`relative rounded-lg bg-card/20 overflow-hidden cursor-pointer transition-all duration-500 ease-in-out ${
                    expandedPanel === "skill"
                      ? "flex-[3]"
                      : expandedPanel !== null
                        ? "flex-[0.5] min-w-[80px]"
                        : "flex-1"
                  }`}
                  onClick={() => handlePanelClick("skill")}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-7 w-7 bg-background/50 hover:bg-background/80"
                    onClick={(e) => { e.stopPropagation(); handlePanelClick("skill"); }}
                  >
                    {expandedPanel === "skill" ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </Button>
                  <SkillMapPanel />
                </div>
              )}
            </div>
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
