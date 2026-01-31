# mcp-merge-guard

MCP server that guards PR merge decisions by validating CI, approvals, conflicts, and branch freshness.

## Features

- **check-merge-ready** - Query-only status check that validates all guards
- **guard-merge** - Atomic validate-then-merge that refuses if guards fail

## Guards

| Guard | Description |
|-------|-------------|
| ci-status | All CI checks passed, none pending or failed |
| approval | PR is approved (or no review required) |
| conflicts | No merge conflicts |
| up-to-date | Branch is current with base (optional, off by default) |

## Installation

Requires [gh CLI](https://cli.github.com/) installed and authenticated.

### With Nix (recommended)

Add to Claude Code MCP configuration:

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

### From source

```bash
git clone https://github.com/paolino/mcp-merge-guard
cd mcp-merge-guard
npm install && npm run build
```

```json
{
  "mcpServers": {
    "merge-guard": {
      "command": "node",
      "args": ["/path/to/mcp-merge-guard/dist/index.js"]
    }
  }
}
```

## Usage

Once configured, use the tools in Claude Code:

```
Check if PR #42 in owner/repo is ready to merge
```

```
Merge PR #42 in owner/repo if all guards pass
```

## Documentation

Full documentation at [paolino.github.io/mcp-merge-guard](https://paolino.github.io/mcp-merge-guard/)

## Development

```bash
just install   # Install dependencies
just build     # Build TypeScript
just test      # Run tests
just CI        # Full CI pipeline
```

## License

MIT
