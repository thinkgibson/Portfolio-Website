# Git Issue #20: Add a Music Player App

## Execution Order & Dependencies

> [!CAUTION]
> **Batch 4 (Last)** — Execute AFTER #18 and #19 are merged

| Relationship | Details |
|--------------|---------|
| **Depends On** | #19 (Sound System — for volume integration) |
| **Conflicts With** | #18 (both modify `StartMenu.tsx`, `icons.tsx`, `HomeClient.tsx`) |
| **Safe to Start** | Only after #19 is merged |

---

## Overview

Add a basic music player application that can be opened from the Start Menu or a desktop icon. The player should have standard playback controls and display a list of songs aligned with files in the `sfx/` folder.

### Features

1. **Music Player Window**
   - Windows 95-style media player UI
   - Play, Pause, Next, Previous buttons
   - Song list view with clickable tracks
   - Current song display with progress indicator

2. **Integration Points**
   - Accessible from Start Menu (Programs submenu)
   - Optional desktop icon
   - Uses existing `Win95Window` component

3. **Audio Source**
   - Play audio files from `sfx/` folder
   - Integrate with volume slider from Taskbar

---

## Expected Code Changes

### New Files

| File | Purpose |
|------|---------|
| `components/win95/MusicPlayer.tsx` | Main music player component |
| `__tests__/components/win95/MusicPlayer.test.tsx` | Unit tests for MusicPlayer |
| `e2e/tests/music-player.spec.ts` | E2E tests for music player functionality |

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Add music player window handling, desktop icon option |
| `components/win95/StartMenu.tsx` | Add "Music Player" entry to Programs submenu |
| `components/win95/icons.tsx` | Add `MusicPlayerIcon` (CD/music note icon) |
| `components/HomeClient.tsx` | Add music player to windows array |

---

## Architecture Notes

### Music Player Component Structure

```
MusicPlayer.tsx
├── PlayerControls           // Play, Pause, Next, Previous buttons
├── SongList                 // Scrollable list of available tracks
├── NowPlaying               // Current song title and progress
└── VolumeIndicator          // Shows current volume (synced with Taskbar)
```

### Window Integration

- Reuse `Win95Window` wrapper for consistent look
- Add `iconType: "music"` to window types
- Default window size: ~300x400px

### Audio Handling

- Use HTML5 `<audio>` element
- Load song list from `sfx/` folder or config file
- Respect Taskbar volume slider (read from localStorage or context)

### Dependency on Issue #19

> [!WARNING]
> This issue depends on the sound system from Issue #19 for volume integration. If implementing before #19, include standalone volume control.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**
   ```bash
   git checkout -b gitissue-20
   ```

2. **Commit Message Format**
   ```bash
   git commit -m "feat: add music player app (closes #20)"
   ```

3. **Push & Create PR**
   ```bash
   gh pr create --fill --push
   ```

4. **Merge** (after approval)
   ```bash
   gh pr merge --merge --delete-branch
   ```

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Dependency on Issue #19** | If #19 not merged, implement standalone volume; refactor later |
| **No audio files in sfx/** | Design tolerant of empty folder; show "No music files" message |
| **Browser autoplay restrictions** | Require user interaction before playing |
| **Icon type additions** | Extend `iconType` union type in `OSDesktop.tsx`, `Taskbar.tsx` |
| **Start Menu conflicts** | Coordinate with any pending Start Menu changes |
| **Window focus issues** | Ensure audio continues when window loses focus |
| **Mobile UX** | Touch-friendly controls; ensure buttons are tap targets |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/MusicPlayer.test.tsx`)

- [ ] Renders player controls (play, pause, next, prev)
- [ ] Displays song list from provided tracks
- [ ] Play button triggers audio playback (mocked)
- [ ] Pause button pauses playback
- [ ] Next/Previous buttons change track
- [ ] Empty song list shows "No music files" message
- [ ] Current song is highlighted in list
- [ ] Volume changes affect audio element

### Integration Tests

- [ ] Start Menu → Programs → Music Player opens window
- [ ] Desktop icon (if added) opens player window
- [ ] Closing window stops audio playback
- [ ] Multiple instances share volume setting

### E2E Tests (`e2e/tests/music-player.spec.ts`)

- [ ] Open music player from Start Menu
- [ ] Player controls are visible and clickable
- [ ] Song list displays available tracks (if any)
- [ ] Closing and reopening player works correctly
- [ ] Title bar shows "Music Player"
- [ ] Window can be minimized/restored from taskbar

### Test Commands

```bash
# Run unit tests
npm run test -- MusicPlayer

# Run all unit tests
npm run test

# Run E2E tests
npm run test:e2e -- music-player.spec.ts

# Run full CI flow
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Create `MusicPlayer.tsx` component
- [ ] Add `MusicPlayerIcon` to `icons.tsx`
- [ ] Add music player window type to `OSDesktop.tsx`
- [ ] Add "Music Player" to Start Menu
- [ ] Implement playback controls
- [ ] Implement song list from sfx folder
- [ ] Integrate with volume system
- [ ] Write unit tests
- [ ] Write E2E tests
- [ ] Verify all tests pass with `npm run ci-flow`

---

## UI Mockup Reference

```
┌─────────────────────────────────────┐
│ ♪ Music Player              [_][□][X]│
├─────────────────────────────────────┤
│  Now Playing: No track selected     │
│  ═══════════════════● 0:00 / 0:00   │
│                                     │
│  [⏮] [▶️] [⏭]                        │
│                                     │
│  ┌─ Song List ────────────────────┐ │
│  │ (No music files available)    │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

The player should match Windows 95 aesthetic with beveled buttons and classic styling.
