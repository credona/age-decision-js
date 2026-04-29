import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const file = "docker-compose.integration.yml";

let content = fs.readFileSync(file, "utf8");

const replacements = {
  "ghcr.io/credona/age-decision-core": project.integration["age-decision-core"],
  "ghcr.io/credona/age-decision-antispoof":
    project.integration["age-decision-antispoof"],
  "ghcr.io/credona/age-decision-api": project.integration["age-decision-api"],
};

for (const [image, version] of Object.entries(replacements)) {
  content = content.replace(
    new RegExp(`${image}:v\\d+\\.\\d+\\.\\d+`, "g"),
    `${image}:v${version}`,
  );
}

fs.writeFileSync(file, content);
console.log("docker-compose.integration.yml synchronized.");
