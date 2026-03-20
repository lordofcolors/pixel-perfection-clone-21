/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LIGHT MODE — Weekly Digest Email Template
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Generates a fully self-contained HTML email string using a clean, airy
 * light theme matching the Xolv marketing site. Uses brand colours:
 * magenta (#CA7FCD), blue (#6166F3), teal (#24A1B6).
 *
 * USAGE:
 *   import { buildLightEmailHTML } from './lightEmailTemplate';
 *   const html = buildLightEmailHTML(digestData);
 *
 * See darkEmailTemplate.ts header comments for full documentation on
 * deep links, mobile responsiveness, and chart rendering — the same
 * architecture applies here with light-theme colour swaps.
 *
 * COLOUR PALETTE (light mode):
 *   Background:  #ffffff
 *   Card BG:     #F8FAFC
 *   Text:        #1E293B (primary), #475569 (secondary), #64748B (muted)
 *   Borders:     #E2E8F0
 *   Accents:     Magenta #CA7FCD, Blue #6166F3, Teal #24A1B6
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

/* ── Light theme colour tokens ── */
const MAGENTA = '#CA7FCD';
const BLUE = '#6166F3';
const TEAL = '#24A1B6';
const TEAL_LIGHT = '#B1E9F0';
const MAGENTA_LIGHT = '#EED4F0';
const BLUE_LIGHT = '#C6D3FF';
const TEXT_PRIMARY = '#1E293B';
const TEXT_SECONDARY = '#475569';
const TEXT_MUTED = '#64748B';
const BORDER = '#E2E8F0';
const BG_CARD = '#F8FAFC';
const CTA_COLOR = '#0F172A';

/* ═══════════════════════════════════════════════════════════════════════════
 * COMPONENT BUILDERS — Light variants
 * Same structure as dark template; see darkEmailTemplate.ts for
 * detailed JSDoc on each builder function.
 * ═══════════════════════════════════════════════════════════════════════════ */

function buildChart(href: string, title: string, subtitle: string, days: string[], values: number[], color: string, maxVal: number) {
  const barH = 50;
  const bars = days.map((d, i) => {
    const h = Math.max(3, (values[i] / maxVal) * barH);
    return `<td style="vertical-align: bottom; text-align: center; padding: 0 2px;">
      <div style="width: 24px; height: ${h}px; background: ${color}; border-radius: 4px 4px 0 0; margin: 0 auto;"></div>
      <p style="margin: 4px 0 0; font-size: 9px; color: ${TEXT_SECONDARY}; font-family: ${FONT};">${d}</p>
    </td>`;
  }).join('');

  return `<td class="chart-cell" style="padding: 6px; width: 50%; vertical-align: top;">
    <a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td style="padding: 14px; height: 120px; background-color: ${BG_CARD}; border: 1px solid ${BORDER}; border-radius: 10px; vertical-align: top;">
        <p style="margin: 0 0 2px; font-size: 12px; font-weight: 600; color: ${TEXT_PRIMARY}; font-family: ${FONT};">${title}</p>
        <p style="margin: 0 0 10px; font-size: 9px; color: ${TEXT_MUTED}; font-family: ${FONT};">${subtitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${bars}</tr></table>
      </td></tr>
    </table>
    </a>
  </td>`;
}

function buildStackedChart(href: string, title: string, subtitle: string, days: string[], voice: number[], text_: number[], maxVal: number) {
  const barH = 50;
  const bars = days.map((d, i) => {
    const vH = Math.max(2, (voice[i] / maxVal) * barH);
    const tH = Math.max(2, (text_[i] / maxVal) * barH);
    return `<td style="vertical-align: bottom; text-align: center; padding: 0 1px;">
      <div style="display: inline-block; width: 24px;">
        <div style="width: 24px; height: ${vH}px; background: ${TEAL}; border-radius: 4px 4px 0 0;"></div>
        <div style="width: 24px; height: ${tH}px; background: ${BLUE}; border-radius: 0;"></div>
      </div>
      <p style="margin: 4px 0 0; font-size: 9px; color: ${TEXT_SECONDARY}; font-family: ${FONT};">${d}</p>
    </td>`;
  }).join('');

  return `<td class="chart-cell" style="padding: 6px; width: 50%; vertical-align: top;">
    <a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td style="padding: 14px; height: 120px; background-color: ${BG_CARD}; border: 1px solid ${BORDER}; border-radius: 10px; vertical-align: top;">
        <p style="margin: 0 0 2px; font-size: 12px; font-weight: 600; color: ${TEXT_PRIMARY}; font-family: ${FONT};">${title}</p>
        <p style="margin: 0 0 10px; font-size: 9px; color: ${TEXT_MUTED}; font-family: ${FONT};">${subtitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${bars}</tr></table>
        <p style="margin: 6px 0 0; font-size: 8px; color: ${TEXT_MUTED}; font-family: ${FONT};">
          <span style="display:inline-block;width:8px;height:8px;background:${TEAL};border-radius:2px;margin-right:3px;vertical-align:middle;"></span>Voice
          <span style="display:inline-block;width:8px;height:8px;background:${BLUE};border-radius:2px;margin:0 3px 0 8px;vertical-align:middle;"></span>Text
        </p>
      </td></tr>
    </table>
    </a>
  </td>`;
}

function buildInsightsCTA(href: string, learnerName: string) {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top: 10px;">
    <tr><td align="center" style="padding: 14px 16px;">
      <a href="${href}" target="_blank" style="display: inline-block; padding: 10px 28px; background: linear-gradient(135deg, ${MAGENTA} 0%, ${TEAL} 60%, ${BLUE} 100%); background-color: ${MAGENTA}; color: #0F172A; font-family: ${FONT}; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 9999px;">
        View ${learnerName}\u2019s Weekly Insights \u2192
      </a>
    </td></tr>
  </table>`;
}

function buildLessonsList(href: string, lessons: string[], maxShow = 3) {
  const shown = lessons.slice(0, maxShow);
  const remaining = lessons.length - maxShow;
  const colors = [TEAL, MAGENTA, BLUE];
  const rows = shown.map((l, i) => {
    const c = colors[i % 3];
    return `<tr><td>
      <a href="${href}" target="_blank" style="text-decoration: none; color: inherit; display: block; padding: 10px 14px; background-color: #ffffff; border: 1px solid ${BORDER}; border-left: 3px solid ${c}; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 13px; color: ${TEXT_PRIMARY}; line-height: 1.4; font-family: ${FONT};">${l}</p>
      </a>
    </td></tr><tr><td style="height: 6px;"></td></tr>`;
  }).join('');

  const moreRow = remaining > 0 ? `<tr><td style="padding: 8px 14px;">
    <a href="${href}" style="font-size: 12px; color: ${TEAL}; text-decoration: none; font-weight: 600; font-family: ${FONT};">+${remaining} more lessons \u2192</a>
  </td></tr>` : '';

  return `<a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
  <p style="margin: 0 0 8px; font-size: 12px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: ${FONT};">${lessons.length} Lessons Explored</p>
  </a>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
      ${rows}${moreRow}
    </table>`;
}

function buildMemoriesList(href: string, memories: string[], maxShow = 3) {
  const shown = memories.slice(0, maxShow);
  const remaining = memories.length - maxShow;
  const colors = [BLUE, TEAL, MAGENTA];
  const rows = shown.map((m, i) => {
    const c = colors[i % 3];
    return `<tr><td>
      <a href="${href}" target="_blank" style="text-decoration: none; color: inherit; display: block; padding: 10px 14px; background-color: #ffffff; border: 1px solid ${BORDER}; border-left: 3px solid ${c}; border-radius: 0 6px 6px 0;">
        <p style="margin: 0; font-size: 13px; color: ${TEXT_SECONDARY}; line-height: 1.5; font-family: ${FONT};">${m}</p>
      </a>
    </td></tr><tr><td style="height: 6px;"></td></tr>`;
  }).join('');

  const moreRow = remaining > 0 ? `<tr><td style="padding: 8px 14px;">
    <a href="${href}" style="font-size: 12px; color: ${BLUE}; text-decoration: none; font-weight: 600; font-family: ${FONT};">+${remaining} more memories \u2192</a>
  </td></tr>` : '';

  return `<a href="${href}" target="_blank" style="text-decoration: none; color: inherit;">
  <p style="margin: 0 0 8px; font-size: 12px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: ${FONT};">${memories.length} New Memories</p>
  </a>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      ${rows}${moreRow}
    </table>`;
}

function buildLearnerCard(data: LearnerData, dateRange: string, dayLabels: string) {
  const urlAnalytics = buildLearnerUrl(data.id);
  const urlTrends    = buildLearnerUrl(data.id, 'behaviour-trends');
  const urlInsights  = buildLearnerUrl(data.id, 'ai-insights');
  const urlLessons   = buildLearnerUrl(data.id, 'lessons');
  const urlMemories  = buildLearnerUrl(data.id, 'memories');

  const charts = `
    <p style="margin: 14px 0 2px; font-size: 11px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: ${FONT};">Behaviour Trends</p>
    <p style="margin: 0 0 8px; font-size: 10px; color: ${TEXT_MUTED}; font-family: ${FONT};">${dateRange} \u00B7 ${dayLabels}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr>
        ${buildChart(urlTrends, 'Session Duration', 'Avg duration per session', DAYS, data.sessionDuration, MAGENTA, 40)}
        ${buildStackedChart(urlTrends, 'Message Types', 'Voice vs text by day', DAYS, data.voice, data.text, 26)}
      </tr>
      <tr>
        ${buildChart(urlTrends, 'Words per Message', 'Avg words per message', DAYS, data.wordsPerMsg, TEAL, 70)}
        ${buildChart(urlTrends, 'Sessions per Day', 'Number of sessions', DAYS, data.sessionsPerDay, BLUE, 4)}
      </tr>
    </table>
    ${buildInsightsCTA(urlInsights, data.name)}`;

  return `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 16px;">
    <tr><td style="height: 3px; background: linear-gradient(90deg, ${MAGENTA_LIGHT}, ${TEAL_LIGHT}, ${BLUE_LIGHT}); background-color: ${MAGENTA_LIGHT}; border-radius: 3px;"></td></tr>
    <tr>
      <td style="background-color: #ffffff; border: 1px solid ${BORDER}; border-top: none; border-radius: 0 0 12px 12px; padding: 20px 24px;">

        <!-- Name row -->
        <a href="${urlAnalytics}" target="_blank" style="text-decoration: none; color: inherit;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
          <tr>
            <td style="padding: 0 12px 0 0; vertical-align: middle;" width="40">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="40"><tr>
                <td width="40" height="40" style="width: 40px; height: 40px; background-color: ${TEXT_PRIMARY}; border-radius: 20px; text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #ffffff; font-family: ${FONT}; line-height: 40px;">${data.initials}</p>
                </td>
              </tr></table>
            </td>
            <td style="vertical-align: middle;">
              <p style="margin: 0; font-size: 20px; font-weight: 600; color: ${TEXT_PRIMARY}; font-family: ${FONT};">${data.name}</p>
            </td>
            <td style="vertical-align: middle; text-align: right;" width="110">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="display: inline-block;">
                <tr><td style="padding: 4px 12px; border-radius: 12px; border: 1px solid ${TEAL_LIGHT}; background-color: #EFFCFC;">
                  <p style="margin: 0; font-size: 13px; color: ${TEAL}; font-weight: 500; font-family: ${FONT}; white-space: nowrap;">${data.activeDays} active days</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
        </a>

        <!-- Stat pills -->
        <a href="${urlAnalytics}" target="_blank" style="text-decoration: none; color: inherit;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 14px;">
          <tr>
            <td width="50%" style="padding: 0 4px 6px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid ${BORDER}; text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: ${MAGENTA}; font-family: ${FONT};"><span style="font-weight: 700;">${data.sessions} Sessions</span> This Week</p>
                </td>
              </tr></table>
            </td>
            <td width="50%" style="padding: 0 0 6px 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid ${BORDER}; text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: ${TEAL}; font-family: ${FONT};"><span style="font-weight: 700;">Total Time:</span> ${data.time}</p>
                </td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td width="50%" style="padding: 0 4px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid ${BORDER}; text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; color: ${BLUE}; font-family: ${FONT};"><span style="font-weight: 700;">${data.lessons} Lessons</span> Explored</p>
                </td>
              </tr></table>
            </td>
            <td width="50%" style="padding: 0 0 0 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="52" style="padding: 8px 12px; height: 52px; border-radius: 10px; border: 1px solid ${BORDER}; text-align: center; vertical-align: middle;">
                  <p style="margin: 0; font-size: 14px; font-family: ${FONT};"><span style="font-weight: 700; color: ${MAGENTA};">${data.chats} Conversations</span> <span style="color: ${TEXT_PRIMARY};">Had</span></p>
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
        </a>

        ${charts}

        <!-- Divider -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 16px 0 12px;">
          <tr><td style="height: 1px; background-color: ${BORDER};"></td></tr>
        </table>

        ${buildLessonsList(urlLessons, data.lessonsExplored)}
        ${buildMemoriesList(urlMemories, data.memories)}
      </td>
    </tr>
  </table>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ═══════════════════════════════════════════════════════════════════════════ */

export function buildLightEmailHTML(data: WeeklyDigestData = SAMPLE_DIGEST): string {
  const dashboardUrl = buildLearnerUrl();

  const learnerCards = data.learners
    .map((learner) => `<tr><td>${buildLearnerCard(learner, data.dateRange, data.dayLabels)}</td></tr>`)
    .join('\n          ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <link href="https://fonts.googleapis.com/css2?family=Literata:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width: 480px) {
      .chart-cell { display: block !important; width: 100% !important; padding: 4px 0 !important; }
      .email-wrapper { padding: 12px 8px !important; }
      .email-inner { padding: 16px 14px !important; }
      .learner-card { padding: 14px 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #ffffff; padding: 24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width: 600px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 0 0 20px;">
              <a href="${dashboardUrl}" target="_blank">
                <img src="https://app-dev.abyxolv.com/images/logo.png" alt="A by Xolv" width="80" height="80" style="display: block; max-width: 100%;" />
              </a>
            </td>
          </tr>

          <!-- Header Card -->
          <tr>
            <td style="background-color: ${BG_CARD}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 28px 24px; text-align: center;">
              <h1 style="margin: 0 0 4px; font-size: 24px; font-weight: 600; color: ${TEXT_PRIMARY}; font-family: ${FONT};">
                Your Weekly Update
              </h1>
              <p style="margin: 0 0 16px; font-size: 13px; color: ${TEXT_MUTED}; font-family: ${FONT};">${data.dateRange}</p>
              <p style="margin: 0 0 20px; font-size: 14px; color: ${TEXT_SECONDARY}; line-height: 1.6; font-family: ${FONT};">
                Hi ${data.guardianName}, here is a summary of how your children engaged with A this week. Below you will find session activity, learning highlights, behaviour trends, and new memories for each learner.
              </p>

              <!-- Weekly Totals -->
              <a href="${dashboardUrl}" target="_blank" style="text-decoration: none; color: inherit;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td width="50%" style="padding: 0 4px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td height="80" style="text-align: center; padding: 12px 4px; height: 80px; border-radius: 10px; border: 1px solid ${BORDER}; background-color: #ffffff; vertical-align: middle;">
                        <p style="margin: 0; font-size: 28px; font-weight: 600; color: ${BLUE}; font-family: ${FONT};">${data.totalSessions}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 0.5px; font-family: ${FONT};">Total Sessions Combined</p>
                      </td>
                    </tr></table>
                  </td>
                  <td width="50%" style="padding: 0 0 0 4px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td height="80" style="text-align: center; padding: 12px 4px; height: 80px; border-radius: 10px; border: 1px solid ${BORDER}; background-color: #ffffff; vertical-align: middle;">
                        <p style="margin: 0; font-size: 28px; font-weight: 600; color: ${TEAL}; font-family: ${FONT};">${data.totalTime}</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 0.5px; font-family: ${FONT};">Total Learning Time</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>
              </a>
            </td>
          </tr>

          <tr><td style="height: 16px;"></td></tr>

          <!-- Learner Cards -->
          ${learnerCards}

          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 8px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 14px; font-size: 14px; color: ${TEXT_MUTED}; font-family: ${FONT};">View the full dashboard for detailed analytics and session transcripts.</p>
                    <a href="${dashboardUrl}" target="_blank" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${MAGENTA_LIGHT} 0%, ${MAGENTA} 100%); background-color: ${MAGENTA}; color: ${CTA_COLOR}; font-family: ${FONT}; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 14px rgba(202,127,205,0.3);">
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
              <p style="margin: 0; font-size: 11px; color: ${TEXT_MUTED}; font-family: ${FONT};">
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
