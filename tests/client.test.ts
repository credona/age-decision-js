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
          age_check: {
            status: "passed",
            decision: "allow",
          },
          liveness_check: {
            status: "passed",
            decision: "allow",
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
      country: "FR",
    });

    expect(result.decision).toBe("allow");
    expect(fetch).toHaveBeenCalledOnce();
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
