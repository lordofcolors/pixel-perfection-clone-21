/**
 * =============================================================================
 * InlineChatInput
 * =============================================================================
 *
 * The inline chat area that sits below the panel grid.
 * Consists of two parts:
 *
 * 1. **Response bubble** — displays the latest AI response with a typewriter
 *    cursor animation. Fades in when text is available.
 *
 * 2. **Text input** — a minimal input bar with emoji button and send button.
 *    Pressing Enter or clicking Send dispatches the message.
 *
 * This component is used in both gallery and speaker views, positioned in the
 * vertical space between the panel grid and the bottom toolbar.
 */

import { Send, Smile, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InlineChatInputProps {
  responseBubbleText: string;
  showCursor: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
}

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
      {/* AI response bubble with typewriter effect */}
      <div
        className={`rounded-xl border border-border/30 bg-card/40 p-3 backdrop-blur-sm transition-opacity duration-700 ${
          responseBubbleText ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="min-h-[1rem] text-center text-sm text-foreground">
          {responseBubbleText}
          {/* Blinking cursor shown while the typewriter is active */}
          {showCursor && (
            <span className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-foreground align-text-bottom" />
          )}
        </p>
      </div>

      {/* Text input bar */}
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
        {/* Emoji button (placeholder — not yet functional) */}
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-primary">
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
