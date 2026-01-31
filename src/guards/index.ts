import type { GuardsReport, GuardOptions } from "../types.js";
import type { PrInfo, CheckRun, StatusCheck } from "../gh/types.js";
import { checkCiStatus } from "./ci-status.js";
import { checkApproval } from "./approval.js";
import { checkConflicts } from "./conflicts.js";
import { checkUpToDate } from "./up-to-date.js";

export { checkCiStatus } from "./ci-status.js";
export { checkApproval } from "./approval.js";
export { checkConflicts } from "./conflicts.js";
export { checkUpToDate } from "./up-to-date.js";

interface RunGuardsInput {
  prInfo: PrInfo;
  checks: CheckRun[];
  statuses: StatusCheck[];
  options?: GuardOptions;
}

/**
 * Run all guards and return a consolidated report
 */
export function runGuards(input: RunGuardsInput): GuardsReport {
  const { prInfo, checks, statuses, options = {} } = input;
  const { requireUpToDate = false } = options;

  const guards = [
    checkCiStatus(checks, statuses),
    checkApproval(prInfo),
    checkConflicts(prInfo),
  ];

  if (requireUpToDate) {
    guards.push(checkUpToDate(prInfo));
  }

  const allPassed = guards.every((g) => g.passed);

  return {
    allPassed,
    guards,
    timestamp: new Date().toISOString(),
  };
}
