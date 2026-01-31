/**
 * GitHub PR information from gh CLI
 */
export interface PrInfo {
  number: number;
  title: string;
  state: "OPEN" | "CLOSED" | "MERGED";
  isDraft: boolean;
  mergeable: "MERGEABLE" | "CONFLICTING" | "UNKNOWN";
  mergeStateStatus:
    | "BEHIND"
    | "BLOCKED"
    | "CLEAN"
    | "DIRTY"
    | "HAS_HOOKS"
    | "UNKNOWN"
    | "UNSTABLE";
  reviewDecision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;
  baseRefName: string;
  headRefName: string;
  headRefOid: string;
}

/**
 * GitHub check run status
 */
export interface CheckRun {
  name: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "QUEUED" | "WAITING";
  conclusion:
    | "SUCCESS"
    | "FAILURE"
    | "CANCELLED"
    | "SKIPPED"
    | "TIMED_OUT"
    | "ACTION_REQUIRED"
    | "NEUTRAL"
    | "STALE"
    | null;
  detailsUrl?: string;
}

/**
 * GitHub status check
 */
export interface StatusCheck {
  context: string;
  state: "SUCCESS" | "FAILURE" | "PENDING" | "ERROR";
  targetUrl?: string;
}

/**
 * Combined checks response from gh CLI
 */
export interface PrChecks {
  checks: CheckRun[];
  statuses: StatusCheck[];
}

/**
 * Merge response from gh CLI
 */
export interface MergeResponse {
  sha: string;
  merged: boolean;
  message?: string;
}
