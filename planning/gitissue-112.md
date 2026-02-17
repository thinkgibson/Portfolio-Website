# GitHub Issue #112: Taskbar divider line gap inconsistent with Start button

## Overview

The gap between the Start button and the vertical divider line in the taskbar is excessively large compared to the gap between the divider and the first application window button. This creates a visual imbalance.

### Root Cause

In [`Taskbar.tsx`](file:///i:/code/VSCode/PortfolioWebsite/components/win95/Taskbar.tsx):
- **Line 215**: The Start button has `mr-4` (16px margin-right)
- **Line 223**: The separator `<div>` has `mx-1` (4px margin each side)
- Combined, there is ~20px on the left of the divider vs ~5px on the right

### Features
- Equalize the spacing on both sides of the taskbar divider so it sits symmetrically between the Start button and the first window button.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| [`Taskbar.tsx`](file:///i:/code/VSCode/PortfolioWebsite/components/win95/Taskbar.tsx) | Remove `mr-4` from Start button (line 215), adjust separator `mx-1` to a balanced value (e.g., `mx-1` stays or becomes `mx-[3px]`) |

---

## Architecture Notes

- This is a CSS-only change. No state management, props, or logic are affected.
- The taskbar layout uses `flex` with `gap-1` on the root container (line 201). The Start button's `mr-4` adds extra space on top of the flex gap.
- **Fix strategy**: Remove `mr-4` from the Start button. The existing `gap-1` (4px) from the parent flex container plus the separator's `mx-1` should provide consistent ~4-8px spacing on both sides of the divider.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-112/taskbar-divider-spacing`

### Commit Message
- **Subject**: `gitissue-112: fix inconsistent taskbar divider spacing`
- **Body**: Remove excessive mr-4 margin from Start button to equalize gap between Start button and divider vs divider and window buttons.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Start button may look too close to divider after removing `mr-4` | Visually verify in browser; adjust separator margin if needed |
| Existing E2E tests referencing taskbar layout may fail | Run full E2E baseline comparison |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Add test: verify the gap between the Start button and the divider is approximately equal to the gap between the divider and the first window button

### Test Commands
```bash
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Fix spacing — remove `mr-4` from Start button in `Taskbar.tsx`, verify visually
2. **Phase 2**: Add E2E regression test for divider spacing symmetry
3. **Phase 3**: Run baseline comparison and full CI flow

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Remove `mr-4` from Start button in `Taskbar.tsx` (line 215)
- [ ] **Phase 2**: Add E2E test in `e2e/tests/ui-styling.spec.ts` to verify divider spacing symmetry
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run E2E tests: `npm run test:e2e -- ui-styling.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-112: fix inconsistent taskbar divider spacing`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue (e.g., via `gh issue comment`) using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
