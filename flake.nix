{
  description = "MCP server that guards PR merge decisions";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        packageJson = builtins.fromJSON (builtins.readFile ./package.json);
        version = packageJson.version;

        mcp-merge-guard = pkgs.buildNpmPackage {
          pname = "mcp-merge-guard";
          inherit version;
          src = ./.;
          npmDepsHash = "sha256-NYTMhG1Nms4B7yZrX/OMJLieuLMgCenN9mW2YDIAzhU=";

          buildPhase = ''
            npm run build
          '';

          installPhase = ''
            mkdir -p $out/bin $out/lib
            cp -r dist $out/lib/
            cp -r node_modules $out/lib/
            cp package.json $out/lib/

            cat > $out/bin/mcp-merge-guard << EOF
            #!/usr/bin/env bash
            exec ${pkgs.nodejs}/bin/node $out/lib/dist/index.js "\$@"
            EOF
            chmod +x $out/bin/mcp-merge-guard
          '';

          meta = with pkgs.lib; {
            description = "MCP server that guards PR merge decisions";
            homepage = "https://github.com/paolino/mcp-merge-guard";
            license = licenses.mit;
            mainProgram = "mcp-merge-guard";
          };
        };

        # Build artifact with test sources
        testBuild = pkgs.buildNpmPackage {
          pname = "mcp-merge-guard-test-build";
          inherit version;
          src = ./.;
          npmDepsHash = "sha256-NYTMhG1Nms4B7yZrX/OMJLieuLMgCenN9mW2YDIAzhU=";

          buildPhase = ''
            npm run build
          '';

          installPhase = ''
            mkdir -p $out/lib
            cp -r src $out/lib/
            cp -r test $out/lib/
            cp -r node_modules $out/lib/
            cp package.json $out/lib/
            cp tsconfig.json $out/lib/
            cp vitest.config.ts $out/lib/
          '';
        };

        # Runnable test script
        unit-tests = pkgs.writeShellScriptBin "unit-tests" ''
          set -euo pipefail
          WORK=$(mktemp -d)
          trap "rm -rf $WORK" EXIT
          cp -r ${testBuild}/lib/* "$WORK/"
          chmod -R u+w "$WORK"
          cd "$WORK"
          exec ${pkgs.nodejs}/bin/npx vitest run "$@"
        '';

      in {
        packages = {
          default = mcp-merge-guard;
          inherit mcp-merge-guard unit-tests;
        };

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            gh
            just
            python312Packages.mkdocs-material
            python312Packages.mkdocs
            nodePackages.typescript
            nodePackages.prettier
          ];

          shellHook = ''
            echo "mcp-merge-guard development shell"
            echo "Run 'just' to see available commands"
          '';
        };
      }
    );
}
