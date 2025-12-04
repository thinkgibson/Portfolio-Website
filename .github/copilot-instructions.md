# .github/copilot-instructions.md

Purpose
---
Provide short, actionable guidance for automated coding agents (Copilot/GPT agents) working in this repository.

High-level context
---
- This repository currently contains a small rules document at `GITHUB_COPILOT_RULES.md` which outlines agent workflows and local toolkit references (`c:\Users\ian\.aitk\instructions\tools.instructions.md`). Use that file as the source of truth for agent-specific conventions.
- There is no complex build system or tests committed in the repo root; treat repo changes as isolated edits unless you discover additional subprojects.

What an agent should know first
---
- Start by opening `GITHUB_COPILOT_RULES.md` at the repository root — it documents how this project expects agent behavior (pre-patch preambles, `apply_patch` usage, `manage_todo_list` expectations).
- Consult the local toolkit file: `c:\Users\ian\.aitk\instructions\tools.instructions.md` for global tool behavior and available helper tools.

Agent workflow (concise)
---
- Use the `manage_todo_list` tool to plan multi-step work. Create a small list, mark one item `in-progress`, mark completed as you finish.
- Before any modifying tool call (e.g., `apply_patch`, `create_file`), post a one-sentence preamble describing the immediate action.
- Use `apply_patch` to edit files. Keep diffs minimal and localized; avoid reformatting unrelated code.
- After making changes, summarize files added/modified and propose the next step (run tests, commit, push).

Project-specific patterns & examples
---
- Path style: use Windows absolute paths when referencing local toolkit files, e.g. `c:\Users\ian\.aitk\instructions\tools.instructions.md`.
- Shell examples: when giving terminal commands, use PowerShell and join commands with `;`. Example:

  `cd 'i:\code\VSCode\Portfolio Website'; git add .\file; git commit -m 'msg'; git push`

- File edits: prefer single-file patches. Example apply_patch intent:

  - Add `i:\code\VSCode\Portfolio Website\newfile.md` with a single patch operation.

Integration points & external dependencies
---
- No project-internal CI or external services are detectable in the repository. If you need to update CI or external integration, ask the user for missing config files or credentials.

Editing safety & limits
---
- Do not invent tests, build scripts, or new top-level components without asking — prefer minimal, reviewable changes.
- Avoid adding or modifying files outside the user's requested scope unless explicitly approved.

When `.github/copilot-instructions.md` already exists
---
- Merge intelligently: preserve repository-specific examples and workflows from `GITHUB_COPILOT_RULES.md` and `tools.instructions.md`. Do not blindly overwrite.

Next steps & feedback
---
- I created/updated this file to reflect current repository state. If there are additional subfolders, build scripts, or CI you'd like the agent to know about, point me to them and I will update this guidance.
