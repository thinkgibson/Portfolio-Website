param (
    [Parameter(Mandatory=$true)]
    [int]$IssueNumber,
    
    [string]$OutputFile = "issue_${IssueNumber}.json"
)

# 1. Check gh authentication
Write-Host "Checking GitHub CLI authentication..." -ForegroundColor Cyan
gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Error "GitHub CLI is not authenticated. Please run 'gh auth login'."
    exit 1
}

# 2. Attempt to fetch JSON
Write-Host "Fetching issue #$IssueNumber data..." -ForegroundColor Cyan
$fields = "number,title,body,labels,state,comments,createdAt,updatedAt,url,author,assignees,milestone"

# Use gh issue view with JSON flag
$jsonOutput = gh issue view $IssueNumber --json $fields 2>$null

if ($LASTEXITCODE -eq 0) {
    # Successfully fetched JSON, write to file
    $jsonOutput | Out-File -FilePath $OutputFile -Encoding utf8
    Write-Host "Successfully saved issue #$IssueNumber to $OutputFile" -ForegroundColor Green
    
    # Check if body is very large (potential truncation in display)
    $issueObj = $jsonOutput | ConvertFrom-Json
    if ($issueObj.body.Length -gt 5000) {
        Write-Host "Warning: Issue body is large ($($issueObj.body.Length) chars). Reading directly from the file is recommended." -ForegroundColor Yellow
    }
} else {
    Write-Host "JSON retrieval failed. Falling back to plain text..." -ForegroundColor Yellow
    # Fallback: Fetch plain text and save as .txt or raw JSON if possible
    gh issue view $IssueNumber > "${OutputFile}.txt"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Saved plain text view to ${OutputFile}.txt" -ForegroundColor Green
    } else {
        Write-Error "Failed to retrieve issue #$IssueNumber."
        exit 1
    }
}

Write-Host "Retrieval complete." -ForegroundColor Cyan
