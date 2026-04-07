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
import { QuizPanel } from "@/components/chat/QuizPanel";
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
  quizIndex?: number;
  imageIndex?: number;
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

    // Scale the mute button based on layout state
    const btnSize = isThumbnail ? 'h-6 w-6' : hasSidePanels ? 'h-8 w-8' : 'h-10 w-10';
    const iconSize = isThumbnail ? 'h-3 w-3' : hasSidePanels ? 'h-4 w-4' : 'h-5 w-5';

    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className="relative h-full w-full transition-[max-width,max-height] duration-700 ease-in-out"
          style={{ maxHeight: maxSize, maxWidth: maxW }}
        >
          <RiveComponent className="h-full w-full" />

          {/* Mute agent icon — near top-right of Rive character */}
          {!isThumbnail && onToggleAgentMute && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-[8%] top-[15%] z-10 rounded-full border transition-all duration-700 ${btnSize} ${
                isAgentMuted
                  ? "border-destructive/30 bg-destructive/10"
                  : "border-border/50 bg-background/30 backdrop-blur-sm"
              }`}
              onClick={onToggleAgentMute}
              title={isAgentMuted ? "Unmute Agent" : "Mute Agent"}
            >
              {isAgentMuted ? (
                <VolumeX className={`${iconSize} text-destructive`} />
              ) : (
                <Volume2 className={`${iconSize} text-muted-foreground`} />
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
