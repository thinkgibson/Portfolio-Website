# Git Issue #79: Fix Start Menu Submenu Interaction Failures

## Overview

Three E2E tests are failing due to Start Menu submenu interaction issues on Firefox, Webkit, and Mobile Safari. The problem is that hovering over folder items (on desktop) and clicking folder items (on mobile) is not correctly opening submenus in these browsers.

### Features

- Fix hover-based submenu opening on Firefox and Webkit (desktop)
- Fix click-based submenu toggling on Mobile Safari
- Ensure all 3 failing E2E tests pass across affected browsers

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/StartMenu.tsx` | Debug and fix hover event handling for Firefox/Webkit; ensure `handleMouseEnter` properly triggers submenu state |
| `components/win95/StartSubMenu.tsx` | Debug and fix hover event handling for nested submenus; verify `handleMouseEnter` behavior |
| `e2e/tests/start-menu-folders.spec.ts` | Potentially update test implementation if interaction patterns need adjustment (though tests currently appear correct) |

### No New Files Expected

This is a bug fix, not a feature addition.

---

## Architecture Notes

### Current Implementation

Both `StartMenu.tsx` and `StartSubMenu.tsx` use similar patterns:

1. **Desktop Hover Behavior**:
   - `onMouseEnter` on the menu item wrapper triggers `handleMouseEnter(id, hasChildren)`
   - If `!isMobile` and `hasChildren`, sets a 200ms timeout to show the submenu
   - `setActiveSubMenuId(id)` controls which submenu is visible

2. **Mobile Click Behavior**:
   - `onClick` on the button triggers `handleItemClick(item)`
   - If item has children, toggles `activeSubMenuId` between `item.id` and `null`
   - Otherwise, executes the item action

3. **State Management**:
   - `activeSubMenuId` (string | null) - controls which submenu is currently open
   - `hoverTimeoutRef` - manages hover delay timers
   - `isMobile` from `useIsMobile()` hook - determines behavior mode

### Potential Issues

1. **Firefox/Webkit Hover Issue**:
   - `onMouseEnter` may not be firing correctly on the wrapper div
   - The 200ms timeout may be getting cleared prematurely
   - `isMobile` detection may be incorrectly returning `true` on desktop browsers
   - Event bubbling or timing issues with the hover state

2. **Mobile Safari Click Issue**:
   - Touch event handling may differ from other mobile browsers
   - `isMobile` detection may not be working correctly
   - Click events may not be propagating correctly
   - Force click in tests may be masking a real UI issue

### Investigation Strategy

1. Add debug logging to `handleMouseEnter`, `handleMouseLeave`, `handleItemClick`
2. Log `isMobile` value on component mount
3. Verify `onMouseEnter` events are firing in Firefox/Webkit
4. Check if timeout is being cleared unexpectedly
5. For Mobile Safari, verify click events and `activeSubMenuId` state changes

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

**For GitHub Issue #79:**
1. **Create Branch**: `git checkout -b gitissue-79/fix-start-menu-submenu-interactions`
2. **Commit Format**: `git commit -m "gitissue-79: fix start menu submenu interactions on Firefox, Webkit, and Mobile Safari"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Breaking existing Start Menu behavior on Chromium/other browsers | Run full E2E test suite across all browsers before merging |
| Changing hover timing may affect user experience | Test manually on desktop browsers; keep 200ms delay unless issue is timing-related |
| Mobile detection logic may affect other components | Verify `useIsMobile()` hook is working correctly; avoid modifying it if possible |
| Event handler changes may introduce new race conditions | Use proper cleanup in `useEffect` for timeouts; clear all timeouts appropriately |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### E2E Tests (`e2e/tests/start-menu-folders.spec.ts`)

Existing tests that need to pass:
- [x] "should open submenu on hover (Desktop only)" - **Currently failing on Firefox, Webkit**
- [x] "should open submenu on click in desktop mode" - Status unknown, verify passes
- [x] "should open submenu on click (Mobile only)" - **Currently failing on Mobile Safari**

No new tests required - we're fixing existing test failures.

### Manual Testing

After implementation, manually verify:
- [ ] Hover over "Accessories" in Start Menu opens submenu (Firefox)
- [ ] Hover over "Accessories" in Start Menu opens submenu (Webkit/Safari desktop)
- [ ] Hover over "Multimedia" in Start Menu opens submenu (Firefox)
- [ ] Hover over "Multimedia" in Start Menu opens submenu (Webkit/Safari desktop)
- [ ] Click on folder item opens submenu on Mobile Safari (iPhone emulation)
- [ ] Nested submenus work correctly (hover/click on submenu items)

### Test Commands

```bash
# Run specific E2E test file
npm run test:e2e -- start-menu-folders.spec.ts

# Run full E2E suite
npm run test:e2e

# Run full CI flow (includes unit tests, E2E tests, linting)
npm run ci-flow
```

---

## Implementation Checklist

### Phase 1: Investigation & Debugging
- [ ] Add console.log statements to `StartMenu.tsx` and `StartSubMenu.tsx`
  - [ ] Log `isMobile` value on mount
  - [ ] Log when `handleMouseEnter` is called with parameters
  - [ ] Log when `handleMouseLeave` is called
  - [ ] Log when `handleItemClick` is called with parameters
  - [ ] Log `activeSubMenuId` state changes
- [ ] Run E2E tests on Firefox to capture debug logs
- [ ] Run E2E tests on Webkit to capture debug logs
- [ ] Run E2E tests on Mobile Safari to capture debug logs
- [ ] Analyze logs to identify root cause

### Phase 2: Implementation
- [ ] Based on findings, implement fix in `StartMenu.tsx`
- [ ] Based on findings, implement fix in `StartSubMenu.tsx` (if needed)
- [ ] Remove debug logging statements

### Phase 3: Testing
- [ ] Run `npm run test:e2e -- start-menu-folders.spec.ts` on all browsers
- [ ] Verify all 3 tests pass on Firefox
- [ ] Verify all 3 tests pass on Webkit
- [ ] Verify all 3 tests pass on Mobile Safari
- [ ] Run `npm run ci-flow` to ensure no regressions

### Phase 4: Verification
- [ ] Manually test hover behavior on Firefox
- [ ] Manually test hover behavior on Webkit/Safari
- [ ] Manually test click behavior on Mobile Safari emulation
- [ ] Verify no regressions on Chromium

---

## Related Issues

- Issue #77: This issue was discovered while fixing E2E test failures
- These are genuine bugs in submenu interaction behavior, not test issues

---

## Success Criteria

✅ All 3 failing E2E tests pass on affected browsers:
  - `start-menu-folders.spec.ts` : "should open submenu on hover (Desktop only)" passes on Firefox and Webkit
  - `start-menu-folders.spec.ts` : "should open submenu on click (Mobile only)" passes on Mobile Safari

✅ No regressions in other browsers (Chromium, Mobile Chrome)

✅ Full CI flow passes (`npm run ci-flow`)

✅ Manual testing confirms proper submenu behavior
