---
description: Instructs the agent on how to implement based on a user-provided planning doc
---

## Initialize
1. Read the user-provided planning document and ensure it meets the structural and content requirements defined in the `planning-doc` skill.
2. Initialize or update `task.md` with the implementation and verification steps from the planning doc.
3. For any questions or requirements gaps, use the `requirements-interview` skill to clarify with the user.

## Execute
4. Follow the planning document EXACTLY.
5. Update the implementation checklist in the planning doc and mark progress in `task.md` as you proceed.
6. PAUSE FOR USER REVIEW AND APPROVAL WHEN REQUIRED (e.g., when specifically requested in the plan).

## Verify
7. Execute the **Verification Plan** exactly as described in the planning document.
8. Create or update the `walkthrough.md` artifact to document the tests performed, results, and include any visual proof (screenshots/recordings).

## Finalize
9. Inform the user that the implementation and verification are complete.
10. Provide the updated planning doc and walkthrough for final review.
11. If approved, suggest moving to the `git-pr-merge` workflow to land the changes.