import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));

const expectedTag = `v${project.version}`;
const githubRefType = process.env.GITHUB_REF_TYPE;
const githubRefName = process.env.GITHUB_REF_NAME;

if (githubRefType !== "tag") {
  console.log(
    "Release metadata check skipped because this is not a tag build.",
  );
  process.exit(0);
}

if (githubRefName !== expectedTag) {
  throw new Error(
    `Release tag mismatch: expected ${expectedTag}, got ${githubRefName}`,
  );
}

console.log(`Release metadata check passed for ${expectedTag}.`);
