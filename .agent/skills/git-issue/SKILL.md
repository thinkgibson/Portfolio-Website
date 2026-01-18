# Skill: GitHub Issue Resolver

## Goal
To autonomously resolve GitHub Issues with high accuracy, verified by automated tests and human approval.

## Protocol

### 1. Context & Environment Setup
- **Fetch Context:** Retrieve the full text of the specified GitHub Issue.
- **Branching:** Create and switch to a new local branch named `gitissue-[ID]` (e.g., `gitissue-12`).
- **Identify Files:** Locate relevant source files and existing test suites.

### 2. Analysis & Code Audit
- **Conflict Search:** Examine relevant existing code for potential logic conflicts or breaking changes.
- **Redundancy Check:** Identify duplicate code or existing utility functions that should be reused rather than rewritten.
- **Architecture Impact:** Assess how the new changes will integrate with the current project structure.
- **Clarification Check:** If requirements are ambiguous or lack "Acceptance Criteria," STOP and ask the user for clarification.

### 3. Implementation Planning
- **Proposed Solution:** Draft a plan of logic changes, highlighting reused or refactored components.
- **Testing Strategy:** List specific tests to be created or modified (Unit, Integration, etc.).
- **Approval Gate:** Present the plan to the user and wait for a "Go ahead" before modifying files.

### 4. Execution & Testing
- **Atomic Edits:** Apply changes to the codebase in logical, modular steps.
- **Test-Driven Verification:** - Create/update tests immediately.
    - Run the test suite.
    - If tests fail, diagnose and iterate until they pass.
- **Linting:** Ensure all code adheres to project style and passes linting checks.

### 5. Completion & Documentation
- **Summary:** List all modified and new files.
- **Commit Preparation:** Provide the exact `git` commands to stage and commit with a clean message (e.g., `git commit -m "feat: implement X (closes #ID)"`).
- **Push Instruction:** Provide the command to push the new branch to the remote repository.