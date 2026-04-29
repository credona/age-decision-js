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
    estimated_age_exposed: false,
    raw_age_confidence_exposed: false,
    raw_liveness_confidence_exposed: false,
    legacy_cred_score_exposed: false,
  },
};

fs.writeFileSync(
  "compatibility.json",
  `${JSON.stringify(compatibility, null, 2)}\n`,
);
