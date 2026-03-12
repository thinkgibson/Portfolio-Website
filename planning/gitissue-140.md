# GitHub Issue #140: Replace wallpaper selections with retro-pixel art

## Overview
This enhancement aims to replace the current standard Windows 95 wallpapers with 8 new high-quality, atmospheric retro-pixel art wallpapers, keeping the "Forest" wallpaper as the baseline style. This will result in a total of 9 retro-pixel art wallpaper options, creating a more immersive and visually consistent experience.

### Features
- 8 new dynamic retro-pixel art images generated using AI.
- Removal of old wallpaper assets from the selection list.
- Updated `WallpaperSelector` component to include the new options.
- Persistence of selected wallpaper across sessions.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `public/wallpapers/mountains.png` | Retro-pixel art mountain range at night. |
| `public/wallpapers/cyberpunk.png` | Retro-pixel art cyberpunk city street. |
| `public/wallpapers/desert.png` | Retro-pixel art desert dunes under a large moon. |
| `public/wallpapers/ocean.png` | Retro-pixel art ocean waves and rocky shore. |
| `public/wallpapers/autumn.png` | Retro-pixel art autumnal park Scene. |
| `public/wallpapers/cabin.png` | Retro-pixel art snowy cabin in the woods. |
| `public/wallpapers/space.png` | Retro-pixel art space nebula and planet. |
| `public/wallpapers/jungle.png` | Retro-pixel art ancient jungle ruins. |

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/WallpaperSelector.tsx` | Update `WALLPAPERS` constant to include new images and remove old ones (except Forest). |
| `components/win95/OSDesktop.tsx` | Update default wallpaper if needed and ensure background styles work with new images. |
| `e2e/tests/wallpaper.spec.ts` | Update tests to reflect the new wallpaper options and remove references to deleted wallpapers (like `clouds`). |
| `__tests__/components/win95/WallpaperSelector.test.tsx` | Update unit tests to match new `WALLPAPERS` list. |

---

## Architecture Notes
- Wallpapers are managed via the `useLocalStorage` hook in `OSDesktop.tsx`, which syncs the `Wallpaper` object.
- The `type: "image"` wallpapers use `background-size: auto` and `background-repeat: repeat` by default in `OSDesktop.tsx` and `WallpaperSelector.tsx`, except for `clouds` which had `cover`. New wallpapers will likely benefit from `cover` or a consistent tiling/centered approach. I will standardize them to `cover` for a full-screen immersive feel, similar to modern "desktop" behavior but with pixel art assets.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-140/pixel-art-wallpapers`

### Commit Message
- **Subject**: `gitissue-140: replace wallpapers with retro-pixel art`
- **Body**: Generated 8 new pixel art assets and updated selector component and tests.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Inconsistent pixel art style | Use consistent prompts for image generation and verify against `forest.png`. |
| Aspect ratio issues on different screens | Use `background-size: cover` to ensure images fill the desktop. |
| Test failures due to missing old wallpapers | Update all test references to the new wallpaper IDs. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.

### Unit Tests (`__tests__/components/win95/WallpaperSelector.test.tsx`)
- [ ] Verify all 9 wallpaper options are rendered.
- [ ] Verify selecting a new wallpaper calls `onApply` with correct object.

### E2E Tests (`e2e/tests/wallpaper.spec.ts`)
- [ ] Verify wallpaper selector opens from context menu.
- [ ] Verify applying a new wallpaper (e.g., `mountains`) updates the desktop background and persists on reload.
- [ ] Verify "Forest" still works as the default or first option.

### Test Commands
```bash
npm run test -- WallpaperSelector
npm run test:e2e -- wallpaper.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1: Asset Generation**: Generate 8 new pixel-art images and save to `public/wallpapers/`.
2. **Phase 2: Implementation**: Update `WallpaperSelector.tsx` and `OSDesktop.tsx`.
3. **Phase 3: Verification**: Update and run tests.

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Generate 8 new pixel-art images
- [ ] **Phase 2**: Update `components/win95/WallpaperSelector.tsx`
- [ ] **Phase 3**: Update `components/win95/OSDesktop.tsx` (standardizing background styles)
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- WallpaperSelector`
- [ ] Run E2E tests: `npm run test:e2e -- wallpaper.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval DO NOT PROCEED UNTIL APPROVAL IS RECEIVED
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
