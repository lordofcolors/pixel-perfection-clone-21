/**
 * =============================================================================
 * Canvas Layout Constants
 * =============================================================================
 *
 * All magic numbers for the Canvas layout live here. Changing a value in this
 * file updates every panel/thumbnail/transition that references it.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  EXPANDED MODE — thumbnail strip at the top                        │
 * │  ┌──────┐ ┌──────┐   ← THUMB_W × THUMB_H, spaced THUMB_GAP apart │
 * │  └──────┘ └──────┘                                                 │
 * │  ┌────────────────────────────────────────────────────────────────┐ │
 * │  │                    expanded panel                              │ │
 * │  └────────────────────────────────────────────────────────────────┘ │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  GALLERY MODE — side-by-side grid                                  │
 * │  ┌───────────────┐  GAP  ┌───────────────┐                        │
 * │  │   Rive (50%)  │ ←──→  │  Side panel   │                        │
 * │  └───────────────┘       └───────────────┘                        │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// ---------------------------------------------------------------------------
// Thumbnail strip (expanded / speaker mode)
// ---------------------------------------------------------------------------

/** Width of a thumbnail chip (px). */
export const THUMB_W = 112;

/** Height of a thumbnail chip (px). */
export const THUMB_H = 68;

/** Horizontal gap between thumbnail chips (px). */
export const THUMB_GAP = 6;

/** Total height reserved for the thumbnail strip, including padding (px). */
export const THUMB_STRIP_HEIGHT = THUMB_H + 8;

// ---------------------------------------------------------------------------
// Gallery grid
// ---------------------------------------------------------------------------

/** Gap between side-by-side panels in gallery mode (px). */
export const GAP = 12;

// ---------------------------------------------------------------------------
// Panel heights by layout state (px, before `extraH` adjustment)
// ---------------------------------------------------------------------------

/**
 * How tall the Rive panel is when displayed alone (no side panels).
 * This is the "hero" view — the assistant fills the stage.
 */
export const RIVE_SOLO_HEIGHT = 540;

/**
 * Row height when one side panel is active.
 * Both Rive and the side panel share this height.
 */
export const ONE_SIDE_PANEL_HEIGHT = 440;

/**
 * Row height when two or more side panels are active.
 * The first row (Rive + first side panel) uses this, and second-row panels
 * also use this height.
 */
export const MULTI_PANEL_ROW_HEIGHT = 280;

/** Height of the expanded view (speaker mode). */
export const EXPANDED_HEIGHT = 560;

// ---------------------------------------------------------------------------
// Bottom clearance — space between panels and the subtitle/input stack
// ---------------------------------------------------------------------------

/** Extra bottom clearance when two+ side panels are visible (px). */
export const CLEARANCE_MULTI = 120;

/** Extra bottom clearance when exactly one side panel is visible (px). */
export const CLEARANCE_SINGLE = 80;

/** Extra bottom clearance with no side panels (px). */
export const CLEARANCE_NONE = 24;

// ---------------------------------------------------------------------------
// Rive animation size constraints (max-width / max-height in px)
// ---------------------------------------------------------------------------

/** Rive size when the assistant is the sole, un-expanded panel. */
export const RIVE_MAX_SOLO = 550;

/** Rive size when side panels are active (gallery mode). */
export const RIVE_MAX_WITH_SIDES = 320;

/** Rive size when expanded to speaker view. */
export const RIVE_MAX_EXPANDED = 480;

// ---------------------------------------------------------------------------
// Second-row panel layout
// ---------------------------------------------------------------------------

/** Width of each second-row panel as a percentage of the container. */
export const SECOND_ROW_WIDTH_PCT = 55;

/** Percentage gap between second-row panels. */
export const SECOND_ROW_GAP_PCT = 1.2;

// ---------------------------------------------------------------------------
// Transition timing
// ---------------------------------------------------------------------------

/**
 * CSS transition string applied to every panel div.
 * All positional properties animate together at the same speed.
 */
export const PANEL_TRANSITION =
  "top 0.7s ease-in-out, left 0.7s ease-in-out, width 0.7s ease-in-out, height 0.7s ease-in-out, opacity 0.7s ease-in-out";

/** Duration (ms) that slide-in / slide-out animations take. */
export const SLIDE_DURATION_MS = 500;

/**
 * Brief delay (ms) before clearing the "entering" flag.
 * Gives the browser one paint frame at the off-screen position
 * so the slide-in transition can play.
 */
export const ENTER_SETTLE_MS = 50;

/**
 * Duration (ms) that borders stay hidden during layout transitions.
 * Matches the longest CSS transition so borders reappear only after
 * all panels have settled.
 */
export const BORDER_HIDE_MS = 750;
