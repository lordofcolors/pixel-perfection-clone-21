/**
 * =============================================================================
 * Canvas
 * =============================================================================
 *
 * Main layout component for /chat. Renders all panels using absolute
 * positioning and CSS transitions.
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

interface CanvasProps {
  RiveComponent: React.ComponentType<{ className?: string }>;
  imageSearchOn: boolean;
  skillMapOn: boolean;
  screenShareOn: boolean;
  webcamOn: boolean;
  expandedPanel: PanelKey | null;
  onExpandPanel: (key: PanelKey | null) => void;
  chatOpen: boolean;
  responseBubbleText: string;
  showResponseCursor: boolean;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onToggleChat: () => void;
  isAgentMuted: boolean;
  onToggleAgentMute: () => void;
  onSendEmoji?: (emoji: string) => void;
  onToggleImageSearch?: () => void;
  onToggleSkillMap?: () => void;
  onQuizMe?: () => void;
}

export function Canvas({
  RiveComponent,
  imageSearchOn,
  skillMapOn,
  screenShareOn,
  webcamOn,
  expandedPanel,
  onExpandPanel,
  chatOpen,
  responseBubbleText,
  showResponseCursor,
  inputValue,
  onInputChange,
  onSend,
  onToggleChat,
  isAgentMuted,
  onToggleAgentMute,
  onSendEmoji,
  onToggleImageSearch,
  onToggleSkillMap,
  onQuizMe,
}: CanvasProps) {
  // ── Derive active side panels ──────────────────────────────────────────

  const activeSidePanels: Array<"image" | "skill" | "screen" | "webcam"> = [];
  if (imageSearchOn) activeSidePanels.push("image");
  if (skillMapOn) activeSidePanels.push("skill");
  if (screenShareOn) activeSidePanels.push("screen");
  if (webcamOn) activeSidePanels.push("webcam");

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

  const getPanelClassName = (
    key: PanelKey,
    isThumbnail: boolean,
    isExiting: boolean,
  ): string => {
    const base = "absolute overflow-hidden rounded-lg transition-colors";
    const border =
      key !== "rive"
        ? isTransitioning || isExiting
          ? "border border-transparent bg-card/20"
          : "border border-border/50 bg-card/20"
        : "";
    const cursor = isThumbnail || isGalleryWithSides ? "cursor-pointer" : "";
    return `${base} ${border} ${cursor}`;
  };

  const getPanelInlineStyle = (
    key: PanelKey,
    isExiting: boolean,
    isEntering: boolean,
  ): React.CSSProperties => {
    const positionStyle = getPanelStyle(key);
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
      transition: isEntering
        ? "none"
        : `${PANEL_TRANSITION}, transform 0.5s ease-in-out`,
    };
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
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

                <div className="h-full w-full">
                  <PanelContent
                    panelKey={key}
                    expandedPanel={expandedPanel}
                    hasSidePanels={hasSidePanels}
                    RiveComponent={RiveComponent}
                    isAgentMuted={isAgentMuted}
                    onToggleAgentMute={onToggleAgentMute}
                  />
                </div>
              </div>
            );
          })}

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
