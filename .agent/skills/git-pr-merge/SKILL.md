---
name: git-pr-merge
description: "Automates the end-to-end Git workflow from committing to feature branch to merging via the GitHub CLI."
version: 1.0.0
---

## **Skill: Feature Branch to Pull Request Workflow**

### **Description**
Automates the end-to-end Git workflow from feature branch creation to merging via the GitHub CLI.

## Prerequisites Check

Before proceeding, verify the following:

### 1. Check if `gh` CLI is installed

```bash
gh --version
```

If not installed, inform the user:
> The GitHub CLI (`gh`) is required but not installed. Please install it:
> - macOS: `brew install gh`
> - Other: https://cli.github.com/

### 2. Check if authenticated with GitHub

```bash
gh auth status
```

If not authenticated, guide the user to run `gh auth login`.

### 3. Verify clean working directory

```bash
git status
```

If there are uncommitted changes, ask the user whether to:
- Commit them as part of this PR
- Stash them temporarily
- Discard them (with caution)

## Gather Context

### 1. Identify the current branch

```bash
git branch --show-current
```

Ensure you're not on `main` or `master`. If so, ask the user to create or switch to a feature branch.

### 2. Find the base branch

```bash
git remote show origin | grep "HEAD branch"
```

This is typically `main` or `master`.

### 3. Analyze recent commits relevant to this PR

```bash
git log origin/main..HEAD --oneline --no-decorate
```

Review these commits to understand:
- What changes are being introduced
- The scope of the PR (single feature/fix or multiple changes)
- Whether commits should be squashed or reorganized

### 4. Review the diff

```bash
git diff origin/main..HEAD --stat
```

This shows which files changed and helps identify the type of change.

## Information Gathering

Before creating the PR, you need the following information. Check if it can be inferred from:
- Commit messages
- Branch name (e.g., `fix/issue-123`, `feature/new-login`)
- Changed files and their content

If any critical information is missing, use `ask_followup_question` to ask the user:

### Required Information

1. **Related Issue Number**: Look for patterns like `#123`, `fixes #123`, or `closes #123` in commit messages
2. **Description**: What problem does this solve? Why were these changes made?
3. **Type of Change**: Bug fix, new feature, breaking change, refactor, cosmetic, documentation, or workflow
4. **Test Procedure**: How was this tested? What could break?

### Example clarifying question

If the issue number is not found:
> I couldn't find a related issue number in the commit messages or branch name. What GitHub issue does this PR address? (Enter the issue number, e.g., "123" or "N/A" for small fixes)






## Performing the Workflow

### **Phase 1: Commit & Create PR**
1. **Check Branch:** Ensure you are NOT on `main`.
   `git branch --show-current`
   *If on `main`, stop and ask the user to switch to a feature branch.*

2. **Commit Changes:** If there are uncommitted changes, prompt the user for a message:
   `git add . && git commit -m "<user_message>"`

3. **Push & Create PR:** 
   `gh pr create --fill --push`
   *If the command fails because a PR already exists, use `gh pr view --web` to display it, then proceed to Phase 2.*
4. **Handoff for Review:** Output the PR URL and state:
   > "I have created the Pull Request here: [URL]. Would you like me to **approve** it (if applicable) and **merge** it now?"

### **Phase 2: Approval & Merge Execution**
If the user says "Yes" or "Approved":

1. **Attempt Approval:** Execute `gh pr review --approve`. 
   *Note: If the CLI returns an error stating the user cannot approve their own PR, the agent should ignore the error and proceed to the merge.*

2. **Merge the PR:** Perform a standard merge and delete the remote branch:
   `gh pr merge --merge --delete-branch`
   *If the merge fails (e.g., checks pending), ask the user if they want to use `--auto` to merge when checks pass, or wait.*

3. **Switch to Main:** `git checkout main`

4. **Sync Local Main:** `git pull origin main`

5. **Local Cleanup:** Delete the local feature branch:
   `git branch -d <branch_name>`

### **Final Confirmation**
> "Workflow complete. The PR has been merged, and your local 'main' branch is now synchronized."

## Error Handling

### Common Issues

1. **No commits ahead of main**: The branch has no changes to submit
   - Ask if the user meant to work on a different branch

2. **Branch not pushed**: Remote doesn't have the branch
   - Push the branch first: `git push -u origin HEAD`

3. **PR already exists**: A PR for this branch already exists
   - Show the existing PR: `gh pr view`
   - Ask if they want to update it instead

4. **Merge conflicts**: Branch conflicts with base
   - Guide user through resolving conflicts or rebasing