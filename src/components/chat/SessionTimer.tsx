/**
 * SessionTimer
 * -------------
 * Compact MM:SS display rendered inside the VideoConferenceToolbar slot grid.
 * Matches the visual rhythm of the surrounding icon + micro-label items.
 */

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionTimerProps {
  formatted: string;
  isWarning: boolean;
}

export function SessionTimer({ formatted, isWarning }: SessionTimerProps) {
  return (
    <div className="flex w-20 flex-col items-center gap-1.5">
      <div
        className={cn(
          "flex h-10 w-full items-center justify-center gap-1 rounded-full border border-border/50",
          isWarning && "border-destructive/40 bg-destructive/10 animate-pulse",
        )}
      >
        <Clock
          className={cn(
            "h-3 w-3",
            isWarning ? "text-destructive" : "text-muted-foreground",
          )}
        />
        <span
          className={cn(
            "font-mono text-xs tabular-nums tracking-tight",
            isWarning ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {formatted}
        </span>
      </div>
      <span className="text-[8px] uppercase tracking-wider text-muted-foreground">
        Time
      </span>
    </div>
  );
}
