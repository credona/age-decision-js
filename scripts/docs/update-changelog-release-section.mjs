import {
  buildChangelogBlock,
  readText,
  replaceOrPrependVersionSection,
  writeText,
} from "./changelog-utils.mjs";

const CHANGELOG_PATH = "CHANGELOG.md";
const MANAGED_VERSION = "2.4.0";

const CHANGELOG_SECTION_ITEMS = [
  "Introduced SDK application/domain structure for v2.4.0 alignment.",
  "Added public verify response filtering before returning SDK responses.",
  "Added strict SDK response filtering to strip unsafe downstream and internal fields.",
  "Added public inputType support aligned with v3 multi-input preparation.",
  "Added deterministic standardized error mapping for unsupported input types.",
  "Renamed age and liveness response types to decision check and spoof check.",
  "Centralized public decision and check status constants using const-object unions.",
  "Updated SDK documentation to use neutral public terminology.",
  "Kept SDK public contract stable while aligning with API orchestration boundaries.",
  "Preserved standardized error mapping and privacy-first response handling.",
  "Validated the refactor with build and test checks.",
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
