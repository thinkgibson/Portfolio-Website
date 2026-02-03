# Git Issue #62: Fix drag issue with Livestreams app

## Overview
Dragging windows that contain iframes (Livestreams, VideoEssays, Documentaries) causes erratic behavior because the iframe consumes pointer events during the drag operation. This change implements a global fix in the `Win95Window` component to block pointer events to the window content while dragging.

### Features
- Reliable window dragging for apps containing iframes.
- Prevents mouse events from being "stolen" by iframes during drag.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `e2e/tests/iframe-drag.spec.ts` | New E2E test to specifically verify window dragging over iframes. |

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Win95Window.tsx` | Add `isDragging` state and an overlay div that renders when dragging is active to block pointer events. |

---

## Architecture Notes
- **State Management**: Local `isDragging` state in `Win95Window`.
- **Component Hierarchy**: The overlay will be a direct child of the `Win95Window` container, positioned absolutely to cover the entire content area, ensuring it sits above the iframes.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-62/fix-iframe-drag`
2. **Commit Format**: `git commit -m "gitissue-62: fix iframe dragging issues"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Manual Verification
- [ ] Open Livestreams app.
- [ ] Drag the window around rapidly.
- [ ] Verify the mouse cursor never gets "stolen" by the iframe (pointer events should not trigger on the iframe).
- [ ] Repeat for Video Essays and Documentaries apps.

### E2E Tests (`e2e/tests/iframe-drag.spec.ts`)
- [ ] **Test Case 1**: Open "Livestreams" app.
- [ ] **Test Case 2**: Perform a drag operation that moves the cursor *over* the iframe content.
- [ ] **Verification**: Ensure the window reaches the target destination coordinates.
- [ ] **Verification**: Ensure the drag operation completes successfully without being interrupted.

### Test Commands
```bash
npm run test:e2e -- iframe-drag.spec.ts
```

---

## Implementation Checklist
- [ ] Create `e2e/tests/iframe-drag.spec.ts` with a failing test case (reproducing the issue if possible, or just setting up the guard rail).
- [ ] Modify `components/win95/Win95Window.tsx` to handle `isDragging` state and overlay.
- [ ] Verify fix manually on Livestreams app.
- [ ] Verify fix with the new E2E test.
- [ ] Run full CI flow to ensure no regressions.
