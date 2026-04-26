export interface ClientOptions {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface VerifyRequest {
  imageBase64: string;
  ageThreshold?: number;
  ageMargin?: number;
  confidenceThreshold?: number;
  country?: string;
  requestId?: string;
  correlationId?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface ReadyServiceStatus {
  status: string;
  url?: string;
}

export interface ReadyResponse {
  status: string;
  service: string;
  core?: ReadyServiceStatus;
  antispoof?: ReadyServiceStatus;
}

export interface ErrorDetail {
  code: string;
  message: string;
}

export interface ErrorResponse {
  request_id: string;
  correlation_id: string;
  error: ErrorDetail;
}

export interface AgeCheckResponse {
  status: "passed" | "failed" | "unknown" | string;
  decision: "allow" | "deny" | string;
  reason?: string | null;
  estimated_age?: number | null;
  confidence?: number | null;
  is_adult?: boolean | null;
  cred_decision_score: number;
}

export interface LivenessCheckResponse {
  status: "passed" | "failed" | "unknown" | string;
  decision: "allow" | "deny" | string;
  reason?: string | null;
  confidence?: number | null;
  is_real?: boolean | null;
  spoof_detected?: boolean | null;
  cred_antispoof_score: number;
}

export interface PrivacyMetadataResponse {
  image_stored: boolean;
  biometric_template_stored: boolean;
  raw_image_logged: boolean;
  downstream_raw_response_exposed: boolean;
  retention_policy: string;
}

export interface ZkProofMetadataResponse {
  zk_ready: boolean;
  proof_type: string;
  proof_status: string;
  statement: string;
}

export interface VerifyResponse {
  request_id: string;
  correlation_id: string;
  decision: "allow" | "deny" | "review" | "unknown" | string;

  cred_global_score: number;

  /**
   * Temporary compatibility alias for cred_global_score.
   */
  cred_score: number;

  age_check: AgeCheckResponse;
  liveness_check: LivenessCheckResponse;

  privacy: PrivacyMetadataResponse;
  zk_proof: ZkProofMetadataResponse;

  reason?: string | null;
}
