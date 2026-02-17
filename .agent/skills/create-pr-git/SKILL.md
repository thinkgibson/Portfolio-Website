---
name: create-pr-git
description: "Pushes the local feature branch to the remote and creates a GitHub Pull Request."
version: 1.0.0
---

## **Skill: Create GitHub Pull Request**

### **Description**
This skill automates the process of pushing your feature branch to GitHub and opening a Pull Request using the `gh` CLI.

## Prerequisites Check

1. **Verify `gh` CLI**:
   ```bash
   gh --version
   ```

2. **Verify authentication**:
   ```bash
   gh auth status
   ```

3. **Verify branch**:
   ```bash
   git branch --show-current
   ```
   Ensure you are NOT on `main` or `master`.

## Performing the Workflow

1. **Verify Commits**:
   Ensure the branch has commits ahead of the base branch:
   ```bash
   git log origin/main..HEAD --oneline
   ```
   *If there is no output, the PR creation will fail because there are no changes.*

2. **Push & Create PR**: 
   Run the following command to push the branch and create a PR using the first commit message as the title and body (or opening an editor if `--fill` is omitted):
   ```bash
   gh pr create --fill --push
   ```
   *If a PR already exists, the command will fail. You can view it with `gh pr view --web`.*

3. **Handoff for Review**: 
   Output the PR URL to the user:
   > "I have created the Pull Request here: [URL]. Would you like me to proceed with merging?"

## Error Handling

- **No commits ahead of main**: Inform the user that there are no changes to submit.
- **Merge conflicts**: If GitHub detects conflicts, you may need to rebase or merge `main` into your branch.
- **PR already exists**: Provide the URL to the existing PR instead of creating a new one.
