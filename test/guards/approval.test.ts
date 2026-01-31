import { describe, it, expect } from "vitest";
import { checkApproval } from "../../src/guards/approval.js";
import type { PrInfo } from "../../src/gh/types.js";

const basePrInfo: PrInfo = {
  number: 1,
  title: "Test PR",
  state: "OPEN",
  isDraft: false,
  mergeable: "MERGEABLE",
  mergeStateStatus: "CLEAN",
  reviewDecision: null,
  baseRefName: "main",
  headRefName: "feature",
  headRefOid: "abc123",
};

describe("checkApproval", () => {
  it("passes when PR is approved", () => {
    const prInfo: PrInfo = { ...basePrInfo, reviewDecision: "APPROVED" };

    const result = checkApproval(prInfo);

    expect(result.passed).toBe(true);
    expect(result.message).toBe("PR is approved");
  });

  it("passes when no review is required", () => {
    const prInfo: PrInfo = { ...basePrInfo, reviewDecision: null };

    const result = checkApproval(prInfo);

    expect(result.passed).toBe(true);
    expect(result.message).toBe("No review required");
  });

  it("fails when changes are requested", () => {
    const prInfo: PrInfo = {
      ...basePrInfo,
      reviewDecision: "CHANGES_REQUESTED",
    };

    const result = checkApproval(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toBe("Changes have been requested");
  });

  it("fails when review is required but not provided", () => {
    const prInfo: PrInfo = { ...basePrInfo, reviewDecision: "REVIEW_REQUIRED" };

    const result = checkApproval(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toBe("Review is required but not yet provided");
  });
});
