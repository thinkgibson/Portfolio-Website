# GitHub Issue #152: Resolve act() warnings in unit tests and improve coverage for SaveDialog

## Overview
This plan addresses two types of technical debt: React `act()` warnings in existing unit tests (`BootSequence`, `Taskbar`) and low test coverage for the `SaveDialog` component.

### Features
- Resolve `act()` warnings in `BootSequence.test.tsx` and `Taskbar.test.tsx`.
- Create a dedicated test file for `SaveDialog.tsx` with >80% coverage.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `__tests__/components/win95/SaveDialog.test.tsx` | Unit tests for the `SaveDialog` component. |

### Modified Files
| File | Changes |
|------|---------|
| `__tests__/components/win95/BootSequence.test.tsx` | Mock `fetch`, wrap state updates in `act`, and ensure timers are handled correctly. |
| `__tests__/components/win95/Taskbar.test.tsx` | Ensure all async updates and timers are properly handled within `act` or `waitFor`. |
| `__tests__/components/win95/Win95Window.test.tsx` | Wrap manual event handler calls (extracted from spies) in `act()`. |

---

## Architecture Notes
- Use `jest.useFakeTimers()` for components with intervals/timeouts.
- Mock global `fetch` to prevent unhandled promise resolutions.
- Use `waitFor` from `@testing-library/react` for async assertions.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-152/resolve-act-warnings-and-coverage`

### Commit Message
- **Subject**: `gitissue-152: resolve act() warnings and improve SaveDialog coverage`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Fragile tests due to fake timers | Use `jest.advanceTimersByTime` carefully and ensure cleanups in `afterEach`. |
| Incomplete mocking of fetch | Centralize fetch mocking or use a helper to ensure all paths are covered. |

---

## Test Coverage

### Unit Tests (`__tests__/components/win95/SaveDialog.test.tsx`)
- [ ] Renders with default filename
- [ ] Updates filename on input change
- [ ] Calls `onSave` with trimmed filename when Save button is clicked
- [ ] Calls `onSave` when Enter key is pressed
- [ ] Calls `onCancel` when Cancel button or X button is clicked
- [ ] Calls `onCancel` when Escape key is pressed

### Verification of Fixes
- [ ] Run `npm test -- BootSequence.test.tsx` (Verify no warnings)
- [ ] Run `npm test -- Taskbar.test.tsx` (Verify no warnings)
- [ ] Run `npm test -- Win95Window.test.tsx` (Verify no warnings)
- [ ] Run `npm test -- SaveDialog.test.tsx` (Verify coverage)

### Test Commands
```bash
npm test -- BootSequence.test.tsx
npm test -- Taskbar.test.tsx
npm test -- Win95Window.test.tsx
npm test -- SaveDialog.test.tsx
npm run test:coverage -- --collectCoverageFrom="components/win95/SaveDialog.tsx"
```

---

## Execution Phases
1. **Phase 1**: Implement `SaveDialog.test.tsx` and verify coverage.
2. **Phase 2**: Debug and resolve `act()` warnings in `BootSequence.test.tsx`.
3. **Phase 3**: Debug and resolve `act()` warnings in `Taskbar.test.tsx`.
4. **Phase 4**: Debug and resolve `act()` warnings in `Win95Window.test.tsx`.

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress"
- [ ] Create git branch `gitissue-152/resolve-act-warnings-and-coverage`

### Implementation
- [x] **Phase 1**: Create `__tests__/components/win95/SaveDialog.test.tsx`
- [x] **Phase 2**: Update `__tests__/components/win95/BootSequence.test.tsx` to fix warnings
- [x] **Phase 3**: Update `__tests__/components/win95/Taskbar.test.tsx` to fix warnings
- [ ] **Phase 4**: Update `__tests__/components/win95/Win95Window.test.tsx` to fix warnings

### Verification
- [ ] Run unit tests and verify NO console warnings.
- [ ] Verify `SaveDialog.tsx` coverage is >80%.
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-152: description`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue (e.g., via `gh issue comment`) using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
