import type { GuardResult } from "../types.js";
import type { PrInfo } from "../gh/types.js";

/**
 * Check that PR has required approvals
 */
export function checkApproval(prInfo: PrInfo): GuardResult {
  const { reviewDecision } = prInfo;

  if (reviewDecision === "APPROVED") {
    return {
      name: "approval",
      passed: true,
      message: "PR is approved",
      details: { reviewDecision },
    };
  }

  if (reviewDecision === null || reviewDecision === "") {
    return {
      name: "approval",
      passed: true,
      message: "No review required",
      details: { reviewDecision: reviewDecision || null },
    };
  }

  if (reviewDecision === "CHANGES_REQUESTED") {
    return {
      name: "approval",
      passed: false,
      message: "Changes have been requested",
      details: { reviewDecision },
    };
  }

  if (reviewDecision === "REVIEW_REQUIRED") {
    return {
      name: "approval",
      passed: false,
      message: "Review is required but not yet provided",
      details: { reviewDecision },
    };
  }

  return {
    name: "approval",
    passed: false,
    message: `Unknown review decision: ${reviewDecision}`,
    details: { reviewDecision },
  };
}
