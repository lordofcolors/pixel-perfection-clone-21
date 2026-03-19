/**
 * =============================================================================
 * VideoConferenceToolbar
 * =============================================================================
 *
 * Sticky bottom toolbar for the /chat page, styled after video-conferencing
 * apps. Three centred action buttons:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │        [🎤 Mute]    [✕ Disconnect]    [🖥 Share Screen]    │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * - **Mute** — toggles microphone on/off. Shows `MicOff` icon + destructive
 *   tint when muted, `Mic` icon when unmuted.
 * - **Disconnect** — ends the session (always destructive styling).
 * - **Share Screen** — toggles the screen share panel. Highlighted when active.
 *
 * All buttons are circular with compact 8px uppercase labels beneath them.
 */

import { Mic, MicOff, Monitor, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface VideoConferenceToolbarProps {
  /** Called when the disconnect button is clicked. */
  onDisconnect: () => void;

  /** Toggles the chat transcript flyout (kept for API compat, unused in UI). */
  onToggleChat: () => void;

  /** Toggles the screen share panel. */
  onToggleScreenShare: () => void;

  /** Toggles microphone mute/unmute. */
  onToggleMute: () => void;

  /** Whether the chat flyout is currently open. */
  isChatOpen: boolean;

  /** Whether screen sharing is currently active. */
  isScreenSharing: boolean;

  /** Whether the microphone is currently muted. */
  isMuted: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VideoConferenceToolbar({
  onDisconnect,
  onToggleScreenShare,
  onToggleMute,
  isMuted,
  isScreenSharing,
}: VideoConferenceToolbarProps) {
  return (
    <div className="relative w-full border-t border-border/50 bg-card/30 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1">

        {/* ── Mute button ─────────────────────────────────────────── */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-border/50 ${
              isMuted ? "border-destructive/30 bg-destructive/10" : ""
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

        {/* ── Disconnect button ────────────────────────────────────── */}
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

        {/* ── Share Screen button ──────────────────────────────────── */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-border/50 ${
              isScreenSharing ? "border-secondary/50 bg-secondary/20" : ""
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
