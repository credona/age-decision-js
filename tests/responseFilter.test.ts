import { describe, expect, it } from "vitest";
import { filterVerifyResponse } from "../src/application/responseFilter";

describe("filterVerifyResponse contract enforcement", () => {
  it("should only expose public contract fields", () => {
    const result = filterVerifyResponse({
      request_id: "req-123",
      correlation_id: "corr-456",
      decision: "allow",
      cred_global_score: 0.9,
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
        cred_decision_score: 0.9,
        raw: { estimated_age: 24 },
      },
      spoof_check: {
        status: "passed",
        decision: "allow",
        reason: null,
        is_real: true,
        spoof_detected: false,
        cred_antispoof_score: 0.92,
        raw: { logits: [0.2, 0.8] },
      },
      privacy: {
        image_stored: false,
        biometric_template_stored: false,
        raw_image_logged: false,
        downstream_raw_response_exposed: false,
        retention_policy: "not_stored_by_api_gateway",
        debug_flag: true,
      },
      zk_proof: {
        zk_ready: true,
        proof_type: "interactive_zero_knowledge_ready",
        proof_status: "not_generated",
        statement: "safe public statement",
        witness: "secret",
      },
      reason: null,

      raw: { estimated_age: 17.2 },
      downstream_response: { confidence: 0.91 },
      internal_thresholds: { age: 18 },
      confidence: 0.91,
      model_scores: [0.1, 0.9],
    });

    // ROOT
    expect(Object.keys(result).sort()).toEqual(
      [
        "request_id",
        "correlation_id",
        "decision",
        "cred_global_score",
        "decision_check",
        "spoof_check",
        "privacy",
        "zk_proof",
        "reason",
      ].sort(),
    );

    // decision_check
    expect(Object.keys(result.decision_check).sort()).toEqual(
      [
        "status",
        "decision",
        "reason",
        "threshold",
        "cred_decision_score",
      ].sort(),
    );

    // spoof_check
    expect(Object.keys(result.spoof_check).sort()).toEqual(
      [
        "status",
        "decision",
        "reason",
        "is_real",
        "spoof_detected",
        "cred_antispoof_score",
      ].sort(),
    );

    // privacy
    expect(Object.keys(result.privacy).sort()).toEqual(
      [
        "image_stored",
        "biometric_template_stored",
        "raw_image_logged",
        "downstream_raw_response_exposed",
        "retention_policy",
      ].sort(),
    );

    // zk_proof
    expect(Object.keys(result.zk_proof).sort()).toEqual(
      ["zk_ready", "proof_type", "proof_status", "statement"].sort(),
    );
  });
});
