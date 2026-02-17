---
name: run-e2e-tests
description: "Automates checking if recent code changes cause E2E test failures by comparing current branch results against a baseline (main branch)."
---

# Skill: Run E2E Tests with Baseline Comparison

## Goal
Ensure that recent code changes in a feature branch do not cause regressions by comparing test results against a "Gold Standard" established on the `main` branch.

## Prerequisites (Optional but Recommended)

For automated diff reports, install CTRF packages:

```bash
npm install -D playwright-ctrf-json-reporter ctrf
```

Then configure in `playwright.config.ts`:
```typescript
export default defineConfig({
  reporter: [
    ['ctrf', { outputFile: 'ctrf/ctrf-report.json' }],
    ['html'] // Keep existing reporters
  ]
});
```

**Without CTRF**: The skill will use Playwright's native JSON reporter as a fallback. You'll get basic comparison but less detailed diff analysis.

## Protocol

### Step 0: Verify Dependencies (REQUIRED)

**Before running the workflow, check if CTRF is available:**

1. **Check for CTRF installation**:
   ```bash
   npm list playwright-ctrf-json-reporter
   ```

2. **Determine which strategy to use**:
   - ✅ **If CTRF is installed**: Use Strategy A (CTRF-based)
   - ❌ **If CTRF is missing**: Use Strategy B (Playwright JSON fallback)

> [!WARNING]
> Do NOT proceed with CTRF commands if the package is not installed. You will get MODULE_NOT_FOUND errors.

---

## Strategy A: CTRF-Based Comparison (Recommended)

Use this strategy **only if** CTRF is installed.

### Step 1: Establish Baseline (Gold Standard)

1. **Checkout Main**: 
   ```bash
   git checkout main
   ```

2. **Run Tests with CTRF Reporter**:
   ```bash
   npx playwright test --reporter=ctrf
   ```

3. **Store Baseline**: 
   ```bash
   mv ctrf/ctrf-report.json ctrf/baseline-report.json
   ```

### Step 2: Comparison (Current Branch)

1. **Checkout Feature Branch**: 
   ```bash
   git checkout <branch-name>
   ```

2. **Run Tests**: 
   ```bash
   npx playwright test --reporter=ctrf
   ```

3. **Store Current**: 
   ```bash
   mv ctrf/ctrf-report.json ctrf/current-report.json
   ```

4. **Run Diff**: 
   ```bash
   npx ctrf github-diff ctrf/baseline-report.json ctrf/current-report.json
   ```

---

## Strategy B: Playwright JSON Fallback

Use this strategy **when CTRF is not installed**.

### Step 1: Establish Baseline (Gold Standard)

1. **Checkout Main**:
   ```bash
   git checkout main
   ```

2. **Run Tests with JSON Reporter**:
   ```bash
   npx playwright test --reporter=json > baseline-results.json
   ```

### Step 2: Comparison (Current Branch)

1. **Checkout Feature Branch**:
   ```bash
   git checkout <branch-name>
   ```

2. **Run Tests**:
   ```bash
   npx playwright test --reporter=json > current-results.json
   ```

3. **Manual Comparison**:
   - Compare the test counts (total, passed, failed, skipped)
   - Identify tests that changed status between baseline and current
   - Focus on tests that **passed in baseline but failed in current** (regressions)
   - Review test output in `playwright-report/` for details

> [!TIP]
> You can also run targeted tests that are most likely affected by your changes:
> ```bash
> npx playwright test path/to/specific-test.spec.ts
> ```

---

## Step 3: Triage and Analysis

**For both strategies**, analyze the differences to determine if failures are regressions or expected changes:

1. **Identify Regressions**: 
   - Find tests that passed in baseline but failed in current branch
   - Note: New failures in unchanged tests = likely regression
   - Note: Failures in new test files = expected (tests for new features)

2. **Analyze Error Details**:
   - Extract error messages and stack traces
   - Common issues: "Timeout waiting for locator", "Element not found", "Assertion failed"

3. **Correlate with Code Changes**:
   - Review which files changed in the feature branch
   - Identify how changes might have affected failing tests
   - Example: "The new code changed the button ID from 'submit' to 'submit-btn'"

4. **Document Findings**:
   - List all regressions found
   - Provide file names and line numbers for root causes
   - Note which tests verify the new feature functionality

## Best Practices

- **Clean Environment**: Ensure the application is built and running in the same state for both runs
- **Isolated State**: Baseline should be run on a clean `main` branch without local modifications
- **Detailed Triage**: Provide specific file and line numbers in root cause analysis
- **Test the Right Thing**: Run regression tests (from baseline) AND new feature tests separately for clarity

## Troubleshooting

### Error: "Cannot find module 'ctrf'"
**Cause**: CTRF is not installed.  
**Solution**: Switch to Strategy B (Playwright JSON fallback) or install CTRF packages.

### Error: "reporter 'ctrf' not found"
**Cause**: `playwright-ctrf-json-reporter` is not installed or not configured.  
**Solution**: Either install the package or use Strategy B.

### No differences found but tests clearly changed
**Cause**: Reports might not have been generated or moved correctly.  
**Solution**: Verify the report files exist and contain different test results.
