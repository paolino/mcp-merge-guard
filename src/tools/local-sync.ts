import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const COMMAND_TIMEOUT_MS = 30000;

interface WorktreeInfo {
  path: string;
  branch?: string;
}

function buildGithubRemoteUrl(owner: string, repo: string): string {
  return `https://github.com/${owner}/${repo}.git`;
}

function buildGithubAuthHeader(token: string): string {
  const credentials = Buffer.from(`x-access-token:${token.trim()}`).toString(
    "base64",
  );
  return `AUTHORIZATION: basic ${credentials}`;
}

async function execGit(
  repoPath: string,
  args: string[],
  extraArgs: string[] = [],
): Promise<string> {
  const { stdout } = await execFileAsync(
    "git",
    ["-C", repoPath, ...extraArgs, ...args],
    {
      timeout: COMMAND_TIMEOUT_MS,
      encoding: "utf-8",
    },
  );

  return stdout;
}

async function getGhToken(): Promise<string> {
  const { stdout } = await execFileAsync("gh", ["auth", "token"], {
    timeout: COMMAND_TIMEOUT_MS,
    encoding: "utf-8",
  });

  return stdout.trim();
}

function parseWorktrees(output: string): WorktreeInfo[] {
  const worktrees: WorktreeInfo[] = [];
  let current: Partial<WorktreeInfo> = {};

  for (const line of output.split("\n")) {
    if (line.startsWith("worktree ")) {
      if (current.path) {
        worktrees.push(current as WorktreeInfo);
      }
      current = { path: line.slice("worktree ".length) };
      continue;
    }

    if (line.startsWith("branch ")) {
      current.branch = line.slice("branch ".length);
      continue;
    }

    if (line === "" && current.path) {
      worktrees.push(current as WorktreeInfo);
      current = {};
    }
  }

  if (current.path) {
    worktrees.push(current as WorktreeInfo);
  }

  return worktrees;
}

async function listWorktrees(repoPath: string): Promise<WorktreeInfo[]> {
  const output = await execGit(repoPath, ["worktree", "list", "--porcelain"]);
  return parseWorktrees(output);
}

function findBaseBranchWorktree(
  worktrees: WorktreeInfo[],
  baseBranch: string,
  preferredPath: string,
): WorktreeInfo | undefined {
  const branchRef = `refs/heads/${baseBranch}`;
  return (
    worktrees.find(
      (worktree) =>
        worktree.path === preferredPath && worktree.branch === branchRef,
    ) ?? worktrees.find((worktree) => worktree.branch === branchRef)
  );
}

async function fetchBaseBranch(
  repoPath: string,
  owner: string,
  repo: string,
  baseBranch: string,
): Promise<void> {
  const token = await getGhToken();
  const remoteUrl = buildGithubRemoteUrl(owner, repo);
  const authHeader = buildGithubAuthHeader(token);

  await execGit(
    repoPath,
    [
      "fetch",
      "--prune",
      remoteUrl,
      `+refs/heads/${baseBranch}:refs/remotes/origin/${baseBranch}`,
    ],
    ["-c", `http.extraHeader=${authHeader}`],
  );
}

async function fastForwardCheckedOutBaseBranch(
  worktreePath: string,
  baseBranch: string,
): Promise<void> {
  await execGit(worktreePath, [
    "merge",
    "--ff-only",
    `refs/remotes/origin/${baseBranch}`,
  ]);
}

async function updateLocalBaseBranchRef(
  repoPath: string,
  baseBranch: string,
): Promise<void> {
  await execGit(repoPath, [
    "branch",
    "--force",
    baseBranch,
    `refs/remotes/origin/${baseBranch}`,
  ]);
}

export async function syncLocalBaseBranch(
  repoPath: string,
  owner: string,
  repo: string,
  baseBranch: string,
): Promise<string> {
  try {
    await fetchBaseBranch(repoPath, owner, repo, baseBranch);

    const worktrees = await listWorktrees(repoPath);
    const baseBranchWorktree = findBaseBranchWorktree(
      worktrees,
      baseBranch,
      repoPath,
    );

    if (baseBranchWorktree) {
      await fastForwardCheckedOutBaseBranch(
        baseBranchWorktree.path,
        baseBranch,
      );
      return `Local ${baseBranch} updated at ${baseBranchWorktree.path}`;
    }

    await updateLocalBaseBranchRef(repoPath, baseBranch);
    return `Local ${baseBranch} ref updated`;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return `Local update failed: ${msg}`;
  }
}
