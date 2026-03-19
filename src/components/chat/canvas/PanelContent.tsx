/**
 * =============================================================================
 * PanelContent
 * =============================================================================
 *
 * Renders the inner content for each panel type. Extracted from Canvas to
 * keep the main layout component focused on positioning logic.
 *
 * | Key      | Content                                              |
 * |----------|------------------------------------------------------|
 * | `rive`   | Animated AI assistant (Catbot). Scales via max-w/h.  |
 * | `image`  | Infographic image search panel.                      |
 * | `skill`  | React Flow skill map graph.                          |
 * | `screen` | Static screen share preview image.                   |
 */

import React from "react";
import { ImageSearchPanel } from "@/components/chat/ImageSearchPanel";
import { SkillMapPanel } from "@/components/chat/SkillMapPanel";
import type { PanelKey } from "@/components/chat/types";
import screenShareImg from "@/assets/screen-share-preview.png";
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
}

export function PanelContent({
  panelKey,
  expandedPanel,
  hasSidePanels,
  RiveComponent,
}: PanelContentProps) {
  // ── Rive assistant ─────────────────────────────────────────────────────
  if (panelKey === "rive") {
    const isThumbnail = expandedPanel !== null && expandedPanel !== "rive";
    const isExpanded = expandedPanel === "rive";

    // Pick the appropriate max size for the current layout state
    const maxSize = isThumbnail
      ? THUMB_H
      : isExpanded
        ? RIVE_MAX_EXPANDED
        : hasSidePanels
          ? RIVE_MAX_WITH_SIDES
          : RIVE_MAX_SOLO;

    const maxW = isThumbnail ? THUMB_W : maxSize;

    return (
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="h-full w-full transition-[max-width,max-height] duration-700 ease-in-out"
          style={{ maxHeight: maxSize, maxWidth: maxW }}
        >
          <RiveComponent className="h-full w-full" />
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

  // ── Screen share panel ─────────────────────────────────────────────────
  return (
    <img
      src={screenShareImg}
      alt="Screen share"
      className="h-full w-full object-cover"
    />
  );
}
