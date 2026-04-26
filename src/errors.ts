export class AgeDecisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgeDecisionError";
  }
}

export class HttpError extends AgeDecisionError {
  readonly status: number;
  readonly body: string;

  constructor(status: number, message: string, body = "") {
    super(message);
    this.status = status;
    this.body = body;
    this.name = "HttpError";
  }
}

export class TimeoutError extends AgeDecisionError {
  readonly timeout: number;

  constructor(timeout: number) {
    super(`Request timed out after ${timeout}ms`);
    this.timeout = timeout;
    this.name = "TimeoutError";
  }
}
