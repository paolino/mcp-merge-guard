import type { GuardResult, MergeMethod } from "../types.js";
import type { RepoMergeSettings } from "../gh/client.js";

const methodToSetting: Record<MergeMethod, keyof RepoMergeSettings> = {
  merge: "allowMergeCommit",
  squash: "allowSquashMerge",
  rebase: "allowRebaseMerge",
};

/**
 * Check that the requested merge method is allowed by repo settings
 */
export function checkMergeMethod(
  method: MergeMethod,
  settings: RepoMergeSettings
): GuardResult {
  const settingKey = methodToSetting[method];
  const allowed = settings[settingKey];

  if (allowed) {
    return {
      name: "merge-method",
      passed: true,
      message: `Merge method "${method}" is allowed by repo settings`,
      details: { method, ...settings },
    };
  }

  const allowedMethods = (Object.keys(methodToSetting) as MergeMethod[]).filter(
    (m) => settings[methodToSetting[m]]
  );

  return {
    name: "merge-method",
    passed: false,
    message: `Merge method "${method}" is not allowed by repo settings. Allowed: ${allowedMethods.join(", ")}`,
    details: { method, allowedMethods, ...settings },
  };
}
