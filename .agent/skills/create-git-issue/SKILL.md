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
### distinct failure
<Description of what is going wrong>

### Steps to Reproduce
1. <Step 1>
2. <Step 2>
3. <Step 3>

### Expected Behavior
<What should happen>

### Environment
- OS: <OS>
- Browser: <Browser>
```

### 2. Review and Refine
Present the drafted **Title**, **Labels**, and **Body** to the user in a clear markdown block.

**CRITICAL INSTRUCTION**:
> You MUST explicitly ask: "Does this draft look correct? Should I proceed with creating the issue?"
> **STOP** and wait for user input. Do NOT execute the creation command in the same turn.

### 3. Execute Creation
**Only** after receiving affirmative user approval (e.g., "yes", "proceed", "looks good"), execute the `gh` command.

Use the `run_command` tool:

```powershell
gh issue create --title "<TITLE>" --body "<BODY>" --label "<LABEL1>,<LABEL2>"
```

**Note**: Ensure the `body` string is properly escaped for the shell if necessary, or just rely on the tool's handling. Using the `--body-file` flag is safer for complex multi-line bodies if you can write a temporary file, but direct string is usually fine for simple issues.

### 4. specific Instructions for Agents
- **Do not** hallucinate details. If steps to reproduce or acceptance criteria are missing, ask the user or infer reasonable defaults based on context (and mark them as *Proposed*).
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
