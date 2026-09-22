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
    "Two ways to get typed answers from software: run Laya on your own hardware, or call hosted Jev in the cloud.",
  seoTitle: "Laya vs Jev: local open weights vs hosted System One",
  seoDescription:
    "Plain-language hub comparing Convai Laya (downloadable models, run yourself) with TypeSafe Jev (hosted API). Covers Laya-MLX on Mac, benchmarks, privacy, migration, and when to use both.",
  intro:
    "Laya is a family of open-weight decision models from Convai. You send structured state and get a Choice, Score, or Noul answer in one model pass. No chat essay. TypeSafe Jev is a hosted API (System One) that many teams already use in agents, gateways, and moderation pipelines. Both help code make judgment calls. They differ in who runs the GPU, what you can download, and how you pay. This hub lives on jev.aitools.fyi. We are not TypeSafe or Convai. We link primary sources and say when a vendor table is not an independent audit.",
  faq: [
    {
      question: "How is Laya different from Jev?",
      answer:
        "Laya gives you model files (checkpoints) under Apache 2.0. You run inference on your servers, laptop, or Mac. Jev is a managed cloud service: you POST JSON to TypeSafe and they run the model. Same kind of questions (pick a label, score something, yes/no probability). Different APIs, limits, and ops. See the compare guide for a side-by-side.",
    },
    {
      question: "Is Laya open source?",
      answer:
        "The model weights are open-weight and Apache 2.0 on Hugging Face. Convai also publishes an upstream Python SDK on GitHub and PyPI. That is not the same as every line of training infra being public, but you can download, run, and fine-tune the checkpoints. Laya-MLX is a separate community project for Apple Silicon. It is not an official Convai release.",
    },
    {
      question: "Is Jev open source? How do people use Jev?",
      answer:
        "Jev is a commercial hosted product from TypeSafe. You do not download Jev weights for self-host. Teams use the HTTP API, SDKs, AI gateways (for example Vercel), MCP servers, and agent skills documented on this site. See /learn/jev-typesafe and /learn/system-one for how Jev fits in.",
    },
    {
      question: "When should I pick Laya vs Jev?",
      answer:
        "Pick Laya when data must stay on your machine or VPC, you want to fine-tune weights, or you already run GPU inference. Pick Jev when you want a supported API, metered billing, and gateway integrations without running GPUs yourself. Many teams use both: local Laya for cheap gates, hosted Jev for escalation. See migration-and-coexistence.",
    },
    {
      question: "Laya-MLX vs hosted Jev: what is the real difference?",
      answer:
        "Laya-MLX runs Laya-style decisions locally on Apple Silicon (community MLX port). Hosted Jev adds network, auth, and shared cloud hardware. A 10 ms Mac forward pass is not the same thing as a 250 ms end-to-end API call. Use MLX for local loops and dev speed. Use Jev when you want cloud scale and a vendor SLA. Read laya-mlx-apple-silicon and benchmarks-and-fairness before you quote speedups.",
    },
    {
      question: "Is Laya a drop-in replacement for Jev?",
      answer:
        "No. APIs, context limits, option budgets, calibration, and ops all differ. Laya means you host checkpoints. Jev is POST /v1/systemone plus gateway wiring. Lots of teams run Laya locally for fast gates and Jev where they want hosted scale. See migration-and-coexistence.",
    },
    {
      question: "Who makes Laya and who makes Jev?",
      answer:
        "Laya weights and the upstream Python SDK come from Convai Innovations (Apache 2.0 on Hugging Face). Laya-MLX is a community MLX port for Apple Silicon, not an official Convai build. Jev is TypeSafe's commercial System One product. This directory curates links; we do not speak for either vendor.",
    },
    {
      question: "Can I trust latency numbers in blog posts?",
      answer:
        "Treat them as hints, not promises. Local GPU milliseconds (Laya on a T4 or M3 Max) are not the same as end-to-end hosted API latency (network, auth, batching, region). Convai's Hugging Face card cites third-party Jev p50 figures (about 236 to 276 ms) next to their own Laya GPU times (about 33 ms on T4). Those are different setups. Read benchmarks-and-fairness before you put numbers in an SLA.",
    },
    {
      question: "Where is the snake demo with Laya-MLX?",
      answer:
        "The showcase embeds Lonely__MH's laya-mlx snake clip on Apple Silicon: /showcase?demo=laya-mlx-lonely-mh. It shows a local decision loop. It is not a benchmark certificate.",
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
    label: "Hugging Face: convaiinnovations/laya (model card and benchmarks)",
    url: "https://huggingface.co/convaiinnovations/laya",
  },
  {
    label: "GitHub: NandhaKishorM/laya (upstream SDK)",
    url: "https://github.com/NandhaKishorM/laya",
  },
  {
    label: "PyPI: laya package",
    url: "https://pypi.org/project/laya/",
  },
  {
    label: "TypeSafe docs: System One / Jev API",
    url: "https://docs.typesafe.ai",
  },
  {
    label: "Laya-MLX: BENCHMARKS.md (M3 Max, independent port)",
    url: "https://github.com/mizorewww/laya-mlx/blob/main/BENCHMARKS.md",
  },
];

const guides: Record<LayaVsJevGuideSlug, LayaVsJevGuide> = {
  compare: {
    slug: "compare",
    title: "Laya vs Jev: comparison overview",
    tagline:
      "Same typed question shapes, different homework. Read this before you rip out a working Jev integration on a Friday afternoon.",
    seoTitle: "Laya vs Jev comparison: access, speed, cost, privacy",
    seoDescription:
      "Side-by-side Laya (Apache 2.0 weights, self-host) vs TypeSafe Jev (hosted API): latency caveats, context, fine-tuning, ops, and when each fits routing and agent gates.",
    keyPoint:
      "Choose Laya when you need on-prem or edge inference with downloadable weights. Choose Jev when you want a managed System One API, gateway routing, and TypeSafe's hosted release cycle. Using both is normal.",
    sections: [
      {
        h: "What both products do",
        body:
          "Laya and Jev answer the same shape of question. Pick a label (Choice). Rate something (Score). Return a probability for yes/no style statements (Noul). Neither is a chat model. They will not draft your apology email. That is why teams compare them to System One-style gates, not to GPT-style writers. For Jev vocabulary, start with /learn/jev-typesafe and /learn/system-one. For Laya architecture, see what-is-laya in this hub.",
      },
      {
        h: "Who runs the computer",
        body:
          "Laya publishes Apache 2.0 checkpoints on Hugging Face (English, multilingual, and typed-decisions fine-tunes). You run them. Jev is API-only through TypeSafe and partners such as Vercel AI Gateway. You cannot download Jev weights to self-host.",
      },
      {
        h: "Speed (read the fine print)",
        body:
          "Convai reports about 33 to 40 ms per question on a Tesla T4 for Laya. Laya-MLX reports about 7 to 16 ms P50 for short inputs on an M3 Max (see laya-mlx-apple-silicon). Hosted Jev p50 is often quoted in the hundreds of milliseconds end-to-end in third-party posts. Those numbers measure different things. Do not compare them without reading benchmarks-and-fairness.",
      },
      {
        h: "Context and options",
        body:
          "English Laya defaults to 512 tokens with a split between state and option head budget. Multilingual and typed-decisions checkpoints can go toward 1k to 8k encoder context with tuning. Jev publishes its own limits in TypeSafe docs. Verify there instead of assuming parity.",
      },
      {
        h: "Cost and fine-tuning",
        body:
          "Laya is mostly your GPUs and engineer time. Jev is metered API pricing. Laya expects you to specialize checkpoints when you need domain accuracy. Jev improvements ship as new hosted model versions.",
      },
      {
        h: "Privacy and ops",
        body:
          "Laya can run air-gapped after you download weights. Jev sends state to TypeSafe unless you have a private contract. Ops for Laya means Router preload, VRAM, calibration, and checkpoint updates. Ops for Jev means API keys, quotas, and gateway config.",
      },
      {
        h: "Accuracy and calibration",
        body:
          "Convai's public card says routed Laya sometimes wins on simple top-pick accuracy on some public test sets, compared to published Jev 1.13.0 numbers. Jev can win when you have many labels at once (think dozens of support topics) or when you care how close probability scores match a teacher model. Calibration means: when the model says 90% sure, is it right about nine times out of ten? Laya often needs extra temperature tuning on your data before you trust cutoffs. Picking the right label and trusting the probability are different jobs. Moderation teams often need the second one. Vendor tables are hints, not court verdicts.",
      },
      {
        h: "When to choose Laya",
        body:
          "Choose Laya when data must stay on device or inside a VPC you control. Choose it when you want to fork or fine-tune weights, when you already run GPU inference, or when sub-50 ms local decisions matter more than zero ops. The typed-decisions checkpoint targets invoice, security, and support-triage style workflows Convai fine-tuned. Base English and multilingual checkpoints are not magic on those tasks without specialization.",
      },
      {
        h: "When to choose Jev",
        body:
          "Choose Jev when you want a supported HTTP API, predictable billing, gateway integrations (see /learn/vercel-ai-gateway), and large option sets without tuning head_max_len yourself. Teams already on TypeSafe SDKs, MCP servers, and agent skills often stay on the hosted path unless privacy or unit economics force self-host.",
      },
      {
        h: "When to use both",
        body:
          "A practical pattern is local Laya for high-volume pre-filters or game ticks and hosted Jev for escalation, audit-heavy workflows, or option sets you do not want to maintain weights for. See migration-and-coexistence and the showcase snake demo for local loop speed: /showcase?demo=laya-mlx-lonely-mh.",
      },
    ],
    faq: [
      {
        question: "Is Laya faster than Jev?",
        answer:
          "Often on a warm local GPU, yes in vendor and community benchmarks. That is still not the same measurement as your production Jev path through TLS, auth, and region. Size SLAs using your own traces.",
      },
      {
        question: "Which has better accuracy?",
        answer:
          "It depends on task, language, option count, and whether you fine-tune Laya. Public tables mix benchmarks. Jev leads on some high-cardinality sets while Laya's typed-decisions checkpoint leads on Convai's typed workflow eval. See benchmarks-and-fairness.",
      },
      {
        question: "Is Laya open source?",
        answer:
          "Open-weight Apache 2.0 checkpoints plus an open SDK on GitHub/PyPI. You host and operate the stack. Jev weights are not downloadable; Jev is the hosted service.",
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
      "Convai's open decision models: one forward pass, Choice / Score / Noul, Apache 2.0. Not a chatbot in a trench coat.",
    seoTitle: "What is Laya? Open typed-decision models explained",
    seoDescription:
      "Laya model family by Convai Innovations: ModernBERT and mmBERT checkpoints, Router mode, RLCD training, typed questions, and honest limits from the Hugging Face model card.",
    keyPoint:
      "Laya is a non-autoregressive decision stack. You define questions and options. The model returns structured answers with probabilities in one pass.",
    sections: [
      {
        h: "Publisher and license",
        body:
          "Laya is released by Convai Innovations under Apache 2.0 on Hugging Face (convaiinnovations/laya). The upstream SDK and training code live at github.com/NandhaKishorM/laya with a PyPI package named laya. Open-weight means you can download and run the checkpoints. This directory is independent. We do not represent Convai.",
      },
      {
        h: "Checkpoints in the family",
        body:
          "Three public checkpoints share one hub repo. The English root model (ModernBERT-large, about 421M params, 512 context) for English guardrails and email-style triage. laya-multilingual (mmBERT-base, about 322M, 1024 context, up to 8k encoder RoPE) for 100+ languages. laya-typed-decisions (ModernBERT-large, 1024 context) fine-tuned for four workflow-style task groups Convai documents on the card. Only the subfolder you request downloads.",
      },
      {
        h: "Primitives: choice, score, noul",
        body:
          "Questions are declared as JSON. Choice picks among criteria keys with softmax over option markers. Score returns an ordinal rating. Noul returns a calibrated probability for a yes/no style statement. This mirrors the TypeSafe Choice, Score, and Noul vocabulary in /learn/jev-typesafe. Useful for mental mapping, not a promise of API compatibility.",
      },
      {
        h: "Router mode",
        body:
          "The recommended Python entrypoint is laya.Router. It detects script and language in sub-millisecond Python and routes to English or multilingual checkpoints. Convai documents large accuracy gaps when English-only weights see non-Latin scripts, so routing is a safety feature, not just convenience. Preload checkpoints in memory to avoid multi-second cold rebuilds when languages alternate.",
      },
      {
        h: "How it was trained (short version)",
        body:
          "Convai trained Laya with RLCD: reinforcement learning aimed at honest probability scores, not flashy chat. The model is pushed to report beliefs it can defend, not to sound confident in prose. That is the same reason teams like System One style models instead of asking GPT to print YES or NO. You still need to tune thresholds on your own data before production.",
      },
      {
        h: "Honest limits (from the model card)",
        body:
          "Base English and multilingual checkpoints are weak on Convai's typed-decisions benchmark without fine-tuning. The 0.766 accuracy figure belongs to laya-typed-decisions, not the root weights. High-cardinality choice questions can exhaust per-option token budgets unless you raise head_max_len or split hierarchically. Ordinal score tasks are weaker than choice/noul on some public sets. Do not run English-only root for non-English production without multilingual or routed paths.",
      },
      {
        h: "How Laya relates to Jev",
        body:
          "Same product category: typed parallel decisions, not generative chat. Different vendor, license, and hosting. Laya is run-yourself weights. Jev is TypeSafe's hosted System One API. Full comparison: /learn/laya-vs-jev/compare.",
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
      {
        question: "Is the full Laya stack open source?",
        answer:
          "Weights are Apache 2.0 on Hugging Face. SDK and training repo are public on GitHub. You still operate inference, updates, and compliance. Laya-MLX is a separate community port for Mac, not Convai official.",
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
      "A community MLX runtime for local Laya on Mac. Great for short, fast decisions. Not an official Convai build.",
    seoTitle: "Laya-MLX on Apple Silicon: local MLX inference guide",
    seoDescription:
      "Independent laya-mlx port: MLX on M3 Max benchmarks, 7 to 16 ms short-decision P50, install pointers, parity notes, and caveats vs PyTorch and hosted Jev.",
    keyPoint:
      "Laya-MLX (github.com/mizorewww/laya-mlx) reimplements Laya inference with Apple's MLX framework. It is not published by Convai. Verify behavior against upstream when you upgrade checkpoints.",
    sections: [
      {
        h: "What Laya-MLX adds",
        body:
          "The upstream Laya stack typically uses PyTorch and Transformers. Laya-MLX ports weights and the decision heads to MLX so developers on Mac can run inference without a CUDA box. Tokenization still uses Hugging Face tokenizers. The project documents numerical parity checks against upstream on fixed fixtures.",
      },
      {
        h: "Published latency (M3 Max)",
        body:
          "BENCHMARKS.md in the laya-mlx repo measures end-to-end short-input latency on Apple M3 Max (40-core GPU, 128 GiB RAM). For one question, MLX FP16 P50 is around 13.4 ms (English laya) and 7.4 ms (laya-multilingual), with model load excluded. Ten-question batches and full-context runs are much slower. These numbers are one machine and one OS build. They are not a guarantee on M2, M4, or laptops with less memory.",
      },
      {
        h: "Comparison to PyTorch MPS on the same Mac",
        body:
          "The same document shows PyTorch MPS FP32 somewhat slower than MLX FP16 on identical hashes. That is expected when FP16 is allowed. Throughput rows use repeated question templates. Distinct-question production mixes may differ.",
      },
      {
        h: "Laya-MLX vs hosted Jev",
        body:
          "Laya-MLX runs on your Mac. Hosted Jev runs in TypeSafe's cloud and your request travels over the network. Community posts (including our showcase blurb for Lonely__MH's snake demo) sometimes contrast local tens-of-ms inference with hosted Jev latency. That is apples to oranges. No TLS, no multi-tenant queue, different hardware class. Use Laya-MLX when Mac-local loops matter. Do not claim a universal 50x speedup over your Jev region without measuring.",
      },
      {
        h: "Getting started",
        body:
          "Clone github.com/mizorewww/laya-mlx, follow uv sync extras in the README, and pin upstream Laya revisions the benchmark scripts expect. PyPI lists laya-mlx for packaged installs. For Convai's official path on Linux/GPU, use the laya PyPI package instead.",
      },
      {
        h: "Showcase: snake on MLX",
        body:
          "jev.aitools.fyi embeds a public X clip where snake ticks use local Laya decisions. Useful for sensing decision frequency, not for SLA proof: /showcase?demo=laya-mlx-lonely-mh.",
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
          "Inference is MLX-first. The repo uses PyTorch MPS as a reference backend in benchmarks, not as a production requirement for MLX mode.",
      },
      {
        question: "Will MLX match T4 GPU numbers on the HF card?",
        answer:
          "Different hardware. HF documents about 33 ms on Tesla T4 for routed GPU inference. MLX documents about 7 to 16 ms P50 short paths on M3 Max. Neither predicts your laptop under load.",
      },
      {
        question: "Should I use Laya-MLX instead of Jev?",
        answer:
          "Use MLX when you need local Mac inference and own the ops. Use hosted Jev when you want a vendor API, billing, and cloud scale. Many teams use MLX for dev and Jev in production.",
      },
    ],
    relatedGuideSlugs: ["what-is-laya", "benchmarks-and-fairness"],
    relatedLearnSlugs: ["where-to-run-jev"],
    sources: [
      ...sharedSources,
      {
        label: "GitHub: mizorewww/laya-mlx",
        url: "https://github.com/mizorewww/laya-mlx",
      },
      {
        label: "PyPI: laya-mlx",
        url: "https://pypi.org/project/laya-mlx/",
      },
      {
        label: "Third-party explainer: What is Laya-MLX? (aiidelist.com)",
        url: "https://aiidelist.com/blog/what-is-laya-mlx",
      },
    ],
  },
  "benchmarks-and-fairness": {
    slug: "benchmarks-and-fairness",
    title: "Benchmarks and fairness",
    tagline:
      "How to read Convai's Laya vs Jev tables and laptop MLX numbers without fooling yourself (or your CFO).",
    seoTitle: "Laya vs Jev benchmarks: how to read the numbers fairly",
    seoDescription:
      "Vendor benchmarks, T4 GPU vs hosted API latency, calibration vs accuracy, independent citations, and what jev.aitools.fyi will not claim.",
    keyPoint:
      "Self-published comparison tables are useful hypotheses, not independent audits. Measure your state, option counts, and regions on your stack.",
    sections: [
      {
        h: "What Convai publishes on Hugging Face",
        body:
          "The convaiinnovations/laya model card includes speed tables on Tesla T4 and a Laya (routed) vs TypeSafe Jev 1.13.0 section. Convai states Jev figures come from third-party published measurements without replicating them in-house. Laya figures come from their Router predict path on identical question sets. Sample sizes, prompts, and label spaces differ per row. Read the card footnotes and BENCHMARKS.md in the Laya repo before citing a single accuracy delta.",
      },
      {
        h: "Latency: local forward pass vs hosted end-to-end",
        body:
          "Laya and Laya-MLX benchmarks typically time model forward passes (sometimes plus tokenization and calibration) on a warm process. Hosted Jev latency includes client SDK, DNS, TLS, API gateway, batching, and geographic distance. A 33 ms T4 forward pass is not comparable to a 250 ms p50 API trace from another author's blog. When evaluating agents, measure wall clock from your orchestrator.",
      },
      {
        h: "Accuracy vs calibration",
        body:
          "Convai notes Laya typed-decisions can beat Jev on plain top-pick accuracy on some rows. Jev can lead when you score how closely probabilities match a reference model. Laya's calibration error usually improves after you run temperature fitting on your validation set. Only compare calibration when both models get the same post-processing. /learn/jev-vs-llm-classification explains why gates need real probabilities, not just the winning label.",
      },
      {
        h: "Many options at once",
        body:
          "On Banking77-style tests with dozens of labels, Jev can lead because each option eats token budget. Laya docs suggest fixes: allow more tokens per option, or ask questions in stages. If your app has 50+ choices in one shot, rerun the test with your real schema before you switch vendors.",
      },
      {
        h: "Third-party writeups",
        body:
          "Blog posts such as aiidelist.com's Laya-MLX explainer and retailer-hosted AI hubs (for example ZimaSpace's Laya overview) summarize public repos. They are not peer review. Use them for install pointers and vocabulary, then verify against GitHub READMEs and HF cards.",
      },
      {
        h: "What we will not claim on this site",
        body:
          "jev.aitools.fyi does not run independent head-to-head evals between Laya and Jev. We do not host weights or TypeSafe keys. Any showcase clip is anecdotal social proof, not a benchmark suite.",
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
          "Same held-out prompts, same option definitions, same preprocessing, measured end-to-end on your deployment paths, with calibration tuned per model on a validation split you control.",
      },
    ],
    relatedGuideSlugs: ["compare", "laya-mlx-apple-silicon"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "system-one"],
    sources: [
      ...sharedSources,
      {
        label: "ZimaSpace: Laya open-source decision model overview",
        url: "https://shop.zimaspace.com/blogs/tech-ai-hub/laya-open-source-decision-model-local-ai",
      },
      {
        label: "aiidelist.com: What is Laya-MLX?",
        url: "https://aiidelist.com/blog/what-is-laya-mlx",
      },
    ],
  },
  "migration-and-coexistence": {
    slug: "migration-and-coexistence",
    title: "Migration and coexistence",
    tagline:
      "Map Jev-shaped gates to Laya checkpoints without breaking production. And know when not to migrate.",
    seoTitle: "Migrate or pair Laya with Jev: hybrid typed-decision patterns",
    seoDescription:
      "Coexistence architectures: local Laya pre-filter plus hosted Jev escalation, schema mapping, calibration, and ops checklists when moving off API-only System One.",
    keyPoint:
      "Migration is a schema, calibration, and ops project. It is not a find-replace on endpoint URLs.",
    sections: [
      {
        h: "Start from your Jev contract",
        body:
          "Inventory parallel questions, state shape, thresholds, and escalation rules in your existing TypeSafe client (/learn/jev-typesafe). Note option counts and languages. That map tells you whether laya-typed-decisions, multilingual Router, or staying on Jev for specific steps is realistic.",
      },
      {
        h: "Schema mapping",
        body:
          "Laya's Python SDK wants question dicts with type choice, score, or noul plus criteria blocks. Jev's POST /v1/systemone JSON asks the same kinds of things but the field names and shapes differ. Build one adapter in your service. Do not copy business rules twice in two formats.",
      },
      {
        h: "Hybrid pattern: local pre-filter",
        body:
          "Run Laya on the device or in a small helper service for cheap questions: language sniffing, coarse routing, game ticks. Send only fuzzy or high-stakes rows to hosted Jev. Less data leaves your network. Cloud Jev stays the boss for audits.",
      },
      {
        h: "Hybrid pattern: environment split",
        body:
          "Mac developers use Laya-MLX for fast local tries. Staging and production stay on Jev until you have GPUs and monitoring to host Convai checkpoints safely. /learn/where-to-run-jev lists hosted Jev options.",
      },
      {
        h: "Calibration migration",
        body:
          "If you threshold Jev probabilities today, re-fit calibration on Laya outputs before copying numeric cutoffs. Convai documents temperature scaling per question type. Your legacy 0.92 gate may mean something different on open weights.",
      },
      {
        h: "When to stay on Jev only",
        body:
          "Skip migration when you rely on gateway billing, need more than 50 options without tuning, lack GPU ops, or require TypeSafe's supported SLA. Laya is not a moral upgrade. It is a deployment choice.",
      },
    ],
    faq: [
      {
        question: "Can I run the same questions on both?",
        answer:
          "Yes for experiments. Log disagreements and calibration drift. Do not dual-write production decisions without a clear source of truth.",
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
      "When local Laya belongs in the agent loop. And how that differs from bolting Jev MCP tools onto a chat model.",
    seoTitle: "Local Laya for agents: privacy, air-gap, typed tool gates",
    seoDescription:
      "Air-gapped and on-prem typed decisions with Laya vs hosted Jev agent patterns. Tool routing, MCP, and when open weights beat API keys.",
    keyPoint:
      "Agents still need a chat or planner model. Laya answers bounded questions locally so sensitive state never leaves the box for those steps.",
    sections: [
      {
        h: "Why agents care about typed decisions",
        body:
          "Picking a tool or blocking a bad action is a judgment call, not creative writing. /guides/jev-with-ai-agents shows hosted Jev patterns with MCP, skills, and middleware. Swap in local Laya when outbound API calls are banned or when you need millisecond gates. See /learn/jev-vs-llm-classification for why real probabilities beat parsing YES or NO from chat text.",
      },
      {
        h: "Air-gap and regulated data",
        body:
          "After you download Apache 2.0 weights, Laya inference can run without outbound calls, subject to your security review and supply-chain policies. Hosted Jev requires sending state to TypeSafe infrastructure. Use it when that trade is acceptable and contracted.",
      },
      {
        h: "Local loop example",
        body:
          "The showcase snake demo (/showcase?demo=laya-mlx-lonely-mh) is a visceral example: many decisions per second on Apple Silicon with roughly a gigabyte-class memory footprint in community claims. Verify on your hardware.",
      },
      {
        h: "Composing with MCP",
        body:
          "You can expose a private HTTP or MCP tool that wraps local Laya predict() while Claude or Cursor still write the words. That looks like the Jev MCP servers in our agent guides, except you run the server and pick the model version.",
      },
      {
        h: "Limits for agent builders",
        body:
          "Laya will not draft user-visible apologies, summarize threads, or write code. Keep generative models for language. Use Laya for which tool, which route, and whether to escalate. Same division of labor TypeSafe describes for Jev.",
      },
    ],
    faq: [
      {
        question: "Is local Laya more private than Jev?",
        answer:
          "It can be, if weights and inference stay inside your trust boundary. Misconfigured logging or crash dumps can still leak state. Privacy is a system property, not a model license.",
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
