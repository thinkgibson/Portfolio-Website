# GitHub Issue #99: Update Start Menu Sidebar: Portfolio OS Text & Background

## Overview
This task involves updating the Start Menu sidebar in `StartMenu.tsx` to display "Portfolio OS" instead of "Windows 95" and changing the sidebar background to light gray.

### Features
- Replace vertical text "Windows 95" with "Portfolio OS".
- Change sidebar background color to light gray (`win95-gray`).
- Ensure consistent styling for both desktop and mobile views.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/StartMenu.tsx` | Change sidebar `div` background to `bg-win95-gray`. Change vertical text to "Portfolio OS" with appropriate opacity for "Portfolio". |
| `__tests__/components/win95/StartMenu.test.tsx` | Update test assertions to check for "Portfolio" and "OS" instead of "Windows" and "95". |

---

## Architecture Notes
- The sidebar is a flex-shrink-0 `div` inside the `StartMenu` component.
- The text is rotated -90 degrees using Tailwind's `-rotate-90`.
- Responsive design is handled via `isMobile` prop/hook, which adjusts widths and font sizes.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-99/update-start-menu-sidebar`

### Commit Message
- **Subject**: `gitissue-99: update start menu sidebar text and background`
- **Body**: Replaced "Windows 95" with "Portfolio OS" and changed sidebar background to light gray. Updated unit tests.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Text Overflow | Ensure "Portfolio OS" fits in the rotated sidebar `div` (it is slightly longer than "Windows 95"). |
| Contrast Issues | Light gray background might reduce contrast for the gray text. Ensure visibility. |

---

## Test Coverage

### Unit Tests (`__tests__/components/win95/StartMenu.test.tsx`)
- [ ] Check if "Portfolio" is rendered.
- [ ] Check if "OS" is rendered.
- [ ] Verify background color applied to sidebar (via snapshot or style check).

### Test Commands
```bash
npm run test -- StartMenu.test.tsx
npm run test:e2e
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Update `StartMenu.tsx` implementation.
2. **Phase 2**: Update unit tests and verify.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch `gitissue-99/update-start-menu-sidebar`

### Implementation
- [ ] **Phase 1**: Update `StartMenu.tsx`
    - Change `bg-win95-gray-dark` to `bg-win95-gray`.
    - Change text "Windows 95" to "Portfolio OS".
- [ ] **Phase 2**: Update `__tests__/components/win95/StartMenu.test.tsx`
    - Update "Windows" check to "Portfolio".
    - Update "95" check to "OS".
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- StartMenu.test.tsx`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (`gitissue-99: update start menu sidebar text and background`)
- [ ] Request user approval
- [ ] Create PR & Merge
