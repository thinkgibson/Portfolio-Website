# GitHub Issue #109: Sort Start Menu items (folders first, then alphabetically)

## Overview

Implement alphabetical sorting of Start Menu items with folders appearing before non-folder items, matching standard Windows behavior. This will improve menu organization and make applications more discoverable.

### Features
- Sort top-level Start Menu items by type (folders first) then alphabetically by title
- Sort submenu items by type (folders first) then alphabetically by title
- Preserve "Reboot..." option at the bottom with its divider
- Maintain existing hover and click behavior

---

## Expected Code Changes

### New Files
None required - this is a modification of existing components.

### Modified Files

| File | Changes |
|------|---------|
| [StartMenu.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/StartMenu.tsx) | Add sorting logic to sort `items` prop before rendering menu items |
| [StartSubMenu.tsx](file:///i:/code/VSCode/PortfolioWebsite/components/win95/StartSubMenu.tsx) | Add sorting logic to sort `items` prop before rendering submenu items |

---

## Architecture Notes

### Sorting Strategy
- **Folder Detection**: An item is considered a folder if it has a `children` array with length > 0
- **Sort Order**: 
  1. Primary: Folders before non-folders
  2. Secondary: Alphabetical by `title` (case-insensitive)
- **Implementation**: Create a sorting utility function that can be reused in both components

### Component Integration
- Both `StartMenu` and `StartSubMenu` receive `items: AppDefinition[]` as props
- Sorting should be applied within each component before mapping over items
- The "Reboot..." button in `StartMenu` is rendered separately after the divider, so it won't be affected by sorting

### Data Flow
```
AppDefinition[] prop → Sort function → Sorted array → map() → Rendered menu items
```

---

## Git Branch & Commit Strategy

### Branch Name
`gitissue-109/sort-start-menu`

### Commit Message
- **Subject**: `gitissue-109: Sort Start Menu items (folders first, alphabetically)`
- **Body**: Implements sorting for Start Menu and submenu items to display folders first, then other items, both sorted alphabetically. Matches standard Windows behavior.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Breaking existing E2E tests that rely on specific menu ordering | Review and update E2E tests if they make assumptions about item order |
| Performance impact from sorting on every render | Use `useMemo` to cache sorted array and only re-sort when `items` prop changes |
| Case sensitivity affecting alphabetical order | Use `.toLowerCase()` for comparison to ensure consistent sorting |
| Special characters in titles affecting sort order | Use `localeCompare()` for proper string comparison |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../.agent/skills/design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../.agent/skills/run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Existing E2E Tests
- **File**: [start-menu-folders.spec.ts](file:///i:/code/VSCode/PortfolioWebsite/e2e/tests/start-menu-folders.spec.ts)
  - Tests submenu opening on hover (desktop)
  - Tests submenu opening on click (desktop and mobile)
  - Tests Notepad opening from submenu
  - **Note**: These tests verify menu functionality but don't verify ordering

### New E2E Test Coverage Needed
The existing test file should be extended to verify:
- [ ] Top-level menu items are sorted (folders first, then alphabetically)
- [ ] Submenu items are sorted (folders first, then alphabetically)
- [ ] "Reboot..." remains at the bottom after the divider

### Test Commands
```bash
# Run Start Menu E2E tests
npm run test:e2e -- start-menu-folders.spec.ts

# Run all E2E tests
npm run test:e2e

# Run full CI flow (includes all tests)
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1: Core Implementation**
   - Create sorting utility function
   - Apply sorting in `StartMenu.tsx`
   - Apply sorting in `StartSubMenu.tsx`

2. **Phase 2: Testing & Verification**
   - Add E2E test cases for sorted order verification
   - Run E2E baseline comparison
   - Manual browser testing to verify visual correctness

---

## Implementation Checklist

### Preparation
- [ ] Move issue #109 to "in progress" using the [update-git-issue skill](../.agent/skills/update-git-issue/SKILL.md)
- [ ] Create git branch using the [create-branch-git skill](../.agent/skills/create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Implement sorting logic
  - [ ] Create sorting utility function (or inline sort logic)
  - [ ] Apply sorting in `StartMenu.tsx` using `useMemo`
  - [ ] Apply sorting in `StartSubMenu.tsx` using `useMemo`
- [ ] **Phase 2**: Add test coverage
  - [ ] Extend `start-menu-folders.spec.ts` with ordering verification tests
  - [ ] Verify implementation against "Expected Code Changes"

### Verification
- [x] Run Start Menu E2E tests: `npm run test:e2e -- start-menu-sorting.spec.ts` (Created new test file instead of extending existing)
- [x] Run Start Menu E2E tests: `npm run test:e2e -- start-menu-folders.spec.ts`
- [-] Run E2E baseline comparison (Skipped: `ctrf` reporter not installed)
- [x] Run full CI flow (Verified build and E2E separately)
- [x] Manual browser testing: Open Start Menu and verify folders appear first, then alphabetically sorted

### Submission
- [ ] Commit changes using the [commit-git skill](../.agent/skills/commit-git/SKILL.md)
  - Format: `gitissue-109: Sort Start Menu items (folders first, alphabetically)`
- [ ] Move the issue to "in review" using the [update-git-issue skill](../.agent/skills/update-git-issue/SKILL.md)
- [ ] Request user approval
- [ ] Create PR using the [create-pr-git skill](../.agent/skills/create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../.agent/skills/merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to GitHub issue using the [update-git-issue skill](../.agent/skills/update-git-issue/SKILL.md)
- [ ] Move the issue to "done" using the [update-git-issue skill](../.agent/skills/update-git-issue/SKILL.md)
