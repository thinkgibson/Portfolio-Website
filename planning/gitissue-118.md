# GitHub Issue #118: [Bug]: Taskbar context menu shows both Restore and Minimize options simultaneously

## Overview
The taskbar context menu for application windows incorrectly displays both "Restore" and "Minimize" options at the same time. These options should be contextual and mutually exclusive based on whether the window is currently minimized.

### Features
- Mutually exclusive "Restore" and "Minimize" options in the taskbar context menu.
- Correctly track minimized state of windows in the taskbar.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | Update `TaskbarProps` to include `isMinimized` in `openWindows` array. Use this state to conditionally render "Restore" or "Minimize" in the context menu. |
| `components/win95/OSDesktop.tsx` | Update the mapping of `openWindows` passed to the `Taskbar` component to include the `isMinimized` flag from the `RuntimeWindow` state. |
| `__tests__/components/win95/Taskbar.test.tsx` | Update existing tests to reflect the conditional rendering of context menu items. Add new test cases for minimized and restored window states. |

---

## Architecture Notes
- The `OSDesktop` component already tracks the `isMinimized` state for each `RuntimeWindow`.
- The `Taskbar` component receives a simplified list of `openWindows`. This list needs to be extended to include the `isMinimized` property.
- The `ContextMenu` in `Taskbar` will use this property to decide which menu items to show.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-118/fix-taskbar-menu`

### Commit Message
- **Subject**: `gitissue-118: fix taskbar context menu simultaneity`
- **Body**: Conditionally show Restore or Minimize in taskbar context menu based on window state.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Type mismatch in `TaskbarProps` | Ensure `Taskbar.tsx` and `OSDesktop.tsx` are updated simultaneously to maintain type safety. |
| Potential regression in taskbar behavior | Comprehensive unit testing and E2E baseline comparison. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression if applicable (though unit tests in `Taskbar.test.tsx` are strong here).

### Unit Tests (`__tests__/components/win95/Taskbar.test.tsx`)
- [ ] Ensure only "Restore" is shown when `isMinimized` is true.
- [ ] Ensure only "Minimize" is shown when `isMinimized` is false.
- [ ] Verify that existing context menu actions (Restore, Minimize, Close) still work.

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Add a step to verify taskbar context menu items based on window state if possible, or rely on unit tests for granular logic.

### Test Commands
```bash
npm run test -- Taskbar.test.tsx
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Update `Taskbar` component types and logic to support `isMinimized`.
2. **Phase 2**: Update `OSDesktop` to pass the correct state.
3. **Phase 3**: Update and verify tests.

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the `update-git-issue` skill
- [ ] Create git branch using the `create-branch-git` skill

### Implementation
- [ ] **Phase 1**: Update `Taskbar` component and types
- [ ] **Phase 2**: Update `OSDesktop` mapping
- [ ] **Phase 3**: Update tests in `Taskbar.test.tsx`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- Taskbar.test.tsx`
- [ ] Run E2E tests: `npm run test:e2e -- ui-styling.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the `run-e2e-tests` skill
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the `commit-git` skill
- [ ] Move the issue to "in review" using the `update-git-issue` skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the `create-pr-git` skill
- [ ] Merge the PR using the `merge-git` skill
- [ ] Attach planning doc and walkthrough to the GitHub issue using the `update-git-issue` skill
- [ ] Move the issue to "done" using the `update-git-issue` skill
