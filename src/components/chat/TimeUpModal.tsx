/**
 * TimeUpModal
 * ------------
 * Shown when the session timer reaches its 10-minute limit.
 * Friendly framing: take a quick break, then either complete the lesson
 * or resume the session if there's more to cover.
 */

import { Button } from "@/components/ui/button";

interface TimeUpModalProps {
  open: boolean;
  /** Primary CTA — wrap up the lesson and move on. */
  onCompleteLesson: () => void;
  /** Secondary CTA — reset the timer and keep going. */
  onResumeSession: () => void;
}

export function TimeUpModal({ open, onCompleteLesson, onResumeSession }: TimeUpModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-md mx-4 bg-card border border-border/50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Time's up, let's take a quick break!
        </h2>
        <p className="text-sm text-foreground/80 leading-relaxed mb-8">
          You've been learning hard for 10 minutes. Nice work! Take a moment to
          stretch. When you're ready, jump back in to keep going or wrap up
          and review what you covered.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={onResumeSession}
            className="w-full h-12 font-medium text-base bg-gradient-to-r dark:from-xolv-magenta-300 dark:via-xolv-blue-300 dark:to-xolv-teal-300 from-xolv-magenta-700 via-xolv-blue-600 to-xolv-teal-500 text-black"
          >
            Resume Session
          </Button>
          <Button
            variant="outline"
            onClick={onCompleteLesson}
            className="w-full h-12 font-medium text-base border-border/50"
          >
            Wrap Up & Review
          </Button>
        </div>
      </div>
    </div>
  );
}
