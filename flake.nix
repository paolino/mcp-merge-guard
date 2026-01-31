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
          npmDepsHash = "sha256-uj3T4nBdxpau4bDm0yh44fOabc/jViz2dv7jbgETUdM=";

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
      in {
        packages = {
          default = mcp-merge-guard;
          inherit mcp-merge-guard;
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
