# Installation

## Prerequisites

- [gh CLI](https://cli.github.com/) installed and authenticated
- Node.js 20+ (if running from source)

## Using Nix (Recommended)

Add to your Claude Code MCP configuration (`~/.claude.json` or project `.claude/settings.json`):

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

## From Source

Clone and build:

```bash
git clone https://github.com/paolino/mcp-merge-guard
cd mcp-merge-guard
npm install
npm run build
```

Add to Claude Code configuration:

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

## Verifying Installation

After adding the MCP server, restart Claude Code and verify the tools are available:

```
What MCP tools are available for merging PRs?
```

You should see `check-merge-ready` and `guard-merge` listed.
