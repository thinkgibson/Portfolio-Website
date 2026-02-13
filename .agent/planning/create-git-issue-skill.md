# Draft `create-git-issue` Agent Skill

## Overview
Create a new agent skill called `create-git-issue` that allows the agent to draft and create GitHub issues (user stories or bug reports) based on user input. The skill will parse user intent, generate a structured draft, request user approval, and then execute the creation command.

### Features
- Analyze user input to determine issue type (Bug or Feature).
- Draft issue title and body using standard templates.
- Pause execution to request user confirmation.
- Create the issue using `gh issue create`.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `.agent/skills/create-git-issue/SKILL.md` | The main skill documentation and instructions. |

---

## Execution Phases
1. **Phase 1**: Create the skill directory and file with drafting and creation logic.

---

## Implementation Checklist

### Preparation
- [ ] Create git branch `feature/create-git-issue-skill`

### Implementation
- [ ] **Phase 1**: Create `.agent/skills/create-git-issue/SKILL.md` with detailed instructions.
    - [ ] Define intent analysis steps.
    - [ ] Define template drafting steps.
    - [ ] Define user approval step.
    - [ ] Define `gh` CLI command execution.
- [ ] Verify content against requirements.

### Verification
- [ ] Verify the file exists and contains correct markdown instructions.
- [ ] (Manual) Test the skill by asking the agent to use it (in a subsequent turn or new conversation).

### Submission
- [ ] Commit changes: `feat: add create-git-issue agent skill`
- [ ] Request user approval
