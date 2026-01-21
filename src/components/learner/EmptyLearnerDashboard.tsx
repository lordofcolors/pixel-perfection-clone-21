import { useState, useEffect } from "react";
import acircleLogo from "@/assets/acircle-logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MonitorUp, X, Volume2, Smile } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EmptyLearnerDashboardProps {
  learnerName: string;
}

export function EmptyLearnerDashboard({ learnerName }: EmptyLearnerDashboardProps) {
  const [message, setMessage] = useState("");
  const [showEmojiHint, setShowEmojiHint] = useState(false);

  // Show emoji hint periodically for new users
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmojiHint(true);
      // Hide after 5 seconds
      setTimeout(() => setShowEmojiHint(false), 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] w-full max-w-3xl mx-auto">
      {/* A Circle Logo with Audio Indicator - Outside the window */}
      <div className="relative mb-4">
        <img 
          src={acircleLogo} 
          alt="A Assistant" 
          className="w-20 h-20 object-contain"
        />
        {/* Audio indicator */}
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-xolv-teal-300 flex items-center justify-center">
          <Volume2 className="w-3.5 h-3.5 text-background" />
        </div>
      </div>

      {/* Video/Avatar Area */}
      <div className="relative w-full flex-1 bg-card/50 rounded-xl mb-4">
        {/* Menu dots in top right */}
        <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center hover:bg-muted transition-colors">
          <span className="text-muted-foreground">•••</span>
        </button>
      </div>

      {/* AI Message Bubble */}
      <div className="w-full bg-card/80 backdrop-blur rounded-xl p-4 mb-4 text-center">
        <p className="text-foreground">
          Hi {learnerName}! I'm A. How are you today?
        </p>
      </div>

      {/* Input Area */}
      <div className="w-full flex items-center gap-2 mb-6">
        {/* Emoji Button with Tooltip/Hint */}
        <TooltipProvider>
          <Tooltip open={showEmojiHint}>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="shrink-0 relative"
                onClick={() => setShowEmojiHint(false)}
              >
                <Smile className="h-5 w-5 text-amber-400" />
                {showEmojiHint && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-xolv-teal-300 rounded-full animate-pulse" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-card border text-foreground">
              <p>You can also use emojis 😊</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input 
          placeholder="Type something here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-muted/50 border-muted"
        />
        <Button 
          size="icon" 
          className="shrink-0 bg-xolv-blue-300 hover:bg-xolv-blue-400"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <button className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full bg-muted/80 flex items-center justify-center group-hover:bg-muted transition-colors">
            <MonitorUp className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Share Screen</span>
        </button>

        <button className="flex flex-col items-center gap-2 group">
          <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center group-hover:bg-destructive/30 transition-colors">
            <X className="w-6 h-6 text-destructive" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Disconnect</span>
        </button>
      </div>

      {/* Privacy Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        Your video and audio data will <span className="font-semibold">NOT</span> be saved
      </p>
    </div>
  );
}
