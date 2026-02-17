---
name: retrieve-git-issue
description: Retrieve a git issue by number using the gh CLI. Returns full details including description, labels, comments, and handles extraction of image/attachment links.
---

# Retrieve Git Issue

This skill allows you to retrieve a specific git issue by its number using the GitHub CLI (`gh`). It ensures you get all relevant context including the full body (description), labels, state, and comments, while preventing output truncation.

## Prerequisites

Ensure you are authenticated with the GitHub CLI:

```powershell
gh auth status
```

If not authenticated, ask the USER to run `gh auth login`.

## Usage

### Recommended Procedure (Most Robust)

Use the provided PowerShell script to fetch the issue and save it to a file. This avoids terminal truncation for large issues.

1.  Run the retrieval script:
    ```powershell
    powershell .agent\skills\retrieve-git-issue\retrieve_issue.ps1 -IssueNumber <ISSUE_NUMBER>
    ```
2.  The script creates a file named `issue_<ISSUE_NUMBER>.json` (e.g., `issue_123.json`).
3.  Read the file contents using the `view_file` tool.
4.  Parse the JSON to extract the information you need.

### Alternative / Fallback (Quick View)

If the script is unavailable or you need a quick check:

```powershell
gh issue view <ISSUE_NUMBER> --json number,title,body,labels,state,comments,createdAt,updatedAt,url,author,assignees,milestone
```

> [!WARNING]
> For very large issues, the command above may truncate the output in the terminal. If you suspect truncation (e.g., the JSON ends abruptly), use the **Recommended Procedure**.

## Interpreting Output

### Key Fields

- **title**: The title of the issue.
- **body**: The main description (Markdown). Check for screenshots manually by looking for image URLs.
- **labels**: Understand priority/type.
- **comments**: Check for recent clarifications or team feedback.
- **assignees/milestone**: Useful for context on who is working on it and when it's due.

## Troubleshooting

- **Large Issues**: If `view_file` shows a truncated JSON, it might be due to extreme size. Try fetching comments separately if needed (though the script handles most cases).
- **Authentication Error**: Ensure `gh` is logged in.
- **Empty Body/Comments**: Some issues might truly be empty; verify by running `gh issue view <ISSUE_NUMBER>` (plain text) to confirm.

## Dependencies

- Requires `gh` (GitHub CLI) installed and authenticated.
- PowerShell (for the `retrieve_issue.ps1` script).
