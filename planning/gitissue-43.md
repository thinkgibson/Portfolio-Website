# Git Issue #43: Fix calculator UI

## Overview
Fix the UI of the calculator app to match specific visual requirements: match numpad aspect ratio (square buttons), lock button shapes during resize, increase button label size, and enlarge the display screen.

### Features
- **Square Buttons**: All number buttons will be square.
- **Aspect Ratio Lock**: Buttons maintain shape even if window is resized.
- **Larger Labels**: Button text will fill ~75% of the button.
- **Larger Display**: Top calculation window and result numbers increased by 100%.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Calculator.tsx` | - Update grid layout to enforce aspect ratio.<br>- Increase font sizes for buttons and display.<br>- Increase height of display area. |

---

## Architecture Notes
- Using Tailwind CSS for styling changes.
- `aspect-square` will be used for buttons.
- Font sizes will be adjusted using `text-[size]` or standard classes to achieve the "75% fill" look.
- The `HomeClient.tsx` defines the initial window size, but `Calculator.tsx` handles the internal layout. The internal layout should be responsive to the window content area.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-43/calculator-ui`
2. **Commit Format**: `git commit -m "gitissue-43: fix calculator ui styling"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Small window size in `HomeClient` cuts off content | Verify and potentially update default window size in `HomeClient.tsx` if the new layout requires more space. |
| Button layout breaks on very small screens | The window has a minimum size, but we should ensure `flex-wrap` or grid behavior is robust. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`components/win95/Calculator.test.tsx`)
- [ ] Existing functional tests (Addition, Subtraction, etc.) must pass.
- [ ] No new functional tests needed for pure UI changes, but ensure no regressions.

### Manual Verification
- [ ] Open Calculator app.
- [ ] Resize window and verify buttons remain square.
- [ ] Check button label size (should look large, ~75% fill).
- [ ] Check display screen size (should be double previous height/size).
- [ ] Verify keypad layout looks like a numpad.

### Test Commands
```bash
npm run test -- Calculator
npm run dev
# Manual verification in browser
```

---

## Implementation Checklist
- [ ] Create branch `gitissue-43/calculator-ui`
- [ ] Modify `components/win95/Calculator.tsx`:
    - [ ] Update display height and font size.
    - [ ] Apply `aspect-square` to buttons.
    - [ ] Increase button font size.
    - [ ] Ensure grid adaptation.
- [ ] Check if `HomeClient.tsx` window dimensions need adjustment.
- [ ] Verify `npm run test -- Calculator` passes.
- [ ] Manual UI check.
