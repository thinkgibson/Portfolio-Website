# GitHub Issue #98: Enable Hover for Taskbar Icons

### Features
- **Weather Icon**: 
    - Display weather information pop-up on mouse hover.
    - Toggle pop-up on click (keeps existing behavior).
    - Hide on mouse leave.
- **Network Icon**: 
    - Display network latency pop-up on mouse hover.
    - Toggle pop-up on click (keeps existing behavior).
    - Hide on mouse leave.
- **Volume Icon**: Remain click-based as it contains an interactive slider.

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `components/win95/Taskbar.tsx` | - Add `onMouseEnter` to Weather and Network icons to open tooltip (if not already open).<br>- Add `onMouseLeave` to Weather and Network icons to close tooltip.<br>- Keep `onClick` to toggle tooltip (standardize behavior).<br>- Refactor `fetchWeather`/`measurePing` to support "ensure open" vs "toggle". |
| `__tests__/components/win95/Taskbar.test.tsx` | - Verify `mouseEnter` opens tooltip.<br>- Verify `mouseLeave` closes tooltip.<br>- Verify `click` still toggles tooltip. |

---

## Architecture Notes
- The `activeTooltip` state currently holds the type of the active tooltip ("weather" \| "network" \| "volume").
- Switching to hover means `onMouseEnter` will set the state, and `onMouseLeave` will clear it (set to `null`).
- **Debounce/Delay**: To prevent flickering or accidental triggering, we might consider a small delay, but for now, direct hover is the request. The issue defines "smooth and responsive".
- **Interaction**: The tooltips for weather and network are informational only (text). Volume is interactive (slider), so it must remain click-based (or hover with a delay to close, but click is safer for sliders). The issue specifically singles out Weather and Network.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-98/hover-taskbar-icons`

### Commit Message
- **Subject**: `gitissue-98: Enable hover for weather and network icons`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Flickering** | Ensure `onMouseLeave` is on the button AND the tooltip? No, usually just the button if the tooltip is non-interactive. If the user wants to copy text from the tooltip, they need to be able to hover it. The current tooltips are strictly informational. If copying is needed, hover might be tricky without a delay on close. I will assume informational only for now as per "pop-up on hover". |
| **Accessibility** | Hover-only can be bad for keyboard users. We should ensure `onFocus` also triggers it. I will tackle `onFocus` as well if easy, or rely on `onClick` as a fallback if the browser handles it. But for this task, the primary request is hover. |

---

## Test Coverage

> [!IMPORTANT]
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.

### Unit Tests (`__tests__/components/win95/Taskbar.test.tsx`)
- [ ] `fetches weather and shows tooltip on hover`
- [ ] `hides weather tooltip on mouse leave`
- [ ] `measures ping and shows tooltip on hover`
- [ ] `hides network tooltip on mouse leave`

### E2E Tests
- [ ] Verify hover behavior manually or via E2E if possible (Playwright uses `hover` action).

### Test Commands
```bash
npm run test -- Taskbar
npm run test:e2e
npm run ci-flow
```

---

## Implementation Checklist

### Preparation
- [ ] Create git branch `gitissue-98/hover-taskbar-icons`

### Implementation
- [ ] **Phase 1**: Update `Taskbar.tsx` event handlers.
- [ ] **Phase 2**: Update `Taskbar.test.tsx`.
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- Taskbar`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes
- [ ] Request user approval
- [ ] Create PR & Merge
