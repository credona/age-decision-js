import fs from "node:fs";

const CHANGELOG_PATH = "CHANGELOG.md";
const ANCHOR =
  "Global project direction is tracked in the central Age Decision repository.\n\n";
const MANAGED_VERSION = "2.2.2";

const CHANGELOG_SECTION_ITEMS = [
  "Npm publish workflow remains tag-only (<code>v*.*.*</code>).",
  "Release workflow builds GitHub release description from the matching <code>CHANGELOG.md</code> section.",
  "Release workflow validates that the Git tag matches the <code>project.json</code> version.",
  "Updated <code>tsconfig.json</code> for TypeScript 6 declaration emit compatibility.",
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildBlock() {
  const lines = [
    `<h2>${MANAGED_VERSION}</h2>`,
    "",
    "<ul>",
    ...CHANGELOG_SECTION_ITEMS.map((item) => `  <li>${item}</li>`),
    "</ul>",
    "",
    "<hr>",
    "",
    "",
  ];
  return lines.join("\n");
}

function main() {
  const heading = `<h2>${MANAGED_VERSION}</h2>`;
  const newBlock = buildBlock();
  let text = fs.readFileSync(CHANGELOG_PATH, "utf8");
  const pattern = new RegExp(
    `${escapeRegex(heading)}\\s*\\n\\s*<ul>[\\s\\S]*?</ul>\\s*\\n\\s*<hr>\\s*\\n*`,
  );
  if (pattern.test(text)) {
    text = text.replace(pattern, newBlock);
  } else if (text.includes(ANCHOR)) {
    text = text.replace(ANCHOR, ANCHOR + newBlock);
  } else {
    throw new Error("CHANGELOG.md missing expected anchor paragraph");
  }
  fs.writeFileSync(CHANGELOG_PATH, text, "utf8");
}

main();
