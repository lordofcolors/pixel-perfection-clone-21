/**
 * =============================================================================
 * VideoConferenceToolbar
 * =============================================================================
 *
 * Sticky bottom toolbar for the /chat page, styled after video conferencing
 * apps. Layout (left to right):
 *
 *   1. **Mute**         — toggles microphone mute/unmute
 *   2. **Disconnect**   — ends the session (centre, destructive)
 *   3. **Share Screen** — toggles the screen share panel
 *
 * The **Chat** button is pinned to the far-right corner as a flyout trigger.
 */

import { Mic, MicOff, Monitor, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoConferenceToolbarProps {
  onDisconnect: () => void;
  onToggleChat: () => void;
  onToggleScreenShare: () => void;
  onToggleMute: () => void;
  isChatOpen: boolean;
  isScreenSharing: boolean;
  isMuted: boolean;
}

export function VideoConferenceToolbar({
  onDisconnect,
  onToggleChat,
  onToggleScreenShare,
  onToggleMute,
  isChatOpen,
  isScreenSharing,
  isMuted,
}: VideoConferenceToolbarProps) {
  return (
    <div className="relative w-full border-t border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm">
      {/* Centre group: Mute · Disconnect · Share Screen */}
      <div className="flex items-center justify-center gap-1">
        {/* Mute button */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-border/50 ${
              isMuted ? "bg-destructive/10 border-destructive/30" : ""
            }`}
            onClick={onToggleMute}
          >
            {isMuted ? (
              <MicOff className="h-4 w-4 text-destructive" />
            ) : (
              <Mic className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
            {isMuted ? "Unmute" : "Mute"}
          </span>
        </div>

        {/* Disconnect button */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-destructive/30 bg-destructive/10 hover:bg-destructive/20"
            onClick={onDisconnect}
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Disconnect
          </span>
        </div>

        {/* Share Screen button */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-border/50 ${
              isScreenSharing ? "bg-secondary/20 border-secondary/50" : ""
            }`}
            onClick={onToggleScreenShare}
          >
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </Button>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
            Share Screen
          </span>
        </div>
      </div>



    </div>
  );
}
