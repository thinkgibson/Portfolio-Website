# GitHub Issue #139: [Feature]: Split home.md into separate content files for modularity

## Overview
The goal is to split the currently monolithic `content/home.md` into four distinct markdown files (`welcome.md`, `aboutme.md`, `projects.md`, and `contact.md`). This will improve modularity and organization. `lib/markdown.ts` will be updated to fetch content from these new files instead of `home.md`.

### Features
- Create `content/welcome.md` from the `hero` section of `home.md`.
- Create `content/aboutme.md` from the `about` section + the bottom text of `home.md`.
- Create `content/projects.md` from the `projects` section of `home.md`.
- Create `content/contact.md` from the `contact` section of `home.md`.
- Remove the `skills` section entirely from the new structure.
- Update `lib/markdown.ts` (`getHomeContent`) to load and parse these four new files.
- Ensure `bodyHtml` returned by `getHomeContent` now comes from the content of `aboutme.md`.
- Delete `content/home.md`.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `content/welcome.md` | Contains the hero section metadata. |
| `content/aboutme.md` | Contains the about section metadata and body text. |
| `content/projects.md` | Contains the projects section metadata. |
| `content/contact.md` | Contains the contact section metadata. |

### Modified Files
| File | Changes |
|------|---------|
| `lib/markdown.ts` | Update `getHomeContent` to read the 4 new files instead of `home.md`, and assign `bodyHtml` to the parsed output of `aboutme.md`. Remove references to the inline `skills` section. |
| `__tests__/lib/markdown.test.ts` | Update mock testing to simulate reading 4 files instead of 1, and ensure the resulting structure remains compatible with the app. |
| `content/home.md` | Delete this file. |

---

## Architecture Notes
- The data flow will change slightly: `markdown.ts` will perform 4 distinct read and parse operations for the front page content instead of one.
- The returned data structure from `getHomeContent` needs to remain identical (minus the removed 'skills' field dependency). Note that `skillsData` loaded from `skills.md` will still remain.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-139/split-home-content`

### Commit Message
- **Subject**: `gitissue-139: Split home.md into separate content files`
- **Body**: Replaced home.md with welcome.md, aboutme.md, projects.md, and contact.md. Removed old skills section and updated lib/markdown.ts to parse the new structure.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| UI Breaks due to missing fields in `getHomeContent` return | Verify the return type of `getHomeContent()` remains compatible with `components/HomeClient` and `page.tsx` (minus the old inline `skills`). |
| Markdown parsing failures with multiple files | Add error handling or ensure the `fs.readFileSync` calls are properly tested in `markdown.test.ts`. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../.agent/skills/design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../.agent/skills/run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/lib/markdown.test.ts`)
- [ ] Test reading 4 files and aggregating the metadata and markdown output correctly.
- [ ] Test failure cases when files are missing.

### E2E Tests (`e2e/tests/test-home.spec.ts`)
- [ ] Ensure that existing E2E home tests pass with the new data source. (No new UI is added, functionality is identical).

### Test Commands
```bash
npm run test -- markdown
npm run test:e2e -- test-home
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Content Migration
   - Extract sections from `home.md` into `welcome.md`, `aboutme.md`, `projects.md`, and `contact.md`.
2. **Phase 2**: Logic Update
   - Modify `lib/markdown.ts` to parse the new structure.
   - Delete `home.md`.
3. **Phase 3**: Tests Fix
   - Update `__tests__/lib/markdown.test.ts` to match the new file reads.

---

## Implementation Checklist

> [!IMPORTANT]
> If you are using a `task.md`, all items from this checklist must be included in it to ensure synchronization.

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../.agent/skills/create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Extract content from `home.md` into new files (`welcome.md`, `aboutme.md`, `projects.md`, `contact.md`)
- [ ] **Phase 2**: Update `lib/markdown.ts` `getHomeContent` function
- [ ] **Phase 2**: Delete `content/home.md`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- markdown`
- [ ] Run E2E tests: `npm run test:e2e -- test-home`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../.agent/skills/run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../.agent/skills/commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../.agent/skills/create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../.agent/skills/merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
