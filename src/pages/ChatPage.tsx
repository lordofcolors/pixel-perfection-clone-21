import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Smile, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { firstName } = (location.state as { firstName?: string }) || {};
  const [message, setMessage] = useState("");

  const { RiveComponent } = useRive({
    src: "/animations/robocat.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <main className="w-screen h-screen bg-background flex flex-col items-center relative overflow-hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground z-10"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      {/* Rive animation - pushed to top */}
      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] mt-8 flex-shrink-0">
        <RiveComponent />
      </div>

      {/* Chat area below animation */}
      <div className="flex flex-col items-center w-full max-w-2xl px-6 flex-1 justify-end pb-8 gap-4">
        {/* AI message bubble */}
        <div className="w-full rounded-2xl border border-muted p-4 mb-2">
          <p className="text-center text-foreground text-base">
            Hi{firstName ? `, ${firstName}` : ""}! I'm A! It's nice to meet you!
          </p>
        </div>

        {/* Text input row */}
        <div className="w-full flex items-center gap-2 rounded-2xl border border-muted p-2">
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
        <div className="flex items-center gap-8">
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
        <p className="text-sm text-muted-foreground">
          Your video and audio data will <strong className="text-foreground">NOT</strong> be saved
        </p>
      </div>
    </main>
  );
};

export default ChatPage;
