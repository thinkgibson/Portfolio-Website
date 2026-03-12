# GitHub Issue #141: [Bug]: Wallpaper grid row cut off and incorrect window title

## Overview
The wallpaper display grid in the "Change wallpaper" screen cuts off the 3rd row of options because the window height is too small. Additionally, the window title is incorrect ("Display Properties" instead of "Desktop Wallpaper"). This planning document addresses these issues by updating the window dimensions and title in `OSDesktop.tsx`, as well as fixing the corresponding tests.

### Features
- Update the wallpaper selection window so that all options (5 column by 2 row grid in landscape, and 2 column by 5 row in portrait) and buttons are fully visible without being cut off.
- Change the window title from "Display Properties" to "Desktop Wallpaper".
- Update all relevant unit and E2E tests to reflect the new window title.

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | In `handleOpenWallpaperSelector`: change `title` to `"Desktop Wallpaper"`, and adjust generic `width` and `height` based on testing to fit the new grids. Reduce height to ~430px to minimize blank space in desktop mode. |
| `components/win95/WallpaperSelector.tsx` | Change grid classes from `grid-cols-2 md:grid-cols-5` to `grid-cols-2 min-[1025px]:grid-cols-5` to ensure tablet portrait remains 2 columns. |
| `__tests__/components/win95/OSDesktop.test.tsx` | Update test assertions looking for `"Display Properties"` to look for `"Desktop Wallpaper"`. |
| `e2e/tests/ui-styling.spec.ts` | Update expectations and click targets looking for or waiting for the `"Display Properties"` window to target `"Desktop Wallpaper"`. |
| `e2e/tests/os-interactions.spec.ts` (if applicable) | Update references to the window title if they exist. |

---

## Architecture Notes
- The changes are localized to the configuration object for the `WallpaperSelector` window in `OSDesktop.tsx`.
- The layout is managed via the `Win95Window` component's dimension props and the `WallpaperSelector`'s flex layout. Increasing the height of the parent window will allow the child flex container to display the 3rd row properly.
- No state management or data flow changes are required.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-141/wallpaper-window-fix`

### Commit Message
- **Subject**: `gitissue-141: Fix wallpaper window height, title, and grid`
- **Body**: Updated the wallpaper selection grid to use a responsive 5x2 (landscape) or 2x5 (portrait) layout. Adjusted the window height to ensure options and buttons are visible without being cut off. Updated the window title from "Display Properties" to "Desktop Wallpaper" and adjusted corresponding tests.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Small screen devices (mobile) might have issues with the increased height. | The `OSDesktop` component already handles responsive sizing for mobile (`isMobile ? window.innerHeight * 0.9 : win.height`). Mobile styling remains intact and scrollable. |
| Broken UI tests. | Reviewing and updating both unit and E2E tests ensures that the pipeline remains green. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/OSDesktop.test.tsx`)
- [ ] Ensure the "Desktop Wallpaper" title appears when the wallpaper selector opens.
- [ ] Ensure "Display Properties" is no longer expected.

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Verify that opening the wallpaper selector yields a window titled "Desktop Wallpaper".
- [ ] Visually verify (via snapshot or manual test check) that the full 5x2/2x5 grid of wallpapers is visible without cutting off.

### Test Commands
```bash
npm run test -- OSDesktop
npm run test:e2e
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Update source code (`OSDesktop.tsx`) to implement the height change and title change.
2. **Phase 2**: Update the unit and E2E test suites to expect the new title.
3. **Phase 3**: Verify changes through automated testing and baseline comparison.
4. **Phase 4**: Refine layout for tablet portrait (2 columns) and reduce desktop window height to ~430px.

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Update `components/win95/WallpaperSelector.tsx` to handle the grid layout (5x2 landscape, 2x5 portrait mobile)
- [ ] **Phase 2**: Implement dimensions and title change in `components/win95/OSDesktop.tsx`
- [ ] **Phase 3**: Implement test updates in `__tests__/components/win95/OSDesktop.test.tsx` and `e2e/tests/ui-styling.spec.ts`
- [ ] **Phase 4**: Refine layout for tablet portrait (2 columns) and reduce desktop window height to ~430px
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- filter`
- [ ] Run E2E tests: `npm run test:e2e -- filter`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `feat: description` or `gitissue-{ID}: description`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
