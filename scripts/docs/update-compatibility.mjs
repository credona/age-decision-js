import fs from "node:fs";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));

const majorVersion = project.version.split(".")[0];

const compatibility = {
  service: project.service_name,
  package: project.package_name,
  version: project.version,
  contract_version: project.contract_version,
  compatible_with: {
    "age-decision-api": `>=${majorVersion}.0.0 <${Number(majorVersion) + 1}.0.0`,
  },
  public_contract: {
    client: "AgeDecisionClient",
    metadata_endpoint: "/version",
    decision_values: ["allow", "deny"],
    score_field: "cred_global_score",
    internal_estimate_exposed: false,
    raw_decision_signal_quality_exposed: false,
    raw_spoof_signal_quality_exposed: false,
    legacy_cred_score_exposed: false,
  },
};

fs.writeFileSync(
  "compatibility.json",
  `${JSON.stringify(compatibility, null, 2)}\n`,
);
