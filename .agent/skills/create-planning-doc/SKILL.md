---
name: planning-doc
description: "Creates comprehensive planning documents for feature implementations. Use when given requirements, acceptance criteria, or GitHub issues to plan before coding."
---

# Skill: Planning Document Creation

## Goal

Create a structured planning document that enables any implementing agent to understand requirements, architecture, risks, and testing strategy without additional context.

---

## Protocol

### 1. Determine Source Type

| Source | Naming Convention |
|--------|-------------------|
| **GitHub Issue** | File: `planning/gitissue-{ID}.md`, Title: `GitHub Issue #{ID}: {Title}` |
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

## Document Structure & Guidelines

Create the planning document with these sections.

### File Naming
- **GitHub Issue**: `planning/gitissue-{ID}.md` (e.g., `gitissue-42.md`)
- **Generic**: `planning/{kebab-case-summary}.md` (e.g., `user-authentication.md`)

### Template

````markdown
# {Title}
<!-- For GitHub issues: "GitHub Issue #42: Add User Authentication" -->
<!-- For generic: "Add User Authentication" -->

## Overview
<!-- 1-2 sentences explaining the goal. List concrete features and user flows. -->
Brief description of what the change accomplishes.

### Features
Bulleted list of specific features/requirements.

---

## Expected Code Changes

### New Files
<!-- List all files to create with purpose. Use high-level descriptions. -->
| File | Purpose |
|------|---------|
| `path/to/file.tsx` | Description |

### Modified Files
<!-- List existing files and what changes. -->
| File | Changes |
|------|---------|
| `path/to/existing.tsx` | What will change |

---

## Architecture Notes
<!-- Include state management, component hierarchy, integration points, data flow, and ext dependencies. -->
- State management approach
- Component hierarchy
- Integration points with existing code
- Data flow diagrams (if complex)

---

## Git Branch & Commit Strategy

### Branch Name
- `gitissue-{ID}/{short-description}` or `feature/{short-description}`

### Commit Message
- **Subject**: `gitissue-{ID}: {description}`
- **Body**: {Optional detailed context}

---

## Possible Risks & Conflicts
<!-- Consider breaking changes, key collisions, styling conflicts, mobile/responsive issues, browser compat. -->

| Risk | Mitigation |
|------|------------|
| {Risk description} | {How to prevent/handle} |

---

## Test Coverage

> [!NOTE]
> Follow the [design-tests skill](../design-tests/SKILL.md) for testing best practices.
> - **New Functionality**: Must have E2E test coverage.
> - **Bug Fixes**: Must include new E2E test to prevent regression.

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

## Execution Phases
<!-- Split complex tasks into logical phases (e.g., Phase 1: API/Backend, Phase 2: UI Components, Phase 3: Integration). -->
1. **Phase 1**: {Description}
2. **Phase 2**: {Description}

---

## Implementation Checklist

### Preparation
- [ ] Create git branch

### Implementation
- [ ] **Phase 1**: Implement {Phase 1 Description}
- [ ] **Phase 2**: Implement {Phase 2 Description}
- [ ] ... (Continue for all defined phases)
- [ ] Verify implementation against "Expected Code Changes"

### Verification
- [ ] Run unit tests: `npm run test -- filter`
- [ ] Run E2E tests: `npm run test:e2e -- filter`
- [ ] Run full CI flow: `npm run ci-flow`

### Submission
- [ ] Commit changes (Format: `feat: description` or `gitissue-{ID}: description`)
- [ ] Request user approval
- [ ] Create PR & Merge
- [ ] Attach planning doc and walkthrough to the GitHub issue (e.g., via `gh issue comment`)
````

---

## Quality Checklist

Before finalizing the planning document, verify:

- [ ] All requirements from the issue are addressed
- [ ] File paths match project conventions
- [ ] Related skills are referenced via relative paths (not duplicated)
- [ ] Risks specific to this codebase are identified
- [ ] Test cases cover happy path and edge cases
- [ ] Checklist enables incremental progress