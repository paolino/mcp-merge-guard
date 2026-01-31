# Configuration

## Guard Behavior

### ci-status

Checks that all CI checks have completed successfully.

**Passes when:**
- All check runs have `conclusion: SUCCESS`, `SKIPPED`, or `NEUTRAL`
- All status checks have `state: SUCCESS`
- No checks are configured (empty CI)

**Fails when:**
- Any check has `conclusion: FAILURE`, `CANCELLED`, `TIMED_OUT`, or `ACTION_REQUIRED`
- Any check is still `IN_PROGRESS`, `PENDING`, `QUEUED`, or `WAITING`
- Any status check has `state: FAILURE`, `PENDING`, or `ERROR`

### approval

Checks that the PR has the required approvals.

**Passes when:**
- `reviewDecision: APPROVED`
- `reviewDecision: null` (no review required by repo settings)

**Fails when:**
- `reviewDecision: CHANGES_REQUESTED`
- `reviewDecision: REVIEW_REQUIRED`

### conflicts

Checks that the PR has no merge conflicts.

**Passes when:**
- `mergeable: MERGEABLE`

**Fails when:**
- `mergeable: CONFLICTING`
- `mergeable: UNKNOWN` (status still calculating)

### up-to-date (Optional)

Checks that the PR branch is current with the base branch. Disabled by default.

**Passes when:**
- `mergeStateStatus: CLEAN`
- `mergeStateStatus: HAS_HOOKS`
- `mergeStateStatus: UNSTABLE`
- `mergeStateStatus: UNKNOWN`

**Fails when:**
- `mergeStateStatus: BEHIND`
- `mergeStateStatus: BLOCKED`
- `mergeStateStatus: DIRTY`

Enable by setting `requireUpToDate: true` in tool parameters.

## Merge Methods

| Method | Description |
|--------|-------------|
| `rebase` | Rebase commits onto base branch (default, maintains linear history) |
| `squash` | Squash all commits into one |
| `merge` | Create a merge commit |

The default is `rebase` to maintain linear git history.

## gh CLI Authentication

mcp-merge-guard uses the gh CLI for all GitHub operations. Ensure you are authenticated:

```bash
gh auth login
gh auth status
```

The tool inherits the gh CLI's authentication, so no additional token management is required.
