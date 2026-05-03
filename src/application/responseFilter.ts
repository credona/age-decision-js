import type {
  CheckStatus,
  PublicDecision,
  VerifyResponse,
} from "../domain/types";

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(value, 1));
}

function asBoolean(value: unknown): boolean {
  return typeof value === "boolean" ? value : false;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asNullableBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

function asPublicDecision(value: unknown): PublicDecision {
  return value === "allow" ? "allow" : "deny";
}

function asCheckStatus(value: unknown): CheckStatus {
  if (value === "passed" || value === "failed" || value === "unknown") {
    return value;
  }

  return "unknown";
}

function asThresholdSource(
  value: unknown,
): VerifyResponse["decision_check"]["threshold"]["source"] {
  if (
    value === "explicit" ||
    value === "majority_country" ||
    value === "default"
  ) {
    return value;
  }

  return "default";
}

export function filterVerifyResponse(payload: unknown): VerifyResponse {
  const root = asRecord(payload);
  const decisionCheck = asRecord(root.decision_check);
  const threshold = asRecord(decisionCheck.threshold);
  const spoofCheck = asRecord(root.spoof_check);
  const privacy = asRecord(root.privacy);
  const zkProof = asRecord(root.zk_proof);

  return {
    request_id: asString(root.request_id),
    correlation_id: asString(root.correlation_id),
    decision: asPublicDecision(root.decision),
    cred_global_score: asNumber(root.cred_global_score),
    decision_check: {
      status: asCheckStatus(decisionCheck.status),
      decision: asPublicDecision(decisionCheck.decision),
      reason: asNullableString(decisionCheck.reason),
      threshold: {
        type: "minimum_age",
        value:
          typeof threshold.value === "number" &&
          Number.isFinite(threshold.value)
            ? threshold.value
            : 18,
        source: asThresholdSource(threshold.source),
        majority_country: asNullableString(threshold.majority_country),
      },
      cred_decision_score: asNumber(decisionCheck.cred_decision_score),
    },
    spoof_check: {
      status: asCheckStatus(spoofCheck.status),
      decision: asPublicDecision(spoofCheck.decision),
      reason: asNullableString(spoofCheck.reason),
      is_real: asNullableBoolean(spoofCheck.is_real),
      spoof_detected: asNullableBoolean(spoofCheck.spoof_detected),
      cred_antispoof_score: asNumber(spoofCheck.cred_antispoof_score),
    },
    privacy: {
      image_stored: asBoolean(privacy.image_stored),
      biometric_template_stored: asBoolean(privacy.biometric_template_stored),
      raw_image_logged: asBoolean(privacy.raw_image_logged),
      downstream_raw_response_exposed: asBoolean(
        privacy.downstream_raw_response_exposed,
      ),
      retention_policy: asString(privacy.retention_policy),
    },
    zk_proof: {
      zk_ready: asBoolean(zkProof.zk_ready),
      proof_type: asString(zkProof.proof_type),
      proof_status: asString(zkProof.proof_status),
      statement: asString(zkProof.statement),
    },
    reason: asNullableString(root.reason),
  };
}
