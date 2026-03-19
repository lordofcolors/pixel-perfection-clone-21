/**
 * =============================================================================
 * SpeakerView
 * =============================================================================
 *
 * An absolute overlay that takes over the main content area when a panel is
 * "expanded" (clicked or maximised from gallery view).
 *
 * Layout:
 * ───────
 * ┌─────────────────────────────────────────────┐
 * │  [thumb] [thumb] [thumb]    ← thumbnail strip│
 * │                                              │
 * │        ┌──────────────────┐                  │
 * │        │  Expanded panel  │                  │
 * │        │  (or Rive)       │                  │
 * │        └──────────────────┘                  │
 * │                                              │
 * │        [  inline chat input  ]               │
 * └─────────────────────────────────────────────┘
 *
 * - The thumbnail strip at the top shows small previews of all active panels.
 *   Clicking a thumbnail switches the expanded view to that panel.
 * - A minimize button (↙) returns to gallery view by clearing `expandedPanel`.
 * - The inline chat input is shown at the bottom (hidden if the chat flyout
 *   is open instead).
 *
 * IMPORTANT: This component is only rendered when `hasSidePanels && expandedPanel`
 * is truthy. The underlying gallery view stays mounted but hidden.
 */

import React from "react";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSearchPanel } from "@/components/chat/ImageSearchPanel";
import { SkillMapPanel } from "@/components/chat/SkillMapPanel";
import { InlineChatInput } from "@/components/chat/InlineChatInput";
import type { PanelKey } from "@/components/chat/types";
import screenShareImg from "@/assets/screen-share-preview.png";

interface PanelInfo {
  key: PanelKey;
  active: boolean;
}

interface SpeakerViewProps {
  /** The primary Rive component. */
  RiveComponent: React.ComponentType<{ className?: string }>;
  /** The thumbnail Rive component (separate instance for the strip). */
  ThumbRiveComponent: React.ComponentType<{ className?: string }>;
  /** List of all panels with their active state. */
  panels: PanelInfo[];
  /** Currently expanded panel key. */
  expandedPanel: PanelKey;
  /** Callback to switch expanded panel or clear it (null = gallery). */
  onExpandPanel: (key: PanelKey | null) => void;
  /** Whether the chat flyout is open (hides inline input). */
  chatOpen: boolean;
  /** Props forwarded to InlineChatInput. */
  responseBubbleText: string;
  showResponseCursor: boolean;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
}

export function SpeakerView({
  RiveComponent,
  ThumbRiveComponent,
  panels,
  expandedPanel,
  onExpandPanel,
  chatOpen,
  responseBubbleText,
  showResponseCursor,
  inputValue,
  onInputChange,
  onSend,
}: SpeakerViewProps) {
  /** Only show panels that are currently toggled on. */
  const activePanels = panels.filter((p) => p.active);

  // -----------------------------------------------------------------------
  // Thumbnail renderer (small previews in the top strip)
  // -----------------------------------------------------------------------

  const renderThumbnail = (key: PanelKey) => {
    if (key === "rive") {
      return (
        <div className="flex h-full w-full items-center justify-center p-1">
          <ThumbRiveComponent className="h-full w-full" />
        </div>
      );
    }

    if (key === "image") {
      return (
        <div className="h-full w-full overflow-hidden">
          <ImageSearchPanel className="pointer-events-none" />
        </div>
      );
    }

    if (key === "screen") {
      return (
        <div className="h-full w-full overflow-hidden">
          <img
            src={screenShareImg}
            alt="Screen share"
            className="h-full w-full object-cover pointer-events-none"
          />
        </div>
      );
    }

    // Skill map thumbnail
    return (
      <div className="relative h-full w-full overflow-hidden">
        <SkillMapPanel className="pointer-events-none" hideTitle />
      </div>
    );
  };

  // -----------------------------------------------------------------------
  // Expanded content renderer (main area below thumbnails)
  // -----------------------------------------------------------------------

  const renderExpandedContent = (key: PanelKey) => {
    if (key === "image") {
      return (
        <div className="h-full overflow-auto p-4">
          <div className="mx-auto w-full max-w-2xl max-h-full overflow-hidden rounded-md">
            <ImageSearchPanel className="w-full" variant="expanded" />
          </div>
        </div>
      );
    }

    if (key === "screen") {
      return (
        <div className="h-full overflow-auto p-4">
          <div className="mx-auto w-full max-w-2xl max-h-full overflow-hidden rounded-md">
            <img src={screenShareImg} alt="Screen share" className="w-full h-auto rounded-md" />
          </div>
        </div>
      );
    }

    if (key === "skill") {
      return <SkillMapPanel />;
    }

    // "rive" is handled separately below (not inside the bordered container)
    return null;
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="absolute inset-0 z-10 flex min-h-0 flex-col bg-background">
      {/* ── Thumbnail strip ── */}
      <div className="flex justify-center gap-1.5 px-4 pt-1.5">
        {activePanels.map((panel) => (
          <div
            key={panel.key}
            className={`h-[68px] w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-300 ${
              expandedPanel === panel.key
                ? "border-secondary bg-card/40"
                : "border-border/40 bg-card/20 hover:border-secondary/40"
            }`}
            onClick={() => onExpandPanel(panel.key)}
          >
            {renderThumbnail(panel.key)}
          </div>
        ))}
      </div>

      {/* ── Expanded content area ── */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Rive expanded (no border container — just centred) */}
        {expandedPanel === "rive" && (
          <div className="flex flex-1 items-center justify-center px-4 py-1.5">
            <div className="h-full w-full max-h-[380px] max-w-[380px]">
              <RiveComponent className="h-full w-full" />
            </div>
          </div>
        )}

        {/* Non-Rive expanded (inside a bordered, scrollable container) */}
        {expandedPanel !== "rive" && (
          <div
            className="flex min-h-0 px-4 py-1.5"
            style={{ flex: "1 1 0%", maxHeight: "calc(100% - 100px)" }}
          >
            <div className="relative mx-auto h-full w-full max-w-3xl overflow-auto rounded-lg border border-border/40 bg-card/20">
              {/* Minimize button → back to gallery view */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 h-8 w-8 bg-background/50 text-muted-foreground backdrop-blur-sm hover:bg-background/80 hover:text-foreground"
                onClick={() => onExpandPanel(null)}
                title="Back to Gallery View"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <div className="h-full w-full">{renderExpandedContent(expandedPanel)}</div>
            </div>
          </div>
        )}

        {/* Minimize button for Rive expanded view */}
        {expandedPanel === "rive" && (
          <div className="flex justify-center pb-1">
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

        {/* Inline chat input (shown when chat flyout is closed) */}
        {!chatOpen && (
          <div className="flex-shrink-0 flex items-center justify-center px-4 py-2">
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
    </div>
  );
}
