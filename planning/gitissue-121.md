# GitHub Issue #121: Improved Windows 95 Media Player Experience

## Overview

Redesign the Media Player component (`MusicPlayer.tsx`) to closely match the authentic Windows 95 `mplayer.exe` look and feel. This includes tightening layout/spacing, using authentic-style transport icons, improving the timer display format, and integrating a visible playlist of sound effects.

### Features

- **Redesigned UI**: Compact layout matching Win95 `mplayer.exe` — smaller display area, tighter controls
- **Reduced Spacing**: Remove modern padding/gaps (`p-8`, `mb-8`, `h-48`, `gap-4`) in favor of compact Win95 spacing
- **Authentic Icons**: Replace Lucide icons (`Play`, `Pause`, `Square`, `SkipBack`, `SkipForward`) with inline SVG icons styled like Win95 transport buttons
- **Improved Timer**: Change from separate `formatTime(currentTime) / formatTime(duration)` to standard `0:00 / 0:30` format (already nearly correct, but displayed too large at `text-[36px]`)
- **Integrated Playlist**: Already implemented as a table; refine styling to be more compact and authentic
- **Functional Parity**: Keep existing volume control and playback logic intact

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/MusicPlayer.tsx` | Redesign layout: reduce display area height, tighten spacing/padding, replace Lucide icons with SVG transport icons, reduce font sizes, adjust timer display, refine playlist table styling |
| `config/apps.config.tsx` | Potentially adjust default window dimensions (currently 350×450) to better fit compact layout |
| `__tests__/components/win95/MusicPlayer.test.tsx` | Update tests if DOM structure changes (e.g., button titles, new elements) |
| `e2e/tests/music-player-app.spec.ts` | Update E2E tests if selectors or visible text changes; add new tests for playlist interaction |

### No New Files Expected

The changes are confined to the existing `MusicPlayer.tsx` component and associated test files.

---

## Architecture Notes

- **State management**: No changes — continues using local `useState` for playback state and `useOS()` for volume
- **Component hierarchy**: `MusicPlayer` is a leaf component rendered inside the `multimedia` folder via `apps.config.tsx`
- **Data flow**: Tracks loaded from `/sfx/soundConfig.json` on mount — no changes to this flow
- **Icons**: Replace Lucide `react` icon imports with inline SVGs or simple CSS-styled squares/triangles for authenticity
- **Styling**: Continue using Tailwind utility classes (`win95-button`, `win95-beveled`) — reduce padding/margin values inline

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-121/media-player-redesign`

### Commit Message
- **Subject**: `gitissue-121: redesign Media Player for authentic Win95 look`
- **Body**: Reduce spacing, replace icons with SVG transport controls, improve timer format, tighten playlist layout

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Changing button `title` attributes breaks E2E selectors | Keep existing `title` values (`Play`, `Pause`, `Stop`, `Previous`, `Next`) unchanged |
| Removing Lucide imports may leave unused package | Only remove used imports, not the package itself (other components may use Lucide) |
| Compact layout may not render well on small window sizes | Test at default 350×450 and smaller; adjust `minWidth`/`minHeight` in config if needed |
| SVG icon rendering differences across browsers | Use simple geometric shapes (triangles, rectangles) that render consistently |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../../../.agent/skills/design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../../../.agent/skills/run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/MusicPlayer.test.tsx`)

Existing tests (3) should continue passing:
- [x] Renders "No Track Selected" initially
- [x] Renders control buttons (Play, Stop, Previous, Next)
- [x] Toggles play state on click

New/updated tests:
- [ ] Verify timer display format shows `0:00 / 0:00` pattern
- [ ] Verify playlist table renders track rows

### E2E Tests (`e2e/tests/music-player-app.spec.ts`)

Existing tests (3) should continue passing:
- [x] Opens Media Player from Multimedia folder
- [x] Toggles play/pause state
- [x] Stops playback and resets timer

New tests:
- [ ] Verify clicking a track in the playlist selects it and starts playback
- [ ] Verify playlist displays all tracks from soundConfig

### Test Commands
```bash
npm run test -- MusicPlayer
npm run test:e2e -- music-player-app.spec.ts
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1: UI Redesign** — Rework layout and spacing in `MusicPlayer.tsx`. Replace Lucide icons with SVG transport controls. Adjust font sizes and display area dimensions.
2. **Phase 2: Tests & Verification** — Update existing unit/E2E tests as needed, add new tests for playlist interaction and timer format. Run baseline comparison.

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../.agent/skills/create-branch-git/SKILL.md)

### Implementation
- [x] **Phase 1**: Redesign `MusicPlayer.tsx` — compact layout, SVG icons, tighter spacing, improved timer
- [x] Adjust window dimensions in `apps.config.tsx` if needed
- [x] Verify implementation against "Expected Code Changes"

### Verification
- [x] Run unit tests: `npm run test -- MusicPlayer`
- [x] Run E2E tests: `npm run test:e2e -- music-player-app.spec.ts`
- [x] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../.agent/skills/run-e2e-tests/SKILL.md)
- [x] Run full CI flow: `npm run ci-flow`

### Submission
- [x] Commit changes (Format: `gitissue-121: redesign Media Player for authentic Win95 look`) using the [commit-git skill](../.agent/skills/commit-git/SKILL.md)
- [x] Move the issue to "in review" using the update-git-issue skill
- [x] Request user approval
- [x] Create PR using the [create-pr-git skill](../.agent/skills/create-pr-git/SKILL.md)
- [x] Merge the PR using the [merge-git skill](../.agent/skills/merge-git/SKILL.md)
- [x] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [x] Move the issue to "done" using the update-git-issue skill
