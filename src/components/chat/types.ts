/**
 * =============================================================================
 * Chat Feature — Shared Types & Constants
 * =============================================================================
 *
 * Central place for types and constants used across all chat components.
 * Keeping these here avoids circular imports and makes the data model
 * easy to find for new developers.
 */

// ---------------------------------------------------------------------------
// Panel Types
// ---------------------------------------------------------------------------

/**
 * All possible panel keys in the video-conference-style layout.
 *
 * - "rive"   → The animated AI assistant (always present)
 * - "image"  → Infographic / image search panel (toggled via header switch)
 * - "skill"  → Skill map (React Flow graph, toggled via header switch)
 * - "screen" → Screen share preview (toggled via toolbar button)
 */
export type PanelKey = "rive" | "image" | "skill" | "screen" | "webcam" | "quiz";

// ---------------------------------------------------------------------------
// Chat Message
// ---------------------------------------------------------------------------

/** A single message in the chat transcript. */
export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
}

// ---------------------------------------------------------------------------
// Loading Sequence
// ---------------------------------------------------------------------------

/** Friendly loading messages shown while the session initialises. */
export const LOADING_STATES = [
  "Waking up A…",
  "Teaching A your name…",
  "Calibrating curiosity levels…",
  "Brewing something just for you…",
  "Almost there — A can't wait to meet you…",
] as const;

/** How long (ms) each loading message is displayed. */
export const LOADING_INTERVAL = 1800;

// ---------------------------------------------------------------------------
// Mock AI Responses
// ---------------------------------------------------------------------------

/**
 * Placeholder AI responses used before real backend integration.
 * A random response is selected after each user message.
 */
export const AI_RESPONSES = [
  "That's a great question! Let me think about that…",
  "Interesting! Here's what I know about that topic.",
  "I love your curiosity! Let's explore this together.",
  "Great thinking! Let me explain a bit more.",
  "You're doing amazing! Here's what comes next.",
  "That's exactly right! Want to learn more?",
  "Awesome observation! Let me share something cool about that.",
] as const;
