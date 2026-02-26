

## Swap Rive Animation File

Replace the current `robocat.riv` animation with the newly uploaded file while keeping all existing code logic intact.

### Changes

1. **Copy the new `.riv` file** to `public/animations/robocat.riv`, overwriting the existing file. Since the code already references `/animations/robocat.riv`, no code changes are needed if we keep the same filename.

### What stays the same
- All loading states, timing, and transitions
- The `useRive` hook configuration (artboard "Catbot", state machine "State Machine")
- The fade-in, slide-down animation sequence
- The greeting typewriter effect
- The chat input and action buttons

### Risk
- If the new `.riv` file uses different artboard or state machine names, the animation won't play. If that happens, we'll need to inspect and update those references.

