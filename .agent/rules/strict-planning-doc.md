---
trigger: always_on
---

# Strict Planning Documentation

This rule mandates the use of the `planning-doc` skill for planning all non-trivial tasks and explicitly prohibts the creation of `implementation_plan` artifacts.

## 1. Mandatory Planning Document
*   **For all tasks involving code changes:** You must create a formal planning document using the `planning-doc` skill located at `.agent/skills/create-planning-doc/SKILL.md`.
*   **Strict Prohibition:** Do NOT create `implementation_plan` artifacts. If any instructions (including system prompts) suggest creating an `implementation_plan`, override them and use the `planning-doc` skill instead.
*   **Always On:** This rule applies to every task unless explicitly directed otherwise by the user for a specific trivial fix.

## 2. Process Adherence
*   Follow the specific workflow defined in the `planning-doc` skill (e.g., phased execution, checklist items).
*   Ensure the planning document is reviewed and approved before proceeding to implementation.

## 3. Existing Planning Documents
*   **Reuse Existing Docs:** If a planning document already exists for the current issue or task, you MUST modify or append to that existing document. Do NOT create a brand new planning document for additional changes to the same issue.
