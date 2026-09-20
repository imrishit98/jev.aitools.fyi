import type { FaqEntry } from "@/data/faq";
import type { CategorySlug } from "@/data/types";

export type CategoryHighlight = {
  slug: string;
  blurb: string;
};

export type CategoryEnrichmentSection = {
  heading: string;
  body: string;
};

export type CategoryEnrichment = {
  slug: CategorySlug;
  seoTitle?: string;
  seoDescription?: string;
  whoItsFor: string;
  howToChoose: string;
  sections: CategoryEnrichmentSection[];
  highlights: CategoryHighlight[];
  faq: FaqEntry[];
};

export const categoryEnrichmentBySlug: Partial<
  Record<CategorySlug, CategoryEnrichment>
> = {
  "agent-tooling": {
    slug: "agent-tooling",
    seoTitle: "Jev agent tooling: MCP servers, routers, Pi gates, and review loops",
    seoDescription:
      "Compare coding-agent accessories that call TypeSafe Jev for model routing, tool approvals, context compaction, and diff review. FAQs, pick criteria, and featured listings.",
    whoItsFor:
      "Teams running Claude Code, Pi, Hermes, or custom agents who need fast, thresholdable decisions on the hot path instead of parsing YES/NO from chat completions.",
    howToChoose:
      "Start with the integration surface you already use (MCP vs npm plugin vs HTTP sidecar). Prefer repos that document latency budgets, failure modes, and which Jev primitives they send (Choice for routing, Noul for allow/deny, Score for severity). If the tool auto-approves tool calls, read how it fails closed when the API errors.",
    sections: [
      {
        heading: "What counts as agent tooling here",
        body:
          "This hub lists routers, MCP servers, compaction helpers, review gates, and guardrails where System One sits between your agent and side effects. The pattern is the same: serialize the risky moment (shell command, tool call, diff hunk) into structured state, ask a typed question, threshold probabilities in code. Chat models may still write code or prose elsewhere; Jev is the judge on the narrow decision.",
      },
      {
        heading: "Primitives you will see most often",
        body:
          "Choice picks one label from a small catalog (model name, browser action, approval verdict). Noul answers yes/no with a calibrated probability, perfect for allow/block gates. Score ranks ordered levels (blast radius, severity, compaction keep/drop). Many tools fan out several questions in one API call, then compose answers with policy text you control.",
      },
    ],
    highlights: [
      {
        slug: "anpicasso-hermes-jev-approvals",
        blurb:
          "Hermes smart approvals via typed Choice instead of a one-token chat completion. Strong fit if you search for hermes jev or jev hermes.",
      },
      {
        slug: "itsmostafa-typesafe-mcp",
        blurb:
          "Single-binary MCP server and Go CLI (typesafe-mcp) for evaluate setup across Claude Code, Desktop, Codex, and Pi.",
      },
      {
        slug: "jomatsu-pi-jev-auto-mode",
        blurb:
          "Pi plugin that auto-approves safe bash/write/edit calls using Jev thresholds (pi-jev / pi jev queries).",
      },
      {
        slug: "devmortimer-pi-warden",
        blurb:
          "Pi supervisor that steers the agent back on track with Jev judging rules, risky tools, and stuck loops.",
      },
      {
        slug: "caiovicentino-jev-shield",
        blurb:
          "Semantic MCP firewall: calibrated screening on tool calls, results, and poisoned descriptions.",
      },
      {
        slug: "tamaratran-fast-jev-compaction",
        blurb:
          "Compaction gate: Noul on whether a tool result deserves to stay verbatim in context.",
      },
    ],
    faq: [
      {
        question: "What is Hermes Jev?",
        answer:
          "It usually means hermes-jev-approvals: a Hermes Agent plugin that registers TypeSafe Jev as the auxiliary approval provider for smart command gates. See the anpicasso listing for measured latency tables and policy setup.",
      },
      {
        question: "MCP or npm plugin for Pi?",
        answer:
          "MCP (typesafe-mcp) exposes evaluate tools to any MCP host. Pi-specific packages like pi-jev-auto-mode and pi-warden hook Pi's extension API directly. Pick MCP when you want one server for multiple clients; pick Pi packages when you live entirely inside Pi.",
      },
      {
        question: "How fast should agent tooling feel?",
        answer:
          "Sub-second per gate is the design target for tool approvals. Published benchmarks in individual READMEs vary by model route and hardware; always measure on your network before you enable auto-approve in production.",
      },
      {
        question: "Do these tools replace my system prompt?",
        answer:
          "Rarely. They add a decision layer with explicit thresholds. Policy text still belongs in trusted channels (Hermes smart_policy, pi-warden.md rules, jev-shield JSON policies).",
      },
      {
        question: "Where is the official TypeSafe SDK?",
        answer:
          "Official JavaScript and Python clients live under Official and SDKs. Community MCP and Pi wrappers in this hub are maintained by their authors, not TypeSafe.",
      },
    ],
  },

  benchmarks: {
    slug: "benchmarks",
    seoTitle: "Jev benchmarks: calibration, replicas, and latency harnesses",
    seoDescription:
      "Eval repos and open replicas that measure typed Jev decisions: workflow agreement, parallel decoding speedups, and calibration tooling. Sourced result tables on hot listings.",
    whoItsFor:
      "Engineers choosing between hosted Jev, gateway routes, and local replicas who need reproducible numbers before they bake routing policy into production.",
    howToChoose:
      "Match the benchmark to your question: latency on laptop hardware (parallel decoding replicas), agreement with TypeSafe workflow evals (head-to-head harnesses), or calibration error (daf-jev). Read methodology sections; ignore star counts. Prefer repos that ship scripts and raw JSON logs.",
    sections: [
      {
        heading: "What Jev benchmarks actually measure",
        body:
          "Unlike chat benchmarks, these harnesses score typed answers: did the model pick the right option, score level, or noul label for structured state? Good listings document datasets, baselines, hardware, and whether numbers compare to naive JSON generation, frontier models, or TypeSafe's published workflow evals.",
      },
      {
        heading: "Featured results on this directory",
        body:
          "jev-on-a-laptop publishes M5 Air latency and TypeSafe workflow agreement tables scraped into this site. daf-jev documents batching efficiency against sequential System One calls. The parallel constrained decoding Space reports M4 Max milliseconds per scenario. Each page links to the primary source so you can re-run scripts locally.",
      },
    ],
    highlights: [
      {
        slug: "rorshopping-jev-on-a-laptop",
        blurb:
          "Unofficial parallel decoding study with 7.9x speedups and public workflow head-to-head tables (position 1 in search for laptop Jev benchmarks).",
      },
      {
        slug: "docxology-daf-jev",
        blurb:
          "Python toolkit plus calibration benchmark scripts and manuscript pipeline around live System One calls.",
      },
      {
        slug: "parallel-constrained-decoding-qwen2-5-1b-rlcd",
        blurb:
          "Hugging Face Space with M4 Max latency table comparing autoregressive JSON to parallel constrained decoding.",
      },
      {
        slug: "theoleecj-semif",
        blurb:
          "SemIf routing gates with structured Jev questions and documented eval posture.",
      },
      {
        slug: "iammrduncan-typesafe-ai-benchmark",
        blurb:
          "Gateway-shaped rig to reproduce structured evaluate latency on your machine.",
      },
    ],
    faq: [
      {
        question: "What is a Jev benchmark?",
        answer:
          "A reproducible harness that scores typed System One answers (Choice, Score, Noul) on fixed state, often reporting latency, agreement, or calibration error. It is not the same as MMLU-style chat benchmarks.",
      },
      {
        question: "Are unofficial replicas comparable to evals.typesafe.ai?",
        answer:
          "Only when the repo explicitly runs the same public questions and explains label differences. jev-on-a-laptop includes a head-to-head table with caveats; always read the methodology footnotes.",
      },
      {
        question: "Where do I see result tables on this site?",
        answer:
          "Hot benchmark detail pages include a Results section sourced from the project's README or Space. Numbers are not invented here; if a source is unreadable, the page falls back to FAQ and methodology text only.",
      },
      {
        question: "Do benchmarks prove Jev beats GPT on everything?",
        answer:
          "No. Each listing measures a narrow claim (schema validity, approval latency, batching tokens). Treat marketing speedups as hypotheses until you run the packaged scripts on your hardware.",
      },
    ],
  },

  "browser-computer-use": {
    slug: "browser-computer-use",
    seoTitle: "Jev browser and computer use: ultrafast agents and desktop loops",
    seoDescription:
      "Browser Use ultrafast, extensions, voice control, and desktop automation where Jev chooses the next action from a finite catalog. Compare demos, security notes, and latency.",
    whoItsFor:
      "Builders automating browsers or desktops who want each step to be a Choice over known actions instead of open-ended click coordinates in prose.",
    howToChoose:
      "Watch a demo on your network first. Prefer projects that document action catalogs, when a small LLM still runs (typing paths), and how they handle logged-in sessions. Pair ultrafast listings with jev-shield or human confirmation for destructive commands.",
    sections: [
      {
        heading: "Why Jev fits computer use",
        body:
          "UI automation fails when the model free-forms coordinates or invents element ids. System One expects a structured snapshot (accessibility tree, DOM nodes, screenshot metadata) and returns a probability vector over allowed operations. That keeps loops fast and auditable, which is why Browser Use ultrafast pairs Jev with a tiny LLM only for text entry.",
      },
      {
        heading: "jev computer use and jev-browser-use searches",
        body:
          "If you landed from a computer-use query, start with Browser Use Jev Ultrafast for the hybrid pattern, then browse voice and extension listings for multimodal Choice questions. Official TypeSafe computer-use guidance also appears in Learn guides linked from explore.",
      },
    ],
    highlights: [
      {
        slug: "browser-use-jev-ultrafast",
        blurb:
          "Reference hybrid: Jev picks operation + target node; small LLM types only when needed.",
      },
      {
        slug: "awlevin-typesafe-computer-use",
        blurb:
          "Desktop loops with discrete actions over screen state.",
      },
      {
        slug: "moritzkremb-jev-voice-browser",
        blurb:
          "Voice intent plus page state feeding Jev Choices.",
      },
      {
        slug: "jkudish-jev-browser",
        blurb:
          "Browser automation helpers with Jev on the interaction hot path.",
      },
    ],
    faq: [
      {
        question: "What is Jev ultrafast browser use?",
        answer:
          "The Browser Use integration where each step is a typed choice over browser operations and DOM targets, avoiding full LLM planning per click. See the ultrafast product profile and demo clip in this directory.",
      },
      {
        question: "Is computer use safe for production accounts?",
        answer:
          "Treat it like any automation: tight scopes, separate profiles, human gates on payments or deletes. Read each repo's security section before you point agents at logged-in banking or email.",
      },
      {
        question: "Do I need an LLM at all?",
        answer:
          "Many hybrids still use a small model for typing into inputs. Jev handles the discrete navigation decisions; the LLM is optional glue, not the router.",
      },
      {
        question: "How does this relate to MCP browser tools?",
        answer:
          "MCP exposes tools to agents; computer-use listings implement the perception + action loop. You can combine both: MCP transport with Jev picking actions inside the loop.",
      },
    ],
  },

  sdks: {
    slug: "sdks",
    seoTitle: "Jev SDKs: TypeScript, Python, .NET, and community clients",
    seoDescription:
      "Official and community SDKs for POST /v1/systemone with typed Choice, Score, and Noul. Compare languages, docs, and maintenance signals.",
    whoItsFor:
      "Application developers wiring System One directly who want idiomatic types, retries, and batching instead of hand-rolled HTTP.",
    howToChoose:
      "Prefer official TypeScript and Python for production unless you need another runtime. For community ports, check recent commits, published package names, and whether the client maps all three primitives. .NET teams should compare typesafeai-dotnet-sdk docs for net8/net10 support.",
    sections: [
      {
        heading: "One HTTP contract, many languages",
        body:
          "Every SDK ultimately calls POST /v1/systemone with structured state and typed questions. Wrappers differ in ergonomics: some expose builders, others mirror the raw JSON schema. The official clients track TypeSafe schema changes first; community repos may lag new answer fields.",
      },
    ],
    highlights: [
      {
        slug: "typesafe-ai-typesafe-sdk-js",
        blurb: "Official JavaScript SDK for System One.",
      },
      {
        slug: "typesafe-ai-typesafe-sdk-python",
        blurb: "Official Python SDK with maintained types.",
      },
      {
        slug: "saibimajdi-typesafeai-dotnet-sdk",
        blurb:
          "Community .NET client with docs site and CI for net8/net10.",
      },
      {
        slug: "tangerg-typesafe-sdk-go",
        blurb: "Go client for services that want static typing around Jev calls.",
      },
    ],
    faq: [
      {
        question: "Which SDK should I start with?",
        answer:
          "TypeScript or Python official SDKs if your stack matches. They mirror current primitive names and error shapes from docs.typesafe.ai.",
      },
      {
        question: "Are community SDKs supported by TypeSafe?",
        answer:
          "No unless marked official. Verify auth, model names, and retry behavior in the repository before production.",
      },
      {
        question: "Can SDKs batch multiple questions?",
        answer:
          "Yes. System One accepts multiple questions per request; some community toolkits (daf-jev) document batching benchmarks versus sequential calls.",
      },
      {
        question: "Where is the raw HTTP reference?",
        answer:
          "The Official category includes the HTTP API reference listing if you prefer curl or OpenAPI generators.",
      },
    ],
  },

  applications: {
    slug: "applications",
    seoTitle: "Jev applications: moderation, triage, trading, and code search",
    seoDescription:
      "Shipped products and serious demos running System One in user-visible paths: trust and safety, trading, log triage, RAG verify, and function-level code search.",
    whoItsFor:
      "Teams looking for proof that typed decisions survive outside agent accessories: customer-facing moderation, finance, support, or developer tools with real traffic stories.",
    howToChoose:
      "Read deployment notes and data handling first. Favor apps that show how thresholds map to user-visible outcomes (blocked comment, ranked function, approved trade). Demos with live URLs beat screenshot-only repos.",
    sections: [
      {
        heading: "Applications vs agent tooling",
        body:
          "Agent tooling sits beside your coding agent. Applications are products where end users or downstream systems feel the Jev decision: a ranked inbox, a blocked URL, a moderated comment, a ranked function list. They are the best evidence that System One patterns work when UX depends on them.",
      },
    ],
    highlights: [
      {
        slug: "sufianetaouil-every",
        blurb:
          "Ask a yes/no question of every function in a repo; Jev scores each unit (function-level search).",
      },
      {
        slug: "jarrodwatts-jev-trader",
        blurb: "Trading automation with discrete Jev choices.",
      },
      {
        slug: "usenotra-notra",
        blurb: "Note capture with structured Jev triage.",
      },
      {
        slug: "chetaslua-jevmeter",
        blurb: "Instrument latency and calibration of your own Jev calls.",
      },
    ],
    faq: [
      {
        question: "Do applications always expose Jev directly to users?",
        answer:
          "Usually no. Users see outcomes (ranked results, blocked actions). Jev runs server-side with thresholds set by the product team.",
      },
      {
        question: "What is the every CLI?",
        answer:
          "every scans functions in a codebase and scores how well each matches a natural-language yes/no question using Jev, caching hashes locally. See the every listing for self-test metrics and API key requirements.",
      },
      {
        question: "Can I submit my shipped app?",
        answer:
          "Yes. Use Submit on this site with a repo or demo link and a short note on how Jev primitives map to your UX.",
      },
      {
        question: "How do apps differ from playgrounds?",
        answer:
          "Playgrounds teach primitives interactively. Applications target a recurring job (moderate, triage, trade) even if they also ship a demo UI.",
      },
    ],
  },
};
