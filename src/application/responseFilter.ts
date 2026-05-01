import { VerifyResponse } from "../domain/types";

export function filterVerifyResponse(payload: unknown): VerifyResponse {
  return payload as VerifyResponse;
}
