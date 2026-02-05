---
name: retrieve-git-issue
description: Retrieve a git issue by number using the gh CLI. Returns full details including description, labels, comments, and handles extraction of image/attachment links.
---

# Retrieve Git Issue

This skill allows you to retrieve a specific git issue by its number using the GitHub CLI (`gh`). It ensures you get all relevant context including the full body (description), labels, state, and comments.

## Usage

To retrieve an issue, run the following command in the terminal:

```powershell
gh issue view <ISSUE_NUMBER> --json number,title,body,labels,state,comments,createdAt,updatedAt,url,author
```

Replace `<ISSUE_NUMBER>` with the actual issue number (e.g., `77`).

## Interpreting Output

The command returns a JSON object. You should parse this JSON to extract the information you need.

### Key Fields

- **title**: The title of the issue.
- **body**: The main description of the issue. **Important**: This field contains Markdown.
    - **Images**: Look for Markdown image syntax `![alt text](url)` or HTML `<img src="url">` tags within the `body` to find screenshots or design mocks.
    - **Attachments**: Look for standard links `[filename](url)` that point to file attachments (like logs or zips).
- **labels**: An array of label objects. Use these to understand the type/priority of the issue (e.g., `bug`, `enhancement`).
- **comments**: An array of comments. Check these for recent updates or clarifications from the user or other team members.

## Example

If you need to fix a bug described in issue #123:

1.  Run: `gh issue view 123 --json number,title,body,labels,state,comments,url`
2.  Read the `body` to understand the bug report.
3.  Check `labels` to see if it's a `bug` or `feature`.
4.  Scan the `body` for image URLs to visualize the problem if screenshots were provided.

## Dependencies

- Requires `gh` (GitHub CLI) to be installed and authenticated.
