/**
 * =============================================================================
 * PanelContent
 * =============================================================================
 *
 * Renders the inner content for each panel type.
 *
 * | Key      | Content                                              |
 * |----------|------------------------------------------------------|
 * | `rive`   | Animated AI assistant (Catbot) + mute agent icon.    |
 * | `image`  | Infographic image search panel.                      |
 * | `skill`  | React Flow skill map graph.                          |
 * | `screen` | Static screen share preview image.                   |
 * | `webcam` | Webcam feed placeholder image.                       |
 */

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageSearchPanel } from "@/components/chat/ImageSearchPanel";
import { SkillMapPanel } from "@/components/chat/SkillMapPanel";
import type { PanelKey } from "@/components/chat/types";
import screenShareImg from "@/assets/screen-share-preview.png";
import webcamPlaceholder from "@/assets/webcam-placeholder.png";
import {
  THUMB_W,
  THUMB_H,
  RIVE_MAX_SOLO,
  RIVE_MAX_WITH_SIDES,
  RIVE_MAX_EXPANDED,
} from "./constants";

interface PanelContentProps {
  panelKey: PanelKey;
  expandedPanel: PanelKey | null;
  hasSidePanels: boolean;
  RiveComponent: React.ComponentType<{ className?: string }>;
  isAgentMuted?: boolean;
  onToggleAgentMute?: () => void;
}

export function PanelContent({
  panelKey,
  expandedPanel,
  hasSidePanels,
  RiveComponent,
  isAgentMuted = false,
  onToggleAgentMute,
}: PanelContentProps) {
  // ── Rive assistant ─────────────────────────────────────────────────────
  if (panelKey === "rive") {
    const isThumbnail = expandedPanel !== null && expandedPanel !== "rive";
    const isExpanded = expandedPanel === "rive";

    const maxSize = isThumbnail
      ? THUMB_H
      : isExpanded
        ? RIVE_MAX_EXPANDED
        : hasSidePanels
          ? RIVE_MAX_WITH_SIDES
          : RIVE_MAX_SOLO;

    const maxW = isThumbnail ? THUMB_W : maxSize;

    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className="relative h-full w-full transition-[max-width,max-height] duration-700 ease-in-out"
          style={{ maxHeight: maxSize, maxWidth: maxW }}
        >
          <RiveComponent className="h-full w-full" />

          {/* Mute agent icon — top-right, hugging the Rive animation */}
          {!isThumbnail && onToggleAgentMute && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-0 top-[10%] z-10 h-8 w-8 rounded-full border ${
                isAgentMuted
                  ? "border-destructive/30 bg-destructive/10"
                  : "border-border/50 bg-background/30 backdrop-blur-sm"
              }`}
              onClick={onToggleAgentMute}
              title={isAgentMuted ? "Unmute Agent" : "Mute Agent"}
            >
              {isAgentMuted ? (
                <VolumeX className="h-4 w-4 text-destructive" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Image search panel ─────────────────────────────────────────────────
  if (panelKey === "image") {
    const isExpanded = expandedPanel === "image";
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

  // ── Skill map panel ────────────────────────────────────────────────────
  if (panelKey === "skill") {
    const hideTitle = expandedPanel !== null && expandedPanel !== "skill";
    return <SkillMapPanel hideTitle={hideTitle} />;
  }

  // ── Webcam panel ───────────────────────────────────────────────────────
  if (panelKey === "webcam") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black/20">
        <img
          src={webcamPlaceholder}
          alt="Webcam feed"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // ── Screen share panel ─────────────────────────────────────────────────
  return (
    <img
      src={screenShareImg}
      alt="Screen share"
      className="h-full w-full object-cover"
    />
  );
}
