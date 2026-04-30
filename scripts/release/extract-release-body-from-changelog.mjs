import fs from "node:fs";

const args = process.argv.slice(2);
const versionFlag = args.indexOf("--version");
if (versionFlag === -1 || !args[versionFlag + 1]) {
  throw new Error("Missing required argument: --version <x.y.z>");
}

const version = args[versionFlag + 1];
const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
const heading = `<h2>${version}</h2>`;
const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const pattern = new RegExp(
  `${escapedHeading}\\s*\\n([\\s\\S]*?)(?:\\n\\s*<h2>|$)`,
);
const match = changelog.match(pattern);

if (!match) {
  throw new Error(`Version section not found in CHANGELOG.md: ${version}`);
}

let body = match[1].trim();
if (body.endsWith("<hr>")) {
  body = body.slice(0, -"<hr>".length).trimEnd();
}

console.log(body);
