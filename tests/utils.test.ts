import { describe, it, expect } from "vitest";
import { generateId, sleep } from "../src/utils";

describe("utils", () => {
  it("should generate unique ids", () => {
    const id1 = generateId("test");
    const id2 = generateId("test");

    expect(id1).not.toBe(id2);
    expect(id1.startsWith("test-")).toBe(true);
  });

  it("should sleep", async () => {
    await expect(sleep(1)).resolves.toBeUndefined();
  });
});
