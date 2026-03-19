/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EMAIL DIGEST — Shared Types, Data, and URL Helpers
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file defines the data contract for the weekly parent digest email.
 * Both darkEmailTemplate.ts and lightEmailTemplate.ts consume these types.
 *
 * DATA FLOW (future integration):
 *   1. A scheduled job (e.g. Supabase cron / edge function) runs weekly.
 *   2. It queries the database for each guardian's learners and aggregates:
 *      - Session counts, durations, lesson counts, conversation counts
 *      - Per-day breakdowns for behaviour trend charts
 *      - Recent lessons explored and new memories
 *      - AI-generated insight text (from an LLM summarisation step)
 *   3. The aggregated data is shaped into `WeeklyDigestData` and passed
 *      to `buildDarkEmailHTML(data)` or `buildLightEmailHTML(data)`.
 *   4. The resulting HTML string is sent via the email delivery pipeline.
 *
 * DEEP LINK URLS:
 *   Every clickable section in the email links to a specific page in the
 *   parent dashboard. The `buildLearnerUrl` helper constructs these URLs
 *   using the learner's ID and an optional hash fragment for sub-sections.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ── Typography ── */
export const FONT = "'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif";

/* ── Day labels for behaviour trend charts (Mon–Sun) ── */
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ── Base URL for all deep links ── */
export const BASE_URL = 'https://app-dev.abyxolv.com';

/**
 * ─── DEEP LINK BUILDER ───
 *
 * Constructs a URL pointing to the parent dashboard, optionally scoped
 * to a specific learner and section. Used by every clickable region in
 * the email templates.
 *
 * @param learnerId  - UUID of the learner (omit for top-level dashboard)
 * @param section    - Hash fragment to scroll to a sub-section
 *
 * Examples:
 *   buildLearnerUrl()                              → /dashboard/?role=parent
 *   buildLearnerUrl('abc-123')                     → /dashboard/?role=parent&learner=abc-123
 *   buildLearnerUrl('abc-123', 'behaviour-trends') → /dashboard/?role=parent&learner=abc-123#behaviour-trends
 *   buildLearnerUrl('abc-123', 'lessons')          → /dashboard/?role=parent&learner=abc-123#lessons
 *   buildLearnerUrl('abc-123', 'memories')         → /dashboard/?role=parent&learner=abc-123#memories
 */
export function buildLearnerUrl(learnerId?: string, section?: string): string {
  let url = `${BASE_URL}/dashboard/?role=parent`;
  if (learnerId) url += `&learner=${learnerId}`;
  if (section) url += `#${section}`;
  return url;
}

/**
 * ─── LEARNER DATA SHAPE ───
 *
 * Each learner in the digest is represented by this interface.
 * All fields are populated by the backend aggregation step.
 *
 * Chart arrays (sessionDuration, voice, text, wordsPerMsg, sessionsPerDay)
 * must always contain exactly 7 values corresponding to Mon–Sun.
 */
export interface LearnerData {
  /** Unique learner ID — used for deep link URLs */
  id: string;
  /** Display initials (e.g. "VS") shown in the avatar circle */
  initials: string;
  /** Full display name */
  name: string;
  /** Number of days with at least one session (e.g. "5") */
  activeDays: string;
  /** Total session count for the week (e.g. "8") */
  sessions: string;
  /** Formatted total time spent (e.g. "1h 52m") */
  time: string;
  /** Number of distinct lessons explored (e.g. "5") */
  lessons: string;
  /** Number of conversations / chat threads (e.g. "3") */
  chats: string;

  /* ── Per-day chart data (Mon=0 … Sun=6) ── */
  /** Average session duration in minutes per day */
  sessionDuration: number[];
  /** Voice message count per day */
  voice: number[];
  /** Text message count per day */
  text: number[];
  /** Average words per message per day */
  wordsPerMsg: number[];
  /** Number of sessions per day */
  sessionsPerDay: number[];

  /* ── Content lists ── */
  /** Lesson titles explored this week */
  lessonsExplored: string[];
  /** Memory quotes captured this week (include surrounding quotes) */
  memories: string[];
  /** AI-generated weekly insight paragraph */
  aiInsight: string;
}

/**
 * ─── TOP-LEVEL DIGEST DATA ───
 *
 * Represents the full weekly digest for one guardian.
 * Passed to buildDarkEmailHTML() / buildLightEmailHTML().
 */
export interface WeeklyDigestData {
  /** Guardian's first name for the greeting (e.g. "Vignesh") */
  guardianName: string;
  /** Formatted date range string (e.g. "Mar 10 – Mar 16, 2026") */
  dateRange: string;
  /** Day label string shown under behaviour trends (e.g. "Monday – Sunday") */
  dayLabels: string;
  /** Sum of all learners' sessions */
  totalSessions: string;
  /** Formatted sum of all learning time (e.g. "2h 45m") */
  totalTime: string;
  /** Array of learner data — one card rendered per learner */
  learners: LearnerData[];
}

/* ═══════════════════════════════════════════════════════════════════════════
 * SAMPLE / PREVIEW DATA
 *
 * Used by the /email preview page. In production these would come from
 * the database aggregation query. Kept here so both dark and light
 * template previews render identical content.
 * ═══════════════════════════════════════════════════════════════════════════ */

export const VIVAAN: LearnerData = {
  id: 'vivaan-sharma-uuid', // placeholder — replaced with real UUID in prod
  initials: 'VS',
  name: 'Vivaan Sharma',
  activeDays: '5',
  sessions: '8',
  time: '1h 52m',
  lessons: '5',
  chats: '3',
  sessionDuration: [12, 18, 8, 35, 28, 15, 22],
  voice: [8, 12, 5, 18, 15, 6, 10],
  text: [4, 6, 3, 8, 5, 2, 4],
  wordsPerMsg: [42, 51, 38, 65, 59, 40, 53],
  sessionsPerDay: [1, 2, 1, 3, 2, 1, 1],
  lessonsExplored: [
    'The Solar System and Planets',
    'Addition and Subtraction',
    'Animals and Their Habitats',
    'Weather Patterns',
    'Basic Geography',
  ],
  memories: [
    '\u201CVivaan loves learning about space and can name all 8 planets in order\u201D',
    '\u201CGets excited when solving math problems and prefers visual examples with objects\u201D',
    '\u201CVivaan mentioned he has a pet dog named Buddy and loves taking him for walks\u201D',
  ],
  aiInsight:
    "Vivaan had a very active week with 8 sessions across 5 days. He engaged most deeply during Thursday\u2019s solar system lesson, asking follow-up questions about Jupiter\u2019s moons. His voice message usage increased by 40% compared to last week, suggesting growing confidence in verbal expression. He responds best to visual examples and hands-on exploration.",
};

export const MAYA: LearnerData = {
  id: 'maya-sharma-uuid', // placeholder — replaced with real UUID in prod
  initials: 'MS',
  name: 'Maya Sharma',
  activeDays: '3',
  sessions: '4',
  time: '53m',
  lessons: '3',
  chats: '1',
  sessionDuration: [0, 15, 0, 22, 0, 18, 0],
  voice: [0, 6, 0, 10, 0, 8, 0],
  text: [0, 3, 0, 5, 0, 4, 0],
  wordsPerMsg: [0, 35, 0, 48, 0, 32, 0],
  sessionsPerDay: [0, 1, 0, 2, 0, 1, 0],
  lessonsExplored: ['Colors and Shapes', 'Counting to 20'],
  memories: [
    '\u201CMaya\u2019s favorite color is purple and she loves drawing butterflies\u201D',
    '\u201CShe can count to 15 independently and is working on numbers 16-20\u201D',
  ],
  aiInsight:
    "Maya had 4 sessions across 3 active days this week. She\u2019s most engaged during counting exercises and loves using colors as a learning tool. Her sessions tend to be focused and productive, averaging about 18 minutes each. She\u2019s making steady progress on numbers 16-20 and shows strong pattern recognition skills.",
};

/** Default preview data used by the /email page */
export const SAMPLE_DIGEST: WeeklyDigestData = {
  guardianName: 'Vignesh',
  dateRange: 'Mar 10 \u2013 Mar 16, 2026',
  dayLabels: 'Monday \u2013 Sunday',
  totalSessions: '12',
  totalTime: '2h 45m',
  learners: [VIVAAN, MAYA],
};
