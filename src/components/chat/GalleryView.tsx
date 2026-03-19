/**
 * =============================================================================
 * GalleryView
 * =============================================================================
 *
 * The default panel layout on the /chat page.
 *
 * Layout behaviour:
 * ─────────────────
 * • **No side panels** — Rive fills the full width at 550×550px, centred.
 * • **1 side panel** — Rive (50%) + side panel (50%), both at 480px height.
 * • **2+ side panels** — Top row shrinks to 280px. The first active side panel
 *   sits next to Rive; remaining panels wrap into a second row below.
 *
 * All sizing transitions use a synchronised 1-second CSS ease-in-out so panels
 * slide smoothly when toggled on/off.
 *
 * Clicking any panel tile in gallery view switches to speaker view by setting
 * `expandedPanel` to that panel's key.
 *
 * IMPORTANT: The gallery view stays mounted even when speaker view is active.
 * It's hidden via `opacity-0` + `pointer-events-none` rather than unmounted.
 * This keeps the Rive canvas alive and prevents the animation from reloading.
 */

import React from "react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSearchPanel } from "@/components/chat/ImageSearchPanel";
import { SkillMapPanel } from "@/components/chat/SkillMapPanel";
import { InlineChatInput } from "@/components/chat/InlineChatInput";
import type { PanelKey } from "@/components/chat/types";
import screenShareImg from "@/assets/screen-share-preview.png";

interface GalleryViewProps {
  /** The primary Rive component (passed in so it's mounted persistently). */
  RiveComponent: React.ComponentType<{ className?: string }>;
  /** Whether any side panel is active. */
  hasSidePanels: boolean;
  /** Whether speaker view is currently shown (gallery is hidden). */
  isSpeakerView: boolean;
  /** Panel toggle states. */
  imageSearchOn: boolean;
  skillMapOn: boolean;
  screenShareOn: boolean;
  /** Callback to switch to speaker view for a specific panel. */
  onExpandPanel: (key: PanelKey) => void;
  /** Whether the chat flyout is open (hides the inline input). */
  chatOpen: boolean;
  /** Props forwarded to InlineChatInput. */
  responseBubbleText: string;
  showResponseCursor: boolean;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
}

export function GalleryView({
  RiveComponent,
  hasSidePanels,
  isSpeakerView,
  imageSearchOn,
  skillMapOn,
  screenShareOn,
  onExpandPanel,
  chatOpen,
  responseBubbleText,
  showResponseCursor,
  inputValue,
  onInputChange,
  onSend,
}: GalleryViewProps) {
  // -----------------------------------------------------------------------
  // Panel layout calculations
  // -----------------------------------------------------------------------

  /** How many side panels (excluding Rive) are currently visible. */
  const activeSidePanelCount = [imageSearchOn, skillMapOn, screenShareOn].filter(Boolean).length;

  /**
   * Height of the top row:
   * - No panels: 580px (Rive is large and centred)
   * - 1 panel: 480px
   * - 2+ panels: 280px (to make room for the second row)
   */
  const topRowHeight = hasSidePanels ? (activeSidePanelCount >= 2 ? 280 : 480) : 580;

  /** The first active side panel goes in the top row next to Rive. */
  const topSidePanel: PanelKey | null = imageSearchOn
    ? "image"
    : skillMapOn
    ? "skill"
    : screenShareOn
    ? "screen"
    : null;

  /** Any remaining side panels go in a second row below. */
  const secondRowPanels: Array<"image" | "skill" | "screen"> = [];
  if (imageSearchOn && topSidePanel !== "image") secondRowPanels.push("image");
  if (skillMapOn && topSidePanel !== "skill") secondRowPanels.push("skill");
  if (screenShareOn && topSidePanel !== "screen") secondRowPanels.push("screen");

  // -----------------------------------------------------------------------
  // Reusable panel tile renderer
  // -----------------------------------------------------------------------

  /**
   * Renders a clickable panel tile with an expand button.
   * Used for image, skill, and screen panels in both rows.
   */
  const renderSidePanelTile = (key: "image" | "skill" | "screen", style: React.CSSProperties) => (
    <div
      key={key}
      className="relative overflow-hidden rounded-lg border border-border/50 bg-card/20 transition-all duration-1000 ease-in-out cursor-pointer hover:border-secondary/50"
      style={style}
      onClick={() => onExpandPanel(key)}
    >
      {/* Expand button (top-right corner) */}
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

      {/* Panel content */}
      <div className="h-full w-full min-w-[300px]">
        {key === "image" && <ImageSearchPanel />}
        {key === "skill" && <SkillMapPanel />}
        {key === "screen" && (
          <img
            src={screenShareImg}
            alt="Screen share"
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div
      className={`flex min-h-0 flex-1 flex-col transition-opacity duration-300 ${
        hasSidePanels && isSpeakerView ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Panel grid */}
      <div className={`px-4 pt-6 ${hasSidePanels ? "flex-shrink-0" : "flex items-center justify-center"}`}>
        <div className="mx-auto w-full max-w-5xl">
          {/* Top row: Rive + first side panel */}
          <div
            className="flex gap-3 transition-all duration-1000 ease-in-out"
            style={{ height: topRowHeight }}
          >
            {/* Rive assistant tile */}
            <div
              className="overflow-hidden rounded-lg transition-[width] duration-1000 ease-in-out"
              style={{ width: hasSidePanels ? "50%" : "100%", flexShrink: 0 }}
              onClick={hasSidePanels ? () => onExpandPanel("rive") : undefined}
            >
              <div className={`flex h-full items-center justify-center p-2 ${hasSidePanels ? "cursor-pointer" : ""}`}>
                <div
                  className="h-full w-full transition-[max-width,max-height] duration-1000 ease-in-out"
                  style={{
                    maxHeight: hasSidePanels ? 320 : 550,
                    maxWidth: hasSidePanels ? 320 : 550,
                  }}
                >
                  <RiveComponent className="h-full w-full" />
                </div>
              </div>
            </div>

            {/* First side panel (if any) */}
            {topSidePanel && renderSidePanelTile(topSidePanel, { width: "50%", flexShrink: 0, opacity: 1 })}
          </div>

          {/* Second row: overflow panels when 2+ side panels are active */}
          {secondRowPanels.length > 0 && (
            <div className="mt-3 flex justify-center gap-3">
              {secondRowPanels.map((key) => (
                <div key={key} className="h-[280px] w-[55%]">
                  {renderSidePanelTile(key, { width: "100%", height: "100%", opacity: 1 })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inline chat input (hidden when the chat flyout is open) */}
      {!chatOpen && (
        <div className="flex flex-1 items-center justify-center px-4 py-2">
          <InlineChatInput
            responseBubbleText={responseBubbleText}
            showCursor={showResponseCursor}
            inputValue={inputValue}
            onInputChange={onInputChange}
            onSend={onSend}
          />
        </div>
      )}
    </div>
  );
}
