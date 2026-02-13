---
name: run-e2e-tests
description: "Automates checking if recent code changes cause E2E test failures by comparing current branch results against a baseline (main branch)."
---

# Skill: Run E2E Tests with Baseline Comparison

## Goal
Ensure that recent code changes in a feature branch do not cause regressions by comparing test results against a "Gold Standard" established on the `main` branch.

## Protocol

### Step 1: Establish Baseline (Gold Standard)
Run the tests on the `main` branch to identify the stable state of the application.

1.  **Checkout Main**: `git checkout main`
2.  **Run Tests**: Execute the E2E tests and generate a CTRF report.
    ```bash
    npx playwright test --reporter=ctrf
    ```
3.  **Store Baseline**: Save the resulting JSON as the gold standard.
    ```bash
    mv ctrf/ctrf-report.json ctrf/baseline-report.json
    ```

### Step 2: Comparison (Current Branch)
Run the tests on the branch containing the new changes and compare the results.

1.  **Checkout Feature Branch**: `git checkout <branch-name>`
2.  **Run Tests**: Execute the E2E tests again.
    ```bash
    npx playwright test --reporter=ctrf
    ```
3.  **Store Current**: Save the new report for comparison.
    ```bash
    mv ctrf/ctrf-report.json ctrf/current-report.json
    ```
4.  **Run Diff**: Use a diffing tool or script to compare `baseline-report.json` and `current-report.json`.
    ```bash
    npx ctrf github-diff ctrf/baseline-report.json ctrf/current-report.json
    ```

### Step 3: Triage and Analysis
Analyze the differences identified in Step 2 to determine if failures are regressions or expected changes.

- **Check for Regressions**: "Test A passed in Baseline but failed in Current."
- **Analyze Error**: Extract the error message and stack trace (e.g., "Timeout waiting for locator").
- **Identify Root Cause**: Correlate the failure with the code changes (e.g., "The new code removed the ID from the button").

## Best Practices
- **Clean Environment**: Ensure the application is built and running in the same state for both runs.
- **Isolated State**: Baseline should be run on a clean `main` branch without local modifications.
- **Detailed Triage**: Provide specific file and line numbers in the root cause analysis.
