

# Plan: Generate Dark-Mode Nudge Email HTML File

Take the uploaded light-mode HTML structure (nudge-email-preview-3.html) and apply all the dark-mode styles from the current preview to produce a standalone HTML file.

## Style Mapping (uploaded structure -> dark preview styles)

| Element | Uploaded (light) | Dark preview |
|---|---|---|
| Page body bg | `#f1f5f9` | `#030817` |
| Email wrapper bg | `#ffffff` | `#030817` |
| Card bg | `#F8FAFC` with `border: 1px solid #E2E8F0` | `#030817` with `border: none` |
| Logo | `logo.png` 80x80, padding `0 0 20px` | `a-robot.gif` 200x200, padding `32px 0 28px` |
| H1 | Solid `#1E293B` | Gradient text (`#EED4F0 -> #94DFE9 -> #B9C6FE`) with `-webkit-background-clip: text` |
| Quote/subtitle | Solid `#64748B` | Same gradient text as H1 |
| Greeting ("Hi ...") | `#1E293B`, bold 16px | `#94DFE9`, normal weight 14px |
| Body text | `#475569` | `#94DFE9` |
| "Recent Topics" label | `#64748B` | `#B9C6FE` |
| Topic cards bg | `#ffffff`, border `#E2E8F0` | `#1e293b`, border `#334155` |
| Topic card text | `#1E293B` | `#e2e8f0` |
| Topic left borders | `#24A1B6`, `#CA7FCD`, `#6166F3` | `#94DFE9`, `#EED4F0`, `#B9C6FE` |
| CTA button | Solid `#C4A0BF`, text "Start Learning" / "Check on Donald" | Gradient bg, text "Jump Back In 🚀" / "Check on Donald" |
| Unsubscribe link | `#24A1B6` | `#94DFE9` |
| `.email-frame` border | `#e2e8f0` | `#1e293b` |

## Deliverable

Write the final HTML to `/mnt/documents/nudge-email-dark.html` -- a standalone file with the same table structure as the uploaded file, all dark-mode inline styles applied, ready to copy-paste for email delivery. Both learner and parent emails included.

## Technical Details

- Use `code--exec` to write the file directly
- Add `color-scheme: only light` meta tags to prevent email client theme flipping
- All styles fully inline, no CSS classes inside email bodies
- Keep the wrapper/label/subject chrome (`.pair-wrapper`, `.pair-label`, `.subject-preview`) as-is from the dark preview

