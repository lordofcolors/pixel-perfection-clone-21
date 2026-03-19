/**
 * =============================================================================
 * InlineChatInput
 * =============================================================================
 *
 * The subtitle + text input area that sits below the canvas panel grid.
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  "Hi! I'm A! It's nice to meet you!"                   [⤢] │  ← response bubble
 * └──────────────────────────────────────────────────────────────┘
 * ┌──────────────────────────────────────────────────────────────┐
 * │  😊  Type something here...                             [➤] │  ← text input
 * └──────────────────────────────────────────────────────────────┘
 *
 * ## Features
 *
 * - **Response bubble** — shows the latest AI response with a typewriter
 *   cursor animation. Fades in when text is available.
 * - **Expand/collapse icon** — inside the bubble (far right), toggles the
 *   chat transcript flyout open/closed.
 * - **Text input** — minimal bar with emoji placeholder and send button.
 *   Pressing Enter or clicking Send dispatches the message.
 */

import { Send, Smile, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface InlineChatInputProps {
  /** The text to display in the AI response bubble. */
  responseBubbleText: string;

  /** Whether to show the blinking typewriter cursor. */
  showCursor: boolean;

  /** Current value of the text input (controlled). */
  inputValue: string;

  /** Callback when the input value changes. */
  onInputChange: (value: string) => void;

  /** Callback to send the current message. */
  onSend: () => void;

  /** Callback to toggle the chat transcript flyout (optional). */
  onToggleChat?: () => void;

  /** Whether the chat flyout is currently open. */
  isChatOpen?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function InlineChatInput({
  responseBubbleText,
  showCursor,
  inputValue,
  onInputChange,
  onSend,
  onToggleChat,
  isChatOpen,
}: InlineChatInputProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">

      {/* ── Response bubble ───────────────────────────────────────── */}
      <div
        className={`relative rounded-xl border border-border/30 bg-card/40 p-3 backdrop-blur-sm transition-opacity duration-700 ${
          responseBubbleText ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Subtitle text (right-padded to avoid overlapping the icon) */}
        <p className="min-h-[1rem] pr-7 text-center text-sm text-foreground">
          {responseBubbleText}
          {showCursor && (
            <span className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-foreground align-text-bottom" />
          )}
        </p>

        {/* Expand / collapse icon (toggles chat flyout) */}
        {onToggleChat && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={onToggleChat}
            title={isChatOpen ? "Collapse chat" : "Expand chat"}
          >
            {isChatOpen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        )}
      </div>

      {/* ── Text input bar ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
        {/* Emoji button (placeholder — not yet functional) */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 text-primary"
        >
          <Smile className="h-4 w-4" />
        </Button>

        {/* Message input */}
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type something here..."
          className="h-8 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Send button */}
        <Button
          size="icon"
          className="h-8 w-8 flex-shrink-0 bg-primary hover:bg-primary/90"
          onClick={onSend}
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
