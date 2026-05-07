import {
  buildChangelogBlock,
  readText,
  replaceOrPrependVersionSection,
  writeText,
} from "./changelog-utils.mjs";

const CHANGELOG_PATH = "CHANGELOG.md";
const MANAGED_VERSION = "2.6.0";

const CHANGELOG_SECTION_ITEMS = [
  "Updated package, project, compatibility, and lockfile metadata to 2.6.0.",
  "Aligned SDK metadata and documentation with the centralized age-decision-benchmark laboratory.",
  "Removed legacy local benchmark orchestration from the SDK repository.",
  "Kept SDK focused on public API contract mirroring and response filtering.",
  "Updated generated SDK usage, types, compatibility, and README examples.",
  "Validated the release through unit tests and build checks.",
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
