/**
 * =============================================================================
 * useCanvasLayout
 * =============================================================================
 *
 * Pure layout calculator — no side effects. Given the current panel state,
 * returns CSS styles for each panel and the overall canvas height.
 *
 * ## Layout modes
 *
 * ### Gallery mode (no expanded panel)
 *
 *   ┌────────────┬────────────┐
 *   │    Rive    │  Side #1   │  ← row 1 (50/50 split)
 *   └────────────┴────────────┘
 *   │     Side #2 (centred)   │  ← row 2 (only if 2+ side panels)
 *   └────────────────────────-┘
 *
 *   • 0 side panels → Rive fills 100 % width
 *   • 1 side panel  → 50/50 split, taller rows
 *   • 2+ side panels → 50/50 top row (shorter), second row below
 *
 * ### Expanded / Speaker mode (one panel expanded)
 *
 *   ┌──────┐ ┌──────┐          ← thumbnail strip (centred)
 *   └──────┘ └──────┘
 *   ┌──────────────────────────┐
 *   │     expanded panel       │  ← fills remaining height
 *   └──────────────────────────┘
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
  /** Returns absolute-position CSS for the given panel key. */
  getPanelStyle: (key: PanelKey) => React.CSSProperties;
  /** The animated height of the canvas container (px). */
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

  // Extra height added when the chat flyout is open (pushes panels taller)
  const extraH = chatOpen ? 100 : 0;

  // ── Position calculator ────────────────────────────────────────────────

  const getPanelStyle = (key: PanelKey): React.CSSProperties => {
    // ── EXPANDED / SPEAKER MODE ──────────────────────────────────────────
    if (expandedPanel) {
      // The expanded panel fills below the thumbnail strip
      if (key === expandedPanel) {
        return {
          top: THUMB_STRIP_HEIGHT,
          left: 0,
          width: "100%",
          height: `calc(100% - ${THUMB_STRIP_HEIGHT}px)`,
        };
      }

      // All other panels become thumbnails centred at the top
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

    // Rive (always row 1, left side — or full width if alone)
    if (key === "rive") {
      const h = hasSidePanels
        ? multiSide
          ? MULTI_PANEL_ROW_HEIGHT + extraH
          : ONE_SIDE_PANEL_HEIGHT + extraH
        : RIVE_SOLO_HEIGHT + extraH;

      return {
        top: 0,
        left: 0,
        width: hasSidePanels ? `calc(50% - ${GAP / 2}px)` : "100%",
        height: h,
      };
    }

    // Side panels
    const sideIdx = activeSidePanels.indexOf(key as SidePanelKey);

    // First side panel → row 1, right half
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

    // Additional side panels → row 2 (centred horizontally)
    const firstRowH = MULTI_PANEL_ROW_HEIGHT + extraH;
    const secondRowPanels = activeSidePanels.slice(1);
    const idxInRow = secondRowPanels.indexOf(key as SidePanelKey);
    const totalPctWidth = secondRowPanels.length * SECOND_ROW_WIDTH_PCT;
    const startPct =
      (100 -
        totalPctWidth -
        (secondRowPanels.length - 1) * SECOND_ROW_GAP_PCT) /
      2;

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

  const canvasHeight = expandedPanel
    ? EXPANDED_HEIGHT + extraH + clearance
    : hasSidePanels
      ? multiSide
        ? (MULTI_PANEL_ROW_HEIGHT + extraH) * 2 + GAP + clearance
        : ONE_SIDE_PANEL_HEIGHT + extraH + clearance
      : RIVE_SOLO_HEIGHT + extraH + clearance;

  return { getPanelStyle, canvasHeight };
}
