import fs from "fs";
import { performance } from "perf_hooks";

const API_URL = process.env.BENCHMARK_API_URL || "http://localhost:8002/verify";
const ITERATIONS = Number.parseInt(
  process.env.BENCHMARK_ITERATIONS || "20",
  10,
);
const INPUT_FILE = process.env.BENCHMARK_INPUT_FILE || "test-face.jpg";
const OUTPUT_FILE =
  process.env.BENCHMARK_OUTPUT_FILE || "benchmarks/reports/sdk-benchmark.json";

function average(values) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function distribution(values) {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

async function run() {
  fs.mkdirSync("benchmarks/reports", { recursive: true });

  const input = fs.readFileSync(INPUT_FILE).toString("base64");
  const durations = [];
  const decisions = [];

  for (let index = 0; index < ITERATIONS; index += 1) {
    const start = performance.now();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": `sdk-benchmark-${index}`,
        "X-Correlation-ID": "sdk-benchmark",
      },
      body: JSON.stringify({
        input_type: "image",
        image_base64: input,
      }),
    });

    const payload = await response.json();
    durations.push(performance.now() - start);

    if (!response.ok) {
      throw new Error(
        `Benchmark request failed with status ${response.status}`,
      );
    }

    decisions.push(payload.decision || "unknown");
  }

  const report = {
    benchmark_target: "sdk_end_to_end",
    iterations: ITERATIONS,
    avg_latency_ms: Number(average(durations).toFixed(4)),
    decisions_distribution: distribution(decisions),
    privacy: {
      contains_sensitive_data: false,
      contains_raw_inputs: false,
      contains_downstream_raw_responses: false,
    },
  };

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`SDK benchmark report written to ${OUTPUT_FILE}`);
}

run();
