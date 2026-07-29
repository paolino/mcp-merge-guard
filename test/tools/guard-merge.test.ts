import { beforeEach, describe, expect, it, vi } from "vitest";
import { guardMergeSchema } from "../../src/tools/guard-merge.js";

const {
  getPrInfoMock,
  getPrChecksMock,
  getRepoMergeSettingsMock,
  mergePrMock,
} = vi.hoisted(() => ({
  getPrInfoMock: vi.fn(),
  getPrChecksMock: vi.fn(),
  getRepoMergeSettingsMock: vi.fn(),
  mergePrMock: vi.fn(),
}));

vi.mock("../../src/gh/client.js", () => ({
  getPrInfo: getPrInfoMock,
  getPrChecks: getPrChecksMock,
  getRepoMergeSettings: getRepoMergeSettingsMock,
  mergePr: mergePrMock,
}));

const greenPrInfo = {
  number: 42,
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

const allChecksPassing = {
  checks: [
    { name: "test", status: "COMPLETED", conclusion: "SUCCESS" },
  ],
  statuses: [],
};

const allMethodsAllowed = {
  allowMergeCommit: true,
  allowSquashMerge: true,
  allowRebaseMerge: true,
};

describe("guardMergeSchema defaults", () => {
  it("defaults mergeMethod to merge on minimal input", () => {
    const parsed = guardMergeSchema.parse({
      owner: "paolino",
      repo: "demo",
      prNumber: 42,
    });

    expect(parsed.mergeMethod).toBe("merge");
  });

  it("defaults allowSignatureStripping to false on minimal input", () => {
    const parsed = guardMergeSchema.parse({
      owner: "paolino",
      repo: "demo",
      prNumber: 42,
    });

    expect(parsed.allowSignatureStripping).toBe(false);
  });

  it("preserves explicit mergeMethod and allowSignatureStripping", () => {
    const parsed = guardMergeSchema.parse({
      owner: "paolino",
      repo: "demo",
      prNumber: 42,
      mergeMethod: "rebase",
      allowSignatureStripping: true,
    });

    expect(parsed.mergeMethod).toBe("rebase");
    expect(parsed.allowSignatureStripping).toBe(true);
  });
});

describe("guardMerge merge-method-policy wiring", () => {
  beforeEach(() => {
    getPrInfoMock.mockReset();
    getPrChecksMock.mockReset();
    getRepoMergeSettingsMock.mockReset();
    mergePrMock.mockReset();

    getPrInfoMock.mockResolvedValue(greenPrInfo);
    getPrChecksMock.mockResolvedValue(allChecksPassing);
    getRepoMergeSettingsMock.mockResolvedValue(allMethodsAllowed);
    mergePrMock.mockResolvedValue({ sha: "abc123", merged: true });
  });

  it("refuses rebase without allowSignatureStripping", async () => {
    const { guardMerge } = await import("../../src/tools/guard-merge.js");

    const result = await guardMerge({
      owner: "paolino",
      repo: "demo",
      prNumber: 42,
      requireUpToDate: false,
      mergeMethod: "rebase",
      allowSignatureStripping: false,
    });

    expect(result.merged).toBe(false);
    expect(result.error).toContain("merge-method-policy");
    expect(result.report.allPassed).toBe(false);

    const policyGuard = result.report.guards.find(
      (g) => g.name === "merge-method-policy",
    );
    expect(policyGuard).toBeDefined();
    expect(policyGuard!.passed).toBe(false);

    expect(mergePrMock).not.toHaveBeenCalled();
  });

  it("allows rebase with allowSignatureStripping", async () => {
    const { guardMerge } = await import("../../src/tools/guard-merge.js");

    const result = await guardMerge({
      owner: "paolino",
      repo: "demo",
      prNumber: 42,
      requireUpToDate: false,
      mergeMethod: "rebase",
      allowSignatureStripping: true,
    });

    expect(result.report.allPassed).toBe(true);

    const policyGuard = result.report.guards.find(
      (g) => g.name === "merge-method-policy",
    );
    expect(policyGuard).toBeDefined();
    expect(policyGuard!.passed).toBe(true);

    expect(mergePrMock).toHaveBeenCalledTimes(1);
    expect(mergePrMock).toHaveBeenCalledWith(
      "paolino",
      "demo",
      42,
      "rebase",
    );
  });
});
