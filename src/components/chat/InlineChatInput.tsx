/**
 * =============================================================================
 * InlineChatInput
 * =============================================================================
 *
 * Three-line layout below the canvas:
 * 1. **Response bubble** — latest AI response with typewriter cursor.
 * 2. **Text input** — always visible with emoji toggle + send button.
 * 3. **Action bar** — expandable row of emoji reactions + action chips.
 *    Toggled via a ⊕/⊖ button, defaulted to open.
 */

import { useState, useEffect } from "react";
import {
  Send,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMOJI_SET = ["😊", "👍", "❤️", "🚀", "👎"] as const;

type ActionKey = "findImage" | "breakDown" | "quizMe";

const ACTION_BUTTONS: {
  key: ActionKey;
  label: string;
  emoji: string;
}[] = [
  { key: "findImage", label: "Find Image", emoji: "🔍" },
  { key: "breakDown", label: "Break It Down", emoji: "🗺️" },
  { key: "quizMe", label: "Quiz Me", emoji: "❓" },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface InlineChatInputProps {
  responseBubbleText: string;
  showCursor: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onToggleChat?: () => void;
  isChatOpen?: boolean;
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
  const [actionBarOpen, setActionBarOpen] = useState(true);
  const [loadingAction, setLoadingAction] = useState<ActionKey | null>(null);

  const handleAction = (key: ActionKey, emoji: string, label: string) => {
    if (loadingAction) return;

    // Send the action as a chat message
    onSendEmoji?.(`${emoji} ${label}`);

    setLoadingAction(key);
    setTimeout(() => {
      if (key === "findImage") onToggleImageSearch?.();
      if (key === "breakDown") onToggleSkillMap?.();
      if (key === "quizMe") onQuizMe?.();
      setLoadingAction(null);
    }, 1200);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
      {/* ── 1. Response bubble ────────────────────────────────────── */}
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

      {/* ── 2. Text input (always visible) ────────────────────────── */}
      <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
        {/* Plus/minus toggle for action bar */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 text-primary"
          onClick={() => setActionBarOpen((v) => !v)}
          title={actionBarOpen ? "Hide reactions" : "Show reactions"}
        >
          {actionBarOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>

        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type something here..."
          className="h-8 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          size="icon"
          className="h-8 w-8 flex-shrink-0 bg-primary hover:bg-primary/90"
          onClick={onSend}
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>

      {/* ── 3. Action bar (expandable) ────────────────────────────── */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          actionBarOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 rounded-xl border border-border/30 bg-card/30 p-1.5">
          {/* Emoji reactions */}
          <div className="flex items-center gap-1">
            {EMOJI_SET.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onSendEmoji?.(emoji)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-background/30 text-base transition-all hover:scale-110 hover:border-primary/50 hover:bg-primary/10"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-border/30" />

          {/* Action chips */}
          <div className="flex items-center gap-1.5">
            {ACTION_BUTTONS.map(({ key, label, emoji }) => {
              const loading = loadingAction === key;

              return (
                <button
                  key={key}
                  onClick={() => handleAction(key, emoji, label)}
                  disabled={loading}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    loading
                      ? "cursor-wait border-border/20 bg-background/10 text-muted-foreground/50"
                      : "cursor-pointer border-border/40 bg-background/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                  }`}
                  title={label}
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span>{emoji}</span>
                  )}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
