import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Smile, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

const LOADING_STATES = [
  "Starting up A…",
  "Personalizing your experience…",
  "Tuning A to your learning style…",
  "Loading your skill toolkit…",
  "A is ready to meet you…",
];

const LOADING_INTERVAL = 1800;

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
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const greetingText = `Hi${firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!`;

  // Cycle through loading states then reveal content
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingIndex((prev) => {
        if (prev >= LOADING_STATES.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
              setShowContent(true);
            }, 600);
          }, LOADING_INTERVAL);
          return prev;
        }
        return prev + 1;
      });
    }, LOADING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showContent) {
      const greetTimer = setTimeout(() => setShowGreeting(true), 800);
      return () => clearTimeout(greetTimer);
    }
  }, [showContent]);

  useEffect(() => {
    if (showGreeting) {
      let i = 0;
      typingRef.current = setInterval(() => {
        i++;
        setTypedText(greetingText.slice(0, i));
        if (i >= greetingText.length && typingRef.current) {
          clearInterval(typingRef.current);
        }
      }, 45);
      return () => {
        if (typingRef.current) clearInterval(typingRef.current);
      };
    }
  }, [showGreeting, greetingText]);

  const { rive, RiveComponent } = useRive({
    src: "/animations/robocat.riv",
    stateMachines: "State Machine",
    artboard: "Catbot",
    autoplay: false,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // Reset and play Rive only after content is visible, with delay for navigation scenarios
  useEffect(() => {
    if (showContent && rive) {
      rive.reset();
      const timer = setTimeout(() => {
        rive.play();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showContent, rive]);

  if (isLoading) {
    return (
      <main className="w-screen h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin mb-6" />
        {/* Loading state text */}
        <p className="text-muted-foreground italic text-sm transition-opacity duration-500">
          {LOADING_STATES[loadingIndex]}
        </p>
      </main>
    );
  }

  return (
    <main className="w-screen h-screen bg-background flex flex-col items-center relative overflow-hidden">
      <div
        className={`absolute top-6 left-6 z-10 transition-opacity duration-[2000ms] ${showContent ? "opacity-100" : "opacity-0"}`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Rive animation - shorter */}
      <div
        className="w-[400px] h-[400px] md:w-[550px] md:h-[550px] mt-4 flex-shrink-0 will-change-transform"
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(-50px)",
          transition: "opacity 2000ms ease, transform 2000ms ease",
        }}
      >
        <div className="w-full h-full">
          <RiveComponent className="w-full h-full" />
        </div>
      </div>

      {/* Chat area below animation */}
      <div className="flex flex-col items-center w-full max-w-2xl px-6 flex-1 justify-end pb-8 gap-4">
        {/* AI message bubble */}
        <div
          className={`w-full rounded-2xl border border-muted p-4 mb-2 transition-opacity duration-[2000ms] ${showGreeting ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-center text-foreground text-base min-h-[1.5rem]">
            {typedText}
            {showGreeting && typedText.length < greetingText.length && (
              <span className="inline-block w-[2px] h-[1em] bg-foreground ml-0.5 animate-pulse align-text-bottom" />
            )}
          </p>
        </div>

        {/* Text input row */}
        <div
          className={`w-full flex items-center gap-2 rounded-2xl border border-muted p-2 transition-opacity duration-[2000ms] delay-300 ${showContent ? "opacity-100" : "opacity-0"}`}
        >
          <Button variant="ghost" size="icon" className="flex-shrink-0 text-amber-400">
            <Smile className="w-6 h-6" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type something here..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />
          <Button size="icon" className="flex-shrink-0 bg-primary hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Action buttons */}
        <div
          className={`flex items-center gap-8 transition-opacity duration-[2000ms] delay-500 ${showContent ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex flex-col items-center gap-1">
            <Button variant="outline" size="icon" className="rounded-full w-14 h-14 border-muted-foreground/30">
              <Monitor className="w-6 h-6 text-muted-foreground" />
            </Button>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Share Screen</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Button variant="outline" size="icon" className="rounded-full w-14 h-14 border-destructive/30 bg-destructive/10 hover:bg-destructive/20">
              <X className="w-6 h-6 text-destructive" />
            </Button>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Disconnect</span>
          </div>
        </div>

        {/* Privacy disclaimer */}
        <p
          className={`text-sm text-muted-foreground transition-opacity duration-[2000ms] delay-700 ${showContent ? "opacity-100" : "opacity-0"}`}
        >
          Your video and audio data will <strong className="text-foreground">NOT</strong> be saved
        </p>
      </div>
    </main>
  );
};

export default ChatPage;
