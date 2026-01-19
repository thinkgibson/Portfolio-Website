# Git Issue #17: Add a Right-Click Window Menu for Applications in Bottom Taskbar

## Execution Order & Dependencies

> [!NOTE]
> **Batch 1 (Parallel Safe)** — Can run simultaneously with #16

| Relationship | Details |
|--------------|---------|
| **Depends On** | None |
| **Conflicts With** | #19 (both modify `Taskbar.tsx`) |
| **Safe to Parallel** | #16 (Wallpaper) |

---

## Overview

When a window button is right-clicked in the bottom taskbar, a context menu should appear with options to manage that application window.

### Features

1. **Taskbar Context Menu**
   - Appears on right-click of any window button in taskbar
   - Options: "Open", "Minimize", "Close"
   - Positioned near the clicked button

2. **Menu Actions**
   - **Open/Restore**: Brings window to front and restores if minimized
   - **Minimize**: Minimizes the window
   - **Close**: Closes the application window

---

## Expected Code Changes

### New Files

| File | Purpose |
|------|---------|
| `__tests__/components/win95/TaskbarContextMenu.test.tsx` | Unit tests for taskbar context menu |
| `e2e/tests/taskbar-context-menu.spec.ts` | E2E tests for right-click functionality |

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | Add context menu state and right-click handler for window buttons |
| `components/win95/ContextMenu.tsx` | Reuse existing context menu component (no changes likely needed) |

---

## Architecture Notes

### Reusing Existing ContextMenu

The existing `ContextMenu.tsx` component (used for desktop right-click) can be reused:
- Pass position (`x`, `y`) based on button location
- Pass menu items array with window-specific actions
- Callbacks should reference the specific window ID

### State Management

```tsx
// In Taskbar.tsx
const [taskbarContextMenu, setTaskbarContextMenu] = useState<{
    windowId: string;
    x: number;
    y: number;
} | null>(null);
```

### Menu Items per Window

```tsx
const menuItems = [
    { label: "Open", action: () => onWindowClick(windowId) },
    { label: "Minimize", action: () => onMinimize(windowId) },
    { label: "Close", action: () => onClose(windowId) }
];
```

### Prop Changes

The `Taskbar` component will need additional callback props from `OSDesktop`:
- `onMinimizeWindow: (id: string) => void`
- `onCloseWindow: (id: string) => void`

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**
   ```bash
   git checkout -b gitissue-17
   ```

2. **Commit Message Format**
   ```bash
   git commit -m "feat: add taskbar window right-click menu (closes #17)"
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
| **Desktop vs Taskbar context menu conflicts** | Ensure only one context menu visible at a time; close desktop menu when taskbar menu opens |
| **Props drilling** | May need to pass onMinimize/onClose from OSDesktop to Taskbar |
| **Z-index issues** | Taskbar context menu needs z-index > taskbar (z-50) |
| **Mobile touch** | Long-press for right-click on mobile; or skip for mobile UX |
| **Context menu positioning** | Menu should appear above taskbar, not below (off-screen) |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/Taskbar.test.tsx`)

- [ ] Right-click on window button opens context menu
- [ ] Context menu shows "Open", "Minimize", "Close" options
- [ ] "Open" calls onWindowClick with correct ID
- [ ] "Minimize" calls onMinimize with correct ID
- [ ] "Close" calls onClose with correct ID
- [ ] Clicking outside closes context menu
- [ ] Only one context menu visible at a time

### E2E Tests (`e2e/tests/taskbar-context-menu.spec.ts`)

- [ ] Right-click window button in taskbar shows context menu
- [ ] Click "Open" brings window to front
- [ ] Click "Minimize" minimizes the window
- [ ] Click "Close" closes the window
- [ ] Clicking away dismisses the menu
- [ ] Menu appears above taskbar (not cut off)

### Test Commands

```bash
# Run unit tests
npm run test -- Taskbar

# Run all unit tests
npm run test

# Run E2E tests
npm run test:e2e -- taskbar-context-menu.spec.ts

# Run full CI flow
npm run ci-flow
```

---

## Implementation Checklist

- [ ] Add context menu state to `Taskbar.tsx`
- [ ] Add right-click handler to window buttons
- [ ] Pass required callbacks from `OSDesktop.tsx` to `Taskbar`
- [ ] Render `ContextMenu` component in Taskbar
- [ ] Position menu above the clicked button
- [ ] Write unit tests for Taskbar context menu
- [ ] Write E2E tests for full user flow
- [ ] Verify all tests pass with `npm run ci-flow`
