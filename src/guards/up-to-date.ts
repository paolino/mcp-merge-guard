import type { GuardResult } from "../types.js";
import type { PrInfo } from "../gh/types.js";

/**
 * Check that PR branch is up to date with base branch
 */
export function checkUpToDate(prInfo: PrInfo): GuardResult {
  const { mergeStateStatus, baseRefName, headRefName } = prInfo;

  if (mergeStateStatus === "BEHIND") {
    return {
      name: "up-to-date",
      passed: false,
      message: `Branch '${headRefName}' is behind '${baseRefName}' and needs to be updated`,
      details: {
        mergeStateStatus,
        baseRefName,
        headRefName,
      },
    };
  }

  if (
    mergeStateStatus === "CLEAN" ||
    mergeStateStatus === "HAS_HOOKS" ||
    mergeStateStatus === "UNSTABLE"
  ) {
    return {
      name: "up-to-date",
      passed: true,
      message: `Branch '${headRefName}' is up to date with '${baseRefName}'`,
      details: {
        mergeStateStatus,
        baseRefName,
        headRefName,
      },
    };
  }

  if (mergeStateStatus === "BLOCKED") {
    return {
      name: "up-to-date",
      passed: false,
      message: "Merge is blocked by branch protection rules",
      details: {
        mergeStateStatus,
        baseRefName,
        headRefName,
      },
    };
  }

  if (mergeStateStatus === "DIRTY") {
    return {
      name: "up-to-date",
      passed: false,
      message: "Merge state is dirty (conflicts or other issues)",
      details: {
        mergeStateStatus,
        baseRefName,
        headRefName,
      },
    };
  }

  return {
    name: "up-to-date",
    passed: true,
    message: `Branch status: ${mergeStateStatus}`,
    details: {
      mergeStateStatus,
      baseRefName,
      headRefName,
    },
  };
}
