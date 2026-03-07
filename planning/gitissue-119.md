# GitHub Issue #119: Start Menu folders close menu on mobile tap instead of expanding

## Overview
On mobile devices, tapping a folder in the Start Menu (items with children) incorrectly closes the entire Start Menu instead of expanding the submenu. This is caused by the click event on the menu item bubbling up to the desktop container, which has a click handler designed to close the Start Menu when clicking outside.

### Features
- Prevent Start Menu from closing when tapping a folder item on mobile.
- Ensure submenus toggle correctly on mobile tap.
- Maintain existing desktop behavior (hover for submenus, click to open apps).

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/StartMenu.tsx` | Add `e.stopPropagation()` to the `onClick` handler of menu items. |
| `components/win95/StartSubMenu.tsx` | Add `e.stopPropagation()` to the `onClick` handler of submenu items. |

---

## Architecture Notes
- The `OSDesktop` component wraps the entire desktop area, including the Start Menu, in a `div` with an `onClick` handler that closes the Start Menu (`setIsStartMenuOpen(false)`).
- React events bubble up the tree. A click on a Start Menu item bubbles to the `OSDesktop` container.
- By calling `e.stopPropagation()` on the menu item's click event, we prevent the event from reaching the `OSDesktop` handler, thus keeping the menu open.
- We must ensure that valid app clicks (leaf nodes) still work. `onItemClick` is passed down and handles app opening. We should also `stopPropagation` for leaf nodes if we want to prevent the generic "close on outside click" logic, but `onItemClick` usually handles closing the menu explicitly (line 57 of `StartMenu.tsx`). To be safe and consistent, checking if we need to stop propagation there too. Actually, for leaf nodes, `onClose()` is called explicitly, so bubbling doesn't matter as much, but stopping it is cleaner. However, the issue is specific to *folders* which *toggle* the submenu and should *not* close the menu.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-119/start-menu-mobile-fix`

### Commit Message
- **Subject**: `gitissue-119: prevent start menu close on folder tap`
- **Body**: Added stopPropagation to StartMenu and StartSubMenu item click handlers to prevent bubbling to desktop container.

---

## Possible Risks & Conflicts
- **Risk**: `stopPropagation` might prevent other intended side effects if any exist higher up (unlikely for the desktop container click).
- **Risk**: The existing E2E test `start-menu-folders.spec.ts` currently passes, which is confusing. We need to understand why it passes and ensure we have a test that *would* fail without the fix, or improve the existing test.

| Risk | Mitigation |
|------|------------|
| E2E test false positive | Create a reproduction test case that explicitly verifies the bubbling behavior or use `tap` if supported, or ensure the test environment correctly matches the mobile constraints. |

---

## Test Coverage

> [!IMPORTANT]
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.

### Unit Tests
- `__tests__/components/win95/StartMenu.test.tsx`:
    - Update or add a test case that simulates a click on a folder item and verifies `stopPropagation` is called on the event.

### E2E Tests
- `e2e/tests/start-menu-folders.spec.ts`:
    - Use the existing "should open submenu on click (Mobile only)" test.
    - We might need to enhance it to ensure it strictly fails if the menu closes.

### Test Commands
```bash
npm run test -- StartMenu
npm run test:e2e -- start-menu-folders.spec.ts
```

---

## Execution Phases
1.  **Phase 1**: Implementation
    - Create branch.
    - Modify `StartMenu.tsx` and `StartSubMenu.tsx` to stop propagation.
2.  **Phase 2**: Verification
    - Run unit tests and E2E tests.
    - Verify the fix against the reproduction steps (using the test).

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch `gitissue-119/start-menu-mobile-fix`

### Implementation
- [x] **Phase 1**: Add `e.stopPropagation()` to `StartMenu.tsx` item click handler.
- [x] **Phase 1**: Add `e.stopPropagation()` to `StartSubMenu.tsx` item click handler.
- [x] Verify implementation against "Expected Code Changes"

### Verification
- [x] Run unit tests: `npm run test -- StartMenu` (All passed)
- [x] Run E2E tests: `npm run test:e2e -- start-menu-folders.spec.ts` (All passed)
- [x] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) (No regressions found on v2 branch)

### Submission
- [x] Commit changes (Format: `gitissue-119: prevent start menu close on folder tap`)
- [ ] Move the issue to "in review" using the update-git-issue skill (Skipped: label missing)
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue
- [ ] Move the issue to "done" using the update-git-issue skill
