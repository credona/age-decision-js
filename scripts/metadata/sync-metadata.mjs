import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const compatibility = JSON.parse(fs.readFileSync("compatibility.json", "utf8"));

let changed = false;

function update(target, key, value) {
  if (target[key] !== value) {
    target[key] = value;
    changed = true;
  }
}

update(pkg, "name", project.package_name);
update(pkg, "version", project.version);
update(pkg, "license", project.license);

update(compatibility, "service", project.service_name);
update(compatibility, "package", project.package_name);
update(compatibility, "version", project.version);
update(compatibility, "contract_version", project.contract_version);

fs.writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
fs.writeFileSync(
  "compatibility.json",
  `${JSON.stringify(compatibility, null, 2)}\n`,
);

console.log(
  changed ? "Metadata synchronized." : "Metadata already up-to-date.",
);
