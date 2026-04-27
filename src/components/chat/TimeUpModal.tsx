/**
 * TimeUpModal
 * ------------
 * Shown when the session timer reaches its 10-minute limit. Forces the user
 * to acknowledge before transitioning to the SessionEndedView.
 */

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeUpModalProps {
  open: boolean;
  onEndSession: () => void;
  onBackToHome: () => void;
}

export function TimeUpModal({ open, onEndSession, onBackToHome }: TimeUpModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-md mx-4 bg-card border border-border/50 rounded-2xl p-8">
        <div className="w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center mb-5">
          <Clock className="w-7 h-7 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">Time's Up!</h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-8">
          You've reached your 10-minute session limit. Great work today — let's
          wrap things up so you can review what you covered.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onEndSession}
            className="w-full h-12 font-medium text-base bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black"
          >
            End Session
          </Button>
          <Button
            variant="outline"
            onClick={onBackToHome}
            className="w-full h-12 font-medium text-base border-border/50"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
