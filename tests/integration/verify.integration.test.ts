import { describe, it, expect } from "vitest";
import { AgeDecisionClient, HttpError } from "../../src";

const client = new AgeDecisionClient({
  baseUrl: "http://age-decision-api:8000",
  timeout: 10000,
  retries: 10,
  retryDelay: 500,
});

describe("Integration - AgeDecision API", () => {
  it("should call real API health", async () => {
    const result = await client.health();

    expect(result.status).toBe("ok");
  });

  it("should call real API readiness", async () => {
    const result = await client.ready();

    expect(result.status).toBeDefined();
  });

  it("should reach real verify endpoint", async () => {
    await expect(
      client.verify({
        imageBase64: "fake-base64",
      }),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
