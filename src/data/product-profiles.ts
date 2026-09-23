import type { LearnGuideSlug } from "@/data/learn-guides";

export type JevPrimitive = "Choice" | "Score" | "Noul";

export type ProductProfileFaq = {
  question: string;
  answer: string;
};

export type ProductCreator = {
  name: string;
  handle?: string;
  xUrl?: string;
  githubUrl?: string;
  company?: string;
  companyUrl?: string;
};

export type SourcedMetric = {
  claim: string;
  source: string;
};

export type ProductJevUsage = {
  /** Where in the product loop Jev runs (gate, routing, ranking, moderation, compaction, etc.). */
  flowRole: string;
  primitives: JevPrimitive[];
  stateIn: string;
  decisionOut: string;
  /** Ordered steps in the hot path, when documented. */
  flowSteps?: string[];
  sourcedMetrics?: SourcedMetric[];
};

export type ProductLinks = {
  website?: string;
  repo?: string;
  docs?: string;
  demo?: string;
  post?: string;
};

export type ProductProfile = {
  slug: string;
  /** published profiles render rich detail pages; draft profiles are omitted from the index. */
  status: "published" | "draft";
  problem: string;
  targetUser: string;
  overview: string;
  creator: ProductCreator;
  creatorQuote?: {
    text: string;
    attributedTo: string;
    sourceUrl: string;
  };
  jevUsage: ProductJevUsage;
  /** Long-form narrative for crawlers; must align with jevUsage facts. */
  howJevIsUsed: string;
  keyFeatures: string[];
  stack: string[];
  links: ProductLinks;
  pricingNote?: string;
  /** ISO date or human date when the listing first appeared in public demos or docs. */
  firstSeen?: string;
  demoIds?: string[];
  relatedSlugs?: string[];
  relatedLearnSlugs?: LearnGuideSlug[];
  faq?: ProductProfileFaq[];
  metaTitle?: string;
  metaDescription?: string;
};

export function getProductProfile(slug: string): ProductProfile | undefined {
  const profile = productProfilesBySlug[slug];
  if (!profile || profile.status !== "published") return undefined;
  return profile;
}

export function measureProductProfileBodyChars(slug: string): number {
  const profile = productProfilesBySlug[slug];
  if (!profile || profile.status !== "published") return 0;
  const j = profile.jevUsage;
  const chunks = [
    profile.problem,
    profile.targetUser,
    profile.overview,
    profile.howJevIsUsed,
    j.flowRole,
    j.stateIn,
    profile.creator.name,
    j.decisionOut,
    ...(j.flowSteps ?? []),
    ...(j.primitives ?? []),
    ...(j.sourcedMetrics ?? []).flatMap((m) => [m.claim, m.source]),
    ...(profile.keyFeatures ?? []),
    ...(profile.stack ?? []),
    profile.pricingNote ?? "",
    profile.creatorQuote?.text ?? "",
    ...(profile.faq ?? []).flatMap((f) => [f.question, f.answer]),
  ];
  return chunks.join(" ").trim().length;
}

export const productProfilesBySlug: Record<string, ProductProfile> = {
  "classifier-dev": {
    slug: "classifier-dev",
    status: "published",
    problem:
      "Teams still route moderation, support, and analytics labels through chat models that return prose instead of thresholdable scores.",
    targetUser:
      "Engineers who want HTTP-first zero-shot labels without hosting their own classifier stack.",
    overview:
      "classifier.dev is a zero-shot text classification API on a single Cloudflare Worker. Plain text and label lists go in; the service returns a label and calibrated confidence. The fast tier runs TypeSafe Jev from src/jev.ts; uncertain rows can escalate to a smart tier when confidence falls below 0.7.",
    creator: {
      name: "Michael Chomsky",
      handle: "michael_chomsky",
      company: "classifier.dev",
      companyUrl: "https://classifier.dev",
      githubUrl: "https://github.com/mrmps/classifier-dev",
    },
    jevUsage: {
      flowRole: "Classification core (fast tier) plus confidence-gated escalation to smart tier",
      primitives: ["Choice", "Score"],
      stateIn:
        "Batched {id, text} inputs plus per-item questions. Multi-label uses one yes/no Score-style question per label on the same state (documented in src/jev.ts).",
      decisionOut:
        "Calibrated probability per label or option; callers threshold confidence. Smart tier re-asks only rows below ESCALATE_BELOW (0.7 in src/index.ts).",
      flowSteps: [
        "Pack many items into one POST /v1/systemone request on the fast tier",
        "Read per-label probabilities from Jev",
        "Re-run only sub-0.7 confidence rows on the smart tier chain",
      ],
      sourcedMetrics: [
        {
          claim: "Smart tier escalates when fast-tier confidence is below 0.7 (ESCALATE_BELOW).",
          source: "github.com/mrmps/classifier-dev src/index.ts",
        },
        {
          claim: "Multi-label F1 0.879 vs 0.799 for the LLM cascade it replaces, ~200ms on a seven-case eval set.",
          source: "github.com/mrmps/classifier-dev src/jev.ts header comments",
        },
      ],
    },
    howJevIsUsed:
      "The Worker routes classification through src/jev.ts, which calls TypeSafe POST /v1/systemone (model jev-latest) or Vercel AI Gateway evaluation-model when a gateway key is set. Jev is described in-repo as a decision model that returns calibrated probabilities, not prompted classification prose. Multi-label is implemented as parallel per-label questions on shared state. The smart tier is a separate model chain that runs only on answers the fast tier marks uncertain via the 0.7 gate, which keeps average cost down while preserving accuracy on edge cases documented in the repository eval notes.",
    keyFeatures: [
      "curl-friendly HTTP API with up to 1,000 texts per request (README)",
      "Fast Jev tier plus smart re-ask tier below 0.7 confidence",
      "No API key required for light use (catalog listing and site docs)",
      "CLI npm package classifier-dev mirrors the HTTP API",
      "feedback.now agent feedback endpoints on the same host",
    ],
    stack: [
      "Cloudflare Worker",
      "TypeSafe System One (jev-latest)",
      "Optional Vercel AI Gateway evaluation-model",
      "esbuild, no database",
    ],
    links: {
      website: "https://classifier.dev",
      repo: "https://github.com/mrmps/classifier-dev",
      docs: "https://classifier.dev",
      demo: "https://classifier.dev",
    },
    pricingNote:
      "Public rate-limit headers document fast vs smart tiers (see repository API notes). Confirm live limits on classifier.dev before production traffic.",
    firstSeen: "2026-09-19",
    demoIds: [],
    relatedSlugs: ["classifier-dev-mcp", "browser-use-jev-ultrafast", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Which Jev primitives does classifier.dev use?",
        answer:
          "Source comments in src/jev.ts describe single-label Choice-style picks and multi-label yes/no questions read from probabilities. The implementation packs many items per System One request.",
      },
      {
        question: "When does the smart tier run?",
        answer:
          "Only when fast-tier confidence is below 0.7, per ESCALATE_BELOW in src/index.ts. Read eval/fallback_bench.py in the repo before quoting production accuracy.",
      },
    ],
    metaTitle: "classifier.dev: Jev fast tier and smart escalation API",
    metaDescription:
      "Hosted zero-shot labels with Jev on the fast tier, 0.7 confidence escalation, and HTTP plus CLI surfaces. Sourced from the open classifier.dev Worker repository.",
  },

  "classifier-dev-mcp": {
    slug: "classifier-dev-mcp",
    status: "published",
    problem:
      "Agents need classify tools that return structured probabilities instead of markdown tables in chat.",
    targetUser:
      "MCP hosts wiring streamable HTTP tools for moderation, routing, and analytics agents.",
    overview:
      "The classifier.dev MCP server exposes the same classification backend as the HTTP API through streamable HTTP tools such as classify_texts. Setup documentation lives on classifier.dev/mcp-setup.",
    creator: {
      name: "Michael Chomsky",
      handle: "michael_chomsky",
      company: "classifier.dev",
      companyUrl: "https://classifier.dev",
      githubUrl: "https://github.com/mrmps/classifier-dev",
    },
    jevUsage: {
      flowRole: "Agent tool transport to the same Jev classification core as classifier.dev",
      primitives: ["Choice", "Score"],
      stateIn: "Tool payloads with texts and label dimensions (per MCP tool schema on classifier.dev).",
      decisionOut:
        "Same probability vectors as the HTTP API; MCP is transport only.",
      flowSteps: [
        "Agent calls MCP classify_texts (or related tools)",
        "Server forwards to classifier.dev Jev tiers",
        "Agent thresholds probabilities in code",
      ],
    },
    howJevIsUsed:
      "MCP does not change the System One question shapes: tools call into the classifier.dev Worker stack documented in the main repository. Agents should still think in terms of fast Jev probabilities and optional smart-tier escalation rather than parsing model prose from tool results.",
    keyFeatures: [
      "Streamable HTTP MCP documented on classifier.dev/mcp-setup",
      "Free tier without API key for light experiments (catalog listing)",
      "Multi-label and dimension aware tools",
      "Pairs with the classifier.dev HTTP product profile",
    ],
    stack: ["MCP streamable HTTP", "classifier.dev Worker", "TypeSafe System One"],
    links: {
      website: "https://classifier.dev/mcp",
      repo: "https://github.com/mrmps/classifier-dev",
      docs: "https://classifier.dev/mcp-setup",
      demo: "https://classifier.dev/mcp-setup",
    },
    pricingNote: "Matches classifier.dev tier limits.",
    firstSeen: "2026-09-19",
    relatedSlugs: ["classifier-dev", "kushwho-jev-codes"],
    relatedLearnSlugs: ["jev-typesafe", "use-cases"],
    faq: [
      {
        question: "Do MCP tools use a different model than curl?",
        answer: "No. They hit the same classifier.dev backend described in the main repository.",
      },
    ],
    metaTitle: "classifier.dev MCP: Jev classify tools for agents",
    metaDescription:
      "Streamable HTTP MCP for classify_texts on classifier.dev. Same Jev fast and smart tiers as the HTTP API.",
  },

  "browser-use-jev-ultrafast": {
    slug: "browser-use-jev-ultrafast",
    status: "published",
    problem:
      "LLM-in-the-loop browser agents spend too long and too much per click when every step is open-ended generation.",
    targetUser:
      "Teams building Browser Use style agents who want a reference hybrid policy with documented timings.",
    overview:
      "Jev Ultrafast is Browser Use's open agent where TypeSafe Jev picks an operation (CLICK, TYPE_TEXT, SELECT, SCROLL, WAIT, DONE, BLOCKED) and a numbered DOM target from a fresh element table each step. A small LLM only runs when the operation is TYPE_TEXT.",
    creator: {
      name: "Gregor Zunic",
      handle: "gregpr07",
      xUrl: "https://x.com/gregpr07/status/2100411066966749359",
      githubUrl: "https://github.com/browser-use/jev-ultrafast",
      company: "Browser Use",
      companyUrl: "https://browser-use.com",
    },
    creatorQuote: {
      text:
        "Seven seconds, four tenths of a cent, and Jev clicks the right DOM node while a tiny LLM only types when it must.",
      attributedTo: "Gregor Zunic",
      sourceUrl: "https://x.com/gregpr07/status/2100411066966749359",
    },
    jevUsage: {
      flowRole: "Per-step browser control routing (operation + target selection)",
      primitives: ["Choice"],
      stateIn:
        "Structured element table from a single browser snapshot (role, name, value, numeric index). No screenshots in the default agent loop per README.",
      decisionOut:
        "Operation head plus speculative target heads (click_target, type_text_target, select_target) resolved in one TypeSafe request; only the matching target executes.",
      flowSteps: [
        "Snapshot page into indexed element table",
        "One Jev request chooses operation and compatible target",
        "CLICK/SELECT execute directly; TYPE_TEXT triggers small LLM for string then browser input",
      ],
      sourcedMetrics: [
        {
          claim: "Google Flights Zürich to London task completed in 7.073s at 1× in the published recording.",
          source: "github.com/browser-use/jev-ultrafast docs/performance.md",
        },
        {
          claim: "Median Jev latency 178ms across 17 requests in that recording.",
          source: "github.com/browser-use/jev-ultrafast docs/performance.md",
        },
        {
          claim: "Median optimized runtime 7.092s vs 9.450s original arm in three matched pairs.",
          source: "github.com/browser-use/jev-ultrafast docs/performance.md",
        },
      ],
    },
    howJevIsUsed:
      "Each observation rebuilds a finite action space. Jev consumes structured state, not pixels, and returns operation and target probabilities in one round trip per decision cycle. Target questions are speculative: if the operation is CLICK, only click_target can fire. TYPE_TEXT is the only branch that calls a separate text model (Mercury in the documented demo configuration). This split is why public clips show sub-second decisions with occasional LLM latency only on typing steps.",
    keyFeatures: [
      "Local inspector UI on port 8766 with Choose next stepping",
      "Browser Harness integration for Chrome debugging",
      "Documented flight, Wikipedia, and hotel fixture benchmarks",
      "Python library API via jev_ultrafast.Agent",
    ],
    stack: [
      "Python",
      "Browser Harness",
      "TypeSafe Jev (jev-1.13.0 in benchmark doc)",
      "OpenRouter text helper for TYPE_TEXT",
    ],
    links: {
      website: "https://browser-use.com",
      repo: "https://github.com/browser-use/jev-ultrafast",
      docs: "https://github.com/browser-use/jev-ultrafast/blob/main/docs/performance.md",
      demo: "https://browser-use.com",
      post: "https://x.com/gregpr07/status/2100411066966749359",
    },
    pricingNote:
      "Open source agent; TypeSafe and text-model keys are bring-your-own. Recording notes ~$0.00006272 OpenRouter for two text calls only.",
    firstSeen: "2026-09-19",
    demoIds: ["browser-ultrafast-gregpr07", "computer-use-speed-savboj"],
    relatedSlugs: ["vercel-eve", "tamaratran-fast-jev-compaction", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev see screenshots?",
        answer:
          "The default agent loop uses structured DOM state per README. The inspector can opt into screenshots for humans; the benchmark video uses a separate screencast.",
      },
    ],
    metaTitle: "Browser Use Jev Ultrafast: Choice per browser step",
    metaDescription:
      "Documented hybrid browser agent: Jev Choice for operation and target in one request, LLM only for TYPE_TEXT. 7.07s Flights demo per performance.md.",
  },

  "vercel-eve": {
    slug: "vercel-eve",
    status: "published",
    problem:
      "Durable agent frameworks need evaluation hooks that stay testable instead of free-form judge prompts.",
    targetUser:
      "TypeScript teams building filesystem-first agents on Vercel who want structured evaluation alongside tools and skills.",
    overview:
      "eve is Vercel's open, filesystem-first agent framework (agent/instructions.md, tools/, skills/, channels/). This directory indexes it because public eve materials describe Jev on the experimental evaluate path for typed scoring; confirm shapes on eve.dev for your pinned version.",
    creator: {
      name: "Vercel",
      company: "Vercel",
      companyUrl: "https://vercel.com",
      githubUrl: "https://github.com/vercel/eve",
    },
    jevUsage: {
      flowRole: "Agent evaluation (experimental evaluate path per listing and eve marketing)",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Structured evaluation payloads as documented on eve.dev for the evaluate integration (verify in your version pin).",
      decisionOut:
        "Thresholdable evaluation scores used in agent workflows instead of unparsed judge prose.",
      flowSteps: [
        "Author agent under agent/ layout",
        "Call evaluate path with structured questions",
        "Apply thresholds in TypeScript policy code",
      ],
    },
    howJevIsUsed:
      "eve keeps orchestration in conventional files while evaluation can call System One through the experimental path described in this site's catalog listing and on eve.dev. This profile does not duplicate eve's full evaluate API: read Vercel's docs for the exact question schema, models, and gateway configuration in the release you deploy.",
    keyFeatures: [
      "npx eve@latest init scaffolding",
      "Filesystem-first agent layout",
      "Channels and schedules for durable agents",
      "Hosted docs at eve.dev",
    ],
    stack: ["TypeScript", "Vercel AI Gateway compatible flows", "TypeSafe System One evaluate path"],
    links: {
      website: "https://eve.dev",
      repo: "https://github.com/vercel/eve",
      docs: "https://eve.dev/docs",
      demo: "https://eve.dev",
    },
    firstSeen: "2026-09-17",
    relatedSlugs: ["tanstack-ai-decide", "browser-use-jev-ultrafast"],
    relatedLearnSlugs: ["vercel-ai-gateway", "system-one"],
    faq: [
      {
        question: "Where is Jev configured in eve?",
        answer:
          "Follow eve.dev/docs for evaluate integration in your release. This directory listing summarizes Jev as the default evaluation model on the experimental evaluate path.",
      },
    ],
    metaTitle: "Vercel eve: filesystem agents with Jev evaluate path",
    metaDescription:
      "Vercel eve agent framework with documented Jev evaluate integration. eve.dev docs, GitHub source, and structured evaluation hooks.",
  },

  "tamaratran-fast-jev-compaction": {
    slug: "tamaratran-fast-jev-compaction",
    status: "published",
    problem:
      "LLM-written compaction summaries drop exact errors, paths, and constraints from agent transcripts.",
    targetUser:
      "Claude Code users who want compaction that deletes stale tool rows without rewriting user or assistant text.",
    overview:
      "fast-jev-compaction is an npm package and Claude Code plugin that replaces summarization with Jev keep-or-drop decisions on paired tool_use and tool_result messages.",
    creator: {
      name: "Tamara Tran",
      handle: "tamarajtran",
      xUrl: "https://x.com/tamarajtran/status/2100694549362553153",
      githubUrl: "https://github.com/tamaratran/fast-jev-compaction",
    },
    creatorQuote: {
      text:
        "Shrink a messy thread before your agent drowns in tokens. Jev keeps the plot, drops the fanfic.",
      attributedTo: "Tamara Tran",
      sourceUrl: "https://x.com/tamarajtran/status/2100694549362553153",
    },
    jevUsage: {
      flowRole: "Context compaction gate on agent tool history",
      primitives: ["Noul"],
      stateIn:
        "Full conversation with tool results replaced by short notes, fitted into maxStateTokens (25k default) using staged truncation described in README.",
      decisionOut:
        "Per tool call: keep result verbatim, keep call with truncated result, or drop call and result based on keepThreshold.",
      flowSteps: [
        "Pair tool_use with tool_result; pin recent and first messages",
        "For each non-pinned call, ask two noul questions (keep call?, keep result verbatim?)",
        "Shard questions across concurrent requests under maxRequestTokens (30k)",
        "Rebuild message list without summarizing user or assistant text",
      ],
      sourcedMetrics: [
        {
          claim: "Default keep threshold applied to keepResult and keepCall noul answers.",
          source: "github.com/tamaratran/fast-jev-compaction README",
        },
      ],
    },
    howJevIsUsed:
      "Compaction never paraphrases content. Jev only answers whether a tool call or its result still matters given the entire transcript state. Noul questions are explicitly documented in the README, including parallel requests when state plus questions would exceed Jev request limits. Failures throw so the Claude Code hook can fall back to default behavior.",
    keyFeatures: [
      "npm library plus Claude Code plugin hooks",
      "Preserves user and assistant messages verbatim",
      "Concurrent shard requests under Jev limits",
      "Configurable preserveRecentMessages and thresholds",
    ],
    stack: ["TypeScript", "Claude Code plugin", "TypeSafe System One", "npm"],
    links: {
      repo: "https://github.com/tamaratran/fast-jev-compaction",
      docs: "https://github.com/tamaratran/fast-jev-compaction#how-it-works",
      post: "https://x.com/tamarajtran/status/2100694549362553153",
    },
    pricingNote: "Bring your own TYPESAFE_API_KEY per README install section.",
    firstSeen: "2026-09-19",
    demoIds: ["context-compaction-tamarajtran"],
    relatedSlugs: ["kushwho-jev-codes", "devagrawal09-jev-review"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Which primitive does compaction use?",
        answer:
          "The README specifies two noul questions per non-pinned tool call: whether to keep the call and whether to keep the result verbatim.",
      },
    ],
    metaTitle: "fast-jev-compaction: Noul gates for Claude Code context",
    metaDescription:
      "Claude Code plugin using parallel Jev noul decisions to drop stale tool rows without LLM summaries. Documented in the fast-jev-compaction README.",
  },

  "hemanth-pkg-gate": {
    slug: "hemanth-pkg-gate",
    status: "published",
    problem:
      "npm lifecycle scripts can exfiltrate or install before humans read package.json hooks.",
    targetUser:
      "Node developers who want a pre-install gate with structured allow, warn, and block verdicts.",
    overview:
      "pkg-gate evaluates package names or raw install scripts with TypeSafe System One before npm hooks run. It exposes TUI and JSON structured output for CI.",
    creator: {
      name: "Hemanth HM",
      handle: "GNUmanth",
      xUrl: "https://x.com/GNUmanth/status/2100405456187564201",
      githubUrl: "https://github.com/hemanth/pkg-gate",
    },
    creatorQuote: {
      text:
        "Intent-aware package installs: block the dependency you did not mean before npm writes to disk.",
      attributedTo: "Hemanth HM",
      sourceUrl: "https://x.com/GNUmanth/status/2100405456187564201",
    },
    jevUsage: {
      flowRole: "Pre-install security gate on lifecycle scripts",
      primitives: ["Choice", "Score"],
      stateIn:
        "Package metadata or raw shell script strings passed to pkgGate(); hooks extracted from package.json for local paths.",
      decisionOut:
        "report.action allow | warn | block with structured intent.choice and probability fields (README structured output example).",
      flowSteps: [
        "Extract preinstall, install, postinstall scripts",
        "Evaluate each script in parallel via System One",
        "Route low confidence to human review per README confidence gate",
      ],
      sourcedMetrics: [
        {
          claim: "Low confidence (conf < 0.50) routes to human review instead of automatic block.",
          source: "github.com/hemanth/pkg-gate README",
        },
      ],
    },
    howJevIsUsed:
      "pkg-gate treats install intent as a Choice problem (example structured field intent.choice: credential_access) and uses Score-style probabilities such as accessesSecrets.probability in documented JSON output. Without TYPESAFE_API_KEY the README documents an offline calibrated simulator fallback.",
    keyFeatures: [
      "pkgGate() API plus CLI",
      "Structured JSON for agents and CI",
      "Raw script evaluation mode",
      "Interactive demo site",
    ],
    stack: ["Node.js", "TypeSafe System One", "npm lifecycle hooks"],
    links: {
      website: "https://hemanth.github.io/pkg-gate/",
      repo: "https://github.com/hemanth/pkg-gate",
      docs: "https://github.com/hemanth/pkg-gate",
      demo: "https://hemanth.github.io/pkg-gate/",
      post: "https://x.com/GNUmanth/status/2100405456187564201",
    },
    pricingNote: "Requires TYPESAFE_API_KEY for live Jev; offline simulator without key per README.",
    firstSeen: "2026-09-19",
    demoIds: ["pkg-gate-gnumanth"],
    relatedSlugs: ["kushwho-jev-codes", "classifier-dev"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Does pkg-gate replace npm audit?",
        answer: "No. It judges install script intent, not CVE databases.",
      },
    ],
    metaTitle: "pkg-gate: Choice and Score npm install gate",
    metaDescription:
      "Pre-install System One gate with structured allow, warn, and block verdicts. Hemanth pkg-gate README plus live demo.",
  },

  "devagrawal09-jev-review": {
    slug: "devagrawal09-jev-review",
    status: "published",
    problem:
      "Monolithic LLM code reviews are slow and non-deterministic compared to staged structured judgments.",
    targetUser:
      "Developers running local diff or full-repo reviews with a dashboard on localhost.",
    overview:
      "jev-review orchestrates a staged review pipeline in TypeScript and uses Jev for bounded judgments, presenting reports in a local dashboard on 127.0.0.1:4317.",
    creator: {
      name: "Dev Agrawal",
      githubUrl: "https://github.com/devagrawal09",
      company: "Independent",
    },
    jevUsage: {
      flowRole: "Multi-stage code review and codebase scan judgments",
      primitives: ["Noul", "Choice", "Score"],
      stateIn:
        "Git diffs or discovered source files plus selected evidence hunks and test context per README workflow.",
      decisionOut:
        "Staged risk matrix, file profiles, evidence selection, mechanism classification, severity scores, and reviewer routing decisions.",
      flowSteps: [
        "Noul risk matrix",
        "Choice + Score file profiles",
        "Choice evidence selection",
        "Choice mechanism classification",
        "Score severity",
        "Conditional Choice reviewer routing",
      ],
    },
    howJevIsUsed:
      "The README documents an explicit pipeline where each stage is a focused Jev call type. Policy thresholds live in TypeScript, not in model prose. The dashboard binds to localhost and never serves .env files, which makes the tool suitable for experimenting with parallel questions before wiring CI gates.",
    keyFeatures: [
      "review:changes and review:codebase modes",
      "Local dashboard with collapsible sections",
      "Requires Node.js 24+ and TYPESAFE_API_KEY",
      "Dependency-layer enforcement via scripts/check-dependencies.ts",
    ],
    stack: ["TypeScript", "Node.js 24+", "Git", "TypeSafe System One"],
    links: {
      repo: "https://github.com/devagrawal09/jev-review",
      docs: "https://github.com/devagrawal09/jev-review#how-it-works",
    },
    pricingNote: "Uses TypeSafe API key from console.typesafe.ai per README.",
    firstSeen: "2026-09-19",
    demoIds: ["code-review-gate-kunal"],
    relatedSlugs: ["kushwho-jev-codes", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "How is this different from jev-codes?",
        answer:
          "jev-review is a staged review dashboard. jev-codes audits diffs against YAML standards packs with per-hunk parallel calls.",
      },
    ],
    metaTitle: "jev-review: staged Noul, Choice, and Score reviews",
    metaDescription:
      "Local Jev review pipeline with documented stages from risk matrix through severity Score. GitHub README and dashboard on localhost.",
  },

  "ploy-ai": {
    slug: "ploy-ai",
    status: "published",
    problem:
      "Marketing teams run heavy A/B programs to test headlines and layouts for each visitor segment.",
    targetUser:
      "Growth teams using Ploy's AI-native site builder for funnel personalization.",
    overview:
      "Ploy (ploy.ai) is an AI-native site builder. The public Bryant Chou showcase clip describes Jev choosing headline, layout, and copy per visitor segment.",
    creator: {
      name: "Bryant Chou",
      handle: "bryantchou",
      xUrl: "https://x.com/bryantchou/status/2101485995669770522",
      company: "Ploy",
      companyUrl: "https://ploy.ai",
    },
    creatorQuote: {
      text:
        "Ploy reads your funnel, Jev picks headline and layout for each segment in about twenty-five milliseconds. A/B tests without the all-hands.",
      attributedTo: "Bryant Chou",
      sourceUrl: "https://x.com/bryantchou/status/2101485995669770522",
    },
    jevUsage: {
      flowRole: "On-page personalization routing (headline, layout, copy selection)",
      primitives: ["Choice"],
      stateIn:
        "Visitor or segment context plus variant catalog (inferred from showcase description; no open-source schema on this directory).",
      decisionOut:
        "Selected headline and layout variant per visitor according to the launch clip.",
      sourcedMetrics: [
        {
          claim: "About twenty-five millisecond decisions per visitor in the launch clip.",
          source: "Jev Directory showcase blurb citing Bryant Chou post",
        },
      ],
    },
    howJevIsUsed:
      "Ploy uses Jev for discrete variant selection rather than generating entire pages from scratch on every request, per the attributed launch clip. This profile does not claim internal Ploy schemas beyond what Bryant Chou published; treat ploy.ai as the product source of truth for funnels and analytics.",
    keyFeatures: [
      "AI-native site builder at ploy.ai",
      "Segment-aware copy and layout selection in public demo",
      "Featured homepage showcase embed",
    ],
    stack: ["Ploy hosted platform", "TypeSafe System One (per builder clip)"],
    links: {
      website: "https://ploy.ai",
      post: "https://x.com/bryantchou/status/2101485995669770522",
    },
    firstSeen: "2026-09-19",
    demoIds: ["ploy-jev-websites-bryantchou"],
    relatedSlugs: ["classifier-dev", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Can I verify latency independently?",
        answer:
          "The ~25ms figure comes from the attributed X clip on this site's showcase. Measure on your own funnel inside Ploy for production SLOs.",
      },
    ],
    metaTitle: "Ploy: Choice-driven funnel personalization",
    metaDescription:
      "ploy.ai marketing builder with Jev picking headline and layout per segment. Sourced from Bryant Chou showcase clip on Jev Directory.",
  },

  "kushwho-jev-codes": {
    slug: "kushwho-jev-codes",
    status: "published",
    problem:
      "Agent-written diffs need merge gates that stay consistent across repos and agents.",
    targetUser:
      "Teams using Claude Code, Cursor, Codex, opencode, or Antigravity with YAML standards packs.",
    overview:
      "jev-codes audits git diffs hunk-by-hunk against editable YAML standards. Jev answers typed questions; it never writes code.",
    creator: {
      name: "Kushal Agarwal",
      handle: "kushwho11146",
      xUrl: "https://x.com/kushwho11146/status/2101103318386758011",
      githubUrl: "https://github.com/kushwho/jev-codes",
    },
    creatorQuote: {
      text:
        "Point Jev at your diff and a YAML standards pack. Your agent gets a merge opinion that is not vibes-only.",
      attributedTo: "Kushal Agarwal",
      sourceUrl: "https://x.com/kushwho11146/status/2101103318386758011",
    },
    jevUsage: {
      flowRole: "Pre-merge audit gate on changed hunks",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Per-hunk state {file, language, hunk, context_before, context_after} under 24k token budget per README.",
      decisionOut:
        "Thresholded pass or fail per pack question; JSON or TTY report with fail-on levels.",
      flowSteps: [
        "git diff to hunks, filter ignores",
        "One parallel Jev call per hunk (eight in flight)",
        "Apply thresholds and min_confidence from YAML pack",
      ],
      sourcedMetrics: [
        {
          claim: "Eval runner reports HIGH gate precision 1.000 on six cases at ~$0.0006 for 17 calls.",
          source: "github.com/kushwho/jev-codes README eval section",
        },
      ],
    },
    howJevIsUsed:
      "Packs are YAML question definitions including noul items that skip the confidence gate by design. The CLI caches answers by hash of state plus question text so reruns only re-score changed hunks. Agents invoke audit --json and fix only high or medium findings at reported lines per harness adapters.",
    keyFeatures: [
      "npx @kushwho/jev-codes audit with --json for agents",
      "Bundled core pack plus per-repo .jev-codes/standards.yaml",
      "Harness plugins for Claude, Cursor, Codex, opencode, Antigravity",
      "jev-codes-eval labeled diff suite in repo",
    ],
    stack: ["TypeScript CLI", "YAML standards packs", "Git", "TypeSafe System One"],
    links: {
      repo: "https://github.com/kushwho/jev-codes",
      docs: "https://github.com/kushwho/jev-codes#how-it-works",
      post: "https://x.com/kushwho11146/status/2101103318386758011",
    },
    pricingNote: "Live Jev calls require TYPESAFE_API_KEY; README cites fraction-of-a-cent per audit.",
    firstSeen: "2026-09-19",
    demoIds: ["jev-codes-kushwho"],
    relatedSlugs: ["devagrawal09-jev-review", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev edit my code?",
        answer: "No. README states Jev only answers typed questions; agents apply fixes.",
      },
    ],
    metaTitle: "jev-codes: YAML standards audit gate with Jev",
    metaDescription:
      "Parallel per-hunk Jev audits against YAML packs. Kushal jev-codes README, eval metrics, and showcase clip.",
  },

  "tanstack-ai-decide": {
    slug: "tanstack-ai-decide",
    status: "published",
    problem:
      "TypeScript apps need typed decision helpers instead of raw System One HTTP for every agent feature.",
    targetUser:
      "Developers using TanStack AI who want decide() for structured agent control flow.",
    overview:
      "TanStack AI adds decide() for typed Choice, Score, and boolean paths. Documentation lives on tanstack.com/ai with source in github.com/TanStack/ai.",
    creator: {
      name: "TanStack",
      handle: "tan_stack",
      xUrl: "https://x.com/tan_stack/status/2101659024890765819",
      company: "TanStack",
      companyUrl: "https://tanstack.com",
      githubUrl: "https://github.com/TanStack/ai",
    },
    creatorQuote: {
      text:
        "TanStack ships decide() for typed choices, scores, and booleans so your agent loop stops faking it as a chatbot.",
      attributedTo: "TanStack",
      sourceUrl: "https://x.com/tan_stack/status/2101659024890765819",
    },
    jevUsage: {
      flowRole: "Application and agent routing via decide() API",
      primitives: ["Choice", "Score", "Noul"],
      stateIn: "Typed decide() inputs as defined in TanStack AI docs for your runtime.",
      decisionOut: "Structured decision results consumable in TypeScript control flow.",
      flowSteps: [
        "Call decide() from TanStack AI",
        "Map to System One semantics",
        "Threshold probabilities in app code",
      ],
    },
    howJevIsUsed:
      "decide() is TanStack's ergonomic surface for System One style questions. The launch clip on Jev Directory shows agent code using decide() instead of parsing chat completions. Pair TanStack AI with gateway or TypeSafe keys per TanStack docs for your deployment target.",
    keyFeatures: [
      "decide() API for choices, scores, and booleans",
      "Official docs at tanstack.com/ai",
      "Open source monorepo on GitHub",
      "Homepage showcase clip",
    ],
    stack: ["TypeScript", "TanStack AI", "TypeSafe System One"],
    links: {
      website: "https://tanstack.com/ai/latest",
      repo: "https://github.com/TanStack/ai",
      docs: "https://tanstack.com/ai/latest",
      post: "https://x.com/tan_stack/status/2101659024890765819",
    },
    firstSeen: "2026-09-19",
    demoIds: ["tanstack-ai-decide-tanstack"],
    relatedSlugs: ["vercel-eve", "classifier-dev"],
    relatedLearnSlugs: ["vercel-ai-gateway", "jev-typesafe"],
    faq: [
      {
        question: "Is decide() only for React?",
        answer: "TanStack AI documents multiple runtimes; read tanstack.com/ai for your stack.",
      },
    ],
    metaTitle: "TanStack AI decide(): Choice, Score, Noul in TypeScript",
    metaDescription:
      "TanStack AI decide() exposes System One primitives in TypeScript. Official docs, GitHub repo, and TanStack launch clip.",
  },

  "dub-co": {
    slug: "dub-co",
    status: "published",
    problem:
      "Free short links attract lead gen traffic and abusive actors who paste phishing URLs through the same dub.sh funnel.",
    targetUser:
      "Teams running Dub link campaigns who need scalable abuse detection without paying chat-model prices per click.",
    overview:
      "Dub (dub.co) is a link management and analytics platform. Steven Tey's weekend project clip describes building a malicious URL scanner for dub.sh using Jev, trained on ten thousand plus malicious domains Dub already caught historically.",
    creator: {
      name: "Steven Tey",
      handle: "steventey",
      xUrl: "https://x.com/steventey/status/2101706435898069093",
      company: "Dub",
      companyUrl: "https://dub.co",
    },
    creatorQuote: {
      text:
        "Feed malicious domains into Jev, train it to flag malicious-looking URLs, and keep scanning cost negligible thanks to token-efficient Jev.",
      attributedTo: "Steven Tey",
      sourceUrl: "https://x.com/steventey/status/2101706435898069093",
    },
    jevUsage: {
      flowRole: "Abuse detection gate on new short links",
      primitives: ["Noul", "Score"],
      stateIn:
        "Candidate URL text plus historical malicious domain patterns described in the launch thread (ten thousand plus known bad domains).",
      decisionOut:
        "Malicious or suspicious URL flag before the link spreads on dub.sh, per the attributed build clip.",
      flowSteps: [
        "Collect historical malicious domains from Dub abuse operations",
        "Train or calibrate Jev scoring on malicious-looking URL features",
        "Run cheap Jev checks on incoming dub.sh links at creation time",
      ],
      sourcedMetrics: [
        {
          claim: "Built and shipped the scanner in about two hours after wrestling with abuse since day one.",
          source: "Steven Tey X thread on malicious link scanner",
        },
      ],
    },
    howJevIsUsed:
      "Instead of calling a general LLM on every new short link, Dub's clip uses Jev as a fast structured classifier over URL text informed by prior abuse data. Token efficiency keeps marginal scan cost near zero at link volume. This profile does not claim undisclosed Dub internal APIs beyond Steven Tey's public post.",
    keyFeatures: [
      "Branded links and analytics at dub.co",
      "dub.sh free tier lead gen with abuse risk",
      "Jev-backed malicious URL scanner from public demo",
    ],
    stack: ["Dub platform", "dub.sh short links", "TypeSafe System One"],
    links: {
      website: "https://dub.co",
      post: "https://x.com/steventey/status/2101706435898069093",
    },
    firstSeen: "2026-09-20",
    demoIds: ["dub-malicious-urls-steventey"],
    relatedSlugs: ["classifier-dev", "hemanth-pkg-gate"],
    relatedLearnSlugs: ["jev-vs-llm-classification", "use-cases"],
    faq: [
      {
        question: "Is the scanner live for all dub.sh links?",
        answer:
          "This directory documents the pattern from Steven Tey's public clip. Confirm rollout scope on dub.co or Dub changelogs.",
      },
    ],
    metaTitle: "Dub: Jev malicious URL scanner for dub.sh",
    metaDescription:
      "Dub link platform abuse detection with Jev trained on historical malicious domains. Steven Tey showcase clip on Jev Directory.",
  },

  "avec-ai": {
    slug: "avec-ai",
    status: "published",
    problem:
      "Email clients default to reverse chronological inboxes, burying urgent threads under newsletter noise.",
    targetUser:
      "Knowledge workers who want incoming mail re-ranked by importance in real time.",
    overview:
      "Avec (avec.ai) is an email product teased by Jonathan Unikowski with live inbox prioritization powered by Jev instead of static chronological sorting.",
    creator: {
      name: "Jonathan Unikowski",
      handle: "jnnnthnn",
      xUrl: "https://x.com/jnnnthnn/status/2101399331115077760",
      company: "Avec",
      companyUrl: "https://avec.ai",
    },
    creatorQuote: {
      text:
        "What if your inbox was live prioritized by importance instead of reverse chronological order? Built with Jev.",
      attributedTo: "Jonathan Unikowski",
      sourceUrl: "https://x.com/jnnnthnn/status/2101399331115077760",
    },
    jevUsage: {
      flowRole: "Live importance ranking as messages arrive",
      primitives: ["Score", "Choice"],
      stateIn:
        "Incoming message metadata and body snippets plus current inbox context (inferred from showcase; no public schema beyond the clip).",
      decisionOut:
        "Dynamic ordering or priority labels so important threads surface immediately.",
      flowSteps: [
        "Ingest new mail events",
        "Jev scores importance relative to user context",
        "Reorder or highlight inbox UI live",
      ],
    },
    howJevIsUsed:
      "The showcase positions Jev as the fast structured ranker that can run continuously on mail streams without rewriting the whole message in an LLM on every ping. Avec is marked coming soon in the source post; treat feature availability on avec.ai as the source of truth.",
    keyFeatures: [
      "Live prioritization instead of reverse chronology",
      "Public teaser at avec.ai",
      "Homepage showcase embed",
    ],
    stack: ["Avec email client", "TypeSafe System One"],
    links: {
      website: "https://avec.ai",
      post: "https://x.com/jnnnthnn/status/2101399331115077760",
    },
    firstSeen: "2026-09-20",
    demoIds: ["avec-email-priority-jnnnthnn"],
    relatedSlugs: ["classifier-dev", "ploy-ai"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Can I sign up today?",
        answer:
          "The attributed clip says coming to Avec soon. Check avec.ai for current access.",
      },
    ],
    metaTitle: "Avec: Jev live email importance ranking",
    metaDescription:
      "Avec email client teaser with Jev prioritizing inbox threads in real time. Jonathan Unikowski showcase on Jev Directory.",
  },

  "pixelml-com": {
    slug: "pixelml-com",
    status: "published",
    problem:
      "Agentic video Q&A over long files is slow and expensive when every retrieval hop uses a large multimodal model.",
    targetUser:
      "Teams indexing enterprise video libraries with many queries over the same corpus.",
    overview:
      "PixelML (pixelml.com) ships pixelml-av, the open-source library behind Composer and Sentinel agents that index video to text for LLM reasoning. Sean Phan's clip benchmarks Grok plus Jev against Gemini Flash native video on a seventy-five minute file.",
    creator: {
      name: "Sean Phan",
      handle: "seanphan",
      xUrl: "https://x.com/seanphan/status/2101398226654171359",
      company: "PixelML",
      companyUrl: "https://pixelml.com",
    },
    creatorQuote: {
      text:
        "pixelml-av plus Grok plus Jev: about two tenths of a cent per query and four seconds on eight questions over seventy-five minutes of video.",
      attributedTo: "Sean Phan",
      sourceUrl: "https://x.com/seanphan/status/2101398226654171359",
    },
    jevUsage: {
      flowRole: "Relevance filter before Grok answers and support check after",
      primitives: ["Noul", "Score"],
      stateIn:
        "Retrieved candidate evidence with pixelml-av local temporal grouping bound to each query.",
      decisionOut:
        "Relevance pass on candidates, Grok answer, then support check with optional frame reinspection when confidence is low.",
      flowSteps: [
        "Query retrieves candidate evidence from indexed video",
        "Jev checks relevance with av local temporal context",
        "Grok generates answer",
        "Jev support check; low confidence triggers frame inspection",
      ],
      sourcedMetrics: [
        {
          claim: "Eight questions on a seventy-five minute video: about $0.0022 per query and 4.0s for av plus Grok plus Jev vs $0.2253 and 39.9s for Gemini 3.8 Flash native in the clip.",
          source: "Sean Phan X benchmark post",
        },
        {
          claim: "Described as about 100x cheaper and 10x faster than Gemini Flash native in the same post.",
          source: "Sean Phan X benchmark post",
        },
      ],
    },
    howJevIsUsed:
      "Jev acts as a System One refiner on the search path: fast cheap gates on whether evidence matters and whether Grok's answer is supported, reserving heavier vision calls for low-confidence reinspection. This matches PixelML's stated move away from using the LLM alone to verify every retrieval.",
    keyFeatures: [
      "pixelml-av open-source video indexing library",
      "Composer and Sentinel agents at pixelml.com",
      "Grok plus Jev refiner pipeline in public demo",
    ],
    stack: ["pixelml-av", "Grok", "TypeSafe System One", "PixelML agents"],
    links: {
      website: "https://pixelml.com",
      post: "https://x.com/seanphan/status/2101398226654171359",
    },
    firstSeen: "2026-09-20",
    demoIds: ["pixelml-av-grok-jev-seanphan"],
    relatedSlugs: ["browser-use-jev-ultrafast", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is pixelml-av open source?",
        answer:
          "Sean Phan's post describes pixelml-av as the open-source library behind PixelML agents. Confirm repo links on pixelml.com.",
      },
    ],
    metaTitle: "PixelML: Grok plus Jev video Q&A with pixelml-av",
    metaDescription:
      "pixelml-av indexes video; Jev filters relevance and checks answer support before costly vision calls. Sean Phan benchmark clip.",
  },

  "hypit-ai": {
    slug: "hypit-ai",
    status: "published",
    problem:
      "Marketers need many distinct AI UGC creators without copy-paste faces or manual art direction for every variant.",
    targetUser:
      "Growth and creative teams using Hypit for AI UGC avatar campaigns.",
    overview:
      "Hypit (hypit.ai) generates unique AI UGC creators with natural expressions. The launch clip uses Jev to pick style combinations from product, audience, and vibe inputs before Hypit renders one hundred creators in about thirteen seconds.",
    creator: {
      name: "Hypit",
      handle: "hypitai",
      xUrl: "https://x.com/hypitai/status/2101686320909426977",
      company: "Hypit",
      companyUrl: "https://hypit.ai",
    },
    creatorQuote: {
      text:
        "Drop product, audience, and vibe into Jev. It picks styles that fit, then Hypit remixes them into fresh randomized combinations.",
      attributedTo: "Hypit",
      sourceUrl: "https://x.com/hypitai/status/2101686320909426977",
    },
    jevUsage: {
      flowRole: "Creative style and persona mix selection",
      primitives: ["Choice"],
      stateIn:
        "Marketer brief: product description, target audience, and desired vibe from the launch post.",
      decisionOut:
        "Selected UGC style combinations Hypit renders into distinct creators.",
      sourcedMetrics: [
        {
          claim: "One hundred unique AI UGC creators in about 13.07 seconds in the launch clip.",
          source: "Hypit X launch post",
        },
      ],
    },
    howJevIsUsed:
      "Jev chooses which creative styles fit the brief so Hypit is not brute-forcing random faces. Discrete Choice routing keeps generation fast enough for interactive campaign tooling. Confirm Hypit product UI details on hypit.ai.",
    keyFeatures: [
      "AI UGC creators with distinct looks and personalities",
      "Brief-driven style selection via Jev",
      "Public launch clip with timing claim",
    ],
    stack: ["Hypit platform", "TypeSafe System One"],
    links: {
      website: "https://hypit.ai",
      post: "https://x.com/hypitai/status/2101686320909426977",
    },
    firstSeen: "2026-09-20",
    demoIds: ["hypit-ugc-styles-hypitai"],
    relatedSlugs: ["ploy-ai", "dub-co"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Jev generate the video avatars?",
        answer:
          "The post describes Jev picking styles while Hypit renders creators. Generation stack details live on hypit.ai.",
      },
    ],
    metaTitle: "Hypit: Jev style picks for AI UGC creators",
    metaDescription:
      "Hypit UGC studio uses Jev to choose creative mixes from marketer briefs. Launch clip on Jev Directory.",
  },

  "egghead-smart-procurement": {
    slug: "egghead-smart-procurement",
    status: "published",
    problem:
      "Manufacturing procurement teams lose hours on repetitive ERP data entry into SAP, Oracle, and similar systems.",
    targetUser:
      "Japanese manufacturers and integrators deploying Egghead Smart AI procurement with forward-deployed engineering.",
    overview:
      "Egghead Inc. (egghead.co.jp) offers Smart AI procurement for manufacturing. A sakai_1910 showcase clip praises Jev browser operation speed for ERP busywork and argues combining FDE services with Jev beats narrow SaaS alone.",
    creator: {
      name: "sakai",
      handle: "sakai_1910",
      xUrl: "https://x.com/sakai_1910/status/2101536551360704770",
      company: "Egghead Inc.",
      companyUrl: "https://www.egghead.co.jp",
    },
    creatorQuote: {
      text:
        "Jev browser ops are overwhelmingly fast for manufacturing procurement, including tedious input into SAP and Oracle core systems.",
      attributedTo: "sakai",
      sourceUrl: "https://x.com/sakai_1910/status/2101536551360704770",
    },
    jevUsage: {
      flowRole: "Fast browser automation routing for ERP form workflows",
      primitives: ["Choice"],
      stateIn:
        "Browser snapshots and procurement task context for SAP, Oracle, and similar web or terminal-adjacent UIs (per clip examples).",
      decisionOut:
        "Next browser operation targets for data entry and procurement steps without slow LLM planning on every click.",
      flowSteps: [
        "Observe ERP or procurement UI state",
        "Jev chooses next browser operation",
        "Execute entry steps across systems PC operators already use",
      ],
    },
    howJevIsUsed:
      "The clip highlights Jev's speed on browser-use style routing for manufacturing back-office tasks. Egghead positions Smart AI procurement as a domain-specific deployment with integrator support rather than generic RPA alone. Detailed schemas are not public in the X post; confirm implementation docs with Egghead.",
    keyFeatures: [
      "Smart AI procurement product on egghead.co.jp",
      "Manufacturing-focused procurement automation",
      "Jev-speed browser ops in public Japanese showcase",
    ],
    stack: ["Egghead Smart AI procurement", "SAP and Oracle UIs", "TypeSafe System One", "Browser automation"],
    links: {
      website: "https://www.egghead.co.jp",
      post: "https://x.com/sakai_1910/status/2101536551360704770",
    },
    firstSeen: "2026-09-20",
    demoIds: ["egghead-procurement-sakai1910"],
    relatedSlugs: ["browser-use-jev-ultrafast", "rtrvr-ai"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is the demo in English?",
        answer:
          "The source clip is Japanese commentary about manufacturing procurement. Product pages on egghead.co.jp carry official language.",
      },
    ],
    metaTitle: "Egghead Smart AI procurement with Jev browser ops",
    metaDescription:
      "Egghead manufacturing procurement uses fast Jev browser routing for ERP entry. sakai_1910 showcase on Jev Directory.",
  },

  docjev: {
    slug: "docjev",
    status: "published",
    problem:
      "Document pipelines need fast category labels and split boundaries without paying chat-model prices on every page.",
    targetUser:
      "Teams building ingestion, RAG, or compliance flows over PDFs and scans who want rule-driven classify and split steps.",
    overview:
      "DocJev is an open-source library from Jerry Liu (github.com/jerryjliu/docjev) for document classification and splitting with TypeSafe Jev. Supply natural-language category rules alongside document text; Jev returns a predicted category or sub-document boundaries.",
    creator: {
      name: "Jerry Liu",
      handle: "jerryjliu0",
      xUrl: "https://x.com/jerryjliu0/status/2101738281046294552",
      githubUrl: "https://github.com/jerryjliu/docjev",
      company: "LlamaIndex",
      companyUrl: "https://www.llamaindex.ai",
    },
    creatorQuote: {
      text:
        "Give a document alongside natural language category rules. Jev will predict the document category or the boundaries between sub-documents.",
      attributedTo: "Jerry Liu",
      sourceUrl: "https://x.com/jerryjliu0/status/2101738281046294552",
    },
    jevUsage: {
      flowRole: "Document classification and split-boundary prediction",
      primitives: ["Choice", "Score"],
      stateIn:
        "Parsed document text from liteparse or LlamaParse plus user-authored natural-language category or split rules from the DocJev API.",
      decisionOut:
        "Predicted document category for classify mode, or boundary decisions between sub-documents for split mode.",
      flowSteps: [
        "Parse document with liteparse (OSS) or LlamaParse (VLM preprocessing)",
        "Format rules and text for Jev System One calls",
        "Jev classifies or marks split boundaries per DocJev configuration",
      ],
      sourcedMetrics: [
        {
          claim: "About six times faster than gpt-5.6-luna with equivalent accuracy in the launch benchmark (liteparse timings included).",
          source: "Jerry Liu DocJev announcement on X",
        },
      ],
    },
    howJevIsUsed:
      "DocJev wraps Jev as the decision core for both classify and split workflows so teams express policy in natural language instead of brittle regex. liteparse is the default fast OSS parser for digital documents; LlamaParse adds VLM preprocessing latency but suits cached digitization for downstream LlamaIndex tasks. Confirm latest benchmarks and APIs in the DocJev repository.",
    keyFeatures: [
      "Open source at github.com/jerryjliu/docjev",
      "Classify and split modes with natural-language rules",
      "liteparse integration (github.com/run-llama/liteparse)",
      "Optional LlamaParse via cloud.llamaindex.ai",
    ],
    stack: ["DocJev", "TypeSafe System One", "liteparse", "LlamaParse", "LlamaIndex ecosystem"],
    links: {
      repo: "https://github.com/jerryjliu/docjev",
      website: "https://www.llamaindex.ai",
      docs: "https://github.com/jerryjliu/docjev",
      post: "https://x.com/jerryjliu0/status/2101738281046294552",
    },
    firstSeen: "2026-09-20",
    demoIds: ["docjev-jerryjliu0"],
    relatedSlugs: ["wiktorb2004-llama-index-jev", "classifier-dev", "marissafamularo-citation-verifier"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is DocJev part of LlamaIndex core?",
        answer:
          "DocJev is a standalone OSS repo from Jerry Liu. It integrates optional LlamaParse and liteparse from the Run Llama ecosystem; treat github.com/jerryjliu/docjev as the source of truth.",
      },
    ],
    metaTitle: "DocJev: Jev document classify and split",
    metaDescription:
      "Jerry Liu DocJev uses Jev for fast document classification and splitting with natural-language rules. Launch clip and GitHub repo on Jev Directory.",
  },

  "socai-io-jev-social": {
    slug: "socai-io-jev-social",
    status: "published",
    problem:
      "Social research agents often free-form shell commands or opaque browser macros, which is risky on logged-in Instagram, TikTok, and LinkedIn sessions.",
    targetUser:
      "Analysts and builders who want local-first social evidence gathering with auditable steps and cited Markdown output.",
    overview:
      "Jev Social pairs TypeSafe Jev with the socai CLI. You state a research goal; each loop rebuilds a finite menu of read-only socai commands (search, open a discovered profile or post, read comments, optional TikTok download, inspect state, finish). Jev selects the next operation; socai executes in the user's Chrome and returns structured observations. The UI stores choice, confidence, command, summary, and timing per step, then compiles cards, tables, and an evidence report with source links.",
    creator: {
      name: "socai",
      handle: "Asklv123123123",
      xUrl: "https://x.com/Asklv123123123",
      githubUrl: "https://github.com/socai-io/jev-social",
      company: "socai",
      companyUrl: "https://socai.io",
    },
    jevUsage: {
      flowRole: "Per-step routing over a dynamic catalog of socai CLI operations",
      primitives: ["Choice"],
      stateIn:
        "User goal, platform context, history of prior operations with observed summaries, and enumerated command targets derived from captured results or explicit URLs.",
      decisionOut:
        "Next allowed socai command or finish; confidence recorded per README. Unsupported, malformed, and low-confidence decisions do not run; failed ops are removed from the next choice set.",
      flowSteps: [
        "Build bounded operation list from socai capabilities and prior results",
        "Jev Choice picks platform (auto mode) then next operation",
        "socai CLI runs read-only command in Chrome",
        "Append observation and repeat until finish or max-steps",
        "Compile cited Markdown report from captured text and links",
      ],
    },
    howJevIsUsed:
      "Jev never emits arbitrary shell or DOM coordinates. It only chooses among commands the app exposes, matching the Browser Use pattern of finite actions over structured state. Confidence and policy live in application code: sub-threshold or invalid picks are dropped before socai runs. The OpenRouter Decisions path supplies Jev access with bring-your-own-key configuration documented in the repository README. Step limits (--max-steps, default 12) bound cost while partial results remain honest when login walls or decision failures appear.",
    keyFeatures: [
      "Instagram, TikTok, and LinkedIn operation tables in README",
      "npx github:socai-io/jev-social onboard without cloning",
      "Loopback web UI at 127.0.0.1:8766 plus CLI search mode",
      "Per-step telemetry: choice, confidence, command, elapsed time",
      "Marketing site and GIF demos linked from repository",
    ],
    stack: [
      "Node 20+",
      "socai CLI (Chrome automation)",
      "TypeSafe Jev via OpenRouter",
      "JavaScript",
    ],
    links: {
      website: "https://socai-io.github.io/jev-social/",
      repo: "https://github.com/socai-io/jev-social",
      docs: "https://github.com/socai-io/jev-social",
      demo: "https://socai-io.github.io/jev-social/",
      post: "https://socai.io/blog/jev-social-media-automation/",
    },
    pricingNote:
      "Open source; OpenRouter Jev usage bills to your key. No mock fallback when Jev is unavailable.",
    firstSeen: "2026-09-20",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
      "jkudish-jev-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev Social run in the cloud?",
        answer:
          "No. The app is local-first with a loopback UI. socai drives your Chrome; README states reports compile from captured evidence without handing browsing to another agent.",
      },
      {
        question: "What happens on low confidence?",
        answer:
          "README: unsupported, malformed, and low-confidence decisions do not execute. The next choice set also omits previously attempted operations.",
      },
      {
        question: "Which platforms are supported?",
        answer:
          "Instagram, TikTok, and LinkedIn via socai commands documented in the Available operations table. Only installed socai CLI commands appear as Jev choices.",
      },
      {
        question: "How do I try it quickly?",
        answer:
          "npx --yes github:socai-io/jev-social onboard then npx --yes github:socai-io/jev-social, or clone the repo and npm start per README. You need Node 20+, OpenRouter with Jev access, and socai CLI.",
      },
    ],
    metaTitle: "Jev Social: typed socai CLI loops for social research",
    metaDescription:
      "Local Jev Choice router over read-only socai commands in Chrome. Instagram, TikTok, LinkedIn evidence to cited Markdown. Open source with live demo site.",
  },

  "mfm-jev-search": {
    slug: "mfm-jev-search",
    status: "published",
    problem:
      "YouTube channel search is either generic Google results or endless scrolling the uploads tab. Founders want \"that episode where they talked about X\" without memorizing titles.",
    targetUser:
      "My First Million listeners, indie hackers, and Jev builders who want a reference channel-search stack with typed gates instead of vibes-only reranking.",
    overview:
      "My First Million × Jev scopes retrieval to @MyFirstMillionPod. Try the live demo at /demos/my-first-million/: hybrid recall plus one Gateway evaluate pass with exists, relevance, topic, and hit questions, then a pile UI with FLIP rise, debug sheet, and caption mention chips with &t= jump links.",
    creator: {
      name: "Rishit Patel",
      handle: "imrishit98",
      xUrl: "https://x.com/imrishit98",
      githubUrl: "https://github.com/imrishit98",
      company: "Southern East Inc.",
      companyUrl: "https://aitools.fyi",
    },
    jevUsage: {
      flowRole: "Query understanding, hybrid shortlist rerank, and per-video match gates",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "User query, channel metadata, and a shortlist of candidate videos with title, description, tags, chapters, and transcript snippets pulled from the local catalog.",
      decisionOut:
        "Intent Choice for query understanding; boolean exists gate; per-candidate relevance, topic, and hit Score/Noul blend with configurable thresholds before results render.",
      flowSteps: [
        "Local lexicon expansion plus Jev Choice intent (guest, series, game, vibe, other)",
        "Hybrid recall: BM25, TF-IDF, fuzzy, and caption-proximity lanes fused with weighted RRF (~12)",
        "Single experimental_evaluate: exists, rel_*, topic_*, hit_* with transcript snippets in state",
        "Weighted blend (0.4 / 0.25 / 0.35) with exists and combined match gates",
        "UI pile, FLIP rise, debug sheet, Mentioned in captions with YouTube &t= links",
      ],
    },
    howJevIsUsed:
      "Jev is not a chat wrapper here. Cloudflare Pages Functions call AI SDK experimental_evaluate with typesafe-ai/jev through the Vercel AI Gateway. One Choice classifies query intent before hybrid recall expands BM25 terms; re-rank still uses the original user query. A single evaluate batches exists, per-candidate relevance and topic booleans, and hit score rubric (off-topic, partial, direct hit) with transcript snippets in state. Application code blends 0.4 / 0.25 / 0.35 and applies exists and match gates. Hybrid recall (including caption-proximity lane) stays local; Jev only sees the shortlist metadata blob.",
    keyFeatures: [
      "Hybrid recall (BM25, TF-IDF, fuzzy to RRF) in hybrid-recall.mjs",
      "Query understanding before BM25 expansion",
      "Multi-question Jev with exists and match confidence gates",
      "Caption mention timestamps and Jump to mention links",
      "Flat-playlist ingest and optional yt-dlp enrichment for captions",
      "Debug sheet with understand, shortlist lanes, and full JSON",
    ],
    stack: [
      "Cloudflare Pages Functions",
      "Vercel AI SDK + AI Gateway",
      "typesafe-ai/jev",
      "Hybrid BM25 / TF-IDF / fuzzy / caption RRF",
    ],
    links: {
      repo: "https://github.com/imrishit98/jev.aitools.fyi",
      docs: "https://jev.aitools.fyi/demos/my-first-million/",
      demo: "https://jev.aitools.fyi/demos/my-first-million/",
    },
    pricingNote:
      "Open source demo. Live Jev calls bill to your AI Gateway key; mock mode skips network.",
    firstSeen: "2026-09-20",
    relatedSlugs: ["classifier-dev", "tanstack-ai-decide", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does this search the whole internet?",
        answer:
          "No. Retrieval and scoring are scoped to the My First Million uploads catalog bundled at src/data/mfm-channel-catalog.json.",
      },
      {
        question: "Can I run it without a Gateway key?",
        answer:
          "Yes. Set JEV_MOCK=true in Cloudflare Pages env vars (or .dev.vars for wrangler pages dev). Mock mode skips Gateway calls and uses deterministic scores.",
      },
      {
        question: "Where do caption jump links come from?",
        answer:
          "When catalog videos include SRT/VTT caption text, the demo finds mention windows and builds YouTube &t= URLs in the feature card.",
      },
    ],
    metaTitle: "My First Million × Jev: search what was said",
    metaDescription:
      "Hybrid recall, Jev multi-question re-rank, and jump-to-caption timestamps for @MyFirstMillionPod. Live demo on jev.aitools.fyi.",
  },

  "shubhankar-jev-fifa": {
    slug: "shubhankar-jev-fifa",
    status: "published",
    problem:
      "Soccer games usually hard-code bot logic or bolt a chat model on top, which is too slow and too vague for eleven independent players plus live presentation layers.",
    targetUser:
      "Builders studying real-time sports sims, Browserbase engineers experimenting with System One, and fans who want proof that Jev can sit inside a 150 ms control loop.",
    overview:
      "Shubhankar Srivastava (Browserbase, shubhankar.xyz) published a FIFA-style rebuild where every outfield player runs its own Jev loop on roughly a 150 millisecond cadence. Each cycle decides tackle, pass, or shoot plus speed and heading. The same build routes commentary and soundtrack choices through Jev rather than a separate generative audio pipeline. The launch clip on X is the primary public artifact; no repo or hosted play link appeared in the thread as of September 2026.",
    creator: {
      name: "Shubhankar Srivastava",
      handle: "_shubhankar",
      xUrl: "https://x.com/_shubhankar/status/2101830589620056160",
      company: "Browserbase",
      companyUrl: "https://www.browserbase.com",
      githubUrl: "https://github.com/shubh24",
    },
    creatorQuote: {
      text:
        "I rebuilt FIFA with Jev! Each player has a Jev loop running every ~150ms, deciding whether it should tackle, pass, shoot, and with what speed/direction. Heck, even the commentary/soundtracks are Jev!",
      attributedTo: "Shubhankar Srivastava",
      sourceUrl: "https://x.com/_shubhankar/status/2101830589620056160",
    },
    jevUsage: {
      flowRole: "Per-player real-time action selection plus presentation routing (commentary and soundtrack)",
      primitives: ["Choice"],
      stateIn:
        "Per-player match state at each tick (positions, ball context, and other fields implied by the clip; exact schema not published outside the build).",
      decisionOut:
        "Discrete soccer actions (tackle, pass, shoot) with speed and direction parameters; separate Jev choices for commentary lines and soundtrack selection per the launch post.",
      flowSteps: [
        "Simulation advances on a sub-second game clock",
        "Each player issues a Jev request about every 150 ms",
        "Engine applies returned actions to movement and ball interaction",
        "Presentation layer queries Jev for commentary and music choices",
      ],
      sourcedMetrics: [
        {
          claim: "Each player runs a Jev loop about every 150 ms.",
          source: "x.com/_shubhankar/status/2101830589620056160",
        },
      ],
    },
    howJevIsUsed:
      "The match treats Jev as the reflex layer for every athlete instead of one monolithic bot brain. That matches the System One pattern: structured state in, typed Choice out, no play-by-play prose between ticks. Shubhankar's post also extends the same primitive to broadcast flavor (commentary and soundtracks), which is unusual for sports demos and shows how sidecar presentation systems can share one fast model. Peyton Casper quoted an earlier shootout goalie prototype from the same author; this profile focuses on the full-pitch FIFA rebuild in Shubhankar's September 2026 clip while the Peyton post remains a related showcase embed on this directory.",
    keyFeatures: [
      "Eleven independent per-player Jev loops at ~150 ms cadence (attributed post)",
      "Tackle, pass, and shoot decisions with speed and direction",
      "Commentary and soundtrack selection also driven by Jev (attributed post)",
      "Featured homepage showcase video embed on Jev Directory",
      "Creator site at shubhankar.xyz and GitHub shubh24 for other experiments",
    ],
    stack: [
      "TypeSafe System One (Jev)",
      "Custom FIFA-style sim (details not open-sourced in the launch thread)",
    ],
    links: {
      website: "https://shubhankar.xyz/",
      post: "https://x.com/_shubhankar/status/2101830589620056160",
      demo: "https://x.com/_shubhankar/status/2101830589620056160",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jev-fifa-rebuild-shubhankar", "jev-shootout-goalie-peytoncasper"],
    relatedSlugs: [
      "fhshaik-typesafe-mario",
      "enoyola-jev-grand-prix",
      "lukaske-jev-doom-agent",
      "jev-arcade",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is there a public repo or playable URL?",
        answer:
          "Not in the September 2026 launch thread. This directory lists the attributed X clip and showcase embed until Shubhankar publishes a repo or demo link.",
      },
      {
        question: "How does the Peyton Casper goalie clip relate?",
        answer:
          "Peyton Casper posted that @_shubhankar built a Jev-powered goalie for a shootout-style soccer game before the full FIFA rebuild. We host both videos as showcases but keep one product profile for the full-match build Shubhankar described.",
      },
      {
        question: "Which Jev primitives are documented?",
        answer:
          "The public post describes discrete action picks (tackle, pass, shoot, speed, direction) and presentation choices. Treat those as Choice-style decisions; no Score or Noul usage was claimed in the thread.",
      },
    ],
    metaTitle: "Shubhankar Jev FIFA rebuild: 150 ms player loops",
    metaDescription:
      "Browserbase builder Shubhankar's FIFA-style sim with per-player Jev loops, commentary, and soundtracks. Facts sourced from the September 2026 launch clip on X.",
  },

  "enoyola-jev-grand-prix": {
    slug: "enoyola-jev-grand-prix",
    status: "published",
    problem:
      "Racing AI that steers the wheel directly from slow model replies weaves off track; F1 speeds cover twenty meters before an answer returns.",
    targetUser:
      "Developers learning the goal-versus-actuator split for real-time sims and hobbyists who want a local Jev race engineer.",
    overview:
      "Jev Grand Prix is an open F1 toy from enoyola. A Python server turns car telemetry into engineer prose, batches three System One questions (line Choice, pedal Choice, trouble Noul), and lets browser physics steer toward the chosen line at 120 Hz. Between laps, code compares sector notes and asks Jev once per corner whether to push, hold, or back off on a grip-percent ladder documented in the README.",
    creator: {
      name: "enoyola",
      handle: "enoyola",
      githubUrl: "https://github.com/enoyola",
    },
    jevUsage: {
      flowRole: "High-level racing line and pedal selection; separate lap-level corner pace planner",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Speed, track position, corner context, and natural-language sector notes generated from lap timing (see server.py and README tables).",
      decisionOut:
        "Target line across five lateral buckets, pedal mode among throttle/brake steps, and trouble probability; per-corner faster/same/slower plan between laps.",
      flowSteps: [
        "Browser sends telemetry several times per second",
        "Server composes engineer text and batches three questions per request (~0.27 s cited)",
        "Client steers and applies brake-by-wire toward targets at 120 Hz",
        "At lap end, code summarizes sectors and asks Jev for per-corner pace adjustments",
      ],
      sourcedMetrics: [
        {
          claim: "Typical Jev answer latency about 0.27 s; direct wheel steering caused nine off-tracks in the first test lap.",
          source: "github.com/enoyola/jev-grand-prix README",
        },
        {
          claim: "Eight-lap test improved best lap from 59.2 s (standing start) to 50.9 s with real Jev calls.",
          source: "github.com/enoyola/jev-grand-prix README lap table",
        },
      ],
    },
    howJevIsUsed:
      "The README is explicit that Jev picks goals while code executes them, matching the Pokemon and Minecraft patterns TypeSafe cites. Noul powers the Trouble meter so the model can express leave-the-track risk without free text. The race-engineer ladder is a teaching tool: memory lives in deterministic lap analytics, while Jev only judges the next incremental pace change per corner. You can race Jev or drive yourself with arrow keys on localhost:8765 after uv run server.py.",
    keyFeatures: [
      "Local browser client plus Python server (uv run server.py)",
      "Three batched questions per driving decision",
      "Optional human driver with camera toggle",
      "Race engineer panel with per-corner history",
      "Documented eight-lap improvement curve with real API calls",
    ],
    stack: ["Python", "uv", "Browser client", "TypeSafe System One API"],
    links: {
      repo: "https://github.com/enoyola/jev-grand-prix",
      docs: "https://github.com/enoyola/jev-grand-prix",
      demo: "http://localhost:8765",
    },
    pricingNote: "Requires your TypeSafe API key; README uses console.typesafe.ai early access.",
    firstSeen: "2026-09-21",
    relatedSlugs: ["shubhankar-jev-fifa", "fhshaik-typesafe-mario", "thumay9700-jev-plays"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Why not steer the wheel directly from Jev?",
        answer:
          "README reports weaving and nine off-tracks when Jev commanded the wheel; line plus pedal targets with fast local steering fixed clean laps.",
      },
      {
        question: "Which primitives are used?",
        answer: "Choice for line and pedals, Noul for trouble probability, per README question table.",
      },
    ],
    metaTitle: "Jev Grand Prix: F1 line and pedal Choice loops",
    metaDescription:
      "Open F1 sim where Jev picks racing lines and pedals while code steers at 120 Hz. Lap engineer and benchmarks from github.com/enoyola/jev-grand-prix.",
  },

  "muhammadaq1-before-the-fall-jev": {
    slug: "muhammadaq1-before-the-fall-jev",
    status: "published",
    problem:
      "Rescue puzzles often cheat with hidden hints in prompts; players want tension without trusting a chat model to improvise physics.",
    targetUser:
      "Indie devs building narrative micro-games and Jev learners who want validation loops separate from model prose.",
    overview:
      "Before the Fall is a 2D rescue game starring robot S-01. Six victims, thirty-five seconds, three junctions per rescue, five-second room collapse timers. Jev reads text descriptions of obstacles and robot capabilities, then picks a door and action. The engine checks answers against rules without telling Jev which door is correct.",
    creator: {
      name: "muhammadaq1",
      handle: "muhammadaq1",
      githubUrl: "https://github.com/muhammadaq1",
    },
    jevUsage: {
      flowRole: "Door and maneuver selection under time pressure",
      primitives: ["Choice"],
      stateIn:
        "Natural-language descriptions of each door blockage, rescue goal, and allowed robot actions (push aside, lift aside, duck under, step through).",
      decisionOut: "Chosen door plus action; game validates against scene rules and advances or rejects.",
      flowSteps: [
        "Room collapse timer starts",
        "Engine sends junction descriptions to Jev",
        "Jev returns door and action Choice",
        "Physics validates; on success, fresh descriptions for next junction",
      ],
      sourcedMetrics: [
        {
          claim: "Recorded run: six rescues in 28.4 s, 18/18 applied decisions, ~352 ms average response.",
          source: "github.com/muhammadaq1/before-the-fall-jev README results screenshot",
        },
      ],
    },
    howJevIsUsed:
      "Jev never sees pixels, only text derived from the scene, which mirrors TypeSafe's structured-state guidance. Free wheels on a trolley still fail if there is nowhere to push, so the model must read constraints, not keywords. README stresses 100 percent decision accuracy on the showcased run while noting variance across live API calls. Clone the repo and follow run-locally instructions with your TypeSafe key.",
    keyFeatures: [
      "Six people, 35 second mission clock",
      "Three doors per junction with timed collapses",
      "Text-only state to Jev; viewer sees art",
      "Bundled demo video in README",
      "Documented latency and accuracy metrics for a sample run",
    ],
    stack: ["JavaScript", "TypeSafe Jev API"],
    links: {
      repo: "https://github.com/muhammadaq1/before-the-fall-jev",
      docs: "https://github.com/muhammadaq1/before-the-fall-jev",
    },
    firstSeen: "2026-09-21",
    relatedSlugs: ["shubhankar-jev-fifa", "muratcanberber-jev-the-fish-game"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Jev see the artwork?",
        answer:
          "No. README states Jev receives text descriptions while players see the 2D scene.",
      },
      {
        question: "Are metrics guaranteed?",
        answer:
          "README documents one recorded run; live latency and success rates can vary with API load.",
      },
    ],
    metaTitle: "Before the Fall: Jev rescue choices under a 35 s clock",
    metaDescription:
      "Cinematic rescue game where Jev picks doors and actions from text. Sample run metrics from the open GitHub README.",
  },

  "muratcanberber-jev-the-fish-game": {
    slug: "muratcanberber-jev-the-fish-game",
    status: "published",
    problem:
      "Multiplayer fish games often fake AI with scripts or parse LLM chatter that drifts under load.",
    targetUser:
      "Engineers who want a reference multiplayer loop with batched Choice and Noul calls and a live Q&A inspector.",
    overview:
      "JEV: The Fish Game is an authoritative Node server with a Three.js client. AI fish batch three questions per decision: action Choice, target Choice, and panic Noul. Humans steer with the mouse; spectators read per-fish Q&A panels with confidence bars.",
    creator: {
      name: "muratcanberber",
      handle: "muratcanberber",
      githubUrl: "https://github.com/muratcanberber",
    },
    jevUsage: {
      flowRole: "Per-fish tactical routing every few seconds",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Nearby threats, prey, food pellets, spikes, energy, and mass telemetry summarized for each fish (see README question table).",
      decisionOut:
        "action choice (flee, hunt, eat_food, roam), target object id, panic noul for sprinting.",
      flowSteps: [
        "30 Hz simulation on server",
        "Each AI fish schedules Jev calls every ~4-8 s, up to three concurrent",
        "Server applies thresholds, walls, spikes, and metabolism in code",
        "10 Hz WebSocket broadcast with client interpolation to 60 fps",
      ],
      sourcedMetrics: [
        {
          claim: "About 300 ms per fish decision; five AI fish ≈ 70 decisions/min (~$0.10/hour cited).",
          source: "github.com/muratcanberber/JEV-TheFishGame README",
        },
      ],
    },
    howJevIsUsed:
      "The README argues for AI as a programming primitive: JSON decisions, not chat. Policy stays in TypeScript so the same model weights behave per host configuration. A local fallback brain keeps fish moving if Jev is unreachable, but the showcase value is the inspector that exposes questions and probabilities to spectators. npm start serves localhost:8787; cloudflared tunnel instructions included for quick shares.",
    keyFeatures: [
      "Up to five players plus unlimited spectators",
      "Live Q&A inspector per fish",
      "Metabolism, spikes, and mass-scaled speed",
      "Server-side API key only",
      "Auto-reload clients on deploy",
    ],
    stack: ["Node.js", "Three.js r160", "WebSockets", "TypeSafe Jev"],
    links: {
      repo: "https://github.com/muratcanberber/JEV-TheFishGame",
      docs: "https://github.com/muratcanberber/JEV-TheFishGame",
    },
    pricingNote: "README cites ~$0.10/hour for five AI fish at listed Jev rates; verify on console.typesafe.ai.",
    firstSeen: "2026-09-21",
    relatedSlugs: ["icohen007-jev-play-ping-pong", "hollow-creek", "jev-arcade"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Do browsers call Jev directly?",
        answer: "No. README states the API key lives only in server .env.",
      },
      {
        question: "What if Jev is down?",
        answer: "A documented local fallback brain keeps fish playable without remote calls.",
      },
    ],
    metaTitle: "JEV The Fish Game: multiplayer Choice and Noul fish AI",
    metaDescription:
      "Real-time multiplayer aquarium with batched Jev questions and a live Q&A inspector. Metrics and setup from the open GitHub repo.",
  },

  "thumay9700-jev-plays": {
    slug: "thumay9700-jev-plays",
    status: "published",
    problem:
      "Retro game agents built on LLMs burn budget and latency parsing text about button presses.",
    targetUser:
      "Streamers, researchers, and emulator hackers who want a modular PyBoy harness for Pokemon Red today and more titles later.",
    overview:
      "jev-plays connects TypeSafe Jev to PyBoy with typed RAM maps, Pydantic state, and per-game tactic modules. Pokemon Red is the first shipped world, with navigator and battle Choice schemas documented in the repository layout.",
    creator: {
      name: "thumay9700",
      handle: "thumay9700",
      githubUrl: "https://github.com/thumay9700",
    },
    jevUsage: {
      flowRole: "Emulator tick decision layer for navigation and battle",
      primitives: ["Choice", "Noul", "Score"],
      stateIn:
        "Parsed Game Boy RAM via ram_map.py into structured models (party, map, battle context).",
      decisionOut:
        "Typed controller or battle actions from Choice/Noul/Score questions defined per tactics.py.",
      flowSteps: [
        "PyBoy advances frames",
        "state.py builds structured observation",
        "jev_client issues parallel System One questions",
        "Agent applies inputs and logs telemetry metrics",
      ],
      sourcedMetrics: [
        {
          claim: "README cites 50 to 150 ms per decision and sub-dollar full-game cost vs $200+ LLM playthroughs.",
          source: "github.com/thumay9700/jev-plays README",
        },
      ],
    },
    howJevIsUsed:
      "The framework treats Jev as System One instinct: no tokenized play-by-play, only schemas the emulator can execute. README outlines a YouTube roadmap for Mario, Zelda, and Mega Man using the same BaseGame interface. Bring your own legally obtained Pokemon Red ROM and TYPESAFE_API_KEY, then run the documented CLI entrypoints with uv.",
    keyFeatures: [
      "Modular games/ package with Pokemon Red shipped",
      "Telemetry for latency, HUD, and cost",
      "Smart mock engine for offline dev",
      "pytest suite in repository",
      "Documented roadmap for additional consoles",
    ],
    stack: ["Python 3.11+", "uv", "PyBoy", "TypeSafe SDK"],
    links: {
      repo: "https://github.com/thumay9700/jev-plays",
      docs: "https://github.com/thumay9700/jev-plays",
    },
    firstSeen: "2026-09-21",
    relatedSlugs: ["fhshaik-typesafe-mario", "enoyola-jev-grand-prix"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Which game works today?",
        answer: "Pokemon Red via PyBoy is the first implemented world per README roadmap checkboxes.",
      },
      {
        question: "Does the repo include ROMs?",
        answer: "No. README requires a legally obtained PokemonRed.gb file.",
      },
    ],
    metaTitle: "jev-plays: PyBoy Pokemon agent with typed Jev tactics",
    metaDescription:
      "Open emulator framework for System One decisions in Pokemon Red. Architecture and cost notes from github.com/thumay9700/jev-plays.",
  },

  "fhshaik-typesafe-mario": {
    slug: "fhshaik-typesafe-mario",
    status: "published",
    problem:
      "Vision pipelines for NES agents are heavy; Mario needs fast discrete inputs from reliable state, not screenshot captions.",
    targetUser:
      "Python developers benchmarking Jev on World 1-1 and anyone comparing RAM-first harness design.",
    overview:
      "typesafe-mario lets Jev choose NES controller actions for Super Mario Bros from structured JSON built out of emulator telemetry and RAM. Faadil Shaik's launch clip shows real-time play without pixels in the prompt. The repo ships CLI tools, a live dashboard, and jsonl artifacts for overlays.",
    creator: {
      name: "Faadil Shaik",
      handle: "faadilhshaik",
      xUrl: "https://x.com/faadilhshaik/status/2100086301894881578",
      githubUrl: "https://github.com/fhshaik",
    },
    creatorQuote: {
      text:
        "got @typesafeai's new model Jev to play Super Mario Bros. fast inference + structured outputs makes it surprisingly good for real time use cases.",
      attributedTo: "Faadil Shaik",
      sourceUrl: "https://x.com/faadilhshaik/status/2100086301894881578",
    },
    jevUsage: {
      flowRole: "Per-step controller Choice from structured world model",
      primitives: ["Choice"],
      stateIn:
        "player, trajectory, hazard, terrain, reaction_timing, and episode fields parsed from RAM (README architecture).",
      decisionOut:
        "One of noop, right, right_jump, right_run, right_run_jump, jump, left with probability distribution logged.",
      flowSteps: [
        "NES emulator advances frames",
        "Parser builds JSON state without screenshots",
        "Jev Choice selects controller action",
        "Harness applies input for configured frames-per-decision (default 8 steps)",
      ],
    },
    howJevIsUsed:
      "The harness keeps cardinality small and legal actions explicit, which is how Jev avoids hallucinated buttons. reaction_timing fields document observation-to-action delay for benchmarking. typesafe-mario state-demo prints payloads without launching the game. Play mode records artifacts/run-*.jsonl for clips and telemetry. You must supply your own lawful ROM and TYPESAFE_API_KEY.",
    keyFeatures: [
      "Python 3.13 CLI typesafe-mario play and state-demo",
      "Live dashboard with probabilities and latency",
      "jsonl decision logs for overlays",
      "Documented action set and parser fields",
      "Hundreds of GitHub stars in the public catalog snapshot",
    ],
    stack: ["Python 3.13", "NES emulator harness", "TypeSafe Jev"],
    links: {
      repo: "https://github.com/fhshaik/typesafe-mario",
      docs: "https://github.com/fhshaik/typesafe-mario",
      post: "https://x.com/faadilhshaik/status/2100086301894881578",
    },
    firstSeen: "2026-09-16",
    demoIds: ["typesafe-mario-faadilhshaik"],
    relatedSlugs: ["thumay9700-jev-plays", "lukaske-jev-doom-agent", "shubhankar-jev-fifa"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does Jev see the screen?",
        answer: "No. README states the model receives structured JSON from telemetry and RAM, not screenshots.",
      },
      {
        question: "How often does it decide?",
        answer: "Default play command uses one decision every eight emulator steps; adjust --frames-per-decision for benchmarks.",
      },
    ],
    metaTitle: "typesafe-mario: Jev NES controller from RAM JSON",
    metaDescription:
      "Faadil Shaik harness for Super Mario Bros with structured state and Choice actions. README architecture plus launch clip on Jev Directory.",
  },

  "kylejeong-jev-as-judge": {
    slug: "kylejeong-jev-as-judge",
    status: "published",
    problem:
      "Legal learners and builders lack a fast way to see how a structured decision model would rule on a case record without paying for a full LLM brief each time.",
    targetUser:
      "Developers curious about Jev on long-form text, legal hobbyists, and anyone benchmarking System One on adversarial reading comprehension.",
    overview:
      "Jev as a Judge (judge.kylejeong.com) lets you browse famous matters or ask the court to rule from the case record. Kyle Jeong reports benchmarking 100 plus well-known decisions and finding Jev disagreed with the historical outcome about 13 percent of the time. The UI shows confidence and labels the experience as an experiment, not legal advice.",
    creator: {
      name: "Kyle Jeong",
      handle: "kylejeong",
      xUrl: "https://x.com/kylejeong/status/2101832317862056149",
    },
    creatorQuote: {
      text:
        "I built Jev-as-a-Judge, give context on a court case and see how Jev would have ruled it. I ran it on 100+ well-known court cases + their rulings, and it disagreed with 13% of them.",
      attributedTo: "Kyle Jeong",
      sourceUrl: "https://x.com/kylejeong/status/2101832317862056149",
    },
    jevUsage: {
      flowRole: "Outcome prediction from case record text (gallery browse or ad hoc ruling request)",
      primitives: ["Choice"],
      stateIn: "Case record text presented to the court UI (per site flows: gallery cases or user-submitted context).",
      decisionOut: "Ruling with confidence; site copy states outputs come from TypeSafe Jev on the record alone.",
      sourcedMetrics: [
        {
          claim: "About 13% disagreement vs historical outcomes across 100+ well-known cases in the launch post.",
          source: "x.com/kylejeong/status/2101832317862056149",
        },
      ],
    },
    howJevIsUsed:
      "The product treats Jev as a judge-shaped Choice problem instead of asking a chat model to draft an opinion essay. You read cases in the gallery or prompt a ruling, and the app renders Jev's structured answer with confidence. Kyle's disagreement rate is a sanity metric for how often System One diverges from precedent on famous facts, not a claim about courtroom readiness. Use judge.kylejeong.com for live behavior; this directory does not host case corpora.",
    keyFeatures: [
      "Courtroom, gallery, and search flows on judge.kylejeong.com",
      "Confidence surfaced with each ruling",
      "Disclaimer that outputs are experimental, not legal advice",
      "Featured homepage showcase embed",
    ],
    stack: ["TypeSafe Jev", "Web app at judge.kylejeong.com"],
    links: {
      website: "https://judge.kylejeong.com",
      demo: "https://judge.kylejeong.com",
      post: "https://x.com/kylejeong/status/2101832317862056149",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jev-as-judge-kylejeong"],
    relatedSlugs: ["jacoblincool-jev-paper-judge", "danielgshea-jev-as-a-judge", "bunsdev-clarity-judge"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is this legal advice?",
        answer:
          "No. Site copy states rulings are generated by TypeSafe Jev from the case record alone as an experiment, not legal advice.",
      },
      {
        question: "Where does the 13% figure come from?",
        answer: "Kyle Jeong's September 2026 launch post on X, cited in this profile.",
      },
    ],
    metaTitle: "Jev as a Judge: Kyle Jeong case ruling experiment",
    metaDescription:
      "judge.kylejeong.com feeds case records to Jev with confidence scores. 13% disagreement benchmark from the attributed launch post.",
  },

  "carolmonroe-jevrls": {
    slug: "carolmonroe-jevrls",
    status: "published",
    problem:
      "Supabase Row Level Security policies are easy to miswrite and expensive to audit with a full LLM call per policy line.",
    targetUser:
      "Supabase developers and security reviewers who want side-by-side model comparisons on the same RLS rubric.",
    overview:
      "JevRLS (jevrls.lovable.app) accepts pasted pg_policies output and scores each policy for leaks. Carol Monroe's showcase runs Jev beside GPT and Gemini with the same decision rule, surfacing who flags issues, latency, and cost together.",
    creator: {
      name: "Carol Monroe",
      handle: "CarolMonroe",
      xUrl: "https://x.com/carolmonroe/status/2101747586126557230",
    },
    creatorQuote: {
      text:
        "Paste your @supabase RLS policies and watch Jev race gpt and gemini on them. Same rubric, same decision rule, side by side: who flags the leaks, how fast, at what cost.",
      attributedTo: "Carol Monroe",
      sourceUrl: "https://x.com/carolmonroe/status/2101747586126557230",
    },
    jevUsage: {
      flowRole: "Per-policy security verdict on pasted Supabase RLS text",
      primitives: ["Choice"],
      stateIn: "pg_policies style policy dump pasted into the Lovable app.",
      decisionOut:
        "Plain-words verdict per policy; site meta cites about one second per policy with Jev (marketing copy on jevrls.lovable.app).",
      flowSteps: [
        "Paste policies into JevRLS",
        "Run identical rubric across Jev, GPT, and Gemini",
        "Compare leak flags, latency, and cost columns",
      ],
    },
    howJevIsUsed:
      "Carol's demo is a benchmarking UI, not a hosted database scanner. Jev handles the fast structured judgment while GPT and Gemini run under the same decision rule so differences show up in flags and price, not prompt hacks. Treat Lovable deployment as the product home until a repo is published separately.",
    keyFeatures: [
      "Side-by-side Jev vs GPT vs Gemini on one rubric",
      "Supabase RLS focused paste workflow",
      "Public demo at jevrls.lovable.app",
      "Showcase video embed on Jev Directory",
    ],
    stack: ["Lovable app", "TypeSafe Jev", "Comparison models per UI"],
    links: {
      website: "https://jevrls.lovable.app",
      demo: "https://jevrls.lovable.app",
      post: "https://x.com/carolmonroe/status/2101747586126557230",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jevrls-supabase-carolmonroe"],
    relatedSlugs: ["caiovicentino-jev-shield", "hemanth-pkg-gate", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does JevRLS connect to my Supabase project?",
        answer:
          "The public app evaluates pasted policy text. It does not require live database credentials in the showcase flow Carol described.",
      },
      {
        question: "Which primitives does Jev use?",
        answer:
          "Carol's clip describes leak flags on a shared rubric; site marketing cites fast per-policy verdicts. Treat outputs as structured policy judgments rather than free-form essays.",
      },
    ],
    metaTitle: "JevRLS: Supabase RLS policy races with Jev",
    metaDescription:
      "Carol Monroe JevRLS compares Jev, GPT, and Gemini on pasted pg_policies with latency and cost. Live demo at jevrls.lovable.app.",
  },

  "iurysza-logview-jev": {
    slug: "iurysza-logview-jev",
    status: "published",
    problem:
      "Android log triage still relies on regex greps that miss paraphrased errors agents care about.",
    targetUser:
      "Mobile engineers and agent authors who need keyboard-first log review with optional semantic filters and headless replay.",
    overview:
      "logview is Iury Souza's open-source Android log viewer built on Bun. Semantic mode swaps the slash field to a natural-language query; Jev scores whether each retained line matches the filter while capture or replay continues.",
    creator: {
      name: "Iury Souza",
      handle: "IurySza",
      xUrl: "https://x.com/iurysza/status/2101770705155010568",
      githubUrl: "https://github.com/iurysza",
    },
    creatorQuote: {
      text:
        "First experiment with @typesafeai's Jev: a semantic log filter (with a CLI that lets my agent use it too). Ofc, I had to overdo it and build a TUI around it :)",
      attributedTo: "Iury Souza",
      sourceUrl: "https://x.com/iurysza/status/2101770705155010568",
    },
    jevUsage: {
      flowRole: "Streaming relevance classification on retained log lines",
      primitives: ["Noul"],
      stateIn:
        "Developer filter text plus per-line tag, level, and message for up to semantic.historyEvents (default 100) locally eligible rows.",
      decisionOut:
        "Relevance probability per log key; rows below semantic.threshold (default 0.5) dim in the TUI.",
      flowSteps: [
        "Local tag/level/text filters run first",
        "SemanticCoordinator batches classify requests via Jev",
        "New eligible lines classify while query is active",
        "Headless mode skips remote calls entirely",
      ],
      sourcedMetrics: [
        {
          claim: "Default semantic threshold 0.5; default model jev-1.13.0; prompt log-relevance-noul-v1.",
          source: "github.com/iurysza/logview packages/engine/src/semantic/contracts.ts",
        },
      ],
    },
    howJevIsUsed:
      "logview keeps Jev behind a classifier interface so core parsing stays pure. Noul questions ask whether a line matches the developer filter even when wording differs (see relevanceInstructions in source). Semantic work never blocks ingestion; older rows stay visible with an unrequested icon if they arrived before a query. Agents can use the same Session API headlessly while humans use the ANSI TUI.",
    keyFeatures: [
      "live, record, and replay commands with shared byte pipeline",
      "logview.json config plus --semantic flag",
      "Bun 1.4+ toolchain with extensive headless tests",
      "MIT licensed monorepo on GitHub",
    ],
    stack: ["Bun", "TypeScript", "TypeSafe Jev API", "ADB capture"],
    links: {
      repo: "https://github.com/iurysza/logview",
      docs: "https://github.com/iurysza/logview",
      post: "https://x.com/iurysza/status/2101770705155010568",
    },
    firstSeen: "2026-09-21",
    demoIds: ["logview-semantic-iurysza"],
    relatedSlugs: ["socai-io-jev-social", "browser-use-jev-ultrafast"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does semantic mode call Jev in headless tests?",
        answer: "README states headless tests never call Jev.",
      },
      {
        question: "Which environment variables are required?",
        answer: "TYPESAFE_API_KEY for semantic mode; optional TYPESAFE_DEFAULT_MODEL overrides jev-1.13.0.",
      },
    ],
    metaTitle: "logview: Jev Noul semantic filter for Android logs",
    metaDescription:
      "Iury Souza logview adds natural-language Android log triage with Jev Noul scoring. Open source on GitHub with CLI and TUI.",
  },

  "thisiskp-jevarcade": {
    slug: "thisiskp-jevarcade",
    status: "published",
    problem:
      "Builders need playful proof that Jev plus a gateway can power multiple interactive UX patterns without one-off LLM prompts per mode.",
    targetUser:
      "Netlify developers, community builders, and anyone comparing structured AI mini-apps in one cabinet.",
    overview:
      "KP (thisiskp_, Head of Community at Netlify) shipped Jev Arcade at jevarcade.netlify.app after early Jev access through Netlify AI Gateway. The site advertises seven interactive modes plus an explainer: color blobs, mood piano, pictionary, puppet theatre, movie guesser, things icons, and an info panel on how Jev and Netlify power the demos. Inputs support talk or type per public meta tags.",
    creator: {
      name: "KP",
      handle: "thisiskp_",
      xUrl: "https://x.com/thisiskp_/status/2101846703091376219",
      company: "Netlify",
      companyUrl: "https://www.netlify.com",
    },
    creatorQuote: {
      text:
        "Luckily I had early access to Jev via @Netlify AI Gateway. So traded some sleep and built an arcade for @typesafeai's Jev this weekend. Not 1 but 7 interactive games with Jev that shows its power.",
      attributedTo: "KP",
      sourceUrl: "https://x.com/thisiskp_/status/2101846703091376219",
    },
    jevUsage: {
      flowRole: "Per-mode structured decisions behind talk-or-type mini experiences",
      primitives: ["Choice"],
      stateIn:
        "Mode-specific user text or voice input plus in-app context (per jevarcade.netlify.app mode descriptions).",
      decisionOut:
        "Typed picks that drive each mini game UI (colors, piano mood, guesses, icons, etc.) without long-form replies.",
      flowSteps: [
        "User selects a cabinet mode in the arcade shell",
        "Client sends structured state to Netlify AI Gateway backed Jev routes",
        "Jev returns decisions consumed directly by the mode renderer",
      ],
    },
    howJevIsUsed:
      "This arcade is separate from the Krunker-style jev-arcade.vercel.app FPS elsewhere in the catalog. KP's build is a marketing-friendly cabinet proving gateway latency across seven playful surfaces. Without a linked repository, this profile sticks to jevarcade.netlify.app meta tags, the launch clip, and KP's stated Netlify AI Gateway path. Play each mode locally to judge responsiveness on your network.",
    keyFeatures: [
      "Seven interactive modes plus info explainer",
      "Talk or type input per site description",
      "Hosted on jevarcade.netlify.app",
      "Featured homepage showcase embed",
    ],
    stack: ["Netlify AI Gateway", "TypeSafe Jev", "Static arcade shell"],
    links: {
      website: "https://jevarcade.netlify.app",
      demo: "https://jevarcade.netlify.app",
      post: "https://x.com/thisiskp_/status/2101846703091376219",
    },
    firstSeen: "2026-09-21",
    demoIds: ["jevarcade-seven-games-thisiskp"],
    relatedSlugs: ["jev-arcade", "openrouter-typesafe-jev-1-13", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same as jev-arcade.vercel.app?",
        answer:
          "No. The Vercel FPS duel listing tracks a different Neel490 project. KP's Netlify cabinet lives at jevarcade.netlify.app with seven casual modes.",
      },
      {
        question: "Where is the source code?",
        answer:
          "No public repository was linked in the September 2026 launch thread. Use the hosted arcade and showcase clip as references.",
      },
    ],
    metaTitle: "KP Jev Arcade: seven Netlify gateway mini games",
    metaDescription:
      "jevarcade.netlify.app hosts seven Jev-powered modes via Netlify AI Gateway. Distinct from the Vercel FPS Jev Arcade listing.",
  },

  "virlo-ai": {
    slug: "virlo-ai",
    status: "published",
    problem:
      "Short-form research feeds drown teams in off-niche clips, hashtag stuffing, and videos that look viral but miss the brief.",
    targetUser:
      "TikTok and Reels marketers, agencies, and creators using Virlo to benchmark hooks and formats against a large viral corpus.",
    overview:
      "Virlo (virlo.ai, dev.virlo.ai) is a short-form social listening and content research platform spanning TikTok, Instagram Reels, and YouTube Shorts. Public positioning cites more than twelve million indexed viral videos and over one hundred thousand users. Co-founder jaffa (@dsqjaffa, @virlomain) wired TypeSafe Jev into a Clearance layer that must pass before Virlo's eighty-signal tagging panel scores hooks, formats, angles, and production cues.",
    creator: {
      name: "jaffa",
      handle: "dsqjaffa",
      xUrl: "https://x.com/dsqjaffa/status/2102090111198363988",
      company: "Virlo",
      companyUrl: "https://virlo.ai",
    },
    creatorQuote: {
      text:
        "Jev is INSANE for Marketing: Clearance decides what enters the benchmark sample before Virlo tags the rest.",
      attributedTo: "jaffa",
      sourceUrl: "https://x.com/i/article/2102004103240904704",
    },
    jevUsage: {
      flowRole:
        "Clearance gate plus marketing-agent packs before eighty-signal viral tagging",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Caption, hashtags, transcript text, and niche brief context for each candidate short-form video entering the Virlo pipeline.",
      decisionOut:
        "Clearance Noul on niche match and stuffing or mismatch flags; parallel Choice, Score, and Noul on hook type, format, angle, and worth-scripting with confidence thresholds for auto-act versus escalate.",
      flowSteps: [
        "Ingest candidate clip metadata and transcript from Virlo search or watchlists",
        "Jev Clearance: niche match and hashtag or topic mismatch nouls with confidence",
        "On pass, Virlo runs eighty-signal visual and production tagging (outside Jev)",
        "Marketing agent loops use parallel Choice, Score, and Noul packs on script angles",
        "Calibration UI A/B tests Jev Clearance against the legacy judge on labeled sets",
      ],
      sourcedMetrics: [
        {
          claim:
            "Early human-labeled head-to-head: Jev Clearance thirty-three of forty-four versus legacy judge thirty of forty-four.",
          source: "jaffa X Article Jev is INSANE for Marketing and launch clip",
        },
        {
          claim:
            "Virlo indexes twelve point eight million plus viral videos and tags eighty signals per accepted clip.",
          source: "Virlo public marketing and jaffa article",
        },
      ],
    },
    howJevIsUsed:
      "Virlo treats Jev as the typed judgment layer on text and brief fit, not as a replacement for computer vision. Clearance is Noul-forward: does this clip belong in the niche given caption, hashtags, and transcript, and is the topic consistent or stuffed? Confidence gates route high-certainty accepts straight into the eighty-signal benchmark sample; uncertain rows escalate to stronger models or human review instead of polluting trend charts. Separate parallel packs score marketing-agent outputs such as hook archetype, format, angle, and whether the clip is worth scripting, using Choice and Score where the product needs ranked options. Virlo still performs visual and production tagging; Jev only controls whether a row earns a seat at that table. Operators wire TypeSafe with a dedicated API key while Virlo product keys use the virlo_tkn_* format documented on dev.virlo.ai, including MCP at dev.virlo.ai/api/mcp/mcp for agent integrations. Open-source Vee (github.com/Virlo-AI/vee) reuses Virlo data for marketing agents; this profile focuses on the shipped SaaS Clearance path from the September 2026 launch.",
    keyFeatures: [
      "Clearance gate before eighty-signal viral tagging",
      "Calibration A/B versus legacy judge with published early win rate",
      "MCP and API surfaces on dev.virlo.ai",
      "Featured showcase clip with remote X video embed",
      "Cross-links to Vee open-source marketing agent",
    ],
    stack: [
      "Virlo SaaS (virlo.ai)",
      "TypeSafe System One",
      "Virlo MCP (dev.virlo.ai)",
    ],
    links: {
      website: "https://virlo.ai",
      docs: "https://dev.virlo.ai",
      demo: "https://dev.virlo.ai",
      post: "https://x.com/dsqjaffa/status/2102090111198363988",
      repo: "https://github.com/Virlo-AI/vee",
    },
    pricingNote:
      "Virlo product billing uses virlo_tkn_* keys; System One calls require a separate TypeSafe API key per dev.virlo.ai docs.",
    firstSeen: "2026-09-21",
    demoIds: ["virlo-clearance-dsqjaffa"],
    relatedSlugs: ["stealads-ai", "ploy-ai", "hypit-ai", "socai-io-jev-social"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev replace Virlo's eighty-signal panel?",
        answer:
          "No. Jev Clearance filters which clips enter the tagged benchmark sample. Virlo still runs visual and production tagging on accepted rows.",
      },
      {
        question: "Where is the long-form write-up?",
        answer:
          "jaffa published an X Article titled Jev is INSANE for Marketing at x.com/i/article/2102004103240904704 with Clearance and Calibration detail.",
      },
      {
        question: "What is Vee?",
        answer:
          "Vee is Virlo's open-source marketing agent repo at github.com/Virlo-AI/vee. It consumes Virlo research data; Clearance behavior on virlo.ai may differ from Vee defaults.",
      },
    ],
    metaTitle: "Virlo: Jev Clearance for TikTok and Reels research",
    metaDescription:
      "Virlo content research SaaS uses TypeSafe Jev Clearance before eighty-signal tagging. Noul niche gates, Calibration A/B, MCP on dev.virlo.ai. Sourced from jaffa launch clip.",
  },

  "stealads-ai": {
    slug: "stealads-ai",
    status: "published",
    problem:
      "Media buyers need structured labels across hundreds of competitor ads without manually opening every creative and landing page.",
    targetUser:
      "Performance marketers and founders using StealAds to reverse-engineer competitor Meta libraries.",
    overview:
      "StealAds (stealads.ai) tears down live competitor ad libraries with Jev on the labeling hot path. Matthew Berman's (@TheMattBerman) launch clip shows seven hundred twenty-four ads across thirty-seven brands analyzed in about forty seconds for roughly nine cents of tokens, emitting hook, format, offer, CTA, awareness stage, and landing-page mismatch fields.",
    creator: {
      name: "Matthew Berman",
      handle: "TheMattBerman",
      xUrl: "https://x.com/TheMattBerman/status/2100654891756589230",
      company: "StealAds",
      companyUrl: "https://stealads.ai",
    },
    creatorQuote: {
      text:
        "In forty seconds Jev broke down seven hundred twenty-four live ads from thirty-seven brands for about nine cents.",
      attributedTo: "Matthew Berman",
      sourceUrl: "https://x.com/TheMattBerman/status/2100654891756589230",
    },
    jevUsage: {
      flowRole: "Batch structured labeling over live ad creatives and landing pairs",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Ad creative text, visuals metadata, and landing URLs from StealAds ingestion of live competitor libraries (per launch clip).",
      decisionOut:
        "Per-ad labels for hook, format, offer, CTA, awareness stage, and landing mismatch signals suitable for filtering and swipe files.",
      flowSteps: [
        "StealAds pulls live ads for selected brands",
        "Jev classifies each creative against marketing taxonomy fields in parallel batches",
        "Operators browse labeled sets in StealAds UI or upcoming MCP tools",
      ],
      sourcedMetrics: [
        {
          claim:
            "Seven hundred twenty-four live ads, thirty-seven brands, about forty seconds, about nine cents of tokens in the attributed clip.",
          source: "Matthew Berman X post 2100654891756589230",
        },
      ],
    },
    howJevIsUsed:
      "StealAds uses Jev where a general chat model would drown in token-heavy JSON improvisation. Each ad becomes a compact state object; Jev returns typed marketing labels so the UI can sort, filter, and export patterns without regex on model prose. Choice and Score style questions cover categorical fields like hook archetype and awareness stage, while Noul-style checks flag landing-page mismatches between promise and destination. The builder noted StealAds product and MCP availability in the same thread; madewithjev.com/builds/competitor-ad-teardown documents the pattern for teams reproducing the workflow. Try app.stealads.ai/demo for the interactive surface; this profile does not claim undisclosed StealAds schemas beyond the public clip.",
    keyFeatures: [
      "Large-batch competitor ad labeling",
      "Public demo at app.stealads.ai/demo",
      "Made with Jev build write-up",
      "Upcoming @stealads MCP integration per launch post",
    ],
    stack: ["StealAds hosted app", "TypeSafe System One"],
    links: {
      website: "https://stealads.ai",
      demo: "https://app.stealads.ai/demo",
      post: "https://x.com/TheMattBerman/status/2100654891756589230",
    },
    firstSeen: "2026-09-17",
    demoIds: ["stealads-ad-teardown-mattberman"],
    relatedSlugs: ["virlo-ai", "dub-co", "ploy-ai"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is the nine cent figure reproducible?",
        answer:
          "It comes from Matthew Berman's September 2026 clip on seven hundred twenty-four ads. Re-run on your brand set inside StealAds for production budgeting.",
      },
      {
        question: "Where is the build guide?",
        answer:
          "madewithjev.com/builds/competitor-ad-teardown summarizes the competitor teardown pattern shown in the showcase clip.",
      },
    ],
    metaTitle: "StealAds: Jev labels for competitor ad libraries",
    metaDescription:
      "StealAds uses Jev to label hooks, offers, CTAs, and landing mismatches across hundreds of live competitor ads. Demo clip and app.stealads.ai/demo on Jev Directory.",
  },

  "marcelpociot-wordshift": {
    slug: "marcelpociot-wordshift",
    status: "published",
    problem:
      "Typing games reward raw speed, not whether players understand semantic relationships between words.",
    targetUser:
      "Developers and players exploring Jev-powered game loops from Marcel Pociot's community experiments.",
    overview:
      "Wordshift is a semantic typing racer Marcel Pociot (@marcelpociot) demoed on X as a game where Jev from TypeSafe judges comparison prompts. The bigger the semantic difference between the typed pair, the farther the car moves along the track.",
    creator: {
      name: "Marcel Pociot",
      handle: "marcelpociot",
      xUrl: "https://x.com/marcelpociot/status/2100715684732801095",
      company: "beyondcode",
      companyUrl: "https://beyondcode.com",
    },
    creatorQuote: {
      text:
        "Slower than a jet, bigger than an elephant, faster than a cheetah. The bigger the difference, the farther your car moves.",
      attributedTo: "Marcel Pociot",
      sourceUrl: "https://x.com/marcelpociot/status/2100715684732801095",
    },
    jevUsage: {
      flowRole: "Per-prompt semantic distance scoring for game physics",
      primitives: ["Score"],
      stateIn:
        "Player-typed comparison phrases against challenge prompts shown in the racer UI (per launch clip).",
      decisionOut:
        "Semantic distance score mapped to car advancement distance on the track.",
      flowSteps: [
        "Present comparison challenge to the player",
        "Player types candidate phrase",
        "Jev scores semantic distance versus reference concepts",
        "Game engine moves car proportional to score",
      ],
    },
    howJevIsUsed:
      "Wordshift treats Jev as the referee for meaning instead of string equality. Each keystroke finishes a comparison the game can score with System One: how much slower, bigger, or faster is the typed phrase relative to the anchor nouns in the prompt? Score outputs drive physics so players optimize for conceptual distance, not dictionary overlap. Marcel framed the project as proof that Jev opens gaming loops beyond moderation and routing. No hosted play URL shipped in the September 2026 thread; use the showcase clip until a public build appears.",
    keyFeatures: [
      "Semantic typing racer mechanic",
      "Score-driven movement based on meaning",
      "Launch clip on Jev Directory showcase",
    ],
    stack: ["Browser game shell", "TypeSafe System One"],
    links: {
      post: "https://x.com/marcelpociot/status/2100715684732801095",
    },
    firstSeen: "2026-09-18",
    demoIds: ["wordshift-semantic-racer-marcelpociot"],
    relatedSlugs: ["fhshaik-typesafe-mario", "thisiskp-jevarcade"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Where can I play Wordshift?",
        answer:
          "Marcel's launch thread did not include a stable public URL. Watch the showcase embed and follow @marcelpociot for a hosted build.",
      },
    ],
    metaTitle: "Wordshift: semantic typing racer with Jev Score",
    metaDescription:
      "Marcel Pociot's Wordshift uses Jev to score semantic distance and drive a typing racer car. Clip on Jev Directory showcase.",
  },

  "box-jev-incident-triage": {
    slug: "box-jev-incident-triage",
    status: "published",
    problem:
      "Enterprise teams store incident reports in Box but still manually triage severity, customer impact, and folder routing.",
    targetUser:
      "Box customers experimenting with AI classification on content in Box hubs, security, and operations workflows.",
    overview:
      "Aaron Levie (@levie) demoed Box plus Jev for incident triage: pull a report from Box, ask whether it is customer-facing and how severe it is, move the file into escalate, monitor, or review folders, and write metadata template fields with the result.",
    creator: {
      name: "Aaron Levie",
      handle: "levie",
      xUrl: "https://x.com/levie/status/2101007708044574906",
      company: "Box",
      companyUrl: "https://www.box.com",
    },
    creatorQuote: {
      text:
        "Pull an incident from Box, ask customer-facing and severity, route to folders, set metadata. Nearly instantly and at almost no cost.",
      attributedTo: "Aaron Levie",
      sourceUrl: "https://x.com/levie/status/2101007708044574906",
    },
    jevUsage: {
      flowRole: "Content classification and routing gate on Box files",
      primitives: ["Noul", "Choice", "Score"],
      stateIn:
        "Incident report body and metadata retrieved from Box content APIs in the demo workflow.",
      decisionOut:
        "Customer-facing judgment, severity band, target folder (escalate, monitor, review), and metadata template instance values.",
      flowSteps: [
        "Fetch incident file from Box",
        "Jev asks customer-facing and severity questions with confidence",
        "Automation moves file to escalate, monitor, or review folder",
        "Apply Box metadata template instance with structured results",
      ],
    },
    howJevIsUsed:
      "The Box demo mirrors how enterprises want agents to behave on governed content: read structured state from the system of record, decide with typed questions, then write deterministic outcomes back as folder moves and metadata instead of chat summaries nobody audits. Jev supplies fast Noul and Choice answers on customer impact and severity so the workflow can branch without calling a large generative model on every PDF. Levie named insurance claims, contract management, loan processing, security reviews, and customer log analysis as adjacent patterns using the same shape. Production Box deployments need your tenant's security review; this profile documents only the public X demonstration on Jev Directory.",
    keyFeatures: [
      "Box file ingest and folder routing",
      "Metadata template writes after Jev classification",
      "Enterprise-oriented launch clip from Box CEO",
    ],
    stack: ["Box Content Cloud", "TypeSafe System One"],
    links: {
      website: "https://www.box.com",
      post: "https://x.com/levie/status/2101007708044574906",
    },
    firstSeen: "2026-09-19",
    demoIds: ["box-incident-triage-levie"],
    relatedSlugs: ["classifier-dev", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is this a shipped Box SKU?",
        answer:
          "The directory indexes Levie's public demonstration clip. Confirm product availability with Box for your tenant.",
      },
    ],
    metaTitle: "Box × Jev: incident triage on Content Cloud",
    metaDescription:
      "Aaron Levie's Box demo uses Jev for customer-facing and severity gates, folder routing, and metadata on incident reports. Enterprise showcase on Jev Directory.",
  },

  "lahfir-agent-desktop": {
    slug: "lahfir-agent-desktop",
    status: "published",
    problem:
      "Desktop agents that read pixels or brittle DOM dumps waste tokens and mis-click when UI refs shift between snapshots.",
    targetUser:
      "Agent builders on macOS who want native accessibility-tree computer use with typed next-action routing.",
    overview:
      "agent-desktop (github.com/lahfir/agent-desktop) is a Rust-native CLI distributed on npm. It snapshots any app's accessibility tree, returns compact skeleton overviews with drill-down refs, and executes headless-safe clicks, typing, scrolling, and window management. Your harness calls TypeSafe Jev to choose the next ref action from structured JSON, the same pattern Muhammad Aayan (@socialwithaayan) summarized as Jev picks the next button or input.",
    creator: {
      name: "lahfir",
      handle: "lahfir",
      githubUrl: "https://github.com/lahfir/agent-desktop",
    },
    creatorQuote: {
      text:
        "Desktop automation on the accessibility tree. Jev picks the next button or input.",
      attributedTo: "Muhammad Aayan",
      sourceUrl: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    jevUsage: {
      flowRole: "Choice over the next desktop ref action in the observe-act loop",
      primitives: ["Choice"],
      stateIn:
        "agent-desktop snapshot JSON: skeleton regions, qualified refs (@snapshot:eN), roles, names, and values from macOS accessibility APIs.",
      decisionOut:
        "Selected command family (click, type, scroll, etc.) and target ref from the current finite action menu.",
      flowSteps: [
        "agent-desktop snapshot --skeleton (or find) returns refs and snapshot_id",
        "Harness builds allowed actions from refs and safety policy",
        "Jev Choice picks operation and ref in one System One call",
        "agent-desktop executes via accessibility APIs; loop until goal or budget",
      ],
      sourcedMetrics: [
        {
          claim:
            "Progressive skeleton traversal reports seventy-eight to ninety-six percent token reduction on dense apps versus flat snapshots in README examples.",
          source: "github.com/lahfir/agent-desktop README",
        },
      ],
    },
    howJevIsUsed:
      "agent-desktop deliberately does not embed an LLM. It is the hands and eyes: structured observation in, deterministic CLI commands out. Jev sits in the calling agent exactly like Browser Use Ultrafast: rebuild the action space from fresh state, ask one typed question, threshold confidence, then act. Refs stay stable across steps because they are accessibility identities, not coordinates. Pair with Hermes, Claude Code, or custom harnesses via npm global install, npx, or the C-ABI cdylib for in-process calls. Chromium apps can mix CDP for web content with native AX for menus and dialogs. This profile does not claim a bundled Jev binary inside agent-desktop; wire console.typesafe.ai credentials in your agent layer.",
    keyFeatures: [
      "Rust CLI with fifty-eight command names and structured JSON errors",
      "Skeleton snapshots with drill-down refs for Slack, Finder, Xcode, and more",
      "npm and npx install with prebuilt macOS binaries",
      "ClawHub and skills.sh agent-desktop skill docs",
      "Featured in Aayan top-ten Jev repos thread",
    ],
    stack: ["Rust", "macOS Accessibility APIs", "TypeSafe System One (in agent harness)"],
    links: {
      website: "https://github.com/lahfir/agent-desktop",
      repo: "https://github.com/lahfir/agent-desktop",
      docs: "https://github.com/lahfir/agent-desktop/tree/main/skills/agent-desktop",
      post: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    pricingNote:
      "Open source Apache-2.0; TypeSafe API usage is bring-your-own when your agent calls Jev.",
    firstSeen: "2026-09-21",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
      "jkudish-jev-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does agent-desktop include Jev?",
        answer:
          "No. It exposes desktop actions. Your agent or skill harness calls Jev separately to pick the next safe action from snapshot output.",
      },
      {
        question: "Which platforms are supported?",
        answer:
          "macOS thirteen plus is production-ready per README. Windows and Linux adapters are planned with the same core contracts.",
      },
    ],
    metaTitle: "agent-desktop: Jev Choice over macOS accessibility refs",
    metaDescription:
      "lahfir/agent-desktop Rust CLI for AX-tree desktop automation. Pair with Jev for next-action Choice. Listed from Muhammad Aayan top-ten Jev repos.",
  },

  "kerpopule-hermes-jev-skills": {
    slug: "kerpopule-hermes-jev-skills",
    status: "published",
    problem:
      "Hermes and IDE agents burn frontier tokens on routing, memory hygiene, skill pick, and GUI steps that are decisions, not essays.",
    targetUser:
      "Hermes Agent operators plus Claude Code and Codex users installing the kerpopule skill pack.",
    overview:
      "hermes-jev-skills (github.com/kerpopule/hermes-jev-skills) packages nine Jev-powered skills as plain SKILL.md files and a Hermes plugin that can shadow or enable routing, skill suggestion, memory filtering, compaction selection, triage, mailbox sorting, and computer or browser action Choice. README documents sub-second latencies and sub-cent costs per decision class. Distinct from fast-jev-compaction (Claude-only context trim), hermes-jev-approvals (shell auxiliary), and keeltrace/hermes-jev (async supervision).",
    creator: {
      name: "kerpopule",
      handle: "kerpopule",
      githubUrl: "https://github.com/kerpopule/hermes-jev-skills",
    },
    creatorQuote: {
      text:
        "Jev routing, memory, compaction, skill pick, and computer use for Hermes, Claude Code, and Codex.",
      attributedTo: "Muhammad Aayan",
      sourceUrl: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    jevUsage: {
      flowRole:
        "Multi-skill decision layer: routing, retrieval, compaction, skill pick, triage, and GUI or browser Choice",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Redacted user turns, passage batches, skill name lists, inbox messages, or safe action tables per skill README privacy rules.",
      decisionOut:
        "Model tier Choice, keep or drop turns, ranked passages, skill id or none, triage labels, next GUI or browser action with confidence.",
      flowSteps: [
        "python3 install.py registers Hermes, Claude Code, and Codex when present",
        "jev setup-key stores TypeSafe credentials outside chat",
        "/jev routing shadow logs decisions before switching models",
        "Plugin tools jev_memory_filter, jev_compact_select, jev_choose_action expose hot paths",
      ],
      sourcedMetrics: [
        {
          claim: "Model routing about 0.4 s per turn; skill selection across 377 skills in about 2.8 s per README table.",
          source: "github.com/kerpopule/hermes-jev-skills README",
        },
        {
          claim:
            "Compaction eval: 58.7% recall alone and 75.0% with one search vs 37.5% and 68.3% baseline per SCORECARD-2026-09-20.md.",
          source: "kerpopule/hermes-jev-skills evals/compaction",
        },
      ],
    },
    howJevIsUsed:
      "Each skill sends only the minimum redacted state Jev needs for a typed question: never full transcripts on routing, never screenshots on computer use, local injection screens before memory calls. Shadow mode lets operators compare Jev routing logs against incumbent models without switching production traffic. Computer and browser skills mirror the directory pattern of finite safe actions with Jev Choice per step. Compaction and handoff skills use parallel Score or keep or drop nouls instead of asking a frontier model to summarize tool noise. If you only need Claude Code context trimming, use tamaratran-fast-jev-compaction; if you need Hermes shell APPROVE gates, use anpicasso-hermes-jev-approvals. This repo is the broad everyday skill router Muhammad Aayan placed ninth on his September 2026 list.",
    keyFeatures: [
      "Nine skills as portable SKILL.md files",
      "Hermes plugin with shadow routing and dashboard",
      "jev CLI for mail sorting, doctor, and model pool setup",
      "Documented redaction and private profile rules",
      "Featured in Aayan top-ten Jev repos thread",
    ],
    stack: [
      "Python 3.9+ installer",
      "Hermes Agent plugin API",
      "TypeSafe System One",
    ],
    links: {
      website: "https://github.com/kerpopule/hermes-jev-skills",
      repo: "https://github.com/kerpopule/hermes-jev-skills",
      docs: "https://github.com/kerpopule/hermes-jev-skills/blob/main/README.md",
      post: "https://x.com/socialwithaayan/status/2102059089652285739",
    },
    pricingNote:
      "Open source; TypeSafe keys via jev setup-key. README lists per-skill approximate dollar costs per thousand operations.",
    firstSeen: "2026-09-21",
    demoIds: ["socialwithaayan-ten-jev-repos"],
    relatedSlugs: [
      "tamaratran-fast-jev-compaction",
      "anpicasso-hermes-jev-approvals",
      "keeltrace-hermes-jev",
      "typesafe-ai-skills",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same as fast-jev-compaction?",
        answer:
          "No. tamaratran/fast-jev-compaction is a Claude Code plugin for tool-row keep or drop. hermes-jev-skills is a multi-skill Hermes plus IDE pack with routing, memory, GUI, and more.",
      },
      {
        question: "How do I try routing safely?",
        answer:
          "Start with /jev routing shadow on Hermes. It logs Jev decisions without switching models until you trust the pools.",
      },
    ],
    metaTitle: "Hermes Jev Skills: routing, memory, compaction, and GUI Choice",
    metaDescription:
      "kerpopule/hermes-jev-skills wires Jev into Hermes, Claude Code, and Codex. Not fast-jev-compaction or hermes-jev-approvals. Aayan top-ten listing.",
  },

  "jarrodwatts-jev-trader": {
    slug: "jarrodwatts-jev-trader",
    status: "published",
    problem:
      "On-chain market makers need a discrete buy or sell decision every block without paying for open-ended market commentary on each tick.",
    targetUser:
      "Developers experimenting with Monad trading bots and anyone studying Jev Choice on live order books rather than paper sims.",
    overview:
      "jev-trader (github.com/jarrodwatts/jev-trader, jev-trader.vercel.app) is Jarrod Watts's (@jarrodwatts) Monad trading demo. Jev reads the MON-USDC price feed state and chooses buy or sell on each roughly three hundred millisecond block; the bot places real orders on Kuru's on-chain MON-USDC order book. The public launch clip stresses live execution, not a backtest dashboard.",
    creator: {
      name: "Jarrod Watts",
      handle: "jarrodwatts",
      xUrl: "https://x.com/jarrodwatts/status/2100356151468585346",
      githubUrl: "https://github.com/jarrodwatts",
      companyUrl: "https://jev-trader.vercel.app",
    },
    creatorQuote: {
      text:
        "Jev decides if it should buy or sell given the price feed, and executes real trades on Kuru's on-chain order book every three hundred millisecond block.",
      attributedTo: "Jarrod Watts",
      sourceUrl: "https://x.com/jarrodwatts/status/2100356151468585346",
    },
    jevUsage: {
      flowRole: "Per-block buy versus sell Choice from live price-feed state",
      primitives: ["Choice"],
      stateIn:
        "Asset pair price feed and position context on Monad, refreshed each block (per launch clip and repo README).",
      decisionOut:
        "Typed buy or sell Choice that triggers order placement on Kuru MON-USDC.",
      flowSteps: [
        "Ingest latest MON-USDC price feed on each Monad block (~300 ms cadence in the clip)",
        "Jev Choice: buy or sell given current state",
        "Submit order to Kuru on-chain order book",
        "Repeat on the next block with updated feed",
      ],
      sourcedMetrics: [
        {
          claim:
            "Orders fire on every three hundred millisecond Monad block in the attributed demo clip.",
          source: "Jarrod Watts X post 2100356151468585346",
        },
        {
          claim:
            "Public GitHub repo jarrodwatts/jev-trader had about one thousand eight hundred fifty-one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-trader treats Jev as a throttle-friendly decision head on a hot loop. Instead of prompting a chat model for paragraphs about macro trends, the bot passes compact market state into a single Choice primitive each block. That keeps latency aligned with Monad block time and makes the policy auditable: you can log every buy or sell gate with confidence. Kuru handles settlement; Jev only answers whether to lean long or short on the next tick. The Vercel demo and open-source repo document wiring TypeSafe credentials and Monad RPC endpoints. This profile tracks the shipped trader pattern from the September 2026 clip, not generic DeFi advice.",
    keyFeatures: [
      "Live Kuru MON-USDC orders, not paper trading",
      "Per-block Jev Choice on price-feed state",
      "Open-source TypeScript repo and Vercel demo",
      "Featured showcase clip with remote X video",
    ],
    stack: ["Monad", "Kuru order book", "TypeSafe System One", "Vercel demo"],
    links: {
      website: "https://jev-trader.vercel.app",
      repo: "https://github.com/jarrodwatts/jev-trader",
      demo: "https://jev-trader.vercel.app",
      post: "https://x.com/jarrodwatts/status/2100356151468585346",
    },
    pricingNote:
      "Open source; live trading spends real funds and TypeSafe API usage on each block.",
    firstSeen: "2026-09-17",
    demoIds: ["jev-trader-jarrodwatts"],
    relatedSlugs: [
      "moongotchi-trading-bot-moongotchi",
      "virlo-ai",
      "realzachi-pg-jev",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this a paper trading simulator?",
        answer:
          "No. Jarrod Watts's launch post describes real trades on Kuru's on-chain MON-USDC book. Budget for gas, slippage, and API cost before you point it at mainnet.",
      },
      {
        question: "Which Jev primitive runs each block?",
        answer:
          "A Choice between buy and sell from the current price-feed state. There is no separate Score or Noul layer documented in the public clip.",
      },
      {
        question: "Where do I run it?",
        answer:
          "Clone github.com/jarrodwatts/jev-trader or open jev-trader.vercel.app for the hosted demo linked in the showcase.",
      },
    ],
    metaTitle: "jev-trader: Jev buy or sell every Monad block on Kuru",
    metaDescription:
      "Jarrod Watts jev-trader uses Jev Choice on MON-USDC price state each Monad block and places real Kuru orders. Repo, demo, and launch clip on Jev Directory.",
  },

  "nutlope-1kpapers": {
    slug: "nutlope-1kpapers",
    status: "published",
    problem:
      "Research atlases need stable topic labels across hundreds of papers without paying frontier-model prices per row or waiting on slow batch jobs.",
    targetUser:
      "ML researchers, technical writers, and builders curating large paper sets who want cheap, fast topic routing with typed Jev labels.",
    overview:
      "1kpapers (1kpapers.com) is Hassan El Mghari's (@nutlope) live atlas of AI research papers. A September 2026 clip describes classifying one thousand eighteen papers for about eight cents total with roughly two hundred fifty six millisecond median end-to-end latency per paper. DeepSeek V4 Flash summarizes each PDF; Jev Choice picks one of twenty four topics from title plus summary. The site may still show editorial topics while experimental Jev labels are evaluated, per the builder thread.",
    creator: {
      name: "Hassan El Mghari",
      handle: "nutlope",
      xUrl: "https://x.com/nutlope/status/2100426999546184123",
      company: "Together",
      companyUrl: "https://together.ai",
    },
    creatorQuote: {
      text:
        "I used Jev to classify 1,018 AI research papers. The result: $0.08 total cost and 256ms median end-to-end latency per paper.",
      attributedTo: "Hassan El Mghari",
      sourceUrl: "https://x.com/nutlope/status/2100426999546184123",
    },
    jevUsage: {
      flowRole: "Topic Choice after cheap summarization on each paper row",
      primitives: ["Choice"],
      stateIn:
        "Paper title plus DeepSeek V4 Flash summary text and a fixed menu of twenty four topic labels (per launch clip).",
      decisionOut:
        "Single topic Choice per paper for atlas filtering and map placement.",
      flowSteps: [
        "Summarize each paper with DeepSeek V4 Flash",
        "Send title, summary, and twenty four topic options to Jev",
        "Jev Choice selects the best-matching topic",
        "Publish labels to the 1kpapers atlas UI",
      ],
      sourcedMetrics: [
        {
          claim:
            "One thousand eighteen papers classified for about eight cents total; about two hundred fifty six millisecond median latency per paper.",
          source: "nutlope X post 2100426999546184123",
        },
        {
          claim: "Twenty four candidate topics per classification call.",
          source: "nutlope X post pipeline description",
        },
      ],
    },
    howJevIsUsed:
      "1kpapers separates cheap text generation from typed routing. Summaries can drift; Jev Choice forces each paper into one of twenty four explicit topics so the atlas stays sortable and filterable without embedding indexes. Parallel batches keep median latency near a quarter second per row at micro-dollar prices in the attributed clip. Hassan noted the Jev labels are still experimental: readers may see editorial topics on the live site while evals run. Treat the X thread and 1kpapers.com as canonical for current behavior, not a frozen schema export.",
    keyFeatures: [
      "Live paper atlas at 1kpapers.com",
      "DeepSeek V4 Flash summaries plus Jev topic Choice",
      "Sub-dollar batch cost on one thousand plus papers in the clip",
      "Featured showcase video from @nutlope",
    ],
    stack: ["1kpapers.com", "DeepSeek V4 Flash", "TypeSafe System One"],
    links: {
      website: "https://1kpapers.com",
      demo: "https://1kpapers.com",
      post: "https://x.com/nutlope/status/2100426999546184123",
    },
    pricingNote:
      "Public atlas browsing is free; rebuilding the pipeline spends summarization and System One tokens per paper.",
    firstSeen: "2026-09-21",
    demoIds: ["1kpapers-nutlope"],
    relatedSlugs: ["virlo-ai", "classifier-dev", "egghead-smart-procurement"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Are Jev topics live on every paper card?",
        answer:
          "Hassan's thread says Jev labels are experimental. The site may still display editorial topics while evaluations finish. Refresh 1kpapers.com for the latest UI.",
      },
      {
        question: "Why Choice instead of embeddings?",
        answer:
          "The launch pipeline sends explicit topic strings to Jev Choice after summarization, avoiding vector indexes for the first pass at atlas scale.",
      },
      {
        question: "Can I reproduce the eight cent figure?",
        answer:
          "It comes from the September 2026 clip on one thousand eighteen papers. Re-run on your corpus with current Together and TypeSafe pricing for production budgeting.",
      },
    ],
    metaTitle: "1kpapers: Jev topic Choice on a thousand AI papers",
    metaDescription:
      "nutlope 1kpapers atlas uses DeepSeek summaries and Jev Choice across twenty four topics. About eight cents for 1,018 papers in the launch clip.",
  },

  "realzachi-pg-jev": {
    slug: "realzachi-pg-jev",
    status: "published",
    problem:
      "Teams want natural-language filters over Postgres rows without standing up embeddings, vector indexes, or a separate inference service.",
    targetUser:
      "Backend engineers and data folks who already trust SQL and want Jev Noul, Choice, or Score predicates inside WHERE clauses.",
    overview:
      "pg-jev (github.com/realZachi/pg-jev, pgjev.com) is Zachi's (@iam_zachi) PostgreSQL extension exposing jev() for per-row judgments in plain language. Example patterns from the launch clip include WHERE jev(people, 'could work from home') without embeddings. Zachi reported one hundred twenty nine rows judged in about one second for about $0.0009, with cache hits near six milliseconds on a second run. This listing is the database extension only, not the separate Chrome ad-blocker demo elsewhere in the showcase.",
    creator: {
      name: "Zachi",
      handle: "iam_zachi",
      xUrl: "https://x.com/iam_zachi/status/2100679300756435135",
      githubUrl: "https://github.com/realZachi",
      companyUrl: "https://pgjev.com",
    },
    creatorQuote: {
      text:
        "jev(): a PostgreSQL extension that searches your whole database in natural language. No index, no embeddings, just one function.",
      attributedTo: "Zachi",
      sourceUrl: "https://x.com/iam_zachi/status/2100679300756435135",
    },
    jevUsage: {
      flowRole: "Per-row Jev predicates inside SQL filters",
      primitives: ["Noul", "Choice", "Score"],
      stateIn:
        "Row JSON or table columns passed into jev() plus a plain-language question string (per launch clip and pgjev.com docs).",
      decisionOut:
        "Boolean or typed judgment per row used directly in WHERE clauses.",
      flowSteps: [
        "Install pg-jev extension in Postgres",
        "Write SQL with jev(table_or_row, 'plain language criteria')",
        "Extension calls TypeSafe per row (with caching on repeats)",
        "Return matching rows to the application",
      ],
      sourcedMetrics: [
        {
          claim:
            "One hundred twenty nine rows judged in about one second for about $0.0009; second run about six milliseconds from cache.",
          source: "iam_zachi X post 2100679300756435135",
        },
        {
          claim:
            "Public GitHub repo realZachi/pg-jev had about two hundred eighty three stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "pg-jev pushes Jev to the data plane. Application code stays SQL-native: analysts phrase constraints in English, the extension maps each row through System One, and the planner filters like any other predicate. Caching repeated questions is what drives single-digit millisecond hits on warm rows in the clip. You can mix Noul-style yes or no gates, Choice among small enums, and Score thresholds depending on how you phrase the function call in SQL. The showcase ad-blocker clip for @iam_zachi is a different Chrome extension product; do not conflate it with this Postgres extension.",
    keyFeatures: [
      "jev() SQL function without vector indexes",
      "Documented latency and cost figures from launch clip",
      "pgjev.com site and open-source extension repo",
      "Distinct from ad-blocker-iam-zachi showcase",
    ],
    stack: ["PostgreSQL extension", "TypeSafe System One", "pgjev.com"],
    links: {
      website: "https://pgjev.com",
      repo: "https://github.com/realZachi/pg-jev",
      docs: "https://pgjev.com",
      demo: "https://pgjev.com",
      post: "https://x.com/iam_zachi/status/2100679300756435135",
    },
    pricingNote:
      "Open source extension; TypeSafe usage bills per row judged unless cache hits apply.",
    firstSeen: "2026-09-18",
    demoIds: ["pg-jev-iam-zachi"],
    relatedSlugs: [
      "jarrodwatts-jev-trader",
      "virlo-ai",
      "carolmonroe-jevrls",
    ],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Is this the same as the ad-blocker showcase?",
        answer:
          "No. ad-blocker-iam-zachi is a Chrome extension demo. pg-jev is a PostgreSQL extension for SQL filters at pgjev.com.",
      },
      {
        question: "Do I need embeddings?",
        answer:
          "Zachi's launch clip emphasizes no embeddings and no special indexes for the jev() function path shown.",
      },
      {
        question: "What primitives does SQL expose?",
        answer:
          "Marketing and docs describe Noul, Choice, and Score style questions depending on how you phrase the plain-language predicate per row.",
      },
    ],
    metaTitle: "pg-jev: Jev predicates inside PostgreSQL",
    metaDescription:
      "realZachi pg-jev adds jev() for natural-language WHERE clauses without embeddings. Launch metrics, pgjev.com, and SQL extension repo.",
  },

  "kraayenjon-ai-slop-detector": {
    slug: "kraayenjon-ai-slop-detector",
    status: "published",
    problem:
      "Buyers and readers need a fast signal that a landing page was assembled from generic AI layout patterns, not a careful human edit.",
    targetUser:
      "Marketers, founders, and designers auditing competitor sites or their own drafts before launch.",
    overview:
      "AI Slop Detector is Jon Kraayenbrink's (@kraayenJon) free URL scanner. A September 2026 clip shows Jev checking a site for thirty five parallel tells of AI slop, including purple gradients, emoji headers, seamlessly phrasing, fake testimonials, and bento grids, in about two hundred forty three milliseconds for about $0.00015 of tokens. Headless Chrome captures the page; vision describes visuals; Jev answers parallel Noul questions plus a whole-page score; DeepSeek writes the verdict text from found tells. The live tool allows two scans per day without signup on the public free-tools URL linked in the post.",
    creator: {
      name: "Jon Kraayenbrink",
      handle: "kraayenJon",
      xUrl: "https://x.com/kraayenJon/status/2101157548346794059",
    },
    creatorQuote: {
      text:
        "In 243 ms it checked a website for 35 tells of ai slop. Paste any url, get a slop score.",
      attributedTo: "Jon Kraayenbrink",
      sourceUrl: "https://x.com/kraayenJon/status/2101157548346794059",
    },
    jevUsage: {
      flowRole: "Parallel Noul tells plus page-level Score after vision description",
      primitives: ["Noul", "Score"],
      stateIn:
        "Rendered page screenshot or vision-derived description from headless Chrome (per launch clip).",
      decisionOut:
        "Per-tell Noul flags, aggregate slop score, and DeepSeek-generated verdict copy listing matched patterns.",
      flowSteps: [
        "Fetch and render target URL in headless Chrome",
        "Vision model describes layout and copy cues",
        "Jev runs about thirty five parallel Noul questions on tells",
        "Whole-page Score summarizes slop level",
        "DeepSeek writes human-readable verdict from hits",
      ],
      sourcedMetrics: [
        {
          claim:
            "About two hundred forty three milliseconds and about $0.00015 of tokens for thirty five tells in the launch clip.",
          source: "kraayenJon X post 2101157548346794059",
        },
        {
          claim: "Free tier: two scans per day without signup (per launch post).",
          source: "kraayenJon X post linked free tool",
        },
      ],
    },
    howJevIsUsed:
      "The slop detector keeps expensive vision and cheap judgment separate. Chrome plus a vision description produces structured state; Jev fires dozens of tiny Noul questions in parallel so each tell is typed instead of buried in one chat essay. A Score primitive rolls the tells into a single slop number suitable for sorting URLs. DeepSeek only narrates the evidence Jev already flagged, which keeps latency sub-second in the attributed clip. Operators paste any public URL into the free tool linked from Kraayenbrink's post. This profile cites the X launch and live scanner, not third-party directories.",
    keyFeatures: [
      "Thirty five parallel slop tells per URL",
      "Sub-second Jev pass in the public clip",
      "Free daily scans on the linked tool",
      "Showcase video embed from @kraayenJon",
    ],
    stack: [
      "Headless Chrome capture",
      "Vision description",
      "TypeSafe System One",
      "DeepSeek verdict copy",
    ],
    links: {
      website: "https://madewithjev.com/free-tools/ai-slop-detector",
      demo: "https://madewithjev.com/free-tools/ai-slop-detector",
      post: "https://x.com/kraayenJon/status/2101157548346794059",
    },
    pricingNote: "Two free scans per day on the public tool; additional usage not documented in the clip.",
    firstSeen: "2026-09-21",
    demoIds: ["ai-slop-detector-kraayenjon"],
    relatedSlugs: ["stealads-ai", "ploy-ai", "hypit-ai", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev write the final paragraph?",
        answer:
          "Jev answers the parallel tell questions and scores the page. DeepSeek generates the readable verdict from the tells Jev flagged, per the launch thread.",
      },
      {
        question: "What counts as a tell?",
        answer:
          "The clip names patterns like purple gradients, emoji headers, seamlessly phrasing, fake testimonials, and bento grids among thirty five parallel checks.",
      },
      {
        question: "Is there an API?",
        answer:
          "This listing documents the free URL tool linked in the X post. No public API was claimed in the September 2026 clip.",
      },
    ],
    metaTitle: "AI Slop Detector: parallel Jev tells on any URL",
    metaDescription:
      "kraayenJon free AI Slop Detector uses vision plus thirty five Jev Noul tells and a page score in about 243 ms. Launch clip and tool link.",
  },

  "robj3d3-superx-post-scoring": {
    slug: "robj3d3-superx-post-scoring",
    status: "published",
    problem:
      "Creators need to know whether a draft will outperform their own baseline post before spending reach on reply bait or weak hooks.",
    targetUser:
      "X creators, growth operators, and agents drafting social copy who want a fast viral score loop with rewrite until peak.",
    overview:
      "SuperX post scoring is Rob Hallam's (@robj3d3) Jev classifier for X drafts. His September 2026 clip claims sixty one parallel questions in about one second for about $0.0004, fitted on nine thousand four hundred eighty one real posts from two hundred seven creators, picking the more viral post about two thirds of the time while avoiding reply-bait rewards. The free Tweet Tester at superx.so scores drafts without signup; the same engine ships inside SuperX via API, MCP, and CLI per the thread.",
    creator: {
      name: "Rob Hallam",
      handle: "robj3d3",
      xUrl: "https://x.com/robj3d3/status/2100722975645598191",
      company: "SuperX",
      companyUrl: "https://superx.so",
    },
    creatorQuote: {
      text:
        "Every post gets 61 questions in ~1s for $0.0004. Write, score, rewrite, stop when it peaks.",
      attributedTo: "Rob Hallam",
      sourceUrl: "https://x.com/robj3d3/status/2100722975645598191",
    },
    jevUsage: {
      flowRole: "Parallel question pack per draft plus rewrite loop until score peaks",
      primitives: ["Noul", "Score"],
      stateIn:
        "Draft post text only (per launch thread); population model uses nine thousand four hundred eighty one labeled posts from two hundred seven creators.",
      decisionOut:
        "Relative viral score versus creator baseline, help or hurt reasons, and guidance to rewrite until score peaks without rewarding reply bait.",
      flowSteps: [
        "Author drafts post text in Tweet Tester or SuperX",
        "Jev answers sixty one parallel questions in about one second",
        "Score compared to fitted creator baseline",
        "Rewrite loop until score peaks or reply-bait flags fire",
        "Optional agent skill runs the same loop via MCP",
      ],
      sourcedMetrics: [
        {
          claim:
            "Sixty one questions in about one second for about $0.0004 per draft in the launch clip.",
          source: "robj3d3 X post 2100722975645598191",
        },
        {
          claim:
            "Model fitted on nine thousand four hundred eighty one posts from two hundred seven creators; picks the viral post about two in three times.",
          source: "robj3d3 X post and thread",
        },
        {
          claim:
            "About six thousand free demo runs cost the builder about one dollar and four cents total (follow-up post).",
          source: "robj3d3 X post 2100879539257938355",
        },
      ],
    },
    howJevIsUsed:
      "SuperX treats each draft as a bundle of parallel Noul and Score style probes instead of one monolithic LLM rubric. Training data from thousands of real posts sets the baseline so the score means better or worse than this creator's normal, not a universal like count. The rewrite loop is explicit in the clip: draft, score, edit, stop at the peak. Reply-bait patterns are penalized rather than rewarded. Free users can try superx.so/tweet-tester without login; paid SuperX plans expose POST /v1/posts/viral-score, an MCP predict_viral_score tool, and superx posts:viral-score CLI per Rob's thread. This directory entry focuses on the shipped scoring path and attributed metrics, not unaudited accuracy guarantees.",
    keyFeatures: [
      "Free Tweet Tester without signup",
      "Sixty one parallel Jev questions per draft",
      "Rewrite-until-peak workflow in launch clip",
      "SuperX API, MCP, and CLI for the same scorer",
    ],
    stack: ["superx.so Tweet Tester", "SuperX API", "TypeSafe System One"],
    links: {
      website: "https://superx.so/tweet-tester",
      demo: "https://superx.so/tweet-tester",
      post: "https://x.com/robj3d3/status/2100722975645598191",
    },
    pricingNote:
      "Tweet Tester is free with a five-post browser limit before SuperX upsell; in-product API billing follows SuperX plans.",
    firstSeen: "2026-09-17",
    demoIds: ["superx-post-scoring-robj3d3"],
    relatedSlugs: ["virlo-ai", "ploy-ai", "hypit-ai", "kraayenjon-ai-slop-detector"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Where is the free tool?",
        answer:
          "superx.so/tweet-tester scores drafts in a simulated feed without signup, linked from Rob Hallam's launch thread.",
      },
      {
        question: "Does the score predict global virality?",
        answer:
          "SuperX docs emphasize scoring relative to your own normal post at your follower size, not a universal like target.",
      },
      {
        question: "How do agents call the scorer?",
        answer:
          "Rob's thread lists SuperX MCP predict_viral_score and CLI superx posts:viral-score alongside POST /v1/posts/viral-score.",
      },
    ],
    metaTitle: "SuperX post scoring: sixty one Jev questions per draft",
    metaDescription:
      "robj3d3 SuperX viral scorer runs sixty one parallel Jev probes in about one second. Free Tweet Tester, launch metrics, and showcase clip.",
  },

  "kitfunso-hippo-memory": {
    slug: "kitfunso-hippo-memory",
    status: "published",
    problem:
      "Agent memory tools retrieve by embedding similarity alone, so the first hit is often related noise instead of the fact you actually needed.",
    targetUser:
      "Builders who want a local-first memory CLI and optional Jev reranking when recall quality matters more than raw speed.",
    overview:
      "Hippo Memory is kitfunso's open memory layer with a hippo recall CLI, local storage, and an opt-in TypeSafe Jev reranker. Default recall stays cheap and offline-friendly; add --reranker jev when you want structured ranking judgments on candidate memories before results print.",
    creator: {
      name: "kitfunso",
      handle: "kitfunso",
      githubUrl: "https://github.com/kitfunso",
      companyUrl: "https://hippo-memory.com",
    },
    jevUsage: {
      flowRole: "Optional reranker on memory recall (ranking only, not generation)",
      primitives: ["Score", "Noul"],
      stateIn:
        "User query plus a bounded set of candidate memory rows retrieved by the local index before reranking runs.",
      decisionOut:
        "Reordered recall list where Jev scores or keeps-drop judgments elevate the best matching memory to rank one.",
      flowSteps: [
        "Run hippo recall \"<query>\" to fetch local candidates",
        "Pass --reranker jev to enable TypeSafe Jev on the candidate set",
        "Jev applies ranking judgments per README schema (not summarization)",
        "Return reranked rows to the caller; reranker stays off unless opted in",
      ],
      sourcedMetrics: [
        {
          claim:
            "Private eval on three hundred queries: recall at one reportedly moves from 0.41 to 0.62 with Jev reranker enabled (docs/evals/2026-09-19-jev-reranker.md).",
          source: "github.com/kitfunso/hippo-memory eval doc",
        },
        {
          claim: "Documented ballpark ~$0.0004 per recall when reranker is on.",
          source: "github.com/kitfunso/hippo-memory README",
        },
      ],
    },
    howJevIsUsed:
      "Hippo does not ask Jev to write memories or paraphrase notes. The hot path is recall: local retrieval proposes candidates, then Jev answers structured questions about which rows best satisfy the query. That is classic ranking work for Score and Noul style probes instead of a chat completion. The reranker ships off by default so scripts and agents keep predictable latency; turn it on when your eval says first-result quality is worth a fraction of a cent. Read the published eval markdown in the repo before you quote the 0.41 to 0.62 recall-at-one jump in a slide deck; it is the author's private set, not a third-party benchmark leaderboard.",
    keyFeatures: [
      "CLI hippo recall with optional --reranker jev",
      "Local memory store with ranking-only Jev path",
      "Published eval notes for reranker impact",
      "TypeSafe API key required only when reranker runs",
    ],
    stack: ["TypeScript", "CLI", "TypeSafe System One", "local memory index"],
    links: {
      website: "https://hippo-memory.com",
      repo: "https://github.com/kitfunso/hippo-memory",
      docs: "https://github.com/kitfunso/hippo-memory/tree/main/docs",
    },
    pricingNote:
      "Local recall is yours to host; Jev reranker bills per TypeSafe usage (~$0.0004/recall per README order of magnitude).",
    firstSeen: "2026-09-22",
    relatedSlugs: ["docjev", "tamaratran-fast-jev-compaction", "tanstack-ai-decide"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev rewrite stored memories?",
        answer:
          "No. README positions Jev as a reranker on recall candidates only. Ingest and storage stay outside the Jev path unless you add your own hooks.",
      },
      {
        question: "How do I enable reranking?",
        answer:
          "Use hippo recall \"<query>\" --reranker jev with TYPESAFE_API_KEY configured per install docs.",
      },
    ],
    metaTitle: "Hippo Memory: optional Jev reranker on agent recall",
    metaDescription:
      "kitfunso Hippo Memory CLI with opt-in Jev reranking on recall. Published eval notes, ~$0.0004/recall ballpark, ranking-only TypeSafe path.",
  },

  "juspay-neurolink": {
    slug: "juspay-neurolink",
    status: "published",
    problem:
      "Agent frameworks treat chat and embeddings as the only inference modes, so routing, budgeting, and tool picks still devolve into JSON parsing games.",
    targetUser:
      "Teams building on NeuroLink who want decide() beside generate and embed, with typed booleans and choices in production control flow.",
    overview:
      "NeuroLink is Juspay's open agent SDK (neurolink.ink). It adds a third inference type, decide, exposed as tryDecide() in application code. Under the hood that path uses TypeSafe Jev via documented gateway wiring so you get calibrated Choice, Score, and boolean answers for routing without inventing another HTTP client.",
    creator: {
      name: "Juspay",
      handle: "juspay",
      company: "Juspay",
      companyUrl: "https://juspay.in",
      githubUrl: "https://github.com/juspay/neurolink",
    },
    jevUsage: {
      flowRole: "Structured decide inference for routing, budgeting, compaction, and tool selection",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Typed decide inputs per NeuroLink schema: candidate sets for Choice, rubric state for Score, yes-no propositions for boolean/Noul paths.",
      decisionOut:
        "Calibrated structured results consumed directly in TypeScript control flow (pick model, drop context chunk, allow tool, etc.).",
      flowSteps: [
        "Configure TYPESAFE_API_KEY and gateway per NeuroLink docs",
        "Call tryDecide() with the schema for your routing or gate question",
        "NeuroLink forwards to TypeSafe Jev semantics",
        "App thresholds probabilities; on missing key the SDK fail-opens per README",
      ],
    },
    howJevIsUsed:
      "NeuroLink is not wrapping Jev as a chat persona. decide is a first-class inference type next to chat and embed, which matters for payment-grade agents that cannot afford ambiguous prose. Documented uses include picking among models, trimming context when relevance scores fall, compacting transcripts with structured keep or drop signals, and routing tools. tryDecide() returns the same primitive families you would hand-roll against System One, but with NeuroLink's agent lifecycle and observability hooks. If the TypeSafe key is absent, the framework is explicit about failing open so dev laptops still run; production should set keys and monitor decide latency like any other dependency.",
    keyFeatures: [
      "tryDecide() third inference type beside chat and embed",
      "Choice, Score, and boolean/Noul schemas in one SDK",
      "Documented model routing and context budgeting patterns",
      "Fail-open behavior without TYPESAFE_API_KEY",
    ],
    stack: ["TypeScript", "NeuroLink SDK", "Vercel AI Gateway", "TypeSafe System One"],
    links: {
      website: "https://neurolink.ink",
      repo: "https://github.com/juspay/neurolink",
      docs: "https://docs.neurolink.ink",
    },
    pricingNote: "Jev decide calls bill through your TypeSafe or gateway account; NeuroLink itself is open source.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["tanstack-ai-decide", "vercel-eve", "classifier-dev"],
    relatedLearnSlugs: ["vercel-ai-gateway", "jev-typesafe"],
    faq: [
      {
        question: "Is decide separate from chat completions?",
        answer:
          "Yes. NeuroLink docs describe decide as its own inference type with tryDecide(), not a prompt hack on top of generate().",
      },
      {
        question: "What happens without a TypeSafe key?",
        answer:
          "README documents fail-open behavior so local dev does not hard crash; production agents should configure TYPESAFE_API_KEY.",
      },
    ],
    metaTitle: "NeuroLink: Juspay agent SDK with tryDecide() and Jev",
    metaDescription:
      "juspay/neurolink adds decide inference via TypeSafe Jev for routing, compaction, and tool picks. Docs at docs.neurolink.ink.",
  },

  "uehaj-jev-semgrep": {
    slug: "uehaj-jev-semgrep",
    status: "published",
    problem:
      "Regex grep misses intent (find the line that handles refunds) and LLM grep burns budget reading whole files into chat.",
    targetUser:
      "Developers who want line-level semantic filters in CI or ad hoc audits with composable boolean meaning expressions.",
    overview:
      "jev-semgrep is uehaj's meaning grep CLI. You state a natural-language proposition; the tool batches lines from stdin or files and asks Jev whether each line satisfies that meaning above a threshold. AND, OR, and NOT compose propositions; file language and query language can differ.",
    creator: {
      name: "uehaj",
      handle: "uehaj",
      githubUrl: "https://github.com/uehaj",
    },
    jevUsage: {
      flowRole: "Per-line semantic match filter (batched Noul questions)",
      primitives: ["Noul"],
      stateIn:
        "One text line (or batch) plus the active meaning proposition from the CLI expression tree.",
      decisionOut:
        "Binary keep or drop for each line based on calibrated probability against threshold; composed trees for AND/OR/NOT.",
      flowSteps: [
        "Parse CLI meaning expression (possibly nested boolean ops)",
        "Stream or batch file lines to Jev with the active proposition",
        "Threshold Noul outputs to emit matching lines only",
        "Cross-language: proposition can be Japanese while the file is English, per author writeup",
      ],
    },
    howJevIsUsed:
      "This is grep-shaped, not agent-shaped. Every emitted line earned its place because Jev answered a Noul question: does this line entail the meaning you asked for? Batching keeps latency tolerable on large repos. Boolean composition lets you build mini policies (error handling AND not test fixture) without learning another query DSL beyond words. The Zenn article walks through real examples and contrasts the approach with classic semgrep rules that die on paraphrase. Bring a TypeSafe key; there is no cloud-hosted meaning grep service in the repo.",
    keyFeatures: [
      "Natural-language propositions instead of regex",
      "AND, OR, NOT composition in the CLI",
      "Cross-language matching between query and file",
      "Line-at-a-time threshold filtering",
    ],
    stack: ["TypeScript", "CLI", "TypeSafe System One"],
    links: {
      repo: "https://github.com/uehaj/jev-semgrep",
      docs: "https://github.com/uehaj/jev-semgrep#readme",
      post: "https://zenn.dev/uehaj/articles/jev-semgrep-grep-by-meaning",
    },
    pricingNote: "Per-line Jev calls; tune batch size and threshold to control cost on big trees.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["hemanth-pkg-gate", "kushwho-jev-codes", "classifier-dev"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is this the Semgrep security product?",
        answer:
          "No. The name is a pun on grep-by-meaning. This repo is uehaj's Jev CLI, not semgrep.dev rule packs.",
      },
      {
        question: "Which primitive does each line use?",
        answer:
          "The README and Zenn post describe a probability that the proposition holds, which maps to Noul semantics in Jev vocabulary.",
      },
    ],
    metaTitle: "jev-semgrep: meaning grep with Jev Noul per line",
    metaDescription:
      "uehaj jev-semgrep filters files by natural-language propositions with Jev. Boolean composition, cross-language lines, Zenn writeup.",
  },

  "tamaratran-jev-pruner": {
    slug: "tamaratran-jev-pruner",
    status: "published",
    problem:
      "Agent shells return megabytes of build logs and test output; stuffing it all into context drowns the model before anyone reads the failure line.",
    targetUser:
      "Claude Code and Codex users who want Bash hook compaction on command stdout without summarizing away stack traces.",
    overview:
      "jev-pruner is Tamara Tran's hook that sits between shell completion and the LLM. It chunks stdout, asks Jev a Noul question per chunk about whether any line must remain visible, keeps chunks above threshold, and archives the full output locally for forensics.",
    creator: {
      name: "Tamara Tran",
      handle: "tamaratran",
      githubUrl: "https://github.com/tamaratran/jev-pruner",
    },
    jevUsage: {
      flowRole: "Bash hook compaction on command stdout before tool results return",
      primitives: ["Noul"],
      stateIn:
        "Chunked stdout from the finished command plus hook context about what the agent was trying to learn.",
      decisionOut:
        "Trimmed stdout for the model with full transcript archived; chunks dropped only when Jev says nothing important remains.",
      flowSteps: [
        "Command runs to completion in Claude Code or Codex Bash tool",
        "Hook intercepts stdout before the LLM receives it",
        "Split into chunks; parallel Noul: does any line in this chunk need to stay?",
        "Emit surviving chunks; store complete stdout in archive per README",
      ],
    },
    howJevIsUsed:
      "jev-pruner complements fast-jev-compaction, it does not replace it. Compaction attacks long-lived tool rows in the transcript; pruner attacks one-shot terminal floods right after they happen. Jev never rewrites log lines into summaries. It only votes keep or drop at chunk granularity, which preserves exact error strings when they matter. If you already run tamaratran/fast-jev-compaction for history hygiene, add pruner when npm test or cargo build spews more text than your context budget allows. Same TypeSafe key story as Tamara's other plugins.",
    keyFeatures: [
      "Claude Code and Codex Bash hook integration",
      "Chunk-level Noul gates, not LLM summaries",
      "Full stdout archive alongside trimmed view",
      "Sibling project to fast-jev-compaction (different repo)",
    ],
    stack: ["TypeScript", "Claude Code hooks", "Codex", "TypeSafe System One"],
    links: {
      repo: "https://github.com/tamaratran/jev-pruner",
      docs: "https://github.com/tamaratran/jev-pruner#readme",
    },
    pricingNote: "Bring your own TYPESAFE_API_KEY; cost scales with chunk count per command.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["tamaratran-fast-jev-compaction", "kushwho-jev-codes", "kerpopule-hermes-jev-skills"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "How is this different from fast-jev-compaction?",
        answer:
          "fast-jev-compaction trims paired tool_use and tool_result rows in the transcript. jev-pruner trims fresh shell stdout in the Bash hook path. Different repos, same Noul philosophy.",
      },
      {
        question: "Do I lose the full log?",
        answer:
          "README describes archiving complete stdout while only the Jev-approved chunks return to the model.",
      },
    ],
    metaTitle: "jev-pruner: Noul chunk gates for shell output",
    metaDescription:
      "tamaratran/jev-pruner Bash hook uses Jev Noul per stdout chunk for Claude Code and Codex. Archives full output, distinct from fast-jev-compaction.",
  },

  "hyperspaceai-jevcache": {
    slug: "hyperspaceai-jevcache",
    status: "published",
    problem:
      "Agents replay identical decide questions on unchanged state, paying inference micro-dollars for deterministic answers they already bought.",
    targetUser:
      "Operators who want a local ledger for Jev-class decisions with CLI audit trails, not another hosted proxy holding their keys.",
    overview:
      "jevcache from hyperspaceai memoizes structured Jev answers keyed by model, schema, and state hash. The jev backend talks to TypeSafe with your local API key; decide, recall, replay, and serve commands expose hits, misses, and replays for debugging spend.",
    creator: {
      name: "hyperspaceai",
      handle: "hyperspaceai",
      githubUrl: "https://github.com/hyperspaceai",
      companyUrl: "https://jevcache.sh",
    },
    jevUsage: {
      flowRole: "Local cache and replay layer in front of TypeSafe Jev calls",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Tuple of model id, JSON schema fingerprint, and canonical serialized state presented to decide.",
      decisionOut:
        "Cached structured answer on hit; on miss, forward to Jev, persist, then return. replay reproduces prior decisions for audits.",
      flowSteps: [
        "CLI or serve endpoint receives decide with schema + state",
        "jevcache hashes inputs and checks the local ledger",
        "On miss, call TypeSafe Jev and store response with metadata",
        "recall and replay commands inspect history without re-spend",
      ],
    },
    howJevIsUsed:
      "jevcache is infrastructure, not a new primitive. Whatever schema you pass (Choice among tools, Score for risk, Noul for allow) is what gets cached. The project is explicit that it is not reselling inference: your key stays on the machine running jevcache. That makes it attractive for agent loops that re-read the same repository snapshot or policy table every turn. Use serve when multiple workers should share one ledger; use replay when finance asks why the bot flipped a gate last Tuesday.",
    keyFeatures: [
      "Memoize (model, schema, state) to Jev answers",
      "CLI decide, recall, replay, and serve",
      "Local TypeSafe key, not a proxy reseller",
      "Works with any primitive your schema defines",
    ],
    stack: ["TypeScript", "CLI", "local ledger store", "TypeSafe System One"],
    links: {
      website: "https://jevcache.sh",
      repo: "https://github.com/hyperspaceai/jevcache",
      docs: "https://github.com/hyperspaceai/jevcache#readme",
    },
    pricingNote: "Cache hits avoid repeat Jev charges; misses bill normally through TypeSafe.",
    firstSeen: "2026-09-22",
    relatedSlugs: ["tanstack-ai-decide", "juspay-neurolink", "classifier-dev"],
    relatedLearnSlugs: ["jev-typesafe", "system-one"],
    faq: [
      {
        question: "Does jevcache host my API key in the cloud?",
        answer:
          "No. README positions the tool as a local decision ledger with your TypeSafe credentials on the operator machine.",
      },
      {
        question: "Which primitives can I cache?",
        answer:
          "Any structured decide schema you define: Choice, Score, or Noul shaped questions all serialize into the same cache key pattern.",
      },
    ],
    metaTitle: "jevcache: local ledger for TypeSafe Jev decisions",
    metaDescription:
      "hyperspaceai jevcache memoizes Jev decide calls with CLI recall and replay. Local key, no proxy resale, jevcache.sh docs.",
  },

  "thruwire-foreman": {
    slug: "thruwire-foreman",
    status: "published",
    problem:
      "Coding agents can churn for hours while humans guess whether work is done, tests are enough, or someone should intervene.",
    targetUser:
      "Teams experimenting with software factory layouts where Codex or OpenCode workers implement tickets and a separate supervisor must steer without rewriting every line.",
    overview:
      "foreman (github.com/thruwire/foreman, thruwire.ai) is Josh Rosen's (@JoshARosen) native Python asyncio runtime for semantic supervision. Workers in the coding agent loop produce factory evidence; Foreman runs a parallel assess loop that feeds that evidence to TypeSafe Jev and reads calibrated scores across responsibility buckets: completion, verification, worker health, repository instruction drift, and human escalation. Routing then picks continue, steer, stop, retry, verify, or finish. The README frames Foreman as an architectural experiment, not a claim that it already beats every conventional harness.",
    creator: {
      name: "Josh Rosen",
      handle: "JoshARosen",
      xUrl: "https://x.com/JoshARosen/status/2100573432089866717",
      githubUrl: "https://github.com/thruwire",
      companyUrl: "https://thruwire.ai",
    },
    creatorQuote: {
      text:
        "Generative models work. Foreman watches the work.",
      attributedTo: "Josh Rosen",
      sourceUrl: "https://github.com/thruwire/foreman",
    },
    jevUsage: {
      flowRole:
        "Parallel supervision loop scoring factory responsibilities from worker evidence",
      primitives: ["Score", "Noul"],
      stateIn:
        "Factory events from Codex or OpenCode runs: implementation progress, test output, requirement signals, and worker telemetry described in Foreman docs.",
      decisionOut:
        "Calibrated responsibility scores (for example implementation_complete, requirements_satisfied, needs_verification, worker_stuck, needs_human) that drive steering actions.",
      flowSteps: [
        "Worker loop: reason, tool, observe while emitting factory events",
        "Foreman loop ingests evidence on each assess tick",
        "Jev evaluates configured responsibilities with typed scores",
        "Router maps responsibility pattern to continue, steer, stop, retry, verify, or finish",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo thruwire/foreman had about five hundred six stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Foreman does not ask Jev to write patches. The coding agent does software engineering; Jev answers fast structured questions about whether the factory is healthy. README diagrams show responsibility groups with example probabilities (implementation_complete near 0.91 while ready_to_finish stays low until verification catches up). That is Score and Noul shaped supervision: thresholds become policy without parsing chat prose. Operators configure responsibilities and routing in repo docs (theory, runtime, steering, workers). Bring a TypeSafe key for live assess calls. Pair Foreman with ordinary agent harnesses when you want a second opinion that only watches evidence.",
    keyFeatures: [
      "Dual asyncio loops: coding agent plus Foreman assess",
      "Responsibility buckets for completion, verification, health, escalation",
      "Codex and OpenCode worker backends documented",
      "Open Python repo and thruwire.ai product site",
    ],
    stack: ["Python", "asyncio", "Codex", "OpenCode", "TypeSafe System One"],
    links: {
      website: "https://thruwire.ai",
      repo: "https://github.com/thruwire/foreman",
      docs: "https://github.com/thruwire/foreman/tree/main/docs",
      post: "https://x.com/JoshARosen/status/2100573432089866717",
    },
    pricingNote:
      "Open source runtime; TypeSafe usage bills per assess call configured in your factory.",
    firstSeen: "2026-09-17",
    relatedSlugs: [
      "lahfir-agent-desktop",
      "kerpopule-hermes-jev-skills",
      "tamaratran-fast-jev-compaction",
      "devagrawal09-jev-review",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Foreman replace Codex or OpenCode?",
        answer:
          "No. README positions workers as the implementers and Foreman as the watcher that scores responsibilities and steers the factory.",
      },
      {
        question: "Which Jev primitives appear in the loop?",
        answer:
          "Responsibility outputs are calibrated scores over completion, verification, health, and escalation questions. Treat them as Score and Noul style gates in routing docs, not free-form chat.",
      },
      {
        question: "Where is the announce thread?",
        answer:
          "Josh Rosen's X post at x.com/JoshARosen/status/2100573432089866717 introduces the factory foreman concept; deep wiring lives in github.com/thruwire/foreman docs.",
      },
    ],
    metaTitle: "foreman: Jev supervisor for Codex and OpenCode factories",
    metaDescription:
      "thruwire foreman watches software factory evidence with TypeSafe Jev responsibilities, then continue, steer, verify, or escalate. Repo, thruwire.ai, and launch post.",
  },

  "dicklesworthstone-skillranker": {
    slug: "dicklesworthstone-skillranker",
    status: "published",
    problem:
      "Large skill libraries look interchangeable in prose, so agents load the wrong procedure and burn context three turns later.",
    targetUser:
      "Claude Code and compatible harness users who want sr to rank skills from live session context with abstention when nothing fits.",
    overview:
      "skillranker (github.com/Dicklesworthstone/skillranker) is Dicklesworthstone's Rust CLI (sr) built around TypeSafe Jev. It reads recent conversation, the current request, workspace signals, and the harness skill inventory, then asks Jev to compare candidates including a real none of these option. Large rosters can pre-filter with Quill from FrankenSearch before Jev runs; explicit skill requests resolve locally first. Hooks, JSON output, replay, and local feedback ship for production agents. A TypeSafe API key is mandatory: there is no bundled local model.",
    creator: {
      name: "Dicklesworthstone",
      handle: "Dicklesworthstone",
      githubUrl: "https://github.com/Dicklesworthstone",
    },
    jevUsage: {
      flowRole: "Two-stage skill fit ranking with abstention over the visible inventory",
      primitives: ["Choice", "Score"],
      stateIn:
        "Session transcript slice, active user request, workspace metadata, and eligible skill records (full roster or Quill-narrowed shortlist per README).",
      decisionOut:
        "Ranked skill recommendations with none of these when Jev rejects the field; advisory output for the agent, not a forced load.",
      flowSteps: [
        "Establish session context and eligible skills (local resolution for explicit picks)",
        "Optionally narrow very large libraries with Quill before Jev",
        "Jev broad comparison then richer excerpt evaluation on a shortlist",
        "Emit ranked skills, abstention, and inspectable JSON or hook payload",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo Dicklesworthstone/skillranker had about one hundred thirteen stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "SkillRanker treats Jev as the evaluation engine, not the transport layer. Local code gathers candidates and safeguards; Jev answers which skill fits the next step and whether the set should be rejected entirely. Choice semantics cover picking among named skills plus none of these, which is how abstention stays typed instead of a hand-wavy maybe later. Score-style comparisons show up in the two-pass flow (broad compare, then deeper excerpt read). Operators run sr rank --allow-network with hooks wired in Claude Code when they want automatic nudges. Budget TypeSafe spend on busy sessions; README documents replay and local calibration tooling for when rankings drift.",
    keyFeatures: [
      "Rust sr CLI with JSON, hooks, and TUI surfaces",
      "Jev comparisons include none of these abstention",
      "Quill pre-filter for libraries above two hundred fifty four skills",
      "Requires TypeSafe API key (no substitute provider)",
    ],
    stack: ["Rust", "CLI", "Claude Code hooks", "TypeSafe System One"],
    links: {
      repo: "https://github.com/Dicklesworthstone/skillranker",
      docs: "https://github.com/Dicklesworthstone/skillranker#how-ranking-works",
    },
    pricingNote:
      "Open source CLI; every rank call uses your TypeSafe account. Quill narrowing is local; Jev evaluations bill per README.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "kerpopule-hermes-jev-skills",
      "kitfunso-hippo-memory",
      "tanstack-ai-decide",
      "juspay-neurolink",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Can SkillRanker run without TypeSafe?",
        answer:
          "No. README states ranking requires your own TypeSafe account and API key; local retrieval only prepares candidates.",
      },
      {
        question: "What is none of these?",
        answer:
          "Jev can reject the whole candidate set when nothing fits, so the agent is not forced to load a plausible-but-wrong skill.",
      },
      {
        question: "How do I try it offline first?",
        answer:
          "Run sr demo --case useful for fixtures, then sr rank --allow-network when you are ready to connect a live session.",
      },
    ],
    metaTitle: "skillranker: Jev ranks agent skills with abstention",
    metaDescription:
      "Dicklesworthstone skillranker sr CLI uses TypeSafe Jev to rank Claude Code skills from live context, with none of these and hooks. Rust repo on Jev Directory.",
  },

  "mrnugget-jev-shell-history": {
    slug: "mrnugget-jev-shell-history",
    status: "published",
    problem:
      "Plain prefix history search suggests the most recent literal match, not the command you meant when typing fuzzy intent.",
    targetUser:
      "zsh users who want Fish-style grey autosuggestions ranked by Jev instead of dumb substring order.",
    overview:
      "jev-shell-history (github.com/mrnugget/jev-shell-history) is mrnugget's zsh plugin. On each buffer change it asynchronously runs a small Node CLI that reads up to one hundred distinct history entries, then asks TypeSafe Jev which entry you are completing. Prefix mode filters literals before the model; fuzzy mode leans on calibrated Choice and Noul gates. Accept with arrow right, Ctrl+E, or End. Latency is roughly seven tenths to nine tenths of a second per request per README, mostly API time.",
    creator: {
      name: "mrnugget",
      handle: "mrnugget",
      githubUrl: "https://github.com/mrnugget",
    },
    jevUsage: {
      flowRole: "Per-keystroke history completion Choice with Noul gate for fuzzy mode",
      primitives: ["Choice", "Noul"],
      stateIn:
        "typed_so_far plus ID-tagged candidate commands from zsh history (prefix-filtered or full set).",
      decisionOut:
        "Top Choice candidate with probability score; fuzzy mode only surfaces when Noul and score thresholds pass.",
      flowSteps: [
        "line-pre-redraw hook starts cli.ts without blocking the prompt",
        "Load recent distinct history; prefix mode if any entry starts with typed text",
        "Single TypeSafe request: Choice over candidate IDs plus Noul whether any completes input",
        "Apply JEV_THRESHOLD, JEV_MIN_SCORE, JEV_STRONG_SCORE gates; discard stale responses if buffer changed",
      ],
      sourcedMetrics: [
        {
          claim:
            "Roughly 0.7 to 0.9 seconds per suggestion request, mostly API latency (README).",
          source: "github.com/mrnugget/jev-shell-history README",
        },
        {
          claim:
            "Public GitHub repo mrnugget/jev-shell-history had about one hundred one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "The plugin keeps deterministic shell rules in zsh and delegates judgment to Jev. Choice picks which history ID best continues what you typed; Noul catches cases where nothing in the set actually completes the buffer, which matters in fuzzy mode when the model might otherwise spread probability across noise. README explains why both signals exist: Noul under-fires on tiny histories where Choice is decisive, while nonsense inputs spread Choice mass but leave Noul near zero. Privacy is straightforward: candidate commands and your partial line are sent to TypeSafe on each ranked request (skip the network when a single prefix match is obvious). Configure limits and thresholds with JEV_HISTORY_LIMIT, JEV_MIN_CHARS, JEV_THRESHOLD, and friends before sourcing the plugin.",
    keyFeatures: [
      "Fish-style grey suggestions in zsh 5.9+",
      "Prefix fast path without API when one literal match exists",
      "Choice plus Noul in one request per keystroke batch",
      "Documented env vars for thresholds and history window",
    ],
    stack: ["TypeScript", "zsh", "Node 22+", "TypeSafe System One"],
    links: {
      repo: "https://github.com/mrnugget/jev-shell-history",
      docs: "https://github.com/mrnugget/jev-shell-history#how-it-works",
    },
    pricingNote:
      "Plugin is open source; each ranked keystroke uses TypeSafe API credits. Tune JEV_MIN_CHARS and history limit to control spend.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "realzachi-pg-jev",
      "uehaj-jev-semgrep",
      "classifier-dev",
      "tamaratran-jev-pruner",
    ],
    relatedLearnSlugs: ["use-cases", "jev-typesafe"],
    faq: [
      {
        question: "Does my shell history leave my machine?",
        answer:
          "When Jev ranks candidates, typed text and up to JEV_HISTORY_LIMIT recent commands are sent to TypeSafe. Single obvious prefix matches can skip the API. Read README before enabling on shared machines.",
      },
      {
        question: "Which primitives run per request?",
        answer:
          "One request with Choice over history IDs and a Noul asking whether any candidate completes the typed buffer.",
      },
      {
        question: "Why are suggestions sometimes empty?",
        answer:
          "Fuzzy mode requires top score and Noul or strong score thresholds. Nonsense input should yield no suggestion instead of a random history line.",
      },
    ],
    metaTitle: "jev-shell-history: Jev-ranked zsh autosuggestions",
    metaDescription:
      "mrnugget jev-shell-history uses Jev Choice and Noul on zsh history for Fish-style completions. Thresholds, privacy notes, and install docs.",
  },

  "jexp-neo4jev": {
    slug: "jexp-neo4jev",
    status: "published",
    problem:
      "Graph walks with chat models waste tokens narrating edges instead of returning a calibrated distribution over next hops.",
    targetUser:
      "Neo4j developers and ML engineers who want a reproducible demo of beam search navigation with one structured call per hop.",
    overview:
      "neo4jev (github.com/jexp/neo4jev) is Michael Hunger's (jexp) graph navigation demo using TypeSafe system_one. Each hop lists outgoing relationships as Choice options (type, properties, target labels) and asks a Noul whether the navigation goal is reached in the same call. Beam search keeps top branches ranked by sum of log probabilities to avoid float underflow. Streamlit app, notebooks, and neo4j-viz rendering target the public companies2 graph by default but introspect schema live for other instances.",
    creator: {
      name: "Michael Hunger",
      handle: "jexp",
      githubUrl: "https://github.com/jexp",
    },
    jevUsage: {
      flowRole: "Single-hop navigator: Choice over edges plus goal Noul in one system_one round trip",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Current node context, capped outgoing relationship candidates from Neo4j, and GoalSpec text from the UI or notebook.",
      decisionOut:
        "Probability mass over next relationships plus goal-reached signal; beam search aggregates log-probs along paths.",
      flowSteps: [
        "Introspect labels and indexes; search a start node",
        "Fetch outgoing relationship candidates for the active node",
        "system_one with Choice over NavCandidate edges and Noul for goal reached",
        "Beam search expands top branches; viz highlights chosen paths vs neighborhood",
      ],
      sourcedMetrics: [
        {
          claim:
            "Each hop costs exactly one system_one round trip for both Choice and Noul (README architecture).",
          source: "github.com/jexp/neo4jev README",
        },
        {
          claim:
            "Public GitHub repo jexp/neo4jev had about eighty nine stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "neo4jev is a teaching stack for structured graph policies. Instead of prompting an LLM to ramble about Cypher, navigator.py sends typed state to system_one and reads a full distribution over legal next edges. Noul goal detection riding in the same call keeps hop cost predictable for beam search. Notebooks and Streamlit wire the same library; without TYPESAFE_API_KEY the UI shows failures verbatim and uses labeled stand-ins so pipelines still demo. That honesty matters for evals: never present synthetic probabilities as live Jev output. Point .env at your own Neo4j URI when you outgrow the Labs companies2 sandbox.",
    keyFeatures: [
      "Schema-agnostic Neo4j introspection",
      "Choice plus Noul per hop in one system_one call",
      "Beam search ranked by log probability sums",
      "Streamlit app and Jupyter notebooks share neo4jev core",
    ],
    stack: ["Python", "Neo4j", "Streamlit", "typesafe-sdk", "neo4j-viz"],
    links: {
      repo: "https://github.com/jexp/neo4jev",
      docs: "https://github.com/jexp/neo4jev#architecture-overview",
      post: "https://x.com/jexp/status/2100478725393686556",
    },
    pricingNote:
      "Open source demo; live hops bill TypeSafe per system_one call. Public Neo4j Labs endpoint is free to try with documented credentials.",
    firstSeen: "2026-09-17",
    relatedSlugs: ["classifier-dev", "mfm-jev-search", "realzachi-pg-jev", "vercel-eve"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does it work without TypeSafe credentials?",
        answer:
          "Code runs, but README states live system_one calls need TYPESAFE_API_KEY. Without it you see explicit stand-in answers, not fake model output.",
      },
      {
        question: "Which graph does the default demo use?",
        answer:
          "Public Neo4j Labs companies2 database per README, with schema-agnostic code for other URIs via .env.",
      },
      {
        question: "Why log probabilities for beam search?",
        answer:
          "README cites sum of log-probs to reduce float underflow and length bias when comparing multi-hop paths.",
      },
    ],
    metaTitle: "neo4jev: Jev Choice beam search on Neo4j graphs",
    metaDescription:
      "jexp neo4jev navigates Neo4j one hop at a time with system_one Choice and Noul, beam search, Streamlit UI, and notebooks.",
  },

  "chetaslua-jevmeter": {
    slug: "chetaslua-jevmeter",
    status: "published",
    problem:
      "Long talking-head videos hide evasive lines in volume; viewers need sentence-level BS signals, not a vibe check after forty minutes.",
    targetUser:
      "Creators, researchers, and terminal-friendly editors who want open-source overlays that score every sentence with Jev and export a postable clip.",
    overview:
      "jevmeter (github.com/ChetasLua/jevmeter) is chetaslua's Python CLI. Whisper timestamps sentences, then parallel Jev Noul probes (per preset questions on evasion, spin, hot takes, or hype) score each line. Pillow draws 1920x1080 frames into ffmpeg for a 16:9 jevmeter.mp4 beside your source. Presets cover debates, earnings calls, podcasts, and launch hype. README badges quote about five cents for a full debate render on the battle demo thread and held-out preset accuracy claims in eval/RESULTS.md.",
    creator: {
      name: "chetaslua",
      handle: "chetaslua",
      xUrl: "https://x.com/chetaslua/status/2100602714204049588",
      githubUrl: "https://github.com/ChetasLua",
    },
    creatorQuote: {
      text:
        "Every sentence scored. Every dodge flagged. Rendered as a 16:9 edit you can post.",
      attributedTo: "chetaslua",
      sourceUrl: "https://github.com/ChetasLua/jevmeter",
    },
    jevUsage: {
      flowRole: "Per-sentence BS and spin scoring with parallel Noul probes after Whisper segmentation",
      primitives: ["Noul", "Score"],
      stateIn:
        "Sentence text, speaker context, preset rubric questions, and prior lines per README pipeline (Whisper word alignment optional with transcript file).",
      decisionOut:
        "Calibrated per-sentence scores driving on-screen meters and highlight edits in the rendered video.",
      flowSteps: [
        "Transcribe with Whisper timestamps (optional transcript alignment)",
        "Fire parallel POST /v1/systemone Noul questions per sentence and preset",
        "Aggregate scores for highlight or full-length edit modes",
        "Render 1920x1080 frames via Pillow into ffmpeg output",
      ],
      sourcedMetrics: [
        {
          claim:
            "README badge cites about five cents for a full debate render (battle demo post).",
          source: "github.com/ChetasLua/jevmeter README and x.com/chetaslua/status/2100473581251748216",
        },
        {
          claim:
            "Public GitHub repo ChetasLua/jevmeter had about eighty one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jevmeter is a batch media pipeline, not a chat wrapper. Whisper handles audio; Jev handles judgment. Each sentence triggers structured Noul questions drawn from the preset (evasive, dodged the question, hype, and similar flags in the wizard copy). README documents parallel Jev threads and render workers so long videos stay practical. The open-source BS meter clip on X shows the overlay in motion; this directory embeds that remote video in the showcase (referrerPolicy no-referrer so twimg playback works in Chromium). API keys live in user settings per install.sh, not in the repo. Mention the optional battle post only as cost context; the featured embed follows the open-source launch post.",
    keyFeatures: [
      "Terminal wizard for presets, speakers, and highlight vs full render",
      "Whisper transcription plus parallel Jev scoring",
      "16:9 ffmpeg output ready to post",
      "Featured showcase clip with remote X video",
    ],
    stack: ["Python", "Whisper", "ffmpeg", "Pillow", "TypeSafe System One"],
    links: {
      repo: "https://github.com/ChetasLua/jevmeter",
      docs: "https://github.com/ChetasLua/jevmeter#-new-here-3-steps-no-coding",
      post: "https://x.com/chetaslua/status/2100602714204049588",
    },
    pricingNote:
      "Open source; TypeSafe spend scales with sentence count and --threads. README cites micro-dollar debate totals for the sample battle.",
    firstSeen: "2026-09-17",
    demoIds: ["jevmeter-chetaslua"],
    relatedSlugs: [
      "kraayenjon-ai-slop-detector",
      "robj3d3-superx-post-scoring",
      "nutlope-1kpapers",
      "virlo-ai",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Which primitive scores each sentence?",
        answer:
          "README pipeline uses Noul questions per preset flag via systemone, with parallel requests per sentence.",
      },
      {
        question: "Do I need to commit videos to GitHub?",
        answer:
          "No. Run the CLI locally; this directory only hotlinks the X/Twitter mp4 for the showcase player.",
      },
      {
        question: "What does the five cent badge mean?",
        answer:
          "It comes from the jevmeter README battle demo badge referencing the full debate render. Your cost scales with length, preset, and thread settings.",
      },
    ],
    metaTitle: "jevmeter: Jev BS meter overlays for any video",
    metaDescription:
      "chetaslua jevmeter transcribes with Whisper, scores sentences via parallel Jev Noul probes, and renders 16:9 edits. Repo plus showcase clip.",
  },

  "theoleecj-semif": {
    slug: "theoleecj-semif",
    status: "published",
    problem:
      "Teams want System One shaped APIs and calibrated option probabilities without routing every gate through a closed hosted model.",
    targetUser:
      "Researchers and hackers self-hosting open weights who need Choice, Score, and Noul style batches on hardware they control.",
    overview:
      "SemIf (github.com/TheoLeeCJ/SemIf, openjev.com) is Theo Lee CJ's independent decision server formerly marketed as OpenJev on the site. It reads shared state once, asks many typed questions, and returns option probabilities from open models in a single forward pass. The project explicitly disclaims affiliation with TypeSafe: same interface ideas, different weights and training. WebGPU browser demos and PyTorch/MPS paths ship in-repo for replayable evidence.",
    creator: {
      name: "Theo Lee CJ",
      handle: "TheoLeeCJ",
      githubUrl: "https://github.com/TheoLeeCJ",
      companyUrl: "https://openjev.com",
    },
    jevUsage: {
      flowRole: "Self-hosted System One compatible decision server over open model logits",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Shared text or structured state plus runtime-defined question schemas (criteria maps, rubric scores, boolean nouls) documented in SemIf harnesses.",
      decisionOut:
        "Per-question probability vectors read directly from logits without generating answer prose or JSON repair loops.",
      flowSteps: [
        "Pack state and typed questions into one model forward pass",
        "Read option logits for each Choice, Score, or Noul head",
        "Return calibrated-style scores (operators should run local calibration per README)",
        "Downstream code thresholds probabilities like any System One client",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo TheoLeeCJ/SemIf had about three thousand eight hundred forty four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
        {
          claim:
            "README positions SemIf as reproducing the interface pattern, not TypeSafe's undisclosed model or training.",
          source: "github.com/TheoLeeCJ/SemIf README",
        },
      ],
    },
    howJevIsUsed:
      "SemIf is the open alternative when you want semantic ifs without TypeSafe inference bills. Agent code still writes thresholds; the server answers which branch wins, how risky a state feels, or whether evidence supports a claim. Because probabilities come from logits, you skip the usual chat completion detour. Treat scores as research baselines: README adds temperature calibration work and warns that home GPU numbers are not production SLAs. Pair SemIf with hosted classifier.dev when you want a managed fast tier beside your own hardware experiments.",
    keyFeatures: [
      "openjev.com browser demos plus local PyTorch and MPS scoring",
      "Independent disclaimer and renamed SemIf branding in README",
      "Batch many Choice, Score, and Noul questions on one state",
      "Community bridges for additional open weight families",
    ],
    stack: ["Python", "PyTorch", "WebGPU demo", "Open weights", "Self-hosted inference"],
    links: {
      website: "https://openjev.com",
      repo: "https://github.com/TheoLeeCJ/SemIf",
      docs: "https://github.com/TheoLeeCJ/SemIf#semif-formerly-openjev",
      demo: "https://openjev.com",
    },
    pricingNote:
      "Open source software; you pay for GPUs, electricity, and any cloud you rent. Not a TypeSafe substitute for compliance-sensitive hosted gates.",
    firstSeen: "2026-09-17",
    relatedSlugs: [
      "classifier-dev",
      "vinnylarouge-jevlike",
      "browser-use-jev-ultrafast",
      "openrouter-typesafe-jev-1-13",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is SemIf the same as TypeSafe Jev?",
        answer:
          "No. README states SemIf is independent research that mimics the API shape with open models, not TypeSafe's closed service.",
      },
      {
        question: "Can I trust the default probabilities out of the box?",
        answer:
          "README documents calibration passes and workload-specific temperature tuning. Run the bundled eval harnesses on your hardware before hard gates.",
      },
      {
        question: "Where did the OpenJev name go?",
        answer:
          "The project rebranded to SemIf while keeping openjev.com as the demo home. This listing uses catalog slug theoleecj-semif.",
      },
    ],
    metaTitle: "SemIf: self-hosted System One style decisions on open models",
    metaDescription:
      "TheoLeeCJ SemIf (openjev.com) batches Choice, Score, and Noul from open weights in one pass. Independent of TypeSafe; GitHub repo and browser demos.",
  },

  "featherless-simple-jev": {
    slug: "featherless-simple-jev",
    status: "published",
    problem:
      "Teams want Jev-shaped classifier HTTP without training a separate head or parsing model-generated JSON blobs.",
    targetUser:
      "ML engineers standardizing on Hugging Face weights who need a /v1/classifier surface for agents and eval scripts.",
    overview:
      "Simple Jev (github.com/featherless-ai/simple-jev) from Featherless AI turns compatible open models into structured decision endpoints. Clients send shared state plus typed questions; the server reads next-token logits and assembles JSON for Choice, Score, and Noul answers. The model never free-writes JSON. A public demo API at simple-jev-demo-api.featherless.ai allows two requests per second with a two thousand token context cap and no API key; production paths run on Featherless plans or your own HF server from the repo.",
    creator: {
      name: "Featherless AI",
      handle: "featherless-ai",
      githubUrl: "https://github.com/featherless-ai",
      company: "Featherless AI",
      companyUrl: "https://featherless.ai",
    },
    jevUsage: {
      flowRole: "Hosted or self-hosted classifier API built from HF model logits",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Shared context string plus questions map with type choice, score, or noul criteria per OpenAPI examples in the repo.",
      decisionOut:
        "Structured JSON response with probabilities per option; assembled server-side from logits.",
      flowSteps: [
        "Validate request against shared common/ schemas",
        "Run one forward pass over state and question prompts",
        "Score each criterion token from logits",
        "Return versioned JSON without decoding a completion",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo featherless-ai/simple-jev had about four hundred eighty four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
        {
          claim:
            "Demo API documents 2k token context and 2 RPS limits without authentication.",
          source: "github.com/featherless-ai/simple-jev README",
        },
      ],
    },
    howJevIsUsed:
      "Simple Jev is the bring-your-own-weights cousin of hosted classifier.dev. Agents keep the same mental model: pack state once, fan out questions, threshold probabilities in code. Featherless hosts a playground and demo API so you can curl a Gemma classifier ID before you sync weights locally. The common/ Python package holds validation and scoring rules so alternate inference backends can share behavior. Mention OpenRouter or TypeSafe hosted routes only when you compare latency; this repo is for open HF pipelines.",
    keyFeatures: [
      "POST /v1/classifier compatible HTTP surface",
      "Public no-login demo API with documented rate limits",
      "Playground and docs at simple-jev.featherless.ai",
      "Self-host path with Hugging Face Transformers server",
    ],
    stack: [
      "Python",
      "PyTorch",
      "Hugging Face Transformers",
      "Featherless inference",
    ],
    links: {
      website: "https://simple-jev.featherless.ai",
      repo: "https://github.com/featherless-ai/simple-jev",
      docs: "https://simple-jev.featherless.ai",
      demo: "https://simple-jev-demo-api.featherless.ai/v1/classifier",
    },
    pricingNote:
      "Demo tier is free with tight limits; Featherless paid plans raise caps per featherless.ai pricing.",
    firstSeen: "2026-09-22",
    relatedSlugs: [
      "classifier-dev",
      "tanstack-ai-decide",
      "openrouter-typesafe-jev-1-13",
      "vinnylarouge-jevlike",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does the model emit JSON?",
        answer:
          "No. README states the server constructs JSON from logits; the model does not complete a JSON string.",
      },
      {
        question: "Which models work?",
        answer:
          "GET /v1/models on the demo API lists served classifier IDs such as featherless-ai/gemma-4-26B-A4B-classifier; self-host docs cover adding weights.",
      },
      {
        question: "Is this TypeSafe hosted Jev?",
        answer:
          "No. Simple Jev runs open models on Featherless or your hardware. Use classifier.dev or TypeSafe keys when you want the closed jev model.",
      },
    ],
    metaTitle: "Simple Jev: HF models as Choice and Score classifier APIs",
    metaDescription:
      "Featherless Simple Jev serves /v1/classifier from open weights with logits-built JSON. Demo API, playground, and GitHub server.",
  },

  "awlevin-typesafe-computer-use": {
    slug: "awlevin-typesafe-computer-use",
    status: "published",
    problem:
      "Screenshot-first computer use agents burn dollars and seconds on steps that are really one click from a short list.",
    targetUser:
      "macOS builders who want a dry-run friendly clicker with TypeSafe Jev routing and a small writer only when typing matters.",
    overview:
      "typesafe-computer-use (github.com/awlevin/typesafe-computer-use) is Aaron Levin's Python clicker for real desktop automation. OCR and accessibility APIs turn the screen into numbered actions; each step sends one TypeSafe Jev Choice for operation and target; TYPE_TEXT, URL proposals, and final answers delegate to a compact writer model. Default runs are dry-run; pass --act to drive mouse and keyboard. README comparison tables claim about 155x lower per-step cost and 14x to 40x faster model latency versus Claude Opus 5 on a bare screenshot for the same decision (author measured; rerun locally).",
    creator: {
      name: "Aaron Levin",
      handle: "awlevin",
      xUrl: "https://x.com/awlevin/status/2100262612428894676",
      githubUrl: "https://github.com/awlevin",
    },
    creatorQuote: {
      text:
        "Most steps do not need a plan. They need one choice from a short list, made quickly and cheaply, with a confidence number you can gate on.",
      attributedTo: "Aaron Levin",
      sourceUrl: "https://github.com/awlevin/typesafe-computer-use",
    },
    jevUsage: {
      flowRole: "Per-step macOS computer-use Choice over OCR and accessibility action lists",
      primitives: ["Choice", "Score"],
      stateIn:
        "Structured screen capture: element indices, roles, text, and deterministic date parsing helpers described in README (not raw pixels for the classifier path).",
      decisionOut:
        "Next operation and target index with calibrated confidence; writer model only on TYPE_TEXT or answer paths.",
      flowSteps: [
        "Capture screen via accessibility plus OCR into finite actions",
        "One Jev Choice selects operation and compatible target",
        "Execute click, scroll, or navigation directly when safe",
        "Invoke writer model for free-text fields or final natural-language answers",
      ],
      sourcedMetrics: [
        {
          claim:
            "README table cites about $0.0002 per decision versus about $0.032 for Opus 5 on the same screenshot step.",
          source: "github.com/awlevin/typesafe-computer-use README",
        },
        {
          claim:
            "README cites 0.13 to 0.38 s model latency versus 5.2 s for Opus 5 on the measured step.",
          source: "github.com/awlevin/typesafe-computer-use README",
        },
        {
          claim:
            "Public GitHub repo awlevin/typesafe-computer-use had about eight hundred twenty eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Aaron's loop is the anti-screenshot pattern: deterministic parsers build state, Jev picks among finite UI actions, and only the exceptions touch a chat model. That is why related browser-use listings feel slower by comparison: they still ship pixels to frontier models every step. Dry-run mode lets you watch decisions without touching the cursor; --act is explicitly beta because real mice are scary. The showcase clip on X walks through TechCrunch ticket checkout style goals; embed uses remote twimg with referrerPolicy no-referrer like other directory videos. Do not confuse this repo with Milind's CoreML madewithjev computer-use build; this listing tracks awlevin's GitHub and Aaron's post only.",
    keyFeatures: [
      "clicker CLI with dry-run default and --act for live control",
      "TypeSafe Jev every step; Anthropic writer optional for text",
      "Documented cost and latency tables versus Opus screenshot baseline",
      "macOS first with experimental Windows notes in README",
    ],
    stack: [
      "Python",
      "macOS accessibility",
      "OCR",
      "TypeSafe Jev",
      "Anthropic writer models",
    ],
    links: {
      repo: "https://github.com/awlevin/typesafe-computer-use",
      docs: "https://github.com/awlevin/typesafe-computer-use#why",
      post: "https://x.com/awlevin/status/2100262612428894676",
    },
    pricingNote:
      "Open source; TypeSafe per-step fees plus optional writer model usage per README measurements.",
    firstSeen: "2026-09-17",
    demoIds: ["typesafe-computer-use-awlevin"],
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "lahfir-agent-desktop",
      "classifier-dev",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Jev see screenshots?",
        answer:
          "The classifier path uses structured OCR and accessibility state per README. Writer models may use vision for final answers when enabled.",
      },
      {
        question: "Is --act safe on day one?",
        answer:
          "README warns the tool is beta and drives your real mouse. Start with dry runs until thresholds look sane.",
      },
      {
        question: "Where are the speedup numbers from?",
        answer:
          "They come from Aaron's README comparison table on the same goal and screenshot. Reproduce with the documented harness before quoting in prod decks.",
      },
    ],
    metaTitle: "typesafe-computer-use: macOS Jev clicker without screenshot tax",
    metaDescription:
      "awlevin typesafe-computer-use uses TypeSafe Jev Choices on OCR action lists, dry-run clicker, author cost tables, and X demo clip.",
  },

  "moritzkremb-jev-voice-browser": {
    slug: "moritzkremb-jev-voice-browser",
    status: "published",
    problem:
      "Voice UIs either hallucinate actions in an LLM monologue or lag so badly that you finish the sentence before anything happens.",
    targetUser:
      "Hackers experimenting with headed Chromium plus Web Speech who want batched Jev gates on every partial transcript.",
    overview:
      "jev-voice-browser (github.com/moritzkremb/jev-voice-browser) wires Playwright, a localhost control page, and TypeSafe Jev into a voice-driven browser. Partial transcripts debounce every two hundred milliseconds; the server snapshots up to one hundred elements, then asks nine to eleven typed questions in one System One call returning in about two hundred fifty to three hundred fifty milliseconds. Policy code decides act, wait, ask, or ignore. Search queries, typed text, and URLs are candidate spans chosen by Choice and copied verbatim; Jev never generates natural language.",
    creator: {
      name: "Moritz Kremb",
      handle: "moritzkremb",
      githubUrl: "https://github.com/moritzkremb",
    },
    jevUsage: {
      flowRole: "Voice debounce loop with batched intent, target, safety, and scroll Score questions",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Partial transcript text plus numbered DOM snapshot (roles, names, indices) and lightweight session context from constants.js.",
      decisionOut:
        "Intent operation, element target, site routing, command completeness, addressee checks, destructive flags, and scroll amount probabilities consumed by policy thresholds.",
      flowSteps: [
        "Web Speech streams partials over websocket to Node server",
        "Debounce and snapshot controlled Chromium window",
        "Single Jev request with parallel questions (intent, target, safety, scroll)",
        "Playwright executes clicks, navigation, or scroll; destructive paths require spoken confirm",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cites about $0.0002 per real API call and two hundred fifty to three hundred fifty ms Jev latency per debounced transcript.",
          source: "github.com/moritzkremb/jev-voice-browser README",
        },
        {
          claim:
            "Public GitHub repo moritzkremb/jev-voice-browser had about two hundred forty four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Voice browsers fail when you treat speech as chat completion. Moritz batches a dozen binary and Choice questions so one forward pass answers whether you meant the browser, which numbered overlay to click, and whether scroll should be a little or a lot. Ignored chit-chat stays near zero is_command probability per README table. Destructive clicks raise a confirm toast instead of trusting a single threshold. The API key never reaches the browser control page; only the Node process calls TypeSafe. No public X video was available when this batch shipped, so the product page stands on README architecture and the madewithjev build write-up linked from catalog.",
    keyFeatures: [
      "Headed Chromium with live probability bars on control UI",
      "Batched Jev questions per partial transcript",
      "Destructive action confirm flow",
      "Text command fallback when microphone unavailable",
    ],
    stack: [
      "Node.js",
      "Playwright",
      "Web Speech API",
      "TypeSafe Jev jev-1.13.0",
    ],
    links: {
      repo: "https://github.com/moritzkremb/jev-voice-browser",
      docs: "https://github.com/moritzkremb/jev-voice-browser#run-it",
      demo: "https://madewithjev.com/builds/jev-voice-browser",
    },
    pricingNote:
      "Open source; README estimates fractions of a cent per Jev call with your TypeSafe key.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "lahfir-agent-desktop",
      "awlevin-typesafe-computer-use",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev write search queries?",
        answer:
          "No. README states code extracts candidate spans and Jev picks one verbatim via Choice.",
      },
      {
        question: "Which browser supplies the microphone?",
        answer:
          "You open the control page in Chrome or Edge; Web Speech is unavailable in Firefox or Safari per README.",
      },
      {
        question: "Can I attach to my own Chrome?",
        answer:
          "Yes. ./run.sh --cdp http://127.0.0.1:9222 attaches to an existing debugging port.",
      },
    ],
    metaTitle: "jev-voice-browser: batched Jev for voice-driven Playwright",
    metaDescription:
      "moritzkremb jev-voice-browser debounces speech into one TypeSafe call for intent, targets, and safety before Playwright acts. GitHub README and build page.",
  },

  "romanslack-jev-drone": {
    slug: "romanslack-jev-drone",
    status: "published",
    problem:
      "Pure geometric planners stall on maneuvers like climbing when gaps do not exist, yet vision models are too slow and opaque for 500 Hz control.",
    targetUser:
      "Robotics curious developers evaluating advisory Jev loops on top of classical sim controllers.",
    overview:
      "jev-drone (github.com/RomanSlack/jev-drone) simulates a camera-only quadrotor in MuJoCo. Classical CV at fifteen hertz builds symbolic range sectors, obstacle height, and target bearing; TypeSafe Jev at about two and a half hertz advises maneuver Choice (hold_course, gap_left, gap_right, climb, brake, reacquire), risk Score, and target_truly_lost Noul when the scene fingerprint changes. A five hundred hertz geometric controller and fifty hertz safety reflex always own the sticks; code vetoes unsafe climbs. README ablation reports the no-Jev baseline never passes station two while Jev engaged clears the full course in the author's single documented run.",
    creator: {
      name: "Roman Slack",
      handle: "RomanSlack",
      githubUrl: "https://github.com/RomanSlack",
    },
    jevUsage: {
      flowRole: "Low-rate tactical advisor over symbolic perception, not pixel input",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Compact JSON scene: forward range sectors, obstruction height, top-edge visibility, target bearing, and fingerprint hash from depth plus segmentation buffers.",
      decisionOut:
        "maneuver Choice, risk Score, and target_truly_lost Noul probabilities consumed by guidance with hard reflex overrides.",
      flowSteps: [
        "Eye pipeline segments depth at fifteen hertz without ground truth cheats",
        "Fingerprint unchanged scenes reuse last Jev judgment",
        "Batch three questions in one Jev call when tactical context shifts",
        "Guidance merges Jev advice with geometric controller and reflex vetoes",
      ],
      sourcedMetrics: [
        {
          claim:
            "README ablation table: baseline without Jev stops near 17.7 m; Jev engaged run reaches 77.5 m full course with zero collisions in the cited run.",
          source: "github.com/RomanSlack/jev-drone README",
        },
        {
          claim:
            "Typical sixty five second flight issues about one hundred ten Jev calls at 0.11 s median latency per README.",
          source: "github.com/RomanSlack/jev-drone README",
        },
        {
          claim:
            "Public GitHub repo RomanSlack/jev-drone had about one hundred thirty one stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Roman's drone is the clean split brain story: perception and control stay in code you can unit test; Jev only answers small meaning questions when the symbolic scene changes. Without climb in the action vocabulary the greedy baseline dies at the low beam; Jev supplies the maneuver label while reflexes prevent suicide climbs. README is candid that early arenas showed no advantage and that the published Jev column is a single run, not a seed average. Try the Vercel demo for visuals; there is no hosted X clip in this batch, so the thick page leans on README figures and the interactive site.",
    keyFeatures: [
      "MuJoCo Skydio-style airframe with five station course",
      "Advisory Jev at ~2.5 Hz with fingerprint caching",
      "500 Hz controller plus 50 Hz safety reflex overrides",
      "Web demo at jev-drone.vercel.app",
    ],
    stack: [
      "Python",
      "MuJoCo",
      "Classical CV",
      "TypeSafe Jev",
      "Vercel demo frontend",
    ],
    links: {
      repo: "https://github.com/RomanSlack/jev-drone",
      docs: "https://github.com/RomanSlack/jev-drone#the-idea",
      demo: "https://jev-drone.vercel.app",
    },
    pricingNote:
      "Open source sim; live Jev calls need your TypeSafe API key during runs.",
    firstSeen: "2026-09-17",
    relatedSlugs: [
      "fhshaik-typesafe-mario",
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev see camera pixels?",
        answer:
          "No. README states Jev reads JSON scene summaries built by classical CV, not raw images.",
      },
      {
        question: "Can Jev override safety reflexes?",
        answer:
          "No. Fifty hertz reflexes and geometric control veto unsafe maneuvers even if Jev proposes climb.",
      },
      {
        question: "Are the ablation numbers averaged?",
        answer:
          "README warns the Jev column is one sixty five second run and earlier arenas showed variance. Treat claims as structural, not leaderboard guarantees.",
      },
    ],
    metaTitle: "jev-drone: advisory Jev on MuJoCo quadrotor sim",
    metaDescription:
      "RomanSlack jev-drone uses TypeSafe Jev for maneuver Choice at 2.5 Hz over symbolic CV, with README ablation and jev-drone.vercel.app demo.",
  },

  "superagents-lab-jev-search": {
    slug: "superagents-lab-jev-search",
    status: "published",
    problem:
      "Agent search demos either hallucinate answers or ship a single hard-coded Google query. Builders want ranked evidence with explicit source planning.",
    targetUser:
      "Engineers self-hosting Cloudflare Workers search who want Jev to plan queries and score hits without a chat summarizer on top.",
    overview:
      "jev-search (github.com/superagents-lab/jev-search) is an MIT TypeScript worker that accepts plain-language questions, lets Jev choose providers, time ranges, and keyword variants, calls Search1API for raw results, then Jev Scores relevance before returning links and snippets only. Try the hosted UI at jev.s1.dev or deploy the worker with your keys.",
    creator: {
      name: "Superagents Lab",
      handle: "superagents-lab",
      githubUrl: "https://github.com/superagents-lab",
      company: "Superagents Lab",
      companyUrl: "https://github.com/superagents-lab",
    },
    jevUsage: {
      flowRole: "Query planning and per-hit relevance ranking over Search1API results",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "User question text, configured provider list, and candidate search parameters (sources, recency windows, query variants).",
      decisionOut:
        "Planned fetch plan (which sources and terms to run) plus per-result relevance scores that gate what surfaces in the UI.",
      flowSteps: [
        "User submits natural language query at jev.s1.dev or the worker API",
        "Jev Choice selects sources, time filters, and query reformulations",
        "Search1API returns raw hits without generated prose",
        "Jev Score ranks snippets; UI shows links and excerpts only",
      ],
      sourcedMetrics: [
        {
          claim:
            "Public GitHub repo superagents-lab/jev-search had about four hundred twenty seven stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "jev-search treats Jev as a planner and reranker, not an answer bot. The worker keeps HTTP boundaries crisp: one planning pass decides how to spend Search1API quota, then structured scoring trims noise before anything renders. That matches the directory pattern of typed gates instead of free-form chat. There is no public X launch clip tied to this repo in this batch, so the thick page leans on README architecture and the live demo. If you need channel-scoped search with caption jumps, compare the My First Million demo listing; jev-search is general web retrieval.",
    keyFeatures: [
      "MIT Cloudflare Workers deployment path",
      "Search1API integration with BYOK configuration",
      "No generated answer layer in the default UX",
      "Hosted demo at jev.s1.dev",
    ],
    stack: [
      "TypeScript",
      "Cloudflare Workers",
      "Search1API",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/superagents-lab/jev-search",
      docs: "https://github.com/superagents-lab/jev-search#readme",
      demo: "https://jev.s1.dev",
    },
    pricingNote:
      "Open source worker; Search1API and TypeSafe usage bill to your keys on self-hosted runs.",
    firstSeen: "2026-09-18",
    relatedSlugs: [
      "mfm-jev-search",
      "classifier-dev",
      "tanstack-ai-decide",
      "vercel-eve",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does jev-search write summaries?",
        answer:
          "The product positioning is links plus snippets ranked by Jev. It is not a chat completion wrapper over search results.",
      },
      {
        question: "Can I self-host?",
        answer:
          "Yes. README documents Cloudflare Workers deployment with your Search1API and TypeSafe credentials.",
      },
      {
        question: "How is this different from the My First Million demo?",
        answer:
          "mfm-jev-search scopes retrieval to one YouTube catalog with hybrid recall. jev-search targets general web search planning via Search1API.",
      },
    ],
    metaTitle: "jev-search: Jev-planned web search on Cloudflare Workers",
    metaDescription:
      "superagents-lab jev-search uses TypeSafe Jev to plan Search1API queries and score snippets without generated answers. MIT repo and jev.s1.dev demo.",
  },

  "nailthy62-drape-virtual-try-on": {
    slug: "nailthy62-drape-virtual-try-on",
    status: "published",
    problem:
      "Fashion try-on demos choke when every outfit change needs a slow generative rerender instead of a fast discrete closet pick.",
    targetUser:
      "Creators experimenting with realtime wardrobe UX for Drape and similar virtual try-on products.",
    overview:
      "Nailthy Tang's Drape experiment streams your voice, tracks what you are wearing, and lets Jev pick the next garment from a finite closet list so the preview updates live on camera. She cites about $0.0011 per decision and about 620 ms per swap on X. Product home is weardrape.app; the madewithjev build page documents the loop.",
    creator: {
      name: "Nailthy Tang",
      handle: "nailthy62",
      xUrl: "https://x.com/nailthy62",
      company: "Drape",
      companyUrl: "https://weardrape.app",
    },
    jevUsage: {
      flowRole: "Realtime wardrobe Choice from transcript plus current outfit state",
      primitives: ["Choice", "Score"],
      stateIn:
        "Live speech transcript, detected or labeled current outfit pieces, and enumerated closet SKUs the renderer can swap.",
      decisionOut:
        "Next garment Choice (and supporting relevance scores) consumed by the try-on pipeline without free-form styling prose.",
      flowSteps: [
        "User talks through preferences while the camera feed runs",
        "ASR transcript and outfit tags land in structured state",
        "Jev Choice selects the next closet item that matches the request",
        "Renderer swaps the outfit on the live preview",
      ],
      sourcedMetrics: [
        {
          claim:
            "Author post cites about $0.0011 per decision and about 620 ms per decision on the public X clip.",
          source: "x.com/nailthy62/status/2101388186916454439",
        },
      ],
    },
    howJevIsUsed:
      "This is a closet-picker loop, not open-ended image generation every frame. Speech becomes text; the current look is already structured; Jev only answers which SKU comes next from a list the renderer understands. That keeps latency in the sub-second band Nailthy quoted on X. The directory embeds her launch video via remote twimg with referrerPolicy no-referrer like other showcase cards. Treat the experiment as a product pattern for Drape rather than a standalone open repo in this listing.",
    keyFeatures: [
      "Voice-driven outfit changes on a live feed",
      "Finite closet Choice instead of unbounded generative edits",
      "Author cost and latency figures on the X post",
      "Linked from madewithjev.com/builds/drape-virtual-try-on",
    ],
    stack: [
      "TypeSafe Jev",
      "Speech to text",
      "Realtime try-on renderer",
      "Drape product stack",
    ],
    links: {
      website: "https://weardrape.app",
      post: "https://x.com/nailthy62/status/2101388186916454439",
      demo: "https://madewithjev.com/builds/drape-virtual-try-on",
    },
    pricingNote:
      "Experiment metrics from the author post; production Drape pricing lives on weardrape.app.",
    firstSeen: "2026-09-19",
    demoIds: ["drape-virtual-try-on-nailthy62"],
    relatedSlugs: ["ploy-ai", "hypit-ai", "stealads-ai"],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Is there a public GitHub repo for this clip?",
        answer:
          "This listing tracks the Drape experiment and X proof. Follow weardrape.app for the product; no separate repo slug is claimed here.",
      },
      {
        question: "Does Jev generate new clothing pixels?",
        answer:
          "The described loop picks among existing closet items the renderer can swap, keeping decisions typed and fast.",
      },
      {
        question: "Where do the cost numbers come from?",
        answer:
          "They are author-reported on the X post embedded in the showcase. Re-measure on your own stack before quoting in decks.",
      },
    ],
    metaTitle: "Drape virtual try-on: Jev closet picks in realtime",
    metaDescription:
      "Nailthy Tang Drape experiment uses TypeSafe Jev to read speech and current outfit state, then Choice-pick the next look in about 620 ms. X demo clip.",
  },

  "trungdq88-youtube-sponsor-detection": {
    slug: "trungdq88-youtube-sponsor-detection",
    status: "published",
    problem:
      "Sponsor segments waste viewer time and simple keyword skips miss nuanced transitions or fire on the wrong cue.",
    targetUser:
      "Chrome users who want a BYOK extension that listens for sponsor pivots and jumps the playhead without a cloud DVR service.",
    overview:
      "youtube-sponsor-detection (github.com/trungdq88/youtube-sponsor-detection) is Tony Dinh's open JavaScript extension. Optional live audio and captions feed Jev a sponsor-segment classification; when confidence crosses threshold the player skips forward. The author cites about $0.005 per video on X. MIT repo plus madewithjev build notes.",
    creator: {
      name: "Tony Dinh",
      handle: "tdinh_me",
      xUrl: "https://x.com/tdinh_me",
      githubUrl: "https://github.com/trungdq88",
    },
    jevUsage: {
      flowRole: "Realtime sponsor segment detection gate on streaming transcript or audio cues",
      primitives: ["Noul", "Score"],
      stateIn:
        "Rolling transcript or audio-derived text from the active YouTube tab plus lightweight player state.",
      decisionOut:
        "Sponsor-segment probability that triggers an automatic skip command when above threshold.",
      flowSteps: [
        "Extension attaches to the YouTube player with user consent",
        "Audio or captions stream into chunked text state",
        "Jev evaluates sponsor-segment questions on a timer",
        "Player seeks past the segment when the gate fires",
      ],
      sourcedMetrics: [
        {
          claim:
            "Author post cites about $0.005 per video for the prototype with BYOK.",
          source: "x.com/tdinh_me/status/2100793777103466615",
        },
        {
          claim:
            "Public GitHub repo trungdq88/youtube-sponsor-detection had about ninety four stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Tony's extension is a listening loop, not a batch summarizer. Chunks of transcript arrive while you watch; Jev answers a tight sponsor question instead of rewriting the video. That keeps cost in the fractional cent band he quoted. Skips are client-side player commands, so latency depends on how often you poll and how aggressive thresholds are. The showcase clip on X shows the behavior; embed uses remote twimg like other directory videos. Prototype status means expect rough edges before you ship it to non-technical friends.",
    keyFeatures: [
      "Chrome extension with optional live audio path",
      "BYOK TypeSafe configuration",
      "Automatic playhead skip on sponsor detection",
      "Open source MIT JavaScript",
    ],
    stack: [
      "JavaScript",
      "Chrome extension APIs",
      "YouTube player hooks",
      "TypeSafe Jev",
    ],
    links: {
      repo: "https://github.com/trungdq88/youtube-sponsor-detection",
      docs: "https://github.com/trungdq88/youtube-sponsor-detection#readme",
      post: "https://x.com/tdinh_me/status/2100793777103466615",
      demo: "https://madewithjev.com/builds/youtube-sponsor-skipper",
    },
    pricingNote:
      "BYOK; author cites about half a cent per video on the launch post.",
    firstSeen: "2026-09-17",
    demoIds: ["youtube-sponsor-skipper-tdinh"],
    relatedSlugs: [
      "kraayenjon-ai-slop-detector",
      "classifier-dev",
      "moritzkremb-jev-voice-browser",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does it upload audio to a custom backend?",
        answer:
          "The prototype is BYOK to TypeSafe per repo and author post. Read the extension permissions before installing.",
      },
      {
        question: "Will it skip non-sponsor CTAs?",
        answer:
          "Threshold tuning matters. Treat detections as probabilistic gates, not legal sponsorship disclosures.",
      },
      {
        question: "Is this an official YouTube feature?",
        answer:
          "No. It is a third-party open source experiment from Tony Dinh, unrelated to Google.",
      },
    ],
    metaTitle: "YouTube sponsor skipper: Jev detects paid segments",
    metaDescription:
      "trungdq88 youtube-sponsor-detection Chrome extension uses TypeSafe Jev on live captions or audio to skip sponsor blocks. MIT repo and X demo.",
  },

  "iannuttall-internal-links": {
    slug: "iannuttall-internal-links",
    status: "published",
    problem:
      "Internal linking audits devolve into spreadsheets no one updates, while blind LLM suggestions invent URLs that do not exist.",
    targetUser:
      "SEO-minded site owners and agent builders who want structured link recommendations for up to five hundred pages.",
    overview:
      "Ian Nuttall's free tool at ian.is/tools/internal-links crawls your site, uses Jev to classify pages and select sensible link pairs, then exports CSV or JSON for an LLM or editor to implement. Bring your own key or pay one dollar to run on Ian's TypeSafe credit. Launch clip on X walks through the export flow.",
    creator: {
      name: "Ian Nuttall",
      handle: "iannuttall",
      xUrl: "https://x.com/iannuttall",
      companyUrl: "https://ian.is",
    },
    jevUsage: {
      flowRole: "Page classification and pairwise internal link Choice across crawled URLs",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Crawl graph of up to five hundred URLs with titles, headings, and short text extracts per page.",
      decisionOut:
        "Typed labels per page plus selected source-to-target link pairs with scores suitable for CSV or JSON export.",
      flowSteps: [
        "User submits a site root and authentication options",
        "Crawler collects page text up to the five hundred page cap",
        "Jev classifies each page and scores candidate link pairs",
        "Exporter writes CSV or JSON for downstream implementation",
      ],
      sourcedMetrics: [
        {
          claim: "Tool supports up to five hundred pages per run per author post.",
          source: "x.com/iannuttall/status/2102443273339994558",
        },
        {
          claim: "Pricing is BYOK or one dollar to use Ian's key per the launch post.",
          source: "x.com/iannuttall/status/2102443273339994558",
        },
      ],
    },
    howJevIsUsed:
      "Ian keeps humans or coding agents in the loop: Jev does the judgment-heavy pairing work, but the artifact is a file you can diff, not mystery HTML injected live. Classification questions keep page types explicit so you do not link a pricing page into every blog footer by accident. The dollar tier is for folks who do not want to paste a TypeSafe key on day one. Showcase video is the X clip referenced on madewithjev.com/builds/internal-link-tool; playback uses the same remote twimg pattern as other listings.",
    keyFeatures: [
      "Up to five hundred pages per crawl",
      "CSV and JSON export for agent implementers",
      "BYOK or one dollar hosted key option",
      "Live tool at ian.is/tools/internal-links",
    ],
    stack: [
      "Web crawler",
      "TypeSafe Jev",
      "CSV and JSON exporters",
    ],
    links: {
      website: "https://ian.is/tools/internal-links",
      demo: "https://ian.is/tools/internal-links",
      post: "https://x.com/iannuttall/status/2102443273339994558",
    },
    pricingNote:
      "BYOK free path or one dollar per run on Ian's key per launch post.",
    firstSeen: "2026-09-22",
    demoIds: ["internal-links-iannuttall"],
    relatedSlugs: ["dub-co", "ploy-ai", "stealads-ai"],
    relatedLearnSlugs: ["use-cases"],
    faq: [
      {
        question: "Does the tool edit my site automatically?",
        answer:
          "No. It exports recommendations you or an LLM implement in your CMS or codebase.",
      },
      {
        question: "What happens above five hundred pages?",
        answer:
          "The author caps runs at five hundred pages per the launch materials. Split large sites or crawl sections separately.",
      },
      {
        question: "Do I need an API key?",
        answer:
          "You can bring your own TypeSafe key or pay one dollar to use Ian's for that run.",
      },
    ],
    metaTitle: "Internal links tool: Jev classifies and pairs site pages",
    metaDescription:
      "Ian Nuttall internal linking tool uses TypeSafe Jev on up to 500 crawled pages, exporting CSV or JSON link plans. BYOK or $1. X demo.",
  },

  "standardagents-jevpilot": {
    slug: "standardagents-jevpilot",
    status: "published",
    problem:
      "Driving agents that read pixels burn budget and latency, while toy sims ignore safety when models get creative near traffic.",
    targetUser:
      "Game and robotics curious developers who want a Three.js sandbox where Jev steers from symbolic path tables.",
    overview:
      "JevPilot (github.com/standardagents/jevpilot) is Justin Schroeder's browser driving game inspired by Tesla FSD visuals. Geometry, collision checks, and a hard safety brake stay in TypeScript; Jev reads compact candidate steering and speed paths, not camera frames, and answers up to about four times per second near traffic. Play at jevpilot.standardagents.ai with server-metered credit, or clone the MIT repo.",
    creator: {
      name: "Justin Schroeder",
      handle: "jpschroeder",
      xUrl: "https://x.com/jpschroeder",
      githubUrl: "https://github.com/jpschroeder",
      company: "Standard Agents",
      companyUrl: "https://standardagents.ai",
    },
    jevUsage: {
      flowRole: "High-frequency path Choice among filtered steering and speed candidates",
      primitives: ["Choice", "Score"],
      stateIn:
        "Symbolic road boundaries, nearby traffic summaries, signal state, destination bearing, and tables of eligible maneuver candidates.",
      decisionOut:
        "Selected path index consumed by the sim loop; single-candidate cases resolve locally without an API call.",
      flowSteps: [
        "Simulator samples steering and speed combinations each tick",
        "Code filters candidates that leave the road or collide",
        "Jev Choice picks among remaining paths (up to ~4 Hz near traffic)",
        "Safety brake overrides imminent collisions regardless of model output",
      ],
      sourcedMetrics: [
        {
          claim:
            "Author materials cite up to about four decisions per second near traffic and about 1.5 Hz on clear roads.",
          source: "madewithjev.com/builds/jevpilot and x.com/jpschroeder/status/2100347770867458384",
        },
        {
          claim:
            "Hosted demo meters about $0.25 of Jev credit server-side so API keys never reach the browser.",
          source: "madewithjev.com/builds/jevpilot",
        },
        {
          claim:
            "Public GitHub repo standardagents/jevpilot had about one hundred seventy nine stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Justin rebuilt the vibe of FSD as a teaching toy: the renderer is Three.js eye candy, but the agent loop is classic robotics factoring. Candidate paths are rows in a table; illegal rows never reach Jev; obvious singletons short-circuit locally. That is why the sim can breathe four decisions a second without sending pixels to a vision model. Press J to toggle autopilot in the hosted build. Credit metering on standardagents.ai keeps keys off the client, which matters when you hand the link to a classroom. The X clip is embedded here via remote twimg; README and build page carry the longer architecture narrative.",
    keyFeatures: [
      "Three.js driving sim with autopilot toggle",
      "Symbolic path tables instead of pixel inputs",
      "Code-level safety brake on imminent collisions",
      "Hosted demo with server-side credit metering",
    ],
    stack: [
      "TypeScript",
      "Three.js",
      "TypeSafe Jev",
      "Standard Agents auth for hosted demo",
    ],
    links: {
      repo: "https://github.com/standardagents/jevpilot",
      docs: "https://github.com/standardagents/jevpilot#readme",
      demo: "https://jevpilot.standardagents.ai",
      post: "https://x.com/jpschroeder/status/2100347770867458384",
    },
    pricingNote:
      "Open source repo; hosted demo includes about $0.25 metered Jev credit per build page notes.",
    firstSeen: "2026-09-16",
    demoIds: ["jevpilot-jpschroeder"],
    relatedSlugs: [
      "romanslack-jev-drone",
      "fhshaik-typesafe-mario",
      "browser-use-jev-ultrafast",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does Jev see the canvas pixels?",
        answer:
          "No. Public materials describe compact tables of candidate paths and traffic summaries, not screenshots.",
      },
      {
        question: "Can the model override the safety brake?",
        answer:
          "Imminent collision handling is coded separately from Jev outputs per the build write-up.",
      },
      {
        question: "Is this a Tesla product?",
        answer:
          "No. It is an open source homage and teaching sim from Standard Agents, unaffiliated with Tesla.",
      },
    ],
    metaTitle: "JevPilot: symbolic path Choice in a Three.js driving sim",
    metaDescription:
      "standardagents JevPilot uses TypeSafe Jev on filtered steering tables in a Three.js FSD-style game. GitHub, hosted demo, and X clip.",
  },

  "tianyucodings-nanojev": {
    slug: "tianyucodings-nanojev",
    status: "published",
    problem:
      "Researchers want System One shaped decision heads on tiny backbones without paying hosted inference or decoding answer tokens from a chat model.",
    targetUser:
      "ML engineers reproducing parallel Choice, boolean, and Score heads who need a unified checkpoint, public dataset, and replayable game harnesses.",
    overview:
      "NanoJev (github.com/TianyuCodings/NanoJev) is Tianyu Codings' 0.6B Qwen3 backbone with shared decision heads for dynamic Choice (2 to 255 candidates), boolean propositions, and ordered Score levels. Each request supplies state, question, and candidates; one forward pass returns full probability vectors with zero output-token decoding. The unified-games-v1 Hugging Face release trains Maze, Snake, ViZDoom Basic, and ViZDoom Predict Position together; README tables compare held-out success rates against TypeSafe Jev and untuned Qwen3-0.6B on the same controllers. Public side-by-side replays and ViZDoom players live on nanojev-dev.tianyuchen99.chatgpt.site; model C-Tianyu/NanoJev and dataset C-Tianyu/NanoJev-Data pin revision unified-games-v1.",
    creator: {
      name: "Tianyu Codings",
      handle: "TianyuCodings",
      githubUrl: "https://github.com/TianyuCodings",
    },
    jevUsage: {
      flowRole:
        "Parallel game and simulation decisions from a single small checkpoint with shared Choice, boolean, and Score heads",
      primitives: ["Choice", "Score", "Noul"],
      stateIn:
        "Per-step game observations encoded as text state plus runtime-defined questions and candidate action paths documented in NanoJev harnesses and dataset rows.",
      decisionOut:
        "Softmax over supplied candidates for Choice, sigmoid probability for boolean items, and weighted level distribution for Score without generating answer tokens.",
      flowSteps: [
        "Encode candidate paths through the Qwen3-0.6B backbone",
        "Apply shared decision heads for each question type in the batch",
        "Return probabilities for epsilon-greedy or argmax controllers",
        "Replay trajectories through independent simulators for evaluation",
      ],
      sourcedMetrics: [
        {
          claim:
            "README reports NanoJev 128/128 ViZDoom Basic test successes versus 56/128 for TypeSafe Jev on the matched harness.",
          source: "github.com/TianyuCodings/NanoJev README",
        },
        {
          claim:
            "Unified dataset ships 18,760 decision questions per target variant including 16,333 ViZDoom questions.",
          source: "github.com/TianyuCodings/NanoJev README",
        },
        {
          claim:
            "Public GitHub repo TianyuCodings/NanoJev had about two thousand one hundred eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "NanoJev is an open weight replica path, not a hosted classifier.dev substitute. Where SemIf targets general System One HTTP on models you pick, and Simple Jev wraps HF logits behind /v1/classifier, NanoJev trains decision heads directly on game-scale data and publishes the full pipeline plus HF weights. Agent builders can still steal the interface lesson: pack state once, ask many typed questions, threshold probabilities in code. Game demos are evidence that 0.6B parallel heads can beat untuned backbones and match or exceed published Jev scores on specific ViZDoom splits; treat leaderboard cells as research baselines until you rerun scripts locally.",
    keyFeatures: [
      "Unified-games-v1 checkpoint across four game tasks",
      "Hugging Face model and dataset with documented training mix weights",
      "Browser replays comparing NanoJev, TypeSafe Jev, and untuned Qwen",
      "End-to-end training and evaluation docs for Predict Position",
    ],
    stack: [
      "Python",
      "PyTorch",
      "Qwen3-0.6B",
      "Hugging Face Hub",
      "ViZDoom",
    ],
    links: {
      repo: "https://github.com/TianyuCodings/NanoJev",
      docs: "https://github.com/TianyuCodings/NanoJev#quick-start",
      demo: "https://nanojev-dev.tianyuchen99.chatgpt.site/?autoplay=1",
      website: "https://huggingface.co/C-Tianyu/NanoJev",
    },
    pricingNote:
      "MIT licensed open source; you pay for GPUs, Hugging Face bandwidth, and any cloud you rent for training or inference.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "theoleecj-semif",
      "featherless-simple-jev",
      "vinnylarouge-jevlike",
      "fhshaik-typesafe-mario",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Is NanoJev the same as TypeSafe Jev?",
        answer:
          "No. It is an independent 0.6B research replica with public weights and game benchmarks. TypeSafe Jev remains the closed hosted System One model.",
      },
      {
        question: "How does it differ from SemIf or Simple Jev?",
        answer:
          "SemIf serves general open models with a System One shaped server. Simple Jev builds classifier HTTP from HF logits. NanoJev fine-tunes dedicated decision heads on a unified games dataset and publishes the training recipe.",
      },
      {
        question: "Which Hugging Face revision should I download?",
        answer:
          "Use revision unified-games-v1 on C-Tianyu/NanoJev and C-Tianyu/NanoJev-Data so weights and labels match the README demos.",
      },
    ],
    metaTitle: "NanoJev: 0.6B parallel Choice and Score heads for games",
    metaDescription:
      "TianyuCodings NanoJev trains Qwen3-0.6B decision heads on Maze, Snake, and ViZDoom. HF unified-games-v1, side-by-side demos, MIT repo.",
  },

  "bespokelabsai-nimble": {
    slug: "bespokelabsai-nimble",
    status: "published",
    problem:
      "Teams want locally runnable Jev-style classifiers with published data curation and training recipes, not opaque distillation from a hosted gate.",
    targetUser:
      "Applied researchers on Apple Silicon or NVIDIA who need Choice and boolean fields from a schema with probabilities, plus scripts to reproduce Bespoke-Nimble-9B.",
    overview:
      "Nimble (github.com/bespokelabsai/nimble) from Bespoke Labs ships contrastive data curation, LoRA training on answer tokens only, and serving for Bespoke-Nimble-9B on Hugging Face. You pass text plus a schema of Choice lists or true/false fields; the model scores one answer token per question in parallel without chain-of-thought prose. README reports 90.1% agreement with reference labels on 324 held-out examples versus 66.4% for the Qwen3.5-9B base and 93.2% for Jev 1.13.0, with explicit note that Bespoke did not distill from TypeSafe. September 2026 temperature fitting improves probability calibration while keeping discrete picks stable. Runs on Mac Metal or Linux CUDA with documented merge steps for LoRA adapters.",
    creator: {
      name: "Bespoke Labs",
      handle: "bespokelabsai",
      githubUrl: "https://github.com/bespokelabsai",
      company: "Bespoke Labs",
      companyUrl: "https://bespokelabs.ai",
    },
    jevUsage: {
      flowRole:
        "Local schema-driven Choice and Noul classification from merged 9B weights",
      primitives: ["Choice", "Noul"],
      stateIn:
        "Prompt text up to 2,048 tokens including schema field names plus per-field candidate lists or boolean questions defined in nimble/scoring/parallel_schema.py.",
      decisionOut:
        "Selected option per field with normalized probabilities across supplied answers; no free-text completions.",
      flowSteps: [
        "Validate schema against model contract and prompt hash",
        "Encode prompt once per request",
        "Score allowed answer tokens in parallel for each schema field",
        "Return picks and probabilities for downstream thresholds",
      ],
      sourcedMetrics: [
        {
          claim:
            "README cites 90.1% label match on 324 held-out examples for Bespoke-Nimble-9B versus 93.2% for Jev 1.13.0.",
          source: "github.com/bespokelabsai/nimble README",
        },
        {
          claim:
            "Training set documents 2,676 curated examples with open curation and training scripts in-repo.",
          source: "github.com/bespokelabsai/nimble README",
        },
        {
          claim:
            "Public GitHub repo bespokelabsai/nimble had about one thousand six hundred seventy eight stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Nimble is the teach-the-recipe counterpart to hosted Simple Jev or SemIf servers. Operators define explicit enums and booleans in code, call local inference, and treat probabilities as hints that still need domain calibration. The repo foregrounds data edits that flip labels under contrastive curation, which is rare in integration listings that only wrap API keys. Because fields cannot depend on each other, your orchestration layer must enforce cross-field consistency after Nimble returns independent answers. Pair with classifier.dev when you want managed latency without merging nine billion parameters on a laptop.",
    keyFeatures: [
      "Open data curation, training, and MLX or CUDA serving paths",
      "Hugging Face Bespoke-Nimble-9B with schema contract files",
      "Parallel answer-token scoring inspired by System One Choice docs",
      "Documented limits: text-only, max 26 enum strings per field",
    ],
    stack: [
      "Python",
      "PyTorch",
      "MLX on Apple Silicon",
      "LoRA on Qwen3.5-9B",
      "Hugging Face Hub",
    ],
    links: {
      repo: "https://github.com/bespokelabsai/nimble",
      docs: "https://github.com/bespokelabsai/nimble#methodology",
      website: "https://huggingface.co/bespokelabs/Bespoke-Nimble-9B",
    },
    pricingNote:
      "Open source recipe; you fund GPUs, RAM for merge steps, and any cloud training you run.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "featherless-simple-jev",
      "theoleecj-semif",
      "vinnylarouge-jevlike",
      "classifier-dev",
    ],
    relatedLearnSlugs: ["system-one", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Did Bespoke distill from TypeSafe Jev?",
        answer:
          "README states they did not distill from Jev; the repo shares curation, training, and serving so others can research similar models.",
      },
      {
        question: "Which primitives does Nimble support?",
        answer:
          "Schema fields are Choice over explicit lists or boolean (Noul-style) questions. There is no free-form text or nested JSON output.",
      },
      {
        question: "Can I trust default probabilities in production?",
        answer:
          "README warns probabilities are calibrated on their curated set and still need threshold tuning on your data, especially when no supplied answer fits.",
      },
    ],
    metaTitle: "Bespoke Nimble: open data and 9B local Choice classifier",
    metaDescription:
      "bespokelabsai/nimble publishes curation, LoRA training, and MLX or CUDA serving for Bespoke-Nimble-9B. Choice and Noul from schema, not chat JSON.",
  },

  "miuuyy-astra-ares": {
    slug: "miuuyy-astra-ares",
    status: "published",
    problem:
      "Codex sessions on GPT-6 Astra, Sol, or Luna often burn tokens on high reasoning effort for trivial next steps.",
    targetUser:
      "Power users running a patched Codex CLI who want mid-task reasoning effort changes without swapping models or invalidating prompt cache prefixes.",
    overview:
      "Astra-Ares (github.com/miuuyy/Astra-Ares) is miuuyy's experimental bridge that installs a separate pinned Codex build, then asks Jev before each eligible generation how hard the next step looks and how many generations that effort should cover. Jev reads bounded task context (recent tool results, public progress, retained user goals) and returns choices mapped to native GPT-6 reasoning effort plus a lease of 1, 2, 5, or 10 generations. Codex applies settings through OpenAI's configuration_update path so prompt prefixes stay cache-friendly. OpenRouter is the default Jev provider on fresh installs; transcript lines show APPLIED when native effort changes stick. README labels the project a reference implementation, not a polished daily driver.",
    creator: {
      name: "miuuyy",
      handle: "miuuyy",
      githubUrl: "https://github.com/miuuyy",
    },
    jevUsage: {
      flowRole:
        "Mid-run reasoning effort and lease duration routing inside patched Codex generations",
      primitives: ["Choice", "Score"],
      stateIn:
        "Evaluator packet with original task, public plans, last six tool call pairs, and truncated tool results under documented token guards (not the full encrypted reasoning stream).",
      decisionOut:
        "Selected reasoning effort tier and generation lease count applied natively before the next model generation.",
      flowSteps: [
        "Detect checkpoint when a new generation is due and lease expired or context changed",
        "Send bounded state to configured Jev provider (OpenRouter default)",
        "Map Jev choices to Codex native effort settings",
        "Hold effort across leased generations without extra Jev calls until lease ends or user interrupts",
      ],
      sourcedMetrics: [
        {
          claim:
            "Example transcript in README shows a Jev decision in about 321 ms with a two-generation lease.",
          source: "github.com/miuuyy/Astra-Ares README",
        },
        {
          claim:
            "Evaluator context caps recent tool results at 1,000 local tokens each and 28,000 tokens overall per configuration docs.",
          source: "github.com/miuuyy/Astra-Ares docs/configuration.md",
        },
        {
          claim:
            "Public GitHub repo miuuyy/Astra-Ares had about two hundred thirty two stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Ares is model routing by reasoning depth, not by vendor swap. Hermes skill packs might pick which model answers; Ares keeps Astra, Sol, or Luna fixed and only moves effort up or down based on what Jev thinks the next step needs. That matches TypeSafe's pitch that structured decisions belong on the hot path while the big model writes code. Failures are explicit: README promises no silent provider fallback and logs decisions under ~/.local/share/astra-ares/runs. Treat leases as a cost knob: ten-generation leases amortize Jev latency, but tool failures force a fresh assessment.",
    keyFeatures: [
      "Pinned Codex patch with npm run setup build pipeline",
      "Native GPT-6 effort changes with prefix-preserving cache story",
      "ares doctor and --probe for local config plus billable Jev ping",
      "Separate Ares Codex profiles without touching stock codex binary",
    ],
    stack: [
      "TypeScript",
      "Node.js 22+",
      "Patched Codex CLI",
      "OpenRouter or other Jev providers",
      "Rust toolchain for Codex build",
    ],
    links: {
      repo: "https://github.com/miuuyy/Astra-Ares",
      docs: "https://github.com/miuuyy/Astra-Ares/blob/main/docs/architecture.md",
    },
    pricingNote:
      "MIT bridge plus Apache-2.0 patched Codex sources; Jev calls bill through your configured provider, Codex usage bills through OpenAI as usual.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "gargpratyush-jev-router",
      "kerpopule-hermes-jev-skills",
      "typesafe-ai-skills",
      "vercel-labs-ai-cli",
    ],
    relatedLearnSlugs: ["use-cases", "system-one"],
    faq: [
      {
        question: "Does this replace my normal codex command?",
        answer:
          "No. Setup installs a separate binary and profiles. Your existing Codex install stays untouched per README installation notes.",
      },
      {
        question: "Which Jev provider works out of the box?",
        answer:
          "OpenRouter is default after ares configure. Other providers are documented under docs/configuration.md with explicit env vars.",
      },
      {
        question: "Is it production ready?",
        answer:
          "README marks Astra-Ares as an experimental reference for adaptive reasoning effort, primarily for integrators experimenting with GPT-6 native effort APIs.",
      },
    ],
    metaTitle: "Astra-Ares: Jev picks Codex GPT-6 reasoning effort mid-task",
    metaDescription:
      "miuuyy Astra-Ares patches Codex so Jev sets reasoning effort and generation leases on Astra, Sol, and Luna. OpenRouter default, MIT repo.",
  },

  "coldteadotai-abide": {
    slug: "coldteadotai-abide",
    status: "published",
    problem:
      "AGENTS.md and CLAUDE.md rules are too semantic for linters, so coding agents break style constraints from the first edit.",
    targetUser:
      "Teams on Claude Code, Codex, or OpenCode who want every edit checked against a compiled rubric without paying chat-model prices per hunk.",
    overview:
      "Abide (github.com/coldteadotai/abide) from Cold Tea hooks into Claude Code, Codex, and OpenCode to enforce project instruction files. On each edit or turn it sends Jev one typed question per compiled rule with the rule text and diff snippet, never the full chat log. Probabilities above 0.8 trigger an in-session repair message naming the rule and source line; mid-band scores surface notes without blocking. README replay benchmark on 93 Claude Code sessions reports about one in thirteen turns breaking a rule, with Jev checks around 300 ms and roughly a tenth of a cent per turn on measured replays. npm package @coldtea/abide stores keys locally; abide audit judges existing trees for preflight reports.",
    creator: {
      name: "Cold Tea",
      handle: "coldteadotai",
      githubUrl: "https://github.com/coldteadotai",
      companyUrl: "https://coldtea.ai",
    },
    jevUsage: {
      flowRole:
        "Per-rule guardrail Noul-style probability on each edit or end-of-turn diff against compiled rubric JSON",
      primitives: ["Noul", "Score"],
      stateIn:
        "Single rule quote plus scoped file diff or aggregated turn diff; conversation history excluded by design.",
      decisionOut:
        "Calibrated violation probability per rule ID with banded actions (repair, note, or ignore).",
      flowSteps: [
        "Compile AGENTS.md, CLAUDE.md, and related files into .abide/rubric.json",
        "On hook fire, batch one Jev question per applicable rule for the diff",
        "Threshold probabilities into repair, note, or silent paths",
        "Append repair instructions to tool results or turn follow-ups for the agent",
      ],
      sourcedMetrics: [
        {
          claim:
            "Replay benchmark README cites about 300 ms per check and roughly a tenth of a cent per turn on 93 sessions.",
          source: "github.com/coldteadotai/abide benchmarks/replay",
        },
        {
          claim:
            "Measured replay found Jev flagged 39 edits and 15 turns with independent reviewer confirmation on subsets.",
          source: "github.com/coldteadotai/abide README",
        },
        {
          claim:
            "Public GitHub repo coldteadotai/abide had about two hundred eleven stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Abide is the guardrail mirror to Hermes approvals or jev-review dashboards: instead of scoring whole PRs for humans, it sits on the agent hot path and asks cheap boolean-style questions per rule. That only works because Jev returns probabilities, not essays you must parse. Linters still own mechanically checkable rules; Abide skips duplicating ESLint. calibrate and tune commands close the loop when a rule never fires or fires everywhere. Keys stay in ~/.abide/.env or repo-local env files; README states Cold Tea does not receive your diffs on their servers.",
    keyFeatures: [
      "Hooks for Claude Code, Codex apply_patch, and OpenCode plugin mode",
      "Committed rubric.json mapping rules to instruction line citations",
      "abide audit and check for batch or pre-commit sweeps",
      "Replay, calibrate, and tune tooling with JSON output flags",
    ],
    stack: [
      "TypeScript",
      "npm CLI",
      "TypeSafe or Vercel AI Gateway keys",
      "Agent hook APIs",
    ],
    links: {
      repo: "https://github.com/coldteadotai/abide",
      docs: "https://github.com/coldteadotai/abide#commands",
      website: "https://www.npmjs.com/package/@coldtea/abide",
    },
    pricingNote:
      "Open source MIT; Jev or gateway usage billed per your key with README-measured sub-cent per edit checks.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "anpicasso-hermes-jev-approvals",
      "devagrawal09-jev-review",
      "typesafe-ai-skills",
      "dicklesworthstone-skillranker",
    ],
    relatedLearnSlugs: ["use-cases", "jev-vs-llm-classification"],
    faq: [
      {
        question: "Does Abide send my chat log to Jev?",
        answer:
          "README states Jev sees the rule and diff only, not the conversation, so late edits get the same scrutiny as early ones.",
      },
      {
        question: "Which agents are supported?",
        answer:
          "Claude Code settings, Codex hooks (accept the four entries once), and OpenCode plugin installs documented in README tables.",
      },
      {
        question: "What happens at 0.86 probability?",
        answer:
          "Scores at or above 0.8 trigger a repair message with rule id and instruction quote; 0.5 to 0.8 is note-only per README bands.",
      },
    ],
    metaTitle: "Abide: Jev guardrails on every agent edit",
    metaDescription:
      "coldteadotai/abide hooks Claude Code, Codex, and OpenCode to ask Jev per AGENTS.md rule on each diff. ~300 ms checks, MIT npm CLI.",
  },

  "sdras-jev-webmcp-extension": {
    slug: "sdras-jev-webmcp-extension",
    status: "published",
    problem:
      "WebMCP pages expose many typed tools, but natural-language commands need reliable tool and argument selection without site-specific prompt hacks.",
    targetUser:
      "Frontend and agent builders experimenting with Chrome WebMCP who want Jev Choice and Noul batches mapped from JSON Schema at typing speed.",
    overview:
      "jev-webmcp-extension (github.com/sdras/jev-webmcp-extension) is Sarah Drasner's Apache-2.0 Chrome side panel. It discovers tools a page registers, converts each schema field into parallel Jev questions (tool Choice plus per-argument Choice, Noul, or span picks from the user's words), and decodes answers into executable calls with confidence and latency labels. Manifest screening runs Noul checks on tool descriptions for agent-directed instructions; execution policy respects readOnlyHint, consequential annotations, and double-Enter confirmations. No build step: load unpacked on Chrome 149+ with WebMCP enabled. Chrome Web Store listing and Basketful demo walkthrough ship in README; eval harness hits the real TypeSafe API when TYPESAFE_API_KEY is set.",
    creator: {
      name: "Sarah Drasner",
      handle: "sdras",
      githubUrl: "https://github.com/sdras",
      xUrl: "https://x.com/sdras",
    },
    jevUsage: {
      flowRole:
        "Side-panel tool routing and argument filling from schema-derived Jev question batches",
      primitives: ["Choice", "Noul"],
      stateIn:
        "User utterance plus discovered tool manifests converted to questions in src/core/questions.js (tool list Choice, enum booleans, optional-field nouls, span Choices for free text).",
      decisionOut:
        "Selected tool name, argument object, confidence score, and policy state (auto, confirm, or none).",
      flowSteps: [
        "Discover tools via page bridge and screen manifest text",
        "Build parallel Jev questions and decode plan for the utterance",
        "Call api.typesafe.ai/v1/systemone through extension storage key",
        "Apply policy.js gates before chrome.scripting executes pageCallTool",
      ],
      sourcedMetrics: [
        {
          claim:
            "README example shows search_products at 98% confidence in 164 ms on Basketful demo input.",
          source: "github.com/sdras/jev-webmcp-extension README",
        },
        {
          claim:
            "Public GitHub repo sdras/jev-webmcp-extension had about one hundred nine stars when this listing was drafted.",
          source: "GitHub star count September 2026",
        },
      ],
    },
    howJevIsUsed:
      "Drasner's extension is the browser-local counterpart to server-side Browser Use loops: instead of pixels, Jev chooses among declared tools and fills args using the user's own words as candidate spans. That keeps latency in the hundreds of milliseconds for read-only calls while still forcing confirmations on checkout flows. Core logic lives in pure JavaScript modules tested without Chrome so question wording tweaks are safe to iterate. Tool results stay out of model input per security README, which matters when pages are untrusted. Pair with typesafe-ai-typesafe-sdk-js when you graduate from the panel to a hosted agent backend.",
    keyFeatures: [
      "Schema-to-question converter with npm test coverage",
      "Per-site optional_host_permissions and manifest screening badges",
      "Keyboard navigation through tool candidates with Enter to execute",
      "Open in playground link for debugging System One requests",
    ],
    stack: [
      "JavaScript",
      "Chrome extension APIs",
      "WebMCP",
      "TypeSafe System One HTTP",
    ],
    links: {
      repo: "https://github.com/sdras/jev-webmcp-extension",
      docs: "https://github.com/sdras/jev-webmcp-extension#demo-walkthrough",
      demo: "https://shopping-webmcp-demo.netlify.app/",
      website:
        "https://chromewebstore.google.com/detail/jev-%C3%97-webmcp/gglnhcbhjfbmcpgccnmolbhejloflgkb",
    },
    pricingNote:
      "Free extension; TypeSafe API keys bill per System One request when not using harness mocks.",
    firstSeen: "2026-09-23",
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "typesafe-ai-typesafe-sdk-js",
      "typesafe-ai-skills",
      "lahfir-agent-desktop",
    ],
    relatedLearnSlugs: ["system-one", "use-cases"],
    faq: [
      {
        question: "Do I need WebMCP enabled?",
        answer:
          "README requires Chrome 149+ with WebMCP via origin trial or chrome://flags/#enable-webmcp-testing before tools appear.",
      },
      {
        question: "Can any site auto-run destructive tools?",
        answer:
          "Policy treats tools as state-changing unless readOnlyHint is set; consequential annotations always need a second Enter per README safety section.",
      },
      {
        question: "Where is the TypeSafe key stored?",
        answer:
          "Panel settings save the key in chrome.storage.local after a live API check per setup steps.",
      },
    ],
    metaTitle: "Jev WebMCP extension: typed tool picks in Chrome",
    metaDescription:
      "sdras jev-webmcp-extension maps WebMCP schemas to Jev Choice and Noul batches, screens manifests, and executes with confirmation policy. GitHub plus Chrome Web Store.",
  },

};
