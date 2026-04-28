import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const compatibility = JSON.parse(fs.readFileSync("compatibility.json", "utf8"));

let doc = fs.readFileSync("docs/compatibility.md", "utf8");

doc = replaceBlock(doc, "PROJECT_METADATA", project);
doc = replaceBlock(doc, "COMPATIBILITY_METADATA", compatibility);

doc = doc.replace(
  /The SDK v\d+\.\d+\.\d+ targets Age Decision API v2\.x\./g,
  `The SDK v${project.version} targets Age Decision API v2.x.`,
);

doc = doc.replace(
  /project\.json version: \d+\.\d+\.\d+/g,
  `project.json version: ${project.version}`,
);

doc = doc.replace(
  /expected Git tag: v\d+\.\d+\.\d+/g,
  `expected Git tag: v${project.version}`,
);

fs.writeFileSync("docs/compatibility.md", doc);

function replaceBlock(content, blockName, payload) {
  const start = `<!-- BEGIN:${blockName} -->`;
  const end = `<!-- END:${blockName} -->`;

  if (!content.includes(start) || !content.includes(end)) {
    throw new Error(`Missing generated block markers for ${blockName}`);
  }

  const before = content.split(start)[0];
  const after = content.split(end)[1];
  const generated = JSON.stringify(payload, null, 2);

  return `${before}${start}
\`\`\`json
${generated}
\`\`\`
${end}${after}`;
}
