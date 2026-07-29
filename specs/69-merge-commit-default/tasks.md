# Tasks — merge-commit default + rebase override guard

## Slice 1 — flip default, add policy guard, docs

- [X] T201 `mergeMethod` default `rebase` → `merge` + schema description;
  new `allowSignatureStripping` flag; policy guard module
  `src/guards/merge-method-policy.ts` wired into `guardMerge` and
  re-exported from `src/guards/index.ts`
- [X] T202 tests: `test/guards/merge-method-policy.test.ts` (4 cases) +
  `test/tools/guard-merge.test.ts` (schema defaults); RED observed first
- [X] T203 docs: `docs/tools.md` table, `docs/configuration.md`
  merge-methods section, README Features/Guards
