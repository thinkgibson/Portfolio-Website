# Git Issue #69: Fix Flaky Start Menu E2E Tests on Mobile Safari

## Overview
The Start Menu E2E tests are flaky or failing on Mobile Safari because the "desktop simulation" test tries to simulate hover interactions which are inconsistent or non-existent on mobile touch devices. This change splits the tests into explicit Desktop and Mobile suites, ensuring that environment-specific behaviors are tested in their respective projects.

### Features
- Separate "Desktop" Start Menu interactions (hover to open submenu) from "Mobile" Start Menu interactions (click to open submenu).
- Ensure specific tests only run on their appropriate Playwright projects (e.g., Mobile Safari runs mobile tests, Chromium runs desktop tests).

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `e2e/tests/start-menu-folders.spec.ts` | Refactor tests to separate Desktop vs Mobile logic using `test.skip` or `test.step` conditional on project name/viewport. |

---

## Architecture Notes
- Uses `test.info().project.name` or `page.viewportSize()` to determine the current test environment.
- No changes to application logic (`StartMenu.tsx`), only test harness changes.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-69/fix-start-menu-mobile`
2. **Commit Format**: `git commit -m "gitissue-69: separate desktop and mobile start menu tests"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Tests might still flake if timeouts are too short on mobile | Increase timeouts for mobile submenu interactions if needed. |
| Splitting tests might reduce coverage if one platform is accidentally skipped entirely | Verify both `chromium` and `Mobile Safari` projects run at least one meaningful test in this file. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### E2E Tests (`e2e/tests/start-menu-folders.spec.ts`)
- [ ] **Desktop**: Verify submenu opens on hover (skipped on mobile)
- [ ] **Mobile**: Verify submenu opens on click (skipped on desktop)
- [ ] **Both**: Verify clicking an item closes the menu (common behavior)

### Test Commands
```bash
npm run test:e2e -- start-menu-folders.spec.ts --project="Mobile Safari"
npm run test:e2e -- start-menu-folders.spec.ts --project="chromium"
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Create branch `gitissue-69/fix-start-menu-mobile`
- [ ] Modify `e2e/tests/start-menu-folders.spec.ts`
  - [ ] Add project name check helper or `test.skip` logic
  - [ ] Wrap "hover" test to skip on mobile projects
  - [ ] Wrap "mobile" test to skip on desktop projects
- [ ] Verify `Mobile Safari` project passes
- [ ] Verify `chromium` project passes
- [ ] Run `npm run ci-flow`
