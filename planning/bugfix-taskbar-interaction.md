# Bug Fix: Taskbar Icon Interaction

## Problem
Users reported that clicking the weather and network icons "does not work" (or flickers).
**Root Cause**:
On desktop, `onMouseEnter` opens the tooltip. A subsequent `onClick` toggles it closed (`activeTooltip === 'weather'` -> `set(null)`). This feels broken as the user interaction leads to the info disappearing.

## Solution
Use **Pointer Events** (`onPointerEnter`, `onPointerLeave`) to detect the device type and manage the tooltip state accordingly.
- **Mouse**: 
  - `onPointerEnter` (type='mouse'): Open tooltip.
  - `onPointerLeave` (type='mouse'): Close tooltip.
  - `onClick`: **Ignore** if the tooltip is open via hover. Or just ensure it's open.
- **Touch**:
  - `onPointerEnter`: Ignore (usually).
  - `onClick`: **Toggle** tooltip.

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | - Replace `onMouseEnter`/`onMouseLeave` with `onPointerEnter`/`onPointerLeave`.<br>- Check `e.pointerType` in handlers.<br>- Update `onClick` logic to avoid closing on click if opened by hover. |
| `__tests__/components/win95/Taskbar.test.tsx` | - Update tests to fire `pointerEnter` (type='mouse') and `click` interactions.<br>- Verify correct behavior for both input types. |

---

## Verification Plan

### Automated Tests
- **Unit Tests**:
  - `fireEvent.pointerEnter({ pointerType: 'mouse' })` -> Should Open.
  - `fireEvent.click()` after mouse enter -> Should **NOT** Close (or should stay open).
  - `fireEvent.pointerEnter({ pointerType: 'touch' })` -> Should NOT Open (optional, but good for safety).
  - `fireEvent.click()` (touch simulation) -> Should Toggle.

### Manual Verification
- **Desktop**: Hover to open. Click -> Should stay open. Leave -> Should close.
- **Mobile**: Tap to open. Tap to close.

### Test Commands
```bash
npm run test -- Taskbar
```
