/**
 * =============================================================================
 * InlineChatInput
 * =============================================================================
 *
 * The subtitle + text input / emoji+action bar below the canvas panel grid.
 *
 * Two modes:
 * 1. **Text mode** (default) — emoji button, text input, send button.
 * 2. **Emoji mode** — row of preset emoji reactions + action buttons
 *    (Search Image, Skill Map, Quiz Me) with a keyboard icon to return.
 */

import { useState } from "react";
import {
  Send,
  Smile,
  Keyboard,
  Maximize2,
  Minimize2,
  Search,
  Map,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMOJI_SET = ["😊", "👍", "❤️", "🚀", "👎"] as const;

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
  /** Callback to toggle the chat transcript flyout. */
  onToggleChat?: () => void;
  /** Whether the chat flyout is currently open. */
  isChatOpen?: boolean;
  /** Send an emoji reaction as a chat message. */
  onSendEmoji?: (emoji: string) => void;
  /** Toggle image search panel. */
  onToggleImageSearch?: () => void;
  /** Whether image search is currently on. */
  imageSearchOn?: boolean;
  /** Toggle skill map panel. */
  onToggleSkillMap?: () => void;
  /** Whether skill map is currently on. */
  skillMapOn?: boolean;
  /** Trigger a "Quiz me" action. */
  onQuizMe?: () => void;
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
  onSendEmoji,
  onToggleImageSearch,
  imageSearchOn,
  onToggleSkillMap,
  skillMapOn,
  onQuizMe,
}: InlineChatInputProps) {
  const [emojiMode, setEmojiMode] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onSendEmoji?.(emoji);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      {/* ── Response bubble ───────────────────────────────────────── */}
      <div
        className={`relative rounded-xl border border-border/30 bg-card/40 p-3 backdrop-blur-sm transition-opacity duration-700 ${
          responseBubbleText ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="min-h-[1rem] pr-7 text-center text-sm text-foreground">
          {responseBubbleText}
          {showCursor && (
            <span className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-foreground align-text-bottom" />
          )}
        </p>

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

      {/* ── Input bar (text mode) / Emoji + actions bar ───────────── */}
      {emojiMode ? (
        <div className="flex items-center gap-1.5 rounded-xl border border-border/30 bg-card/30 p-1.5">
          {/* Emoji reactions */}
          {EMOJI_SET.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-lg transition-colors hover:bg-accent/50"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action buttons */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 flex-shrink-0 rounded-lg transition-colors ${
              imageSearchOn
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={onToggleImageSearch}
            title="Search Image"
          >
            <ImageSearch className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 flex-shrink-0 rounded-lg transition-colors ${
              skillMapOn
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={onToggleSkillMap}
            title="Skill Map"
          >
            <Map className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            onClick={onQuizMe}
            title="Quiz Me"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>

          {/* Keyboard toggle — back to text input */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0 rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setEmojiMode(false)}
            title="Show keyboard"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
          {/* Emoji button — switches to emoji mode */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 text-primary"
            onClick={() => setEmojiMode(true)}
            title="Show emoji reactions"
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
      )}
    </div>
  );
}
