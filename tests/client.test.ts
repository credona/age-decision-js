import { afterEach, describe, expect, it, vi } from "vitest";
import { AgeDecisionClient } from "../src/client";
import { HttpError, TimeoutError } from "../src/errors";
import { MOCK_API_BASE_URL } from "./constants";

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
        json: async () => ({
          status: "ok",
          service: "age-decision-api",
        }),
      }),
    );

    const client = new AgeDecisionClient({
      baseUrl: `${MOCK_API_BASE_URL}/`,
    });

    const result = await client.health();

    expect(result.status).toBe("ok");
    expect(fetch).toHaveBeenCalledWith(
      `${MOCK_API_BASE_URL}/health`,
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
          age_check: {
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
          liveness_check: {
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
        age_check: {
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
        liveness_check: {
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
          age_check: {
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
          liveness_check: {
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
        json: async () => ({
          status: "ok",
          service: "age-decision-api",
        }),
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
