import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));
const compatibility = JSON.parse(fs.readFileSync("compatibility.json", "utf8"));

function assertEqual(name, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${name} mismatch: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

function assertFalse(name, value) {
  if (value !== false) {
    throw new Error(`${name} must be false`);
  }
}

assertEqual("service", compatibility.service, project.service_name);
assertEqual("package", compatibility.package, project.package_name);
assertEqual("version", compatibility.version, project.version);
assertEqual(
  "contract_version",
  compatibility.contract_version,
  project.contract_version,
);

const publicContract = compatibility.public_contract;

assertEqual("client", publicContract.client, "AgeDecisionClient");
assertEqual("metadata_endpoint", publicContract.metadata_endpoint, "/version");
assertEqual("decision_values", publicContract.decision_values, [
  "allow",
  "deny",
]);
assertEqual("score_field", publicContract.score_field, "cred_global_score");

assertFalse(
  "internal_estimate_exposed",
  publicContract.internal_estimate_exposed,
);
assertFalse(
  "raw_decision_signal_quality_exposed",
  publicContract.raw_decision_signal_quality_exposed,
);
assertFalse(
  "raw_spoof_signal_quality_exposed",
  publicContract.raw_spoof_signal_quality_exposed,
);
assertFalse(
  "legacy_cred_score_exposed",
  publicContract.legacy_cred_score_exposed,
);

for (const [repository, versionRange] of Object.entries(
  compatibility.compatible_with,
)) {
  if (!repository.startsWith("age-decision-")) {
    throw new Error(
      `Invalid repository name in compatibility matrix: ${repository}`,
    );
  }

  if (!versionRange.startsWith(">=") || !versionRange.includes("<")) {
    throw new Error(
      `Invalid compatibility range for ${repository}: ${versionRange}`,
    );
  }
}

console.log("Compatibility metadata check passed.");
