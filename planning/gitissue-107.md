# GitHub Issue #107: Desktop icon text labels do not wrap properly and overflow boundaries

## Overview

Desktop icons with long labels (e.g., "contact information .Txt") extend beyond the icon container width and can overlap with adjacent icons. The text label should wrap to multiple lines within the width constraint of the `DesktopIcon` component without exceeding horizontal boundaries.

### Features
- Constrain icon label text to the container width using `overflow-hidden` on the container
- Add `word-break: break-all` as a fallback for unbreakable strings (e.g., long filenames without spaces)
- Ensure the grid row sizing in `OSDesktop.tsx` accommodates taller icons from wrapped text
- Add a unit test verifying text wrapping CSS classes
- Add an E2E test verifying long labels stay within container bounds

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/DesktopIcon.tsx` | Add `overflow-hidden` to the outer container div and add `break-all` to the label span as a fallback for unbreakable strings |
| `__tests__/components/win95/DesktopIcon.test.tsx` | Add test case verifying text-wrapping CSS classes are present on the label element |
| `e2e/tests/ui-styling.spec.ts` | Add E2E test that verifies a long label does not overflow container bounds |

---

## Architecture Notes

- **Component**: `DesktopIcon.tsx` is a simple presentational component with a flex-col layout (`w-28` = 112px).
- **Label styling**: Currently uses `whitespace-normal break-words` which handles wrapping for words with natural break points, but long single words or filenames without spaces can still overflow.
- **Grid layout**: The desktop grid in `OSDesktop.tsx` (line 442) uses `grid-rows-[repeat(auto-fill,minmax(160px,auto))]` which should already auto-size rows.
- **Existing tests**: `ui-styling.spec.ts` already has tests for `break-words` class and `w-28` class, plus a vertical overlap test. The new test will complement these by directly measuring pixel overflow.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-107/desktop-icon-text-overflow`

### Commit Message
- **Subject**: `gitissue-107: fix desktop icon text label overflow`
- **Body**: Add overflow-hidden to container and break-all fallback to label span to prevent long text from overflowing icon boundaries.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| `break-all` may break mid-word for short labels, looking unnatural | Only use it as a Tailwind utility alongside `break-words` — CSS applies `overflow-wrap: break-word` first, then `word-break: break-all` only kicks in for truly unbreakable strings |
| `overflow-hidden` could clip icon hover effects or selection highlights | The hover/active styles are inline (`bg-blue-800/30`) so they stay within the container bounds; verify visually in E2E |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/DesktopIcon.test.tsx`)
- [ ] Verify the label span has `break-words` and `break-all` classes
- [ ] Verify the container div has `overflow-hidden` class

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Verify a long label's bounding box does not exceed the container's bounding box width

### Test Commands
```bash
npm run test -- DesktopIcon
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: CSS fix in `DesktopIcon.tsx` — add `overflow-hidden` to container, add `break-all` to label span
2. **Phase 2**: Add unit and E2E tests to verify the fix
3. **Phase 3**: Run baseline comparison and full CI flow

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Add `overflow-hidden` to the DesktopIcon container div and `break-all` to the label span
- [ ] **Phase 2**: Add unit test for text-wrapping CSS classes and E2E test for label overflow
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- DesktopIcon`
- [ ] Run E2E tests: `npm run test:e2e -- ui-styling.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-107: fix desktop icon text label overflow`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue (e.g., via `gh issue comment`) using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
