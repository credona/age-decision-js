import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));

let content = fs.readFileSync("CONTRIBUTING.md", "utf8");

content = content.replace(
  /project\.json version: \d+\.\d+\.\d+/g,
  `project.json version: ${project.version}`,
);

content = content.replace(
  /Git tag: v\d+\.\d+\.\d+/g,
  `Git tag: v${project.version}`,
);

fs.writeFileSync("CONTRIBUTING.md", content);
