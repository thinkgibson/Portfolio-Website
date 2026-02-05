# GitHub Issue #63: Replace My Portfolio app with a folder

## Overview
The goal is to refactor the "My Portfolio" application, which currently behaves like a custom file explorer ("C:" drive), into a standard Windows 95-style folder. This folder will contain specific apps: "Documentaries", "Video Essays", and "Livestreams". The "Accessories" folder will be used as a template for this structural change. The "Multimedia" folder will retain "Media Player" but have the other apps moved out.

### Features
- Convert "My Portfolio" from a custom app to a standard directory folder.
- Move "Documentaries", "Video Essays", and "Livestreams" apps from "Multimedia" to "My Portfolio".
- Ensure "My Portfolio" folder inherits standard folder properties (icons, window behavior).
- "Multimedia" folder remains with "Media Player".

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `config/apps.config.tsx` | Redefine `portfolio` from an app with `content` to a folder with `children`. Move app definitions (`documentaries`, `video-essays`, `livestreams`) from `multimedia` to `portfolio`. |

---

## Architecture Notes
- **Component Hierarchy**: `OSDesktop` -> `Win95Window`. The `content` prop of `Win95Window` will now be `undefined` for "My Portfolio", and it will instead render children icons similar to how `Accessories` works.
- **State Management**: No changes to state management (Zustand store for window management handles folders natively).
- **Integration**: The `getAppsConfig` function is the single source of truth for app definitions. Changing the structure here automatically updates the Desktop icons and Start Menu entries.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-63/replace-portfolio-app-with-folder`

### Commit Message
- **Subject**: `gitissue-63: replace My Portfolio app with folder and move media apps`

---

## Possible Risks & Conflicts
| Risk | Mitigation |
|------|------------|
| **Linkage Breakage**: If any hardcoded links or tests rely on the `portfolio` app having specific inner content (the old file explorer), they will break. | Search for `portfolio` ID usage in tests and update them. The search for "My Portfolio" strings in tests yielded no direct content dependencies, but E2E tests for opening apps need verification. |
| **Icon mismatch**: The new folder might need a specific icon. | Will use `folder` icon type as requested ("Use the Accessories folder as a template"). |

---

## Test Coverage

> [!NOTE]
> Follows the [design-tests skill](../.agent/skills/design-tests/SKILL.md).

### Unit Tests
- `apps.config.tsx` is configuration code, so we rely on invalid config breaking the build type-checking.
- Check `__tests__/config/apps.config.test.tsx` (if exists) or create a simple check if needed. (Current search didn't show specific config tests, but we will verify `npm run test` passes).

### E2E Tests (`e2e/tests/desktop.spec.ts` or similar)
- [ ] **Verify Folder Opens**: Test that clicking "My Portfolio" opens a window with expected title/icon.
- [ ] **Verify Children Exist**: Test that "Documentaries", "Video Essays", "Livestreams" icons are present inside "My Portfolio".
- [ ] **Verify Apps Open**: Test that clicking one of the moved apps (e.g., "Documentaries") inside the new folder opens the app correctly.
- [ ] **Verify Multimedia**: Test that "Multimedia" folder still exists and contains "Media Player".

### Test Commands
```bash
npm run test
npm run test:e2e
npm run ci-flow
```

---

## Execution Phases

1. **Phase 1**: Configuration Changes
   - Modify `apps.config.tsx` to refactor the `portfolio` object and move the child apps.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch `gitissue-63/replace-portfolio-app-with-folder`

### Implementation
- [ ] **Phase 1**: Modify `config/apps.config.tsx`
- [ ] Verify implementation: "My Portfolio" is a folder, apps are moved.

### Verification
- [ ] Run unit tests: `npm run test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (`gitissue-63: replace My Portfolio app with folder...`)
- [ ] Request user approval
- [ ] Create PR & Merge
