export const CHECK_STATUSES = {
  PASSED: "passed",
  FAILED: "failed",
  UNKNOWN: "unknown",
} as const;

export type CheckStatus = (typeof CHECK_STATUSES)[keyof typeof CHECK_STATUSES];

export const PUBLIC_DECISIONS = {
  ALLOW: "allow",
  DENY: "deny",
} as const;

export type PublicDecision =
  (typeof PUBLIC_DECISIONS)[keyof typeof PUBLIC_DECISIONS];
