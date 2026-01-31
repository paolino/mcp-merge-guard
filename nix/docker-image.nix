{
  pkgs,
  mcp-merge-guard,
  version,
}:
let
  startScript = pkgs.writeShellScript "start-mcp-merge-guard" ''
    set -euo pipefail
    exec ${pkgs.nodejs}/bin/node /app/dist/index.js "$@"
  '';
in
pkgs.dockerTools.buildImage {
  name = "ghcr.io/paolino/mcp-merge-guard";
  tag = version;

  copyToRoot = pkgs.buildEnv {
    name = "mcp-merge-guard-root";
    paths = [
      pkgs.nodejs
      pkgs.gh
      pkgs.cacert
      pkgs.bashInteractive
      pkgs.coreutils
    ];
    pathsToLink = [
      "/bin"
      "/lib"
    ];
  };

  extraCommands = ''
    mkdir -p app tmp
    cp -r ${mcp-merge-guard}/lib/* app/
  '';

  config = {
    Cmd = [ startScript ];
    WorkingDir = "/app";
    Env = [
      "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
      "HOME=/tmp"
    ];
  };
}
