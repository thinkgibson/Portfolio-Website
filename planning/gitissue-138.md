# GitHub Issue #138: Dynamic Boot Sequence from Markdown with Variable Support

## Overview
Modify the boot sequence to read messages from `content/boot.md` and support dynamic variables (`{{browser}}`, `{{viewport}}`, `{{ip}}`, `{{os}}`, `{{date}}`). This allows for easy customization and a more interactive first impression.

### Features
- Boot messages read from `content/boot.md`.
- Dynamic variable support in boot messages.
- Runtime replacement of placeholders with user-specific data.
- Maintenance of existing "click to skip" and timing logic.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `content/boot.md` | Contains the boot sequence messages (one per line). |

### Modified Files
| File | Changes |
|------|---------|
| `lib/types.ts` | Add `bootContent: string[]` to `HomeContent` interface. |
| `lib/markdown.ts` | Add `getBootContent()` function to read and return boot messages as an array of strings. |
| `lib/utils.ts` | Add `replaceBootVariables(message: string, userData: any)` utility. |
| `app/page.tsx` | Fetch boot content and include it in the props passed to `HomeClient`. |
| `components/HomeClient.tsx` | Pass `bootContent` to `OSDesktop`. |
| `components/win95/OSDesktop.tsx` | Pass `bootContent` down to `BootSequence`. |
| `components/win95/BootSequence.tsx` | Use `bootContent` prop instead of hardcoded messages. Implement variable replacement and data detection. |

---

## Architecture Notes
- **Data Flow**: `app/page.tsx` (Server) -> `HomeClient` (Client) -> `OSDesktop` -> `BootSequence`.
- **Variable Detection**: Use `window.navigator`, `window.innerWidth/Height`, and external IP API inside `BootSequence` (useEffect).
- **Replacement Logic**: Use string replacement or regex in a utility function.

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-138/dynamic-boot-sequence`

### Commit Message
- **Subject**: `gitissue-138: implement dynamic boot sequence from markdown`
- **Body**: Added content/boot.md, updated markdown lib, and enhanced BootSequence component with variable support.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| IP API failure | Use a timeout and fallback to "Unknown" or "Detected" if API fails. |
| Large boot.md | Ensure the component handles scrolling or limits lines if necessary (though current design is minimalist). |
| Race conditions in detection | Ensure all variables are detected before/during the sequence. |

---

## Test Coverage

> [!IMPORTANT]
> - Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **MANDATORY**: You MUST perform a baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md) to ensure no regressions were introduced.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

### Unit Tests (`__tests__/components/win95/BootSequence.test.tsx`)
- [ ] Verify `BootSequence` renders messages from props.
- [ ] Verify variable replacement works correctly with mock data.
- [ ] Verify "click to skip" still works.

### E2E Tests (`e2e/tests/boot.spec.ts`)
- [ ] Verify boot sequence displays and completes on page load.
- [ ] Verify clicking skips the sequence.

### Test Commands
```bash
npm run test -- BootSequence
npm run test:e2e -- boot.spec.ts
npm run ci-flow
```

---

## Execution Phases
1. **Phase 1**: Content & Data Layer (Markdown, Types, Server fetching).
2. **Phase 2**: Utility & Logic (Variable replacement, user data detection).
3. **Phase 3**: UI Integration (Updating component to use props and dynamic data).
4. **Phase 4**: Verification & Testing.

---

## Implementation Checklist

### Preparation
- [ ] Move issue to "in progress" using the update-git-issue skill
- [ ] Create git branch using the [create-branch-git skill](../create-branch-git/SKILL.md)

### Implementation
- [ ] **Phase 1**: Content & Data Layer
    - [ ] Create `content/boot.md`.
    - [ ] Update `lib/types.ts`.
    - [ ] Add `getBootContent` to `lib/markdown.ts`.
    - [ ] Update `app/page.tsx` to fetch boot content.
- [ ] **Phase 2**: Utility & Logic
    - [ ] Add `replaceBootVariables` to `lib/utils.ts`.
    - [ ] Implement user info detection in `BootSequence`.
- [ ] **Phase 3**: UI Integration
    - [ ] Update `OSDesktop` to pass `bootContent`.
    - [ ] Update `BootSequence` to use `bootContent` and dynamic variables.
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- BootSequence`
- [ ] Run E2E tests: `npm run test:e2e -- boot.spec.ts`
- [ ] **MANDATORY**: Run E2E baseline comparison using the [run-e2e-tests skill](../run-e2e-tests/SKILL.md)
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes using the [commit-git skill](../commit-git/SKILL.md)
- [ ] Move the issue to "in review" using the update-git-issue skill
- [ ] **MANDATORY**: Request user approval
- [ ] Create PR using the [create-pr-git skill](../create-pr-git/SKILL.md)
- [ ] Merge the PR using the [merge-git skill](../merge-git/SKILL.md)
- [ ] Attach planning doc and walkthrough to the GitHub issue
- [ ] Move the issue to "done" using the update-git-issue skill
