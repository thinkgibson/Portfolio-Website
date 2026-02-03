# Git Issue #75: Implement Historical End-to-End Test Case Result Storage

## Overview
Implement a system to capture and store historical end-to-end test case results. Each test case run should be recorded with its status, the branch it was run on, and the timestamp of the run. This will allow for better tracking of test stability and performance over time.

### Features
- Data collection from Playwright test runs.
- Storage of test-case level results (Success/Failure/Time).
- Association of results with the current Git branch.
- Recording of execution timestamps.
- **Failure-only focus**: Only detailed records for failed test cases are stored to optimize space. Successful runs are recorded only as aggregate counts. **Timeouts and interruptions** are tracked with the same level of detail as failures but labeled with their specific status.
- **3-month retention policy**: Automatically prune or ignore test results older than 90 days.
- Simple terminal command to view historical results (e.g., `npm run test:history`).
- History view should show a table of failing/timed out test cases in **red**, including when they started failing (branch and timestamp).

---

## Expected Code Changes

### Modified Files (Potential)
| File | Changes |
|------|---------|
| `playwright.config.ts` | Add or update reporter configuration to capture and save results. |
| `scripts/store-test-results.ts` [NEW] | New script to process and store results. |
| `data/test-history.json` [NEW] | Initial schema for storing the test results. |

---

## Architecture Notes
- The system should hook into the Playwright reporting flow.
- It should use Git commands (e.g., `git rev-parse --abbrev-ref HEAD`) to determine the current branch.
- Results should be stored in JSON format for now, with a focus on failures.
- Implement a cleanup routine in the storage script that removes entries with timestamps older than 90 days.

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for the complete workflow.

1. **Create Branch**: `git checkout -b gitissue-75/test-result-storage`
2. **Commit Format**: `git commit -m "gitissue-75: implement historical test result storage"`
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Storage overhead | Ensure only necessary information is stored and potentially implement a retention policy. |
| Performance impact on CI | Ensure the storage script runs asynchronously or is very lightweight. |

---

## Test Coverage

### Unit Tests
- [ ] Verify branch name detection logic.
- [ ] Verify JSON/Database storage schema.

### E2E Tests
- [ ] Run a small subset of tests and verify that results are correctly recorded in the history file.

---

## Implementation Checklist
- [ ] Create branch `gitissue-75/test-result-storage`
- [ ] Configure Playwright to output results in a machine-readable format.
- [ ] Implement storage script to parse results, add branch/time metadata, and apply 3-month pruning.
- [ ] Implement a CLI tool or npm script to display historical failing tests in a table.
- [ ] Verify results are correctly stored locally and old results are pruned.
- [ ] Integrate with CI flow if applicable.
