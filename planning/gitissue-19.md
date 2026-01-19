# Git Issue #19: Add a System to Play Sounds

## Execution Order & Dependencies

> [!IMPORTANT]
> **Batch 2** — Execute AFTER #16 and #17 are merged

| Relationship | Details |
|--------------|---------|
| **Depends On** | None |
| **Required By** | #20 (Music Player uses volume integration) |
| **Conflicts With** | #16, #17 (all modify `OSDesktop.tsx` or `Taskbar.tsx`) |

---

## Overview

Implement a sound system that plays audio for various OS events. The volume should respect the existing taskbar volume slider. The system must be tolerant of missing config values and missing sound files.

### Features

1. **Sound Event System**
   - Boot sequence sound
   - Click feedback sounds
   - System reboot/shutdown sound
   - Extensible event-based architecture

2. **Configuration System**
   - `sfx/` folder for sound files
   - Config file mapping events to sound files
   - Graceful fallback for missing sounds/config values

3. **Volume Integration**
   - Respect existing volume slider in taskbar
   - Mute support when volume is 0

---

## Expected Code Changes

### New Files

| File | Purpose |
|------|---------|
| `lib/soundSystem.ts` | Core sound management: loading, playing, volume control |
| `sfx/soundConfig.json` | Config mapping event names to sound file paths |
| `sfx/` | Directory for sound files (placeholder, files added later) |
| `__tests__/lib/soundSystem.test.ts` | Unit tests for sound system |
| `e2e/tests/sound-system.spec.ts` | E2E tests for sound playback |

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Integrate sound hooks, trigger sounds on boot/reboot |
| `components/win95/Taskbar.tsx` | Expose volume state globally or via context |
| `components/win95/OSContext.tsx` | Add sound system and volume to React context |
| `components/HomeClient.tsx` | Initialize sound system on mount |

---

## Architecture Notes

### Sound System Design

```
soundSystem.ts
├── loadConfig()              // Load sfx/soundConfig.json
├── playSound(eventName)      // Play sound for event, respects volume
├── setVolume(level)          // Sync with taskbar volume slider
└── isMuted()                 // Check if volume is 0
```

### Config File Format (`sfx/soundConfig.json`)

```json
{
  "boot": "boot.wav",
  "click": "click.wav",
  "shutdown": "shutdown.wav"
}
```

### Error Tolerance

- Missing config file → silent operation, no errors
- Missing sound file → log warning in dev, silent in prod
- Null/undefined config values → skip that event silently

### Volume Integration

- Read volume from `localStorage` key `"volume"` (already used by Taskbar)
- Subscribe to volume changes via custom event or React context

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**
   ```bash
   git checkout -b gitissue-19
   ```

2. **Commit Message Format**
   ```bash
   git commit -m "feat: add sound system (closes #19)"
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
| **Browser autoplay policies** | Sounds may require user interaction first; add silent click handler on first interaction |
| **Volume slider integration** | Currently in `Taskbar.tsx` with localStorage; may need to lift state or use context |
| **Audio loading performance** | Preload sounds at startup; use `Audio` objects cached in memory |
| **Test environment** | jsdom doesn't support `Audio`; mock `HTMLAudioElement` in unit tests |
| **Mobile audio** | iOS requires user gesture to play sound; ensure boot sound waits for interaction |
| **File loading in Next.js** | Ensure sound files in `public/sfx/` are accessible via `/sfx/filename.wav` |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/lib/soundSystem.test.ts`)

- [ ] `loadConfig()` parses valid JSON config
- [ ] `loadConfig()` handles missing config file gracefully
- [ ] `playSound()` calls `Audio.play()` with correct file
- [ ] `playSound()` respects volume level
- [ ] `playSound()` does nothing when volume is 0 (muted)
- [ ] `playSound()` handles missing sound file gracefully
- [ ] `setVolume()` updates internal volume state

### Integration Tests (`__tests__/components/win95/OSDesktop.test.tsx`)

- [ ] Sound system initializes on desktop mount
- [ ] Boot sound triggered after boot sequence completes
- [ ] Reboot triggers shutdown sound

### E2E Tests (`e2e/tests/sound-system.spec.ts`)

> [!IMPORTANT]
> E2E sound testing is complex since Playwright can't verify audio output. Focus on:

- [ ] No console errors when sound system initializes
- [ ] Volume slider changes persist and are applied
- [ ] Missing sound files don't cause page errors
- [ ] Sound API methods are called (via mocking if needed)

### Test Commands

```bash
# Run unit tests
npm run test -- soundSystem

# Run all unit tests
npm run test

# Run E2E tests
npm run test:e2e -- sound-system.spec.ts

# Run full CI flow
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Create `sfx/` directory structure
- [ ] Create `sfx/soundConfig.json` with empty/null placeholders
- [ ] Create `lib/soundSystem.ts` with core functionality
- [ ] Add volume context/state management
- [ ] Integrate sound triggers in `OSDesktop.tsx`
- [ ] Handle browser autoplay policies
- [ ] Write unit tests with mocked Audio
- [ ] Write E2E tests for error tolerance
- [ ] Verify all tests pass with `npm run ci-flow`

---

## Developer Notes

> [!WARNING]
> Do NOT add actual sound files as part of this issue. The issue states: "Do not create or assign any sounds - they will be added later."

The implementation should create the infrastructure only. Use placeholder/null values in the config file that the system gracefully ignores.
