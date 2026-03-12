# GitHub Issue #143: Redesign Media Player to Windows 95 Style

## Overview
Redesign the `MusicPlayer` component to authentic Windows 95 `mplayer.exe` aesthetic while maintaining existing functionality. This includes updating icons, borders, layouts, and the playback control bar.

### Features
- [ ] Windows 95 styled playbar/slider with 3D inset/outset borders.
- [ ] Authentic 16-color style Windows 95 icons for transport controls.
- [ ] High-contrast clip info section (black background, white/green text).
- [ ] Status bar with icon and playing state info.
- [ ] 3D beveled container using consistent `#c0c0c0` background.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/MusicPlayer.tsx` | - Replace SVG icons with authentic Win95 transport icons.<br>- Redesign layout into three main sections: Display (top), Slider (middle), Controls (bottom).<br>- Implement 3D borders using `win95-beveled` and `win95-beveled-inset`.<br>- Update slider styling to match Win95 style.<br>- Add status bar at the bottom with authentic formatting. |

---

## Architecture Notes
- **State Management**: Continue using `useOS` for global volume and local state for track management.
- **Component Hierarchy**:
  - `MusicPlayer` (Main Container)
    - `DisplayArea` (Black background, Track info)
    - `TrackSlider` (Custom range input or styled div)
    - `ControlPanel` (Transport buttons, volume, status bar)
- **Styling**: Strictly follow `tailwind.config.js` Win95 tokens.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-143/redesign-media-player`

### Commit Message
- **Subject**: `gitissue-143: redesign media player to windows 95 style`
- **Body**: Updates layout, icons, and borders to match authentic mplayer.exe look.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Slider styling complexity | Use a standard `input[type="range"]` with custom CSS in `globals.css` or inline styles for the track and thumb to ensure it looks 3D. |
| Icon accuracy | Research and implement SVG paths that closely mirror the original Win95 system icons. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.

### Unit Tests (`__tests__/components/win95/MusicPlayer.test.tsx`)
- [ ] Ensure all transport buttons are still present and functional.
- [ ] Verify track info updates correctly in the new display area.

### E2E Tests (`e2e/tests/music-player-app.spec.ts`)
- [ ] Verify visibility of new elements (status bar, display info).
- [ ] Ensure play/pause/stop functionality remains intact.

### Test Commands
```bash
npm run test -- MusicPlayer
npm run test:e2e -- music-player-app.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1: Research & Assets**: Identify exact SVG paths for Win95 icons and slider styles.
2. **Phase 2: Component Refactor**: Reorganize the JSX in `MusicPlayer.tsx` to match the new layout.
3. **Phase 3: Styling**: Apply final Win95 beveled styles and fine-tune spacing.
4. **Phase 4: Verification**: Run tests and perform visual check.

---

## Implementation Checklist

### Preparation
- [x] Move issue to "in progress" using the `update-git-issue` skill
- [x] Create git branch using the `create-branch-git` skill

### Implementation
- [x] **Phase 1**: Update `Icons` object in `MusicPlayer.tsx` with authentic SVG paths.
- [x] **Phase 2**: Refactor `MusicPlayer` layout (Display, Slider, Controls sections).
- [x] **Phase 3**: Implement custom styling for the range slider (track and thumb).
- [x] **Phase 4**: Add the status bar section with icon and timing info.
- [x] Verify implementation against "Expected Code Changes".

### Verification
- [x] Run unit tests: `npm run test -- MusicPlayer`
- [x] Run E2E tests: `npm run test:e2e -- music-player-app.spec.ts`
- [x] **MANDATORY**: Run E2E baseline comparison using the `run-e2e-tests` skill
- [x] Run full CI flow: `npm run ci-flow` (Verified via targeted tests)

### Submission
- [ ] Commit changes using the `commit-git` skill
- [ ] Move the issue to "in review" using the `update-git-issue` skill
- [ ] **MANDATORY**: Request user approval
- [ ] Create PR using the `create-pr-git` skill
- [ ] Merge the PR using the `merge-git` skill
- [ ] Attach planning doc and walkthrough to the GitHub issue using the `update-git-issue` skill
- [ ] Move the issue to "done" using the `update-git-issue` skill
