/**
 * =============================================================================
 * useRiveAssistant Hook
 * =============================================================================
 *
 * Encapsulates Rive animation setup for the AI assistant ("Catbot").
 *
 * A single instance is created — no duplicates. The hook also handles:
 *   - Starting playback once the UI is visible (`showContent`).
 *   - Forcing a canvas re-layout after panel transitions so the Rive canvas
 *     correctly recalculates its dimensions.
 */

import { useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

const RIVE_CONFIG = {
  src: "/animations/robocat.riv",
  stateMachines: "State Machine",
  artboard: "Catbot",
} as const;

interface UseRiveAssistantOptions {
  showContent: boolean;
  hasSidePanels: boolean;
  expandedPanel: string | null;
}

export function useRiveAssistant({
  showContent,
  hasSidePanels,
  expandedPanel,
}: UseRiveAssistantOptions) {
  const { rive, RiveComponent } = useRive({
    ...RIVE_CONFIG,
    autoplay: false,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // Start playback once UI is visible
  useEffect(() => {
    if (showContent && rive) rive.play();
  }, [showContent, rive]);

  // Force canvas re-layout after panel transitions
  useEffect(() => {
    if (!rive) return;

    const syncLayout = () => {
      window.dispatchEvent(new Event("resize"));
      (rive as unknown as { resizeDrawingSurfaceToCanvas?: () => void })
        .resizeDrawingSurfaceToCanvas?.();
    };

    const rafId = requestAnimationFrame(syncLayout);
    const timeoutId = window.setTimeout(syncLayout, 750);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [rive, hasSidePanels, expandedPanel]);

  return { RiveComponent };
}
