# mcp-merge-guard

MCP server that guards PR merge decisions by validating CI, approvals, conflicts, and branch freshness.

## Overview

mcp-merge-guard provides two tools for safe PR merging:

- **check-merge-ready**: Query-only status check that validates all guards
- **guard-merge**: Atomic validate-then-merge operation that refuses if guards fail

## Guards

| Guard | Description |
|-------|-------------|
| `ci-status` | All CI checks passed, none pending or failed |
| `approval` | PR is approved (or no review required) |
| `conflicts` | No merge conflicts |
| `up-to-date` | Branch is current with base (optional) |

## Quick Start

Add to your Claude Code MCP configuration:

```json
{
  "mcpServers": {
    "merge-guard": {
      "command": "nix",
      "args": ["run", "github:paolino/mcp-merge-guard"]
    }
  }
}
```

Then use the tools in Claude Code:

```
Check if PR #42 in owner/repo is ready to merge
```

```
Merge PR #42 in owner/repo if all guards pass
```
