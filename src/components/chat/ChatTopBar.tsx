/**
 * =============================================================================
 * ChatTopBar
 * =============================================================================
 */

import { ArrowLeft, TimerOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatTopBarProps {
  showContent: boolean;
  onBack: () => void;
  imageSearchOn: boolean;
  onImageSearchChange: (value: boolean) => void;
  skillMapOn: boolean;
  onSkillMapChange: (value: boolean) => void;
  /** Dev preview — instantly trigger the Time's Up modal. */
  onTriggerTimeUp: () => void;
}

export function ChatTopBar({
  showContent,
  onBack,
  onTriggerTimeUp,
}: ChatTopBarProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-border/50 bg-card/30 px-4 py-2 transition-opacity duration-[2000ms] ${
        showContent ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Quick Start</span>
      </div>

      {/* Right: dev shortcut to preview the "Time's Up" flow */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onTriggerTimeUp}
        className="h-8 gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        <TimerOff className="h-3.5 w-3.5" />
        Complete Lesson
      </Button>
    </div>
  );
}
