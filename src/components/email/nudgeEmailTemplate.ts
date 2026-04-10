/**
 * Nudge email preview HTML – identical for both dark and light mode.
 * The iframe is isolated so parent dark-mode styles never affect text colors.
 */
export function buildNudgeEmailHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="color-scheme" content="only light">
  <meta name="supported-color-schemes" content="light">
  <title>Nudge Email Preview</title>
  <style>
    :root { color-scheme: only light; }
    body { font-family: Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 24px; color: #1E293B; }
    .pair-wrapper { max-width: 680px; margin: 0 auto 48px; }
    .pair-label { background: #1e293b; color: #fff; padding: 10px 16px; border-radius: 8px 8px 0 0; font-size: 13px; font-weight: 600; }
    .subject-preview { background: #334155; color: #e2e8f0; padding: 10px 16px; font-size: 14px; border-bottom: 1px solid #475569; }
    .subject-preview span { color: #94dfe9; font-weight: 600; }
    .email-frame { border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; overflow: hidden; }
  </style>
</head>
<body>

<!-- LEARNER EMAIL -->
<div class="pair-wrapper">
  <div class="pair-label">Learner Email</div>
  <div class="subject-preview">Subject: <span>Your brain called. It wants a workout.</span></div>
  <div class="email-frame">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #ffffff; padding: 24px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width: 600px; width: 100%;">
            <tr>
              <td align="center" style="padding: 0 0 20px;">
                <a href="https://app-dev.abyxolv.com" target="_blank">
                  <img src="https://app-dev.abyxolv.com/images/logo.png" alt="A by Xolv" width="80" height="80" style="display: block; max-width: 100%;" />
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="height: 4px; background: linear-gradient(90deg, #EED4F0, #94DFE9, #B9C6FE);"></td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 16px 16px; padding: 28px 24px;">
                  <tr>
                    <td style="padding: 28px 24px;">
                      <h1 style="margin: 0 0 4px; font-size: 24px; font-weight: 600; color: #1E293B; font-family: Arial, Helvetica, sans-serif; text-align: center;">
                        Brain Workout Time!
                      </h1>
                      <p style="margin: 0 0 20px; font-size: 14px; color: #64748B; font-family: Arial, Helvetica, sans-serif; text-align: center; font-style: italic;">
                        Fun fact: your brain gets stronger every time you learn something new.
                      </p>
                      <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1E293B; font-family: Arial, Helvetica, sans-serif;">
                        Hi Donald,
                      </p>
                      <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                        It's been 3 days since your last learning session. Your learning journey is waiting for you, and Robert is ready to pick up right where you left off!
                      </p>
                      <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">
                        Your Recent Topics
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 0 0 24px;">
                        <tr>
                          <td style="padding: 0 0 6px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #E2E8F0; border-left: 3px solid #24A1B6; border-radius: 0 6px 6px 0;">
                                  <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">Presence Basics</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 6px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #E2E8F0; border-left: 3px solid #CA7FCD; border-radius: 0 6px 6px 0;">
                                  <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">Basics of Football</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 6px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #E2E8F0; border-left: 3px solid #6166F3; border-radius: 0 6px 6px 0;">
                                  <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">Chat with A</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                        <tr>
                          <td align="center" style="padding: 8px 0 24px;">
                            <a href="https://app-dev.abyxolv.com" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #C4A0BF; color: #0F172A; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 14px rgba(196,160,191,0.3);">
                              Start Learning
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 16px 0; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 11px; color: #64748B; font-family: Arial, Helvetica, sans-serif;">
                  This is an automated reminder from A by Xolv.
                </p>
                <p style="margin: 0; font-size: 11px; color: #64748B; font-family: Arial, Helvetica, sans-serif;">
                  <a href="https://app-dev.abyxolv.com/settings/account" target="_blank" style="color: #24A1B6; text-decoration: underline;">Unsubscribe</a> from these reminders.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</div>

<!-- PARENT EMAIL -->
<div class="pair-wrapper">
  <div class="pair-label">Parent Email</div>
  <div class="subject-preview">Subject: <span>Donald's curiosity could use a spark</span></div>
  <div class="email-frame">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #ffffff; padding: 24px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width: 600px; width: 100%;">
            <tr>
              <td align="center" style="padding: 0 0 20px;">
                <a href="https://app-dev.abyxolv.com" target="_blank">
                  <img src="https://app-dev.abyxolv.com/images/logo.png" alt="A by Xolv" width="80" height="80" style="display: block; max-width: 100%;" />
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="height: 4px; background: linear-gradient(90deg, #EED4F0, #94DFE9, #B9C6FE);"></td>
                  </tr>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 16px 16px; padding: 28px 24px;">
                  <tr>
                    <td style="padding: 28px 24px;">
                      <h1 style="margin: 0 0 4px; font-size: 24px; font-weight: 600; color: #1E293B; font-family: Arial, Helvetica, sans-serif; text-align: center;">
                        Reignite the Spark!
                      </h1>
                      <p style="margin: 0 0 20px; font-size: 14px; color: #64748B; font-family: Arial, Helvetica, sans-serif; text-align: center; font-style: italic;">
                        Their curiosity is still there. It just needs a little spark.
                      </p>
                      <p style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1E293B; font-family: Arial, Helvetica, sans-serif;">
                        Hi Tri,
                      </p>
                      <p style="margin: 0 0 24px; font-size: 14px; color: #475569; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">
                        It looks like Donald hasn't had a learning session in 3 days. A quick nudge can make a big difference in keeping their learning momentum going!
                      </p>
                      <p style="margin: 0 0 8px; font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">
                        Donald's Recent Topics
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin: 0 0 24px;">
                        <tr>
                          <td style="padding: 0 0 6px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #E2E8F0; border-left: 3px solid #24A1B6; border-radius: 0 6px 6px 0;">
                                  <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">Presence Basics</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 6px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #E2E8F0; border-left: 3px solid #CA7FCD; border-radius: 0 6px 6px 0;">
                                  <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">Basics of Football</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 0 0 6px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                              <tr>
                                <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #E2E8F0; border-left: 3px solid #6166F3; border-radius: 0 6px 6px 0;">
                                  <p style="margin: 0; font-size: 13px; color: #1E293B; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">Chat with A</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                        <tr>
                          <td align="center" style="padding: 8px 0 24px;">
                            <a href="https://app-dev.abyxolv.com" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #C4A0BF; color: #0F172A; font-family: Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 14px rgba(196,160,191,0.3);">
                              Check on Donald
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 16px 0; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 11px; color: #64748B; font-family: Arial, Helvetica, sans-serif;">
                  This is an automated reminder from A by Xolv.
                </p>
                <p style="margin: 0; font-size: 11px; color: #64748B; font-family: Arial, Helvetica, sans-serif;">
                  <a href="https://app-dev.abyxolv.com/settings/account" target="_blank" style="color: #24A1B6; text-decoration: underline;">Unsubscribe</a> from these reminders.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</div>

</body>
</html>`;
}
