import type { FaqEntry } from "@/data/faq";

export type BenchmarkResultsTable = {
  title: string;
  columns: string[];
  rows: string[][];
};

export type BenchmarkResultsEntry = {
  slug: string;
  sourceUrl: string;
  /** ISO date when numbers were copied from the source */
  sourcedOn: string;
  summary: string;
  methodology?: string;
  tables: BenchmarkResultsTable[];
  faq?: FaqEntry[];
};

export const benchmarkResultsBySlug: Record<string, BenchmarkResultsEntry> = {
  "rorshopping-jev-on-a-laptop": {
    slug: "rorshopping-jev-on-a-laptop",
    sourceUrl: "https://github.com/rorshopping/jev-on-a-laptop",
    sourcedOn: "2026-09-20",
    summary:
      "Unofficial parallel constrained decoding study on Apple Silicon. Tables below are copied from the repository README measured on a 16 GB M5 MacBook Air unless noted.",
    methodology:
      "28-field fraud preset: naive JSON generation vs parallel field evaluation. Quality eval: 24 labeled cases, 3 fields, 72 decisions per model (quality-eval/). Head-to-head: TypeSafe public workflow examples, 343 question-pairs answered by every model (evals/RESULTS.md).",
    tables: [
      {
        title: "Latency and schema validity (28-field fraud preset)",
        columns: [
          "Model (4-bit)",
          "Naive JSON",
          "Parallel decisions",
          "Speedup",
          "Naive schema-valid?",
          "Parallel schema-valid?",
        ],
        rows: [
          ["Qwen2.5-1.5B", "3.3 s", "0.41 s", "7.9x", "No", "Yes"],
          ["Qwen2.5-7B", "11.9 s", "1.52 s", "7.9x", "No", "Yes"],
          ["Qwen3-8B", "14.3 s", "2.03 s", "7.0x", "No", "Yes"],
        ],
      },
      {
        title: "Quality eval (24 cases × 3 fields per model)",
        columns: [
          "Model",
          "Primary field accuracy",
          "All fields exact",
          "Latency per case",
        ],
        rows: [
          ["1.5B", "58%", "50%", "147 ms"],
          ["7B", "96%", "72%", "611 ms"],
          ["8B", "92%", "85%", "646 ms"],
        ],
      },
      {
        title: "Agreement on TypeSafe public workflow questions (343 pairs)",
        columns: ["Model", "Agreement", "Pairs"],
        rows: [
          ["Opus (published)", "89.8%", "308/343"],
          ["DeepSeek v4.1 Flash (max)", "89.5%", "307/343"],
          ["Sol (published)", "89.2%", "306/343"],
          ["Jev / TypeSafe (published)", "86.6%", "297/343"],
          ["local Qwen2.5-7B (M5 Air)", "73.8%", "253/343"],
          ["local Qwen3-8B (3 of 4 workflows)", "71.2%", "114/160"],
        ],
      },
    ],
    faq: [
      {
        question: "Is this the official Jev model?",
        answer:
          "No. The README states this repo is unofficial research reproducing parallel constrained decoding on a stock small model (Qwen-2.5-1B-RLCD engine), not TypeSafe's hosted Jev weights.",
      },
      {
        question: "What hardware were the main latency tables run on?",
        answer:
          "A 16 GB M5 MacBook Air, per the README section titled Measured results (M5 MacBook Air, 16 GB).",
      },
      {
        question: "How do I reproduce the benchmarks?",
        answer:
          "Clone the repo, run ./setup.sh then ./run_benchmark.sh (default Qwen2.5-1.5B-Instruct-4bit). Full JSON logs live under results/ in the repository.",
      },
      {
        question: "Can I compare these accuracy numbers to evals.typesafe.ai?",
        answer:
          "Carefully. The README explicitly warns the small rule-constructed quality eval is not comparable to TypeSafe's published workflow evals. The head-to-head table uses TypeSafe's public question set but still runs local Qwen weights, not hosted Jev.",
      },
    ],
  },

  "docxology-daf-jev": {
    slug: "docxology-daf-jev",
    sourceUrl: "https://github.com/docxology/daf-jev",
    sourcedOn: "2026-09-20",
    summary:
      "daf-jev ships evaluation and calibration tooling around the live System One API. The README documents batching efficiency from project benchmarks; run benchmarks/bench_calibration.py locally for live ECE and Brier numbers.",
    methodology:
      "Batch vs sequential calls documented in the README quickstart section. bench_calibration.py repeats choice and noul questions across states and writes output/benchmarks/calibration_<date>.json when JEV_API_KEY is set.",
    tables: [
      {
        title: "Documented batching efficiency (README)",
        columns: ["Strategy", "Relative speed", "Relative tokens"],
        rows: [
          ["Batched questions in one ask", "Up to ~18× faster vs sequential", "Sequential uses ~4× more tokens"],
        ],
      },
    ],
    faq: [
      {
        question: "What does daf-jev measure in its calibration benchmark?",
        answer:
          "bench_calibration.py repeats the same choice and noul questions per state, uses modal self-consistency as a correctness proxy, and computes expected calibration error, Brier score, and a reliability table via daf_jev.calibration.",
      },
      {
        question: "Do I need an API key to run the benchmarks?",
        answer:
          "bench_calibration.py skips gracefully when JEV_API_KEY is not set. Set JEV_API_KEY or TYPESAFE_API_KEY (or .env) for live model numbers.",
      },
      {
        question: "Is daf-jev only a benchmark repo?",
        answer:
          "No. It is a full Python client, composition patterns (confidence_gate, composite_score), evaluator harness, MCP server, and manuscript pipeline. Benchmarks are one slice of the toolkit.",
      },
    ],
  },

  "parallel-constrained-decoding-qwen2-5-1b-rlcd": {
    slug: "parallel-constrained-decoding-qwen2-5-1b-rlcd",
    sourceUrl:
      "https://huggingface.co/spaces/drinkmoonshine/parallel-constrained-decoding",
    sourcedOn: "2026-09-20",
    summary:
      "Hugging Face Space README benchmarks parallel constrained decoding with mlx-community/Qwen2.5-1.5B-Instruct-4bit on Apple Silicon M4 Max (macOS Sequoia).",
    methodology:
      "Scenarios compare autoregressive structured generation baselines to parallel constrained decoding with 100% schema validity claims. See the Space README Performance Benchmarks section.",
    tables: [
      {
        title: "Performance benchmarks (Apple Silicon M4 Max)",
        columns: [
          "Scenario",
          "Fields",
          "Autoregressive baseline",
          "Parallel constrained",
          "Latency speedup",
          "Syntax validity",
        ],
        rows: [
          [
            "Fintech fraud routing",
            "4",
            "420 ms (120 tok/s)",
            "75 ms",
            "5.6x",
            "100% guaranteed",
          ],
          [
            "Code security audit",
            "4",
            "380 ms (125 tok/s)",
            "68 ms",
            "5.6x",
            "100% guaranteed",
          ],
          [
            "High-cardinality tariff",
            "1 field (255 choices)",
            "500 ms (118 tok/s)",
            "89 ms",
            "5.6x",
            "100% guaranteed",
          ],
          [
            "Enterprise support triage",
            "28",
            "1,900 ms (130 tok/s)",
            "270 ms",
            "7.0x",
            "100% guaranteed",
          ],
        ],
      },
    ],
    faq: [
      {
        question: "How is this related to Jev?",
        answer:
          "The Space explores open-source parallel constrained decoding as an alternative decoding strategy in the same design family as typed System One decisions: bounded candidate sets evaluated in parallel rather than free-form JSON generation.",
      },
      {
        question: "What model and hardware produced the table?",
        answer:
          "README states mlx-community/Qwen2.5-1.5B-Instruct-4bit on an Apple Silicon M4 Max running macOS Sequoia.",
      },
      {
        question: "Where can I run the demo?",
        answer:
          "Open the Hugging Face Space at huggingface.co/spaces/drinkmoonshine/parallel-constrained-decoding or read the README in the Space files tab.",
      },
    ],
  },
};

export function getBenchmarkResults(slug: string): BenchmarkResultsEntry | undefined {
  return benchmarkResultsBySlug[slug];
}
