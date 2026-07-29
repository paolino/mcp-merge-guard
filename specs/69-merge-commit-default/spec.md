# merge-commit default, rebase gated behind explicit override

Policy issue: https://github.com/paolino/llm-settings/issues/69

## P1 user story

As an orchestrator merging PRs through mcp-merge-guard, I want the default
merge method to preserve GPG-signed branch commits on main, and I want the
signature-stripping method (rebase merge) to fail loudly unless I explicitly
opt in — so that no merge silently strips signatures because a default was
left in place.

## Background (audit evidence, 2026-07-29)

Machine-derived audit, 26 repos over 30 days: 1072 of 1337 unsigned mainline
commits were caused by the merge method. 336/336 rebase-merge tips were
unsigned vs 0/81 squash and 0/51 merge-commit tips. This server's own
`mergeMethod` default of `rebase` was a direct cause.

## Functional requirements

- FR1: `guard-merge`'s `mergeMethod` default changes `rebase` → `merge`; the
  schema description states the policy (merge preserves signed commits;
  squash only where collapse is intended; rebase forbidden without override).
- FR2: NEW policy guard: `mergeMethod=rebase` fails the guard report unless
  the new input flag `allowSignatureStripping: true` is passed. The failure
  message names the consequence (branch commits recreated unsigned) and the
  override flag. `merge` and `squash` pass the policy guard regardless of
  the flag.
- FR3: the guard follows repo conventions: new sibling module
  `src/guards/merge-method-policy.ts`, re-exported from
  `src/guards/index.ts`, invoked from `guardMerge` alongside the existing
  repo-settings `merge-method` guard.
- FR4: tests cover the policy guard (all four method/flag combinations that
  matter) and the new schema defaults (`mergeMethod` = "merge",
  `allowSignatureStripping` = false on minimal input).
- FR5: docs updated — `docs/tools.md` parameter table, `docs/configuration.md`
  merge-methods section, README Guards/Features sections.

## Success criteria

- `./gate.sh` (mirrors CI: `nix build --quiet` + `nix run .#unit-tests
  --quiet`) green at HEAD; the new policy-guard tests demonstrably fail
  without the implementation.
- No behavior change for explicit `mergeMethod: "merge" | "squash"` callers.
- Breaking change declared: `feat!` commit with `BREAKING CHANGE:` footer
  (release-please major/minor bump from 0.4.0).
