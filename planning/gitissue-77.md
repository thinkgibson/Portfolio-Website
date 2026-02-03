# Git Issue #77: Fix failing E2E test cases

## Overview
This task involves analyzing and fixing all failing End-to-End (E2E) test cases in the Portfolio Website test suite. The failures have been categorized by root cause to enable efficient, systematic resolution. Additionally, timeout issues need to be investigated and either fixed or reduced to a maximum of 5 seconds per requirement.

### Features
- Group E2E test failures into logical categories for systematic fixes
- Fix all Start Menu interaction failures across browsers
- Fix all Terminal command failures 
- Fix window dragging and taskbar collision issues
- Fix Video Essays app availability in Start Menu
- Resolve UI styling timeouts (Notepad branding, Window Help menu, Win95 scrollbar)
- Resolve Webkit-specific timeouts (Job History, Skills apps from terminal)
- Resolve Webkit window persistence failures
- Ensure all E2E tests pass across all browsers (Chromium, Firefox, Webkit, Mobile Chrome, Mobile Safari)

---

## Test Failure Analysis

### Failure Categories

Based on the test run, failures have been grouped into these categories:

| Category | Affected Tests | Browsers | Failure Type |
|----------|---------------|----------|--------------|
| **1. Start Menu Interactions** | "should open folder from Start Menu", "should open Media Player from start menu", "can open Documentaries app from start menu", "can open Livestreams from terminal" | All browsers | Failed |
| **2. Terminal Commands** | "can open terminal from start menu", "can open and close notepad from terminal", "can list running apps", "shows help command output" | All browsers | Failed |
| **3. Window Dragging/Taskbar** | "window cannot be dragged completely off-screen", "window cannot be dragged into the taskbar area", "window is nudged above taskbar on viewport resize" | Chromium, Firefox, Webkit | Failed |
| **4. Video Essays Start Menu** | "should be available in the start menu", "can open Video Essays app from start menu" | All browsers | Failed |
| **5. UI Styling Timeouts** | "Notepad branding and fonts", "Window Help menu styling", "Win95 scrollbar applied to Paint" | All browsers | Timeout |
| **6. Webkit Terminal Timeouts** | "should open Job History from terminal", "should open Skills app from terminal" | Webkit only | Timeout |
| **7. Webkit Window Persistence** | "window positions should reset on page reload" | Webkit only | Failed |

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `e2e/tests/start-menu-folders.spec.ts` | Fix Start Menu folder and app opening logic; adjust wait strategies and selectors |
| `e2e/tests/terminal-app.spec.ts` | Fix terminal command interactions; improve wait conditions for app opening via terminal |
| `e2e/tests/livestreams-app.spec.ts` | Fix terminal opening path for Livestreams app |
| `e2e/tests/documentaries-app.spec.ts` | Fix Start Menu opening path |
| `e2e/tests/music-player-app.spec.ts` | Fix Start Menu opening path |
| `e2e/tests/video-essays-app.spec.ts` | Fix Start Menu availability and opening logic |
| `e2e/tests/test-windows.spec.ts` | Fix window dragging constraint logic |
| `e2e/tests/window-taskbar-collision.spec.ts` | Fix taskbar collision detection and nudging behavior |
| `e2e/tests/window-persistence.spec.ts` | Fix Webkit-specific window position reset logic |
| `e2e/tests/ui-styling.spec.ts` | Reduce timeout to max 5 seconds or fix selectors causing timeouts |
| `playwright.config.ts` | Potentially adjust global timeout settings if needed |

### Potential Source Code Files (if test issues reveal bugs)

| File | Potential Changes |
|------|-------------------|
| `src/components/desktop/StartMenu.tsx` | Fix Start Menu item click handling if tests reveal bugs |
| `src/components/apps/Terminal.tsx` | Fix terminal command execution if tests reveal bugs |
| `src/components/desktop/Win95Window.tsx` | Fix window dragging constraints if tests reveal bugs |
| `src/components/desktop/OSDesktop.tsx` | Fix desktop-level window management if tests reveal bugs |

---

## Architecture Notes

- **Test Structure**: E2E tests use Playwright with multiple browser projects (Chromium, Firefox, Webkit, Mobile Chrome, Mobile Safari)
- **Test Strategy**: Tests verify critical user flows including desktop interactions, Start Menu navigation, Terminal commands, and window management
- **Timeout Configuration**: Current global timeout is 60 seconds; issue requires max 5-second timeout for problematic tests
- **Conditional Test Logic**: Some tests use project-based conditional skipping (e.g., Mobile vs Desktop)
- **Historical Reporting**: Tests use custom reporters (`terminal-reporter.ts`, `history-reporter.ts`) to track failures over time

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

**For this GitHub Issue:**
1. **Create Branch**: `git checkout -b gitissue-77/fix-e2e-tests`
2. **Commit Format**: `git commit -m "gitissue-77: {description}"`
3. **Push & Create PR**: `gh pr create --fill`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Fixing one test category may break others | Run full test suite after each category fix; verify no regressions |
| Browser-specific behavior differences | Test fixes across all browsers; use conditional logic if needed |
| Timeout adjustments may cause flakiness | Balance between speed and reliability; use proper wait strategies (waitFor) instead of arbitrary timeouts |
| Changes to source code may introduce new bugs | Prefer test-only fixes; only modify source if test reveals genuine bug |
| Webkit-specific issues may require special handling | Investigate Webkit rendering/timing differences; add browser-specific waits if necessary |

---

## Test Coverage

> [!NOTE]
> This task focuses on fixing existing E2E tests rather than creating new ones.

### E2E Test Verification (`npm run test:e2e`)

After each fix category, verify:
- [ ] Start Menu tests pass across all browsers
- [ ] Terminal tests pass across all browsers
- [ ] Window dragging tests pass across desktop browsers
- [ ] Video Essays tests pass across all browsers  
- [ ] UI styling tests complete within 5 seconds or less
- [ ] Webkit-specific tests pass
- [ ] No regressions in previously passing tests

### Test Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- start-menu-folders.spec.ts

# Run tests for specific browser
npm run test:e2e -- --project=chromium

# Run full CI flow to verify everything
npm run ci-flow
```

---

## Implementation Checklist

> [!IMPORTANT]
> Follow systematic approach: analyze → fix → verify for each category

### Phase 1: Analysis & Setup
- [ ] Create git branch `gitissue-77/fix-e2e-tests`
- [ ] Analyze test failure patterns and categorize
- [ ] Review test code for each failing category
- [ ] Identify root causes (test issues vs source code bugs)

### Phase 2: Fix Start Menu Tests (Category 1)
- [ ] Debug "should open folder from Start Menu" failures
- [ ] Debug "should open Media Player from start menu" failures
- [ ] Debug "can open Documentaries app from start menu" failures
- [ ] Fix wait strategies and selectors in `start-menu-folders.spec.ts`
- [ ] Fix Start Menu paths in `documentaries-app.spec.ts`, `music-player-app.spec.ts`
- [ ] Verify fixes across all browsers
- [ ] Run `npm run test:e2e -- start-menu` to confirm

### Phase 3: Fix Terminal Tests (Category 2)
- [ ] Debug "can open terminal from start menu" failures
- [ ] Debug terminal command failures ("can list running apps", "shows help command output")
- [ ] Debug "can open and close notepad from terminal" failures
- [ ] Debug "can open Livestreams from terminal" failures
- [ ] Fix terminal interaction logic in `terminal-app.spec.ts`
- [ ] Fix terminal paths in `livestreams-app.spec.ts`
- [ ] Verify fixes across all browsers
- [ ] Run `npm run test:e2e -- terminal` to confirm

### Phase 4: Fix Window Dragging Tests (Category 3)
- [ ] Debug "window cannot be dragged completely off-screen" failures
- [ ] Debug "window cannot be dragged into the taskbar area" failures
- [ ] Debug "window is nudged above taskbar on viewport resize" failures
- [ ] Review window drag constraint logic in source code
- [ ] Fix test expectations or source code as needed
- [ ] Verify fixes across Chromium, Firefox, Webkit
- [ ] Run `npm run test:e2e -- window` to confirm

### Phase 5: Fix Video Essays Tests (Category 4)
- [ ] Debug "should be available in the start menu" failures
- [ ] Debug "can open Video Essays app from start menu" failures
- [ ] Fix Start Menu availability in `video-essays-app.spec.ts`
- [ ] Verify fixes across all browsers
- [ ] Run `npm run test:e2e -- video-essays` to confirm

### Phase 6: Fix UI Styling Timeouts (Category 5)
- [ ] Debug "Notepad branding and fonts" timeout
- [ ] Debug "Window Help menu styling" timeout
- [ ] Debug "Win95 scrollbar applied to Paint" timeout
- [ ] Either fix selectors/wait logic or reduce timeout to max 5 seconds
- [ ] Update `ui-styling.spec.ts` accordingly
- [ ] Verify fixes across all browsers
- [ ] Run `npm run test:e2e -- ui-styling` to confirm

### Phase 7: Fix Webkit-Specific Issues (Categories 6 & 7)
- [ ] Debug "should open Job History from terminal" timeout (Webkit only)
- [ ] Debug "should open Skills app from terminal" timeout (Webkit only)
- [ ] Debug "window positions should reset on page reload" failure (Webkit only)
- [ ] Implement Webkit-specific fixes or increase waits
- [ ] Verify fixes on Webkit browser
- [ ] Run `npm run test:e2e -- --project=webkit` to confirm

### Phase 8: Final Verification
- [ ] Run full E2E test suite: `npm run test:e2e`
- [ ] Verify all tests pass across all browsers
- [ ] Run full CI flow: `npm run ci-flow`
- [ ] Confirm no regressions in previously passing tests
- [ ] Commit all changes with descriptive messages
- [ ] Create and merge PR

---

## Success Criteria

- ✅ All E2E tests pass across all browsers (Chromium, Firefox, Webkit, Mobile Chrome, Mobile Safari)
- ✅ No timeout exceeds 5 seconds for UI styling tests
- ✅ No regressions in previously passing tests
- ✅ `npm run ci-flow` completes successfully
- ✅ All changes committed and PR merged
