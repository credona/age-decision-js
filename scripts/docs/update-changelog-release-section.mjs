import {
  buildChangelogBlock,
  readText,
  replaceOrPrependVersionSection,
  writeText,
} from "./changelog-utils.mjs";

const CHANGELOG_PATH = "CHANGELOG.md";
const MANAGED_VERSION = "2.3.0";

const CHANGELOG_SECTION_ITEMS = [
  "Added typed SDK error mapping for standardized API <code>ErrorResponse</code> in <code>AgeDecisionClient</code>.",
  "Introduced <code>StandardizedApiError</code> exposing <code>status</code>, <code>code</code>, <code>requestId</code>, <code>correlationId</code>, <code>body</code>, and stable <code>message</code>.",
  "Mapped HTTP <code>400</code> and HTTP <code>502</code> standardized gateway failures to <code>StandardizedApiError</code>.",
  "Left malformed and non-standard error bodies falling back to <code>HttpError</code>.",
  "Kept privacy-first strict envelope validation in <code>mapStandardizedApiError</code> so forbidden fields are not admitted as typed properties.",
  "Documented public SDK deprecation rules in <code>docs/deprecation-policy.md</code>.",
  "Documented the SDK error model in <code>docs/error-model.md</code>.",
  "Documented stable status client methods and <code>contract_version</code> in <code>docs/status-contract.md</code>.",
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
