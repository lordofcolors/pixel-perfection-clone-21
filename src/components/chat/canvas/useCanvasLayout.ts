/**
 * =============================================================================
 * useCanvasLayout
 * =============================================================================
 *
 * Pure layout calculator. Given the current panel state, returns CSS styles
 * for each panel and the overall canvas height.
 *
 * ## Layout modes
 *
 * ### Gallery mode (no expanded panel)
 *
 *   0 sides  → Rive fills 100% width
 *   1 side   → 50/50 split, taller rows
 *   2 sides  → 50/50 top row + centred second row
 *   3 sides  → Rive + side1 + side2 as 33/33/33 top row, side3 centred below
 *   4 sides  → Rive + side1 + side2 as 33/33/33 top row, side3 + side4 below
 *
 * ### Expanded / Speaker mode
 *
 *   Thumbnail strip at top, expanded panel fills remaining height.
 */

import type React from "react";
import type { PanelKey } from "@/components/chat/types";
import {
  THUMB_W,
  THUMB_H,
  THUMB_GAP,
  THUMB_STRIP_HEIGHT,
  GAP,
  RIVE_SOLO_HEIGHT,
  ONE_SIDE_PANEL_HEIGHT,
  MULTI_PANEL_ROW_HEIGHT,
  EXPANDED_HEIGHT,
  CLEARANCE_MULTI,
  CLEARANCE_SINGLE,
  CLEARANCE_NONE,
  SECOND_ROW_WIDTH_PCT,
  SECOND_ROW_GAP_PCT,
} from "./constants";

type SidePanelKey = "image" | "skill" | "screen" | "webcam";

interface CanvasLayoutInput {
  expandedPanel: PanelKey | null;
  activeSidePanels: SidePanelKey[];
  allActivePanels: PanelKey[];
  chatOpen: boolean;
}

interface CanvasLayoutOutput {
  getPanelStyle: (key: PanelKey) => React.CSSProperties;
  canvasHeight: number;
}

export function useCanvasLayout({
  expandedPanel,
  activeSidePanels,
  allActivePanels,
  chatOpen,
}: CanvasLayoutInput): CanvasLayoutOutput {
  const hasSidePanels = activeSidePanels.length > 0;
  const multiSide = activeSidePanels.length >= 2;
  // 3+ side panels → use 3-column top row (rive + 2 sides)
  const manyPanels = activeSidePanels.length >= 3;

  const extraH = chatOpen ? 100 : 0;

  // ── Position calculator ────────────────────────────────────────────────

  const getPanelStyle = (key: PanelKey): React.CSSProperties => {
    // ── EXPANDED / SPEAKER MODE ──────────────────────────────────────────
    if (expandedPanel) {
      if (key === expandedPanel) {
        return {
          top: THUMB_STRIP_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100% - ${THUMB_STRIP_HEIGHT}px)`,
        };
      }

      const nonExpanded = allActivePanels.filter((k) => k !== expandedPanel);
      const idx = nonExpanded.indexOf(key);
      const totalW =
        nonExpanded.length * THUMB_W + (nonExpanded.length - 1) * THUMB_GAP;
      const offsetX = idx * (THUMB_W + THUMB_GAP);

      return {
        top: 4,
        left: `calc(50% - ${totalW / 2}px + ${offsetX}px)`,
        width: THUMB_W,
        height: THUMB_H,
      };
    }

    // ── GALLERY MODE ─────────────────────────────────────────────────────

    const rowH = hasSidePanels
      ? multiSide
        ? MULTI_PANEL_ROW_HEIGHT + extraH
        : ONE_SIDE_PANEL_HEIGHT + extraH
      : RIVE_SOLO_HEIGHT + extraH;

    // ── 3+ side panels: 3-column top row ─────────────────────────────────
    if (manyPanels) {
      // Top row: rive, side[0], side[1] — each ~33%
      const colW = `calc(${100 / 3}% - ${(GAP * 2) / 3}px)`;

      if (key === "rive") {
        return { top: 0, left: 0, width: colW, height: rowH };
      }

      const sideIdx = activeSidePanels.indexOf(key as SidePanelKey);

      // First two side panels → top row columns 2 & 3
      if (sideIdx === 0) {
        return {
          top: 0,
          left: `calc(${100 / 3}% + ${GAP / 3}px)`,
          width: colW,
          height: rowH,
        };
      }
      if (sideIdx === 1) {
        return {
          top: 0,
          left: `calc(${200 / 3}% + ${(GAP * 2) / 3}px)`,
          width: colW,
          height: rowH,
        };
      }

      // Additional side panels → row 2 (centred horizontally)
      const firstRowH = rowH;
      const secondRowPanels = activeSidePanels.slice(2);
      const idxInRow = secondRowPanels.indexOf(key as SidePanelKey);
      const panelWidthPct = secondRowPanels.length === 1 ? SECOND_ROW_WIDTH_PCT : 48;
      const gapPct = secondRowPanels.length === 1 ? 0 : SECOND_ROW_GAP_PCT;
      const totalPctWidth = secondRowPanels.length * panelWidthPct + (secondRowPanels.length - 1) * gapPct;
      const startPct = (100 - totalPctWidth) / 2;

      return {
        top: firstRowH + GAP,
        left: `${startPct + idxInRow * (panelWidthPct + gapPct)}%`,
        width: `${panelWidthPct}%`,
        height: MULTI_PANEL_ROW_HEIGHT + extraH,
      };
    }

    // ── 0–2 side panels: original 2-column layout ────────────────────────

    if (key === "rive") {
      return {
        top: 0,
        left: 0,
        width: hasSidePanels ? `calc(50% - ${GAP / 2}px)` : "100%",
        height: rowH,
      };
    }

    const sideIdx = activeSidePanels.indexOf(key as SidePanelKey);

    if (sideIdx === 0) {
      const h = multiSide
        ? MULTI_PANEL_ROW_HEIGHT + extraH
        : ONE_SIDE_PANEL_HEIGHT + extraH;

      return {
        top: 0,
        left: `calc(50% + ${GAP / 2}px)`,
        width: `calc(50% - ${GAP / 2}px)`,
        height: h,
      };
    }

    // Second row (for exactly 2 side panels)
    const firstRowH = MULTI_PANEL_ROW_HEIGHT + extraH;
    const secondRowPanels = activeSidePanels.slice(1);
    const idxInRow = secondRowPanels.indexOf(key as SidePanelKey);
    const totalPctWidth = secondRowPanels.length * SECOND_ROW_WIDTH_PCT;
    const startPct =
      (100 - totalPctWidth - (secondRowPanels.length - 1) * SECOND_ROW_GAP_PCT) / 2;

    return {
      top: firstRowH + GAP,
      left: `${startPct + idxInRow * (SECOND_ROW_WIDTH_PCT + SECOND_ROW_GAP_PCT)}%`,
      width: `${SECOND_ROW_WIDTH_PCT}%`,
      height: MULTI_PANEL_ROW_HEIGHT + extraH,
    };
  };

  // ── Canvas container height ────────────────────────────────────────────

  const clearance = hasSidePanels
    ? multiSide
      ? CLEARANCE_MULTI
      : CLEARANCE_SINGLE
    : CLEARANCE_NONE;

  let canvasHeight: number;

  if (expandedPanel) {
    canvasHeight = EXPANDED_HEIGHT + extraH + clearance;
  } else if (manyPanels) {
    // 3+ side panels: always 2 rows
    const topRowH = MULTI_PANEL_ROW_HEIGHT + extraH;
    const bottomRowH = MULTI_PANEL_ROW_HEIGHT + extraH;
    canvasHeight = topRowH + GAP + bottomRowH + clearance;
  } else if (multiSide) {
    canvasHeight = (MULTI_PANEL_ROW_HEIGHT + extraH) * 2 + GAP + clearance;
  } else if (hasSidePanels) {
    canvasHeight = ONE_SIDE_PANEL_HEIGHT + extraH + clearance;
  } else {
    canvasHeight = RIVE_SOLO_HEIGHT + extraH + clearance;
  }

  return { getPanelStyle, canvasHeight };
}
