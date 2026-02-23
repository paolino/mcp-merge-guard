import { z } from "zod";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { MergeResult, GuardOptions, MergeMethod } from "../types.js";
import { getPrInfo, getPrChecks, mergePr } from "../gh/client.js";
import { GhMergeError } from "../gh/errors.js";
import { runGuards } from "../guards/index.js";

const execAsync = promisify(exec);

export const guardMergeSchema = z.object({
  owner: z.string().describe("Repository owner (user or organization)"),
  repo: z.string().describe("Repository name"),
  prNumber: z.number().int().positive().describe("Pull request number"),
  requireUpToDate: z
    .boolean()
    .optional()
    .default(false)
    .describe("Require branch to be up to date with base (default: false)"),
  mergeMethod: z
    .enum(["merge", "squash", "rebase"])
    .optional()
    .default("rebase")
    .describe("Merge method to use (default: rebase)"),
  localRepoPath: z
    .string()
    .optional()
    .describe(
      "Local repo path to update after merge. " +
        "Runs git fetch + rebase on the base branch."
    ),
});

export type GuardMergeInput = z.infer<typeof guardMergeSchema>;

/**
 * Update the local base branch after a successful remote merge.
 * Returns a status message.
 */
async function pullBaseBranch(
  repoPath: string,
  baseBranch: string
): Promise<string> {
  try {
    await execAsync(
      `git -C '${repoPath}' fetch origin ${baseBranch}`,
      { timeout: 30000 }
    );
    await execAsync(
      `git -C '${repoPath}' rebase origin/${baseBranch}`,
      { timeout: 30000 }
    );
    return `Local ${baseBranch} updated`;
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error);
    return `Local update failed: ${msg}`;
  }
}

/**
 * Validate guards and merge PR if all pass
 * This is an atomic operation - merge only happens if all guards pass
 */
export async function guardMerge(input: GuardMergeInput): Promise<MergeResult> {
  const { owner, repo, prNumber, requireUpToDate, mergeMethod, localRepoPath } =
    input;

  const [prInfo, { checks, statuses }] = await Promise.all([
    getPrInfo(owner, repo, prNumber),
    getPrChecks(owner, repo, prNumber),
  ]);

  const options: GuardOptions = { requireUpToDate };
  const report = runGuards({ prInfo, checks, statuses, options });

  if (!report.allPassed) {
    const failedGuards = report.guards
      .filter((g) => !g.passed)
      .map((g) => g.name);

    return {
      owner,
      repo,
      prNumber,
      merged: false,
      error: `Guards failed: ${failedGuards.join(", ")}`,
      report,
    };
  }

  try {
    const mergeResponse = await mergePr(
      owner,
      repo,
      prNumber,
      mergeMethod as MergeMethod
    );

    // Update local repo if path provided and merge succeeded
    let localSync: string | undefined;
    if (localRepoPath && mergeResponse.merged) {
      localSync = await pullBaseBranch(
        localRepoPath,
        prInfo.baseRefName
      );
    }

    return {
      owner,
      repo,
      prNumber,
      merged: mergeResponse.merged,
      sha: mergeResponse.sha,
      localSync,
      report,
    };
  } catch (error) {
    const message =
      error instanceof GhMergeError ? error.message : String(error);

    return {
      owner,
      repo,
      prNumber,
      merged: false,
      error: message,
      report,
    };
  }
}
