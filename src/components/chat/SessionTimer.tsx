/**
 * SessionTimer
 * -------------
 * Minimal MM:SS display — no border, no icon, no label.
 * Sits to the right of the Disconnect button.
 */

import { cn } from "@/lib/utils";

interface SessionTimerProps {
  formatted: string;
  isWarning: boolean;
}

export function SessionTimer({ formatted, isWarning }: SessionTimerProps) {
  return (
    <span
      className={cn(
        "ml-2 font-mono text-xs tabular-nums tracking-tight",
        isWarning ? "text-destructive animate-pulse" : "text-muted-foreground",
      )}
    >
      {formatted}
    </span>
  );
}
