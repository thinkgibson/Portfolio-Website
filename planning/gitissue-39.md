# Git Issue #39: Reduce mouse clicking trigger

## Overview
Currently, the website plays a mouse click sound on every mouse click globally. This change will restrict the sound trigger to only specific events: clicking desktop icons, clicking the Start button, and opening/closing applications.

### Features
- Remove global `mousedown` sound trigger.
- Add sound trigger for Start Menu button clicks.
- Add sound trigger for Desktop Icon clicks (opening apps).
- Add sound trigger for Taskbar item clicks (minimizing/restoring apps).
- Add sound trigger for closing application windows.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Remove global `mousedown` listener; add sound triggers to Start Button, window opening, and window closing handlers. |
| `components/win95/Taskbar.tsx` | Update component interface or props if necessary to handle sound triggers (though likely handled in `OSDesktop.tsx` via props). |

---

## Architecture Notes
- The `SoundSystem` is accessed via `useOS()` context in `OSDesktop.tsx`.
- We will centralize the sound-triggering logic in `OSDesktop.tsx` by wrapping the window management functions (`handleOpenWindow`, `handleCloseWindow`, `onStartClick`) with `playSound("click")`.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

**For GitHub Issues:**
1. **Create Branch**: `git checkout -b gitissue-39/reduce-click-sounds`
2. **Commit Format**: `git commit -m "gitissue-39: reduce mouse click triggers to specific events"`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Missing click sounds on certain interactions | Thorough manual testing of all UI elements (icons, start menu, taskbar). |
| Conflicts with specific app click sounds | Ensure global reduction doesn't affect apps that might have their own internal sounds (e.g., Music Player). |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/OSDesktop.test.tsx`)
- [ ] Verify `playSound("click")` is called when Start Button is clicked.
- [ ] Verify `playSound("click")` is called when a Desktop Icon is clicked.
- [ ] Verify `playSound("click")` is called when a window is closed.
- [ ] Verify `playSound("click")` is *not* called on a generic background click.

### E2E Tests (`e2e/tests/sound-system.spec.ts`)
- [ ] Manual verification required for sound playback until specialized audio testing is implemented.

### Test Commands
```bash
npm run test -- OSDesktop
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Create branch `gitissue-39/reduce-click-sounds`
- [ ] Remove global `mousedown` listener in `OSDesktopView` (lines 433-440 of `OSDesktop.tsx`).
- [ ] In `OSDesktopView`, update `handleOpenWindow` calls in `DesktopIcon`, `StartMenu`, and `Taskbar` to include `playSound("click")`.
- [ ] In `OSDesktopView`, update the `onStartClick` prop in `Taskbar` to include `playSound("click")`.
- [ ] In `OSDesktopView`, update the `onClose` prop in `Win95Window` to include `playSound("click")`.
- [ ] Verify all tests pass.
- [ ] Perform manual sound check.
