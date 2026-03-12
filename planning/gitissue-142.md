# GitHub Issue #142: [Bug]: Accessories folder default size cuts off icons and requires scroll

## Overview
This change fixes an issue where the "Accessories" folder on the desktop has default dimensions (500x400) that are too small to display its 4 icons properly. Currently, the width forces the 4th icon to wrap to a second row, and the height cuts off that second row, requiring the user to scroll. The change will increase the default dimensions so all icons are visible without scrolling or resizing.

### Features
- Increase the default width and height of the Accessories folder so that it can comfortably fit all of its icons without truncation or scrolling.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `config/apps.config.tsx` | Locate the `accessories` configuration (around line 180) and update its `width` to accommodate 4 icons. Update its default `height` to scale dynamically to display all rows but with no extra vertical space. |

---

## Architecture Notes
- **State Management:** The dimensions are static configuration values defined in `apps.config.tsx`. No state management changes are required.
- **Component Hierarchy:** The folder configuration is injected into `Win95Window` via the desktop environment logic. Changing these config properties directly applies the new dimensions at launch.
- **Integration Points:** Affects any component launching the "Accessories" folder, primarily `OSDesktop`.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-142/accessories-folder-size`

### Commit Message
- **Subject**: `gitissue-142: Fix accessories folder default dimensions`
- **Body**: Increased the default width to fit 4 icons and made the height scale dynamically to display all rows with no extra vertical space.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Small mobile viewports | The `Win95Window` component (or its parent) automatically handles viewport boundaries for windows that exceed screen dimensions on very small mobile screens, but 600x400 fits comfortably on most desktops/tablets. We should verify mobile behavior just in case. |
| Test failures if hardcoded sizes exist | E2E tests for `desktop-folders` don't assert hardcoded pixel dimensions, but we must run all E2E tests to ensure no bounding constraints break. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the design-tests skill for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the run-e2e-tests skill to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### E2E Tests (`e2e/tests/desktop-folders.spec.ts`)
- [ ] Add an assertion or test case verifying that the accessories window contents fit without scroll (e.g., verifying `scrollHeight` <= `clientHeight` of the content area).

### Test Commands
```bash
npm run test:e2e -- desktop-folders.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Update `config/apps.config.tsx` the dimensions for Accessories.
2. **Phase 2**: Add/update E2E test to verify dimensions and ensure no scrollbar is present by default.

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the create-branch-git skill

### Implementation
- [ ] **Phase 1**: Update the size of the `accessories` app in `config/apps.config.tsx`.
- [ ] **Phase 2**: Add a test in `e2e/tests/desktop-folders.spec.ts` asserting no scrolling is needed for the accessories window.
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run E2E tests: `npm run test:e2e -- desktop-folders.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the run-e2e-tests skill
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-142: description`) using the commit-git skill
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the create-pr-git skill
- [ ] Merge the PR using the merge-git skill
- [ ] Attach planning doc and walkthrough to the GitHub issue (e.g., via `gh issue comment`) using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill

---

## Quality Checklist

Before finalizing the planning document, verify:

- [x] All requirements from the issue are addressed
- [x] File paths match project conventions
- [x] Related skills are referenced via relative paths (not duplicated)
- [x] Risks specific to this codebase are identified
- [x] Test cases cover happy path and edge cases
- [x] Checklist enables incremental progress
