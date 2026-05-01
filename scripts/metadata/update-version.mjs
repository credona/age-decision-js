/**
 * Update project-wide version and contract metadata (not CHANGELOG).
 * Usage: node scripts/metadata/update-version.mjs X.Y.Z X.Y
 */

import fs from "node:fs";
import path from "node:path";

const VERSION_RE = /^\d+\.\d+\.\d+$/;
const CONTRACT_RE = /^\d+\.\d+$/;

function validateVersion(version) {
  if (!VERSION_RE.test(version)) {
    console.error(`version must match X.Y.Z, got ${JSON.stringify(version)}`);
    process.exit(1);
  }
}

function validateContractVersion(contractVersion) {
  if (!CONTRACT_RE.test(contractVersion)) {
    console.error(
      `contract_version must match X.Y, got ${JSON.stringify(contractVersion)}`,
    );
    process.exit(1);
  }
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function dumpJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function updateProject(repoRoot, version, contractVersion) {
  const filePath = path.join(repoRoot, "project.json");
  const data = loadJson(filePath);
  data.version = version;
  data.contract_version = contractVersion;
  dumpJson(filePath, data);
}

function updateCompatibility(repoRoot, version, contractVersion) {
  const filePath = path.join(repoRoot, "compatibility.json");
  const data = loadJson(filePath);
  data.version = version;
  data.contract_version = contractVersion;
  dumpJson(filePath, data);
}

function updatePackageJson(repoRoot, version) {
  const filePath = path.join(repoRoot, "package.json");
  const data = loadJson(filePath);
  data.version = version;
  dumpJson(filePath, data);
}

function updatePackageLock(repoRoot, version) {
  const filePath = path.join(repoRoot, "package-lock.json");
  const data = loadJson(filePath);
  data.version = version;
  const rootPkg = data.packages?.[""];
  if (rootPkg && typeof rootPkg === "object") {
    rootPkg.version = version;
  }
  dumpJson(filePath, data);
}

function main() {
  const [, , version, contractVersion] = process.argv;
  if (!version || !contractVersion || process.argv.length > 4) {
    console.error("Usage: node scripts/metadata/update-version.mjs X.Y.Z X.Y");
    process.exit(1);
  }

  validateVersion(version);
  validateContractVersion(contractVersion);

  const repoRoot = process.cwd();

  try {
    updateProject(repoRoot, version, contractVersion);
    updateCompatibility(repoRoot, version, contractVersion);
    updatePackageJson(repoRoot, version);
    updatePackageLock(repoRoot, version);
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

main();
