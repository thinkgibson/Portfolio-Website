# Git Issue #36: Add a Livestreams app

## Overview

Create a new "Livestreams" app for the Windows 95 portfolio website. This app will be modeled after the existing "Documentaries" app but will dynamically load its content from `planning/featured-videos.md` at build time. This ensures that any changes to the markdown file are automatically reflected on the website.

### Features

- **Dynamic Data Source**: Automatically extracts video metadata from the `# Livestreams #` section of `planning/featured-videos.md`.
- **Embedded YouTube Player**: Displays videos with volume synced to the system volume.
- **Cleanup**: Video playback stops automatically when the app window is closed.
- **Integration**: Available on the desktop (Multimedia folder), in the Start Menu, and via terminal command `open livestreams`.
- **Win95 Aesthetic**: Matches the visual style of existing applications.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `components/win95/Livestreams.tsx` | Main application component for viewing livestreams. |
| `components/Icons/LivestreamsIcon.tsx` | Custom SVG icon for the Livestreams app. |
| `__tests__/components/win95/Livestreams.test.tsx` | Unit tests for the Livestreams component. |
| `e2e/tests/livestreams-app.spec.ts` | E2E tests for app functionality and integration. |

### Modified Files
| File | Changes |
|------|---------|
| `lib/types.ts` | Add `Video` and `VideoData` types; update `HomeContent` and `IconType`. |
| `lib/markdown.ts` | Add parser for `featured-videos.md` and include in `getHomeContent`. |
| `components/Icons/index.ts` | Export the new `LivestreamsIcon`. |
| `components/Icons/registry.tsx` | Register the `livestreams` icon type. |
| `components/win95/Documentaries.tsx` | Refactor to accept dynamic video data as props. |
| `config/apps.config.tsx` | Register the `livestreams` app and pass dynamic data to apps. |

---

## Architecture Notes

### Data Flow
1. **Build Time**: `lib/markdown.ts` reads `planning/featured-videos.md`.
2. **Parsing**: A custom parser extracts titles, IDs, roles, and descriptions from the "Documentaries" and "Livestreams" sections.
3. **Provisioning**: The parsed data is added to the `HomeContent` object and passed to `HomeClient`.
4. **Injection**: `apps.config.tsx` injects the relevant video arrays into the `Documentaries` and `Livestreams` components.

### Video Player Sync
- Uses the `postMessage` API to communicate with YouTube iframes for volume control and stopping playback.
- Subscribes to the `useOS().volume` state.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-36/livestreams-app`
2. **Commit Format**: `git commit -m "gitissue-36: add livestreams app with dynamic data extraction"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Markdown Format Change | Implement a robust parser with basic error handling/defaults. |
| Multiple Video Players | Ensure all players stop on unmount to prevent background noise. |
| Icon Collision | Use a distinct broadcast-style icon to differentiate from Documentaries. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/Livestreams.test.tsx`)
- [ ] Component renders without crashing.
- [ ] Correct number of livestream items are rendered from mock data.
- [ ] YouTube iframe has the correct URL format.
- [ ] System volume updates are posted to the iframe.

### E2E Tests (`e2e/tests/livestreams-app.spec.ts`)
- [ ] Open Livestreams from Multimedia folder.
- [ ] Open Livestreams via Terminal `open livestreams`.
- [ ] App window contains the correct video titles.
- [ ] App window closes and unregisters correctly.

### Test Commands
```bash
npm run test -- Livestreams
npm run test:e2e -- livestreams-app.spec.ts
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Update `lib/types.ts` with video-related interfaces.
- [ ] Implement `parseFeaturedVideos` in `lib/markdown.ts`.
- [ ] Create `LivestreamsIcon.tsx` and register it.
- [ ] Refactor `Documentaries.tsx` to handle dynamic props.
- [ ] Implement `Livestreams.tsx` using props and win95 styling.
- [ ] Add Livestreams app to `config/apps.config.tsx`.
- [ ] Verify build-time extraction by changing `featured-videos.md`.
- [ ] Implement and run unit tests.
- [ ] Implement and run E2E tests.
- [ ] Run full CI flow to ensure no regressions.
