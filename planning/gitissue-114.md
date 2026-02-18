# GitHub Issue #114: Window toolbar icons (File, Search, Help) have tight bounding boxes and truncate text

## Overview
The "File", "Search", and "Help" menu items in the window toolbar have bounding boxes that are too tight (`px-1`). When the `win95-beveled` effect appears on hover, the text gets clipped. Additionally, the bevel should be visible at all times (not just on hover) to make it clear these are clickable buttons.

### Features
- Increase horizontal padding on toolbar menu items to prevent text truncation
- Make the `win95-beveled` effect always visible on menu items (not hover-only)

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Win95Window.tsx` | Change `px-1` → `px-2` and `hover:win95-beveled` → `win95-beveled` on the three menu bar `<span>` elements (lines 453, 474, 490) |

---

## Architecture Notes
- The menu bar is rendered inside `Win95Window` (lines 449–506)
- Three `<span>` elements for File, Search, Help each use the same pattern:
  - `px-1` for horizontal padding
  - `hover:win95-beveled` for the idle state (bevel only on hover)
  - `win95-beveled-inset` when the menu is active/open
- The `win95-beveled` utility class applies `shadow-win95-outset bg-win95-gray` (defined in `globals.css:31-33`)
- Since the background is already `bg-win95-gray` on the menu bar container, making the bevel always visible will add subtle outset shadow borders without changing the background color

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-114/toolbar-menu-padding`

### Commit Message
- **Subject**: `gitissue-114: fix toolbar menu item padding and always-visible bevel`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Extra padding changes menu bar layout width | Minimal impact — only 4px additional per item (8px total across 3 items). Visual verification via E2E. |
| Always-visible bevel may look odd with double shadow on active state | Active state uses `win95-beveled-inset` which replaces the outset shadow, so no conflict |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### E2E Tests (`e2e/tests/test-toolbar.spec.ts`)
- [ ] Add test: toolbar menu items (File, Search, Help) have sufficient padding (verify bounding box width is wider than text content)

### Test Commands
```bash
npm run test:e2e -- test-toolbar.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Update the three menu item `<span>` classes in `Win95Window.tsx`
2. **Phase 2**: Add E2E test for menu item padding
3. **Phase 3**: Run baseline comparison and CI flow

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Update `px-1` → `px-2` and `hover:win95-beveled` → `win95-beveled` on File, Search, Help spans in `Win95Window.tsx`
- [ ] **Phase 2**: Add E2E test verifying menu item bounding boxes have adequate padding
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run E2E tests: `npm run test:e2e -- test-toolbar.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-114: description`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
