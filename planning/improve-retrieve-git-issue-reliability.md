# Improve Retrieve Git Issue Skill Reliability

## Overview
The goal of this task is to enhance the `retrieve-git-issue` skill to ensure it is 100% reliable and efficient for agent use. We will address issues with truncated output, intermittent errors, and lack of redundancy.

### Features
- **Prerequisite Validation**: Check for `gh` installation and authentication.
- **Large Output Handling**: Instructions and mechanisms to prevent terminal truncation (using file-based retrieval).
- **Redundant Retrieval Paths**: Fallback from JSON to plain text view if JSON fails.
- **Improved Field Selection**: Include more relevant metadata for agent context.
- **Robustness**: Guide the agent on how to handle common GitHub CLI errors.

---

## Expected Code Changes

### New Files
| File | Purpose |
|------|---------|
| `.agent/skills/retrieve-git-issue/retrieve_issue.ps1` | A robust PowerShell script that wraps `gh` to handle errors and large outputs. |

### Modified Files
| File | Changes |
|------|---------|
| `.agent/skills/retrieve-git-issue/SKILL.md` | Comprehensive update to instructions, adding prerequisites, large output handling, and troubleshooting. |

---

## Architecture Notes
- The skill will now prefer using a wrapper script (`retrieve_issue.ps1`) which handles the complexity of checking auth and writing to a file.
- The wrapper script will:
  1. Check if `gh` is authenticated.
  2. Attempt to fetch JSON.
  3. If JSON fails, attempt to fetch plain text.
  4. Write the output to a temporary file in the workspace to avoid truncation during the `run_command` transfer.
  5. Provide a summary of the retrieval.

---

## Git Branch & Commit Strategy

### Branch Name
- Use the current branch.

### Commit Message
- **Subject**: `skill: improve retrieve-git-issue robustness`
- **Body**: Added wrapper script and updated SKILL.md to handle large outputs and authentication checks.

---

## Possible Risks & Conflicts

| Risk | Mitigation |
|------|------------|
| Script failure on different shells | Use PowerShell for consistency on this Windows system. |
| Permission issues with temp files | Write temp files to a predictable location like `.tmp` or the current directory (and clean up). |

---

## Test Coverage

### Manual Verification
- [ ] Run `retrieve_issue.ps1` with a valid issue ID and verify JSON file creation.
- [ ] Run `retrieve_issue.ps1` with an invalid issue ID and verify error reporting.
- [ ] Verify `SKILL.md` instructions correctly point to the script and fallback methods.

---

## Execution Phases
1. **Phase 1**: Research and Script Development
   - Draft `retrieve_issue.ps1`
   - Test locally
2. **Phase 2**: Skill Documentation Update
   - Update `SKILL.md` with new protocols
3. **Phase 3**: Final Verification
   - Verify as an agent (simulated or real)

---

## Implementation Checklist

### Preparation
- [x] Research failure points
- [ ] Create git branch

### Implementation
- [ ] **Phase 1**: Implement `retrieve_issue.ps1`
- [ ] **Phase 2**: Update `SKILL.md`
- [ ] Verify implementation

### Submission
- [ ] Commit changes
- [ ] Request user approval
- [ ] (Other git steps)
