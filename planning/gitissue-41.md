# Git Issue #41: Add a Skills app

## Overview
Create a new application called "Skills" that displays technical skills organized by categories. This app will be modeled after the existing "Job History" application and will be accessible via the desktop, start menu, and terminal.

### Features
- Desktop icon for "Skills".
- "Skills" entry in the Start Menu.
- Terminal command `open skills` to launch the application.
- Window-based interface showing skills categorized (e.g., Frontend, Backend, Tools).
- Data-driven content sourced from a markdown file.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `content/skills.md` | Data source for the skills content. |
| `components/win95/Skills.tsx` | The visual component for the Skills application. |
| `tests/skills-app.spec.ts` | End-to-end tests for the Skills application. |

### Modified Files
| File | Changes |
|------|---------|
| `lib/types.ts` | Add `SkillsData` interface and update `HomeContent` and `IconType`. |
| `lib/markdown.ts` | Update `getHomeContent` to parse `content/skills.md`. |
| `components/Icons/registry.tsx` | Register the "skills" icon. |
| `config/apps.config.tsx` | Add the Skills app definition to the application configuration. |

---

## Architecture Notes
- **Data Flow**: The application loads content from `content/skills.md` during the initial page load in `getHomeContent`. This data is passed down through `HomeClient` to `apps.config.tsx`.
- **Component Pattern**: `Skills.tsx` will follow the pattern of `JobHistory.tsx`, utilizing standard Win95 UI components for a consistent look and feel.
- **Integration**: the `Terminal.tsx` component already supports opening any registered app by its ID, so adding the app to `apps.config.tsx` automatically enables the `open skills` command.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

**For GitHub Issues:**
1. **Create Branch**: `git checkout -b gitissue-41/skills-app`
2. **Commit Format**: `git commit -m "gitissue-41: implement skills app"`

**Both:**
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Icon selection | Use a generic but appropriate icon if a specific "skills" icon isn't available in the current set. |
| Content overflow | Ensure the `Skills.tsx` component has proper scrollable areas for large lists of skills. |
| Type safety | Carefully define the `SkillsData` interface to match the markdown frontmatter. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### E2E Tests (`tests/skills-app.spec.ts`)
- [ ] Verify "Skills" desktop icon is visible.
- [ ] Verify double-clicking "Skills" opens the window.
- [ ] Verify "Skills" exists in the Start Menu.
- [ ] Verify `open skills` command in Terminal works.
- [ ] Verify content is correctly displayed in the window.

### Test Commands
```bash
npm run test:e2e -- tests/skills-app.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Create `content/skills.md` with initial categories and skills.
- [ ] Update `lib/types.ts` with `SkillsData` and updated `HomeContent`.
- [ ] Update `lib/markdown.ts` to load `content/skills.md`.
- [ ] Create `components/win95/Skills.tsx` (copy/adapt from `JobHistory.tsx`).
- [ ] Register "skills" icon in `components/Icons/registry.tsx`.
- [ ] Add Skills app to `config/apps.config.tsx`.
- [ ] Create E2E test `tests/skills-app.spec.ts`.
- [ ] Verify all tests pass.
