---
description: Outlines the workflow for agents performing work on the Portfolio Website
---

All work that results in code changes (i.e. not documentation, not planning, not research, etc.) MUST follow this workflow without skipping any steps.


## Phase 1: Planning (Steps 1-4)

1. Start when an agent is asked to perform work, make a change, work on a git issue, implement a feature, fix failing tests, etc.
    - If prompt is a git issue, retrieve the git issue to understand the requirements
    - If prompt is a requirements document, parse the requirements document to understand the requirements
    - If prompt is only a chat message, parse the chat message to understand the requirements

2. Interview the user for clarification on requirements (ONLY IF UNCLEAR)
    - Use clarify-requirements skill
    - Skip if requirements are already well-defined

3. MUST CREATE A PLANNING DOC
    - Use planning-doc skill

4. Ask user for approval of planning doc
    - MANDATORY
    - PROVIDE CLEAR PROMPT FOR USER TO APPROVE OR REJECT THE PLANNING DOC
    - MUST WAIT FOR USER APPROVAL BEFORE PROCEEDING TO NEXT STEP
    - If user rejects, go back to step 2 and interview for clarification

---

## Phase 2: Implementation (Steps 5-9)

5. Create git branch
    - ALL WORK MUST BE DONE ON A SEPARATE GIT BRANCH - DO NOT WORK ON MAIN BRANCH
    - Branch name should be in the format of `feature/branch-name` or `fix/branch-name` or `gitissue-{ID}/branch-name`
    - See [git-pr-merge skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md) for branch creation details

6. Implement changes based on planning doc
    - Follow the planning doc step by step
    - If the planning doc is unclear or missing information, interview the user for clarification

7. Verify implementation completeness
    - Review planning doc checklist and confirm all items are complete
    - Ensure all "Expected Code Changes" from planning doc are implemented
    - If items are missing, go back to step 6 before proceeding

8. Test changes
    - Run tests in order, proceeding only after each passes:
      1. Unit tests: `npm run test`
      2. E2E tests: `npm run test:e2e`
      3. MANDATORY: E2E baseline comparison using the [run-e2e-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/run-e2e-tests/SKILL.md)
      4. Full CI: `npm run ci-flow`
    - If new tests are needed, create them
    - If tests fail, fix them before proceeding
    - If tests fail repeatedly and cannot be fixed, notify user and ask for guidance
    - If tests are unclear or missing information, interview the user for clarification

9. Commit changes
    - Stage changes: `git add .` or `git add <specific-files>`
    - Commit messages should be in the format of `feat: description` or `fix: description` or `gitissue-{ID}: description`
    - Use command: `git commit -m "{commit-message}"`

---

## Phase 3: Review & Merge (Steps 10-11)

10. Ask user for approval of changes
    - MANDATORY
    - PROVIDE CLEAR PROMPT FOR USER TO APPROVE OR REJECT THE CHANGES
    - MUST WAIT FOR USER APPROVAL BEFORE PROCEEDING TO NEXT STEP
    - If user has additional changes, go back to step 6

11. Create pull request and merge changes
    - Use git-pr-merge skill
    - See [Error Handling section](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/git-pr-merge/SKILL.md#error-handling) for merge conflicts
    - If merge conflicts occur, notify user with recommended resolution steps

---

## Completion Checklist

WORK IS NOT DONE UNTIL ALL OF THE BELOW ARE COMPLETED:
- Planning doc is created and approved
- Git branch is created
- All changes are implemented based on planning doc
- Implementation verified against planning doc checklist
- All tests pass
- E2E baseline comparison passes (see [run-e2e-tests skill](file:///i:/code/VSCode/PortfolioWebsite/.agent/skills/run-e2e-tests/SKILL.md))
- ci-flow passes
- All changes are approved by user
- All changes are committed
- Pull request is created and merged