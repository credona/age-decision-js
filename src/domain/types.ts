import type { CheckStatus, PublicDecision } from "./constants";

export interface ClientOptions {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export type InputType = "image" | "image_sequence" | "video";

export interface VerifyRequest {
  inputType?: InputType;
  imageBase64: string;
  ageThreshold?: number;
  majorityCountry?: string;
  requestId?: string;
  correlationId?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  contract_version: string;
}

export interface ProjectVersionResponse {
  service_name: string;
  package_name?: string;
  app_name: string;
  version: string;
  contract_version: string;
  repository: string;
  npm_package?: string;
  image?: string;
}

export interface ReadyServiceStatus {
  status: string;
  url?: string;
}

export interface ReadyResponse {
  status: string;
  service: string;
  version: string;
  contract_version: string;
  core?: ReadyServiceStatus;
  antispoof?: ReadyServiceStatus;
}

export interface ErrorDetail {
  code: string;
  message: string;
}

/** Standard gateway JSON failure shape (privacy-first envelope). */
export interface ErrorResponse {
  request_id: string;
  correlation_id: string;
  error: ErrorDetail;
}

/**
 * Root keys permitted on standardized API failures (reject anything else).
 * Used together with HTTP status when mapping standardized gateway errors (v2.3+ SDK).
 */
export const STANDARDIZED_GATEWAY_ERROR_KEYS = Object.freeze([
  "request_id",
  "correlation_id",
  "error",
]);

/**
 * Keys permitted inside `error` for standardized failures.
 */
export const STANDARDIZED_GATEWAY_ERROR_DETAIL_KEYS = Object.freeze([
  "code",
  "message",
]);

export interface ThresholdPolicy {
  type: "minimum_age";
  value: number;
  source: "explicit" | "majority_country" | "default";
  majority_country?: string | null;
}

export interface DecisionCheckResponse {
  status: CheckStatus;
  decision: PublicDecision;
  reason?: string | null;
  threshold: ThresholdPolicy;
  cred_decision_score: number;
}

export interface SpoofCheckResponse {
  status: CheckStatus;
  decision: PublicDecision;
  reason?: string | null;
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
  decision: PublicDecision;
  cred_global_score: number;
  decision_check: DecisionCheckResponse;
  spoof_check: SpoofCheckResponse;
  privacy: PrivacyMetadataResponse;
  zk_proof: ZkProofMetadataResponse;
  reason?: string | null;
}
