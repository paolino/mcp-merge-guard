import { describe, it, expect } from "vitest";
import { checkUpToDate } from "../../src/guards/up-to-date.js";
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

describe("checkUpToDate", () => {
  it("passes when branch is clean", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeStateStatus: "CLEAN" };

    const result = checkUpToDate(prInfo);

    expect(result.passed).toBe(true);
    expect(result.message).toContain("up to date");
  });

  it("passes when branch has hooks", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeStateStatus: "HAS_HOOKS" };

    const result = checkUpToDate(prInfo);

    expect(result.passed).toBe(true);
  });

  it("passes when branch is unstable (CI failing but up to date)", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeStateStatus: "UNSTABLE" };

    const result = checkUpToDate(prInfo);

    expect(result.passed).toBe(true);
  });

  it("fails when branch is behind", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeStateStatus: "BEHIND" };

    const result = checkUpToDate(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("behind");
    expect(result.message).toContain("feature");
    expect(result.message).toContain("main");
  });

  it("fails when merge is blocked", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeStateStatus: "BLOCKED" };

    const result = checkUpToDate(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("blocked");
  });

  it("fails when branch is dirty", () => {
    const prInfo: PrInfo = { ...basePrInfo, mergeStateStatus: "DIRTY" };

    const result = checkUpToDate(prInfo);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("dirty");
  });
});
