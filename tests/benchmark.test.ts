import { describe, expect, it } from "vitest";

function collectKeys(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectKeys);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nested]) => [
      key,
      ...collectKeys(nested),
    ]);
  }

  return [];
}

describe("SDK benchmark report privacy", () => {
  it("uses only aggregate privacy-safe fields", () => {
    const report = {
      benchmark_target: "sdk_end_to_end",
      iterations: 3,
      avg_latency_ms: 12.5,
      decisions_distribution: {
        allow: 1,
        deny: 2,
      },
      privacy: {
        contains_sensitive_data: false,
        contains_raw_inputs: false,
        contains_downstream_raw_responses: false,
      },
    };

    const keys = collectKeys(report);

    expect(keys).not.toContain("image_base64");
    expect(keys).not.toContain("payload");
    expect(keys).not.toContain("raw_response");
    expect(keys).not.toContain("downstream_response");
    expect(keys).not.toContain("threshold");
    expect(keys).not.toContain("confidence");
    expect(keys).not.toContain("estimated_age");
  });
});
