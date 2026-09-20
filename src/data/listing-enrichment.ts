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
      "Hermes Agent plugin using TypeSafe Jev for smart shell approvals. Measured latency vs auxiliary chat LLM, six parallel questions per command, and smart_policy setup.",
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
};
