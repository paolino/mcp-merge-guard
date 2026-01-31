import { z } from "zod";
import type { MergeReadyStatus, GuardOptions } from "../types.js";
import { getPrInfo, getPrChecks } from "../gh/client.js";
import { runGuards } from "../guards/index.js";

export const checkMergeReadySchema = z.object({
  owner: z.string().describe("Repository owner (user or organization)"),
  repo: z.string().describe("Repository name"),
  prNumber: z.number().int().positive().describe("Pull request number"),
  requireUpToDate: z
    .boolean()
    .optional()
    .default(false)
    .describe("Require branch to be up to date with base (default: false)"),
});

export type CheckMergeReadyInput = z.infer<typeof checkMergeReadySchema>;

/**
 * Check if a PR is ready to merge by running all guards
 */
export async function checkMergeReady(
  input: CheckMergeReadyInput
): Promise<MergeReadyStatus> {
  const { owner, repo, prNumber, requireUpToDate } = input;

  const [prInfo, { checks, statuses }] = await Promise.all([
    getPrInfo(owner, repo, prNumber),
    getPrChecks(owner, repo, prNumber),
  ]);

  const options: GuardOptions = { requireUpToDate };
  const report = runGuards({ prInfo, checks, statuses, options });

  return {
    owner,
    repo,
    prNumber,
    ready: report.allPassed,
    report,
  };
}
