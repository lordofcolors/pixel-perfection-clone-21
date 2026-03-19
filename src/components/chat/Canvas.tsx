/**
 * =============================================================================
 * Canvas
 * =============================================================================
 *
 * A single layout component that replaces the old GalleryView + SpeakerView
 * approach. All panels are rendered once and repositioned via CSS transitions
 * — no remounting, no duplicating Rive instances.
 *
 * Behaviour:
 * ──────────
 * • **No expanded panel** (gallery mode) — panels sit side-by-side in a grid.
 *   Rive takes 50 % when side panels are active, 100 % when alone.
 * • **Expanded panel** — the chosen panel grows to fill the main area while
 *   all others shrink to thumbnail chips at the top. Clicking a thumbnail
 *   expands that panel instead; clicking the minimize icon returns to gallery.
 *
 * Every panel div is `position: absolute` inside a single relative container.
 * Transitions on `top / left / width / height` produce a smooth resize effect
 * with no DOM re-ordering or remounting.
 */

import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSearchPanel } from "@/components/chat/ImageSearchPanel";
import { SkillMapPanel } from "@/components/chat/SkillMapPanel";
import { InlineChatInput } from "@/components/chat/InlineChatInput";
import type { PanelKey } from "@/components/chat/types";
import screenShareImg from "@/assets/screen-share-preview.png";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CanvasProps {
  RiveComponent: React.ComponentType<{ className?: string }>;
  imageSearchOn: boolean;
  skillMapOn: boolean;
  screenShareOn: boolean;
  expandedPanel: PanelKey | null;
  onExpandPanel: (key: PanelKey | null) => void;
  chatOpen: boolean;
  responseBubbleText: string;
  showResponseCursor: boolean;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onToggleChat: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const THUMB_W = 112;
const THUMB_H = 68;
const THUMB_GAP = 6;
const THUMB_STRIP_HEIGHT = THUMB_H + 8; // 4px top padding + thumb + 4px bottom
const GAP = 12;
const TRANSITION = "top 0.7s ease-in-out, left 0.7s ease-in-out, width 0.7s ease-in-out, height 0.7s ease-in-out, opacity 0.7s ease-in-out";

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
  // -----------------------------------------------------------------------
  // Active panels
  // -----------------------------------------------------------------------

  const activeSidePanels: Array<"image" | "skill" | "screen"> = [];
  if (imageSearchOn) activeSidePanels.push("image");
  if (skillMapOn) activeSidePanels.push("skill");
  if (screenShareOn) activeSidePanels.push("screen");

  const hasSidePanels = activeSidePanels.length > 0;

  // Track exiting panels for slide-out animation
  const [exitingPanels, setExitingPanels] = useState<Set<PanelKey>>(new Set());
  // Track entering panels — start off-screen, then animate to final position
  const [enteringPanels, setEnteringPanels] = useState<Set<PanelKey>>(new Set());
  const prevSidePanelsRef = useRef<Array<"image" | "skill" | "screen">>(activeSidePanels);

  useEffect(() => {
    const prev = prevSidePanelsRef.current;
    const removed = prev.filter((p) => !activeSidePanels.includes(p));
    const added = activeSidePanels.filter((p) => !prev.includes(p));
    prevSidePanelsRef.current = activeSidePanels;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Exit animation: keep panel mounted, slide it out, then unmount
    if (removed.length > 0) {
      setExitingPanels((s) => {
        const next = new Set(s);
        removed.forEach((p) => next.add(p));
        return next;
      });
      timers.push(setTimeout(() => {
        setExitingPanels((s) => {
          const next = new Set(s);
          removed.forEach((p) => next.delete(p));
          return next;
        });
      }, 500));
    }

    // Enter animation: render off-screen first, then after a frame settle into position
    if (added.length > 0) {
      // Mark as entering (off-screen) immediately
      setEnteringPanels(new Set(added));
      // After a brief delay let the browser paint the off-screen state, then remove entering flag to trigger slide-in
      timers.push(setTimeout(() => {
        setEnteringPanels(new Set());
      }, 50));
    }

    return () => timers.forEach(clearTimeout);
  }, [activeSidePanels.join(",")]);

  // Combine active + exiting for rendering
  const allActivePanels: PanelKey[] = [
    "rive",
    ...activeSidePanels,
    ...Array.from(exitingPanels).filter((p) => !activeSidePanels.includes(p as "image" | "skill" | "screen")),
  ];

  const extraH = chatOpen ? 100 : 0;

  // Track transitioning state to hide borders during resize animations
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>();
  const prevExpandedPanel = useRef(expandedPanel);
  const prevActivePanelsKey = useRef(activeSidePanels.join(","));

  const activePanelsKey = activeSidePanels.join(",");

  useEffect(() => {
    if (prevExpandedPanel.current !== expandedPanel || prevActivePanelsKey.current !== activePanelsKey) {
      prevExpandedPanel.current = expandedPanel;
      prevActivePanelsKey.current = activePanelsKey;
      setIsTransitioning(true);
      clearTimeout(transitionTimer.current);
      transitionTimer.current = setTimeout(() => setIsTransitioning(false), 750);
    }
    return () => clearTimeout(transitionTimer.current);
  }, [expandedPanel, activePanelsKey]);

  // -----------------------------------------------------------------------
  // Position calculator
  // -----------------------------------------------------------------------

  const getPanelStyle = (key: PanelKey): React.CSSProperties => {
    if (expandedPanel) {
      // ── EXPANDED MODE ──
      if (key === expandedPanel) {
        return {
          top: THUMB_STRIP_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100% - ${THUMB_STRIP_HEIGHT}px)`,
        };
      }
      // Thumbnail
      const nonExpanded = allActivePanels.filter((k) => k !== expandedPanel);
      const idx = nonExpanded.indexOf(key);
      const totalW = nonExpanded.length * THUMB_W + (nonExpanded.length - 1) * THUMB_GAP;
      const offsetX = idx * (THUMB_W + THUMB_GAP);
      return {
        top: 4,
        left: `calc(50% - ${totalW / 2}px + ${offsetX}px)`,
        width: THUMB_W,
        height: THUMB_H,
      };
    }

    // ── GALLERY MODE ──
    if (key === "rive") {
      const h = hasSidePanels
        ? activeSidePanels.length >= 2
          ? 280 + extraH
          : 480 + extraH
        : 580 + extraH;
      return {
        top: 0,
        left: 0,
        width: hasSidePanels ? `calc(50% - ${GAP / 2}px)` : "100%",
        height: h,
      };
    }

    // Side panels
    const sideIdx = activeSidePanels.indexOf(key as "image" | "skill" | "screen");
    if (sideIdx === 0) {
      // First side panel — top right
      const h = activeSidePanels.length >= 2 ? 280 + extraH : 480 + extraH;
      return {
        top: 0,
        left: `calc(50% + ${GAP / 2}px)`,
        width: `calc(50% - ${GAP / 2}px)`,
        height: h,
      };
    }

    // Second row panels
    const firstRowH = 280 + extraH;
    const secondRowPanels = activeSidePanels.slice(1);
    const idxInRow = secondRowPanels.indexOf(key as "image" | "skill" | "screen");
    const panelWidthPct = 55;
    const totalPctWidth = secondRowPanels.length * panelWidthPct;
    const startPct = (100 - totalPctWidth - (secondRowPanels.length - 1) * 1.2) / 2;
    return {
      top: firstRowH + GAP,
      left: `${startPct + idxInRow * (panelWidthPct + 1.2)}%`,
      width: `${panelWidthPct}%`,
      height: 280 + extraH,
    };
  };

  // -----------------------------------------------------------------------
  // Panel content renderer
  // -----------------------------------------------------------------------

  const renderContent = (key: PanelKey) => {
    if (key === "rive") {
      const isThumbnail = expandedPanel !== null && expandedPanel !== "rive";
      return (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="h-full w-full transition-[max-width,max-height] duration-700 ease-in-out"
            style={{
              maxHeight: isThumbnail ? THUMB_H : expandedPanel === "rive" ? 480 : hasSidePanels ? 320 : 550,
              maxWidth: isThumbnail ? THUMB_W : expandedPanel === "rive" ? 480 : hasSidePanels ? 320 : 550,
            }}
          >
            <RiveComponent className="h-full w-full" />
          </div>
        </div>
      );
    }

    const isExpanded = expandedPanel === key;
    if (key === "image") {
      return isExpanded ? (
        <div className="h-full overflow-auto p-4">
          <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-md">
            <ImageSearchPanel className="w-full" variant="expanded" />
          </div>
        </div>
      ) : (
        <ImageSearchPanel />
      );
    }

    if (key === "skill") {
      return <SkillMapPanel hideTitle={expandedPanel !== null && expandedPanel !== "skill"} />;
    }

    // screen
    return (
      <img
        src={screenShareImg}
        alt="Screen share"
        className="h-full w-full object-cover"
      />
    );
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Panel container */}
      <div className="relative flex-1 px-4 pt-4">
        <div className="relative mx-auto h-full w-full max-w-5xl">
          {allActivePanels.map((key) => {
            const isExiting = exitingPanels.has(key);
            const isEntering = enteringPanels.has(key);
            const style = getPanelStyle(key);
            const isExpanded = expandedPanel === key;
            const isThumbnail = expandedPanel !== null && !isExpanded;
            const isGalleryWithSides = !expandedPanel && hasSidePanels;

            // Slide transform for enter/exit
            const slideTransform = isExiting
              ? "translateX(120%)"
              : isEntering
                ? "translateX(120%)"
                : "translateX(0)";

            return (
              <div
                key={key}
                className={`absolute overflow-hidden rounded-lg transition-colors ${
                  key !== "rive" && !isTransitioning && !isExiting ? "border border-border/50 bg-card/20" : ""
                } ${
                  key !== "rive" && (isTransitioning || isExiting) ? "border border-transparent bg-card/20" : ""
                } ${
                  isThumbnail
                    ? `cursor-pointer`
                    : ""
                } ${
                  isGalleryWithSides ? "cursor-pointer" : ""
                }`}
                style={{
                  ...style,
                  transform: key !== "rive" ? slideTransform : undefined,
                  opacity: isExiting ? 0 : 1,
                  // Suppress transition when entering so element appears off-screen instantly
                  transition: isEntering
                    ? "none"
                    : `${TRANSITION}, transform 0.5s ease-in-out`,
                }}
                onClick={() => {
                  if (isExiting) return;
                  if (isThumbnail) onExpandPanel(key);
                  else if (isGalleryWithSides) onExpandPanel(key);
                }}
              >
                {/* Expand button (gallery mode, side panels only) */}
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

                {/* Minimize button (expanded, non-rive panels) */}
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
                  {renderContent(key)}
                </div>
              </div>
            );
          })}

          {/* Minimize button for Rive expanded view (floating below) */}
          {expandedPanel === "rive" && (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-in-out"
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

      {/* Inline chat input (hidden when chat flyout is open) */}
      {!chatOpen && (
        <div className="flex flex-shrink-0 items-center justify-center px-4 py-2">
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
