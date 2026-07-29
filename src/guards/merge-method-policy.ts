import type { GuardResult, MergeMethod } from "../types.js";

/**
 * Check that the merge method does not silently strip signatures.
 * Rebase recreates branch commits unsigned on the base branch;
 * it is refused unless the caller explicitly opts in.
 */
export function checkMergeMethodPolicy(
  method: MergeMethod,
  allowSignatureStripping: boolean,
): GuardResult {
  if (method === "merge") {
    return {
      name: "merge-method-policy",
      passed: true,
      message: `Merge method "merge" preserves signed branch commits`,
      details: { method, allowSignatureStripping },
    };
  }

  if (method === "squash") {
    return {
      name: "merge-method-policy",
      passed: true,
      message: `Merge method "squash" collapses into a single web-flow-signed commit`,
      details: { method, allowSignatureStripping },
    };
  }

  if (allowSignatureStripping) {
    return {
      name: "merge-method-policy",
      passed: true,
      message:
        "Rebase allowed via explicit allowSignatureStripping override; branch commits will be recreated unsigned",
      details: { method, allowSignatureStripping },
    };
  }

  return {
    name: "merge-method-policy",
    passed: false,
    message:
      "Rebase recreates branch commits unsigned on the base branch. " +
      "Pass allowSignatureStripping: true to override this guard.",
    details: { method, allowSignatureStripping },
  };
}
