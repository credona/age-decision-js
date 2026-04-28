import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const compatibility = JSON.parse(fs.readFileSync("compatibility.json", "utf8"));

let usage = fs.readFileSync("docs/usage.md", "utf8");

usage = replaceBlock(usage, "PROJECT_METADATA", project);
usage = replaceBlock(usage, "COMPATIBILITY_METADATA", compatibility);

fs.writeFileSync("docs/usage.md", usage);

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
