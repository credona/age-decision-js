import {
  buildChangelogBlock,
  readText,
  replaceOrPrependVersionSection,
  writeText,
} from "./changelog-utils.mjs";

const CHANGELOG_PATH = "CHANGELOG.md";
const MANAGED_VERSION = "2.5.0";

const CHANGELOG_SECTION_ITEMS = [
  "Aligned SDK public typing with the API v2.5 public contract.",
  "Kept responseFilter as the only unsafe payload casting boundary.",
  "Added stricter response filtering for public decisions, statuses, and score bounds.",
  "Preserved SDK client behavior without adding business scoring or decision logic.",
  "Kept unsupported input types forwarded deterministically to the API.",
  "Updated generated SDK usage, types, compatibility, and README examples.",
  "Updated package, project, compatibility, and lockfile metadata to 2.5.0.",
  "Preserved privacy-first stripping of raw, confidence, estimated age, and downstream fields.",
  "Validated the release through Docker build and unit tests.",
];

function main() {
  const block = buildChangelogBlock(MANAGED_VERSION, CHANGELOG_SECTION_ITEMS);
  let text = readText(CHANGELOG_PATH);
  try {
    text = replaceOrPrependVersionSection(text, MANAGED_VERSION, block);
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
  writeText(CHANGELOG_PATH, text);
}

main();
