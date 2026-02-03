# Git Issue #82: Taskbar Collision Fix Regressions

## Overview
Recent changes to window constraint logic have caused regressions where windows can be dragged into the taskbar or fail to reposition when the viewport is resized. This plan addresses these issues by ensuring reliable constraint mechanisms and responsive positioning.

### Features
- Ensure windows cannot be dragged behind the taskbar.
- Implement auto-repositioning of windows when the viewport shrinks (e.g., resizing browser window) to keep them visible / above taskbar.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Win95Window.tsx` | Add `window` resize listener to re-calculate constraints and clamp position. Ensure `dragConstraints` updates trigger re-evaluation. |
| `components/os/OSDesktop.tsx` | (Optional) Verify if it passes explicit constraints or manages window state that might need updates. |

---

## Architecture Notes
- `Win95Window` currently calculates constraints based on `window.innerHeight` but does not listen for resize events.
- On resize, the constraints must be re-evaluated, and if the current position is invalid, `onPositionChange` should be called to clamp it.

---

## Verification Plan

### Automated Tests
- Run `npm run test:e2e -- e2e/tests/window-taskbar-collision.spec.ts`
- Expect current failures to pass.

### Manual Verification
1. Open "Welcome.txt".
2. Resize browser window vertically.
3. Verify window moves up to stay above taskbar.
4. Try to drag window into taskbar.
5. Verify it stops or snaps back.

---

## Git Branch/Commit/Merge Instructions
- Branch: `gitissue-82/fix-collision-regressions`
- Commit: `gitissue-82: Fix window taskbar collision and resize behavior`

