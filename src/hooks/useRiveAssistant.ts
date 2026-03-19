/**
 * =============================================================================
 * useRiveAssistant Hook
 * =============================================================================
 *
 * Encapsulates all Rive animation setup for the AI assistant ("Catbot").
 *
 * Two instances are created:
 *   1. **Primary** — the full-size animation shown in gallery and speaker views.
 *   2. **Thumbnail** — a smaller, always-playing copy used as a clickable
 *      thumbnail in the speaker view's top strip.
 *
 * The hook also handles:
 *   - Starting playback once the UI is visible (`showContent`).
 *   - Forcing a canvas re-layout after panel transitions so the Rive canvas
 *     correctly recalculates its dimensions (prevents the "stuck at small
 *     size" bug when toggling between gallery ↔ speaker views).
 */

import { useEffect } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

/** Shared Rive configuration for both instances. */
const RIVE_CONFIG = {
  src: "/animations/robocat.riv",
  stateMachines: "State Machine",
  artboard: "Catbot",
} as const;

interface UseRiveAssistantOptions {
  /** True once the main content has faded in (triggers playback). */
  showContent: boolean;
  /** Whether any side panels are currently visible. */
  hasSidePanels: boolean;
  /** Which panel is currently expanded (null = gallery view). */
  expandedPanel: string | null;
}

export function useRiveAssistant({
  showContent,
  hasSidePanels,
  expandedPanel,
}: UseRiveAssistantOptions) {
  // -----------------------------------------------------------------------
  // Primary Rive instance (starts paused, plays when content is visible)
  // -----------------------------------------------------------------------

  const { rive, RiveComponent } = useRive({
    ...RIVE_CONFIG,
    autoplay: false,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // -----------------------------------------------------------------------
  // Thumbnail Rive instance (auto-plays immediately)
  // -----------------------------------------------------------------------

  const { RiveComponent: ThumbRiveComponent } = useRive({
    ...RIVE_CONFIG,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // -----------------------------------------------------------------------
  // Start primary playback once the UI is visible
  // -----------------------------------------------------------------------

  useEffect(() => {
    if (showContent && rive) rive.play();
  }, [showContent, rive]);

  // -----------------------------------------------------------------------
  // Force canvas re-layout after panel transitions
  // -----------------------------------------------------------------------
  //
  // When toggling panels or switching between gallery/speaker views, the
  // Rive canvas container changes size via CSS transitions (1s duration).
  // Rive doesn't automatically detect container resizes, so we manually
  // fire a window resize event and call resizeDrawingSurfaceToCanvas()
  // after the transition completes.

  useEffect(() => {
    if (!rive) return;

    const syncLayout = () => {
      window.dispatchEvent(new Event("resize"));
      (rive as unknown as { resizeDrawingSurfaceToCanvas?: () => void })
        .resizeDrawingSurfaceToCanvas?.();
    };

    // Sync immediately and again after the 1s CSS transition finishes
    const rafId = requestAnimationFrame(syncLayout);
    const timeoutId = window.setTimeout(syncLayout, 1050);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, [rive, hasSidePanels, expandedPanel]);

  return { RiveComponent, ThumbRiveComponent };
}
