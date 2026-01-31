import type { GuardResult } from "../types.js";
import type { PrInfo } from "../gh/types.js";

/**
 * Check that PR has no merge conflicts
 */
export function checkConflicts(prInfo: PrInfo): GuardResult {
  const { mergeable } = prInfo;

  if (mergeable === "MERGEABLE") {
    return {
      name: "conflicts",
      passed: true,
      message: "No merge conflicts",
      details: { mergeable },
    };
  }

  if (mergeable === "CONFLICTING") {
    return {
      name: "conflicts",
      passed: false,
      message: "PR has merge conflicts that must be resolved",
      details: { mergeable },
    };
  }

  if (mergeable === "UNKNOWN") {
    return {
      name: "conflicts",
      passed: false,
      message: "Merge status is being calculated, try again shortly",
      details: { mergeable },
    };
  }

  return {
    name: "conflicts",
    passed: false,
    message: `Unknown mergeable status: ${mergeable}`,
    details: { mergeable },
  };
}
