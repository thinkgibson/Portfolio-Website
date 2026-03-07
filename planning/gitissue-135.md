# GitHub Issue #135: Start Menu Folder Popout Cut Off on Mobile Portrait

## Overview

On mobile portrait mode (narrow viewports), the Start Menu's folder submenu renders to the right of (`left-full`) the parent menu. This causes it to overflow beyond the right edge of the screen and be clipped. The fix is to detect horizontal overflow and reposition the submenu **above** the parent menu item on mobile, keeping desktop behavior unchanged.

### Features

- On mobile: submenu renders **above** the parent Start Menu rather than to the right
- On desktop: existing right-side positioning is preserved
- Submenu remains fully within the viewport bounds at all times

---

## Expected Code Changes

### New Files

_None_

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/StartSubMenu.tsx` | Add horizontal overflow detection via `useLayoutEffect`; apply conditional positioning on mobile (render above/overlapping the start menu instead of to the right) |
| `__tests__/components/win95/StartSubMenu.test.tsx` | **New** unit test file: test that submenu uses mobile positioning when `isMobile` is true, and desktop `left-full` positioning otherwise |
| `e2e/tests/start-menu-folders.spec.ts` | Update mobile E2E test to assert submenu is within the viewport (no `force: true` needed for clicking) |

---

## Architecture Notes

### Root Cause

`StartSubMenu.tsx` line 83 applies Tailwind class `left-full` unconditionally. This positions the submenu immediately to the right of the parent item. On a narrow mobile screen (e.g., 375px wide), the Start Menu itself is 256px (`w-64`), leaving only ~119px to the right, which is far less than the submenu's own 256px width.

The existing `useLayoutEffect` only checks **vertical** overflow (`rect.bottom > threshold`) and skips execution on mobile (`if (!menuRef.current || isMobile) return`).

### Fix Strategy

In `StartSubMenu.tsx`:

1. Add a `positionStyle` state that tracks both `top` and `left` overrides.
2. Enhance the `useLayoutEffect` to run on both desktop and mobile.
3. On mobile:
   - Use `window.innerWidth` to calculate an offset that aligns the **right edge** of the submenu with the **right edge** of the screen.
   - Set `left` to `window.innerWidth - [submenu width]`.
   - Set `bottom` to `100%` (and `top` to `auto`) to place it above the parent row.
4. Keep the existing vertical adjustment logic for desktop.

Simplest viable approach: on mobile, switch from `position: absolute; left: 100%` to calculated `left` and `bottom: 100%`.

> **Alternative**: pass a `parentRef` from `StartMenu` to allow measuring the Start Menu panel bounds, but this adds unnecessary coupling. The simpler CSS repositioning on mobile is preferred.

### Component Hierarchy

```
StartMenu (fixed, bottom-left)
  └── [menu item row] (relative)
        └── StartSubMenu (absolute, currently left-full)
```

---

## Git Branch & Commit Strategy

### Branch Name
`gitissue-135/fix-mobile-submenu-overflow`

### Commit Message
- **Subject**: `gitissue-135: fix Start Menu submenu overflow on mobile portrait`
- **Body**: Reposition submenu to render above parent item on mobile instead of to the right, preventing it from being clipped by the viewport edge.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Submenu positioned above may partially overlap Start Menu items | Ensure `z-index` (`z-[151]`) remains higher than menu; visually acceptable Win95 pattern |
| If Start Menu is near top of screen on mobile, submenu could clip upward | Rare (menu is `fixed bottom-12`), but add a fallback clamp if `top` value goes above 0 |
| `useLayoutEffect` SSR warning | Already present in the file; no change needed |
| Existing desktop positioning regression | Desktop path is entirely unchanged; guarded by `if (isMobile)` branch |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md).
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fix**: Must include new unit + E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/StartSubMenu.test.tsx`)
New test file (none exists currently):
- [ ] Renders submenu items correctly
- [ ] On mobile (`useIsMobile` = true): submenu has `left: 0` style override (not `left-full` default)
- [ ] On desktop (`useIsMobile` = false): submenu does not override left position (uses CSS class default)
- [ ] Clicking a submenu leaf item calls `onItemClick` and `onClose`
- [ ] Clicking a submenu folder item toggles nested submenu

### E2E Tests (`e2e/tests/start-menu-folders.spec.ts`)
Update existing mobile test:
- [ ] On mobile (375×667): open Start Menu → tap "Accessories" → assert submenu (`start-submenu-depth-1`) is **fully within viewport** (no part clipped beyond right edge)
- [ ] On mobile: tap a submenu item without `force: true` and verify application opens

### Test Commands
```bash
# Unit tests
npm run test -- StartSubMenu

# E2E tests (mobile project)  
npm run test:e2e -- start-menu-folders.spec.ts

# Full CI
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1 — Fix**: Update `StartSubMenu.tsx` to use conditional positioning on mobile (above parent row instead of to the right)
2. **Phase 2 — Unit Tests**: Create `__tests__/components/win95/StartSubMenu.test.tsx` covering positioning behavior and item interactions
3. **Phase 3 — E2E Update**: Update mobile E2E test in `start-menu-folders.spec.ts` to assert submenu is in-viewport and remove `force: true` click

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Fix `StartSubMenu.tsx` — conditional mobile positioning in `useLayoutEffect` + className
- [ ] **Phase 2**: Create `__tests__/components/win95/StartSubMenu.test.tsx` with unit tests
- [ ] **Phase 3**: Update `e2e/tests/start-menu-folders.spec.ts` mobile test — assert in-viewport, remove `force: true`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- StartSubMenu`
- [ ] Run E2E tests: `npm run test:e2e -- start-menu-folders.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval — DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to GitHub issue using the update-git-issue skill
- [ ] Move issue to "done" using the update-git-issue skill
