import {
  HttpError,
  StandardizedApiError,
  TimeoutError,
  mapStandardizedApiError,
} from "./errors";
import {
  ClientOptions,
  HealthResponse,
  ProjectVersionResponse,
  ReadyResponse,
  VerifyRequest,
  VerifyResponse,
} from "./types";
import { generateId, sleep } from "./utils";

export class AgeDecisionClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly retryDelay: number;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.timeout = options.timeout ?? 5000;
    this.retries = options.retries ?? 0;
    this.retryDelay = options.retryDelay ?? 300;
  }

  health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health", {
      method: "GET",
    });
  }

  version(): Promise<ProjectVersionResponse> {
    return this.request<ProjectVersionResponse>("/version", {
      method: "GET",
    });
  }

  ready(): Promise<ReadyResponse> {
    return this.request<ReadyResponse>("/ready", {
      method: "GET",
    });
  }

  verify(input: VerifyRequest): Promise<VerifyResponse> {
    const requestId = input.requestId ?? generateId("req");
    const correlationId = input.correlationId ?? requestId;

    const body = {
      image_base64: input.imageBase64,
      age_threshold: input.ageThreshold,
      majority_country: input.majorityCountry,
    };

    return this.request<VerifyResponse>("/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": requestId,
        "X-Correlation-ID": correlationId,
      },
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        return await this.execute<T>(path, init);
      } catch (error) {
        lastError = error;

        if (!this.shouldRetry(error, attempt)) {
          throw error;
        }

        await sleep(this.retryDelay);
      }
    }

    throw lastError;
  }

  private async execute<T>(path: string, init: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
      });

      if (!response.ok) {
        const bodyText = await response.text();
        const mapped = mapStandardizedApiError(response.status, bodyText);
        if (mapped) {
          throw mapped;
        }
        throw new HttpError(
          response.status,
          bodyText || response.statusText,
          bodyText,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new TimeoutError(this.timeout);
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private shouldRetry(error: unknown, attempt: number): boolean {
    if (attempt >= this.retries) {
      return false;
    }

    if (error instanceof TimeoutError) {
      return true;
    }

    if (error instanceof HttpError) {
      return error.status >= 500;
    }

    if (error instanceof StandardizedApiError) {
      return error.status >= 500;
    }

    return true;
  }
}
