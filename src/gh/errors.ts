/**
 * Base error for gh CLI operations
 */
export class GhError extends Error {
  constructor(
    message: string,
    public readonly stderr?: string
  ) {
    super(message);
    this.name = "GhError";
  }
}

/**
 * gh CLI is not installed or not in PATH
 */
export class GhNotInstalledError extends GhError {
  constructor() {
    super(
      "gh CLI is not installed or not in PATH. Install from https://cli.github.com/"
    );
    this.name = "GhNotInstalledError";
  }
}

/**
 * gh CLI is not authenticated
 */
export class GhAuthError extends GhError {
  constructor() {
    super('gh CLI is not authenticated. Run "gh auth login" to authenticate.');
    this.name = "GhAuthError";
  }
}

/**
 * PR or repository not found
 */
export class GhNotFoundError extends GhError {
  constructor(resource: string) {
    super(`Not found: ${resource}`);
    this.name = "GhNotFoundError";
  }
}

/**
 * Merge failed
 */
export class GhMergeError extends GhError {
  constructor(reason: string) {
    super(`Merge failed: ${reason}`);
    this.name = "GhMergeError";
  }
}
