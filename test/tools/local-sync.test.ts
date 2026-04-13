import { beforeEach, describe, expect, it, vi } from "vitest";

const execFileMock = vi.fn();

vi.mock("node:child_process", () => ({
  execFile: execFileMock,
}));

function queueExecFileResult(stdout: string, stderr = ""): void {
  execFileMock.mockImplementationOnce(
    (
      _file: string,
      _args: string[],
      _options: Record<string, unknown>,
      callback: (
        error: Error | null,
        result: { stdout: string; stderr: string },
      ) => void,
    ) => {
      callback(null, { stdout, stderr });
    },
  );
}

describe("syncLocalBaseBranch", () => {
  beforeEach(() => {
    execFileMock.mockReset();
  });

  it("fast-forwards the checked out base branch worktree over HTTPS", async () => {
    queueExecFileResult("gh-token\n");
    queueExecFileResult("");
    queueExecFileResult(
      ["worktree /repo", "HEAD abcdef", "branch refs/heads/main", ""].join(
        "\n",
      ),
    );
    queueExecFileResult("");

    const { syncLocalBaseBranch } =
      await import("../../src/tools/local-sync.js");
    const result = await syncLocalBaseBranch(
      "/repo",
      "paolino",
      "demo",
      "main",
    );

    expect(result).toBe("Local main updated at /repo");
    expect(execFileMock).toHaveBeenCalledTimes(4);

    const fetchArgs = execFileMock.mock.calls[1]?.[1] as string[];
    expect(fetchArgs).toContain("fetch");
    expect(fetchArgs).toContain("https://github.com/paolino/demo.git");
    expect(fetchArgs).not.toContain("origin");

    const fetchConfigArgs = fetchArgs.slice(0, 4);
    expect(fetchConfigArgs[0]).toBe("-C");
    expect(fetchConfigArgs[2]).toBe("-c");
    expect(fetchConfigArgs[3]).toContain(
      "http.extraHeader=AUTHORIZATION: basic ",
    );

    const mergeArgs = execFileMock.mock.calls[3]?.[1] as string[];
    expect(mergeArgs).toContain("merge");
    expect(mergeArgs).toContain("--ff-only");
    expect(mergeArgs).not.toContain("rebase");
  });

  it("updates the local base branch ref when the branch is not checked out", async () => {
    queueExecFileResult("gh-token\n");
    queueExecFileResult("");
    queueExecFileResult(
      [
        "worktree /repo-feature",
        "HEAD abcdef",
        "branch refs/heads/feature/test",
        "",
      ].join("\n"),
    );
    queueExecFileResult("");

    const { syncLocalBaseBranch } =
      await import("../../src/tools/local-sync.js");
    const result = await syncLocalBaseBranch(
      "/repo-feature",
      "paolino",
      "demo",
      "main",
    );

    expect(result).toBe("Local main ref updated");

    const branchArgs = execFileMock.mock.calls[3]?.[1] as string[];
    expect(branchArgs).toContain("branch");
    expect(branchArgs).toContain("--force");
    expect(branchArgs).toContain("main");
    expect(branchArgs).toContain("refs/remotes/origin/main");
  });

  it("reports sync failures instead of throwing", async () => {
    execFileMock.mockImplementationOnce(
      (
        _file: string,
        _args: string[],
        _options: Record<string, unknown>,
        callback: (
          error: Error | null,
          result: { stdout: string; stderr: string },
        ) => void,
      ) => {
        callback(new Error("boom"), { stdout: "", stderr: "boom" });
      },
    );

    const { syncLocalBaseBranch } =
      await import("../../src/tools/local-sync.js");
    const result = await syncLocalBaseBranch(
      "/repo",
      "paolino",
      "demo",
      "main",
    );

    expect(result).toContain("Local update failed:");
    expect(result).toContain("boom");
  });
});
