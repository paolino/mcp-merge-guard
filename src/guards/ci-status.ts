import type { GuardResult } from "../types.js";
import type { CheckRun, StatusCheck } from "../gh/types.js";

/**
 * Check that all CI checks have passed
 */
export function checkCiStatus(
  checks: CheckRun[],
  statuses: StatusCheck[]
): GuardResult {
  const failedChecks: string[] = [];
  const pendingChecks: string[] = [];

  for (const check of checks) {
    if (check.status !== "COMPLETED") {
      pendingChecks.push(check.name);
    } else if (
      check.conclusion !== "SUCCESS" &&
      check.conclusion !== "SKIPPED" &&
      check.conclusion !== "NEUTRAL"
    ) {
      failedChecks.push(`${check.name} (${check.conclusion ?? "unknown"})`);
    }
  }

  for (const status of statuses) {
    if (status.state === "PENDING") {
      pendingChecks.push(status.context);
    } else if (status.state !== "SUCCESS") {
      failedChecks.push(`${status.context} (${status.state})`);
    }
  }

  const totalChecks = checks.length + statuses.length;

  if (totalChecks === 0) {
    return {
      name: "ci-status",
      passed: true,
      message: "No CI checks configured",
      details: { totalChecks: 0 },
    };
  }

  if (failedChecks.length > 0) {
    return {
      name: "ci-status",
      passed: false,
      message: `${failedChecks.length} check(s) failed: ${failedChecks.join(", ")}`,
      details: {
        totalChecks,
        failedChecks,
        pendingChecks,
      },
    };
  }

  if (pendingChecks.length > 0) {
    return {
      name: "ci-status",
      passed: false,
      message: `${pendingChecks.length} check(s) pending: ${pendingChecks.join(", ")}`,
      details: {
        totalChecks,
        failedChecks,
        pendingChecks,
      },
    };
  }

  return {
    name: "ci-status",
    passed: true,
    message: `All ${totalChecks} check(s) passed`,
    details: {
      totalChecks,
      failedChecks: [],
      pendingChecks: [],
    },
  };
}
