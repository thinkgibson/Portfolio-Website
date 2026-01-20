# Git Issue #20: Add a music player app

## Overview
Add a basic Music Player application that allows users to play audio files from the `public/sfx` folder. The app will feature a Windows 95 style interface with standard playback controls and track selection.

### Features
- Win95-style "Media Player" interface.
- Play, Pause, Stop, Previous, and Next controls.
- Track list populated from `public/sfx/soundConfig.json`.
- Volume control synced with system volume via `OSContext`.
- Desktop and Start Menu integration.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `components/win95/MusicPlayer.tsx` | Main application component. |
| `__tests__/components/win95/MusicPlayer.test.tsx` | Unit tests for the component. |
| `e2e/tests/music-player-app.spec.ts` | E2E tests for the app. |

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/icons.tsx` | Register `MusicPlayerIcon`. |
| `components/HomeClient.tsx` | Register the `MusicPlayer` window. |
| `components/win95/OSDesktop.tsx` | Add desktop icon for Music Player. |
| `components/win95/StartMenu.tsx` | Add Music Player to Programs menu. |
| `public/sfx/soundConfig.json` | Add metadata for tracks (title, filename). |

---

## Architecture Notes
- **State Management**: Uses React `useState` for playback status (playing/paused/stopped) and current track index.
- **Audio Logic**: Uses the native HTML5 `Audio` API within the component, with a singleton-like pattern or simple ref to the `Audio` object.
- **Integration**: Accesses `OSContext` for volume levels and system-wide playback events.
- **Component Hierarchy**: `Win95Window` -> `MusicPlayer` -> `[Controls, TrackList]`.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-20/music-player`
2. **Commit Format**: `git commit -m "gitissue-20: add music player app"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Autoplay policies | Ensure user interaction (click play) is required before playback. |
| Large audio files | Use `.ogg` or `.mp3` for smaller file sizes; pre-fetch metadata only. |
| Z-index/Focus | Ensure `MusicPlayer` handles focus correctly like other apps. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/MusicPlayer.test.tsx`)
- [ ] Renders all control buttons (Play, Pause, Stop, Prev, Next).
- [ ] Displays the correct track title.
- [ ] Toggles play/pause state correctly.
- [ ] Stops playback and resets progress when Stop is clicked.

### E2E Tests (`e2e/tests/music-player-app.spec.ts`)
- [ ] App opens from the Desktop icon.
- [ ] App opens from the Start Menu.
- [ ] Clicking Play increments progress or changes UI state.
- [ ] Closing the window stops the audio.

### Test Commands
```bash
npm run test -- MusicPlayer
npm run test:e2e -- music-player-app.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Add `MusicPlayerIcon` to `icons.tsx`.
- [ ] Create `MusicPlayer.tsx` component with basic controls.
- [ ] Implement audio logic using `Audio` API and `soundConfig.json`.
- [ ] Register `MusicPlayer` in `HomeClient.tsx`.
- [ ] Add shortcuts to `OSDesktop.tsx` and `StartMenu.tsx`.
- [ ] Write unit tests and verify.
- [ ] Write E2E tests and verify.
- [ ] Run `npm run ci-flow`.
