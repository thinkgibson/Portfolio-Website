---
name: merge-git
description: "Approves and merges a GitHub Pull Request, then cleans up local branches."
version: 1.0.0
---

## **Skill: Merge GitHub Pull Request**

### **Description**
This skill handles the final stages of a PR: approving (if needed), merging, synchronizing the local `main` branch, and cleaning up the feature branch.

## Prerequisites Check

1. **Verify `gh` CLI**:
   ```bash
   gh --version
   ```

2. **Verify PR existence and state**:
   ```bash
   gh pr view --json state,url
   ```
   *Ensure the PR is open before proceeding.*

## Performing the Workflow

1. **Approve PR**:
   Execute approval.
   ```bash
   gh pr review --approve
   ```
   *Note: If the CLI returns an error stating you cannot approve your own PR, ignore it and proceed to the next step.*

2. **Merge the PR**:
   Perform a standard merge and delete the remote branch:
   ```bash
   gh pr merge --merge --delete-branch
   ```
   *If the merge fails (e.g., checks pending), ask the user if they want to use `--auto` or wait.*

3. **Switch to Main**:
   ```bash
   git checkout main
   ```

4. **Sync Local Main**:
   ```bash
   git pull origin main
   ```

5. **Local Cleanup**:
   Delete the local feature branch:
   ```bash
   git branch -d <branch_name>
   ```

## Final Confirmation
Output a confirmation message:
> "Workflow complete. The PR has been merged, and your local 'main' branch is now synchronized."

## Error Handling

- **PR not found**: Ensure you are on the correct branch or provide a PR number.
- **Merge conflicts**: These must be resolved before merging.
- **CI failures**: If checks fail, do not merge unless explicitly instructed.
