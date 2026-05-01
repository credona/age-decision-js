import fs from "node:fs";

const CHANGELOG_PATH = "CHANGELOG.md";
const ANCHOR =
  "Global project direction is tracked in the central Age Decision repository.\n\n";
const MANAGED_VERSION = "2.3.0";
const VERSION_SECTION_HEADING_RE = /<h2>\d+\.\d+\.\d+<\/h2>/;

const CHANGELOG_SECTION_ITEMS = [
  "Added typed SDK error mapping for standardized API <code>ErrorResponse</code> in <code>AgeDecisionClient</code>.",
  "Introduced <code>StandardizedApiError</code> exposing <code>status</code>, <code>code</code>, <code>requestId</code>, <code>correlationId</code>, <code>body</code>, and stable <code>message</code>.",
  "Mapped HTTP <code>400</code> and HTTP <code>502</code> standardized gateway failures to <code>StandardizedApiError</code>.",
  "Left malformed and non-standard error bodies falling back to <code>HttpError</code>.",
  "Kept privacy-first strict envelope validation in <code>mapStandardizedApiError</code> so forbidden fields are not admitted as typed properties.",
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
  } else {
    const m = text.match(VERSION_SECTION_HEADING_RE);
    if (m && m.index !== undefined) {
      text = text.slice(0, m.index) + newBlock + text.slice(m.index);
    } else if (text.includes(ANCHOR)) {
      text = text.replace(ANCHOR, ANCHOR + newBlock, 1);
    } else {
      throw new Error("CHANGELOG.md missing expected anchor paragraph");
    }
  }
  fs.writeFileSync(CHANGELOG_PATH, text, "utf8");
}

main();
