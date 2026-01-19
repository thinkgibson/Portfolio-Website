# Git Issue #16: Add the Ability to Change the Wallpaper

## Execution Order & Dependencies

> [!NOTE]
> **Batch 1 (Parallel Safe)** — Can run simultaneously with #17

| Relationship | Details |
|--------------|---------|
| **Depends On** | None |
| **Conflicts With** | #18, #19 (all modify `OSDesktop.tsx`) |
| **Safe to Parallel** | #17 (Taskbar Menu) |

---

## Overview

Add a wallpaper selection window that appears when the user selects "Change wallpaper" from the desktop right-click context menu. The window displays a 3x3 grid of 9 wallpaper options matching Windows 95 style, including at least one Windows 3.1 default wallpaper color.

### Features

1. **Wallpaper Selector Window**
   - New Win95-style modal/window component
   - 3x3 thumbnail grid showing wallpaper previews
   - Click-to-select functionality with visual feedback
   - "Apply" and "Cancel" buttons for confirmation

2. **Wallpaper Options**
   - 9 unique wallpaper choices matching Windows 95 aesthetic
   - One solid teal color (classic Windows 3.1 default)
   - Mix of patterns, solid colors, and classic 90s designs

3. **Integration with Context Menu**
   - Wire "Change wallpaper" action (currently placeholder) to open the selector
   - Persist selected wallpaper using `localStorage`

---

## Expected Code Changes

### New Files

| File | Purpose |
|------|---------|
| `components/win95/WallpaperSelector.tsx` | New component for wallpaper selection UI |
| `__tests__/components/win95/WallpaperSelector.test.tsx` | Unit tests for WallpaperSelector |
| `e2e/tests/wallpaper.spec.ts` | Playwright E2E tests for wallpaper functionality |
| `public/wallpapers/` | Directory containing wallpaper images |

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Add wallpaper state, handler for opening selector, apply background style |
| `components/HomeClient.tsx` | Pass wallpaper-related props if needed |
| `lib/hooks.ts` or new `lib/wallpaper.ts` | Add `localStorage` persistence hook for wallpaper |

---

## Architecture Notes

- **State Management**: Wallpaper state should live in `OSDesktopContent` and persist to `localStorage`
- **Window Integration**: The selector should open as a new window (reusing `Win95Window`) to maintain consistent UX
- **CSS Approach**: Apply wallpaper via inline style on the desktop container, falling back to teal default

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**
   ```bash
   git checkout -b gitissue-16
   ```

2. **Commit Message Format**
   ```bash
   git commit -m "feat: add wallpaper selector (closes #16)"
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
| **Context menu integration** | `ContextMenu.tsx` already has placeholder for "Change wallpaper" - verify action wiring doesn't conflict with recent changes |
| **localStorage conflicts** | Use unique key (e.g., `win95-wallpaper`) to avoid collisions with volume slider (`volume`) |
| **Large image assets** | Optimize wallpaper images for web; consider using CSS patterns for some options |
| **Mobile responsiveness** | Ensure grid layout works on mobile viewports; may need 2x2 layout on small screens |
| **Window z-index conflicts** | Selector should follow existing window focus patterns in `OSDesktop.tsx` |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/WallpaperSelector.test.tsx`)

- [ ] Renders 9 wallpaper options in a grid
- [ ] Clicking a wallpaper option selects it (visual feedback)
- [ ] "Apply" button triggers callback with selected wallpaper
- [ ] "Cancel" button closes without applying changes
- [ ] Current wallpaper is pre-selected on open

### Integration Tests (`__tests__/components/win95/OSDesktop.test.tsx`)

- [ ] Context menu "Change wallpaper" opens the selector
- [ ] Applying wallpaper changes desktop background
- [ ] Wallpaper persists in localStorage
- [ ] Wallpaper restores on page reload (mock localStorage)

### E2E Tests (`e2e/tests/wallpaper.spec.ts`)

- [ ] Right-click desktop → "Change wallpaper" opens selector
- [ ] Select wallpaper → click Apply → background changes
- [ ] Reload page → wallpaper persists
- [ ] Cancel closes selector without changes

### Test Commands

```bash
# Run unit tests
npm run test -- WallpaperSelector

# Run all unit tests
npm run test

# Run E2E tests
npm run test:e2e -- wallpaper.spec.ts

# Run full CI flow
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Create `WallpaperSelector.tsx` component
- [ ] Add wallpaper state and persistence to `OSDesktop.tsx`
- [ ] Wire context menu action to open selector
- [ ] Add wallpaper assets to `public/wallpapers/`
- [ ] Write unit tests for `WallpaperSelector`
- [ ] Write integration tests for `OSDesktop`
- [ ] Write E2E tests for full user flow
- [ ] Verify all tests pass with `npm run ci-flow`
