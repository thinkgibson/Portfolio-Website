# GitHub Issue #117: Desktop Icon Text Drop Shadows

## Overview

Add a harsh, non-diffuse drop shadow to all desktop icon text labels to match the Windows 95/98 aesthetic and improve readability against different wallpapers.

### Features
- 1px offset drop shadow (1px right, 1px down) on all desktop icon text labels
- Sharp shadow with 0px blur radius
- Pure black (`#000000`) shadow color
- Matches authentic Windows 95/98 desktop icon styling

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/DesktopIcon.tsx` | Add `showShadow` prop and conditionally apply `textShadow` style |
| `components/win95/OSDesktop.tsx` | Pass `showShadow={true}` to desktop icon instances |
| `__tests__/components/win95/DesktopIcon.test.tsx` | Update tests to verify conditional shadow application |
| `e2e/tests/ui-styling.spec.ts` | No changes needed to the test itself, but ensure it runs against desktop icons |

---

## Architecture Notes

- The change adds a `showShadow` prop to `DesktopIcon.tsx` (defaulting to `false`).
- This allows the desktop to explicitly enable shadows (`showShadow={true}`) while other contexts (like `Folder.tsx`) remain shadow-free by default.
- Using a prop is cleaner and more explicit than relying on existing classes like `textColor`.
- No state management, data flow, or component hierarchy changes.


---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-117/desktop-icon-text-shadow`

### Commit Message
- **Subject**: `gitissue-117: add drop shadow to desktop icon text`
- **Body**: Add 1px harsh text-shadow to desktop icon labels matching Windows 95/98 style

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Shadow may look odd on hover when background changes to blue | Verify visually that shadow still looks correct on hover state |
| Shadow may reduce readability on very dark wallpapers | The 1px offset is subtle; matches authentic Win95 behavior |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../../../.agent/skills/design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../../../.agent/skills/run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.

### Unit Tests (`__tests__/components/win95/DesktopIcon.test.tsx`)
- [ ] Verify the label `<span>` has `text-shadow: 1px 1px 0px #000` style applied

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Verify desktop icon labels have `text-shadow` CSS property matching `rgb(0, 0, 0) 1px 1px 0px`

### Test Commands
```bash
npm run test -- DesktopIcon
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Add `textShadow` inline style to the label `<span>` in `DesktopIcon.tsx`
2. **Phase 2**: Add unit test for the text-shadow style
3. **Phase 3**: Add E2E test for the text-shadow CSS property
4. **Phase 4**: Run verification (unit tests, E2E tests, baseline comparison, CI flow)

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../../../.agent/skills/create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Add `style={{ textShadow: '1px 1px 0px #000' }}` to the label `<span>` in `DesktopIcon.tsx`
- [ ] **Phase 2**: Add unit test verifying `text-shadow` style on the label element
- [ ] **Phase 3**: Add E2E test verifying `text-shadow` CSS property on desktop icon labels
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- DesktopIcon`
- [ ] Run E2E tests: `npm run test:e2e -- ui-styling.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../../../.agent/skills/run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-117: add drop shadow to desktop icon text`) using the [commit-git skill](../../../.agent/skills/commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../../../.agent/skills/create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../../../.agent/skills/merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
