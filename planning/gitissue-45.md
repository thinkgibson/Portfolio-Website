# Git Issue #45: Calculator app window is not locked to aspect ratio

## Overview
The Calculator app window currently allows free resizing, which can break the layout or visual integrity of the calculator interface. This change enforces a fixed aspect ratio and minimum dimensions for the Calculator window (and potentially others) by adding new capabilities to the `Win95Window` component.

### Features
- Support for `lockAspectRatio` prop in `Win95Window`.
- Support for `minWidth` and `minHeight` props in `Win95Window`.
- Support for `canMaximize` prop in `Win95Window` to hide/disable maximize button.
- Configuration of Calculator app to use these new props.
- Enhanced resizing logic in `Win95Window` to respect these constraints.
- Optimized default size for Calculator (230x400) to balance "small" request with usability.
- **[FIX]** Restore standard window padding (remove `fullBleed`) for better containment.
- **[FIX]** Refined Container Query scaling for buttons and display.
- **[FIX]** Strict adherence to grid constraints to prevent button overflow.

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Win95Window.tsx` | Add `lockAspectRatio`, `minWidth`, `minHeight` props. Update `handleResizeStart` logic to enforce them |
| `components/win95/OSDesktop.tsx` | Update `WindowState` interface to include new props. Pass them to `Win95Window` |
| `components/HomeClient.tsx` | Update Calculator configuration to set `lockAspectRatio` and `minWidth/Height` |
| `__tests__/components/win95/Win95Window.test.tsx` | Add tests for aspect ratio locking behavior |

---

## Architecture Notes
- The `Win95Window` component handles the resizing logic internally. It currently has hardcoded min dimensions (200x250).
- We will replace/augment hardcoded values with props.
- Aspect ratio locking will be calculated based on the *initial* aspect ratio of the window when resizing starts, or a provided ratio. Using the initial ratio at resize start is simplest and most flexible.
- `OSDesktop` acts as the state manager for windows, so it needs to be aware of these new properties to pass them through from the static config in `HomeClient`.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Resizing might feel jumpy with aspect ratio lock | Use `Math.max` and smooth logic. Ensure we calculate width based on height or vice-versa depending on drag direction, or just dominant axis. |
| Existing windows rely on defaults | Ensure default props preserve existing behavior (no lock, default min size). |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/components/win95/Win95Window.test.tsx`)
- [ ] Test `minWidth` and `minHeight` props are respected.
- [ ] Test `lockAspectRatio` forces width/height to ratio.

### Manual Verification
- [ ] Open Calculator.
- [ ] Try to resize. Verify it scales proportionally.
- [ ] Try to shrink below minimum size. Verify it stops.
- [ ] Open other windows (Notepad) and verify they still resize freely.

### Test Commands
```bash
npm run test -- Win95Window
```

---

## Implementation Checklist
- [ ] Update `Win95Window.tsx` interfaces and resizing logic
- [ ] Update `OSDesktop.tsx` interfaces
- [ ] Update `HomeClient.tsx` config for Calculator
- [ ] Add unit tests in `Win95Window.test.tsx`
- [ ] Verify manual behavior
- [ ] Ensure all tests pass
