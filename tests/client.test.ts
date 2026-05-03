import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AgeDecisionClient } from "../src/client";
import {
  HttpError,
  StandardizedApiError,
  TimeoutError,
  mapStandardizedApiError,
} from "../src/errors";
import { MOCK_API_BASE_URL } from "./constants";

const project = JSON.parse(fs.readFileSync("project.json", "utf8"));

const HEALTH_RESPONSE = {
  status: "ok",
  service: "age-decision-api",
  version: project.version,
  contract_version: project.contract_version,
};

const VERSION_RESPONSE = {
  service_name: "age-decision-api",
  app_name: "Age Decision API",
  version: project.version,
  contract_version: project.contract_version,
  repository: "https://github.com/credona/age-decision-api",
  image: "ghcr.io/credona/age-decision-api",
};

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("AgeDecisionClient", () => {
  it("should call health endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => HEALTH_RESPONSE,
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: `${MOCK_API_BASE_URL}/`,
    });

    const result = await client.health();

    expect(result).toEqual(HEALTH_RESPONSE);
    expect(fetch).toHaveBeenCalledWith(
      `${MOCK_API_BASE_URL}/health`,
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should call version endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => VERSION_RESPONSE,
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    const result = await client.version();

    expect(result.version).toBe(project.version);
    expect(result.contract_version).toBe(project.contract_version);
    expect(fetch).toHaveBeenCalledWith(
      `${MOCK_API_BASE_URL}/version`,
      expect.objectContaining({
        method: "GET",
      }),
    );
  });

  it("should call verify endpoint with generated ids", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          request_id: "req-001",
          correlation_id: "corr-001",
          decision: "allow",
          cred_global_score: 0.8,
          decision_check: {
            status: "passed",
            decision: "allow",
            threshold: {
              type: "minimum_age",
              value: 18,
              source: "majority_country",
              majority_country: "FR",
            },
            cred_decision_score: 0.8,
          },
          spoof_check: {
            status: "passed",
            decision: "allow",
            is_real: true,
            spoof_detected: false,
            cred_antispoof_score: 0.99,
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
            statement:
              "The API is ready to prove a threshold decision without exposing the raw image, estimated age, or raw model scores.",
          },
          reason: null,
        }),
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    const result = await client.verify({
      imageBase64: "fake-base64",
      ageThreshold: 18,
      majorityCountry: "FR",
    });

    expect(result.decision).toBe("allow");
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("should propagate request and correlation ids to headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        request_id: "req-123",
        correlation_id: "corr-456",
        decision: "allow",
        cred_global_score: 1,
        decision_check: {
          status: "passed",
          decision: "allow",
          threshold: {
            type: "minimum_age",
            value: 18,
            source: "default",
            majority_country: null,
          },
          cred_decision_score: 1,
        },
        spoof_check: {
          status: "passed",
          decision: "allow",
          is_real: true,
          spoof_detected: false,
          cred_antispoof_score: 1,
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
          statement:
            "The API is ready to prove a threshold decision without exposing the raw image, estimated age, or raw model scores.",
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    await client.verify({
      imageBase64: "test",
      requestId: "req-123",
      correlationId: "corr-456",
    });

    const [, init] = fetchMock.mock.calls[0];

    expect(init.headers).toMatchObject({
      "X-Request-ID": "req-123",
      "X-Correlation-ID": "corr-456",
    });
  });

  it("should send correct v2 request payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    await client.verify({
      imageBase64: "abc",
      ageThreshold: 18,
      majorityCountry: "FR",
    });

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body as string);

    expect(body).toEqual({
      image_base64: "abc",
      age_threshold: 18,
      majority_country: "FR",
    });
  });

  it("should expose only cred_global_score as global score", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          request_id: "r",
          correlation_id: "r",
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
            },
            cred_decision_score: 0.9,
          },
          spoof_check: {
            status: "passed",
            decision: "allow",
            is_real: true,
            spoof_detected: false,
            cred_antispoof_score: 0.9,
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
            statement:
              "The API is ready to prove a threshold decision without exposing the raw image, estimated age, or raw model scores.",
          },
        }),
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    const result = await client.verify({
      imageBase64: "test",
    });

    expect(result.cred_global_score).toBe(0.9);
    expect("cred_score" in result).toBe(false);
  });

  it("should reject verify with StandardizedApiError when HTTP 400 envelope is standardized", async () => {
    const rawBody = JSON.stringify({
      request_id: "cid-req-400",
      correlation_id: "cid-corr-400",
      error: {
        code: "missing_image_base64",
        message: "Invalid request.",
      },
    });

    const textSpy = vi.fn(async () => rawBody);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: textSpy,
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    let caught: unknown;
    try {
      await client.verify({
        imageBase64: "",
        requestId: "cid-req-400",
        correlationId: "cid-corr-400",
      });
    } catch (error: unknown) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(StandardizedApiError);
    expect(caught).toMatchObject({
      status: 400,
      code: "missing_image_base64",
      message: "Invalid request.",
      requestId: "cid-req-400",
      correlationId: "cid-corr-400",
      body: rawBody,
    });

    expect(textSpy).toHaveBeenCalledOnce();
  });

  it("should reject verify with StandardizedApiError when HTTP 502 envelope is standardized", async () => {
    const rawBody = JSON.stringify({
      request_id: "cid-req-502",
      correlation_id: "cid-corr-502",
      error: {
        code: "downstream_service_error",
        message: "An upstream service error has occurred.",
      },
    });

    const textSpy = vi.fn(async () => rawBody);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        text: textSpy,
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    let caught: unknown;
    try {
      await client.verify({
        imageBase64: "Zm9v",
        requestId: "cid-req-502",
        correlationId: "cid-corr-502",
      });
    } catch (error: unknown) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(StandardizedApiError);
    expect(caught).toMatchObject({
      name: "StandardizedApiError",
      status: 502,
      code: "downstream_service_error",
      message: "An upstream service error has occurred.",
      requestId: "cid-req-502",
      correlationId: "cid-corr-502",
      body: rawBody,
    });

    expect(textSpy).toHaveBeenCalledOnce();
  });

  it("should reject verify with HttpError when HTTP 400 body is not a standardized envelope", async () => {
    const textSpy = vi.fn(async () => "Bad request");

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        text: textSpy,
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    await expect(client.verify({ imageBase64: "x" })).rejects.toBeInstanceOf(
      HttpError,
    );

    expect(textSpy).toHaveBeenCalledOnce();
  });

  it("should throw HttpError on non successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        statusText: "Unprocessable Entity",
        text: async () => "Invalid payload",
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
    });

    await expect(
      client.verify({
        imageBase64: "",
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should retry on server error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
        text: async () => "Service unavailable",
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => HEALTH_RESPONSE,
      });

    vi.stubGlobal("fetch", fetchMock);

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
      retries: 1,
      retryDelay: 1,
    });

    const result = await client.health();

    expect(result.status).toBe("ok");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should not retry on client error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () => "Bad request",
    });

    vi.stubGlobal("fetch", fetchMock);

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
      retries: 2,
      retryDelay: 1,
    });

    await expect(client.health()).rejects.toBeInstanceOf(HttpError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should throw TimeoutError when request times out", async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"));
            });
          }),
      ),
    );

    const client = new AgeDecisionClient({
      baseUrl: MOCK_API_BASE_URL,
      timeout: 100,
    });

    const promise = client.health().catch((error) => error);

    await vi.advanceTimersByTimeAsync(100);

    const error = await promise;

    expect(error).toBeInstanceOf(TimeoutError);
  });
});

describe("mapStandardizedApiError (v2.3.0 standardized API ErrorResponse)", () => {
  function assertForbiddenKeysAbsent(err: StandardizedApiError): void {
    const forbidden = ["estimated_age", "confidence", "cred_score"] as const;

    for (const key of forbidden) {
      expect(Object.prototype.hasOwnProperty.call(err, key)).toBe(false);
    }
  }

  it("maps HTTP 400 standardized envelope to StandardizedApiError", () => {
    const raw = JSON.stringify({
      request_id: "req-400",
      correlation_id: "corr-400",
      error: {
        code: "missing_image_base64",
        message: "Invalid request.",
      },
    });

    const err = mapStandardizedApiError(400, raw);

    expect(err).toBeInstanceOf(StandardizedApiError);

    assertForbiddenKeysAbsent(err!);

    expect(err!.status).toBe(400);
    expect(err!.code).toBe("missing_image_base64");
    expect(err!.message).toBe("Invalid request.");
    expect(err!.requestId).toBe("req-400");
    expect(err!.correlationId).toBe("corr-400");
    expect(err!.body).toBe(raw);
  });

  it("maps HTTP 502 standardized envelope to StandardizedApiError", () => {
    const raw = JSON.stringify({
      request_id: "req-502",
      correlation_id: "corr-502",
      error: {
        code: "downstream_service_error",
        message: "An upstream service error has occurred.",
      },
    });

    const err = mapStandardizedApiError(502, raw);

    expect(err).toBeInstanceOf(StandardizedApiError);

    assertForbiddenKeysAbsent(err!);

    expect(err!.status).toBe(502);
    expect(err!.code).toBe("downstream_service_error");
    expect(err!.message).toBe("An upstream service error has occurred.");
    expect(err!.requestId).toBe("req-502");
    expect(err!.correlationId).toBe("corr-502");
    expect(err!.body).toBe(raw);
  });

  it("returns null so callers can fallback to HttpError for malformed bodies", () => {
    const cases = [
      { status: 400 as const, body: "not-json{" },
      { status: 400 as const, body: "{}" },
      { status: 502 as const, body: "[]" },
      {
        status: 400 as const,
        body: JSON.stringify({
          request_id: "a",
          correlation_id: "b",
          error: {},
        }),
      },
    ];

    for (const { status, body } of cases) {
      expect(mapStandardizedApiError(status, body)).toBeNull();

      const httpErr = new HttpError(status, body || "Error", body);
      expect(httpErr).toBeInstanceOf(HttpError);
      expect(httpErr.status).toBe(status);
      expect(httpErr.body).toBe(body);
    }
  });

  it("rejects envelopes with forbidden or non-standard keys (privacy contract)", () => {
    const withTopLevelLeak = JSON.stringify({
      request_id: "r",
      correlation_id: "c",
      error: {
        code: "x",
        message: "Invalid request.",
      },
      estimated_age: 21,
    });

    expect(mapStandardizedApiError(400, withTopLevelLeak)).toBeNull();

    const withNestedLeak = JSON.stringify({
      request_id: "r",
      correlation_id: "c",
      error: {
        code: "x",
        message: "Invalid request.",
        confidence: 0.9,
      },
    });

    expect(mapStandardizedApiError(400, withNestedLeak)).toBeNull();
  });

  it("does not map non-400/502 even when envelope shape matches", () => {
    const raw = JSON.stringify({
      request_id: "r",
      correlation_id: "c",
      error: {
        code: "x",
        message: "Invalid request.",
      },
    });

    expect(mapStandardizedApiError(401, raw)).toBeNull();
    expect(mapStandardizedApiError(503, raw)).toBeNull();
  });
});
