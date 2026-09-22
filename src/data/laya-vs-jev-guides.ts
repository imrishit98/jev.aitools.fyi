import type { FaqEntry } from "@/data/faq";

export type LayaVsJevSource = { label: string; url: string };

export type LayaVsJevSection = {
  h: string;
  body: string;
  code?: { lang: string; content: string };
};

export type LayaVsJevGuide = {
  slug: string;
  title: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  /** Short callout box at top of article */
  keyPoint: string;
  sections: LayaVsJevSection[];
  faq: FaqEntry[];
  relatedGuideSlugs: string[];
  relatedLearnSlugs: string[];
  sources: LayaVsJevSource[];
};

export const layaVsJevHubSlug = "laya-vs-jev";

export const layaVsJevGuideSlugs = [
  "compare",
  "what-is-laya",
  "laya-mlx-apple-silicon",
  "benchmarks-and-fairness",
  "migration-and-coexistence",
  "privacy-and-agents",
] as const;

export type LayaVsJevGuideSlug = (typeof layaVsJevGuideSlugs)[number];

export function layaVsJevGuidePath(slug?: string): string {
  if (!slug) return `/learn/${layaVsJevHubSlug}`;
  return `/learn/${layaVsJevHubSlug}/${slug}`;
}

export const layaVsJevHub = {
  title: "Laya vs TypeSafe Jev",
  tagline:
    "Open-weight typed decisions on your hardware versus hosted System One with calibrated probabilities in the cloud.",
  seoTitle: "Laya vs Jev: open local decisions vs hosted System One",
  seoDescription:
    "Compare Convai Laya (Apache 2.0 checkpoints, local inference) with TypeSafe Jev (hosted API). Latency caveats, benchmarks, Laya-MLX on Mac, migration patterns, and when to use both.",
  intro:
    "Laya is Convai Innovations' open-weight family of non-autoregressive decision models: Choice, Score, and Noul over structured state, one forward pass, no free-form generation. TypeSafe Jev is the proprietary hosted System One API many teams already wire into agents, gateways, and moderation pipelines. They solve similar judgment problems with different tradeoffs—weights, ops, context budgets, and who runs the GPU. This hub is independent editorial on jev.aitools.fyi (aitools.fyi / Rishit Patel). It is not authored by TypeSafe or Convai; we link primary sources and flag where vendor or single-machine benchmarks should not be read as independent proof.",
  faq: [
    {
      question: "Is Laya a drop-in replacement for Jev?",
      answer:
        "No. APIs, context limits, default option budgets, calibration workflows, and operational ownership differ. Laya ships open checkpoints you host; Jev is a managed POST /v1/systemone service with published gateway integrations. Many teams use Laya locally for latency-sensitive gates and Jev where they want hosted scale and TypeSafe's release cadence—see migration-and-coexistence.",
    },
    {
      question: "Who makes Laya and who makes Jev?",
      answer:
        "Laya model weights and the upstream Python SDK are from Convai Innovations (Apache 2.0 on Hugging Face). Laya-MLX is a separate community MLX port for Apple Silicon, not an official Convai release. Jev is TypeSafe's commercial System One product; this directory curates the ecosystem but does not speak for TypeSafe.",
    },
    {
      question: "Can I trust latency numbers in blog posts?",
      answer:
        "Treat them as directional only. Local GPU milliseconds (Laya on T4 or M3 Max) are not comparable to end-to-end hosted API latency (network, auth, batching, region). Convai's Hugging Face card cites third-party Jev p50 figures (~236–276 ms) alongside self-measured Laya GPU times (~33 ms on T4)—different measurement stacks. Read benchmarks-and-fairness before quoting numbers in production SLAs.",
    },
    {
      question: "Where is the snake demo with Laya-MLX?",
      answer:
        "The directory showcase embeds Lonely__MH's laya-mlx snake clip on Apple Silicon: /showcase?demo=laya-mlx-lonely-mh. It illustrates local decision loops; it is not a benchmark certificate.",
    },
    {
      question: "Does this site host Laya weights?",
      answer:
        "No. We link Hugging Face, GitHub, and PyPI. Download and license compliance stay on your side.",
    },
  ] satisfies FaqEntry[],
};

const sharedSources: LayaVsJevSource[] = [
  {
    label: "Hugging Face — convaiinnovations/laya (model card & benchmarks)",
    url: "https://huggingface.co/convaiinnovations/laya",
  },
  {
    label: "GitHub — NandhaKishorM/laya (upstream SDK)",
    url: "https://github.com/NandhaKishorM/laya",
  },
  {
    label: "PyPI — laya package",
    url: "https://pypi.org/project/laya/",
  },
  {
    label: "TypeSafe docs — System One / Jev API",
    url: "https://docs.typesafe.ai",
  },
  {
    label: "Laya-MLX — BENCHMARKS.md (M3 Max, independent port)",
    url: "https://github.com/mizorewww/laya-mlx/blob/main/BENCHMARKS.md",
  },
];

const guides: Record<LayaVsJevGuideSlug, LayaVsJevGuide> = {
  compare: {
    slug: "compare",
    title: "Laya vs Jev: comparison overview",
    tagline:
      "Same typed primitives, different deployment model—use this matrix before you rip out a working Jev integration.",
    seoTitle: "Laya vs Jev comparison: access, latency, cost, privacy",
    seoDescription:
      "Side-by-side Laya (open Apache 2.0 weights, self-host) vs TypeSafe Jev (hosted API): latency caveats, context, fine-tuning, ops, and when each fits routing and agent gates.",
    keyPoint:
      "Pick Laya when you need on-prem or edge inference with open weights; pick Jev when you want a managed System One API, gateway routing, and TypeSafe's hosted release cycle. Hybrid stacks are common.",
    sections: [
      {
        h: "What both products do",
        body:
          "Laya and Jev answer parallel typed questions—choice among labels, ordinal score, and noul-style probabilities—over JSON or text state. Neither is a chat model: they do not autoregressively draft user-facing paragraphs. That shared shape is why builders compare them to System One-style gates instead of to GPT-class generators. For Jev vocabulary, start with /learn/jev-typesafe and /learn/system-one; for Laya architecture, see what-is-laya in this hub.",
      },
      {
        h: "Comparison at a glance",
        body:
          "Access: Laya publishes Apache 2.0 checkpoints on Hugging Face (English, multilingual, typed-decisions fine-tune). Jev is API-only via TypeSafe (and partners such as Vercel AI Gateway). Weights: Laya is open; Jev weights are not downloadable for self-host. Latency: Convai reports ~33–40 ms per question on a Tesla T4 for Laya; Laya-MLX reports ~7–16 ms P50 for short inputs on an M3 Max (see laya-mlx-apple-silicon). Jev's hosted p50 is often quoted around hundreds of milliseconds end-to-end in third-party posts—never compare those numbers without reading benchmarks-and-fairness. Context: English Laya defaults to 512 tokens with a split between state and option head budget; multilingual and typed-decisions checkpoints extend toward 1k–8k encoder context with tuning. Jev publishes its own context and option limits in TypeSafe docs—verify there rather than assuming parity. Cost: Laya inference cost is mostly your GPUs and engineers; Jev is metered API pricing. Fine-tuning: Laya expects you to specialize checkpoints (typed-decisions is the documented workflow benchmark); Jev improvements ship as hosted model versions. Privacy: Laya can run air-gapped after download; Jev sends state to TypeSafe infrastructure unless you use a private contract. Ops: Laya means Router preload, VRAM, calibration passes, and checkpoint updates; Jev means keys, quotas, and gateway config.",
      },
      {
        h: "Accuracy and calibration",
        body:
          "Convai's public card reports higher argmax accuracy on some public slices for routed Laya than published Jev 1.13.0 figures, but also notes Jev leads on soft distribution matching and high-cardinality choice sets (for example Banking77-style dozens of labels at default token budgets). Raw expected calibration error differs before temperature fitting—Laya documents post-hoc temperature scaling to reach lower ECE on their evals. Argmax accuracy and calibrated probabilities are not the same KPI; moderation pipelines care about the latter. Do not treat vendor-published comparison tables as independent audits.",
      },
      {
        h: "When to choose Laya",
        body:
          "Choose Laya when you must keep data on device or inside a VPC you control, when you want to fork or fine-tune weights, when you already run GPU inference for other models, or when sub-50 ms local decisions matter more than zero ops. The typed-decisions checkpoint is aimed at invoice, security, and support-triage style workflows Convai fine-tuned—base English/multilingual checkpoints are not zero-shot miracles on those tasks without specialization.",
      },
      {
        h: "When to choose Jev",
        body:
          "Choose Jev when you want a supported HTTP API, predictable billing, gateway integrations (see /learn/vercel-ai-gateway), and large option sets without tuning head_max_len yourself. Teams already standardized on TypeSafe SDKs, MCP servers, and agent skills benefit from staying on the hosted path unless privacy or unit economics force self-host.",
      },
      {
        h: "When to use both",
        body:
          "A practical pattern is local Laya for high-volume pre-filters or game ticks and hosted Jev for escalation paths, audit-heavy workflows, or option sets you do not want to maintain weights for. See migration-and-coexistence and the showcase snake demo for a feel for local loop speed: /showcase?demo=laya-mlx-lonely-mh.",
      },
    ],
    faq: [
      {
        question: "Is Laya faster than Jev?",
        answer:
          "Often on a warm local GPU, yes in vendor and community benchmarks—but those are not the same measurement as your production Jev path through TLS, auth, and region. Size SLAs using your own traces.",
      },
      {
        question: "Which has better accuracy?",
        answer:
          "It depends on task, language, option count, and whether you fine-tune Laya. Public tables mix benchmarks; Jev leads on some high-cardinality sets while Laya's typed-decisions checkpoint leads on Convai's typed workflow eval. See benchmarks-and-fairness.",
      },
    ],
    relatedGuideSlugs: ["what-is-laya", "benchmarks-and-fairness", "migration-and-coexistence"],
    relatedLearnSlugs: ["jev-typesafe", "system-one", "jev-vs-llm-classification"],
    sources: sharedSources,
  },
  "what-is-laya": {
    slug: "what-is-laya",
    title: "What is Laya?",
    tagline:
      "Convai's open-weight System 1-style decision family: one forward pass, Choice / Score / Noul, Apache 2.0.",
    seoTitle: "What is Laya? Open typed-decision models explained",
    seoDescription:
      "Laya model family by Convai Innovations: ModernBERT and mmBERT checkpoints, Router mode, RLCD training, typed questions, and honest limits from the Hugging Face model card.",
    keyPoint:
      "Laya is a non-autoregressive decision stack—not a small LLM. You define questions and options; the model returns structured answers with probabilities in one pass.",
    sections: [
      {
        h: "Publisher and license",
        body:
          "Laya is released by Convai Innovations under Apache 2.0 on Hugging Face (convaiinnovations/laya). The upstream SDK and training code live at github.com/NandhaKishorM/laya with a PyPI package named laya. This directory is independent; we do not represent Convai.",
      },
      {
        h: "Checkpoints in the family",
        body:
          "Three public checkpoints share one hub repo: the English root model (ModernBERT-large, ~421M params, 512 context) for English guardrails and email-style triage; laya-multilingual (mmBERT-base, ~322M, 1024 context, up to 8k encoder RoPE) for 100+ languages; and laya-typed-decisions (ModernBERT-large, 1024 context) fine-tuned for four workflow-style task groups Convai documents on the card. Only the subfolder you request downloads.",
      },
      {
        h: "Primitives: choice, score, noul",
        body:
          "Questions are declared as JSON: choice picks among criteria keys with softmax over option markers; score returns an ordinal rating; noul returns a calibrated probability for a yes/no style statement. This mirrors the TypeSafe Choice, Score, and Noul vocabulary described in /learn/jev-typesafe—useful for mental mapping, not a guarantee of API compatibility.",
      },
      {
        h: "Router mode",
        body:
          "The recommended Python entrypoint is laya.Router, which detects script and language in sub-millisecond Python and routes to English or multilingual checkpoints. Convai documents large accuracy gaps when English-only weights see non-Latin scripts, so routing is a safety feature—not just convenience. Preload checkpoints in memory to avoid multi-second cold rebuilds when languages alternate.",
      },
      {
        h: "Training objective",
        body:
          "Convai describes RLCD (reinforcement learning for calibrated decisions): the policy is rewarded with strictly proper scoring rules so honest probabilities maximize expected reward. That aligns with why teams want System One models instead of parsing chat text—but you still need domain temperature fitting on your data before trusting thresholds.",
      },
      {
        h: "Honest limits (from the model card)",
        body:
          "Base English and multilingual checkpoints are weak on Convai's typed-decisions benchmark without fine-tuning; the 0.766 accuracy figure belongs to laya-typed-decisions, not the root weights. High-cardinality choice questions exhaust per-option token budgets unless you raise head_max_len or split hierarchically. Ordinal score tasks are weaker than choice/noul on some public sets. English-only root should not be used for non-English production without multilingual or routed paths.",
      },
    ],
    faq: [
      {
        question: "Is Laya generative AI?",
        answer:
          "No. It does not continue text token by token. Outputs are discrete decisions and probabilities over your schema.",
      },
      {
        question: "How do I install it?",
        answer:
          "pip install laya, then laya.load() or Router(preload=True) per the Hugging Face quickstart. Set USE_TF=0 if Transformers TensorFlow probing hangs your environment.",
      },
      {
        question: "Is Laya the same as Jev?",
        answer:
          "Same product category (typed parallel decisions), different vendor, license, and hosting model. Compare in /learn/laya-vs-jev/compare.",
      },
    ],
    relatedGuideSlugs: ["compare", "laya-mlx-apple-silicon"],
    relatedLearnSlugs: ["system-one", "jev-typesafe"],
    sources: sharedSources,
  },
  "laya-mlx-apple-silicon": {
    slug: "laya-mlx-apple-silicon",
    title: "Laya-MLX on Apple Silicon",
    tagline:
      "Community MLX runtime for local Laya inference—fast short decisions, not an official Convai build.",
    seoTitle: "Laya-MLX on Apple Silicon: local MLX inference guide",
    seoDescription:
      "Independent laya-mlx port: MLX on M3 Max benchmarks, 7–16 ms short-decision P50, install pointers, parity notes, and caveats vs PyTorch and hosted Jev.",
    keyPoint:
      "Laya-MLX (github.com/mizorewww/laya-mlx) reimplements Laya inference with Apple's MLX framework. It is not published by Convai; verify behavior against upstream when you upgrade checkpoints.",
    sections: [
      {
        h: "What Laya-MLX adds",
        body:
          "The upstream Laya stack typically uses PyTorch and Transformers. Laya-MLX ports weights and the decision heads to MLX so developers on Mac can run inference without a CUDA box. Tokenization still uses Hugging Face tokenizers; the project documents numerical parity checks against upstream on fixed fixtures.",
      },
      {
        h: "Published latency (M3 Max)",
        body:
          "BENCHMARKS.md in the laya-mlx repo measures end-to-end short-input latency on Apple M3 Max (40-core GPU, 128 GiB RAM): for one question, MLX FP16 P50 around 13.4 ms (English laya) and 7.4 ms (laya-multilingual), with model load excluded. Ten-question batches and full-context runs are much slower. These numbers are one machine, one OS build—not a guarantee on M2, M4, or laptops with less memory.",
      },
      {
        h: "Comparison to PyTorch MPS on the same Mac",
        body:
          "The same document shows PyTorch MPS FP32 somewhat slower than MLX FP16 on identical hashes—expected when FP16 is allowed. Throughput rows use repeated question templates; distinct-question production mixes may differ.",
      },
      {
        h: "Relationship to cloud Jev",
        body:
          "Community posts (including our showcase blurb for Lonely__MH's snake demo) sometimes contrast local tens-of-ms inference with hosted Jev latency. That is apples to oranges: no TLS, no multi-tenant queue, different hardware class. Use Laya-MLX when Mac-local loops matter; do not claim a universal 50× speedup over your Jev region without measuring.",
      },
      {
        h: "Getting started",
        body:
          "Clone github.com/mizorewww/laya-mlx, follow uv sync extras in the README, and pin upstream Laya revisions the benchmark scripts expect. PyPI lists laya-mlx for packaged installs. For Convai's official path on Linux/GPU, use the laya PyPI package instead.",
      },
      {
        h: "Showcase: snake on MLX",
        body:
          "jev.aitools.fyi embeds a public X clip where snake ticks use local Laya decisions—useful for sensing decision frequency, not for SLA proof: /showcase?demo=laya-mlx-lonely-mh.",
      },
    ],
    faq: [
      {
        question: "Is Laya-MLX official?",
        answer:
          "No. Convai ships the PyTorch/Hugging Face stack. Laya-MLX is an independent MLX port maintained separately.",
      },
      {
        question: "Do I need PyTorch to run Laya-MLX?",
        answer:
          "Inference is MLX-first; the repo uses PyTorch MPS as a reference backend in benchmarks, not as a production requirement for MLX mode.",
      },
      {
        question: "Will MLX match T4 GPU numbers on the HF card?",
        answer:
          "Different hardware. HF documents ~33 ms on Tesla T4 for routed GPU inference; MLX documents ~7–16 ms P50 short paths on M3 Max. Neither predicts your laptop under load.",
      },
    ],
    relatedGuideSlugs: ["what-is-laya", "benchmarks-and-fairness"],
    relatedLearnSlugs: ["where-to-run-jev"],
    sources: [
      ...sharedSources,
      {
        label: "GitHub — mizorewww/laya-mlx",
        url: "https://github.com/mizorewww/laya-mlx",
      },
      {
        label: "PyPI — laya-mlx",
        url: "https://pypi.org/project/laya-mlx/",
      },
      {
        label: "Third-party explainer — What is Laya-MLX? (aiidelist.com)",
        url: "https://aiidelist.com/blog/what-is-laya-mlx",
      },
    ],
  },
  "benchmarks-and-fairness": {
    slug: "benchmarks-and-fairness",
    title: "Benchmarks and fairness",
    tagline:
      "How to read Convai's Laya vs Jev tables, MLX laptop numbers, and third-party latency posts without fooling yourself.",
    seoTitle: "Laya vs Jev benchmarks: how to read the numbers fairly",
    seoDescription:
      "Vendor benchmarks, T4 GPU vs hosted API latency, calibration vs accuracy, independent citations, and what jev.aitools.fyi will not claim.",
    keyPoint:
      "Self-published comparison tables are useful hypotheses, not independent audits. Measure your state, option counts, and regions on your stack.",
    sections: [
      {
        h: "What Convai publishes on Hugging Face",
        body:
          "The convaiinnovations/laya model card includes speed tables on Tesla T4 and a Laya (routed) vs TypeSafe Jev 1.13.0 section. Convai states Jev figures come from third-party published measurements without replicating them in-house. Laya figures come from their Router predict path on identical question sets. Sample sizes, prompts, and label spaces differ per row—read the card footnotes and BENCHMARKS.md in the Laya repo before citing a single accuracy delta.",
      },
      {
        h: "Latency: local forward pass vs hosted E2E",
        body:
          "Laya and Laya-MLX benchmarks typically time model forward passes (sometimes plus tokenization and calibration) on a warm process. Hosted Jev latency includes client SDK, DNS, TLS, API gateway, batching, and geographic distance. A 33 ms T4 forward pass is not comparable to a 250 ms p50 API trace from another author's blog. When evaluating agents, measure wall clock from your orchestrator.",
      },
      {
        h: "Accuracy vs calibration",
        body:
          "Convai notes Laya typed-decisions can beat Jev on argmax accuracy while Jev leads on soft accuracy against teacher distributions. Expected calibration error improves after Laya temperature fitting—compare ECE only when both sides use equivalent post-processing on your holdout. /learn/jev-vs-llm-classification explains why thresholds need probabilities, not just top-1 labels.",
      },
      {
        h: "High-cardinality choice sets",
        body:
          "Banking77-style benchmarks show Jev ahead when dozens of labels compete for a fixed option-token budget. Laya documents mitigations (raise head_max_len, hierarchical choice). If your product has 50+ simultaneous options, reproduce the benchmark with your schema before switching vendors.",
      },
      {
        h: "Third-party writeups",
        body:
          "Blog posts such as aiidelist.com's Laya-MLX explainer and retailer-hosted AI hubs (for example ZimaSpace's Laya overview) summarize public repos—they are not peer review. Use them for install pointers and vocabulary, then verify against GitHub READMEs and HF cards.",
      },
      {
        h: "What we will not claim on this site",
        body:
          "jev.aitools.fyi does not run independent head-to-head evals between Laya and Jev. We do not host weights or TypeSafe keys. Any showcase tweet is anecdotal social proof, not a benchmark suite.",
      },
    ],
    faq: [
      {
        question: "Did TypeSafe endorse Convai's comparison table?",
        answer:
          "We have no indication of independent TypeSafe endorsement. Treat it as Convai's synthesis of public Jev numbers plus their own Laya runs.",
      },
      {
        question: "What is a fair bake-off?",
        answer:
          "Same held-out prompts, same option definitions, same preprocessing, measured E2E on your deployment paths, with calibration tuned per model on a validation split you control.",
      },
    ],
    relatedGuideSlugs: ["compare", "laya-mlx-apple-silicon"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "system-one"],
    sources: [
      ...sharedSources,
      {
        label: "ZimaSpace — Laya open-source decision model overview",
        url: "https://shop.zimaspace.com/blogs/tech-ai-hub/laya-open-source-decision-model-local-ai",
      },
      {
        label: "aiidelist.com — What is Laya-MLX?",
        url: "https://aiidelist.com/blog/what-is-laya-mlx",
      },
    ],
  },
  "migration-and-coexistence": {
    slug: "migration-and-coexistence",
    title: "Migration and coexistence",
    tagline:
      "Map Jev-shaped gates to Laya checkpoints without breaking production—and know when not to migrate.",
    seoTitle: "Migrate or pair Laya with Jev: hybrid typed-decision patterns",
    seoDescription:
      "Coexistence architectures: local Laya pre-filter plus hosted Jev escalation, schema mapping, calibration, and ops checklists when moving off API-only System One.",
    keyPoint:
      "Migration is a schema, calibration, and ops project—not a find-replace on endpoint URLs.",
    sections: [
      {
        h: "Start from your Jev contract",
        body:
          "Inventory parallel questions, state shape, thresholds, and escalation rules in your existing TypeSafe client (/learn/jev-typesafe). Note option counts and languages. That map tells you whether laya-typed-decisions, multilingual Router, or staying on Jev for specific steps is realistic.",
      },
      {
        h: "Schema mapping",
        body:
          "Laya's Python SDK expects question dicts with type choice, score, or noul and criteria blocks. Jev's POST /v1/systemone JSON is similar in spirit but not byte-identical. Plan an adapter layer in your service rather than duplicating business logic in two formats.",
      },
      {
        h: "Hybrid pattern: local pre-filter",
        body:
          "Run Laya on-device or in a sidecar for cheap parallel questions (language detection, coarse routing, game ticks). Send only uncertain or high-stakes rows to hosted Jev. This preserves data minimization while keeping a authoritative cloud path for audit.",
      },
      {
        h: "Hybrid pattern: environment split",
        body:
          "Developers on Apple Silicon use Laya-MLX for fast iteration; staging and production stay on Jev until you have GPU capacity and MLOps to host Convai checkpoints with monitoring. /learn/where-to-run-jev lists hosted options.",
      },
      {
        h: "Calibration migration",
        body:
          "If you threshold Jev probabilities today, re-fit calibration on Laya outputs before copying numeric cutoffs. Convai documents temperature scaling per question type; your legacy 0.92 gate may mean something different on open weights.",
      },
      {
        h: "When to stay on Jev only",
        body:
          "Skip migration when you rely on gateway billing, need >50 options without tuning, lack GPU ops, or require TypeSafe's supported SLA. Laya is not a moral upgrade—it's a deployment choice.",
      },
    ],
    faq: [
      {
        question: "Can I run the same questions on both?",
        answer:
          "Yes for experiments. Log disagreements and calibration drift; do not dual-write production decisions without a clear source of truth.",
      },
      {
        question: "Does Vercel AI Gateway support Laya?",
        answer:
          "Gateway documentation centers on hosted Jev. Local Laya sits outside that path unless you wrap it in your own HTTP service.",
      },
    ],
    relatedGuideSlugs: ["compare", "privacy-and-agents"],
    relatedLearnSlugs: ["vercel-ai-gateway", "use-cases"],
    sources: sharedSources,
  },
  "privacy-and-agents": {
    slug: "privacy-and-agents",
    title: "Privacy, air-gap, and agents",
    tagline:
      "When local Laya belongs in the agent loop—and how it differs from bolting Jev MCP tools onto a chat model.",
    seoTitle: "Local Laya for agents: privacy, air-gap, typed tool gates",
    seoDescription:
      "Air-gapped and on-prem typed decisions with Laya vs hosted Jev agent patterns. Tool routing, MCP, and when open weights beat API keys.",
    keyPoint:
      "Agents still need a chat or planner model; Laya answers bounded questions locally so sensitive state never leaves the box for those steps.",
    sections: [
      {
        h: "Why agents care about typed decisions",
        body:
          "Tool-selection and policy gates are judgment calls, not creative writing. /guides/jev-with-ai-agents documents hosted Jev patterns (MCP, skills, middleware). The same architecture slots local Laya where API egress is forbidden or milliseconds matter—see /learn/jev-vs-llm-classification for why probabilities beat YES/NO parsing.",
      },
      {
        h: "Air-gap and regulated data",
        body:
          "After you download Apache 2.0 weights, Laya inference can run without outbound calls—subject to your security review and supply-chain policies. Hosted Jev requires sending state to TypeSafe infrastructure; use it when that trade is acceptable and contracted.",
      },
      {
        h: "Local loop example",
        body:
          "The showcase snake demo (/showcase?demo=laya-mlx-lonely-mh) is a visceral example: many decisions per second on Apple Silicon with roughly a gigabyte-class memory footprint in community claims—verify on your hardware.",
      },
      {
        h: "Composing with MCP",
        body:
          "Nothing stops you from exposing a private HTTP or MCP tool that wraps local Laya predict() while Claude or Cursor still handle language. That mirrors Jev MCP servers documented in agent guides, but you own uptime and versioning.",
      },
      {
        h: "Limits for agent builders",
        body:
          "Laya will not draft user-visible apologies, summarize threads, or write code. Keep generative models for language; use Laya for which tool, which route, and whether to escalate—same division of labor TypeSafe describes for Jev.",
      },
    ],
    faq: [
      {
        question: "Is local Laya more private than Jev?",
        answer:
          "It can be, if weights and inference stay inside your trust boundary. Misconfigured logging or crash dumps can still leak state—privacy is a system property, not a model license.",
      },
      {
        question: "Should I replace Jev MCP with Laya?",
        answer:
          "Only when self-host is a requirement. Many teams keep Jev MCP for IDE agents and add Laya only in deployed services.",
      },
    ],
    relatedGuideSlugs: ["laya-mlx-apple-silicon", "migration-and-coexistence"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    sources: [
      ...sharedSources,
      {
        label: "Jev with AI agents hub (hosted patterns)",
        url: "https://jev.aitools.fyi/guides/jev-with-ai-agents",
      },
    ],
  },
};

export const layaVsJevGuides: Record<LayaVsJevGuideSlug, LayaVsJevGuide> = guides;

export function getLayaVsJevGuide(slug: string): LayaVsJevGuide | undefined {
  if (!layaVsJevGuideSlugs.includes(slug as LayaVsJevGuideSlug)) return undefined;
  return layaVsJevGuides[slug as LayaVsJevGuideSlug];
}
