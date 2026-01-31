import { describe, it, expect } from "vitest";
import { checkConflicts } from "../../src/guards/conflicts.js";
import type { PrInfo } from "../../src/gh/types.js";

const basePrInfo: PrInfo = {
  number: 1,
  title: "Test PR",
  state: "OPEN",
  isDraft: false,
  mergeable: "MERGEABLE",
  mergeStateStatus: "CLEAN",
  reviewDecision: "APPROVED",
  baseRefName: "main",
  headRefName: "feature",
  headRefOid: "abc123",
};

describe("checkConflicts", () => {
  it("passes when PR is mergeable", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeable: "MERGEABLE" };

    const result = checkConflicts(prInfo);

    expect(result.passed).toBe(true);
    expect(result.message).toBe("No merge conflicts");
  });

  it("fails when PR has conflicts", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeable: "CONFLICTING" };

    const result = checkConflicts(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("merge conflicts");
  });

  it("fails when mergeable status is unknown", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeable: "UNKNOWN" };

    const result = checkConflicts(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("being calculated");
  });
});
