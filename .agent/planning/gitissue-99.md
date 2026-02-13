# GitHub Issue #99: Update Start Menu Sidebar: Portfolio OS Text & Background

## Overview
This task involves updating the Start Menu sidebar in `StartMenu.tsx` to display "Portfolio OS" and refining the sidebar background to be a couple shades darker than the main menu gray.

### Features
- Replace vertical text "Windows 95" with "Portfolio OS".
- Aligned text to the top of the sidebar.
- **Color Refinement**: 
    - Sidebar background: Darker gray (#A0A0A0 - `win95-gray-dark`).
    - Sidebar text: Dark gray closer to black (#404040 - `win95-gray-darker`).
- Ensure consistent styling for both desktop and mobile views.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `tailwind.config.js` | Add `gray-dark: "#A0A0A0"` and `gray-darker: "#404040"` to the `win95` color system. |
| `components/win95/StartMenu.tsx` | Update sidebar `div` background to `bg-win95-gray-dark`. Update vertical text color to `text-win95-gray-darker`. |
| `__tests__/components/win95/StartMenu.test.tsx` | (Already updated for text) |

---

## Architecture Notes
- The sidebar is anchored to the top using `flex-col` and `justify-start`.
- Using `writing-mode: vertical-rl` for robust text orientation.

---

## Git Branch & Commit Strategy

### Branch Name
- `fix/gitissue-99-sidebar-color`

### Commit Message
- **Subject**: `fix(gitissue-99): update sidebar background to darker gray`
- **Body**: Changed sidebar background to #A0A0A0 for better contrast. Added `gray-dark` to tailwind config.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Contrast | Ensure text "Portfolio OS" is readable against #A0A0A0. |

---

## Test Coverage

### Unit Tests (`__tests__/components/win95/StartMenu.test.tsx`)
- [x] Check if "Portfolio" is rendered.
- [x] Check if "OS" is rendered.
- [ ] Verify background color class is applied.

### Test Commands
```bash
npm run test -- StartMenu.test.tsx
npx playwright test e2e/tests/start-menu-folders.spec.ts
```

---

## Execution Phases
1. **Phase 1**: Update `tailwind.config.js` with `gray-dark`.
2. **Phase 2**: Update `StartMenu.tsx` with the new color.
3. **Phase 3**: Verification.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch `fix/gitissue-99-sidebar-color`

### Implementation
- [ ] **Phase 1**: Update `tailwind.config.js`
- [ ] **Phase 2**: Update `StartMenu.tsx`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- StartMenu.test.tsx`
- [ ] Run targeted E2E tests: `npx playwright test e2e/tests/start-menu-folders.spec.ts`

### Submission
- [ ] Notify user for approval (DO NOT PR)
