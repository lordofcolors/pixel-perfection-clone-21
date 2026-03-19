import { Monitor, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoConferenceToolbarProps {
  onDisconnect: () => void;
  onToggleChat: () => void;
  onToggleScreenShare: () => void;
  isChatOpen: boolean;
  isScreenSharing: boolean;
}

export function VideoConferenceToolbar({
  onDisconnect,
  onToggleChat,
  onToggleScreenShare,
  isChatOpen,
  isScreenSharing,
}: VideoConferenceToolbarProps) {
  return (
    <div className="w-full border-t border-border/50 bg-card/30 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-center gap-5">
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-10 h-10 border-border/50 ${isScreenSharing ? "bg-secondary/20 border-secondary/50" : ""}`}
            onClick={onToggleScreenShare}
          >
            <Monitor className="w-4 h-4 text-muted-foreground" />
          </Button>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            Share Screen
          </span>
        </div>

        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 border-destructive/30 bg-destructive/10 hover:bg-destructive/20"
            onClick={onDisconnect}
          >
            <X className="w-4 h-4 text-destructive" />
          </Button>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            Disconnect
          </span>
        </div>

        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-10 h-10 border-border/50 ${isChatOpen ? "bg-secondary/20 border-secondary/50" : ""}`}
            onClick={onToggleChat}
          >
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </Button>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            Chat
          </span>
        </div>
      </div>
    </div>
  );
}
