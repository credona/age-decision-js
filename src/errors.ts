import type { ErrorResponse } from "./types";
import {
  STANDARDIZED_GATEWAY_ERROR_DETAIL_KEYS,
  STANDARDIZED_GATEWAY_ERROR_KEYS,
} from "./types";

export class AgeDecisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgeDecisionError";
  }
}

export class HttpError extends AgeDecisionError {
  readonly status: number;
  readonly body: string;

  constructor(status: number, message: string, body = "") {
    super(message);
    this.status = status;
    this.body = body;
    this.name = "HttpError";
  }
}

export class TimeoutError extends AgeDecisionError {
  readonly timeout: number;

  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`);
    this.timeout = timeout;
    this.name = "TimeoutError";
  }
}

/**
 * Typed gateway failure when HTTP body matches the strict standardized API envelope.
 *
 * Structured fields omit forbidden public payload keys ({@see mapStandardizedApiError} rejects extra keys).
 * `body` is the raw HTTP response body string (JSON as returned by the server).
 */
export class StandardizedApiError extends AgeDecisionError {
  readonly status: number;
  readonly code: string;
  readonly requestId: string;
  readonly correlationId: string;
  readonly body: string;

  constructor(status: number, envelope: ErrorResponse, rawBody: string) {
    super(envelope.error.message);
    this.name = "StandardizedApiError";
    this.status = status;
    this.code = envelope.error.code;
    this.requestId = envelope.request_id;
    this.correlationId = envelope.correlation_id;
    this.body = rawBody;
  }
}

function sortedKeys(record: Record<string, unknown>): string[] {
  return Object.keys(record).slice().sort();
}

function validateDetail(value: unknown): ErrorResponse["error"] | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const obj = value as Record<string, unknown>;

  const allowed = STANDARDIZED_GATEWAY_ERROR_DETAIL_KEYS;
  const keys = sortedKeys(obj);
  const allowedSorted = [...allowed].slice().sort();
  if (
    keys.length !== allowedSorted.length ||
    keys.join(",") !== allowedSorted.join(",")
  ) {
    return null;
  }

  if (typeof obj.code !== "string" || typeof obj.message !== "string") {
    return null;
  }

  return { code: obj.code as string, message: obj.message as string };
}

/** Strict standardized ErrorResponse envelope (no extra forbidden public fields). */
function validateStandardizedEnvelope(raw: unknown): ErrorResponse | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const root = raw as Record<string, unknown>;

  const allowedRoot = STANDARDIZED_GATEWAY_ERROR_KEYS;
  const rootKeys = sortedKeys(root);
  const allowedRootSorted = [...allowedRoot].slice().sort();
  if (
    rootKeys.length !== allowedRootSorted.length ||
    rootKeys.join(",") !== allowedRootSorted.join(",")
  ) {
    return null;
  }

  if (typeof root.request_id !== "string") {
    return null;
  }
  if (typeof root.correlation_id !== "string") {
    return null;
  }

  const detail = validateDetail(root.error);
  if (!detail) {
    return null;
  }

  return {
    request_id: root.request_id,
    correlation_id: root.correlation_id,
    error: detail,
  };
}

/**
 * Map HTTP failures to {@link StandardizedApiError} when status and body strictly match v2.3+ envelope.
 * Caller should fall back to {@link HttpError} when `null`.
 */
export function mapStandardizedApiError(
  status: number,
  rawBodyText: string,
): StandardizedApiError | null {
  if (!(status === 400 || status === 502)) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBodyText) as unknown;
  } catch {
    return null;
  }

  const envelope = validateStandardizedEnvelope(parsed);
  if (!envelope) {
    return null;
  }

  return new StandardizedApiError(status, envelope, rawBodyText);
}
