import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const compatibility = JSON.parse(fs.readFileSync("compatibility.json", "utf8"));

let types = fs.readFileSync("docs/types.md", "utf8");

types = replaceBlock(types, "PROJECT_METADATA", project);
types = replaceBlock(types, "COMPATIBILITY_METADATA", compatibility);

fs.writeFileSync("docs/types.md", types);

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
