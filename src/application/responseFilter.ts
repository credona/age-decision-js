import type { VerifyResponse } from "../domain/types";

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
  return typeof value === "number" ? value : 0;
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
    decision: asString(root.decision) as VerifyResponse["decision"],
    cred_global_score: asNumber(root.cred_global_score),
    decision_check: {
      status: asString(
        decisionCheck.status,
      ) as VerifyResponse["decision_check"]["status"],
      decision: asString(
        decisionCheck.decision,
      ) as VerifyResponse["decision_check"]["decision"],
      reason: asNullableString(decisionCheck.reason),
      threshold: {
        type: asString(
          threshold.type,
        ) as VerifyResponse["decision_check"]["threshold"]["type"],
        value: asNumber(threshold.value),
        source: asString(
          threshold.source,
        ) as VerifyResponse["decision_check"]["threshold"]["source"],
        majority_country: asNullableString(threshold.majority_country),
      },
      cred_decision_score: asNumber(decisionCheck.cred_decision_score),
    },
    spoof_check: {
      status: asString(
        spoofCheck.status,
      ) as VerifyResponse["spoof_check"]["status"],
      decision: asString(
        spoofCheck.decision,
      ) as VerifyResponse["spoof_check"]["decision"],
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
