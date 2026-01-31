# shellcheck shell=bash

set unstable := true

# List available recipes
default:
    @just --list

# Install dependencies
install:
    npm install

# Build TypeScript
build:
    npm run build

# Run tests
test:
    npm run test

# Run tests in watch mode
test-watch:
    npm run test:watch

# Format code
format:
    npm run format

# Lint code
lint:
    npm run lint

# Full CI pipeline
CI:
    #!/usr/bin/env bash
    set -euo pipefail
    npm ci
    npm run build
    npm run test
    npm run lint

# Serve documentation locally
docs-serve:
    mkdocs serve

# Build documentation
docs-build:
    mkdocs build

# Clean build artifacts
clean:
    rm -rf dist node_modules

# Build Docker image via Nix
build-docker tag='latest':
    #!/usr/bin/env bash
    set -euo pipefail
    nix build .#docker-image
    docker load < result
    system=$(nix eval --raw --impure --expr 'builtins.currentSystem')
    version=$(nix eval --raw ".#version.$system")
    docker tag "ghcr.io/paolino/mcp-merge-guard:$version" \
        "ghcr.io/paolino/mcp-merge-guard:{{ tag }}"

# Trigger a release (requires gh CLI)
release version dry_run="false":
    #!/usr/bin/env bash
    set -euo pipefail
    gh workflow run release.yml \
        -f version={{ version }} \
        -f dry_run={{ dry_run }}
