/**
 * =============================================================================
 * VideoConferenceToolbar
 * =============================================================================
 *
 * Sticky bottom toolbar for the /chat page:
 *
 *   ┌───────────────────────────────────────────────────────────────────┐
 *   │   [🎤 Mute]  [✕ Disconnect]  [📷 Webcam]  [🖥 Share Screen]    │
 *   └───────────────────────────────────────────────────────────────────┘
 */

import { Mic, MicOff, Monitor, Video, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionTimer } from "./SessionTimer";

interface VideoConferenceToolbarProps {
  onDisconnect: () => void;
  onToggleChat: () => void;
  onToggleScreenShare: () => void;
  onToggleWebcam: () => void;
  onToggleMute: () => void;
  isChatOpen: boolean;
  isScreenSharing: boolean;
  isWebcamOn: boolean;
  isMuted: boolean;
  timerFormatted: string;
  timerIsWarning: boolean;
}

export function VideoConferenceToolbar({
  onDisconnect,
  onToggleScreenShare,
  onToggleWebcam,
  onToggleMute,
  isMuted,
  isScreenSharing,
  isWebcamOn,
  timerFormatted,
  timerIsWarning,
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

        {/* ── Webcam button ────────────────────────────────────────── */}
        <div className="flex w-20 flex-col items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className={`h-10 w-10 rounded-full border-border/50 ${
              isWebcamOn ? "border-secondary/50 bg-secondary/20" : ""
            }`}
            onClick={onToggleWebcam}
          >
            {isWebcamOn ? (
              <Video className="h-4 w-4 text-muted-foreground" />
            ) : (
              <VideoOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
            {isWebcamOn ? "Hide Cam" : "Show Cam"}
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

        {/* ── Session timer ────────────────────────────────────────── */}
        <SessionTimer formatted={timerFormatted} isWarning={timerIsWarning} />

        {/* ── Disconnect button (far right) ────────────────────────── */}
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
      </div>
    </div>
  );
}
