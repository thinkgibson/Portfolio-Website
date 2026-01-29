# Git Issue #35: Add a Video Essays app

## Overview
Create a new "Video Essays" application within the Windows 95 interface to display a collection of video essays. This app will mirror the functionality of the existing "Documentaries" app but serve a distinct content category.

### Features
- **App Launch**: Accessible via the "Multimedia" folder on the Desktop and the Start Menu.
- **Content Display**: Displays a scrolling list of video essays with titles, roles, descriptions, and YouTube embeds.
- **Data Source**: Content sourced from the existing `planning/featured-videos.md` file (parsed as `essays`).
- **Custom Icon**: A unique icon for the Video Essays application.
- **Window Management**: Standard Windows 95 window behaviors (minimize, maximize, close).

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `components/win95/VideoEssays.tsx` | Main application component, cloning `Documentaries.tsx` logic. |
| `components/Icons/VideoEssaysIcon.tsx` | New SVG icon component for the app. |
| `e2e/tests/video-essays-app.spec.ts` | E2E test file to verify app functionality. |
| `__tests__/components/win95/VideoEssays.test.tsx` | Unit test to verify component rendering. |

### Modified Files
| File | Changes |
|------|---------|
| `lib/types.ts` | Update `VideoData` to include `essays` and `IconType` to include `video-essays`. |
| `lib/markdown.ts` | Update `parseFeaturedVideos` to extract "Video Essays" section. |
| `components/Icons/index.ts` | Export the new `VideoEssaysIcon`. |
| `components/Icons/registry.tsx` | Register the `video-essays` icon type. |
| `config/apps.config.tsx` | Add the "Video Essays" app definition to the `multimedia` folder. |

---

## Architecture Notes
- **State Management**: Uses local state for video player references (refs) to control playback (stop on close/unmount).
- **Component Reuse**: The structure is identical to `Documentaries.tsx`, reusing the `Video` interface.
- **Integration**: Plugs into the `apps.config.tsx` configuration which drives the centralized OS window management system.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-35/video-essays-app`
2. **Commit Format**: `git commit -m "gitissue-35: {description}"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Markdown Parsing Errors** | Ensure the logic in `markdown.ts` correctly handles the `# Video Essays #` section without breaking existing parsing. Add checks for null/undefined. |
| **Config Errors** | Ensure the `id` in `apps.config.tsx` is unique (`video-essays`) to avoid collisions. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/VideoEssays.test.tsx`)
- [ ] Renders without crashing
- [ ] Displays the correct title "Video Essays"
- [ ] Renders the list of videos provided via props

### E2E Tests (`e2e/tests/video-essays-app.spec.ts`)
- [ ] Can open Video Essays app from Desktop (Multimedia folder)
- [ ] Can open Video Essays app from Start Menu
- [ ] Verifies window title and presence of specific video content
- [ ] Verifies window close functionality

### Test Commands
```bash
npm run test -- VideoEssays
npm run test:e2e -- video-essays-app.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] **Dependencies**: Update `lib/types.ts` and `lib/markdown.ts`
- [ ] **Icons**: Create `VideoEssaysIcon.tsx` and update registry
- [ ] **Component**: Create `components/win95/VideoEssays.tsx`
- [ ] **Config**: Update `config/apps.config.tsx`
- [ ] **Unit Tests**: Create and pass `__tests__/components/win95/VideoEssays.test.tsx`
- [ ] **E2E Tests**: Create and pass `e2e/tests/video-essays-app.spec.ts`
- [ ] **Verification**: Run full CI flow
