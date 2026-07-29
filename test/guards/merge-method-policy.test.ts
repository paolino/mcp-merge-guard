import { describe, it, expect } from "vitest";
import { checkMergeMethodPolicy } from "../../src/guards/merge-method-policy.js";

describe("checkMergeMethodPolicy", () => {
  it("passes for merge without allowSignatureStripping", () => {
    const result = checkMergeMethodPolicy("merge", false);

    expect(result.passed).toBe(true);
    expect(result.name).toBe("merge-method-policy");
  });

  it("passes for merge with allowSignatureStripping", () => {
    const result = checkMergeMethodPolicy("merge", true);

    expect(result.passed).toBe(true);
  });

  it("passes for squash without allowSignatureStripping", () => {
    const result = checkMergeMethodPolicy("squash", false);

    expect(result.passed).toBe(true);
  });

  it("passes for squash with allowSignatureStripping", () => {
    const result = checkMergeMethodPolicy("squash", true);

    expect(result.passed).toBe(true);
  });

  it("fails for rebase without allowSignatureStripping", () => {
    const result = checkMergeMethodPolicy("rebase", false);

    expect(result.passed).toBe(false);
    expect(result.name).toBe("merge-method-policy");
    expect(result.message).toMatch(/unsign/i);
    expect(result.message).toContain("allowSignatureStripping");
  });

  it("passes for rebase with allowSignatureStripping", () => {
    const result = checkMergeMethodPolicy("rebase", true);

    expect(result.passed).toBe(true);
  });
});
