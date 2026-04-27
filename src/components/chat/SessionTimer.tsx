/**
 * SessionTimer
 * -------------
 * Minimal MM:SS display with an info tooltip explaining the 10-minute limit.
 * Sits to the right of the Disconnect button.
 */

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionTimerProps {
  formatted: string;
  isWarning: boolean;
}

export function SessionTimer({ formatted, isWarning }: SessionTimerProps) {
  return (
    <div className="ml-2 flex items-center gap-1">
      <span
        className={cn(
          "font-mono text-[10px] tabular-nums tracking-tight",
          isWarning ? "text-destructive animate-pulse" : "text-muted-foreground",
        )}
      >
        {formatted}
      </span>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground/70 transition-colors hover:text-muted-foreground"
              aria-label="Session time info"
            >
              <Info className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="end" className="max-w-[220px] text-xs leading-relaxed">
            Each conversation lasts up to 10 minutes. We'll give you a friendly reminder at the 2-minute mark, then take a quick break before your next lesson.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
