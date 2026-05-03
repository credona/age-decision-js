import { describe, expect, it } from "vitest";
import { filterVerifyResponse } from "../src/application/responseFilter";

describe("filterVerifyResponse", () => {
  it("should strip forbidden unsafe fields from verify response", () => {
    const result = filterVerifyResponse({
      request_id: "req-123",
      correlation_id: "corr-456",
      decision: "allow",
      cred_global_score: 0.9,
      decision_check: {
        status: "passed",
        decision: "allow",
        threshold: {
          type: "minimum_age",
          value: 18,
          source: "default",
          majority_country: null,
          internal_threshold: 17,
        },
        cred_decision_score: 0.9,
        estimated_age: 24,
        confidence: 0.95,
        raw: { model: true },
      },
      spoof_check: {
        status: "passed",
        decision: "allow",
        is_real: true,
        spoof_detected: false,
        cred_antispoof_score: 0.92,
        confidence: 0.99,
        raw: { model: true },
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
      estimated_age: 24,
      confidence: 0.95,
      threshold: 18,
      raw: { downstream: true },
      downstream_response: { raw: true },
    });

    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("estimated_age");
    expect(serialized).not.toContain("confidence");
    expect(serialized).not.toContain("internal_threshold");
    expect(serialized).not.toContain('"raw":');
    expect(serialized).not.toContain("downstream_response");
  });
});
