/**
 * =============================================================================
 * VideoConferenceToolbar
 * =============================================================================
 *
 * Sticky bottom toolbar for the /chat page, styled after video conferencing
 * apps. Contains three action buttons arranged in a centred row:
 *
 *   1. **Share Screen** — toggles the screen share panel on/off
 *   2. **Disconnect**   — ends the session (triggers Session Ended flow)
 *   3. **Chat**          — toggles the chat transcript flyout on/off
 *
 * Active states (screen sharing / chat open) are indicated by a highlighted
 * background and border on the respective button.
 */

import { Monitor, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoConferenceToolbarProps {
  /** Called when the disconnect button is clicked. */
  onDisconnect: () => void;
  /** Toggles the chat transcript flyout. */
  onToggleChat: () => void;
  /** Toggles the screen share panel. */
  onToggleScreenShare: () => void;
  /** Whether the chat flyout is currently open. */
  isChatOpen: boolean;
  /** Whether screen sharing is currently active. */
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
      <div className="flex items-center justify-center gap-1">
        {/* Share Screen button */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-10 h-10 border-border/50 ${
              isScreenSharing ? "bg-secondary/20 border-secondary/50" : ""
            }`}
            onClick={onToggleScreenShare}
          >
            <Monitor className="w-4 h-4 text-muted-foreground" />
          </Button>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider">
            Share Screen
          </span>
        </div>

        {/* Disconnect button (destructive styling) */}
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

        {/* Chat toggle button */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-10 h-10 border-border/50 ${
              isChatOpen ? "bg-secondary/20 border-secondary/50" : ""
            }`}
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
