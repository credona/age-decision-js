import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
const readme = fs.readFileSync("README.md", "utf8");

const requiredFields = [
  "service_name",
  "package_name",
  "app_name",
  "version",
  "contract_version",
  "repository",
  "npm_package",
];

for (const field of requiredFields) {
  if (!project[field]) {
    throw new Error(`Missing project metadata field: ${field}`);
  }
}

if (project.package_name !== packageJson.name) {
  throw new Error(
    `package_name mismatch: ${project.package_name} !== ${packageJson.name}`,
  );
}

if (project.version !== packageJson.version) {
  throw new Error(
    `version mismatch: ${project.version} !== ${packageJson.version}`,
  );
}

if (!/^\d+\.\d+\.\d+$/.test(project.version)) {
  throw new Error(`Invalid semantic version: ${project.version}`);
}

if (!changelog.includes(`<h2>${project.version}</h2>`)) {
  throw new Error(`CHANGELOG.md does not contain version ${project.version}`);
}

if (!readme.includes(project.repository)) {
  throw new Error("README.md does not contain repository URL");
}

console.log("Project metadata check passed.");
