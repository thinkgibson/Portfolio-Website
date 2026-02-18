# GitHub Issue #115: Change Taskbar Clock to 24-Hour (Military) Format

## Overview

The taskbar clock currently uses `toLocaleTimeString` without specifying `hour12: false`, which causes it to render in 12-hour AM/PM format by default (locale-dependent). This change updates the `formatTime` function in `Taskbar.tsx` to always display time in 24-hour format with zero-padded hours (e.g., `07:00`, `19:00`), removing the AM/PM indicator entirely.

### Features
- Clock displays in 24-hour format (e.g., `19:00` instead of `7:00 PM`)
- AM/PM indicator is removed
- Hours are zero-padded for consistency (e.g., `07:00` not `7:00`)

---

## Expected Code Changes

### New Files
_None_

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | Update `formatTime` to pass `hour12: false` to `toLocaleTimeString` |
| `__tests__/components/win95/Taskbar.test.tsx` | Update existing time test to assert 24-hour format; add a new test for PM hours |

---

## Architecture Notes

- The `formatTime` function (line 35–37 of `Taskbar.tsx`) is the sole location for clock formatting. The fix is a one-line change.
- Current: `date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`
- Updated: `date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })`
- No state management or component hierarchy changes are needed.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-115/24-hour-clock`

### Commit Message
- **Subject**: `gitissue-115: change taskbar clock to 24-hour format`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| `toLocaleTimeString` with `hour12: false` may render `24:00` instead of `00:00` in some environments | Verify in test with midnight time; use `padStart` fallback if needed |
| Existing unit test at line 88–101 uses `/12:00/` regex which matches both 12-hour and 24-hour noon — still valid | No change needed for that assertion; add a PM-hour test to explicitly verify 24-hour output |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/Taskbar.test.tsx`)
- [ ] Update existing `'updates time every second'` test to assert `12:00` (noon) is displayed without AM/PM
- [ ] Add new test: mock a PM time (e.g., `19:05`) and assert the clock shows `19:05` (not `7:05 PM`)
- [ ] Add new test: mock a morning time (e.g., `07:00`) and assert the clock shows `07:00` (zero-padded)

### E2E Tests (`e2e/tests/taskbar-features.spec.ts`)
- [ ] Add test: verify the taskbar clock text matches a 24-hour pattern (regex `/^\d{2}:\d{2}$/`) and does not contain `AM` or `PM`

### Test Commands
```bash
npm run test -- Taskbar
npm run test:e2e -- taskbar-features.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Update `formatTime` in `Taskbar.tsx` (one-line change)
2. **Phase 2**: Update and add unit tests in `Taskbar.test.tsx`
3. **Phase 3**: Add E2E test to `taskbar-features.spec.ts`

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../.agent/skills/create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Update `formatTime` in `components/win95/Taskbar.tsx` to use `hour12: false`
- [ ] **Phase 2**: Update and add unit tests in `__tests__/components/win95/Taskbar.test.tsx`
- [ ] **Phase 3**: Add E2E clock format test to `e2e/tests/taskbar-features.spec.ts`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- Taskbar`
- [ ] Run E2E tests: `npm run test:e2e -- taskbar-features.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../.agent/skills/run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../.agent/skills/commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval — DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../.agent/skills/create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../.agent/skills/merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
