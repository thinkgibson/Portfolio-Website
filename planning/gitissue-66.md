# Git Issue #66: Review Skipped Test Cases

## Overview
Review currently skipped unit and E2E tests, enable them as appropriate, and fix any underlying issues preventing them from passing. The goal is to maximize test coverage.

### Features
- Enable and fix `Win95Window.test.tsx` resize test.
- Enable and fix `ui-styling.spec.ts` Paint scrollbar test.
- Review other skips to ensure they are valid (e.g. mobile constraints).

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `__tests__/components/win95/Win95Window.test.tsx` | Remove `.skip` from resize test. Fix resize logic mocking (likely `pointer` event handling or `getBoundingClientRect` mocks). |
| `e2e/tests/ui-styling.spec.ts` | Remove `.skip` from Paint scrollbar test. Fix selectors or timing if flaky. |

---

## Architecture Notes
- **Unit Test Fixes**: `Win95Window` resize relies on `onPointerDown`, `onPointerMove`, `onPointerUp`. JSDOM might need explicit dispatching or correct event properties (`clientX`/`clientY`).
- **E2E Test Fixes**: Paint scrollbar test might be failing due to race conditions (Paint app loading time) or the scrollbar not being visible if the content isn't large enough.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-66/fix-skipped-tests`
2. **Commit Format**: `git commit -m "gitissue-66: Fix skipped tests in Win95Window and UI styling"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Flaky E2E tests | Use `test.step` and better `waitFor` logic for Paint loading. |
| JSDOM limitations | If pointer events are tricky in JSDOM, ensure using `fireEvent` with correct bubbling/properties. |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/designing-tests/SKILL.md) for testing best practices.

### Unit Tests
- [ ] `Win95Window.test.tsx`: "calls onResize when resize handle is dragged" should pass.

### E2E Tests
- [ ] `ui-styling.spec.ts`: "Win95 scrollbar applied to Paint" should pass.

### Test Commands
```bash
npm run test -- Win95Window
npm run test:e2e -- ui-styling.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Un-skip and fix `Win95Window.test.tsx`
- [ ] Un-skip and fix `ui-styling.spec.ts`
- [ ] Verify no regressions with `npm run ci-flow`
