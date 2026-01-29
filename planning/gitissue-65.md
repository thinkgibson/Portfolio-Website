# Git Issue #65: Create Resume Folder

## Overview
Create a new folder on the desktop called "My Resume" and move the existing "Job History", "My Skills", and "About Me" apps into this folder to declutter the desktop and organize resume-related content.

### Features
- New "My Resume" folder on the desktop.
- "Job History", "My Skills", and "About Me" apps moved inside "My Resume".
- E2E tests updated to reflect the new location of these apps.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `config/apps.config.tsx` | Create new top-level `resume` app (folder) and move `job-history`, `skills`, `about` into its `children` array. |
| `e2e/tests/job-history.spec.ts` | Update desktop interaction to open "My Resume" folder before opening "Job History". |
| `e2e/tests/skills-app.spec.ts` | Update desktop interaction to open "My Resume" folder before opening "My Skills". |
| `e2e/tests/test-home.spec.ts` | Update initial desktop verification to check for "My Resume" folder instead of "About_Me.doc". |

---

## Architecture Notes
- The Windows 95 implementation already supports folders via the `children` property in `AppDefinition`.
- The `OSDesktop` component flattens `children` for the start menu and terminal, so existing `open` commands in terminal will continue to work without changes.
- The `Folder` component handles rendering nested apps.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-65/resume-folder`
2. **Commit Format**: `git commit -m "gitissue-65: Create Resume folder and move resume apps"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| E2E tests using desktop icons will fail | Update all relevant E2E tests to navigate via the folder. |
| User links/bookmarks | This is a single-page app with window state; if deep linking exists (it doesn't seem to for specific windows yet), it might be affected. No deep linking logic found, so low risk. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### E2E Tests
- [ ] Update `e2e/tests/job-history.spec.ts` to support folder navigation
- [ ] Update `e2e/tests/skills-app.spec.ts` to support folder navigation
- [ ] Update `e2e/tests/test-home.spec.ts` to verify "My Resume" presence

### Test Commands
```bash
npm run test:e2e -- job-history.spec.ts
npm run test:e2e -- skills-app.spec.ts
npm run test:e2e -- test-home.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Create git branch `gitissue-65/resume-folder`
- [ ] Modify `config/apps.config.tsx` to restructure apps
- [ ] Update `e2e/tests/test-home.spec.ts`
- [ ] Update `e2e/tests/job-history.spec.ts`
- [ ] Update `e2e/tests/skills-app.spec.ts`
- [ ] Verify `npm run test:e2e` passes for modified tests
- [ ] Verify functionality manually (optional, but good)
- [ ] Run full CI checks
