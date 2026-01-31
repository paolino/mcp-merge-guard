import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { MergeMethod } from "../types.js";
import {
  GhError,
  GhNotInstalledError,
  GhAuthError,
  GhNotFoundError,
  GhMergeError,
} from "./errors.js";
import type { PrInfo, CheckRun, StatusCheck, MergeResponse } from "./types.js";

const execAsync = promisify(exec);
const TIMEOUT_MS = 30000;

/**
 * Execute a gh CLI command and return parsed JSON output
 */
async function ghExec<T>(args: string[]): Promise<T> {
  const command = `gh ${args.join(" ")}`;

  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: TIMEOUT_MS,
      encoding: "utf-8",
    });

    if (stderr && stderr.includes("not logged in")) {
      throw new GhAuthError();
    }

    return JSON.parse(stdout) as T;
  } catch (error: unknown) {
    if (error instanceof GhError) {
      throw error;
    }

    const execError = error as {
      code?: string | number;
      stderr?: string;
      message?: string;
    };

    if (execError.code === "ENOENT") {
      throw new GhNotInstalledError();
    }

    const stderr = execError.stderr ?? execError.message ?? "";

    if (stderr.includes("not logged in") || stderr.includes("auth login")) {
      throw new GhAuthError();
    }

    if (
      stderr.includes("Could not resolve") ||
      stderr.includes("not found") ||
      stderr.includes("404")
    ) {
      throw new GhNotFoundError(stderr);
    }

    throw new GhError(`gh command failed: ${stderr}`, stderr);
  }
}

/**
 * Execute a gh CLI command without JSON output
 */
async function ghExecRaw(args: string[]): Promise<string> {
  const command = `gh ${args.join(" ")}`;

  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: TIMEOUT_MS,
      encoding: "utf-8",
    });

    if (stderr && stderr.includes("not logged in")) {
      throw new GhAuthError();
    }

    return stdout;
  } catch (error: unknown) {
    if (error instanceof GhError) {
      throw error;
    }

    const execError = error as {
      code?: string | number;
      stderr?: string;
      message?: string;
    };

    if (execError.code === "ENOENT") {
      throw new GhNotInstalledError();
    }

    const stderr = execError.stderr ?? execError.message ?? "";

    if (stderr.includes("not logged in") || stderr.includes("auth login")) {
      throw new GhAuthError();
    }

    if (
      stderr.includes("Could not resolve") ||
      stderr.includes("not found") ||
      stderr.includes("404")
    ) {
      throw new GhNotFoundError(stderr);
    }

    throw new GhError(`gh command failed: ${stderr}`, stderr);
  }
}

/**
 * Get PR information
 */
export async function getPrInfo(
  owner: string,
  repo: string,
  prNumber: number
): Promise<PrInfo> {
  const fields = [
    "number",
    "title",
    "state",
    "isDraft",
    "mergeable",
    "mergeStateStatus",
    "reviewDecision",
    "baseRefName",
    "headRefName",
    "headRefOid",
  ].join(",");

  return ghExec<PrInfo>([
    "pr",
    "view",
    prNumber.toString(),
    "--repo",
    `${owner}/${repo}`,
    "--json",
    fields,
  ]);
}

/**
 * Get PR checks (check runs and status checks)
 */
export async function getPrChecks(
  owner: string,
  repo: string,
  prNumber: number
): Promise<{ checks: CheckRun[]; statuses: StatusCheck[] }> {
  interface ChecksResponse {
    statusCheckRollup: Array<{
      __typename: string;
      name?: string;
      context?: string;
      status?: string;
      state?: string;
      conclusion?: string;
      detailsUrl?: string;
      targetUrl?: string;
    }>;
  }

  const response = await ghExec<ChecksResponse>([
    "pr",
    "view",
    prNumber.toString(),
    "--repo",
    `${owner}/${repo}`,
    "--json",
    "statusCheckRollup",
  ]);

  const checks: CheckRun[] = [];
  const statuses: StatusCheck[] = [];

  for (const item of response.statusCheckRollup ?? []) {
    if (item.__typename === "CheckRun") {
      checks.push({
        name: item.name ?? "unknown",
        status: (item.status as CheckRun["status"]) ?? "PENDING",
        conclusion: (item.conclusion as CheckRun["conclusion"]) ?? null,
        detailsUrl: item.detailsUrl,
      });
    } else if (item.__typename === "StatusContext") {
      statuses.push({
        context: item.context ?? "unknown",
        state: (item.state as StatusCheck["state"]) ?? "PENDING",
        targetUrl: item.targetUrl,
      });
    }
  }

  return { checks, statuses };
}

/**
 * Merge a PR
 */
export async function mergePr(
  owner: string,
  repo: string,
  prNumber: number,
  method: MergeMethod = "rebase"
): Promise<MergeResponse> {
  const methodFlag =
    method === "rebase" ? "--rebase" : method === "squash" ? "--squash" : "";

  try {
    await ghExecRaw([
      "pr",
      "merge",
      prNumber.toString(),
      "--repo",
      `${owner}/${repo}`,
      methodFlag,
    ].filter(Boolean));

    const prInfo = await getPrInfo(owner, repo, prNumber);

    return {
      sha: prInfo.headRefOid,
      merged: prInfo.state === "MERGED",
    };
  } catch (error: unknown) {
    if (error instanceof GhError) {
      throw new GhMergeError(error.message);
    }
    throw error;
  }
}
