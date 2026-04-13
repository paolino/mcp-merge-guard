import { z } from "zod";
import type { MergeResult, GuardOptions, MergeMethod } from "../types.js";
import {
  getPrInfo,
  getPrChecks,
  getRepoMergeSettings,
  mergePr,
} from "../gh/client.js";
import { GhMergeError } from "../gh/errors.js";
import { runGuards } from "../guards/index.js";
import { checkMergeMethod } from "../guards/merge-method.js";
import { syncLocalBaseBranch } from "./local-sync.js";

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
      "Local repo path whose base branch should be updated after merge. " +
        "Fetches the merged base branch over GitHub HTTPS and fast-forwards the local base branch.",
    ),
});

export type GuardMergeInput = z.infer<typeof guardMergeSchema>;

/**
 * Validate guards and merge PR if all pass
 * This is an atomic operation - merge only happens if all guards pass
 */
export async function guardMerge(input: GuardMergeInput): Promise<MergeResult> {
  const { owner, repo, prNumber, requireUpToDate, mergeMethod, localRepoPath } =
    input;

  const [prInfo, { checks, statuses }, repoSettings] = await Promise.all([
    getPrInfo(owner, repo, prNumber),
    getPrChecks(owner, repo, prNumber),
    getRepoMergeSettings(owner, repo),
  ]);

  const options: GuardOptions = { requireUpToDate };
  const report = runGuards({ prInfo, checks, statuses, options });

  // Add merge-method guard result
  const mergeMethodGuard = checkMergeMethod(
    mergeMethod as MergeMethod,
    repoSettings,
  );
  report.guards.push(mergeMethodGuard);
  if (!mergeMethodGuard.passed) {
    report.allPassed = false;
  }

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
      mergeMethod as MergeMethod,
    );

    // Update local repo if path provided and merge succeeded
    let localSync: string | undefined;
    if (localRepoPath && mergeResponse.merged) {
      localSync = await syncLocalBaseBranch(
        localRepoPath,
        owner,
        repo,
        prInfo.baseRefName,
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
