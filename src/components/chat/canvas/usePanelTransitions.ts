/**
 * =============================================================================
 * usePanelTransitions
 * =============================================================================
 *
 * Manages enter/exit animations and border-hiding during layout changes.
 *
 * ## How it works
 *
 * 1. **Exit animation** — When a side panel is toggled OFF, it stays mounted
 *    for `SLIDE_DURATION_MS` while CSS slides it off-screen to the right.
 *    After the animation completes it is unmounted.
 *
 * 2. **Enter animation** — When a side panel is toggled ON, it renders
 *    immediately at `translateX(120%)` (off-screen right) with transitions
 *    disabled. After `ENTER_SETTLE_MS` the "entering" flag clears, CSS
 *    transitions re-enable, and the panel slides to its final position.
 *
 * 3. **Border hiding** — During any layout change (panel toggle or
 *    expand/collapse), panel borders are hidden to avoid visual overlap.
 *    They reappear after `BORDER_HIDE_MS`.
 */

import { useState, useEffect, useRef } from "react";
import type { PanelKey } from "@/components/chat/types";
import {
  SLIDE_DURATION_MS,
  ENTER_SETTLE_MS,
  BORDER_HIDE_MS,
} from "./constants";

type SidePanelKey = "image" | "skill" | "screen" | "webcam" | "quiz";

interface PanelTransitionState {
  /** Panels currently animating out (still mounted but sliding off-screen). */
  exitingPanels: Set<PanelKey>;

  /** Panels that just appeared and need one paint at the off-screen position. */
  enteringPanels: Set<PanelKey>;

  /** True while any layout transition is in progress (borders should hide). */
  isTransitioning: boolean;

  /**
   * The full list of panels to render — active panels plus any that are
   * in the middle of their exit animation.
   */
  allActivePanels: PanelKey[];
}

export function usePanelTransitions(
  activeSidePanels: SidePanelKey[],
  expandedPanel: PanelKey | null,
): PanelTransitionState {
  // ── Exit / Enter tracking ──────────────────────────────────────────────

  const [exitingPanels, setExitingPanels] = useState<Set<PanelKey>>(new Set());
  const [enteringPanels, setEnteringPanels] = useState<Set<PanelKey>>(new Set());
  const prevSidePanelsRef = useRef<SidePanelKey[]>(activeSidePanels);

  // Stable string key so the effect only fires when the panel set changes
  const sidePanelsKey = activeSidePanels.join(",");

  useEffect(() => {
    const prev = prevSidePanelsRef.current;
    const removed = prev.filter((p) => !activeSidePanels.includes(p));
    const added = activeSidePanels.filter((p) => !prev.includes(p));
    prevSidePanelsRef.current = activeSidePanels;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Start exit animation for removed panels
    if (removed.length > 0) {
      setExitingPanels((s) => {
        const next = new Set(s);
        removed.forEach((p) => next.add(p));
        return next;
      });
      timers.push(
        setTimeout(() => {
          setExitingPanels((s) => {
            const next = new Set(s);
            removed.forEach((p) => next.delete(p));
            return next;
          });
        }, SLIDE_DURATION_MS),
      );
    }

    // Start enter animation for added panels
    if (added.length > 0) {
      setEnteringPanels(new Set(added));
      timers.push(
        setTimeout(() => {
          setEnteringPanels(new Set());
        }, ENTER_SETTLE_MS),
      );
    }

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidePanelsKey]);

  // ── Border-hiding during transitions ───────────────────────────────────

  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>();
  const prevExpandedPanel = useRef(expandedPanel);
  const prevPanelsKey = useRef(sidePanelsKey);

  useEffect(() => {
    const panelsChanged = prevPanelsKey.current !== sidePanelsKey;
    const expandChanged = prevExpandedPanel.current !== expandedPanel;

    if (panelsChanged || expandChanged) {
      prevExpandedPanel.current = expandedPanel;
      prevPanelsKey.current = sidePanelsKey;
      setIsTransitioning(true);
      clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(
        () => setIsTransitioning(false),
        BORDER_HIDE_MS,
      );
    }

    return () => clearTimeout(transitionTimer.current);
  }, [expandedPanel, sidePanelsKey]);

  // ── Build the full render list ─────────────────────────────────────────

  const allActivePanels: PanelKey[] = [
    "rive",
    ...activeSidePanels,
    ...Array.from(exitingPanels).filter(
      (p) => !activeSidePanels.includes(p as SidePanelKey),
    ),
  ];

  return { exitingPanels, enteringPanels, isTransitioning, allActivePanels };
}
