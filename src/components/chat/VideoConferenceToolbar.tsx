import { Monitor, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoConferenceToolbarProps {
  onDisconnect: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

export function VideoConferenceToolbar({
  onDisconnect,
  onToggleChat,
  isChatOpen,
}: VideoConferenceToolbarProps) {
  return (
    <div className="w-full border-t border-border/50 bg-card/30 backdrop-blur-sm px-6 py-3">
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-border/50"
          >
            <Monitor className="w-5 h-5 text-muted-foreground" />
          </Button>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Share Screen
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-12 h-12 border-destructive/30 bg-destructive/10 hover:bg-destructive/20"
            onClick={onDisconnect}
          >
            <X className="w-5 h-5 text-destructive" />
          </Button>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Disconnect
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-12 h-12 border-border/50 ${isChatOpen ? "bg-secondary/20 border-secondary/50" : ""}`}
            onClick={onToggleChat}
          >
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </Button>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Chat
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Your video and audio data will <strong className="text-foreground">NOT</strong> be saved
      </p>
    </div>
  );
}
