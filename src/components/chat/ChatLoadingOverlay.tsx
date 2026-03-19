/**
 * =============================================================================
 * ChatLoadingOverlay
 * =============================================================================
 *
 * Full-screen overlay displayed while the chat session is initialising.
 * Shows a spinner and cycles through friendly loading messages
 * (e.g. "Waking up A…", "Calibrating curiosity levels…").
 *
 * The overlay fades out via CSS opacity when `isLoading` becomes false,
 * and pointer-events are disabled so the content beneath becomes interactive.
 */

import { LOADING_STATES } from "@/components/chat/types";

interface ChatLoadingOverlayProps {
  /** Whether the loading sequence is still in progress. */
  isLoading: boolean;
  /** Index into LOADING_STATES for the currently displayed message. */
  loadingIndex: number;
}

export function ChatLoadingOverlay({ isLoading, loadingIndex }: ChatLoadingOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-1000"
      style={{
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? "auto" : "none",
      }}
    >
      {/* Spinner */}
      <div className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />

      {/* Rotating status message */}
      <p className="text-sm italic text-muted-foreground transition-opacity duration-500">
        {LOADING_STATES[loadingIndex]}
      </p>
    </div>
  );
}
