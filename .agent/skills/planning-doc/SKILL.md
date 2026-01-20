---
name: planning-doc
description: "Creates comprehensive planning documents for feature implementations. Use when given requirements, acceptance criteria, or GitHub issues to plan before coding."
version: 1.0.0
---

# Skill: Planning Document Creation

## Goal

Create a structured planning document that enables any implementing agent to understand requirements, architecture, risks, and testing strategy without additional context.

---

## Protocol

### 1. Determine Source Type

| Source | Naming Convention |
|--------|-------------------|
| **GitHub Issue** | File: `planning/gitissue-{ID}.md`, Title: `Git Issue #{ID}: {Title}` |
| **Generic Requirements** | File: `planning/{kebab-case-summary}.md`, Title: `{Summary Title}` |

### 2. Gather Context

Before writing the plan, collect:

- **Requirements**: Full text of issue/ticket/acceptance criteria
- **Project Structure**: Run `list_dir` on key directories (components, tests, lib)
- **Existing Code**: Use `view_file_outline` on related files
- **Related Skills**: Check for existing skills (git workflow, testing, etc.)

### 3. Identify Issue Type

| Type | Focus |
|------|-------|
| **Enhancement** | New features, user flows, architecture integration |
| **Bug Fix** | Root cause, affected areas, regression prevention |
| **Refactor** | Breaking changes, migration path, backwards compatibility |

---

## Document Structure

Create the planning document with these sections:

### File Naming

- **GitHub Issue**: `planning/gitissue-{ID}.md` (e.g., `gitissue-42.md`)
- **Generic**: `planning/{kebab-case-summary}.md` (e.g., `user-authentication.md`)

### Required Sections

```markdown
# {Title}
<!-- For GitHub issues: "Git Issue #42: Add User Authentication" -->
<!-- For generic: "Add User Authentication" -->

## Overview
Brief description of what the change accomplishes.

### Features
Bulleted list of specific features/requirements.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `path/to/file.tsx` | Description |

### Modified Files
| File | Changes |
|------|---------|
| `path/to/existing.tsx` | What will change |

---

## Architecture Notes
- State management approach
- Component hierarchy
- Integration points with existing code
- Data flow diagrams (if complex)

---

## Git Branch/Commit/Merge Instructions

> [!NOTE]
> Follow the [git-pr-merge skill](file:///path/to/git-pr-merge/SKILL.md) for the complete workflow.

**For GitHub Issues:**
1. **Create Branch**: `git checkout -b gitissue-{ID}/branch-name`
2. **Commit Format**: `git commit -m "gitissue-{ID}: description"`

**For Generic Requirements:**
1. **Create Branch**: `git checkout -b feature/branch-name` or `git checkout -b fix/branch-name`
2. **Commit Format**: `git commit -m "feat: description"` or `git commit -m "fix: description"`

**Both:**
3. **Push & Create PR**: `gh pr create --fill --push`
4. **Merge**: `gh pr merge --merge --delete-branch`

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| {Risk description} | {How to prevent/handle} |

---

## Test Coverage

> [!NOTE]
> Follow the [designing-tests skill](file:///path/to/designing-tests/SKILL.md) for testing best practices.

### Unit Tests (`__tests__/path/to/file.test.tsx`)
- [ ] Test case 1
- [ ] Test case 2

### E2E Tests (`e2e/tests/feature.spec.ts`)
- [ ] User flow test 1
- [ ] User flow test 2

### Test Commands
```bash
npm run test -- ComponentName
npm run test:e2e -- feature.spec.ts
npm run ci-flow
```

---

## Implementation Checklist
- [ ] Step 1
- [ ] Step 2
- [ ] Verify all tests pass
```

---

## Section Guidelines

### Overview Section

- 1-2 sentences explaining the goal
- List concrete features (not vague requirements)
- Include user flows if applicable

### Expected Code Changes

- **New Files**: List all files to create with purpose
- **Modified Files**: List existing files and what changes
- Use high-level descriptions (not line-by-line)

### Architecture Notes

Include when:
- State management decisions are needed
- Multiple components must coordinate
- External dependencies are involved
- Performance considerations exist

### Risks & Conflicts

Common risk categories:
- Breaking changes to existing features
- State/storage key collisions
- Z-index or styling conflicts
- Mobile/responsive issues
- Browser compatibility
- Performance impact
- Security concerns

### Test Coverage

- Reference the `designing-tests` skill
- Include **both** unit and E2E tests
- Write test cases as checkboxes for tracking
- Include the exact test commands

### Implementation Checklist

- Order steps logically using these priorities:
  1. **Shared dependencies first** - Types, interfaces, utilities, constants
  2. **Core logic second** - Hooks, services, state management
  3. **Components third** - UI components that consume the above
  4. **Tests last** - Unit tests, then E2E tests
- Flag items that can be done in parallel vs must be sequential
- End with verification step
- Keep granular enough for progress tracking

---

## Formatting Best Practices

1. **Use Tables** for structured data (files, risks)
2. **Use Alerts** for critical information:
   ```markdown
   > [!NOTE]
   > General information
   
   > [!WARNING]
   > Potential issues or dependencies
   
   > [!IMPORTANT]
   > Critical requirements
   ```
3. **Use Code Blocks** for commands and examples
4. **Link to Related Skills** using file:// links
5. **Use ASCII Art** for simple UI mockups when helpful

---

## Quality Checklist

Before finalizing the planning document, verify:

- [ ] All requirements from the issue are addressed
- [ ] File paths match project conventions
- [ ] Related skills are referenced (not duplicated)
- [ ] Risks specific to this codebase are identified
- [ ] Test cases cover happy path and edge cases
- [ ] Checklist enables incremental progress
- [ ] Another agent can implement without asking questions

---

## Example Workflow

### For GitHub Issues
```
1. Read issue: gh issue view {ID}
2. Explore codebase: list_dir, view_file_outline
3. Check for related skills in .agent/skills/
4. Write planning document following structure above
5. Save to planning/gitissue-{ID}.md
```

### For Generic Requirements
```
1. Parse requirements from user input or document
2. Explore codebase: list_dir, view_file_outline
3. Check for related skills in .agent/skills/
4. Write planning document following structure above
5. Save to planning/{kebab-case-summary}.md
```
