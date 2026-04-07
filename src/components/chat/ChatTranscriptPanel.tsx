/**
 * =============================================================================
 * ChatTranscriptPanel
 * =============================================================================
 *
 * Slide-out panel on the right side of /chat showing full message history,
 * text input, emoji reactions, and action chips.
 */

import { useState } from "react";
import {
  X,
  Send,
  Smile,
  Keyboard,
  Plus,
  Minus,
  Search,
  Map,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/components/chat/types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMOJI_SET = ["😊", "👍", "❤️", "🚀", "👎"] as const;

type ActionKey = "findImage" | "breakDown" | "quizMe";

const ACTION_BUTTONS: { key: ActionKey; label: string; icon: typeof Search }[] = [
  { key: "findImage", label: "Find Image", icon: Search },
  { key: "breakDown", label: "Break It Down", icon: Map },
  { key: "quizMe", label: "Quiz Me", icon: HelpCircle },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChatTranscriptPanelProps {
  firstName?: string;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendEmoji?: (emoji: string) => void;
  onToggleImageSearch?: () => void;
  imageSearchOn?: boolean;
  onToggleSkillMap?: () => void;
  skillMapOn?: boolean;
  onQuizMe?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatTranscriptPanel({
  firstName,
  onClose,
  messages,
  onSendMessage,
  inputValue,
  onInputChange,
  onSendEmoji,
  onToggleImageSearch,
  onToggleSkillMap,
  onQuizMe,
}: ChatTranscriptPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [actionBarOpen, setActionBarOpen] = useState(true);
  const [loadingAction, setLoadingAction] = useState<ActionKey | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    onInputChange("");
  };

  const handleAction = (key: ActionKey) => {
    if (loadingAction) return;
    setLoadingAction(key);
    setTimeout(() => {
      if (key === "findImage") onToggleImageSearch?.();
      if (key === "breakDown") onToggleSkillMap?.();
      if (key === "quizMe") onQuizMe?.();
      setLoadingAction(null);
    }, 1200);
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
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-secondary">A</span>
              </div>
            )}
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
        <div ref={bottomRef} />
      </div>

      {/* Privacy disclaimer */}
      <div className="px-3 pt-2 pb-1">
        <p className="text-[10px] text-foreground/50 text-center">
          Your video and audio data will NOT be saved
        </p>
      </div>

      {/* Input bar */}
      <div className="px-3 pb-1 pt-1 border-t border-border/50">
        <div className="flex items-center gap-2 rounded-xl border border-border/50 p-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8 text-primary"
            onClick={() => setActionBarOpen((v) => !v)}
            title={actionBarOpen ? "Hide reactions" : "Show reactions"}
          >
            {actionBarOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type something here..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
          />

          <Button
            size="icon"
            className="flex-shrink-0 h-8 w-8 bg-primary hover:bg-primary/90"
            onClick={handleSend}
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Action bar */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out px-3 ${
          actionBarOpen ? "max-h-24 pb-3 opacity-100" : "max-h-0 pb-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/30 bg-card/30 p-1.5">
          {/* Emojis */}
          {EMOJI_SET.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendEmoji?.(emoji)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border/40 bg-background/30 text-sm transition-all hover:scale-110 hover:border-primary/50 hover:bg-primary/10"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}

          <div className="mx-0.5 h-5 w-px bg-border/30" />

          {/* Action chips */}
          {ACTION_BUTTONS.map(({ key, label, icon: Icon }) => {
            const loading = loadingAction === key;
            return (
              <button
                key={key}
                onClick={() => handleAction(key)}
                disabled={loading}
                className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium transition-all ${
                  loading
                    ? "cursor-wait border-border/20 bg-background/10 text-muted-foreground/50"
                    : "cursor-pointer border-border/40 bg-background/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                }`}
                title={label}
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Icon className="h-3 w-3" />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
