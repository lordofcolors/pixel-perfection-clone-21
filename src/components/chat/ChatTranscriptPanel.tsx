/**
 * =============================================================================
 * ChatTranscriptPanel
 * =============================================================================
 *
 * A slide-out panel on the right side of the /chat page that shows the full
 * message history (chat transcript) and provides a secondary text input.
 *
 * Features:
 *   - Auto-scrolls to the latest message when new messages arrive
 *   - Shares the same input state as the inline input (so typing in one
 *     is reflected in the other)
 *   - Displays a privacy disclaimer above the input field
 *   - AI messages show an "A" avatar; user messages are right-aligned
 */

import { X, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/components/chat/types";

interface ChatTranscriptPanelProps {
  /** Learner's first name (currently unused but available for future use). */
  firstName?: string;
  /** Callback to close the panel. */
  onClose: () => void;
  /** Full list of chat messages to display. */
  messages: ChatMessage[];
  /** Callback to send a new message. */
  onSendMessage: (text: string) => void;
  /** Current value of the shared text input. */
  inputValue: string;
  /** Callback to update the shared text input. */
  onInputChange: (val: string) => void;
}

export function ChatTranscriptPanel({
  firstName,
  onClose,
  messages,
  onSendMessage,
  inputValue,
  onInputChange,
}: ChatTranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  /** Auto-scroll to bottom when new messages arrive. */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Send the current input value and clear it. */
  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    onInputChange("");
  };

  return (
    <div className="flex flex-col h-full bg-card/30 border-l border-border/50">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : ""}`}
          >
            {/* AI avatar */}
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-secondary">A</span>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`rounded-xl px-4 py-2.5 max-w-[85%] ${
                msg.sender === "user"
                  ? "bg-primary/20 rounded-tr-sm"
                  : "bg-muted/50 rounded-tl-sm"
              }`}
            >
              <p className="text-sm text-foreground">{msg.text}</p>
            </div>
          </div>
        ))}
        {/* Invisible anchor for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Privacy disclaimer */}
      <div className="px-3 pt-2 pb-3">
        <p className="text-[10px] text-foreground/50 text-center">
          Your video and audio data will NOT be saved
        </p>
      </div>

      {/* Input bar */}
      <div className="p-3 pt-1 border-t border-border/50">
        <div className="flex items-center gap-2 rounded-xl border border-border/50 p-1.5">
          {/* Emoji button (placeholder) */}
          <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 text-amber-400">
            <Smile className="w-4 h-4" />
          </Button>

          {/* Text input */}
          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type something here..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
          />

          {/* Send button */}
          <Button
            size="icon"
            className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90"
            onClick={handleSend}
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
