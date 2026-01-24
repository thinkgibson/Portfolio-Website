# Git Issue #34: Add a Documentaries App

## Overview

Create a new "Documentaries" app for the Windows 95 portfolio website that displays a scrollable list of YouTube documentary videos with descriptive text. Users can click on embedded YouTube videos to play them, with volume synced to the system volume setting.

### Features

- Scrollable list of YouTube documentary videos
- Embedded YouTube player for each video
- Descriptive text (title, role, and description) for each video
- Volume matches system volume setting via `useOS().volume`
- Video playback stops when app is closed
- Available on desktop, in Start Menu, and via terminal command
- Win95 aesthetic styling

---

## Expected Code Changes

### New Files

| File | Purpose |
|------|---------|
| `components/win95/Documentaries.tsx` | Main Documentaries app component with YouTube embeds |
| `__tests__/components/win95/Documentaries.test.tsx` | Unit tests for the Documentaries component |
| `e2e/tests/documentaries-app.spec.ts` | E2E tests for the Documentaries app |

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/icons.tsx` | Add new `DocumentariesIcon` SVG component (film/video icon) |
| `components/win95/StartMenu.tsx` | Add "documentaries" to the `iconType` union and `renderIcon` switch case |
| `components/win95/OSDesktop.tsx` | Add "documentaries" to the `iconType` union in `WindowState` and `OSDesktopProps` |
| `components/HomeClient.tsx` | Add Documentaries window configuration and import |

---

## Architecture Notes

### Component Design

```
Documentaries.tsx
├── Uses useOS() hook for volume controls
├── YouTube embed iframes with volume sync
├── Scrollable list view
└── Cleanup effect to stop playback on unmount
```

### YouTube Embed Implementation

- Use YouTube iframe embed with the `enablejsapi=1` parameter for JS control
- Create refs for each iframe to control playback
- On component unmount, send `stopVideo` command to all iframes via `postMessage`
- Volume control via `setVolume` command using system volume from `useOS()`

### Data Source

Videos come from [featured-videos.md](file:///i:/code/VSCode/PortfolioWebsite/planning/featured-videos.md) **Documentaries** section:

| Title | URL | Role | Description |
|-------|-----|------|-------------|
| Morristown Bank Vault Documentary | `ONw4XjhCiRg` | Producer, Director of Photography, & Editor | Nestled inside a 150-year-old bank... |
| Iceland documentary | `uRnMK2wzM20` | Executive Producer, Production Coordinator, & Camera Operator | An inside look at Iceland's... |
| Halo documentary | `YHbWDwLvJQo` | Executive Producer, Production Coordinator, & Camera Operator | Hear the stories of the most... |
| The Making of Epitasis | `CSlaZOe_a8Q` | Executive Producer & Production Coordinator | A behind the scenes look at... |
| The Making of SkateBIRD | `rNGpTAwXI8M` | Executive Producer | An informal look at the inspirations... |

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-34/documentaries-app`
2. **Commit Format**: `git commit -m "gitissue-34: Add Documentaries app with YouTube embeds"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| YouTube iframe API limitations | Use postMessage API for cross-origin iframe communication |
| Volume sync may not work on all browsers | Fallback to browser volume; document limitation |
| YouTube embeds blocked by ad blockers | Inform users in help content about potential issues |
| Icon type string literal union mismatch | Ensure all files use exact same literal `"documentaries"` |
| iframe memory leaks | Clean up refs and event listeners in useEffect cleanup |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/Documentaries.test.tsx`)

- [ ] Renders all 5 documentary items from data
- [ ] Each item displays title, role, and description
- [ ] YouTube iframe has correct video ID
- [ ] Component uses useOS hook for volume

### E2E Tests (`e2e/tests/documentaries-app.spec.ts`)

- [ ] Opens Documentaries app from desktop icon
- [ ] Opens Documentaries app from Start Menu
- [ ] Opens Documentaries app via terminal (`open documentaries`)
- [ ] App displays scrollable list of videos
- [ ] Each video item shows title and description
- [ ] App closes correctly

### Test Commands

```bash
# Run unit tests for Documentaries component
npm run test -- Documentaries

# Run E2E tests for Documentaries app
npm run test:e2e -- documentaries-app.spec.ts

# Run full CI flow to verify no regressions
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Create `DocumentariesIcon` in `icons.tsx`
- [ ] Update `iconType` union in `OSDesktop.tsx` to include `"documentaries"`
- [ ] Update `iconType` union in `StartMenu.tsx` and add to `renderIcon` switch
- [ ] Create `Documentaries.tsx` component with:
  - [ ] Documentary video data array
  - [ ] YouTube iframe embeds
  - [ ] Volume sync via useOS hook
  - [ ] Cleanup on unmount to stop playback
  - [ ] Win95 styling
- [ ] Add Documentaries window config in `HomeClient.tsx`
- [ ] Create unit tests in `__tests__/components/win95/Documentaries.test.tsx`
- [ ] Create E2E tests in `e2e/tests/documentaries-app.spec.ts`
- [ ] Run `npm run ci-flow` to verify all tests pass
