# GitHub Issue #97: Remove Myprojects EXE Application and References, Update Tests

## Overview

Remove the `My_Projects.exe` application (id: `projects`) from the portfolio OS. This involves deleting the app definition from the config, removing it from the start menu / desktop icons, cleaning up orphaned type/icon references, and updating all affected tests.

### Features
- Remove the `projects` app definition from `apps.config.tsx`
- Remove the `"projects"` icon alias from the icon registry
- Remove `"projects"` from the `IconType` union type
- Update unit tests that assert on or use the `projects` app/icon
- Ensure no E2E tests reference `My_Projects.exe`
- Validate the `Navbar.tsx` `#projects` anchor link is **not** related (it's a page section link, not the app)

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `config/apps.config.tsx` | Remove the entire `projects` app entry (lines 41-89) |
| `components/Icons/registry.tsx` | Remove the `"projects": Icons.ProgramsIcon` alias (line 25) |
| `lib/types.ts` | Remove `"projects"` from the `IconType` union (line 85) |
| `__tests__/config/apps.config.test.tsx` | Remove `expect(appIds).toContain('projects')` assertion (line 56); remove or update the `transforms content into app structure` test that finds `projects` app (lines 64-70) |
| `__tests__/components/win95/DesktopIcon.test.tsx` | Remove the `rerender` with `iconType="projects"` (line 35) |

### Files NOT changed (investigated, no action needed)

| File | Reason |
|------|--------|
| `components/win95/OSDesktop.tsx` | Line 318 uses `iconType: "projects"` for the wallpaper selector window — will need update since `"projects"` is removed from `IconType`. Change to `"folder"` or a more appropriate icon. |
| `components/layout/Navbar.tsx` | `#projects` is a page anchor link, not related to the app |
| `components/win95/Terminal.tsx` | No references to `projects` or `My_Projects` |
| `e2e/tests/taskbar-features.spec.ts` | No current references to `My_Projects.exe` (stale data only in `test-results.json`) |
| `test-results.json` | Stale test output, not source code — no changes needed |

> [!IMPORTANT]
> `OSDesktop.tsx` line 318 uses `iconType: "projects"` for the wallpaper selector (`Display Properties` window). Since we're removing the `"projects"` IconType, this must be changed to a valid type like `"folder"`.

---

## Architecture Notes

- The `projects` app is a **top-level** app in the `getAppsConfig` array — it renders as both a desktop icon and start menu entry
- The icon type `"projects"` is an alias mapping to `Icons.ProgramsIcon` in `registry.tsx`
- No other app uses `iconType: "projects"`, except the wallpaper selector window in `OSDesktop.tsx`
- The `HomeContent.projects` data field in `lib/types.ts` is **NOT** being removed — it's the content data (project list), which is distinct from the app definition

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-97/remove-myprojects-exe`

### Commit Message
- **Subject**: `gitissue-97: Remove My_Projects.exe app and all references`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Removing `"projects"` from `IconType` breaks compile if any reference is missed | Grep codebase thoroughly (done — `OSDesktop.tsx` is the only remaining usage) |
| `HomeContent.projects` data confused with the app | They are distinct — `content.projects` is data, `id: "projects"` is the app definition |
| Start menu items shift after removal | No special ordering logic — apps render in array order, removal is safe |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - No new E2E tests needed — this is a removal task.

### Unit Tests (`__tests__/config/apps.config.test.tsx`)
- [x] `expect(appIds).toContain('projects')` → **Remove** this assertion
- [x] `transforms content into app structure` test → **Update** to use a different app (e.g., `welcome`)

### Unit Tests (`__tests__/components/win95/DesktopIcon.test.tsx`)
- [x] Remove `rerender(<DesktopIcon {...defaultProps} iconType="projects" />)` line

### Test Commands
```bash
npm run test -- apps.config
npm run test -- DesktopIcon
npm run test:e2e
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Remove the `projects` app definition from `apps.config.tsx`
2. **Phase 2**: Remove `"projects"` from `IconType` union, icon registry, and fix `OSDesktop.tsx` wallpaper selector icon
3. **Phase 3**: Update unit tests to remove all `projects` assertions
4. **Phase 4**: Run tests and validate

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch `gitissue-97/remove-myprojects-exe`

### Implementation
- [ ] **Phase 1**: Remove lines 41-89 from `config/apps.config.tsx` (the `projects` app object)
- [ ] **Phase 2**: Remove `"projects"` from `IconType` in `lib/types.ts`; remove `"projects"` alias from `components/Icons/registry.tsx`; change `iconType: "projects"` to `"folder"` in `OSDesktop.tsx` line 318
- [ ] **Phase 3**: Update `__tests__/config/apps.config.test.tsx` — remove `projects` assertion and update the content structure test; remove `projects` icon type rerender from `__tests__/components/win95/DesktopIcon.test.tsx`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- apps.config`
- [ ] Run unit tests: `npm run test -- DesktopIcon`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-97: Remove My_Projects.exe app and all references`) using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] Request user approval
- [ ] Create PR & Merge using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
