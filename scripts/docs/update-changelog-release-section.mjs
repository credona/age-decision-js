import {
  buildChangelogBlock,
  readText,
  replaceOrPrependVersionSection,
  writeText,
} from "./changelog-utils.mjs";

const CHANGELOG_PATH = "CHANGELOG.md";
const MANAGED_VERSION = "2.6.0";

const CHANGELOG_SECTION_ITEMS = [
  "Added SDK benchmark execution workflow for API end-to-end benchmark calls.",
  "Added privacy-safe SDK benchmark report generation with aggregate latency and decision distribution.",
  "Added SDK benchmark privacy tests preventing raw payload, base64, downstream response, threshold, confidence, and estimated age exposure.",
  "Kept SDK benchmark logic limited to API calls and report generation without duplicating API business logic.",
  "Updated package, project, compatibility, and lockfile metadata to 2.6.0.",
  "Updated generated SDK usage, types, compatibility, and README examples.",
  "Validated the release through unit tests and Node syntax checks.",
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
