/** Helpers for deterministic changelog version sections. */

import fs from "node:fs";

export const INSERT_ANCHOR_AFTER =
  "Global project direction is tracked in the central Age Decision repository.\n\n";

const VERSION_SECTION_HEADING_RE = /<h2>\d+\.\d+\.\d+<\/h2>/;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildVersionHeading(version) {
  return `<h2>${version}</h2>`;
}

export function buildChangelogBlock(version, items) {
  const lines = [
    buildVersionHeading(version),
    "",
    "<ul>",
    ...items.map((item) => `  <li>${item}</li>`),
    "</ul>",
    "",
    "<hr>",
    "",
    "",
  ];
  return lines.join("\n");
}

/**
 * Replace only the managed version block, or insert it before the first semver section.
 * Idempotent when `block` is unchanged. Older release sections are never removed.
 */
export function replaceOrPrependVersionSection(text, version, block) {
  const heading = buildVersionHeading(version);
  const pattern = new RegExp(
    `${escapeRegex(heading)}\\s*\\n\\s*<ul>[\\s\\S]*?</ul>\\s*\\n\\s*<hr>\\s*\\n*`,
  );
  if (pattern.test(text)) {
    return text.replace(pattern, block);
  }

  const m = VERSION_SECTION_HEADING_RE.exec(text);
  if (m && m.index !== undefined) {
    return text.slice(0, m.index) + block + text.slice(m.index);
  }

  if (text.includes(INSERT_ANCHOR_AFTER)) {
    return text.replace(INSERT_ANCHOR_AFTER, INSERT_ANCHOR_AFTER + block);
  }

  throw new Error(
    "CHANGELOG.md has no semver <h2> section and lacks the insert anchor paragraph",
  );
}

export function readText(path) {
  return fs.readFileSync(path, "utf8");
}

export function writeText(path, text) {
  fs.writeFileSync(path, text, "utf8");
}
