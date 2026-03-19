import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Map, ChevronDown, Send, Smile, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [expandedPanel, setExpandedPanel] = useState<"rive" | "image" | "skill">("rive");
  const [viewMode, setViewMode] = useState<"speaker" | "gallery">("gallery");

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
    if (viewMode === "speaker") {
      setExpandedPanel(panel);
    }
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

      {/* View mode selector - below header */}
      {hasSidePanels && (
        <div className={`flex justify-end px-4 py-1.5 transition-opacity duration-[2000ms] ${showContent ? "opacity-100" : "opacity-0"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1 h-7">
                {viewMode === "speaker" ? "Speaker View" : "Gallery View"}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewMode("speaker")}>
                Speaker View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("gallery")}>
                Gallery View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Panels area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${showContent ? "opacity-100" : "opacity-0"}`}
          >
            {/* Speaker View: all panels as thumbnails at top, clicked one is main */}
            {hasSidePanels && viewMode === "speaker" ? (
              <>
                {/* Thumbnail strip at top — show ALL panels */}
                <div className="flex gap-1.5 px-4 pt-2 justify-center">
                  {[
                    { key: "rive" as const, active: true, label: "A" },
                    { key: "image" as const, active: imageSearchOn, label: "Infographic" },
                    { key: "skill" as const, active: skillMapOn, label: "Skill Map" },
                  ]
                    .filter((p) => p.active)
                    .map((p) => (
                      <div
                        key={p.key}
                        className={`w-28 h-[72px] rounded-md bg-card/30 overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center flex-shrink-0 ${
                          expandedPanel === p.key ? "ring-1 ring-secondary" : "hover:ring-1 hover:ring-secondary/40"
                        }`}
                        onClick={() => handlePanelClick(p.key)}
                      >
                        {p.key === "rive" ? (
                          <div className="w-14 h-14">
                            <RiveComponent className="w-full h-full" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">{p.label}</span>
                        )}
                      </div>
                    ))}
                </div>

                {/* Main expanded panel */}
                <div className="flex-1 flex items-center justify-center px-4 py-2">
                  <div className="w-full h-full max-w-4xl rounded-lg bg-card/20 overflow-hidden relative flex items-center justify-center">
                    {expandedPanel === "rive" && (
                      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] transition-all duration-500">
                        <RiveComponent className="w-full h-full" />
                      </div>
                    )}
                    {expandedPanel === "image" && <ImageSearchPanel />}
                    {expandedPanel === "skill" && <SkillMapPanel />}
                  </div>
                </div>

                {/* Inline chat below speaker */}
                {!chatOpen && (
                  <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
                    <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
                      <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-amber-400">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type something here..."
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
                      />
                      <Button size="icon" className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90">
                        <Send className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 text-muted-foreground"
                        onClick={() => setChatOpen(true)}
                      >
                        <Maximize2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : hasSidePanels && viewMode === "gallery" ? (
              /* Gallery View: equal tiles + chat input below */
              <>
                <div className="flex-1 flex items-center justify-center px-4 pt-2">
                  <div className="flex gap-1.5 h-[65%] max-h-[400px] w-full max-w-5xl">
                    <div
                      className="flex-1 rounded-lg bg-card/20 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-1 hover:ring-secondary/30 transition-all"
                      onClick={() => { setViewMode("speaker"); setExpandedPanel("rive"); }}
                    >
                      <div className="w-[220px] h-[220px]">
                        <RiveComponent className="w-full h-full" />
                      </div>
                    </div>
                    {imageSearchOn && (
                      <div
                        className="flex-1 rounded-lg bg-card/20 overflow-hidden cursor-pointer hover:ring-1 hover:ring-secondary/30 transition-all"
                        onClick={() => { setViewMode("speaker"); setExpandedPanel("image"); }}
                      >
                        <ImageSearchPanel />
                      </div>
                    )}
                    {skillMapOn && (
                      <div
                        className="flex-1 rounded-lg bg-card/20 overflow-hidden cursor-pointer hover:ring-1 hover:ring-secondary/30 transition-all"
                        onClick={() => { setViewMode("speaker"); setExpandedPanel("skill"); }}
                      >
                        <SkillMapPanel />
                      </div>
                    )}
                  </div>
                </div>

                {/* Greeting + inline chat below gallery tiles */}
                {!chatOpen && (
                  <div className="px-4 pb-2 max-w-2xl mx-auto w-full space-y-2">
                    <div
                      className={`rounded-xl border border-border/30 p-3 bg-card/30 transition-opacity duration-[2000ms] ${showGreeting ? "opacity-100" : "opacity-0"}`}
                    >
                      <p className="text-center text-foreground text-sm min-h-[1.25rem]">
                        {typedText}
                        {showGreeting && typedText.length < greetingText.length && (
                          <span className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 animate-pulse align-text-bottom" />
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
                      <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-amber-400">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type something here..."
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
                      />
                      <Button size="icon" className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90">
                        <Send className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 h-8 w-8 text-muted-foreground"
                        onClick={() => setChatOpen(true)}
                      >
                        <Maximize2 className="w-3 h-3" />
                      </Button>
                    </div>
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
                  <div
                    className={`w-[85%] max-w-md rounded-2xl border border-border/30 p-3 bg-card/40 backdrop-blur-sm mt-4 transition-opacity duration-[2000ms] ${showGreeting ? "opacity-100" : "opacity-0"}`}
                  >
                    <p className="text-center text-foreground text-sm min-h-[1.5rem]">
                      {typedText}
                      {showGreeting && typedText.length < greetingText.length && (
                        <span className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 animate-pulse align-text-bottom" />
                      )}
                    </p>
                  </div>
                  <div className="mt-3 w-[85%] max-w-md">
                    <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
                      <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-amber-400">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type something here..."
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
                      />
                      <Button size="icon" className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90">
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
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
            <ChatTranscriptPanel firstName={firstName} onClose={() => setChatOpen(false)} />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
