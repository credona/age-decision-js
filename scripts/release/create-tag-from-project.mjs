import fs from "node:fs";
import { spawnSync } from "node:child_process";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function output(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr);
  }

  return result.stdout.trim();
}

function normalizeSecret(value) {
  return (value ?? "").replace(/\s+/g, "");
}

const tag = `v${project.version}`;

if (process.env.GITHUB_REF_NAME !== "main") {
  console.log("Automatic tagging skipped because this is not main.");
  process.exit(0);
}

if (output("git", ["tag", "--list", tag])) {
  console.log(`Tag already exists locally: ${tag}`);
  process.exit(0);
}

if (output("git", ["ls-remote", "--tags", "origin", `refs/tags/${tag}`])) {
  console.log(`Tag already exists remotely: ${tag}`);
  process.exit(0);
}

const token = normalizeSecret(process.env.AGE_DECISION_RELEASE_TOKEN);
const repository = process.env.GITHUB_REPOSITORY;

if (!token) {
  throw new Error("Missing AGE_DECISION_RELEASE_TOKEN secret.");
}

if (!repository) {
  throw new Error("Missing GITHUB_REPOSITORY environment variable.");
}

run("git", [
  "remote",
  "set-url",
  "origin",
  `https://x-access-token:${token}@github.com/${repository}.git`,
]);

run("git", ["config", "user.name", "github-actions[bot]"]);
run("git", ["config", "user.email", "github-actions[bot]@users.noreply.github.com"]);
run("git", ["tag", "-a", tag, "-m", `Release ${tag}`]);
run("git", ["push", "origin", tag]);

console.log(`Created and pushed tag: ${tag}`);
