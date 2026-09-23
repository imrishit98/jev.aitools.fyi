import type { FaqEntry } from "@/data/faq";
import type { JevPrimitive } from "@/data/product-profiles";

export type ListingEnrichmentSection = {
  heading: string;
  paragraphs: string[];
};

export type ListingEnrichment = {
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Visible note above the listing body (e.g. link up to a guide). */
  leadCallout?: {
    beforeLink: string;
    linkLabel: string;
    linkHref: string;
    afterLink: string;
  };
  creatorHandle?: string;
  jevPrimitives?: JevPrimitive[];
  jevUsageSummary: string;
  setupNotes?: string;
  caveats?: string;
  sections: ListingEnrichmentSection[];
  faq?: FaqEntry[];
  relatedSlugs?: string[];
};

export const listingEnrichmentBySlug: Record<string, ListingEnrichment> = {
  "anpicasso-hermes-jev-approvals": {
    slug: "anpicasso-hermes-jev-approvals",
    metaTitle: "Hermes Jev approvals: typed smart command gates",
    metaDescription:
      "Hermes Agent plugin using TypeSafe Jev for smart shell approvals. Measured latency vs a chat LLM reviewer, six parallel questions per command.",
    leadCallout: {
      beforeLink:
        "Want the full Hermes Agent plus Jev setup, including skill routing and MCP? Read the ",
      linkLabel: "Hermes Agent + Jev guide",
      linkHref: "/guides/jev-with-ai-agents/hermes",
      afterLink: " first.",
    },
    creatorHandle: "anpicasso",
    jevPrimitives: ["Choice", "Noul", "Score"],
    jevUsageSummary:
      "Registers TypeSafe Jev (or OpenRouter jev-latest) as Hermes' auxiliary approval provider. Each flagged command triggers one parallel ask with six typed questions: verdict Choice (APPROVE/DENY/ESCALATE), policy Noul, blast radius Score, and safety nouls for self-advocacy, secrets, and outbound data.",
    setupNotes:
      "Set approvals.mode smart, point auxiliary.approval.provider at typesafe-jev, and write approvals.smart_policy from your own traffic. TypeSafe direct setup is two menu clicks per README; OpenRouter needs manual config.",
    caveats:
      "Benchmarks used real mined commands on one machine; independent live-sandbox studies report smaller speed ratios. Without smart_policy, Jev may deny routine developer commands.",
    sections: [
      {
        heading: "Why Hermes needs a typed reviewer",
        paragraphs: [
          "Hermes smart mode sends flagged shell commands to an auxiliary model that must answer with exactly APPROVE, DENY, or ESCALATE. A general chat model wastes tokens generating reasoning you throw away. Jev answers that shape natively with one Choice plus supporting nouls and scores.",
          "The plugin does not modify Hermes core: auxiliary_client already resolves per-task providers, so you only swap the provider name in config.",
        ],
      },
      {
        heading: "Measured baseline (README)",
        paragraphs: [
          "On 156 real commands from session dumps, typesafe-jev averaged 405 ms per gate vs 3968 ms for a small auxiliary chat model, with human prompts dropping from 42 to 10. Only about 11% of commands reach the gate at all.",
        ],
      },
    ],
    faq: [
      {
        question: "What is Hermes Jev?",
        answer:
          "Community shorthand for this Hermes plugin: Jev as the smart approval auxiliary for shell commands. Search terms hermes jev and jev hermes usually point here.",
      },
      {
        question: "Which Jev primitives does it use?",
        answer:
          "One Choice for verdict, Score for blast_radius, and four Noul questions (policy_allows, self_advocating, reads_secrets, sends_outbound) fired in parallel per README table.",
      },
      {
        question: "Is the 9.8x speedup universal?",
        answer:
          "No. README and docs/METRICS.md position it as a baseline against one configured auxiliary model. An independent v0.2.1 sandbox study reported roughly 1.24x reviewer-time ratio instead.",
      },
      {
        question: "Do I need operator policy text?",
        answer:
          "Yes for developer machines. Without approvals.smart_policy, benchmarks showed routine kills and git pushes escalated or denied. Policy clauses are trusted-channel text Hermes already supports.",
      },
    ],
    relatedSlugs: [
      "caiovicentino-jev-shield",
      "jomatsu-pi-jev-auto-mode",
      "itsmostafa-typesafe-mcp",
    ],
  },

  "cloudflare-workers-ai-typesafe-jev": {
    slug: "cloudflare-workers-ai-typesafe-jev",
    metaTitle: "Cloudflare Workers AI typesafe/jev model",
    metaDescription:
      "Cloudflare lists model id typesafe/jev for its structured evaluation model. 32k token context, env.AI.run call pattern, dashboard based pricing.",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "Cloudflare Workers AI exposes TypeSafe's Jev model under the id typesafe/jev. From a Worker you call env.AI.run with structured state and noul, choice, or score question shapes, same System One contract as the TypeSafe API.",
    setupNotes:
      "Follow Cloudflare's Workers AI binding docs for model id typesafe/jev. Dollar pricing is managed in the Cloudflare dashboard rather than on the public model card.",
    sections: [
      {
        heading: "When to use Workers AI vs TypeSafe direct",
        paragraphs: [
          "Pick this path when you already deploy on Cloudflare Workers and want Jev beside your other AI bindings without juggling a separate TypeSafe API key in every environment.",
        ],
      },
    ],
    faq: [
      {
        question: "What is Cloudflare Workers AI Jev?",
        answer:
          "It is TypeSafe's Jev model exposed through Cloudflare's env.AI.run binding. Same System One decisions, called from a Workers AI binding instead of a separate TypeSafe API key.",
      },
    ],
    relatedSlugs: [
      "jev-on-vercel-ai-gateway",
      "openrouter-typesafe-jev-1-13",
      "pypi-jev-cli",
    ],
  },

  "itsmostafa-typesafe-mcp": {
    slug: "itsmostafa-typesafe-mcp",
    metaTitle: "typesafe-mcp: Go MCP server and evaluate CLI for Jev",
    metaDescription:
      "Install typesafe-mcp with one script: MCP tools for Claude Code, Desktop, Codex, and Pi. Typed Choice, Score, and Noul judgments instead of free-text evaluate hacks.",
    creatorHandle: "itsmostafa",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "The evaluate binary exposes System One as MCP tools so agents return probabilities they can branch on. evaluate setup mcp registers hosts it detects; evaluate setup pi covers the Pi agent.",
    setupNotes:
      "curl install.sh to ~/.local/bin, export PATH, set TYPESAFE_API_KEY or gateway keys per README. Go install github.com/itsmostafa/typesafe-mcp/cmd/evaluate@latest also works.",
    sections: [
      {
        heading: "Why agents want typed evaluate",
        paragraphs: [
          "Free-text tool outputs force brittle parsing. typesafe-mcp returns structured probabilities for Choice, Score, and Noul questions so your agent can threshold, log, and retry deterministically.",
        ],
      },
    ],
    faq: [
      {
        question: "What is typesafe-mcp?",
        answer:
          "A Go CLI and MCP server (evaluate) that wraps TypeSafe Jev for Claude Code, Claude Desktop, Codex, and Pi. It is the listing people mean when they search typesafe-mcp.",
      },
      {
        question: "How is this different from other Jev MCP servers?",
        answer:
          "It focuses on a single-binary install and setup subcommands for multiple hosts. Compare tool schemas and transport (stdio vs HTTP) before you standardize.",
      },
      {
        question: "Which API key do I need?",
        answer:
          "Follow the repository README for TypeSafe direct vs gateway variables. Keys stay on your machine; the server forwards asks to System One.",
      },
      {
        question: "Can Pi use it without Claude?",
        answer:
          "Yes via evaluate setup pi when Pi is installed locally.",
      },
    ],
    relatedSlugs: ["jkudish-jev-mcp", "brainwires-jevwire", "typesafe-ai-typesafe-sdk-js"],
  },

  "jomatsu-pi-jev-auto-mode": {
    slug: "jomatsu-pi-jev-auto-mode",
    metaTitle: "pi-jev-auto-mode: Jev thresholds for Pi tool auto-approve",
    metaDescription:
      "Pi coding agent extension that uses System One to auto-approve safe bash, write, and edit tool calls. Configurable thresholds; fails closed when Jev is undecided.",
    creatorHandle: "jomatsu",
    jevPrimitives: ["Choice", "Noul"],
    jevUsageSummary:
      "Hooks Pi tool execution: pattern allowlist for known-safe commands, Jev judgment for everything else with allow, block, or block-if-undecidable outcomes tied to calibrated probabilities.",
    setupNotes:
      "pi install npm:pi-jev-auto-mode or git install. Configure thresholds via Pi commands documented in README (/jev-auto-mode threshold). Requires Pi 0.85+ and Node 22.19+.",
    caveats:
      "Auto-approve is only as good as your thresholds and network latency to System One. Review defaults before unattended runs on production repos.",
    sections: [
      {
        heading: "Pi Jev auto mode in one sentence",
        paragraphs: [
          "Let Pi keep coding while Jev scores whether a bash, write, or edit call is safe enough to skip the human prompt. Pattern lists handle boring allow cases; Jev handles semantic risk.",
        ],
      },
    ],
    faq: [
      {
        question: "What is pi-jev or pi jev?",
        answer:
          "Usually this Pi extension (pi-jev-auto-mode) or related Pi integrations like y0usaf-pi-jev. This listing is the auto-approve plugin maintained by jomatsu.",
      },
      {
        question: "Does it work offline?",
        answer:
          "Pattern-based allows can work without keys; Jev judgments need API access unless you configure an offline fallback per README.",
      },
      {
        question: "How do thresholds work?",
        answer:
          "You set per-rule thresholds (0.5 to 1.0) so probabilities map to auto-allow vs escalate. README documents CLI commands to inspect and tune them.",
      },
    ],
    relatedSlugs: ["devmortimer-pi-warden", "y0usaf-pi-jev", "itsmostafa-typesafe-mcp"],
  },

  "devmortimer-pi-warden": {
    slug: "devmortimer-pi-warden",
    metaTitle: "pi-warden: Jev guardrails that steer Pi agents",
    metaDescription:
      "Supervises Pi with Jev judging rules, risky tools, stuck loops, and bad done claims. Feeds issues back to the agent instead of only interrupting you.",
    creatorHandle: "DevMortimer",
    jevPrimitives: ["Choice", "Noul", "Score"],
    jevUsageSummary:
      "Multiple guards call Jev with context about the user request, tool args, and project rules. Verdicts quote violated Markdown rules, flag irreversible commands, or detect runaway output.",
    setupNotes:
      "pi install npm:pi-warden. Add pi-warden.md at repo root with one heading per rule, or rely on README/CLAUDE.md/AGENTS.md fallback.",
    sections: [
      {
        heading: "Steer instead of stop",
        paragraphs: [
          "Warden's default is to tell Pi what went wrong so it can fix the issue and continue. That keeps long tasks flowing while still enforcing security and style constraints Jev can judge from text.",
        ],
      },
    ],
    faq: [
      {
        question: "How is pi-warden different from pi-jev-auto-mode?",
        answer:
          "Auto-mode focuses on approving individual tool calls. Warden supervises broader failure modes: rule violations on writes, stuck loops, dishonest done claims, and security patterns.",
      },
      {
        question: "Where do rules live?",
        answer:
          "pi-warden.md headings become individual rules Jev judges on every write and edit. See docs/configuration.md in the repository.",
      },
      {
        question: "Does it need a TypeSafe key?",
        answer:
          "Jev-powered guards need API access. Some offline pattern guards work without keys per README.",
      },
    ],
    relatedSlugs: ["jomatsu-pi-jev-auto-mode", "devagrawal09-jev-review"],
  },

  "caiovicentino-jev-shield": {
    slug: "caiovicentino-jev-shield",
    metaTitle: "jev-shield: semantic MCP firewall with Jev",
    metaDescription:
      "Proxy MCP traffic with calibrated Jev checks on tool calls, results, and descriptions. Policies use thresholds, not prompt vibes.",
    creatorHandle: "caiovicentino",
    jevPrimitives: ["Noul", "Score"],
    jevUsageSummary:
      "Wraps any stdio MCP server, running System One verification on exfiltration, destructive args, injection in results, tool poisoning, and secrets before the agent sees poisoned content.",
    setupNotes:
      "npx jev-shield -- <upstream command> with AI_GATEWAY_API_KEY or TypeSafe keys. Optional JSON policies and install-hooks for Claude Code, opencode, and Codex MCP paths.",
    caveats:
      "Each check adds roughly half a second to a second plus per-event cost documented in README demo (~$0.00003/event).",
    sections: [
      {
        heading: "Probabilities drive policy",
        paragraphs: [
          "jev-shield returns the same semantic scores regardless of policy; you change thresholds in code review. That beats rewriting prompts when compliance wants stricter blocks.",
        ],
      },
    ],
    faq: [
      {
        question: "Does jev-shield replace MCP server auth?",
        answer:
          "No. It is an inline semantic filter. You still scope credentials and upstream servers correctly.",
      },
      {
        question: "Which hosts are supported?",
        answer:
          "MCP wrap works anywhere you can swap the server command. Optional hooks cover Claude Code and opencode; Codex uses the MCP firewall path per README table.",
      },
    ],
    relatedSlugs: ["itsmostafa-typesafe-mcp", "anpicasso-hermes-jev-approvals"],
  },

  "saibimajdi-typesafeai-dotnet-sdk": {
    slug: "saibimajdi-typesafeai-dotnet-sdk",
    metaTitle: "typesafeai-dotnet-sdk: .NET client for System One",
    metaDescription:
      "Community .NET SDK for TypeSafe Jev with net8/net10 support, XML docs, and a published documentation site. Choice, Score, and Noul with forward-compatible raw JSON escape hatches.",
    creatorHandle: "saibimajdi",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "Wraps POST /v1/systemone with idiomatic C# types, nullable reference types, and helpers for batching questions from .NET services and workers.",
    setupNotes:
      "Install from NuGet per docs/quickstart.md on the repo docs site. CI badge tracks net8 and net10 builds.",
    sections: [
      {
        heading: "When to pick the .NET SDK",
        paragraphs: [
          "Choose this client when your gates already live in ASP.NET, Azure Functions, or enterprise services that standardize on C#. Forward compatibility types (RawJson, UnknownAnswer) help when the API adds fields before the SDK updates.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this an official TypeSafe package?",
        answer:
          "It is a community SDK maintained by saibimajdi with MIT license and public CI. Compare with official JS/Python clients for schema freshness.",
      },
      {
        question: "Where is the documentation?",
        answer:
          "https://saibimajdi.github.io/typesafeai-dotnet-sdk/ plus markdown guides in the GitHub repository.",
      },
    ],
    relatedSlugs: ["typesafe-ai-typesafe-sdk-js", "typesafe-ai-typesafe-sdk-python"],
  },

  "sufianetaouil-every": {
    slug: "sufianetaouil-every",
    metaTitle: "every CLI: ask a yes/no question of every function",
    metaDescription:
      "Rank functions in a codebase with Jev scores, not embeddings. Self-test metrics, local SHA cache, and cents-per-scan pricing story in README.",
    creatorHandle: "sufianetaouil",
    jevPrimitives: ["Noul", "Score"],
    jevUsageSummary:
      "Walks functions in scanned files, sends each body to System One with a typed question, and ranks by probability. Caches sha256(question, unit) to .every/cache.json without storing source.",
    setupNotes:
      "pip install every-cli, set Jev API key, run every \"<question>\" <path> with optional --above threshold and --json.",
    caveats:
      "Source code is sent to TypeSafe API. Do not scan secrets you cannot exfiltrate to a third party.",
    sections: [
      {
        heading: "Not embedding search",
        paragraphs: [
          "every judges each function against your question. It finds logic that matches a behavioral description (for example swallowing exceptions) rather than textual similarity.",
        ],
      },
    ],
    faq: [
      {
        question: "How accurate is the default threshold?",
        answer:
          "README documents a 20-function self-test with recall and false positive rates; default --above 0.75 sits in the gap between true and false positives on that set.",
      },
      {
        question: "What does a scan cost?",
        answer:
          "README example: 1,842 functions in about 3.1s for about $0.03 on a sample run. Your cost scales with function count and question complexity.",
      },
    ],
    relatedSlugs: ["devagrawal09-jev-review", "vinilana-jev-eval-agent"],
  },

  "bunsdev-clarity-judge": {
    slug: "bunsdev-clarity-judge",
    metaTitle: "clarity-judge: multi-axis writing checks with Jev",
    metaDescription:
      "Playground app scoring hedging, clarity, filler, tone, passive voice, and actionability with separate Jev questions. Public demo at judge.jev.works uses simulated mode without API keys.",
    creatorHandle: "BunsDev",
    jevPrimitives: ["Score", "Noul"],
    jevUsageSummary:
      "Runs named checks (each a System One question) against pasted writing, surfacing per-check verdicts and supporting sentences instead of one opaque LLM grade.",
    setupNotes:
      "Clone TypeSafeAI/clarity-judge for local runs with your API key. Public judge.jev.works demo is deterministic simulation only.",
    sections: [
      {
        heading: "Why multi-axis beats one score",
        paragraphs: [
          "Editors can accept good tone while rejecting passive voice. Separate Jev questions keep each axis thresholdable and explainable, similar to the jev.works playground UX.",
        ],
      },
    ],
    faq: [
      {
        question: "Does the public demo call Jev?",
        answer:
          "No. README states judge.jev.works has no server API key and shows simulated results labeled as demo mode.",
      },
      {
        question: "Is this an application or playground?",
        answer:
          "It is filed under playgrounds/apps paths because it is an interactive UI for experimenting with check definitions, even though it targets writing quality use cases.",
      },
    ],
    relatedSlugs: ["playground", "vinilana-jev-eval-agent"],
  },

  "vnmoorthy-siege": {
    slug: "vnmoorthy-siege",
    metaTitle: "SIEGE: live agent security game with Jev gates",
    metaDescription:
      "200 people vs one agent: SIEGE uses TypeSafe Choice gates on every tool call with Weave tracing and a cinematic arena demo.",
    creatorHandle: "vnmoorthy",
    jevPrimitives: ["Choice"],
    jevUsageSummary:
      "TypeSafeGate sends Choice(instructions, criteria=policy) through system_one on each tool call; probabilities feed the war room UI and training loop for the defender agent.",
    setupNotes:
      "Clone repo, follow README for WANDB_API_KEY optional tracing, open vnmoorthy.github.io/siege for the arena demo.",
    sections: [
      {
        heading: "Games as security education",
        paragraphs: [
          "SIEGE makes fast typed decisions visible on a phone-friendly UI while crowds try to break a policy. The defender rewrites gate criteria each round, so sub-300ms Choice calls matter.",
        ],
      },
    ],
    faq: [
      {
        question: "Which primitive powers the gate?",
        answer:
          "Choice with policy criteria in gate.py TypeSafeGate, model default jev-latest unless TYPESAFE_MODEL overrides.",
      },
      {
        question: "Where can I play?",
        answer:
          "https://vnmoorthy.github.io/siege/ hosts the cinematic arena linked from the README.",
      },
    ],
    relatedSlugs: ["fhshaik-typesafe-mario", "romanslack-jev-drone"],
  },

  "antoniocoppe-jev-harness": {
    slug: "antoniocoppe-jev-harness",
    metaTitle: "jev-harness: policy, shadow mode, and evals on Jev",
    metaDescription:
      "TypeScript DecisionHarness for TypeSafe Jev: confidence gates, shadow mode, recipes for alerts and routing, and an offline eval CLI. OpenClaw jev-harness plugin builds on this library.",
    creatorHandle: "AntonioCoppe",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "Wraps POST /v1/systemone answers in a production-shaped loop: map Choice, Score, and Noul outputs through a policy function, enforce minConfidence with review or suppress paths, log shadow decisions without changing live behavior, and replay fixtures in the eval CLI.",
    setupNotes:
      "npm install jev-harness, export TYPESAFE_API_KEY, then construct DecisionHarness and pass parallel questions plus a decide() policy. OpenClaw users install the jev-harness plugin that bundles these recipes for shell gates, tool allow lists, and browser next-action steps.",
    caveats:
      "Not affiliated with TypeSafe or OpenClaw Foundation. README wall-clock table (48.9 s vs 1.3 s on one row-filter job) is a maintainer measurement, not a universal SLA.",
    sections: [
      {
        heading: "What the harness adds beyond one Jev call",
        paragraphs: [
          "Calling Jev once is easy. Shipping it usually needs a policy that turns answers into notify, suppress, queue, or skip actions, a confidence gate when probabilities are soft, shadow mode to log would-be actions, and reusable recipes for alerts, inbox triage, model cost routing, and agent handoffs.",
          "The library stays small and TypeScript-first so OpenClaw plugins, Node services, and benchmarks can share the same DecisionHarness API.",
        ],
      },
      {
        heading: "Recipes and OpenClaw jev-harness",
        paragraphs: [
          "GitHub documents recipes for shell exec gates, tool allow and deny lists, stuck-agent recovery, and browser next-action classification. The OpenClaw plugin on openclawdir maps those recipes to plugin tools while generative work stays on Claude, Codex, or other providers.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this the same as jev-claw?",
        answer:
          "No. jev-claw focuses on multi-model routing labels inside OpenClaw. jev-harness focuses on pre-tool and pre-shell gates with recipes and shadow evals.",
      },
      {
        question: "Which primitives show up in recipes?",
        answer:
          "Most recipes combine Choice for the action enum, Score for severity or urgency, and Noul checks for human review or policy fit in one parallel request.",
      },
    ],
    relatedSlugs: ["browser-use-jev-ultrafast", "itsmostafa-typesafe-mcp"],
  },

  "0xnatoshi-jev-codex-router": {
    slug: "0xnatoshi-jev-codex-router",
    metaTitle: "jev-codex-router: per-turn Codex model routing with Jev",
    metaDescription:
      "Codex Router extension that classifies each turn with Jev, picks Luna, Sol, or Astra plus thinking depth, fail-open on errors, and logs decisions locally for calibration.",
    creatorHandle: "0xLogicrw",
    jevPrimitives: ["Choice"],
    jevUsageSummary:
      "Exposes a curated jev/auto model inside Codex Router. A local jev_server.py compacts decision state, asks Jev one Choice over fifteen model and effort pairs, then replays the canonical Codex request on the selected native route. Responses stream verbatim; tool and reasoning behavior stay native.",
    setupNotes:
      "Requires an existing Codex Router install, LiteLLM sidecar, and TYPESAFE_API_KEY. README documents AGENTS.md for AI-assisted setup, kill switch file, and ~/.codex/codex-router/jev-router-live.jsonl decision logs.",
    caveats:
      "Historical simulation figures in README are not measured Codex quota savings. Fail-open uses a logged technical fallback route when Jev errors; read BACKTEST.md before trusting headline percentages.",
    sections: [
      {
        heading: "Routing at the Codex edge",
        paragraphs: [
          "Codex sends each turn through Codex Router on port 4202. Native models hit the ChatGPT backend; jev/auto forwards through a forwarder where Jev sees only bounded decision state while the executing model still receives the full canonical replay including tools and compaction handoff.",
          "The design keeps Responses in and Responses out with no format conversion, so tool calls and reasoning blocks behave like stock Codex.",
        ],
      },
      {
        heading: "Fail-open and operational bypasses",
        paragraphs: [
          "Jev errors keep the turn alive on a safe fallback route. A sentinel kill switch file skips Jev instantly. When native quota is exhausted, README documents a Codex-dry tandem that swaps models until native usage returns.",
        ],
      },
    ],
    faq: [
      {
        question: "How is this different from jev-judge-mcp?",
        answer:
          "jev-judge-mcp exposes a judge tool for evidence you supply. jev-codex-router is traffic control: it picks which Codex model and thinking effort run the next native call.",
      },
      {
        question: "Does every route use Fast speed?",
        answer:
          "README states the policy forces standard speed on every pair, overriding an incoming Fast setting, so Jev optimizes capability per turn rather than a fixed cheap model.",
      },
    ],
    relatedSlugs: ["itsmostafa-typesafe-mcp", "brainwires-jevwire"],
  },

  "keeltrace-hermes-jev": {
    slug: "keeltrace-hermes-jev",
    metaTitle: "hermes-jev: async Jev nervous system for Hermes",
    metaDescription:
      "Community Hermes plugin: background Jev admission, adaptive context routing, bounded decision comparison, and high-confidence challenges without blocking ordinary Hermes execution.",
    creatorHandle: "keeltrace",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "Hermes keeps reasoning and tool execution; Jev supervises accountable decisions in parallel. Turn ingress runs a background admission Choice (OFF, WATCH, ON) while Hermes starts immediately. Supervised turns batch decision-significant state instead of evaluate-every-tool gating.",
    setupNotes:
      "Install from the GitHub README, configure OpenRouter Decisions, direct TypeSafe System One, or OpenCode Zen per docs/PROVIDER_SETUP.md. Only the selected provider credential is required.",
    caveats:
      "Community project, not affiliated with TypeSafe AI or Nous Research. Conflate with anpicasso/hermes-jev-approvals only after reading both READMEs: approvals swap the smart auxiliary reviewer; hermes-jev adds async supervision.",
    sections: [
      {
        heading: "Nervous system vs synchronous gates",
        paragraphs: [
          "The recommended path is not blocking Hermes on every tool call. Admission classifies how much supervision a turn needs; local routers suppress routine noise and send only decision-significant bursts to Jev. Agreement and low-confidence disagreement stay telemetry; high-confidence disagreement surfaces only while the challenged state is still current.",
        ],
      },
      {
        heading: "Public tools and context engines",
        paragraphs: [
          "README documents jev_decide, jev_rank, jev_verify, jev_assess, context curation tools, and optional pre_tool_call gates in off, advisory, or enforce modes. v0.2.x releases harden recovery fingerprints so repeated identical failures stop burning provider calls.",
        ],
      },
    ],
    faq: [
      {
        question: "Does Hermes wait for Jev on every step?",
        answer:
          "No. Ordinary execution proceeds while remote Jev calls run on the ~500 ms class latency budget described in the README. Supervision is parallel, not a full stop-the-world gate.",
      },
      {
        question: "How does this relate to hermes-jev-approvals?",
        answer:
          "anpicasso/hermes-jev-approvals replaces the smart shell approval auxiliary with typed APPROVE, DENY, or ESCALATE. keeltrace/hermes-jev is a broader nervous system for routing, verification, and context curation.",
      },
    ],
    relatedSlugs: [
      "anpicasso-hermes-jev-approvals",
      "decrux9812-typesafe-skill-router",
    ],
  },

  "jkudish-jev-browser": {
    slug: "jkudish-jev-browser",
    metaTitle: "jev-browser: MCP and CLI browser loops with Jev actions",
    metaDescription:
      "Headless browser automation where Jev picks one action per step from clickable elements, scores goal progress and stuck risk, and code owns budgets and recovery.",
    creatorHandle: "jkudish",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "Drives Playwright through an MCP server, CLI, or library. Each step sends page state to Jev for the next operation Choice plus goal and stuck probabilities. Optional typing providers handle literal text entry when the DOM requires it.",
    setupNotes:
      "Node 20+, TYPESAFE_API_KEY from console.typesafe.ai, npx -y @jkudish/jev-browser for MCP. README includes agent-install paste text and per-client registration examples.",
    caveats:
      "Early software: README warns about rough edges on harder sites. Reported Wikipedia and GitHub demo costs are maintainer measurements on specific runs, not guarantees.",
    sections: [
      {
        heading: "Split brain browser loop",
        paragraphs: [
          "The harness mirrors the ultrafast pattern in the directory: Jev classifies the next browser operation from structured element lists while larger models only appear for typing when necessary. You receive traces with per-step confidences, console errors, and screenshots for debugging.",
        ],
      },
      {
        heading: "MCP-first operator path",
        paragraphs: [
          "Register jev-browser as a stdio MCP server so IDE agents can navigate, extract markdown, or fill forms under budget caps you define in code. The README documents real-site tasks including Wikipedia hops, pricing pages, and accessibility-tree breakdowns.",
        ],
      },
    ],
    faq: [
      {
        question: "How is this different from browser-use-jev-ultrafast?",
        answer:
          "Both use Jev for decisions over browser ops. jev-browser ships as an npm MCP package with Playwright bundled; compare README feature lists and client setup before picking one for production.",
      },
      {
        question: "Does it auto-submit sensitive forms?",
        answer:
          "README examples include stopping before submit on contact forms. You own stop gates and policy in the calling harness.",
      },
    ],
    relatedSlugs: ["browser-use-jev-ultrafast", "awlevin-typesafe-computer-use"],
  },

  "lahfir-agent-desktop": {
    slug: "lahfir-agent-desktop",
    metaTitle: "agent-desktop: accessibility-tree desktop automation with Jev",
    metaDescription:
      "lahfir/agent-desktop Rust CLI for macOS AX snapshots and ref actions. Pair with Jev Choice in your agent loop. Starred in Muhammad Aayan top-ten Jev repos.",
    creatorHandle: "lahfir",
    jevPrimitives: ["Choice"],
    jevUsageSummary:
      "agent-desktop returns structured snapshot refs; your agent asks Jev which ref to click, type into, or scroll next. The binary never generates language, keeping the hot path at System One prices.",
    setupNotes:
      "npm install -g agent-desktop or npx agent-desktop snapshot --app Finder -i. Grant Accessibility and Screen Recording permissions on macOS. Wire TYPESAFE_API_KEY in the calling agent.",
    sections: [
      {
        heading: "Why accessibility beats pixels",
        paragraphs: [
          "Native AX trees expose roles, names, and stable refs that survive window moves. agent-desktop compresses dense apps with skeleton overview plus drill-down so Jev sees a small action menu instead of thirty thousand tokens of Slack chrome.",
        ],
      },
    ],
    relatedSlugs: ["browser-use-jev-ultrafast", "awlevin-typesafe-computer-use"],
  },

  "kerpopule-hermes-jev-skills": {
    slug: "kerpopule-hermes-jev-skills",
    metaTitle: "Hermes Jev Skills: nine decision skills for agents",
    metaDescription:
      "kerpopule/hermes-jev-skills: Jev model routing, memory filter, compaction select, skill pick, triage, mail lanes, computer and browser Choice. Distinct from fast-jev-compaction.",
    creatorHandle: "kerpopule",
    jevPrimitives: ["Choice", "Score", "Noul"],
    jevUsageSummary:
      "Each SKILL.md describes a typed Jev question batch for a recurring agent chore. The Hermes plugin exposes tools so sessions can filter memory, compact transcripts, or route models without another chat completion per micro-decision.",
    setupNotes:
      "git clone and python3 install.py, then jev setup-key for TypeSafe credentials. Use /jev routing shadow before enabling live model switches.",
    caveats:
      "Not affiliated with TypeSafe AI. Read privacy section in README before sending production mail or memory blobs.",
    sections: [
      {
        heading: "How this differs from other Hermes plus Jev projects",
        paragraphs: [
          "fast-jev-compaction targets Claude Code tool rows. hermes-jev-approvals swaps the smart shell reviewer. keeltrace/hermes-jev adds async supervision. hermes-jev-skills is the day-to-day skill pack for routing, retrieval hygiene, and GUI steps with documented latencies.",
        ],
      },
    ],
    relatedSlugs: [
      "tamaratran-fast-jev-compaction",
      "anpicasso-hermes-jev-approvals",
      "typesafe-ai-skills",
    ],
  },

  "socialwithaayan-ten-jev-repos": {
    slug: "socialwithaayan-ten-jev-repos",
    metaTitle: "10 Jev repos blowing up: Muhammad Aayan roundup",
    metaDescription:
      "Muhammad Aayan (@socialwithaayan) ranks ten hot Jev GitHub projects with how each uses Choice, Score, and Noul. Directory deep links for every repo plus his Full Guide article.",
    creatorHandle: "socialwithaayan",
    jevUsageSummary:
      "The thread is editorial, not a new integration: each numbered repo already embeds Jev on a specific hot path. Use this page as a map into our product profiles and tool listings rather than a substitute for upstream READMEs.",
    setupNotes:
      "Read the original post at x.com/socialwithaayan/status/2102059089652285739. For onboarding prose, see Aayan X Article How to Actually Use Jev (Full Guide) linked from the same author.",
    sections: [
      {
        heading: "1. Browser Use Jev Ultrafast",
        paragraphs: [
          "Browser Use agent where Jev picks the next click and target; a small model only types when needed. Directory listing: /apps/browser-use-jev-ultrafast (slug browser-use-jev-ultrafast).",
        ],
      },
      {
        heading: "2. fast-jev-compaction",
        paragraphs: [
          "Claude Code context trim: Jev scores tool call rows, drops junk, keeps useful text verbatim. Directory listing: /tools/tamaratran-fast-jev-compaction.",
        ],
      },
      {
        heading: "3. jev-trader",
        paragraphs: [
          "Monad market maker with one Jev buy or sell Choice about every block (~81 ms in public clips). Directory listing: /apps/jarrodwatts-jev-trader.",
        ],
      },
      {
        heading: "4. TypeSafe skills",
        paragraphs: [
          "Official agent skill for Claude Code and Codex with Choice, Score, and Noul patterns. Directory listing: /sdks/typesafe-ai-skills.",
        ],
      },
      {
        heading: "5. agent-desktop",
        paragraphs: [
          "Desktop automation on the accessibility tree; Jev picks the next button or input in your harness. New directory listing: /apps/lahfir-agent-desktop.",
        ],
      },
      {
        heading: "6. typesafe-computer-use",
        paragraphs: [
          "macOS computer use with OCR plus Jev action Choice per step at fractions of a cent. Directory listing: /apps/awlevin-typesafe-computer-use.",
        ],
      },
      {
        heading: "7. jev-review",
        paragraphs: [
          "Staged code review dashboard: Jev flags risk before you spend a frontier model on the whole diff. Directory listing: /tools/devagrawal09-jev-review.",
        ],
      },
      {
        heading: "8. foreman",
        paragraphs: [
          "Agent supervisor keeping coding agents on task inside a software factory loop with typed Jev decisions. Directory listing: /tools/thruwire-foreman.",
        ],
      },
      {
        heading: "9. hermes-jev-skills",
        paragraphs: [
          "Jev routing, memory, compaction, skill pick, and computer or browser use for Hermes plus Claude Code and Codex. New directory listing: /tools/kerpopule-hermes-jev-skills (not the same repo as fast-jev-compaction).",
        ],
      },
      {
        heading: "10. pg-jev",
        paragraphs: [
          "Postgres extension to ask tables questions in plain English with WHERE jev(...). Directory listing: /tools/realzachi-pg-jev.",
        ],
      },
    ],
    faq: [
      {
        question: "Where is Aayan longer guide?",
        answer:
          "He published How to Actually Use Jev (Full Guide) as an X Article at x.com/i/article/2101984233145409536 and a companion status at x.com/socialwithaayan/status/2101984240225448270.",
      },
      {
        question: "Are star counts exact?",
        answer:
          "The thread used rounded marketing numbers. Check each GitHub repo at commit time before you cite stars in production docs.",
      },
    ],
    relatedSlugs: [
      "browser-use-jev-ultrafast",
      "tamaratran-fast-jev-compaction",
      "jarrodwatts-jev-trader",
      "typesafe-ai-skills",
      "lahfir-agent-desktop",
      "awlevin-typesafe-computer-use",
      "devagrawal09-jev-review",
      "thruwire-foreman",
      "kerpopule-hermes-jev-skills",
      "realzachi-pg-jev",
    ],
  },
};
