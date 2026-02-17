# GitHub Issue #113: Wallpaper Selection UI Elements Misaligned/Undersized in Display Properties

## Overview

The `WallpaperSelector` component has excessive padding/spacing that prevents its UI elements from properly filling the Display Properties window. The root cause is **double padding**: `Win95Window` adds `p-4` + `m-1` around non-`fullBleed` content, and `WallpaperSelector` itself adds another `p-4` on its root div, plus `gap-4` and `mt-4` internally. This creates ~32px of padding on all sides, making the content appear "too small."

### Features
- Reduce internal padding in `WallpaperSelector` to properly fill the bounding box
- Ensure the wallpaper grid, message text, and buttons are well-sized within the window

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/WallpaperSelector.tsx` | Reduce `p-4` to `p-1`, `gap-4` to `gap-2`, and `mt-4` to `mt-2`. Increase font sizes: description `text-[12px]` -> `text-[18px]`, wp name `text-[10px]` -> `text-[14px]`, buttons `text-[12px]` -> `text-[18px]` |

---

## Architecture Notes

- `Win95Window` uses `fullBleed` prop to control whether it wraps children in a padded/beveled container (`m-1 p-4`)
- The wallpaper selector does **not** use `fullBleed`, so `Win95Window` already provides outer padding
- The fix is purely CSS class adjustments inside `WallpaperSelector.tsx` — remove the redundant internal padding so the component defers to the window's built-in spacing
- No state, props, or component hierarchy changes needed

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-113/fix-wallpaper-selector-spacing`

### Commit Message
- **Subject**: `gitissue-113: fix wallpaper selector padding/spacing`
- **Body**: Reduce internal padding in WallpaperSelector to eliminate double-padding with Win95Window container

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Wallpaper grid items may become too cramped | Visual verification via E2E screenshot; keep `gap-2` on the grid itself |
| Buttons may crowd the bottom edge | Keep `mt-2` for the button row to maintain minimal separation |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Add test: "wallpaper selector content should fill the window properly" — open Display Properties, verify the wallpaper grid container takes up most of the available space (e.g., check bounding box dimensions relative to the window)

### Test Commands
```bash
npm run test -- WallpaperSelector
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Reduce padding/spacing in `WallpaperSelector.tsx`
2. **Phase 2**: Add E2E test for wallpaper selector layout
3. **Phase 3**: Run tests and baseline comparison

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [x] **Phase 1**: Reduce padding classes in `WallpaperSelector.tsx` (`p-4` → `p-1`, `gap-4` → `gap-2`, `mt-4` → `mt-2`)
- [ ] **Phase 1.5**: Increase font sizes in `WallpaperSelector.tsx` (description to `text-[18px]`, names to `text-[14px]`, buttons to `text-[18px]`)
- [ ] **Phase 2**: Add E2E test in `e2e/tests/ui-styling.spec.ts` to verify wallpaper selector fills its window
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- WallpaperSelector`
- [ ] Run E2E tests: `npm run test:e2e -- ui-styling.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-113: fix wallpaper selector padding/spacing`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
