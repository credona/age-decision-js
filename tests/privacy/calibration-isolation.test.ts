import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SOURCE_DIRS = ["src"];

const FORBIDDEN_SDK_CALIBRATION_PATH_PARTS = [
  "calibration",
  "policy-loader",
  "policy_reader",
  "private-policy",
  "private-calibration",
  "bundle-loader",
];

const FORBIDDEN_PRIVATE_CALIBRATION_TOKENS = [
  "API_CALIBRATION_POLICY_PATH",
  "API_CALIBRATION_PUBLIC_KEY_B64",
  "API_CALIBRATION_REQUIRED",
  "CORE_CALIBRATION_POLICY_PATH",
  "ANTISPOOF_CALIBRATION_POLICY_PATH",
  "private_payload",
  "calibration_parameters",
  "payload_hash",
  "signature",
  "ed25519",
  "sha256",
  "minimum_allow_score",
  "cred_global_score_offset",
  "cred_global_score_floor",
  "cred_global_score_ceiling",
  "final_score_offset",
  "final_score_floor",
  "final_score_ceiling",
];

function listFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }

  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...listFiles(absolutePath));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function readSourceFiles(): Array<{ file: string; content: string }> {
  return SOURCE_DIRS.flatMap(listFiles)
    .filter((file) => /\.(ts|tsx|js|mjs|cjs)$/.test(file))
    .map((file) => ({
      file,
      content: fs.readFileSync(file, "utf8"),
    }));
}

describe("SDK calibration isolation policy", () => {
  it("does not contain calibration source folders or private policy loaders", () => {
    const files = readSourceFiles();

    for (const { file } of files) {
      const normalized = file.replaceAll("\\", "/").toLowerCase();

      for (const forbidden of FORBIDDEN_SDK_CALIBRATION_PATH_PARTS) {
        expect(normalized.includes(forbidden)).toBe(false);
      }
    }
  });

  it("does not reference runtime private calibration controls or internals in SDK source", () => {
    const files = readSourceFiles();
    const violations: string[] = [];

    for (const { file, content } of files) {
      for (const token of FORBIDDEN_PRIVATE_CALIBRATION_TOKENS) {
        if (content.includes(token)) {
          violations.push(`${file}: ${token}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("does not expose private calibration artifacts through package files", () => {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const files = packageJson.files ?? [];

    expect(files).toEqual([
      "dist",
      "README.md",
      "LICENSE",
      "project.json",
      "compatibility.json",
    ]);

    const serialized = JSON.stringify(packageJson);

    expect(serialized).not.toContain("calibration");
    expect(serialized).not.toContain("policy");
    expect(serialized).not.toContain("signature");
    expect(serialized).not.toContain("sha256");
  });
});
