import { describe, expect, it } from "vitest";
import { filterVerifyResponse } from "../../src/application/responseFilter";

const FORBIDDEN_PRIVATE_FIELDS = [
  "private_payload",
  "calibration_parameters",
  "calibration_internals",
  "policy_id",
  "payload_hash",
  "signature",
  "ed25519",
  "sha256",
  "weights",
  "margins",
  "minimum_allow_score",
  "cred_global_score_offset",
  "cred_global_score_floor",
  "cred_global_score_ceiling",
  "final_score_offset",
  "final_score_floor",
  "final_score_ceiling",
];

describe("SDK public response contract rejects private calibration fields", () => {
  it("strips hostile calibration payloads from verify responses", () => {
    const result = filterVerifyResponse({
      request_id: "req-private",
      correlation_id: "corr-private",
      decision: "allow",
      cred_global_score: 0.91,
      decision_check: {
        status: "passed",
        decision: "allow",
        reason: null,
        threshold: {
          type: "minimum_age",
          value: 18,
          source: "default",
          majority_country: null,
        },
        cred_decision_score: 0.91,
        private_payload: {
          calibration_parameters: {
            final_score_offset: 0.2,
            weights: {
              private: 0.5,
            },
          },
        },
      },
      spoof_check: {
        status: "passed",
        decision: "allow",
        reason: null,
        is_real: true,
        spoof_detected: false,
        cred_antispoof_score: 0.95,
        calibration_internals: {
          margins: {
            private: 0.1,
          },
        },
      },
      privacy: {
        image_stored: false,
        biometric_template_stored: false,
        raw_image_logged: false,
        downstream_raw_response_exposed: false,
        retention_policy: "not_stored_by_api_gateway",
      },
      zk_proof: {
        zk_ready: true,
        proof_type: "interactive_zero_knowledge_ready",
        proof_status: "not_generated",
        statement: "safe public statement",
      },
      reason: null,
      private_payload: {
        calibration_parameters: {
          cred_global_score_offset: 0.1,
          minimum_allow_score: 0.8,
        },
      },
      policy_id: "private-api-policy",
      payload_hash: "sha256:private",
      signature: "private-signature",
      ed25519: "private-public-key",
    });

    const serialized = JSON.stringify(result);

    for (const field of FORBIDDEN_PRIVATE_FIELDS) {
      expect(serialized).not.toContain(field);
    }
  });

  it("does not provide any API for private calibration loading", async () => {
    const sdk = await import("../../src/index");

    expect("loadCalibrationPolicy" in sdk).toBe(false);
    expect("loadPrivateCalibration" in sdk).toBe(false);
    expect("verifyCalibrationSignature" in sdk).toBe(false);
    expect("verifyCalibrationIntegrity" in sdk).toBe(false);
    expect("applyCalibration" in sdk).toBe(false);
  });
});
