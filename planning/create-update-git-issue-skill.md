# Add update-git-issue skill

## Overview
This task involves creating a new agent skill called `update-git-issue`. This skill will instruct the agent on how to update existing GitHub issues using the `gh` CLI, including adding comments, changing issue status (close/reopen), and modifying labels or the issue body.

### Features
- Support for adding comments to issues.
- Support for closing and reopening issues.
- Support for adding or removing labels.
- Support for updating the issue title and body.
- Documentation on how to "attach" documents by providing markdown links in comments or descriptions.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `.agent/skills/update-git-issue/SKILL.md` | The main skill definition with instructions and examples. |

---

## Architecture Notes
- The skill follows the existing patterns found in `retrieve-git-issue` and `create-git-issue`.
- It relies on the `gh` (GitHub CLI) for all operations.
- Since it's a documentation-only change (adding a skill), there are no components or application logic changes.

---

## Git Branch & Commit Strategy

### Branch Name
- `feature/update-git-issue-skill`

### Commit Message
- **Subject**: `feat: add update-git-issue skill`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Incorrect `gh` command syntax in docs | Verify commands against `gh --help` (already done). |
| Overlapping functionality with other skills | Clearly define its role as *updating* existing issues, distinct from `retrieve-git-issue` and `create-git-issue`. |

---

## Test Coverage

### Manual Verification
- [ ] Verify that the `gh` commands documented in `SKILL.md` work as expected in a real terminal (simulated via research).
- [ ] Review the `SKILL.md` content for clarity and completeness.

---

## Execution Phases
1. **Phase 1**: Initial creation of the skill directory and `SKILL.md`.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch: `feature/update-git-issue-skill`

### Implementation
- [ ] **Phase 1**: Create `.agent/skills/update-git-issue/SKILL.md`
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Final manual review of the skill documentation.

### Submission
- [ ] Commit changes
- [ ] Request user approval
- [ ] Create PR & Merge using the [git-pr-merge skill](../git-pr-merge/SKILL.md)
