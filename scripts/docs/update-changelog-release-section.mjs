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
  "Added SDK calibration isolation policy tests to ensure the SDK never loads, verifies, applies, or exposes private calibration policies.",
  "Added hostile payload contract tests to ensure private calibration fields are stripped by the SDK response filter.",
  "Ensured private calibration internals, signatures, hashes, weights, margins, and calibration parameters are not part of the SDK source contract.",
  "Separated unit/privacy/contract tests from integration tests in the default test command.",
  "Updated generated SDK usage, types, compatibility, and README examples.",
  "Validated the release through Docker CI-equivalent unit, privacy, contract, build, formatting, metadata, and documentation checks.",
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
