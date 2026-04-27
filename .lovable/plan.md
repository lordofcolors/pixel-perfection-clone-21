# Plan: 10-Minute Session Timer in /chat

Add a compact MM:SS timer to the bottom toolbar that counts up from `00:00`, turns red at `08:00`, and triggers a "Time's Up" modal at `10:00`. Also reorder the toolbar so **Disconnect** sits at the far right with the **Timer to its left**.

## Toolbar Layout Change

Current order (in `VideoConferenceToolbar.tsx`):
```text
[Mute]  [Disconnect]  [Webcam]  [Share Screen]
```

New order — Disconnect moves to far right, timer sits just left of it:
```text
[Mute]  [Webcam]  [Share Screen]  [⏱ 00:00]  [Disconnect]
```

The toolbar currently uses `justify-center` with fixed-width 80px slots per button. To avoid "auto-shifting everything" when the timer is added, keep `justify-center` and add the timer + reordered disconnect as two more items in the same flex row. The whole cluster stays centered but visually balanced.

## Timer Design

- **Format**: `MM:SS` starting at `00:00`, ticking up every 1s (so user sees `00:00`, `00:01`, `00:02`…).
- **Size**: small — same text size as the existing toolbar labels area; uses tabular/mono numerals so digits don't jitter as they change. Roughly `text-sm font-mono tabular-nums` with the same uppercase micro-label ("TIME") underneath, matching the visual rhythm of the other toolbar items.
- **States**:
  - `00:00` → `07:59` — neutral color (`text-muted-foreground`).
  - `08:00` → `09:59` — red (`text-destructive`), optional subtle pulse to signal urgency.
  - `10:00` — timer stops, "Time's Up" modal opens, session is ended.
- **Slot width**: same ~80px column as the other toolbar items so it visually matches.

## Time's Up Modal

A new lightweight modal (separate from the existing `ContinueLearningModal`):
- Title: **"Time's Up!"**
- Body: Short message — e.g. "You've reached your 10-minute session limit. Great work!"
- Primary CTA: **End Session** → triggers the same `handleDisconnect()` flow already in `useChatSession`, which transitions to `SessionEndedView`.
- Secondary CTA (optional): **Back to Home** → navigates to `/`.
- Style: matches existing dark modal pattern (`bg-card border border-border/50 rounded-2xl`), centered, `z-50` overlay, no close-X (must take an action).

## Behavior Details

- Timer starts when the chat content becomes visible (after the loading sequence completes — i.e. when `showContent` is true), not while the loading overlay is showing.
- Timer pauses/cleans up if the user manually disconnects before 10:00.
- Timer state lives in `ChatPage` (or a small `useSessionTimer` hook) so the toolbar and the time-up modal can both read it.
- At 10:00, the modal opens but `sessionEnded` is NOT auto-flipped — user clicks the CTA to end. (This matches the existing pattern where `handleDisconnect` is the single source of truth for ending.)

## Technical Details

Files to change / add:
1. **`src/hooks/useSessionTimer.ts`** *(new)* — small hook: `{ elapsedSeconds, formatted, isWarning, isExpired, start, stop }`. Uses `setInterval`, cleans up on unmount.
2. **`src/components/chat/SessionTimer.tsx`** *(new)* — presentational component rendering the MM:SS display in the toolbar slot style (icon + mono digits + uppercase micro-label). Accepts `seconds` and `isWarning` props.
3. **`src/components/chat/TimeUpModal.tsx`** *(new)* — modal component with the End Session CTA.
4. **`src/components/chat/VideoConferenceToolbar.tsx`** *(edit)* — reorder buttons (Mute, Webcam, Share Screen, Timer, Disconnect) and inject `<SessionTimer />` into the new slot.
5. **`src/pages/ChatPage.tsx`** *(edit)* — instantiate `useSessionTimer`, start it when `session.showContent` flips true, render `<TimeUpModal>` when `isExpired`, wire the modal CTA to `session.handleDisconnect`.

No backend, schema, or auth changes. Pure client-side.

## Out of Scope

- Persisting timer across refresh (each session restarts at 00:00).
- Configurable session lengths (hard-coded 10 min for now).
- Audio/notification at 8-minute mark (visual red only).
