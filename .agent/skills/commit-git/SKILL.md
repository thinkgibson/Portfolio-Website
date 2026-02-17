---
name: commit-git
description: "Handles staging and committing changes to a Git repository."
version: 1.0.0
---

## **Skill: Commit Git Changes**

### **Description**
This skill manages the process of staging modified files and committing them to the repository with a clear message.

## Prerequisites Check

1. **Verify Git status**:
   ```bash
   git status
   ```
   Check for uncommitted changes.

2. **Verify current branch**:
   ```bash
   git branch --show-current
   ```
   Ensure you are on the correct feature branch (not `main` or `master`).

## Performing the Workflow

1. **Stage Changes**:
   Stage all modified and new files:
   ```bash
   git add .
   ```

2. **Commit Changes**:
   Commit the staged changes with a descriptive message:
   ```bash
   git commit -m "<Clear, descriptive message describing the changes>"
   ```

3. **Verify Commit**:
   Check the recent log to ensure the commit was successful:
   ```bash
   git log -1 --oneline
   ```

## Error Handling

- **No changes to commit**: If `git status` shows nothing to commit, inform the user and stop.
- **Empty commit message**: Always provide a meaningful message.
- **On wrong branch**: If on `main`, ask the user to create/switch to a feature branch before committing.
