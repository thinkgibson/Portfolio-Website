# Commit and Merge Git Skill Refactor

## Overview
Commit the local uncommitted work related to the Git skill refactor (splitting `git-pr-merge` and improving `retrieve-git-issue`) and merge the entire feature branch `gitissue-100/compact-media-grid` into `main`.

### Features
- Staging and committing modularized Git skills.
- Removing/disabling the legacy `git-pr-merge` skill.
- Creating a Pull Request for the consolidated changes.
- Merging the PR and cleaning up the local feature branch.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `.agent/skills/commit-git/SKILL.md` | New skill for staging and committing. |
| `.agent/skills/create-pr-git/SKILL.md` | New skill for creating PRs. |
| `.agent/skills/merge-git/SKILL.md` | New skill for merging PRs. |
| `planning/git-skill-refactor-commit.md` | This planning document. |
| `planning/improve-retrieve-git-issue-reliability.md` | New planning doc for issue retrieval improvements. |

### Modified Files
| File | Changes |
|------|---------|
| `.agent/skills/retrieve-git-issue/SKILL.md` | Updated to include improved logic. |
| `.agent/skills/create-planning-doc/SKILL.md` | Reference new Git skills. |
| `.agent/workflows/execute-plan.md` | Update workflow steps to use new skills. |
| `.agent/skills/git-pr-merge/SKILL.md` | [DELETE] Legacy skill. |

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-100/compact-media-grid` (Current)

### Commit Message
- **Subject**: `gitissue-100: refactor git skills and standardize media apps`
- **Body**: Consolidated commit of the media app UI overhaul and the Git skill refactor.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Committing build artifacts (`coverage/`, `out/`) | Carefully stage only relevant files or update `.gitignore` if necessary. |
| Merge conflicts with `main` | Rebase or merge `main` before PR creation if needed. |

---

## Test Coverage

### Test Commands
```bash
git status
git log -1 --oneline
gh pr view --web
```

---

## Execution Phases
1. **Phase 1**: Stage and commit local work.
2. **Phase 2**: Push and create PR.
3. **Phase 3**: Merge and cleanup.

---

## Implementation Checklist

### Implementation
- [ ] Stage relevant files (excluding build artifacts)
- [ ] Commit with descriptive message using [commit-git skill](../skills/commit-git/SKILL.md)
- [ ] Create PR using [create-pr-git skill](../skills/create-pr-git/SKILL.md)
- [ ] Merge PR using [merge-git skill](../skills/merge-git/SKILL.md)

### Submission
- [ ] Verify merge on `main`
- [ ] Clean up local branch
