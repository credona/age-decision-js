export interface ClientOptions {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface VerifyRequest {
  imageBase64: string;
  ageThreshold?: number;
  country?: string;
  requestId?: string;
  correlationId?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
}

export interface ReadyResponse {
  status: string;
  service: string;
  core?: {
    status: string;
    url?: string;
  };
  antispoof?: {
    status: string;
    url?: string;
  };
}

export interface VerifyResponse {
  request_id: string;
  correlation_id: string;
  decision: "allow" | "deny" | "review" | "unknown" | string;

  age_check: {
    status: string;
    decision: string;
  };

  liveness_check: {
    status: string;
    decision: string;
  };

  cred_decision_score?: number;
  cred_antispoof_score?: number;

  reason?: string | null;
}
