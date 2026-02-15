---
name: update-git-issue
description: Update an existing git issue using the gh CLI. Supports adding comments, changing state (close/reopen), adding/removing labels, and updating title/body.
---

# Update Git Issue

This skill allows you to update an existing git issue using the GitHub CLI (`gh`). It covers common tasks like adding comments, changing the issue state, and modifying issue metadata.

## Usage

### Add a Comment
To add a comment to an issue:
```powershell
gh issue comment <ISSUE_NUMBER> --body "Your comment here"
```

### Change Issue State

#### Close/Reopen
```powershell
# Close an issue
gh issue close <ISSUE_NUMBER>

# Reopen an issue
gh issue reopen <ISSUE_NUMBER>
```

#### Kanban Status Updates
Manage the progress of an issue within a GitHub Project:

1.  **Find the Project Item ID**:
    ```powershell
    gh issue view <ISSUE_NUMBER> --json projectItems
    ```
    This returns a list of project items. Locate the `id` for the relevant project.

2.  **Update the Status Field**:
    Use `gh project item-edit` to change the status. You will need the `--project-id`, the item `--id` (from step 1), and the `--field-id` (typically "Status"). 

    ```powershell
    # Move to a specific status (requires finding option IDs first)
    gh project item-edit --id <ITEM_ID> --field "Status" --single-select-option-id <OPTION_ID> --project-id <PROJECT_ID>
    ```

    *Tip: To find field and option IDs, use:*
    ```powershell
    gh project field-list <PROJECT_NUMBER> --owner <OWNER> --format json
    ```

### Update Metadata (Title, Body, Labels)
To update the title, body, or labels of an issue:
```powershell
# Update title and body
gh issue edit <ISSUE_NUMBER> --title "New Title" --body "New body content"

# Add labels
gh issue edit <ISSUE_NUMBER> --add-label "bug,priority"

# Remove labels
gh issue edit <ISSUE_NUMBER> --remove-label "question"
```

### "Attaching" Documents
To "attach" a document (like a planning doc or walkthrough) to an issue, upload its content as a comment using the `--body-file` flag. This ensures the content is viewable on GitHub by everyone.

```powershell
# Upload a markdown document as a new comment
gh issue comment <ISSUE_NUMBER> --body-file "path/to/document.md"
```

*Note: For images or other binary files, the CLI does not natively support direct uploads to issues yet. For those, a raw link to a file in a branch or a manual upload via the web UI is required.*

## Interpreting Responses
The `gh` commands usually return the URL of the updated issue or a success message. Always verify that your command executed successfully.

## Dependencies
- Requires `gh` (GitHub CLI) to be installed and authenticated.
