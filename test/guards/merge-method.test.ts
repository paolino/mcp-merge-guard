import { describe, it, expect } from "vitest";
import { checkMergeMethod } from "../../src/guards/merge-method.js";
import type { RepoMergeSettings } from "../../src/gh/client.js";

const allAllowed: RepoMergeSettings = {
  allowMergeCommit: true,
  allowSquashMerge: true,
  allowRebaseMerge: true,
};

const rebaseOnly: RepoMergeSettings = {
  allowMergeCommit: false,
  allowSquashMerge: false,
  allowRebaseMerge: true,
};

describe("checkMergeMethod", () => {
  it("passes when requested method is allowed", () => {
    const result = checkMergeMethod("rebase", allAllowed);

    expect(result.passed).toBe(true);
    expect(result.name).toBe("merge-method");
  });

  it("passes for rebase on rebase-only repo", () => {
    const result = checkMergeMethod("rebase", rebaseOnly);

    expect(result.passed).toBe(true);
  });

  it("fails for squash on rebase-only repo", () => {
    const result = checkMergeMethod("squash", rebaseOnly);

    expect(result.passed).toBe(false);
    expect(result.message).toContain('"squash" is not allowed');
    expect(result.message).toContain("rebase");
  });

  it("fails for merge on rebase-only repo", () => {
    const result = checkMergeMethod("merge", rebaseOnly);

    expect(result.passed).toBe(false);
    expect(result.message).toContain('"merge" is not allowed');
  });

  it("lists allowed methods in error message", () => {
    const settings: RepoMergeSettings = {
      allowMergeCommit: true,
      allowSquashMerge: false,
      allowRebaseMerge: true,
    };

    const result = checkMergeMethod("squash", settings);

    expect(result.passed).toBe(false);
    expect(result.message).toContain("merge, rebase");
  });
});
