/**
 * =============================================================================
 * EmailPreview (/email)
 * =============================================================================
 *
 * A Gmail-inspired inbox preview that renders the Weekly Digest email template.
 * Internal prototype tool — lets the team see the email as a recipient would,
 * right inside the app with a familiar inbox chrome around it.
 */

import { useState } from "react";
import { ArrowLeft, Star, Archive, Trash2, Clock, MoreVertical, Printer, ExternalLink, ChevronLeft, ChevronRight, Reply, Forward } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ── raw email HTML (inlined so it renders in the iframe) ── */
const EMAIL_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <link href="https://fonts.googleapis.com/css2?family=Literata:wght@400;600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0E17;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color: #0A0E17; padding: 24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width: 600px; width: 100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 0 0 20px;">
              <img src="https://app-dev.abyxolv.com/images/logo.png" alt="A by Xolv" width="80" height="80" style="display: block; max-width: 100%;" />
            </td>
          </tr>

          <!-- Header Card -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(238, 212, 240, 0.12) 0%, rgba(148, 223, 233, 0.12) 50%, rgba(185, 198, 254, 0.12) 100%); background-color: #111827; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 24px 24px; text-align: center;">
              <h1 style="margin: 0 0 6px; font-size: 24px; font-weight: 800; color: #ffffff; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">
                Your Weekly Update
              </h1>
              <p style="margin: 0 0 20px; font-size: 15px; color: #94A3B8; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">
                Hi Vignesh Roachthavilit &#128075; Here's what's new this week!
              </p>

              <!-- Weekly Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td width="50%" style="padding: 0 4px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                      <td style="text-align: center; padding: 10px 4px; background: rgba(238, 212, 240, 0.06); background-color: #140F1A; border-radius: 10px; border: 1px solid rgba(238, 212, 240, 0.08);">
                        <p style="margin: 0; font-size: 26px; font-weight: 800; color: #EED4F0; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">12</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128218; Sessions</p>
                      </td>
                    </tr></table>
                  </td>
                  <td width="50%" style="padding: 0 0 0 4px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                      <td style="text-align: center; padding: 10px 4px; background: rgba(148, 223, 233, 0.06); background-color: #0D1520; border-radius: 10px; border: 1px solid rgba(148, 223, 233, 0.08);">
                        <p style="margin: 0; font-size: 26px; font-weight: 800; color: #94DFE9; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">2h 45m</p>
                        <p style="margin: 4px 0 0; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#9200; Learning</p>
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 16px;"></td></tr>

          <!-- Child 1: Vivaan -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 14px;">
                <tr><td style="height: 3px; background: linear-gradient(90deg, #EED4F0, #94DFE9, #B9C6FE); background-color: #EED4F0; border-radius: 3px;"></td></tr>
                <tr>
                  <td style="background: rgba(15, 23, 42, 0.6); background-color: #0F172A; border: 1px solid rgba(255, 255, 255, 0.06); border-top: none; border-radius: 0 0 12px 12px; padding: 18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 10px;">
                      <tr>
                        <td style="padding: 0 12px 0 0; vertical-align: middle;" width="36">
                          <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="36"><tr>
                            <td width="36" height="36" style="width: 36px; height: 36px; max-width: 36px; background: linear-gradient(135deg, #EED4F0 0%, #CA7FCD 100%); background-color: #CA7FCD; border-radius: 18px; text-align: center; vertical-align: middle;">
                              <p style="margin: 0; font-size: 14px; font-weight: 800; color: #1E293B; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif; line-height: 36px;">VS</p>
                            </td>
                          </tr></table>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Vivaan Sharma</p>
                        </td>
                        <td style="vertical-align: middle; text-align: right;" width="80">
                          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="display: inline-block;">
                            <tr><td style="padding: 4px 10px; background: rgba(148, 223, 233, 0.08); background-color: #0D1520; border-radius: 12px; border: 1px solid rgba(148, 223, 233, 0.1);">
                              <p style="margin: 0; font-size: 13px; color: #94DFE9; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif; white-space: nowrap;">&#128994; 5 active days</p>
                            </td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Stat pills -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
                      <tr>
                        <td width="50%" style="padding: 0 4px 6px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(238, 212, 240, 0.08); background-color: #140F1A; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #EED4F0; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128218; 8 sessions</p>
                            </td>
                          </tr></table>
                        </td>
                        <td width="50%" style="padding: 0 0 6px 4px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(148, 223, 233, 0.08); background-color: #0D1520; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #94DFE9; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#9200; 1h 52m</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding: 0 4px 0 0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(185, 198, 254, 0.08); background-color: #0E1225; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #B9C6FE; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#127891; 5 lessons</p>
                            </td>
                          </tr></table>
                        </td>
                        <td width="50%" style="padding: 0 0 0 4px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(238, 212, 240, 0.06); background-color: #12101C; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #CA7FCD; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128172; 3 chats</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 10px;">
                      <tr><td style="height: 1px; background: linear-gradient(90deg, rgba(148, 223, 233, 0.2), rgba(185, 198, 254, 0.1), transparent); background-color: #1A2332;"></td></tr>
                    </table>

                    <p style="margin: 0 0 8px; font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128161; Lessons Explored</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
                      <tr><td style="padding: 10px 14px; background: rgba(148, 223, 233, 0.06); background-color: #0D1320; border-left: 3px solid #94DFE9; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.4; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">The Solar System and Planets</p>
                      </td></tr>
                      <tr><td style="height: 6px;"></td></tr>
                      <tr><td style="padding: 10px 14px; background: rgba(238, 212, 240, 0.06); background-color: #110E1E; border-left: 3px solid #EED4F0; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.4; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Addition and Subtraction</p>
                      </td></tr>
                      <tr><td style="height: 6px;"></td></tr>
                      <tr><td style="padding: 10px 14px; background: rgba(185, 198, 254, 0.06); background-color: #0E1225; border-left: 3px solid #B9C6FE; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.4; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Animals and Their Habitats</p>
                      </td></tr>
                      <tr><td style="height: 6px;"></td></tr>
                    </table>

                    <p style="margin: 0 0 8px; font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#129504; New Memories</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr><td style="padding: 10px 14px; background: rgba(185, 198, 254, 0.06); background-color: #0E1225; border-left: 3px solid #B9C6FE; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.5; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#8220;Vivaan loves learning about space and can name all 8 planets in order&#8221;</p>
                      </td></tr>
                      <tr><td style="height: 8px;"></td></tr>
                      <tr><td style="padding: 10px 14px; background: rgba(148, 223, 233, 0.06); background-color: #0D1320; border-left: 3px solid #94DFE9; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.5; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#8220;Gets excited when solving math problems and prefers visual examples with objects&#8221;</p>
                      </td></tr>
                      <tr><td style="height: 8px;"></td></tr>
                      <tr><td style="padding: 10px 14px; background: rgba(238, 212, 240, 0.06); background-color: #110E1E; border-left: 3px solid #EED4F0; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.5; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#8220;Vivaan mentioned he has a pet dog named Buddy and loves taking him for walks&#8221;</p>
                      </td></tr>
                      <tr><td style="height: 8px;"></td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Child 2: Maya -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 14px;">
                <tr><td style="height: 3px; background: linear-gradient(90deg, #EED4F0, #94DFE9, #B9C6FE); background-color: #EED4F0; border-radius: 3px;"></td></tr>
                <tr>
                  <td style="background: rgba(15, 23, 42, 0.6); background-color: #0F172A; border: 1px solid rgba(255, 255, 255, 0.06); border-top: none; border-radius: 0 0 12px 12px; padding: 18px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 10px;">
                      <tr>
                        <td style="padding: 0 12px 0 0; vertical-align: middle;" width="36">
                          <table cellpadding="0" cellspacing="0" border="0" role="presentation" width="36"><tr>
                            <td width="36" height="36" style="width: 36px; height: 36px; max-width: 36px; background: linear-gradient(135deg, #EED4F0 0%, #CA7FCD 100%); background-color: #CA7FCD; border-radius: 18px; text-align: center; vertical-align: middle;">
                              <p style="margin: 0; font-size: 14px; font-weight: 800; color: #1E293B; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif; line-height: 36px;">MS</p>
                            </td>
                          </tr></table>
                        </td>
                        <td style="vertical-align: middle;">
                          <p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Maya Sharma</p>
                        </td>
                        <td style="vertical-align: middle; text-align: right;" width="80">
                          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="display: inline-block;">
                            <tr><td style="padding: 4px 10px; background: rgba(148, 223, 233, 0.08); background-color: #0D1520; border-radius: 12px; border: 1px solid rgba(148, 223, 233, 0.1);">
                              <p style="margin: 0; font-size: 13px; color: #94DFE9; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif; white-space: nowrap;">&#128994; 3 active days</p>
                            </td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
                      <tr>
                        <td width="50%" style="padding: 0 4px 6px 0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(238, 212, 240, 0.08); background-color: #140F1A; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #EED4F0; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128218; 4 sessions</p>
                            </td>
                          </tr></table>
                        </td>
                        <td width="50%" style="padding: 0 0 6px 4px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(148, 223, 233, 0.08); background-color: #0D1520; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #94DFE9; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#9200; 53m</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding: 0 4px 0 0;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(185, 198, 254, 0.08); background-color: #0E1225; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #B9C6FE; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#127891; 3 lessons</p>
                            </td>
                          </tr></table>
                        </td>
                        <td width="50%" style="padding: 0 0 0 4px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                            <td style="padding: 6px 12px; background: rgba(238, 212, 240, 0.06); background-color: #12101C; border-radius: 20px; text-align: center;">
                              <p style="margin: 0; font-size: 15px; color: #CA7FCD; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128172; 1 chat</p>
                            </td>
                          </tr></table>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 10px;">
                      <tr><td style="height: 1px; background: linear-gradient(90deg, rgba(148, 223, 233, 0.2), rgba(185, 198, 254, 0.1), transparent); background-color: #1A2332;"></td></tr>
                    </table>

                    <p style="margin: 0 0 8px; font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#128161; Lessons Explored</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom: 12px;">
                      <tr><td style="padding: 10px 14px; background: rgba(148, 223, 233, 0.06); background-color: #0D1320; border-left: 3px solid #94DFE9; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.4; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Colors and Shapes</p>
                      </td></tr>
                      <tr><td style="height: 6px;"></td></tr>
                      <tr><td style="padding: 10px 14px; background: rgba(238, 212, 240, 0.06); background-color: #110E1E; border-left: 3px solid #EED4F0; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.4; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Counting to 20</p>
                      </td></tr>
                      <tr><td style="height: 6px;"></td></tr>
                    </table>

                    <p style="margin: 0 0 8px; font-size: 12px; color: #64748B; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#129504; New Memories</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                      <tr><td style="padding: 10px 14px; background: rgba(185, 198, 254, 0.06); background-color: #0E1225; border-left: 3px solid #B9C6FE; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.5; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#8220;Maya's favorite color is purple and she loves drawing butterflies&#8221;</p>
                      </td></tr>
                      <tr><td style="height: 8px;"></td></tr>
                      <tr><td style="padding: 10px 14px; background: rgba(148, 223, 233, 0.06); background-color: #0D1320; border-left: 3px solid #94DFE9; border-radius: 0 6px 6px 0;">
                        <p style="margin: 0; font-size: 14px; color: #CBD5E1; line-height: 1.5; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">&#8220;She can count to 15 independently and is working on numbers 16-20&#8221;</p>
                      </td></tr>
                      <tr><td style="height: 8px;"></td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 8px 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 14px; font-size: 14px; color: #94A3B8; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">Click below to view more details</p>
                    <a href="https://app-dev.abyxolv.com/dashboard/?role=parent" target="_blank" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #EED4F0 0%, #CA7FCD 100%); background-color: #CA7FCD; color: #1E293B; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 9999px; box-shadow: 0 4px 14px rgba(238, 212, 240, 0.3);">
                      View Full Dashboard &#8594;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 16px 0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569; font-family: 'Literata', 'Nunito', 'Segoe UI', Tahoma, sans-serif;">
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

const EmailPreview = () => {
  const navigate = useNavigate();
  const [starred, setStarred] = useState(false);

  return (
    <div className="flex h-screen w-screen flex-col bg-[#f6f8fc]">
      {/* ── Gmail-style top bar ── */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Archive className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Trash2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><Clock className="h-4 w-4" /></Button>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span>1 of 24</span>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* ── Email thread view ── */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-[900px] px-6 py-6">
          {/* Subject line */}
          <div className="mb-4 flex items-start gap-3">
            <h1 className="text-xl font-normal text-gray-900">
              Your Weekly Update — A by Xolv
            </h1>
            <span className="mt-1 rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">Inbox</span>
          </div>

          {/* ── Sender bar ── */}
          <div className="mb-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-xolv-magenta-500 text-sm font-bold text-white">
                AX
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">A by Xolv</span>
                <span className="text-xs text-gray-500">&lt;digest@abyxolv.com&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>to me</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Mar 17, 2026, 8:00 AM</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setStarred(!starred)}
              >
                <Star className={`h-4 w-4 ${starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><Reply className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* ── Email body (rendered in sandboxed iframe) ── */}
          <div className="rounded-lg border border-gray-200 bg-white">
            <iframe
              title="Email Preview"
              srcDoc={EMAIL_HTML}
              className="w-full border-0"
              style={{ minHeight: "1400px" }}
              sandbox="allow-same-origin"
            />
          </div>

          {/* ── Reply / Forward bar ── */}
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="gap-2 text-gray-600">
              <Reply className="h-4 w-4" /> Reply
            </Button>
            <Button variant="outline" className="gap-2 text-gray-600">
              <Forward className="h-4 w-4" /> Forward
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EmailPreview;
