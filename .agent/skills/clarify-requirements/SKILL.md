---
name: clarify-requirements
description: Interview the user for clarification on requirements and missing details.
version: 1.2.0
---

# Clarify Requirements

**Goal**: Transform vague or incomplete requests into actionable, precise technical specifications by interviewing the user.

## Trigger
Use this skill when:
- The user's request is ambiguous or high-level (e.g., "Fix the bug", "Add a new feature").
- Acceptance criteria are missing.
- There are potential conflicts with existing systems.
- You need to confirm design or behavioral choices before implementation.

## Process

1.  **Analyze the Request**:
    *   **Core Objective**: What is the user ultimately trying to achieve?
    *   **Missing Details**: Look for gaps. (e.g., "Add a search bar" -> Where? Real-time filtering or on submit? What fields are searched?)
    *   **Edge Cases**: What about empty states, error states, or mobile responsiveness?
    *   **Tradeoffs & Concerns**: Are there performance, security, or complexity tradeoffs? Does this impact existing functionality?
    *   **Constraints**: Are there performance, security, or style guidelines (e.g., "Simplicity First", "Surgical Changes") that impact this?

2.  **Formulate Questions**:
    *   **Be Specific & Non-Obvious**: Avoid open-ended "What do you want?" questions or obvious questions that can be reasonably inferred. Offer options based on existing patterns in the codebase.
        *   *Bad*: "How should it look?" (Too open)
        *   *Bad*: "Should the button be clickable?" (Obvious)
        *   *Good*: "Should this reuse the existing `.card-style` from `Card.tsx`, or do you strictly need the 'glassmorphism' look mentioned?"
    *   **Prioritize**: Identify "Blockers" (cannot start without) vs. "Refinements" (can decide later).
    *   **Count Them**: Determine the total number of necessary questions.

3.  **Interview User (One-by-One)**:
    *   **Do NOT** dump all questions at once.
    *   Ask questions **individually** to maintain focus and prevent the user from skipping details.
    *   **Format**: Use the format `**Question X of Y**: [Question Content]`
    *   **Wait**: Stop and wait for the user's response after each question.
    *   **Adapt**: If a user's answer changes the necessity of subsequent questions, adjust your count or skip them.

4.  **Output**:
    *   Once all questions are answered, summarize the agreed-upon requirements.
    *   If using `implementation_plan.md`, update it with these details immediately.

## Example Interaction

**User Request**: "Add a contact form."

**Agent Analysis**: Needs details on Location, Fields, Submission method, and Validation. (Total 4 questions).

**Agent Response**:
"I can help with that. To ensure it fits the current app, I have 4 questions to verify requirements.

**Question 1 of 4**: Should this be a modal, a dedicated page, or a section on the footer? (Context: We currently utilize `Win95Window` for most apps)."

*(User responds: "Make it a window")*

**Agent Response**:
"Understood, a `Win95Window`.

**Question 2 of 4**: Besides Name/Email/Message, do we need a subject line or phone number?"

*(User responds: "Just the basics")*

**Agent Response**:
"Got it.

**Question 3 of 4**: Should this send an actual email (requiring a backend/service) or just log to console/mock success for now?"
