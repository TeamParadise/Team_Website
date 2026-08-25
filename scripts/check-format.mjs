import { execFileSync } from "node:child_process";

const supportedExtensions = new Set([
    ".css",
    ".html",
    ".js",
    ".json",
    ".mjs",
    ".yaml",
    ".yml",
]);
const mode = process.argv[2];

if (!["--staged", "--head"].includes(mode)) {
    console.error("Use --staged or --head.");
    process.exit(1);
}

const command =
    mode === "--staged"
        ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]
        : [
              "diff-tree",
              "--no-commit-id",
              "--name-only",
              "--diff-filter=ACMR",
              "-r",
              "HEAD",
              "-z",
          ];
const paths = execFileSync("git", command)
    .toString()
    .split("\0")
    .filter(Boolean)
    .filter((path) => path !== "pnpm-lock.yaml")
    .filter((path) =>
        supportedExtensions.has(path.slice(path.lastIndexOf("."))),
    );

if (paths.length === 0) process.exit(0);

execFileSync("pnpm", ["exec", "prettier", "--check", ...paths], {
    stdio: "inherit",
});
