# GitHub Issue #96: Reduce Bottom Taskbar Height to 75%

## Overview
The goal is to reduce the height of the bottom taskbar to 75% of its current value to provide more screen real estate. The current height is 72px, so the new height will be 54px. This change requires updating the Taskbar component styles and ensuring that E2E tests utilizing taskbar height constants are updated to reflect the new dimension.

### Features
- Reduce Taskbar height from 72px to 54px (75%).
- Ensure all taskbar elements (Start button, window buttons, system tray) scale or align correctly within the new height.
- Update collision detection logic in E2E tests to match the new height.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | Change height class `h-[72px]` to `h-[54px]`. Verify internal element alignment. |
| `e2e/tests/window-taskbar-collision.spec.ts` | Update `TASKBAR_HEIGHT` constant from `96` to `54`. |
| `e2e/fixtures/page-objects/DesktopPageObject.ts` | No changes expected, relies on test IDs. |

---

## Architecture Notes
- **Styling**: The taskbar uses Tailwind CSS with arbitrary values (`h-[72px]`). This will be updated to `h-[54px]`.
- **Component Hierarchy**: `Taskbar` contains `StartButton`, `OpenWindows` list, and `SystemTray`. All are flex children with `h-full`, so they should automatically resize.
- **Icon Sizes**:
    - Start Button: 36px icon.
    - Window Buttons: 27px icon.
    - System Tray: 30px icons / 48px wrapper.
    - All these fit comfortably within 54px. Vertical centering is handled by `items-center`.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-96/reduce-taskbar-height`

### Commit Message
- **Subject**: `gitissue-96: reduce taskbar height to 54px`
- **Body**: Reduced taskbar height to 75% of original 72px to improve screen real estate. Updated E2E collision tests to match.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Visual Crowding** | 54px might feel tight for touch targets. Check `min-height` or padding if needed. |
| **E2E Test Failures** | Taskbar collision tests heavily rely on fixed height. Updating the constant is critical. |
| **System Tray Tooltips** | Tooltip positioning (`bottom-[calc(100%+8px)]`) should automatically adjust, but verify it doesn't overlap or gap incorrectly. |

---

## Test Coverage

> [!IMPORTANT]
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.

### Unit Tests (`__tests__/components/win95/Taskbar.test.tsx`)
- [ ] Verify Taskbar renders without crashing.
- [ ] Verify Start button and system tray interaction (existing tests should pass as they don't test height).

### E2E Tests (`e2e/tests/feature.spec.ts`)
- [ ] `e2e/tests/window-taskbar-collision.spec.ts`: Verify windows do not overlap with the new 54px taskbar.
- [ ] `e2e/tests/taskbar-features.spec.ts`: Verify volume slider interaction still works (click coordinates might need slight adjustment if they were hardcoded absolute, but they seem relative to bounding box).

### Test Commands
```bash
npm run test -- Taskbar
npm run test:e2e -- window-taskbar-collision.spec.ts
npm run test:e2e -- taskbar-features.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Update Taskbar height and E2E test constants. Verify visual alignment and test passage.

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch `gitissue-96/reduce-taskbar-height`

### Implementation
- [ ] **Phase 1**: Implement height reduction in `Taskbar.tsx` and update `window-taskbar-collision.spec.ts`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- Taskbar`
- [ ] Run E2E tests: `npm run test:e2e -- window-taskbar-collision.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] Request user approval
- [ ] Create PR & Merge using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
