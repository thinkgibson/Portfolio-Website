# Git Issue #78: Fix Window Dragging Constraint Bugs

## Overview
Fix six failing E2E tests across multiple browsers related to window dragging constraints. The current implementation has three distinct bugs:
1. Windows can be dragged completely off-screen (should maintain at least 10px visibility)
2. Windows can be dragged into the taskbar area (bottom 48px should be restricted)
3. Windows are not properly nudged above taskbar when viewport resizes

### Features
- Prevent windows from being dragged completely off-screen (maintain minimum 10px visibility)
- Prevent windows from being dragged into taskbar area (bottom 48px)
- Automatically nudge windows above taskbar when viewport resizes
- Fix all 6 E2E tests across Chromium, Firefox, and Webkit

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Win95Window.tsx` | Fix drag constraint logic in `effectiveDragConstraints` useMemo (lines 240-263) and `onDragEnd` handler (lines 339-355) to properly enforce off-screen and taskbar collision prevention |
| `components/win95/OSDesktop.tsx` | Fix viewport resize handler `handleResize` (lines 165-184) to properly nudge windows above taskbar with correct height calculations |

---

## Architecture Notes

### Current Implementation Issues

**Win95Window.tsx (lines 240-263):**
- `effectiveDragConstraints` calculates relative drag constraints
- Uses `measuredHeight` to determine bottom boundary
- Current calculation: `maxY = window.innerHeight - TASKBAR_HEIGHT - h`
- Then converts to relative: `bottom: Math.max(0, maxY - currentY)`
- **Problem**: This calculation doesn't account for the window's actual bottom edge position

**Win95Window.tsx (lines 339-355):**
- `onDragEnd` handler clamps the final position after drag
- Uses similar logic: `maxY = window.innerHeight - TASKBAR_HEIGHT - measuredHeight`
- **Problem**: `measuredHeight` may be stale or incorrect during drag operations

**OSDesktop.tsx (lines 165-184):**
- `handleResize` nudges windows on viewport resize
- Current calculation: `maxY = window.innerHeight - TASKBAR_HEIGHT - 10`
- **Problem**: Doesn't account for actual window height, only uses fixed -10 offset

### Root Cause Analysis

The fundamental issue is **inconsistent window height tracking**:
1. Win95Window uses `measuredHeight` state that updates via ResizeObserver
2. This height may not be accurate during drag operations
3. OSDesktop's resize handler doesn't know individual window heights
4. The constraint logic needs window bottom edge (y + height) to be <= viewport - taskbar

### Proposed Solution

**Strategy 1: Fix Drag Constraints (Win95Window.tsx)**
- Ensure `measuredHeight` accurately reflects current window dimensions
- Update constraint calculations to use window bottom edge: `y + height`
- Add extra buffer to prevent edge cases (-11px tolerance for test expectations)

**Strategy 2: Fix Resize Nudging (OSDesktop.tsx)**
- Pass window heights from openWindows state to constraint calculations
- Use actual window height in maxY calculation: `maxY = newViewportHeight - TASKBAR_HEIGHT - windowHeight`
- Ensure nudging happens even if window is "close" to boundary

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-78/fix-window-constraints`
2. **Commit Format**: `git commit -m "gitissue-78: fix window dragging constraint bugs"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Breaking existing window drag behavior | Run full E2E test suite to catch regressions |
| Performance impact from height measurements | ResizeObserver already in use, no additional overhead |
| Browser-specific rendering differences | Tests run on Chromium, Firefox, Webkit—all must pass |
| Edge case: Maximized windows | Skip constraint logic when `isMaximized === true` (already handled) |
| Edge case: Mobile devices | Skip constraint logic when `isMobile === true` (already handled) |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### E2E Tests (Existing - Should Pass After Fix)

**`e2e/tests/test-windows.spec.ts`:**
- [x] "window cannot be dragged completely off-screen" (line 42)
  - Drag to top-left (-50, -50), expect x >= -11, y >= -11
  - Drag to bottom-right (viewport + 500), expect x < viewport.width, y < viewport.height - 30

**`e2e/tests/window-taskbar-collision.spec.ts`:**
- [x] "window cannot be dragged into the taskbar area" (line 8)
  - Drag toward taskbar, expect y <= viewport.height - TASKBAR_HEIGHT
- [x] "window is nudged above taskbar on viewport resize" (line 47)
  - Resize viewport to 400px height, expect y <= 400 - TASKBAR_HEIGHT - 10

### Test Commands
```bash
# Run specific test files
npm run test:e2e -- test-windows.spec.ts
npm run test:e2e -- window-taskbar-collision.spec.ts

# Run full E2E suite
npm run test:e2e

# Run CI flow (includes unit + E2E)
npm run ci-flow
```

---

## Implementation Checklist

- [/] **Phase 1: Planning**
  - [x] Analyze failing tests and understand expectations
  - [x] Review current constraint implementation in Win95Window.tsx
  - [x] Review viewport resize logic in OSDesktop.tsx
  - [x] Identify root causes and design solution
  - [ ] Get user approval on plan

- [ ] **Phase 2: Implementation**
  - [ ] Create git branch `gitissue-78/fix-window-constraints`
  - [ ] Fix `effectiveDragConstraints` calculation in Win95Window.tsx
    - Ensure bottom constraint prevents window bottom from entering taskbar
    - Account for test tolerance (-11px for off-screen)
  - [ ] Fix `onDragEnd` position clamping in Win95Window.tsx
    - Use accurate window height for maxY calculation
    - Ensure consistent clamping logic
  - [ ] Fix `handleResize` in OSDesktop.tsx
    - Calculate maxY using actual window dimensions from state
    - Nudge windows that would collide with taskbar after resize

- [ ] **Phase 3: Testing**
  - [ ] Run `npm run test:e2e -- test-windows.spec.ts` (verify 1 test passes)
  - [ ] Run `npm run test:e2e -- window-taskbar-collision.spec.ts` (verify 2 tests pass)
  - [ ] Run full E2E suite `npm run test:e2e`
  - [ ] Run `npm run ci-flow` for complete verification

- [ ] **Phase 4: Review & Merge**
  - [ ] Commit changes: `gitissue-78: fix window dragging constraint bugs`
  - [ ] Request user approval
  - [ ] Create and merge PR via git-pr-merge skill

---

## Technical Details

### Key Constants
- `TASKBAR_HEIGHT = 48` (defined in both files)
- Off-screen tolerance: -11px (allows small portion off-screen per tests)
- Minimum visibility: 10px (implied by test expectations)

### State Management
- **Win95Window.tsx**: `measuredHeight` state + ResizeObserver
- **OSDesktop.tsx**: `openWindows` state contains `x, y, width, height` for each window

### Constraint Calculation Formula
```javascript
// For drag constraints (relative to current position)
const maxY = window.innerHeight - TASKBAR_HEIGHT - windowHeight;
const relativeBottom = maxY - currentY;

// For position clamping (absolute coordinates)
const clampedY = Math.min(currentY, window.innerHeight - TASKBAR_HEIGHT - windowHeight);
```
