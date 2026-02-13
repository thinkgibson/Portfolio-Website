# Update Strict Planning Documentation Rule

## Overview
This plan outlines the updates to the `strict-planning-doc.md` rule to refine when planning documents are required and how to handle existing branch-specific planning docs.

### Features
- Refine rule to only require planning docs for code changes (not for general queries or meta-tasks).
- Add requirement to check for branch-specific planning docs before creating new ones.
- Call out that modifying markdown files (skills, rules, workflows) does not require a planning doc.

---

## Expected Code Changes

### Modified Files
| File | Changes |
|------|---------|
| `.agent/rules/strict-planning-doc.md` | Update requirements for creating planning docs and add branch-specific checks. |

---

## Architecture Notes
- N/A (Rule update only)

---

## Git Branch & Commit Strategy

### Branch Name
- `feature/update-planning-rule`

### Commit Message
- **Subject**: `docs: update strict planning rule`
- **Body**: Refine planning doc requirements and add branch-specific checks.

---

## Possible Risks & Conflicts
- N/A

---

## Test Coverage
- N/A (Manual verification of the rule text)

---

## Execution Phases
1. **Phase 1**: Update the rule file.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch

### Implementation
- [ ] **Phase 1**: Update `.agent/rules/strict-planning-doc.md`

### Verification
- [ ] Verify rule content matches user requirements.

### Submission
- [ ] Commit changes
- [ ] Request user approval
- [ ] Create PR & Merge
