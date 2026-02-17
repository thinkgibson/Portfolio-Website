---
name: create-branch-git
description: "Creates a new local feature branch based on the main branch."
version: 1.0.0
---

## **Skill: Create Git Branch**

### **Description**
This skill manages the process of ensuring the local `main` branch is up-to-date and then creating a new feature branch for development.

## Prerequisites Check

1. **Verify Git status**:
   ```bash
   git status
   ```
   Ensure you have a clean working directory. If you have uncommitted changes, stash them or commit them before branching.

## Performing the Workflow

1. **Switch to main**:
   ```bash
   git checkout main
   ```

2. **Update main**:
   ```bash
   git pull origin main
   ```

3. **Create and switch to new branch**:
   Use a descriptive name based on the task (e.g., `feature/login-fix` or `gitissue-42/add-styles`).
   ```bash
   git checkout -b <branch-name>
   ```

4. **Verify current branch**:
   ```bash
   git branch --show-current
   ```

## Naming Conventions
- **Features**: `feature/<short-description>`
- **Bug Fixes**: `fix/<short-description>`
- **GitHub Issues**: `gitissue-<ID>/<short-description>`

## Error Handling
- **Uncommitted changes**: If `git checkout` fails due to local changes, use `git stash` to save them or `git commit` to finalize them on your current branch.
- **Branch already exists**: If the branch name is taken, choose a unique name or switch to the existing one if it's the intended working branch.
