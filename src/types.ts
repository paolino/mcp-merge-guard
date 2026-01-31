/**
 * Result of a single guard check
 */
export interface GuardResult {
  name: string;
  passed: boolean;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Report containing results of all guards
 */
export interface GuardsReport {
  allPassed: boolean;
  guards: GuardResult[];
  timestamp: string;
}

/**
 * Status response for check-merge-ready tool
 */
export interface MergeReadyStatus {
  owner: string;
  repo: string;
  prNumber: number;
  ready: boolean;
  report: GuardsReport;
}

/**
 * Result of guard-merge tool
 */
export interface MergeResult {
  owner: string;
  repo: string;
  prNumber: number;
  merged: boolean;
  sha?: string;
  error?: string;
  report: GuardsReport;
}

/**
 * Options for running guards
 */
export interface GuardOptions {
  requireUpToDate?: boolean;
}

/**
 * Merge method for GitHub PR
 */
export type MergeMethod = "merge" | "squash" | "rebase";
