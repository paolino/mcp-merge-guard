# Changelog

## [0.4.0](https://github.com/paolino/mcp-merge-guard/compare/v0.3.0...v0.4.0) (2026-02-01)


### Features

* add release pipeline with Docker image publishing ([54808df](https://github.com/paolino/mcp-merge-guard/commit/54808df8328c326c080b5fc832a00580c0b5c7b1))
* auto-update npmDepsHash in release PRs ([c6d2373](https://github.com/paolino/mcp-merge-guard/commit/c6d23732d0e622d65d05687ce1f354dbc802cf87))
* initial implementation of mcp-merge-guard ([21c841a](https://github.com/paolino/mcp-merge-guard/commit/21c841ae319d01e99caf74497c78043126975391))
* switch to release-please for automated releases ([1164306](https://github.com/paolino/mcp-merge-guard/commit/116430645027ffd8612cec775c19a4c2f430270f))


### Bug Fixes

* add explicit event types to workflow ([4146be5](https://github.com/paolino/mcp-merge-guard/commit/4146be5aefc42dd1bfc7cf6435c0d92ffb0d8c01))
* configure release-please to start from 0.1.0 ([d5b7925](https://github.com/paolino/mcp-merge-guard/commit/d5b792509c767cb4f3d577c7f124f12ec10a57ab))
* copy src dir and make files writable in test runner ([c208633](https://github.com/paolino/mcp-merge-guard/commit/c2086334ef404772839eaf29d7c22a18fa31dd1c))
* copy test files to temp dir for writable vitest cache ([aa395a4](https://github.com/paolino/mcp-merge-guard/commit/aa395a4df1654f179708302742bb611a0ea72e98))
* correct branch pattern for release-please PR ([5474df9](https://github.com/paolino/mcp-merge-guard/commit/5474df97964e4c4e1f8d7df74b7ff848e70abcd9))
* include test files in unit-tests package ([cd48b9e](https://github.com/paolino/mcp-merge-guard/commit/cd48b9ec4a032f22fabcfa0af55b2b2ea655518c))
* install npm deps before running tests ([9a95d10](https://github.com/paolino/mcp-merge-guard/commit/9a95d1097bddca6ffc594b58de30cba2573c7185))
* remove invalid --fail-level flag from gh pr checks ([4a4def1](https://github.com/paolino/mcp-merge-guard/commit/4a4def1dcb9f19b0a2cc8af75e01277d61bec0bc))
* remove lint step from release workflow ([2fd29bd](https://github.com/paolino/mcp-merge-guard/commit/2fd29bd2f8875f9418fe1ee96cb77452e938ddf0))
* remove paths filter from workflow ([7653518](https://github.com/paolino/mcp-merge-guard/commit/7653518b78b630c9a3cd5d1e879cddaaf1270155))
* run tests via nix build instead of nix develop ([22362c7](https://github.com/paolino/mcp-merge-guard/commit/22362c716bd456b9dab83494ccabccb204870853))
* update npmDepsHash after version bump ([da846a3](https://github.com/paolino/mcp-merge-guard/commit/da846a32f32d82f0b1c274b122767cdae0f33b8c))
* update npmDepsHash for release ([b6aa9fe](https://github.com/paolino/mcp-merge-guard/commit/b6aa9fe27eb7139e25ec8b595509b0e52fd5fd30))
* use Nix in CI workflow ([290cf6a](https://github.com/paolino/mcp-merge-guard/commit/290cf6a0a7430b9ea9ffb5b29b8fc4b4e4c580f8)), closes [#3](https://github.com/paolino/mcp-merge-guard/issues/3)
* use nix run for tests instead of nix build ([b10bd2c](https://github.com/paolino/mcp-merge-guard/commit/b10bd2c369f01cb9af571c9b680d2651fe596bd8))
* use nix shell flakes syntax ([36e79bf](https://github.com/paolino/mcp-merge-guard/commit/36e79bff6cf466ba815dbe5aad55fe1a05e33f95))
* use PR-based release for branch protection ([ecfee37](https://github.com/paolino/mcp-merge-guard/commit/ecfee37fd9941ddd3bb1e5752f7503bcce16e4f4))
* use prefetch-npm-deps and pull_request_target ([00ec4c9](https://github.com/paolino/mcp-merge-guard/commit/00ec4c9cf65b4c20676d88fb6abd5592687dcd4b))
* use simple version tags ([339b600](https://github.com/paolino/mcp-merge-guard/commit/339b600367463cb56d0d46c5eda3f4b2d3a78f84))
* use workflow_run trigger instead of pull_request_target ([3101e09](https://github.com/paolino/mcp-merge-guard/commit/3101e099afcebb7afb2d6a510170f4014c2f1e52))
* wait for CI checks to be registered before watching ([3844b27](https://github.com/paolino/mcp-merge-guard/commit/3844b27562619c25b41450fce57dc611924fdf8c))

## [0.3.0](https://github.com/paolino/mcp-merge-guard/compare/mcp-merge-guard-v0.2.0...mcp-merge-guard-v0.3.0) (2026-02-01)


### Features

* auto-update npmDepsHash in release PRs ([c6d2373](https://github.com/paolino/mcp-merge-guard/commit/c6d23732d0e622d65d05687ce1f354dbc802cf87))


### Bug Fixes

* add explicit event types to workflow ([4146be5](https://github.com/paolino/mcp-merge-guard/commit/4146be5aefc42dd1bfc7cf6435c0d92ffb0d8c01))
* correct branch pattern for release-please PR ([5474df9](https://github.com/paolino/mcp-merge-guard/commit/5474df97964e4c4e1f8d7df74b7ff848e70abcd9))
* remove paths filter from workflow ([7653518](https://github.com/paolino/mcp-merge-guard/commit/7653518b78b630c9a3cd5d1e879cddaaf1270155))
* use nix shell flakes syntax ([36e79bf](https://github.com/paolino/mcp-merge-guard/commit/36e79bff6cf466ba815dbe5aad55fe1a05e33f95))
* use prefetch-npm-deps and pull_request_target ([00ec4c9](https://github.com/paolino/mcp-merge-guard/commit/00ec4c9cf65b4c20676d88fb6abd5592687dcd4b))
* use workflow_run trigger instead of pull_request_target ([3101e09](https://github.com/paolino/mcp-merge-guard/commit/3101e099afcebb7afb2d6a510170f4014c2f1e52))

## [0.2.0](https://github.com/paolino/mcp-merge-guard/compare/mcp-merge-guard-v0.1.0...mcp-merge-guard-v0.2.0) (2026-02-01)


### Features

* add release pipeline with Docker image publishing ([54808df](https://github.com/paolino/mcp-merge-guard/commit/54808df8328c326c080b5fc832a00580c0b5c7b1))
* initial implementation of mcp-merge-guard ([21c841a](https://github.com/paolino/mcp-merge-guard/commit/21c841ae319d01e99caf74497c78043126975391))
* switch to release-please for automated releases ([1164306](https://github.com/paolino/mcp-merge-guard/commit/116430645027ffd8612cec775c19a4c2f430270f))


### Bug Fixes

* configure release-please to start from 0.1.0 ([d5b7925](https://github.com/paolino/mcp-merge-guard/commit/d5b792509c767cb4f3d577c7f124f12ec10a57ab))
* copy src dir and make files writable in test runner ([c208633](https://github.com/paolino/mcp-merge-guard/commit/c2086334ef404772839eaf29d7c22a18fa31dd1c))
* copy test files to temp dir for writable vitest cache ([aa395a4](https://github.com/paolino/mcp-merge-guard/commit/aa395a4df1654f179708302742bb611a0ea72e98))
* include test files in unit-tests package ([cd48b9e](https://github.com/paolino/mcp-merge-guard/commit/cd48b9ec4a032f22fabcfa0af55b2b2ea655518c))
* install npm deps before running tests ([9a95d10](https://github.com/paolino/mcp-merge-guard/commit/9a95d1097bddca6ffc594b58de30cba2573c7185))
* remove invalid --fail-level flag from gh pr checks ([4a4def1](https://github.com/paolino/mcp-merge-guard/commit/4a4def1dcb9f19b0a2cc8af75e01277d61bec0bc))
* remove lint step from release workflow ([2fd29bd](https://github.com/paolino/mcp-merge-guard/commit/2fd29bd2f8875f9418fe1ee96cb77452e938ddf0))
* run tests via nix build instead of nix develop ([22362c7](https://github.com/paolino/mcp-merge-guard/commit/22362c716bd456b9dab83494ccabccb204870853))
* use Nix in CI workflow ([290cf6a](https://github.com/paolino/mcp-merge-guard/commit/290cf6a0a7430b9ea9ffb5b29b8fc4b4e4c580f8)), closes [#3](https://github.com/paolino/mcp-merge-guard/issues/3)
* use nix run for tests instead of nix build ([b10bd2c](https://github.com/paolino/mcp-merge-guard/commit/b10bd2c369f01cb9af571c9b680d2651fe596bd8))
* use PR-based release for branch protection ([ecfee37](https://github.com/paolino/mcp-merge-guard/commit/ecfee37fd9941ddd3bb1e5752f7503bcce16e4f4))
* wait for CI checks to be registered before watching ([3844b27](https://github.com/paolino/mcp-merge-guard/commit/3844b27562619c25b41450fce57dc611924fdf8c))
