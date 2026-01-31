# Tools Reference

## check-merge-ready

Query-only tool that checks if a PR is ready to merge by running all guards.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `owner` | string | yes | - | Repository owner |
| `repo` | string | yes | - | Repository name |
| `prNumber` | number | yes | - | Pull request number |
| `requireUpToDate` | boolean | no | false | Require branch to be up to date |

### Response

```json
{
  "owner": "paolino",
  "repo": "my-project",
  "prNumber": 42,
  "ready": true,
  "report": {
    "allPassed": true,
    "guards": [
      {
        "name": "ci-status",
        "passed": true,
        "message": "All 3 check(s) passed"
      },
      {
        "name": "approval",
        "passed": true,
        "message": "PR is approved"
      },
      {
        "name": "conflicts",
        "passed": true,
        "message": "No merge conflicts"
      }
    ],
    "timestamp": "2026-01-31T10:30:00.000Z"
  }
}
```

## guard-merge

Atomic tool that validates all guards and merges the PR only if all pass.

!!! warning "No bypass"
    This tool has no force flag by design. If guards fail, the merge is refused.

### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `owner` | string | yes | - | Repository owner |
| `repo` | string | yes | - | Repository name |
| `prNumber` | number | yes | - | Pull request number |
| `requireUpToDate` | boolean | no | false | Require branch to be up to date |
| `mergeMethod` | string | no | "rebase" | Merge method: "merge", "squash", or "rebase" |

### Successful Response

```json
{
  "owner": "paolino",
  "repo": "my-project",
  "prNumber": 42,
  "merged": true,
  "sha": "abc123def456",
  "report": {
    "allPassed": true,
    "guards": [...],
    "timestamp": "2026-01-31T10:30:00.000Z"
  }
}
```

### Failed Response (Guards)

```json
{
  "owner": "paolino",
  "repo": "my-project",
  "prNumber": 42,
  "merged": false,
  "error": "Guards failed: ci-status",
  "report": {
    "allPassed": false,
    "guards": [
      {
        "name": "ci-status",
        "passed": false,
        "message": "1 check(s) failed: Test (FAILURE)"
      },
      ...
    ],
    "timestamp": "2026-01-31T10:30:00.000Z"
  }
}
```
