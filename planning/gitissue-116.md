# GitHub Issue #116: Inconsistent and Excessive Horizontal Spacing in Taskbar System Tray Icons

## Overview

The horizontal spacing between the weather, network, and volume icons in the system tray is too wide (`gap-4` = 16px). The gap between the volume icon and the clock is also excessive (`mr-2` on icon container). Additionally, the system tray bounding box itself has padding (`px-2`) that is inconsistent with the inter-icon spacing.

The fix will reduce and equalize all horizontal gaps so the icons, clock, and bounding box edges all share a consistent, tighter spacing.

### Features
- Reduce horizontal gap between system tray icons (weather, network, volume)
- Reduce horizontal gap between volume icon and clock
- Reduce system tray bounding box width by tightening horizontal padding
- **Preserve**: Vertical spacing, icon sizes, and clock size must remain unchanged

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | Use asymmetric padding: `pl-[6px]` (4px visual) and `pr-[10px]` (8px visual). This maintains the internal consistent 4px gaps while adding 4px extra on the right as requested. |

### New Files

| File | Purpose |
|------|---------|
| *(none)* | |

---

## Architecture Notes

- The system tray is rendered in `Taskbar.tsx` lines 253–375.
- **Outer container** (line 254): `<div className="win95-beveled-inset bg-win95-taskbar px-2 flex items-center gap-2 h-full ml-auto relative">` — this is the bounding box.
- **Icon row** (line 342): `<div className="flex gap-4 items-center mr-2">` — holds weather, network, volume buttons.
- **Clock** (line 372): `<span>` immediately after the icon row, inside the outer container.
- Each icon button will be `w-auto h-12 p-0` — to ensure gaps are consistent with the SVG content.
- The clock size (`text-[26px]`) must **not** change.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-116/system-tray-spacing`

### Commit Message
- **Subject**: `gitissue-116: reduce horizontal spacing in system tray icons`
- **Body**: Tighten gaps between weather, network, volume icons and clock. Reduce system tray bounding box padding.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Vertical spacing is accidentally changed | Only modify horizontal properties (`gap`, `px`, `mr`); verify via E2E test |
| Icons or clock size is accidentally changed | Do not touch `w-12`, `h-12`, `text-[26px]`; verify via E2E test |
| Volume tooltip position shifts | Volume tooltip is positioned with `right-6`; verify it still aligns correctly |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/Taskbar.test.tsx`)
- [ ] Existing unit tests should continue to pass (no logic changes)

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] New test: "System tray icons have consistent horizontal spacing" — verify that the gap between adjacent icons is equal, and the gap between the last icon and the clock is consistent with the inter-icon gap
- [ ] New test: verify the system tray bounding box padding is consistent with inter-icon spacing

### Test Commands
```bash
npm run test -- Taskbar
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Modify CSS classes in `Taskbar.tsx` — change `px-[6px]` to `pl-[6px] pr-[10px]`.
2. **Phase 2**: Update E2E test for system tray spacing in `ui-styling.spec.ts` — verify right padding is measured as 10px (8px visual).
3. **Phase 3**: Run verification (unit tests, E2E tests, baseline comparison, CI flow)

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Modify CSS classes in `Taskbar.tsx`
- [ ] **Phase 2**: Add E2E test for system tray horizontal spacing
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- Taskbar`
- [ ] Run E2E tests: `npm run test:e2e -- ui-styling.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-116: description`) using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
