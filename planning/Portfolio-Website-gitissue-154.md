# GitHub Issue #154: Temporary wallpaper preview in Wallpaper Selector

## Overview
This feature allows users to see a live preview of a wallpaper on the desktop as they select different options in the "Desktop Wallpaper" window. The change only becomes permanent if "Apply" is clicked; otherwise, it reverts to the original wallpaper when the window is closed or "Cancel" is clicked.

### Features
- Live desktop wallpaper update on selection in `WallpaperSelector`.
- Reversion to original wallpaper on window close/cancel.
- Permanent save only on "Apply".
- No persistence to local storage during preview.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `e2e/tests/wallpaper-preview.spec.ts` | E2E tests for wallpaper preview and reversion logic. |

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Add `previewWallpaper` state. Update `OSDesktopView` to prioritize `previewWallpaper` for background styles. Pass `onPreview` to `WallpaperSelector`. Clear preview when selector window closes. |
| `components/win95/WallpaperSelector.tsx` | Add `onPreview` prop. Call `onPreview` inside `onClick` handler for wallpaper options. |
| `components/win95/ContextMenu.tsx` | Fix overlay `pointer-events` and event handlers to ensure reliably closing on outside clicks. |
| `__tests__/components/win95/Taskbar.test.tsx` | Update "click outside" test to use `pointerDown` for robustness. |

---

## Architecture Notes
- **State Management**: `OSDesktop` will hold `previewWallpaper` (type: `Wallpaper | null`).
- **Data Flow**:
    1. `WallpaperSelector` triggers `onPreview(wp)` when a user clicks a thumbnail.
    2. `OSDesktop` updates `previewWallpaper` state.
    3. `OSDesktopView` renders background using `previewWallpaper || wallpaper`.
    4. On "Apply", `onApply` is called, `OSDesktop` updates the persistent `wallpaper` state (localStorage) and closes the window.
    5. On "Cancel" or window close, `previewWallpaper` is reset to `null`.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-154/wallpaper-preview`

### Commit Message
- **Subject**: `gitissue-154: implement temporary wallpaper preview`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Memory leaks if preview is not cleared | Ensure `handleCloseWindow` explicitly resets `previewWallpaper` if the closed window is the selector. |
| Flickering on selection | Use smooth transitions or ensure image preloading if necessary. |
| State desync if multiple selectors open | Ensure only one `previewWallpaper` exists and is managed by the root `OSDesktop`. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests
- [x] `WallpaperSelector.test.tsx`: Verify `onPreview` is called when a wallpaper option is clicked.
- [ ] `Taskbar.test.tsx`: Verify context menu closes on outside click (using `pointerDown`).

### E2E Tests (`e2e/tests/wallpaper-preview.spec.ts`)
- [x] Open Wallpaper Selector.
- [x] Click a wallpaper and verify desktop background style changes.
- [x] Click Cancel and verify desktop background reverts.
- [x] Click Apply and verify desktop background persists after reload.

### E2E Tests (`e2e/tests/mobile-context-menu.spec.ts`)
- [ ] Verify context menu closes on outside tap (regression check).

### Test Commands
```bash
npm run test -- WallpaperSelector
npm run test -- Taskbar
npm run test:e2e -- wallpaper-preview.spec.ts
npm run test:e2e -- mobile-context-menu.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Update `WallpaperSelector` to support preview callback.
2. **Phase 2**: Implement preview state and logic in `OSDesktop`.
3. **Phase 3**: Integration and verification (Wallpaper Preview).
4. **Phase 4**: Fix context menu regression (Overlay `pointer-events` and test robustness).

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [x] **Phase 1**: Implement `WallpaperSelector` changes and unit tests.
- [x] **Phase 2**: Implement `OSDesktop` preview state and logic.
- [x] **Phase 3**: Create `e2e/tests/wallpaper-preview.spec.ts` and verify.
- [ ] **Phase 4**: Fix context menu regression and verify.
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- WallpaperSelector`
- [ ] Run E2E tests: `npm run test:e2e -- wallpaper-preview.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-154: implement temporary wallpaper preview`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
