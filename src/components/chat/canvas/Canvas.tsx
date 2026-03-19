/**
 * =============================================================================
 * Canvas
 * =============================================================================
 *
 * The main layout component for the /chat page. Renders all panels (Rive
 * assistant, image search, skill map, screen share) in a single container
 * using absolute positioning and CSS transitions — no remounting.
 *
 * ## Architecture
 *
 * ```
 * Canvas
 *  ├── usePanelTransitions()   → enter/exit/border-hide state
 *  ├── useCanvasLayout()       → CSS positions for each panel
 *  ├── PanelContent            → renders inner content per panel type
 *  └── InlineChatInput         → subtitle bubble + text input
 * ```
 *
 * ## Layout modes
 *
 * 1. **Gallery** (default) — panels sit in a responsive grid.
 * 2. **Expanded / Speaker** — one panel fills the stage, others become
 *    thumbnails. Click a thumbnail to swap, or click minimize to return.
 *
 * ## Animations
 *
 * - **Resize transitions** — `top / left / width / height` animate at 0.7s
 * - **Slide enter/exit** — side panels slide in/out from the right at 0.5s
 * - **Border hiding** — borders go transparent during transitions to avoid
 *   visual overlap, then reappear after 0.75s
 */

import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineChatInput } from "@/components/chat/InlineChatInput";
import type { PanelKey } from "@/components/chat/types";

import { PANEL_TRANSITION } from "./constants";
import { usePanelTransitions } from "./usePanelTransitions";
import { useCanvasLayout } from "./useCanvasLayout";
import { PanelContent } from "./PanelContent";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CanvasProps {
  /** The Rive animation component (from useRiveAssistant hook). */
  RiveComponent: React.ComponentType<{ className?: string }>;

  /** Toggle states for each side panel (controlled by ChatPage). */
  imageSearchOn: boolean;
  skillMapOn: boolean;
  screenShareOn: boolean;

  /** Which panel is currently expanded (null = gallery mode). */
  expandedPanel: PanelKey | null;
  onExpandPanel: (key: PanelKey | null) => void;

  /** Whether the chat transcript flyout is open. */
  chatOpen: boolean;

  /** Inline chat input / subtitle state. */
  responseBubbleText: string;
  showResponseCursor: boolean;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;

  /** Toggles the chat transcript flyout via the expand/collapse icon. */
  onToggleChat: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Canvas({
  RiveComponent,
  imageSearchOn,
  skillMapOn,
  screenShareOn,
  expandedPanel,
  onExpandPanel,
  chatOpen,
  responseBubbleText,
  showResponseCursor,
  inputValue,
  onInputChange,
  onSend,
  onToggleChat,
}: CanvasProps) {
  // ── Derive active side panels ──────────────────────────────────────────

  const activeSidePanels: Array<"image" | "skill" | "screen"> = [];
  if (imageSearchOn) activeSidePanels.push("image");
  if (skillMapOn) activeSidePanels.push("skill");
  if (screenShareOn) activeSidePanels.push("screen");

  const hasSidePanels = activeSidePanels.length > 0;

  // ── Hooks ──────────────────────────────────────────────────────────────

  const {
    exitingPanels,
    enteringPanels,
    isTransitioning,
    allActivePanels,
  } = usePanelTransitions(activeSidePanels, expandedPanel);

  const { getPanelStyle, canvasHeight } = useCanvasLayout({
    expandedPanel,
    activeSidePanels,
    allActivePanels,
    chatOpen,
  });

  // ── Helpers ────────────────────────────────────────────────────────────

  const isGalleryWithSides = !expandedPanel && hasSidePanels;

  /**
   * Build the CSS class string for a panel container.
   * - Non-rive panels get a border (hidden during transitions).
   * - Thumbnails and gallery-with-sides panels are clickable.
   */
  const getPanelClassName = (
    key: PanelKey,
    isThumbnail: boolean,
    isExiting: boolean,
  ): string => {
    const base = "absolute overflow-hidden rounded-lg transition-colors";

    // Border visibility (only for non-rive panels)
    const border =
      key !== "rive"
        ? isTransitioning || isExiting
          ? "border border-transparent bg-card/20"
          : "border border-border/50 bg-card/20"
        : "";

    // Pointer cursor for clickable states
    const cursor = isThumbnail || isGalleryWithSides ? "cursor-pointer" : "";

    return `${base} ${border} ${cursor}`;
  };

  /**
   * Build the inline style for a panel container.
   * Handles slide-in/out transforms and transition suppression.
   */
  const getPanelInlineStyle = (
    key: PanelKey,
    isExiting: boolean,
    isEntering: boolean,
  ): React.CSSProperties => {
    const positionStyle = getPanelStyle(key);

    // Side panels slide in from / out to the right
    const transform =
      key !== "rive"
        ? isExiting || isEntering
          ? "translateX(120%)"
          : "translateX(0)"
        : undefined;

    return {
      ...positionStyle,
      transform,
      opacity: isExiting ? 0 : 1,
      // Suppress transitions while entering so the panel appears off-screen
      // instantly, then the slide-in plays on the next frame
      transition: isEntering
        ? "none"
        : `${PANEL_TRANSITION}, transform 0.5s ease-in-out`,
    };
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">

      {/* ── Panel container ─────────────────────────────────────────── */}
      <div
        className="relative w-full px-4 pt-4"
        style={{ height: canvasHeight, transition: "height 0.7s ease-in-out" }}
      >
        <div className="relative mx-auto h-full w-full max-w-5xl">
          {allActivePanels.map((key) => {
            const isExiting = exitingPanels.has(key);
            const isEntering = enteringPanels.has(key);
            const isExpanded = expandedPanel === key;
            const isThumbnail = expandedPanel !== null && !isExpanded;

            return (
              <div
                key={key}
                className={getPanelClassName(key, isThumbnail, isExiting)}
                style={getPanelInlineStyle(key, isExiting, isEntering)}
                onClick={() => {
                  if (isExiting) return;
                  if (isThumbnail) onExpandPanel(key);
                  else if (isGalleryWithSides) onExpandPanel(key);
                }}
              >
                {/* Expand icon — visible in gallery mode on side panels */}
                {key !== "rive" && !expandedPanel && isGalleryWithSides && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-10 h-7 w-7 bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpandPanel(key);
                    }}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                )}

                {/* Minimize icon — visible when a side panel is expanded */}
                {key !== "rive" && isExpanded && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-10 h-8 w-8 bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExpandPanel(null);
                    }}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}

                {/* Panel content */}
                <div className="h-full w-full">
                  <PanelContent
                    panelKey={key}
                    expandedPanel={expandedPanel}
                    hasSidePanels={hasSidePanels}
                    RiveComponent={RiveComponent}
                  />
                </div>
              </div>
            );
          })}

          {/* Minimize button for Rive in expanded view (floating at bottom) */}
          {expandedPanel === "rive" && (
            <div
              className="absolute left-1/2 z-20 -translate-x-1/2 transition-all duration-700 ease-in-out"
              style={{ bottom: 8 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onExpandPanel(null)}
                title="Back to Gallery View"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Inline chat input (hidden when chat flyout is open) ──────── */}
      {!chatOpen && (
        <div className="flex w-full flex-shrink-0 items-center justify-center px-4 pb-4 pt-2">
          <InlineChatInput
            responseBubbleText={responseBubbleText}
            showCursor={showResponseCursor}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSend={onSend}
            onToggleChat={onToggleChat}
            isChatOpen={chatOpen}
          />
        </div>
      )}
    </div>
  );
}
