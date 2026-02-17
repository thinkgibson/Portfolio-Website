# GitHub Issue #95: Fix icon spacing and text overlap in folder app

## Overview

Icons inside folder windows (e.g. Accessories, Resume, Multimedia) are rendered too close together, and their text labels overlap. The root cause is a mismatch between the CSS grid column width (`80px`) in `Folder.tsx` and the actual icon width (`w-28` = `112px`) defined in `DesktopIcon.tsx`.

### Features
- Widen the grid column size to match `DesktopIcon`'s intrinsic width so icons no longer overlap.
- Ensure text labels have enough room to wrap without colliding with adjacent icons.
- Maintain clean alignment at various folder window sizes.

---

## Expected Code Changes

### New Files
_None._

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Folder.tsx` | Change `grid-cols-[repeat(auto-fill,80px)]` → `grid-cols-[repeat(auto-fill,minmax(112px,1fr))]` so each column is at least as wide as the `DesktopIcon` component. Optionally increase `gap-4` to `gap-6` for more breathing room. |

---

## Architecture Notes

- `Folder.tsx` renders a CSS Grid of `DesktopIcon` components.
- `DesktopIcon.tsx` defines each icon as `w-28` (112 px) with `min-h-[120px]` and uses `whitespace-normal break-words` on the label `<span>`.
- The fix is purely CSS — no state, prop, or logic changes are needed.
- Using `minmax(112px, 1fr)` allows the grid to responsively fill available space while guaranteeing each cell is wide enough for the icon.

---

## Git Branch & Commit Strategy

### Branch Name
`gitissue-95/fix-folder-icon-spacing`

### Commit Message
- **Subject**: `gitissue-95: fix icon spacing and text overlap in folder app`
- **Body**: Widen CSS grid columns in Folder.tsx to match DesktopIcon width, preventing overlap.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Folders with many icons may require scrolling at narrow window sizes | Already handled — `Folder.tsx` parent has `overflow-auto` |
| Visual change may affect existing E2E screenshot tests | Re-run baseline comparison to confirm |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../\.agent/skills/design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../\.agent/skills/run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### E2E Tests (`e2e/tests/desktop-folders.spec.ts`)
- [ ] Existing: `should display Accessories folder on desktop` — still passes
- [ ] Existing: `should open Accessories folder and show contents` — still passes
- [ ] Existing: `should launch app from within folder` — still passes
- [ ] **New**: `should space folder icons without overlap` — open a folder and assert that no two icon bounding boxes overlap by checking computed positions

### Test Commands
```bash
npm run test:e2e -- desktop-folders.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Update grid layout in `Folder.tsx`
2. **Phase 2**: Add E2E test for icon spacing
3. **Phase 3**: Run full test suite and baseline comparison

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../\.agent/skills/create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Update `grid-cols` class in `Folder.tsx`
- [ ] **Phase 2**: Add new E2E test in `desktop-folders.spec.ts`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run E2E tests: `npm run test:e2e -- desktop-folders.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../\.agent/skills/run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../\.agent/skills/commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] Request user approval
- [ ] Create PR using the [create-pr-git skill](../\.agent/skills/create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../\.agent/skills/merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
