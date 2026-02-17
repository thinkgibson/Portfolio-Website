# GitHub Issue #110: Inconsistent spacing between window toolbar icons

## Overview

The gap between the Maximize and Close icons in the window titlebar is larger than the gap between the Minimize and Maximize icons. All three control buttons should have identical spacing for visual consistency.

### Features
- Equalize spacing between Minimize, Maximize, and Close buttons in the window titlebar

---

## Root Cause

In [`Win95Window.tsx`](file:///i:/code/VSCode/PortfolioWebsite/components/win95/Win95Window.tsx#L416-L446), the control buttons container uses `flex gap-1`:

```tsx
<div className="flex gap-1 pr-1" ...>
    <button ... className="win95-button w-9 h-9 !p-0 ...">  {/* Minimize */}
    <button ... className="win95-button w-9 h-9 !p-0 ...">  {/* Maximize */}
    <button ... className="win95-button w-9 h-9 !p-0 ml-1 ...">  {/* Close — extra ml-1 here */}
</div>
```

The Close button has an extra `ml-1` class that adds additional left margin on top of the `gap-1` from the flex container. Removing `ml-1` from the Close button will make all gaps identical.

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Win95Window.tsx` | Remove `ml-1` from the Close button's className (line 439) |

### Diff

```diff
- className="win95-button w-9 h-9 !p-0 ml-1 flex items-center justify-center"
+ className="win95-button w-9 h-9 !p-0 flex items-center justify-center"
```

---

## Architecture Notes

- This is a single-line CSS class change — no state, logic, or component hierarchy changes.
- The `Win95Window` component is used by every application window, so this fix applies globally.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-110/fix-toolbar-icon-spacing`

### Commit Message
- **Subject**: `gitissue-110: fix inconsistent spacing between window toolbar icons`
- **Body**: Remove extra ml-1 from Close button; gap-1 on the flex container already provides uniform spacing.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Removing `ml-1` changes visual appearance for all windows | The `gap-1` already ensures consistent spacing; removing the duplicate margin is the correct fix |
| Other components may use a similar pattern | Grep for `ml-1` near Close button — confirmed this is the only occurrence in `Win95Window.tsx` |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### E2E Tests (`e2e/tests/test-toolbar.spec.ts`)
- [ ] Add test: verify Minimize↔Maximize gap equals Maximize↔Close gap

### Test Commands
```bash
npm run test:e2e -- test-toolbar.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Remove `ml-1` from Close button in `Win95Window.tsx`
2. **Phase 2**: Add E2E test asserting equal spacing between all three titlebar buttons
3. **Phase 3**: Run baseline comparison and full CI flow

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Remove `ml-1` from Close button className in `Win95Window.tsx`
- [ ] **Phase 2**: Add E2E test to `test-toolbar.spec.ts` checking equal gaps between titlebar buttons
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run E2E tests: `npm run test:e2e -- test-toolbar.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval — DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
