/**
 * useSessionTimer
 * ----------------
 * Simple count-up timer hook for the chat session.
 *
 *   - starts at 0 seconds, ticks every 1s
 *   - flips `isWarning` true at `warningSeconds`
 *   - flips `isExpired` true at `limitSeconds` and stops ticking
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSessionTimerOptions {
  /** When true, the timer runs. When false, it pauses. */
  active: boolean;
  /** Total session length in seconds (default: 600 = 10 min). */
  limitSeconds?: number;
  /** Threshold (seconds) at which the warning state turns on (default: 480 = 8 min). */
  warningSeconds?: number;
}

interface UseSessionTimerReturn {
  elapsedSeconds: number;
  formatted: string;
  isWarning: boolean;
  isExpired: boolean;
  reset: () => void;
  /** Dev helper — jump straight to the limit to preview the Time's Up modal. */
  expireNow: () => void;
}

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function useSessionTimer({
  active,
  limitSeconds = 600,
  warningSeconds = 480,
}: UseSessionTimerOptions): UseSessionTimerReturn {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) return;
    if (elapsedSeconds >= limitSeconds) return;

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => {
        if (s + 1 >= limitSeconds) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return limitSeconds;
        }
        return s + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, limitSeconds, elapsedSeconds >= limitSeconds]);

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsedSeconds(0);
  }, []);

  const expireNow = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsedSeconds(limitSeconds);
  }, [limitSeconds]);

  return {
    elapsedSeconds,
    formatted: format(elapsedSeconds),
    isWarning: elapsedSeconds >= warningSeconds && elapsedSeconds < limitSeconds,
    isExpired: elapsedSeconds >= limitSeconds,
    reset,
    expireNow,
  };
}
