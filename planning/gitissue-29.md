# Git Issue #29: Speed up Playwright E2E Tests

## Overview

Optimize the Playwright E2E test suite to run all tests in under 60 seconds. The current configuration uses conservative settings (1 worker, 5 browser projects, dev server) that significantly slow down test execution.

### Features
- Increase parallelization with multiple workers
- Keep all 5 browser projects for full iOS/macOS/Safari coverage
- Reduce retries from 2 to 1 for faster feedback
- Maintain 60s timeout for stability

---

## Current State Analysis

| Setting | Current Value | Issue |
|---------|---------------|-------|
| Workers | 1 | Tests run sequentially |
| Browser Projects | 5 (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari) | Each test runs 5x |
| Web Server | `next dev -p 3001` | Dev mode is slower than production |
| Timeout | 60s global | May be excessive |
| Retries | 2 (always) | Slows down on flaky tests |
| Test Files | 20 spec files | Tests run across all browsers |

**Estimated Current Runtime**: 20 tests × 5 browsers × ~10s avg = ~16+ minutes (sequential)

---

## Expected Code Changes

### Modified Files

| File | Changes |
|------|---------|
| `playwright.config.ts` | Increase workers, reduce browser projects, optimize webServer |

---

## Architecture Notes

### Optimization Strategy

1. **Increase Workers**: Use `workers: undefined` (auto-detect CPU cores) for maximum parallel execution
2. **Keep All Browser Projects**: Maintain all 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari) for full cross-platform coverage including iOS/macOS
3. **Reduce Retries to 1**: Faster feedback for failing tests
4. **Keep Timeout at 60s**: Maintain stability for slower tests

### Expected Impact

With parallelization across multiple workers:
- **Before**: 20 tests × 5 browsers × ~10s avg = sequential execution (very slow)
- **After**: Tests run in parallel across CPU cores, significantly reducing total runtime

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-29/speedup-e2e-tests`
2. **Commit Format**: `git commit -m "gitissue-29: optimize playwright config for faster e2e tests"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Parallel tests may have race conditions | Use `fullyParallel: true` properly; ensure tests are isolated |
| Workers may cause resource contention | Use auto-detect (`undefined`) to match CPU cores |
| Reduced timeout may cause flaky failures | Monitor test stability; adjust if needed |

---

## Test Coverage

### Verification Plan

The changes are to the test configuration itself, so verification involves:

1. **Run optimized E2E tests**: 
   ```bash
   npm run test:e2e
   ```
   - **Expected**: All tests pass
   - **Expected**: Total runtime under 60 seconds

2. **Run full CI flow**:
   ```bash
   npm run ci-flow
   ```
   - **Expected**: All tests (unit + E2E) pass
   - **Expected**: No regressions

3. **Compare timing before/after**:
   - Document baseline timing before changes
   - Document improved timing after changes

---

## Implementation Checklist

- [ ] Create feature branch `gitissue-29/speedup-e2e-tests`
- [ ] Update `playwright.config.ts`:
  - [x] Change `workers: 1` to `workers: undefined` (auto-detect)
  - [x] Reduce `retries` from 2 to 1
  - [x] Keep `timeout` at 60s for stability
  - [ ] Keep all 5 browser projects
- [ ] Run `npm run test:e2e` and verify all tests pass
- [ ] Measure and document timing improvement
- [ ] Run `npm run ci-flow` to verify no regressions
- [ ] Commit and create PR
