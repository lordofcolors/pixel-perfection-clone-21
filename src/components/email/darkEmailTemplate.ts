/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DARK MODE — Weekly Digest Email Template
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Generates a fully self-contained HTML email string using dark theme
 * colours inspired by the Xolv product UI (#0A0E17 background, slate
 * accents). Every section is wrapped in a clickable <a> tag that deep-
 * links to the corresponding page in the parent dashboard.
 *
 * USAGE:
 *   import { buildDarkEmailHTML } from './darkEmailTemplate';
 *   const html = buildDarkEmailHTML(digestData);
 *   // → send `html` via your email pipeline
 *
 * The function accepts a `WeeklyDigestData` object (see emailHelpers.ts)
 * containing the guardian name, date range, aggregate stats, and an array
 * of `LearnerData` objects — one per child.
 *
 * DEEP LINKS (all sections are clickable):
 *   • Header card / weekly totals → parent dashboard overview
 *   • Learner name row           → individual learner analytics
 *   • Stat pills (sessions, time, lessons, chats) → learner analytics
 *   • Behaviour trend charts     → learner analytics #behaviour-trends
 *   • AI Insights card           → learner analytics #ai-insights
 *   • Lessons explored list      → learner analytics #lessons
 *   • Memories list              → learner analytics #memories
 *   • "View Full Dashboard" CTA  → parent dashboard overview
 *
 * MOBILE RESPONSIVENESS:
 *   The <style> block includes @media queries for screens ≤ 480px that
 *   stack the 2×2 chart grid into a single column and reduce padding.
 *
 * CHART RENDERING:
 *   Charts are built with table cells and inline <div> bars — no images
 *   or external dependencies. Bar heights are proportional to the max
 *   value in each dataset.
 * ═══════════════════════════════════════════════════════════════════════════
 */
import {
  FONT,
  DAYS,
  SAMPLE_DIGEST,
  buildLearnerUrl,
  type LearnerData,
  type WeeklyDigestData,
} from './emailHelpers';

/** CTA button text colour (dark navy — readable on the magenta gradient) */
const CTA_COLOR = '#0F172A';

/* ═══════════════════════════════════════════════════════════════════════════
 * COMPONENT BUILDERS
 * Each function returns an HTML string for one section of the email.
 * They receive the learner's deep-link URL so every piece is clickable.
 * ═══════════════════════════════════════════════════════════════════════════ */

/**
 * ── Bar Chart ──
 * Renders a single metric as a row of 7 vertical bars (Mon–Sun).
 * Used for Session Duration, Words per Message, and Sessions per Day.
 *
 * @param href   - Deep link URL for the clickable wrapper
 * @param title  - Chart heading (e.g. "Session Duration")
 * @param subtitle - Secondary label (e.g. "Avg duration per session")
 * @param days   - Day abbreviations array ['Mon'..'Sun']
 * @param values - 7 numeric values, one per day
 * @param color  - Bar fill colour (hex)
 * @param maxVal - Maximum expected value (determines bar height scaling)
 */
function buildChart(href: string, title: string, subtitle: string, days: string[], values: number[], color: string, maxVal: number) {
  const barH = 50;
  const bars = days.map((d, i) => {
    const h = Math.max(3, (values[i] / maxVal) * barH);
    return `<td style="vertical-align: bottom; text-align: center; padding: 0 2px;">
      <div style="width: 22px; height: ${h}px; background: ${color}; border-radius: 3px 3px 0 0; margin: 0 auto; opacity: 0.85;"></div>
      <p style="margin: 3px 0 0; font-size: 8px; color: #E2E8F0; font-family: ${FONT};">${d}</p>
    </td>`;
  }).join('');

  return `<td class="chart-cell" style="padding: 6px; width: 50%; vertical-align: top;">
    <a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td style="padding: 12px; height: 120px; background-color: #111827; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; vertical-align: top;">
        <p style="margin: 0 0 2px; font-size: 12px; font-weight: 600; color: #E2E8F0; font-family: ${FONT};">${title}</p>
        <p style="margin: 0 0 10px; font-size: 9px; color: #94A3B8; font-family: ${FONT};">${subtitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${bars}</tr></table>
      </td></tr>
    </table>
    </a>
  </td>`;
}

/**
 * ── Stacked Bar Chart ──
 * Renders voice (teal) + text (blue) stacked bars for Message Types.
 * Same structure as buildChart but with two stacked segments per day.
 */
function buildStackedChart(href: string, title: string, subtitle: string, days: string[], voice: number[], text_: number[], maxVal: number) {
  const barH = 50;
  const bars = days.map((d, i) => {
    const vH = Math.max(2, (voice[i] / maxVal) * barH);
    const tH = Math.max(2, (text_[i] / maxVal) * barH);
    return `<td style="vertical-align: bottom; text-align: center; padding: 0 1px;">
      <div style="display: inline-block; width: 22px;">
        <div style="width: 22px; height: ${vH}px; background: #94DFE9; border-radius: 3px 3px 0 0; opacity: 0.85;"></div>
        <div style="width: 22px; height: ${tH}px; background: #B9C6FE; opacity: 0.85;"></div>
      </div>
      <p style="margin: 3px 0 0; font-size: 8px; color: #E2E8F0; font-family: ${FONT};">${d}</p>
    </td>`;
  }).join('');

  return `<td class="chart-cell" style="padding: 6px; width: 50%; vertical-align: top;">
    <a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td style="padding: 12px; height: 120px; background-color: #111827; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; vertical-align: top;">
        <p style="margin: 0 0 2px; font-size: 12px; font-weight: 600; color: #E2E8F0; font-family: ${FONT};">${title}</p>
        <p style="margin: 0 0 10px; font-size: 9px; color: #94A3B8; font-family: ${FONT};">${subtitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${bars}</tr></table>
        <p style="margin: 6px 0 0; font-size: 8px; color: #94A3B8; font-family: ${FONT};">
          <span style="display:inline-block;width:8px;height:8px;background:#94DFE9;border-radius:2px;margin-right:3px;vertical-align:middle;"></span>Voice
          <span style="display:inline-block;width:8px;height:8px;background:#B9C6FE;border-radius:2px;margin:0 3px 0 8px;vertical-align:middle;"></span>Text
        </p>
      </td></tr>
    </table>
    </a>
  </td>`;
}

/**
 * ── Weekly Insights CTA ──
 * Centered call-to-action linking to the learner's weekly insights page.
 */
function buildInsightsCTA(href: string, learnerName: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top: 10px;">
    <tr><td align="center" style="padding: 14px 16px; background-color: #0E1225; border: 1px solid rgba(185,198,254,0.15); border-radius: 10px;">
      <a href="${href}" target="_blank" style="display: inline-block; padding: 10px 28px; background: linear-gradient(135deg, #EED4F0 0%, #94DFE9 50%, #B9C6FE 100%); background-color: #B9C6FE; color: #0F172A; font-family: ${FONT}; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        View ${learnerName}\u2019s Weekly Insights \u2192
      </a>
    </td></tr>
  </table>`;
}

/**
 * ── Lessons Explored List ──
 * Shows up to `maxShow` lesson titles with coloured left borders,
 * plus a "+N more" link if there are additional lessons.
 *
 * @param href    - Deep link to the lessons section
 * @param lessons - Array of lesson title strings
 * @param maxShow - Maximum lessons to display before showing "+N more"
 */
function buildLessonsList(href: string, lessons: string[], maxShow = 3) {
  const shown = lessons.slice(0, maxShow);
  const remaining = lessons.length - maxShow;
  const rows = shown.map((l, i) => {
    const colors = ['#94DFE9', '#EED4F0', '#B9C6FE'];
    const c = colors[i % 3];
    return `<tr><td>
      <a href="${href}" target="_blank" style="text-decoration: none; color: inherit; display: block; padding: 10px 14px; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid ${c}; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 13px; color: #CBD5E1; line-height: 1.4; font-family: ${FONT};">${l}</p>
      </a>
    </td></tr><tr><td style="height: 6px;"></td></tr>`;
  }).join('');

  const moreRow = remaining > 0 ? `<tr><td style="padding: 8px 14px;">
    <a href="${href}" style="font-size: 12px; color: #94DFE9; text-decoration: none; font-family: ${FONT};">+${remaining} more lessons \u2192</a>
  </td></tr>` : '';

  return `<a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
  <p style="margin: 0 0 8px; font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: ${FONT};">${lessons.length} Lessons Explored</p>
  </a>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
      ${rows}${moreRow}
    </table>`;
}

/**
 * ── Memories List ──
 * Shows up to `maxShow` memory quotes with coloured left borders,
 * plus a "+N more" link.
 *
 * @param href     - Deep link to the memories section
 * @param memories - Array of memory quote strings
 * @param maxShow  - Maximum memories to display
 */
function buildMemoriesList(href: string, memories: string[], maxShow = 3) {
  const shown = memories.slice(0, maxShow);
  const remaining = memories.length - maxShow;
  const rows = shown.map((m, i) => {
    const colors = ['#B9C6FE', '#94DFE9', '#EED4F0'];
    const c = colors[i % 3];
    return `<tr><td>
      <a href="${href}" target="_blank" style="text-decoration: none; color: inherit; display: block; padding: 10px 14px; background-color: #111827; border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid ${c}; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 13px; color: #CBD5E1; line-height: 1.5; font-family: ${FONT};">${m}</p>
      </a>
    </td></tr><tr><td style="height: 6px;"></td></tr>`;
  }).join('');

  const moreRow = remaining > 0 ? `<tr><td style="padding: 8px 14px;">
    <a href="${href}" style="font-size: 12px; color: #B9C6FE; text-decoration: none; font-family: ${FONT};">+${remaining} more memories \u2192</a>
  </td></tr>` : '';

  return `<a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
  <p style="margin: 0 0 8px; font-size: 12px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: ${FONT};">${memories.length} New Memories</p>
  </a>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      ${rows}${moreRow}
    </table>`;
}

/**
 * ── Learner Card ──
 * Renders the full card for one learner: avatar, name, stat pills,
 * behaviour trend charts, AI insights, lessons, and memories.
 * Every sub-section deep-links to the relevant dashboard page.
 *
 * @param data      - LearnerData object with all metrics
 * @param dateRange - Date range string for chart subtitles
 * @param dayLabels - Day range label (e.g. "Monday – Sunday")
 */
function buildLearnerCard(data: LearnerData, dateRange: string, dayLabels: string) {
  /* Deep link URLs for each section of this learner's card */
  const urlAnalytics = buildLearnerUrl(data.id);
  const urlTrends    = buildLearnerUrl(data.id, 'behaviour-trends');
  const urlInsights  = buildLearnerUrl(data.id, 'ai-insights');
  const urlLessons   = buildLearnerUrl(data.id, 'lessons');
  const urlMemories  = buildLearnerUrl(data.id, 'memories');

  const charts = `
    <p style="margin: 12px 0 2px; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: ${FONT};">Behaviour Trends</p>
    <p style="margin: 0 0 8px; font-size: 10px; color: #64748B; font-family: ${FONT};">${dateRange} \u00B7 ${dayLabels}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr>
        ${buildChart(urlTrends, 'Session Duration', 'Avg duration per session', DAYS, data.sessionDuration, '#EED4F0', 40)}
        ${buildStackedChart(urlTrends, 'Message Types', 'Voice vs text by day', DAYS, data.voice, data.text, 26)}
      </tr>
      <tr>
        ${buildChart(urlTrends, 'Words per Message', 'Avg words per message', DAYS, data.wordsPerMsg, '#94DFE9', 70)}
        ${buildChart(urlTrends, 'Sessions per Day', 'Number of sessions', DAYS, data.sessionsPerDay, '#B9C6FE', 4)}
      </tr>
    </table>
    ${buildInsightsCTA(urlInsights, data.name)}`;

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 14px;">
    <!-- Gradient accent bar at top of card -->
    <tr><td style="height: 3px; background: linear-gradient(90deg, #EED4F0, #94DFE9, #B9C6FE); background-color: #EED4F0; border-radius: 3px;"></td></tr>
    <tr>
      <td style="background-color: #0F172A; border: 1px solid rgba(255,255,255,0.1); border-top: none; border-radius: 0 0 12px 12px; padding: 18px 20px;">

        <!-- Name row — links to learner analytics overview -->
        <a href="${urlAnalytics}" target="_blank" style="text-decoration: none; color: inherit;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 10px;">
          <tr>
            <td style="padding: 0 12px 0 0; vertical-align: middle;" width="36">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="36"><tr>
                <td width="36" height="36" style="width: 36px; height: 36px; background-color: #1E293B; border: 1px solid rgba(255,255,255,0.15); border-radius: 18px; text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 13px; font-weight: 600; color: #E2E8F0; font-family: ${FONT}; line-height: 36px;">${data.initials}</p>
                </td>
              </tr></table>
            </td>
            <td style="vertical-align: middle;">
              <p style="margin: 0; font-size: 20px; font-weight: 600; color: #ffffff; font-family: ${FONT};">${data.name}</p>
            </td>
            <td style="vertical-align: middle; text-align: right;" width="110">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="display: inline-block;">
                <tr><td style="padding: 4px 10px; border-radius: 12px; border: 1px solid rgba(148, 223, 233, 0.2);">
                  <p style="margin: 0; font-size: 13px; color: #94DFE9; font-family: ${FONT}; white-space: nowrap;">${data.activeDays} active days</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
        </a>

        <!-- Stat pills — link to learner analytics -->
        <a href="${urlAnalytics}" target="_blank" style="text-decoration: none; color: inherit;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
          <tr>
            <td width="50%" style="padding: 0 4px 6px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid rgba(238,212,240,0.15); text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: #EED4F0; font-family: ${FONT};"><span style="font-weight: 700;">${data.sessions} Sessions</span> This Week</p>
                </td>
              </tr></table>
            </td>
            <td width="50%" style="padding: 0 0 6px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid rgba(148,223,233,0.15); text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: #94DFE9; font-family: ${FONT};">Total Time: ${data.time}</p>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding: 0 4px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid rgba(185,198,254,0.15); text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: #B9C6FE; font-family: ${FONT};">${data.lessons} Lessons Explored</p>
                </td>
              </tr></table>
            </td>
            <td width="50%" style="padding: 0 0 0 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: #E2E8F0; font-family: ${FONT};">${data.chats} Conversations Had</p>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
        </a>

        ${charts}

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 14px 0 10px;">
          <tr><td style="height: 1px; background-color: rgba(255,255,255,0.08);"></td></tr>
        </table>

        ${buildLessonsList(urlLessons, data.lessonsExplored)}
        ${buildMemoriesList(urlMemories, data.memories)}
      </td>
    </tr>
  </table>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 *
 * Builds the complete dark-mode email HTML.
 * Accepts an optional `WeeklyDigestData` — defaults to SAMPLE_DIGEST
 * for the preview page.
 * ═══════════════════════════════════════════════════════════════════════════ */

export function buildDarkEmailHTML(data: WeeklyDigestData = SAMPLE_DIGEST): string {
  const dashboardUrl = buildLearnerUrl(); // top-level parent dashboard

  /* Render one learner card per child */
  const learnerCards = data.learners
    .map((learner) => `<tr><td>${buildLearnerCard(learner, data.dateRange, data.dayLabels)}</td></tr>`)
    .join('\n          ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <link href="https://fonts.googleapis.com/css2?family=Literata:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Mobile: stack charts vertically, reduce padding */
    @media only screen and (max-width: 480px) {
      .chart-cell { display: block !important; width: 100% !important; padding: 4px 0 !important; }
      .email-wrapper { padding: 12px 8px !important; }
      .email-inner { padding: 16px 14px !important; }
      .learner-card { padding: 14px 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0E17;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #0A0E17; padding: 24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width: 600px; width: 100%;">

          <!-- Logo — links to dashboard -->
          <tr>
            <td align="center" style="padding: 0 0 20px;">
              <a href="${dashboardUrl}" target="_blank">
                <img src="https://app-dev.abyxolv.com/images/logo.png" alt="A by Xolv" width="80" height="80" style="display: block; max-width: 100%;" />
              </a>
            </td>
          </tr>

          <!-- Header Card — overview stats -->
          <tr>
            <td style="background-color: #0F172A; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; text-align: center;">
              <h1 style="margin: 0 0 4px; font-size: 24px; font-weight: 600; color: #ffffff; font-family: ${FONT};">
                Your Weekly Update
              </h1>
              <p style="margin: 0 0 16px; font-size: 13px; color: #64748B; font-family: ${FONT};">${data.dateRange}</p>
              <p style="margin: 0 0 20px; font-size: 14px; color: #94A3B8; line-height: 1.6; font-family: ${FONT};">
                Hi ${data.guardianName}, here is a summary of how your children engaged with A this week. Below you will find session activity, learning highlights, behaviour trends, and new memories for each learner.
              </p>

              <!-- Weekly Totals — link to dashboard overview -->
              <a href="${dashboardUrl}" target="_blank" style="text-decoration: none; color: inherit;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td width="50%" style="padding: 0 4px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td height="80" style="text-align: center; padding: 10px 4px; height: 80px; border-radius: 10px; border: 1px solid rgba(238,212,240,0.12); vertical-align: middle;">
                        <p style="margin: 0; font-size: 26px; font-weight: 600; color: #EED4F0; font-family: ${FONT};">${data.totalSessions}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; font-family: ${FONT};">Total Sessions Combined</p>
                      </td>
                    </tr></table>
                  </td>
                  <td width="50%" style="padding: 0 0 0 4px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td height="80" style="text-align: center; padding: 10px 4px; height: 80px; border-radius: 10px; border: 1px solid rgba(148,223,233,0.12); vertical-align: middle;">
                        <p style="margin: 0; font-size: 26px; font-weight: 600; color: #94DFE9; font-family: ${FONT};">${data.totalTime}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; font-family: ${FONT};">Total Learning Time</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>
              </a>
            </td>
          </tr>

          <tr><td style="height: 16px;"></td></tr>

          <!-- Learner Cards (one per child) -->
          ${learnerCards}

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 8px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 14px; font-size: 14px; color: #94A3B8; font-family: ${FONT};">View the full dashboard for detailed analytics and session transcripts.</p>
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #EED4F0 0%, #CA7FCD 100%); background-color: #CA7FCD; color: ${CTA_COLOR}; font-family: ${FONT}; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 14px rgba(238,212,240,0.3);">
                        View Full Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 16px 0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569; font-family: ${FONT};">
                This is an automated weekly digest. To stop receiving these emails, disable weekly digests in your parent settings.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
