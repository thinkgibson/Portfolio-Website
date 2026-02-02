# Git Issue #64: Add expandable folders to Start Menu

## Overview
Currently, the Start Menu displays folder shortcuts as flat items that open a new window when clicked. This change will replace these shortcuts with expandable submenus that show the folder's contents on hover or click, while still allowing the user to open the folder window itself.

### Features
- Hierarchical items in the Start Menu.
- Submenus that appear when hovering over a folder item.
- Support for multiple levels of nesting (if applicable, though usually only one or two).
- Ability to click the folder item itself to open it as a window.
- Right arrow icon indicating a submenu.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `components/win95/StartSubMenu.tsx` | Renders a nested menu when a folder item is hovered in the main Start Menu. |

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/StartMenu.tsx` | Refactor to handle nested `AppDefinition` items, manage hover state for submenus, and render the `StartSubMenu`. |
| `components/win95/OSDesktop.tsx` | Update the `availableApps` logic to provide the hierarchical structure instead of a flattened list. |
| `lib/types.ts` | (Optional) Ensure `AppDefinition` and related types support the hierarchy (already seems to support `children`). |

---

## Architecture Notes
- **State Management**: The `StartMenu` will manage a local `activeSubMenuId` state to track which submenu is currently visible.
- **Component Hierarchy**:
  - `OSDesktop` -> `StartMenu` -> `StartSubMenu` (recursive if needed).
- **Positioning**: Submenus will be positioned absolutely, relative to their parent item, offset to the right. Use `framer-motion` for smooth appearance.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

**For GitHub Issues:**
1. **Create Branch**: `git checkout -b gitissue-64/expandable-start-menu`
2. **Commit Format**: `git commit -m "gitissue-64: add expandable folders to start menu"`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Z-index issues with submenus | Ensure submenus have a higher z-index than the Start Menu but below other system modal elements if any. |
| Mobile/tablet UX | Submenus will open on **click/tap** instead of hover for touch users. Use `useIsMobile` hook to toggle trigger mechanism. |
| Collision with screen edges | Implement logic to flip the submenu to the left if it would go off-screen. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/StartMenu.test.tsx`)
- [ ] Render hierarchical items correctly.
- [ ] Show submenu on hovering a folder item.
- [ ] Hide submenu on mouse leave (with delay).
- [ ] Open app when clicking an item in the submenu.
- [ ] Open folder window when clicking the folder item itself.

### E2E Tests (`e2e/tests/start-menu-folders.spec.ts`)
- [ ] User flow: Open Start Menu, hover over "Accessories", click "Notepad", verify Notepad opens.
- [ ] User flow: Open Start Menu, click "Accessories" directly, verify Accessories folder opens.

### Test Commands
```bash
npm run test -- StartMenu
npm run test:e2e -- start-menu-folders.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Create `gitissue-64/expandable-start-menu` branch.
- [ ] Modify `OSDesktop.tsx` to pass hierarchical apps.
- [ ] Update `StartMenu.tsx` to handle nested items and hover state.
- [ ] Create `StartSubMenu.tsx`.
- [ ] Add right arrow icon to folder items in `StartMenu`.
- [ ] Implement hover delay for submenus.
- [ ] Verify functionality manually.
- [ ] Add and run unit tests.
- [ ] Add and run E2E tests.
- [ ] Run CI flow and merge.
