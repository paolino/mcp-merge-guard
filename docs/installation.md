# Installation

## Prerequisites

- [gh CLI](https://cli.github.com/) installed and authenticated
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI installed
- Node.js 20+ (if running from source)

## Adding to Claude Code

Claude Code supports MCP servers through its settings. You can configure them at two levels:

- **User-level** (`~/.claude/settings.json`) - Available in all projects
- **Project-level** (`.claude/settings.json`) - Available only in that project

### Using the CLI (Recommended)

The easiest way to add the MCP server is through the Claude Code settings interface:

1. Start Claude Code in any directory
2. Type `/settings` to open the settings menu
3. Navigate to **MCP Servers**
4. Add a new server with the configuration below

### Manual Configuration

Alternatively, edit the settings file directly.

#### With Nix (Recommended)

Add to `~/.claude/settings.json` (create if it doesn't exist):

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

#### From Source

Clone and build first:

```bash
git clone https://github.com/paolino/mcp-merge-guard
cd mcp-merge-guard
npm install
npm run build
```

Then add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "merge-guard": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-merge-guard/dist/index.js"]
    }
  }
}
```

!!! warning "Use absolute paths"
    The `args` path must be absolute. Relative paths won't work since Claude Code may run from any directory.

## Verifying Installation

After adding the MCP server:

1. **Restart Claude Code** - MCP servers are loaded at startup
2. **Check available tools** - Ask Claude:

```
What MCP tools are available for merging PRs?
```

You should see `check-merge-ready` and `guard-merge` listed.

3. **Test with a real PR** - Try checking a PR status:

```
Check if PR #1 in your-org/your-repo is ready to merge
```
