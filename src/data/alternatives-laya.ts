import type { Alternative } from "@/data/alternatives-types";
import { alternativeSlugs } from "@/data/alternatives-slugs";
import {
  alternativesLastVerified,
  decisionIndexSource,
  githubAdoption,
  hfAdoption,
  jevDecisionIndex,
  jevHostedPrice,
  typesafeDocsSource,
} from "@/data/alternatives-shared";

/** Laya positioned as a Jev alternative for the compare guide upgrade path. */
export function layaCompareAsAlternative(): Alternative {
  const slug = "laya";
  const compareSeoTitle = "Laya vs Jev: open weights or a hosted API";
  const compareSeoDescription =
    "Searching Jev vs Laya? Laya is open weights you run yourself. Jev is the hosted decision API. Latency, cost, privacy, and when using both is the sane move.";

  return {
    slug,
    displayName: "Laya",
    seoTitle: compareSeoTitle,
    seoDescription: compareSeoDescription,
    h1: "Laya vs Jev: open weights or a hosted API",
    keyPoint:
      "Pick Laya when you need open weights on your own machines. Pick hosted Jev when you want a managed decision API and gateway routing. Using both is normal.",
    summary:
      "Convai Laya is an Apache 2.0 decision model family you download and run locally with the laya Python Router. TypeSafe Jev is the hosted System One API many agents already call through gateways. Both answer Choice, Score, and Noul style questions in one forward pass instead of generating chat prose. Laya wins evaluations driven by privacy, fine-tuning, and local latency when you own GPUs. Jev wins when you want supported HTTP, predictable billing, and large option sets without tuning head budgets yourself.",
    lastVerified: alternativesLastVerified,
    listingSlug: undefined,
    ecosystemSlugs: ["receptron-laya", "mizorewww-laya-mlx"],
    siblingSlugs: [...alternativeSlugs],
    facts: [
      {
        row: "Maker",
        them: "Convai Innovations",
        jev: "TypeSafe AI",
        sourceLabel: "Hugging Face model card",
        sourceUrl: "https://huggingface.co/convaiinnovations/laya",
      },
      {
        row: "First public release",
        them: "2024 to 2025 public checkpoints on Hugging Face",
        jev: "Hosted System One (ongoing)",
        sourceLabel: "GitHub upstream",
        sourceUrl: "https://github.com/NandhaKishorM/laya",
      },
      {
        row: "License / access",
        them: "Apache 2.0 checkpoints",
        jev: "Hosted API (weights not downloadable)",
        sourceLabel: "Hugging Face",
        sourceUrl: "https://huggingface.co/convaiinnovations/laya",
      },
      {
        row: "Hosted price (input)",
        them: "Self-host only (GPU and engineer time)",
        jev: jevHostedPrice(),
        sourceLabel: "TypeSafe docs",
        sourceUrl: "https://docs.typesafe.ai",
      },
      {
        row: "API shape",
        them: "laya.Router Python API (not identical wire to System One)",
        jev: "POST /v1/systemone",
        sourceLabel: "PyPI laya package",
        sourceUrl: "https://pypi.org/project/laya/",
      },
      {
        row: "Question types",
        them: "choice, score, noul JSON questions",
        jev: "Choice, Score, Noul",
        sourceLabel: "Model card",
        sourceUrl: "https://huggingface.co/convaiinnovations/laya",
      },
      {
        row: "Inputs",
        them: "Text / JSON state with per-checkpoint context limits",
        jev: "Structured state string",
        sourceLabel: "Model card",
        sourceUrl: "https://huggingface.co/convaiinnovations/laya",
      },
      {
        row: "Model sizes",
        them: "About 322M to 421M class public checkpoints",
        jev: "Hosted Jev (closed)",
        sourceLabel: "Model card",
        sourceUrl: "https://huggingface.co/convaiinnovations/laya",
      },
      {
        row: "Latency",
        them: "Vendor-reported tens of ms on GPU in public card; MLX community reports lower on Apple Silicon",
        jev: "Often hundreds of ms end-to-end hosted (third-party posts)",
        sourceLabel: "Laya vs Jev hub",
        sourceUrl: "https://jev.aitools.fyi/learn/laya-vs-jev/benchmarks-and-fairness",
      },
      {
        row: "Decision Index (public)",
        them: "Use Laya vs Jev benchmarks guide (vendor vs independent splits)",
        jev: jevDecisionIndex(),
        sourceLabel: "Decision Index snapshot",
        sourceUrl: "https://huggingface.co/spaces/multimodalart/jev-decision-index/resolve/main/data/v03.json",
      },
      {
        row: "Data handling",
        them: "Can run air-gapped after weight download",
        jev: "Processed under TypeSafe terms",
        sourceLabel: "TypeSafe docs",
        sourceUrl: "https://docs.typesafe.ai",
      },
      {
        row: "SDKs",
        them: "PyPI laya, community MLX and ONNX ports",
        jev: "typesafe_sdk, gateways, MCP ecosystem",
        sourceLabel: "PyPI",
        sourceUrl: "https://pypi.org/project/laya/",
      },
      {
        row: "Adoption signal",
        them: `${githubAdoption("NandhaKishorM/laya")}; ${hfAdoption("convaiinnovations/laya")}`,
        jev: "Vendor hosted (no public GitHub stars)",
        sourceLabel: "GitHub / Hugging Face API",
        sourceUrl: "https://github.com/NandhaKishorM/laya",
      },
    ],
    sections: [
      {
        h: "What Laya is",
        body:
          "Laya is Convai Innovations open-weight decision stack built around ModernBERT and mmBERT encoders. You declare questions and options in JSON, run one forward pass, and read probabilities. The recommended entrypoint is laya.Router, which routes English versus multilingual checkpoints so you do not accidentally run English-only weights on non-Latin scripts. Laya is not a chat model: it will not draft customer emails. That is why teams compare it to System One products like Jev instead of to general LLMs. We are independent writers on jev.aitools.fyi and do not represent Convai or TypeSafe.",
      },
      {
        h: "Accuracy and benchmarks",
        body:
          "Convai's Hugging Face card publishes vendor-reported accuracy comparisons against hosted Jev on selected public slices. Those tables are useful directionally but are not independent audits. Jev can lead on high-cardinality choice sets while Laya typed-decisions checkpoints lead on Convai workflow evals after fine-tuning. Argmax accuracy and calibrated probabilities are different KPIs. Read /learn/laya-vs-jev/benchmarks-and-fairness before you paste numbers into an SLA. Independent Decision Index scores in our metrics file cover hosted Jev; Laya comparisons belong in the Laya vs Jev hub where we separate vendor-reported from third-party harnesses.",
      },
      {
        h: "Fit and tradeoffs",
        body:
          "Choose Laya when state must stay on device or inside a VPC, when you want to fork or fine-tune checkpoints, when you already run GPU inference, or when local sub-50 ms decisions matter more than zero ops. The typed-decisions checkpoint targets invoice, security, and support triage style workflows Convai documents. Base English and multilingual checkpoints are not magic on those tasks without specialization. Router preload matters when you alternate languages; cold starts can cost seconds if you rebuild graphs each request.",
      },
      {
        h: "Pricing and ops",
        body:
          "Laya shifts spend to GPUs, storage, and engineer time instead of per-token API meters. Finops should include checkpoint updates, calibration passes, and on-call for inference nodes. Hosted Jev shifts spend to API keys, gateway fees, and vendor support. Hybrid stacks are common: Laya for volume filters, Jev for escalation paths that need large option sets or compliance review. Neither model eliminates monitoring: you still log disagreements, track threshold drift, and rehearse rollback.",
      },
      {
        h: "Migrating from hosted Jev",
        body:
          "There is no byte-for-byte API parity. Plan an adapter layer that maps your existing System One question maps into Laya JSON, then re-run calibration on your labels. Many teams run shadow traffic first.",
        code: {
          lang: "python",
          content: `# Hosted Jev (TypeSafe SDK) pseudocode
# client.systemone(state=state, questions=questions)

# Local Laya Router
from laya import Router
router = Router()
result = router.decide(state, questions=laya_questions)`,
        },
      },
      {
        h: "Ecosystem links",
        body:
          "Upstream SDK and weights live on GitHub and Hugging Face. Community ports include Laya-MLX on Apple Silicon and ONNX/Core ML tooling in the directory catalog. Compare Cloudflare clef if you want hosted inference on Workers AI, Jared Palmer Kev if you need POST /v1/systemone parity, and Von if you need a tiny fast encoder. Return to /learn/laya-vs-jev/compare for the full side-by-side narrative.",
      },
      {
        h: "Product-specific notes",
        body:
          "Laya's Router API is Python-first; gateways that expect POST /v1/systemone may need an adapter even when question semantics align. Apache 2.0 weights enable fine-tuning and air-gapped deploys that hosted Jev cannot mirror one-for-one. Model card parameter counts cover multiple public checkpoints; pin the exact revision you benchmark. MLX and ONNX community ports change latency profiles compared to upstream CUDA paths cited on the card. Many teams keep hosted Jev for vendor support while running Laya on high-volume pre-filters inside the VPC. Benchmark fairness requires matching state serialization, option order, and threshold policies across engines.",
      },
    ],
    whenChooseThem: [
      "Data must stay on prem or on device after download",
      "You want Apache 2.0 weights you can fine-tune",
      "You already operate GPU inference and calibration",
    ],
    whenChooseJev: [
      "You want api.typesafe.ai with gateway integrations",
      "Large option sets without tuning head_max_len yourself",
      "Vendor support and metered billing beat GPU ops",
    ],
    faq: [
      {
        question: "Is Laya a drop-in replacement for Jev?",
        answer:
          "No. APIs, context limits, option budgets, and calibration differ. Many teams run both. See /learn/laya-vs-jev/migration-and-coexistence.",
      },
      {
        question: "Is Laya faster than Jev?",
        answer:
          "Often on a warm local GPU in vendor and community benchmarks, but that is not the same as your production Jev path through TLS and auth.",
      },
      {
        question: "Which has better accuracy?",
        answer:
          "It depends on task, language, option count, and fine-tuning. Public tables mix benchmarks; read benchmarks-and-fairness in the Laya vs Jev hub.",
      },
      {
        question: "Does this page replace the Laya vs Jev compare guide?",
        answer:
          "No. This Alternative object powers structured compare upgrades. The long-form guide remains at /learn/laya-vs-jev/compare.",
      },
    ],
    sources: [
      {
        label: "Hugging Face: convaiinnovations/laya",
        url: "https://huggingface.co/convaiinnovations/laya",
      },
      {
        label: "GitHub: NandhaKishorM/laya",
        url: "https://github.com/NandhaKishorM/laya",
      },
      {
        label: "PyPI: laya",
        url: "https://pypi.org/project/laya/",
      },
      typesafeDocsSource,
      decisionIndexSource,
    ],
  };
}
