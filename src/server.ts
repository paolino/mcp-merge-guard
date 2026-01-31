import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  checkMergeReady,
  checkMergeReadySchema,
  guardMerge,
  guardMergeSchema,
} from "./tools/index.js";
import { GhError } from "./gh/errors.js";

/**
 * Create and configure the MCP server with merge guard tools
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "mcp-merge-guard",
    version: "0.1.0",
  });

  server.tool(
    "check-merge-ready",
    "Check if a PR is ready to merge by validating CI status, approvals, and conflicts",
    checkMergeReadySchema.shape,
    async (args) => {
      try {
        const input = checkMergeReadySchema.parse(args);
        const result = await checkMergeReady(input);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof GhError ? error.message : String(error);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: message }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  server.tool(
    "guard-merge",
    "Validate guards and merge PR only if all pass (atomic operation)",
    guardMergeSchema.shape,
    async (args) => {
      try {
        const input = guardMergeSchema.parse(args);
        const result = await guardMerge(input);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
          isError: !result.merged && !!result.error,
        };
      } catch (error) {
        const message = error instanceof GhError ? error.message : String(error);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: message }, null, 2),
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
