import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const rules = [
    ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
    [
        "GitHub token",
        /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/,
    ],
    ["Google API key", /\bAIza[A-Za-z0-9_-]{20,}\b/],
    ["private key", /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/],
    ["Slack token", /\bxox(?:b|p|a|r|s)-[A-Za-z0-9-]{20,}\b/],
    ["Stripe secret key", /\b(?:sk|rk)_(?:test|live)_[A-Za-z0-9]{16,}\b/],
    ["Stripe webhook secret", /\bwhsec_[A-Za-z0-9]{16,}\b/],
];

function git(args, input) {
    return execFileSync("git", args, { input });
}

function check(path, content, location = "") {
    if (content.includes(0)) return;
    const text = content.toString("utf8");
    for (const [name, pattern] of rules) {
        if (pattern.test(text)) {
            console.error(`Blocked ${location}${path}: possible ${name}.`);
            process.exitCode = 1;
        }
    }
}

function stagedFiles() {
    return git(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"])
        .toString()
        .split("\0")
        .filter(Boolean);
}

function checkStaged() {
    for (const path of stagedFiles()) {
        check(path, git(["show", `:${path}`]));
    }
}

function changedPaths(commit) {
    return git([
        "diff-tree",
        "--root",
        "--no-commit-id",
        "--name-only",
        "--diff-filter=AM",
        "-r",
        "-z",
        commit,
    ])
        .toString()
        .split("\0")
        .filter(Boolean);
}

function checkPush() {
    const refs = readFileSync(0, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => line.split(" "));

    for (const [, localOid, , remoteOid] of refs) {
        if (/^0+$/.test(localOid)) continue;
        const range = /^0+$/.test(remoteOid)
            ? localOid
            : `${remoteOid}..${localOid}`;
        const commits = git(["rev-list", range])
            .toString()
            .trim()
            .split("\n")
            .filter(Boolean);
        for (const commit of commits) {
            for (const path of changedPaths(commit)) {
                check(
                    path,
                    git(["show", `${commit}:${path}`]),
                    `in ${commit.slice(0, 12)} `,
                );
            }
        }
    }
}

if (process.argv[2] === "--push") {
    checkPush();
} else {
    checkStaged();
}

if (process.exitCode) process.exit(process.exitCode);
