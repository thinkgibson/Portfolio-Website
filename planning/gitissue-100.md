# GitHub Issue #100: [Feature]: Compact Grid Layout for Media Apps

## Overview
The goal is to update the `Documentaries`, `VideoEssays`, and `Livestreams` applications to use a compact grid layout instead of the current vertical list. This will allow users to see more content on the screen at once, improving usability and aesthetics. We will introduce a shared `VideoGrid` component to unify the layout and reducing code duplication.

### Features
-   **Grid Layout**: Display videos in a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop).
-   **Compact Cards**: Redesign the video card to be more space-efficient while maintaining the Windows 95 aesthetic.
-   **Shared Component**: Extract common video rendering logic into a reusable `VideoGrid` component.

---

---
 
 ## Refinement: Window Top Bar Consistency (User Request)
 **Goal**: Increase vertical size and padding of the titlebar and menu bar. Ensure media apps match 'Welcome' and folder windows.
 
 ### Proposed Changes
 1.  **`components/win95/Win95Window.tsx`**:
     -   Increase Titlebar height to `h-14` (56px) for desktop.
     -   Reduce icon size to `32` (from 36) to increase whitespace.
     -   Keep buttons at `w-9 h-9` (36px) to maximize padding within the `h-14` bar (10px top/bottom).
     -   Remove `mt-1` and `leading-none` from title text; use `leading-normal` for better centering.
     -   Increase Menu Bar padding to `py-2` (8px).
 
 2.  **App Framework Consistency**:
     -   Ensure media apps (`Documentaries`, etc.) have a 4px margin (`m-1`) between the Menu Bar and their internal bezel.
 
 ### Verification
 -   [ ] Compare 'Welcome' vs 'Documentaries' titlebars visually.
 -   [ ] Verify icon/text centering in the titlebar.
 -   [ ] Verify Menu Bar padding feels "premium".
 
 ---

## Expected Code Changes


### New Files
| File | Purpose |
|------|---------|
| `components/win95/VideoGrid.tsx` | A reusable component that renders a grid of video cards. |
| `__tests__/components/win95/VideoGrid.test.tsx` | Unit tests for the new `VideoGrid` component. |

### Modified Files
| File | Changes |
|------|---------|
| `components/win95/Documentaries.tsx` | Replace list rendering with `VideoGrid`. |
| `components/win95/VideoEssays.tsx` | Replace list rendering with `VideoGrid`. |
| `components/win95/Livestreams.tsx` | Replace list rendering with `VideoGrid`. |

---

## Architecture Notes
-   **Component Hierarchy**: `Documentaries` -> `VideoGrid` -> `VideoCard` (internal to Grid or separate).
-   **State Management**: `VideoGrid` will handle the internal state for the YouTube iframes (refs, volume control) just like the current components do. The `useOS` hook usage for volume will be moved into `VideoGrid`.
-   **Integration**: The `VideoGrid` will be a direct replacement for the `.map` loops in the existing components.

---

## Git Branch & Commit Strategy

### Branch Name
-   `gitissue-100/compact-media-grid`

### Commit Message
-   **Subject**: `gitissue-100: implement compact grid layout for media apps`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| **Iframe State**: Moving iframes to a child component might affect the `useRef` array management for volume control. | Ensure the `VideoGrid` component correctly manages the `iframeRefs` array and exposes/uses it for the volume context. |
| **Responsive Design**: Grid might look cramped on smaller screens. | Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to adjust column count and padding. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/VideoGrid.test.tsx`)
- [ ] Renders the correct number of video cards.
- [ ] Passes volume changes to iframes.
- [ ] Displays video title and role correctly.

### Updates to Existing Unit Tests
-   `__tests__/components/win95/Documentaries.test.tsx`: Verify it still renders content via `VideoGrid`.
-   `__tests__/components/win95/VideoEssays.test.tsx`: Verify it still renders content via `VideoGrid`.
-   `__tests__/components/win95/Livestreams.test.tsx`: Verify it still renders content via `VideoGrid`.

### E2E Tests (`e2e/tests/media-apps.spec.ts`)
- [ ] Verify grid layout presence (check CSS classes or computed style).
- [ ] Verify video playback in the new layout.

### Test Commands
```bash
npm run test -- VideoGrid
npm run test -- Documentaries
npm run test -- VideoEssays
npm run test -- Livestreams
npm run test:e2e -- media-apps.spec.ts
npm run ci-flow
```

---

## Execution Phases
1.  **Phase 1**: Implementation of `VideoGrid` component and unit tests.
2.  **Phase 2**: Refactoring `Documentaries`, `VideoEssays`, and `Livestreams` to use `VideoGrid` and verify with unit tests.
3.  **Phase 3**: Verification and E2E testing.

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch `gitissue-100/compact-media-grid`

### Implementation
- [ ] **Phase 1**: Create `components/win95/VideoGrid.tsx` with responsive grid layout.
- [ ] **Phase 1**: Create `__tests__/components/win95/VideoGrid.test.tsx` and verify.
- [ ] **Phase 2**: Refactor `Documentaries.tsx` to use `VideoGrid`.
- [ ] **Phase 2**: Refactor `VideoEssays.tsx` to use `VideoGrid`.
- [ ] **Phase 2**: Refactor `Livestreams.tsx` to use `VideoGrid`.
- [ ] **Phase 2**: Fix `OSDesktop.tsx` window initialization to support default dimensions.
- [ ] Verify implementation against "Expected Code Changes".

### Verification
- [ ] Run unit tests: `npm run test -- VideoGrid Documentaries VideoEssays Livestreams`
- [ ] Run E2E tests: `npm run test:e2e -- media-apps.spec.ts` (Create if needed or use existing logic)
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `gitissue-100: description`) using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] Request user approval
- [ ] Create PR & Merge using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue using the update-git-issue skill
- [ ] Move the issue to "done" using the update-git-issue skill
