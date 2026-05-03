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

  it("should clamp public scores to public normalized bounds", () => {
    const result = filterVerifyResponse({
      request_id: "req-123",
      correlation_id: "corr-456",
      decision: "allow",
      cred_global_score: 2,
      decision_check: {
        status: "passed",
        decision: "allow",
        threshold: {
          type: "minimum_age",
          value: 18,
          source: "default",
          majority_country: null,
        },
        cred_decision_score: -1,
      },
      spoof_check: {
        status: "passed",
        decision: "allow",
        is_real: true,
        spoof_detected: false,
        cred_antispoof_score: 1.5,
      },
      privacy: {},
      zk_proof: {},
      reason: null,
    });

    expect(result.cred_global_score).toBe(1);
    expect(result.decision_check.cred_decision_score).toBe(0);
    expect(result.spoof_check.cred_antispoof_score).toBe(1);
  });

  it("should normalize invalid enum-like values to safe public defaults", () => {
    const result = filterVerifyResponse({
      request_id: "req-123",
      correlation_id: "corr-456",
      decision: "internal",
      cred_global_score: 0.5,
      decision_check: {
        status: "internal",
        decision: "internal",
        threshold: {
          type: "internal",
          value: 18,
          source: "internal",
          majority_country: null,
        },
        cred_decision_score: 0.5,
      },
      spoof_check: {
        status: "internal",
        decision: "internal",
        cred_antispoof_score: 0.5,
      },
      privacy: {},
      zk_proof: {},
    });

    expect(result.decision).toBe("deny");
    expect(result.decision_check.status).toBe("unknown");
    expect(result.decision_check.decision).toBe("deny");
    expect(result.decision_check.threshold.type).toBe("minimum_age");
    expect(result.decision_check.threshold.source).toBe("default");
    expect(result.spoof_check.status).toBe("unknown");
    expect(result.spoof_check.decision).toBe("deny");
  });
});
