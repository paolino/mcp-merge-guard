# Plan — merge-commit default + rebase override guard

Single slice, one bisect-safe commit (vertical: impl + tests + docs),
implemented by a driver+navigator pair. TDD: RED = new tests fail against
the current default/absent guard; GREEN = implementation.

## Slice 1 — flip default, add policy guard, docs

Owned files:

- `src/tools/guard-merge.ts` — schema: `mergeMethod` default `"merge"`,
  description restated per policy; new field `allowSignatureStripping`
  (boolean, optional, default false) with a description naming what it
  overrides; `guardMerge` destructures the flag and pushes the policy-guard
  result into the report (same pattern as the existing `checkMergeMethod`
  push; policy guard pushed first so the policy failure is visible even when
  repo settings also reject).
- `src/guards/merge-method-policy.ts` — NEW sibling module:
  `checkMergeMethodPolicy(method: MergeMethod, allowSignatureStripping:
  boolean): GuardResult`, guard name `"merge-method-policy"`. rebase without
  flag → `passed: false`, message naming unsigned-recreation and the
  override flag; rebase with flag → passes, message says explicit override;
  merge/squash → pass.
- `src/guards/index.ts` — re-export the new module (existing convention).
- `test/guards/merge-method-policy.test.ts` — NEW: merge passes, squash
  passes, rebase w/o flag fails (message mentions signature/override),
  rebase with flag passes.
- `test/tools/guard-merge.test.ts` — NEW: `guardMergeSchema.parse` on
  minimal input yields `mergeMethod === "merge"` and
  `allowSignatureStripping === false`.
- `docs/tools.md` — parameter table: `mergeMethod` default `"merge"`;
  add `allowSignatureStripping` row.
- `docs/configuration.md` — merge-methods section: `merge` is the default
  (preserves signed branch commits); `squash` where collapse is intended
  (web-flow-signed); `rebase` forbidden without `allowSignatureStripping`
  (recreates commits unsigned). Drop the "maintains linear history"
  rationale.
- `README.md` — Features/Guards sections: mention the merge-method-policy
  guard and the merge default.

Forbidden: `package.json` / `package-lock.json` / `flake.*` (no dep
changes), `.github/`, `src/gh/`, other guards, `src/tools/check-merge-ready.ts`,
`src/tools/local-sync.ts`.

Commit subject: `feat!: default mergeMethod to merge and gate rebase behind allowSignatureStripping`
Commit body: why (audit numbers) + `BREAKING CHANGE:` footer +
`Tasks: T201, T202, T203`
