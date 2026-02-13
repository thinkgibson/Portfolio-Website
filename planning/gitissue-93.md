# GitHub Issue #93: Improve desktop icon spacing and text wrapping

## Overview
The goal is to improve the visual fidelity of the desktop icons to match Windows 95/98 aesthetics. The current implementation has icons too close together and truncates text labels. We need to increase spacing and enable full text wrapping.

### Features
- Increase grid gap between desktop icons.
- Remove line truncation (line-clamp) from icon labels.
- Ensure text wraps properly for long labels.
- maintain "Win95" look and feel (narrower effective width for text flow).

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/OSDesktop.tsx` | Increase grid gap (e.g., `gap-4` to `gap-8` or similar). |
| `components/win95/DesktopIcon.tsx` | Remove `line-clamp-2`. Adjust width/padding if necessary to support wrapping. |

---

## Architecture Notes
- **Styling**: Changes are primarily CSS/Tailwind utility classes.
- **Layout**: `OSDesktop` uses a CSS Grid `grid-flow-col` with fixed row height to simulate the vertical-first icon filling of Windows. Modifications to gap will affect how many icons fit before wrapping to the next column.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-93/improve-icon-spacing`

### Commit Message
- **Subject**: `gitissue-93: Improve desktop icon spacing and label wrapping`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Layout Overflow** | Increasing gap might push icons off-screen earlier. | `OSDesktop` overflow handling (scroll or hidden) should be checked. Win95 desktop doesn't usually scroll, icons just hide or wrap. Current implementation `h-[calc(100vh-96px)]` constrains height. |
| **Text Overlap** | Long text without background might be hard to read or overlap if gaps aren't big enough. | Ensure z-index or background treatment (Win95 icons have transparent background but turn blue on selection). We are just increasing gap which helps avoid overlap. |

---

## Test Coverage

> [!NOTE]
> Follow the [design-tests skill](../.agent/skills/design-tests/SKILL.md) for testing best practices.

### Manual Verification
- [ ] **Visual Inspection**:
    - Verify icons are spaced further apart.
    - Verify long labels wrap to multiple lines and are not truncated.
    - Check hover/selection states.

### E2E Tests (`e2e/tests/ui-styling.spec.ts`)
- [ ] Verify no regressions in basic rendering.
- [ ] (Optional) Add specific test for label full text visibility if possible (checking `scrollHeight` > `clientHeight` or similar if line-clamp was active).

### Test Commands
```bash
npm run test:e2e
```

---

## Execution Phases

1. **Phase 1**: CSS Updates. Modify `OSDesktop.tsx` and `DesktopIcon.tsx`.
2. **Phase 2**: Verification. Run app and check visually.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch `gitissue-93/improve-icon-spacing`

### Implementation
- [ ] **Phase 1**: Modify `components/win95/OSDesktop.tsx` (increase gap)
- [ ] **Phase 1**: Modify `components/win95/DesktopIcon.tsx` (remove line-clamp)
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Manual visual verification of desktop.
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes: `gitissue-93: Improve desktop icon spacing and label wrapping`
- [ ] Create PR & Merge
