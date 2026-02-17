---
name: create-git-issue
description: Drafts and creates a GitHub issue based on user input. Analyzes intent, rewrites as a structured user story or bug report, and requires strict user approval before creation.
---

# Skill: Create Git Issue

## Goal
To efficiently create high-quality GitHub issues (Bug Reports or Feature Requests/User Stories) by drafting them for user review and then executing the creation command.

## Protocol

### 1. Analyze and Draft
Analyze the user's input to determine the nature of the request.

> [!TIP]
> If the user's input is unclear, ambiguous, or lacks critical detail (e.g., missing steps to reproduce or clear goal), use the [clarify-requirements](file:///.agent/skills/clarify-requirements/SKILL.md) skill first to gather necessary information.

- **If Bug**: Structure as a **Bug Report**.
- **If Feature/Task**: Structure as a **User Story**.

**Draft the content** using the following templates. Do not create the issue yet.

#### Templates

**Option A: User Story (Feature)**
```markdown
**Title**: [Feature]: <Concise Title>
**Labels**: enhancement

**Body**:
### User Story
As a <user role>, I want <goal> so that <benefit>.

### Acceptance Criteria
- [ ] <Criterion 1>
- [ ] <Criterion 2>

### Technical Notes
<Optional implementation details>
```

**Option B: Bug Report**
```markdown
**Title**: [Bug]: <Concise Description of Failure>
**Labels**: bug

**Body**:
### Distinct Failure
<Description of what is going wrong>

### Steps to Reproduce
1. <Step 1>
2. <Step 2>
3. <Step 3>

### Expected Behavior
<What should happen>

### Environment
- OS: Windows
- Browser: <Browser>
```

### 2. Review and Refine
Present the drafted **Title**, **Labels**, and **Body** to the user in a clear markdown block.

**CRITICAL INSTRUCTION**:
> You MUST explicitly ask: "Does this draft look correct? Should I proceed with creating the issue?"
> **STOP** and wait for user input. Do NOT execute the creation command in the same turn.

### 3. Execute Creation
**Only** after receiving affirmative user approval (e.g., "yes", "proceed", "looks good"), execute the `gh` command.

To ensure robustness against shell escaping issues with multi-line bodies:
1.  **Write the drafted body to a temporary file** (e.g., `temp_issue_body.txt`) using the `write_to_file` tool.
2.  **Execute the `gh` command** using the `--body-file` flag.

```powershell
gh issue create --title "<TITLE>" --body-file temp_issue_body.txt --label "<LABEL1>,<LABEL2>"
```

3.  **Clean up** the temporary file after successful creation.

```powershell
rm temp_issue_body.txt
```

**Note**: Using the `--body-file` flag is mandated for all issues with multi-line bodies or special characters to avoid shell argument parsing errors.

### 4. Specific Instructions for Agents
- **Clarity First**: If requirements are missing, prioritize using the `clarify-requirements` skill over hallucinating details or inferring vague defaults.
- **Context Awareness**: If the user refers to "this file" or "current error", use your context to fill in those details in the draft.

## Example Workflow

**User**: "The login button is broken on mobile."

**Agent**:
"I've drafted a bug report for this. Please review:

**Title**: [Bug]: Login button unresponsive on mobile view
**Labels**: bug
**Body**: ... (Drafted content) ...

Shall I create this issue?"

**User**: "Yes."

**Agent**: (Calls `gh issue create ...`) "Issue #42 created successfully: [link]"
