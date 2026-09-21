import type { FaqEntry } from "@/data/faq";
import { agentGuideBatch2Slugs, agentGuidesBatch2 } from "@/data/agent-guides-batch-2";
import { envSection } from "@/data/agent-guides-env";

export type {
  AgentGuide,
  AgentGuideSection,
  AgentGuideSource,
} from "@/data/agent-guides-types";

import type { AgentGuide } from "@/data/agent-guides-types";

export const agentGuidesHubSlug = "jev-with-ai-agents";

const agentGuideBatch1Slugs = [
  "hermes",
  "openclaw",
  "claude-code-desktop-cowork",
  "codex-and-opencode",
  "cursor-mcp-and-skills",
] as const;

export type AgentGuideBatch1Slug = (typeof agentGuideBatch1Slugs)[number];

export const agentGuideSlugs = [...agentGuideBatch1Slugs, ...agentGuideBatch2Slugs] as const;

export type AgentGuideSlug = (typeof agentGuideSlugs)[number];

export const agentGuidesHub = {
  title: "Jev with AI agents",
  tagline:
    "Let the chat model write prose. Let Jev decide which shell command, skill, route, or gate fires next.",
  seoTitle: "Jev with AI agents: LangChain, Cline, Copilot, more",
  seoDescription:
    "Setup guides for pairing Jev (System One decide) with Hermes, OpenClaw, Claude, Codex, Cursor, LangChain, Cline, Roo, GitHub Copilot Agent, Devin Desktop, and browser agents via MCP, langchain-typesafe, and skills.",
  intro:
    "Generative agents are brilliant at language and terrible at pretending to be a calibrated classifier. Jev answers fixed-shape questions with probabilities you can threshold in code. These guides map verified integrations from the ecosystem: Python harness middleware, reflex MCP servers, plugins, and agent skills that call POST /v1/systemone (or gateway equivalents) while your main model keeps the microphone.",
  faq: [
    {
      question: "Do I need a separate API key for every agent?",
      answer:
        "Usually one TypeSafe key is enough. Export TYPESAFE_API_KEY in the shell or service that launches the agent (or reference it from MCP config with env interpolation where supported). Vercel AI Gateway users can use AI_GATEWAY_API_KEY for gateway-routed Jev instead; see the learn guide on Vercel AI Gateway Jev.",
    },
    {
      question: "MCP server or agent skill: which comes first?",
      answer:
        "Skills teach the model when and how to design a Jev call. MCP servers expose tools like judge, evaluate, or jev_route that actually hit the API. Many teams install both: typesafe-ai/skills for patterns, plus a focused MCP package for the hot path.",
    },
    {
      question: "What happened to system1-mcp from Nous Research?",
      answer:
        "We did not find a public NousResearch/system1-mcp repository. The PyPI package system1-mcp (ericmaddox/system1-mcp) is a separate community reflex MCP server with fast_guard, fast_judge, fast_verify, and fast_score. Hermes users can still use Hermes plugins, generic MCP, blakestone-x/jev-mcp, or itsmostafa/typesafe-mcp.",
    },
    {
      question: "LangChain middleware vs MCP reflex tools: which first?",
      answer:
        "Use langchain-typesafe when you own the Python agent graph and want TypeSafeClassifier, ModelRouterMiddleware, or AutoModeMiddleware inside LangChain. Use system1-mcp or typesafe-mcp when the host is an IDE agent (Cline, Copilot, Cursor) that only speaks MCP. Many teams do both: middleware in production services, MCP in the editor.",
    },
    {
      question: "Is there a Muse plugin that uses Jev?",
      answer:
        "We did not find a documented OpenClaw or TypeSafe integration branded Muse with Jev-specific tools. If you discover one, submit it to the directory. Until then, treat Muse as unrelated to Jev unless the upstream README names TypeSafe or System One explicitly.",
    },
    {
      question: "Where do Choice, Score, and Noul show up in agents?",
      answer:
        "Approvals and routing use Choice (pick APPROVE/DENY/ESCALATE or a model route). Risk and severity use Score. Safety checks and policy fit use Noul (0 to 1). Parallel questions in one request are the default System One pattern; see /learn/system-one.",
    },
    {
      question: "Can Jev replace my main chat model?",
      answer:
        "No. Jev does not draft user-facing paragraphs or long reasoning chains. It gates, ranks, classifies, and scores. Keep Claude, GPT, Grok, or Hermes' primary model for language; add Jev where you would otherwise regex-parse YES/NO from a completion.",
    },
  ] satisfies FaqEntry[],
  alsoWorksWith: [
    {
      name: "pi-jev and pi routers",
      note: "Native pi extensions and routers in the directory (y0usaf, TheoOliveira, mejiasd3v). typesafe-mcp ships evaluate setup pi.",
      slug: "y0usaf-pi-jev",
    },
    {
      name: "Browser Use Ultrafast",
      note: "Jev picks the browser operation; a small LLM types only when needed.",
      slug: "browser-use-jev-ultrafast",
    },
    {
      name: "Hermes-Jev nervous system",
      note: "Community async supervision layer for Hermes (keeltrace/hermes-jev). Separate from anpicasso smart approvals.",
      slug: "keeltrace-hermes-jev",
    },
    {
      name: "jev-codex-router",
      note: "Per-turn Codex model routing via Jev and Codex Router extensions.",
      slug: "0xnatoshi-jev-codex-router",
    },
  ],
};

const agentGuidesBatch1: Record<AgentGuideBatch1Slug, AgentGuide> = {
  hermes: {
    slug: "hermes",
    title: "Hermes Agent + Jev",
    tagline: "Smart approvals, skill routing, and MCP without asking Hermes to fake a classifier.",
    seoTitle: "Hermes Agent + Jev: approvals, MCP, routing",
    seoDescription:
      "Install hermes-jev-approvals, typesafe-skill-router, and Jev MCP servers on Hermes Agent. Typed APPROVE/DENY/ESCALATE, parallel nouls, and catalog links with sources.",
    whyJev:
      "Hermes smart mode already sends flagged shell commands to an auxiliary reviewer that must answer APPROVE, DENY, or ESCALATE. A chat model burns tokens on reasoning you discard. Jev returns that shape natively, often alongside policy and safety nouls in one parallel call.",
    sections: [
      {
        h: "What Hermes is",
        body:
          "Hermes Agent is Nous Research's self-improving agent: terminal UI, gateway to Telegram/Discord/Slack, subagents, cron, and a plugin ecosystem. It is model-agnostic (Nous Portal, OpenRouter, local endpoints). Documentation lives at https://hermes-agent.nousresearch.com/docs/.",
      },
      {
        h: "Why pair Hermes with Jev",
        body:
          "Hermes separates primary reasoning from auxiliary tasks such as smart command approval. Those aux tasks are discrete decisions with fixed option sets, ideal for System One. Community plugins register Jev as the approval provider or inject skill hints before the main model call, without forking Hermes core.",
      },
      {
        h: "Smart command approvals (hermes-jev-approvals)",
        body:
          "The anpicasso/hermes-jev-approvals plugin replaces only the auxiliary approval reviewer when approvals.mode is smart. It refuses chat tasks, registers no hooks, and asks six parallel typed questions per flagged command: verdict Choice, policy Noul, blast radius Score, and safety nouls. Deterministic code maps answers to APPROVE, DENY, or ESCALATE.",
        code: {
          lang: "bash",
          content: `hermes plugins install anpicasso/hermes-jev-approvals/plugin
hermes auth add typesafe-jev
hermes config set approvals.mode smart
hermes config set auxiliary.approval.provider typesafe-jev
hermes config set auxiliary.approval.model jev-latest
systemctl --user restart hermes-gateway`,
        },
      },
      {
        h: "Operator policy text",
        body:
          "Set approvals.smart_policy with trusted clauses about routine git, cache cleanup, and what still needs human review. The plugin treats that text as a trusted channel; Jev scores policy_allows as a Noul against it.",
        code: {
          lang: "yaml",
          content: `approvals:
  mode: smart
  smart_policy: >-
    Killing browser processes and deleting cache directories are routine.
    Force-pushing, production databases, and shared infrastructure require review.`,
        },
      },
      {
        h: "Skill routing before the model call",
        body:
          "DECRUX9812/typesafe-skill-router is a Hermes plugin that asks Jev which single skill (if any) matches the user message, then appends a short skill_relevance block to the user message. It is opt-in, stdlib-only, and fail-open on errors. Enable with hermes typesafe-skill-router on after install.",
      },
      {
        h: "MCP on Hermes",
        body:
          "Hermes documents MCP integration for extending tool access (see the user guide feature page linked from the main README). You can attach community Jev MCP servers (for example blakestone-x/jev-mcp or itsmostafa/typesafe-mcp) the same way you attach other MCP servers, so Hermes tools can call typed classify/score/check endpoints alongside native skills.",
      },
      envSection("Hermes gateway and plugin processes"),
      {
        h: "Pitfalls",
        body:
          "Without smart_policy, benchmarks on the approvals plugin showed routine kills and git pushes escalated or denied. For OpenRouter, use the plugin README pattern (model ~typesafe/jev-latest with base_url) and do not put api_key under auxiliary.approval or Hermes bypasses the plugin. Plugins are profile-scoped: repeat install per HERMES_HOME. Malformed Jev answers escalate to the user by design.",
      },
    ],
    faq: [
      {
        question: "What is Hermes Jev in search results?",
        answer:
          "It usually means hermes-jev-approvals: Jev as the smart approval auxiliary. A separate community project, keeltrace/hermes-jev, adds async supervision and context routing; read its README before conflating the two.",
      },
      {
        question: "Can the Jev approval plugin chat?",
        answer:
          "No. The anpicasso provider serves auxiliary.approval only and refuses other auxiliary tasks.",
      },
      {
        question: "Does skill routing load every skill into context?",
        answer:
          "No. typesafe-skill-router injects at most one skill hint line when Jev finds a fit; otherwise it injects nothing.",
      },
      {
        question: "OpenRouter vs direct TypeSafe for approvals?",
        answer:
          "The approvals README documents both. Direct TypeSafe uses provider typesafe-jev and model jev-latest. OpenRouter uses model ~typesafe/jev-latest with OpenRouter alpha base_url and hermes auth add openrouter.",
      },
      {
        question: "Where are measured latency numbers?",
        answer:
          "The directory listing for anpicasso-hermes-jev-approvals summarizes PoC benchmarks (latency and prompt counts vs auxiliary chat). Always read the linked GitHub README for methodology.",
      },
    ],
    relatedCatalogSlugs: [
      "anpicasso-hermes-jev-approvals",
      "decrux9812-typesafe-skill-router",
      "keeltrace-hermes-jev",
      "blakestone-x-jev-mcp",
      "itsmostafa-typesafe-mcp",
    ],
    relatedAgentSlugs: ["openclaw", "cursor-mcp-and-skills"],
    sources: [
      { label: "Hermes Agent docs", url: "https://hermes-agent.nousresearch.com/docs/" },
      { label: "hermes-jev-approvals README", url: "https://github.com/anpicasso/hermes-jev-approvals" },
      { label: "typesafe-skill-router README", url: "https://github.com/DECRUX9812/typesafe-skill-router" },
      { label: "Hermes MCP feature doc", url: "https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp" },
    ],
  },

  openclaw: {
    slug: "openclaw",
    title: "OpenClaw + Jev",
    tagline: "Assistant OS from OpenClaw, decide layer from Jev. Routing, gates, and official decisionModel support.",
    seoTitle: "OpenClaw + Jev: jev-claw routing and harness gates",
    seoDescription:
      "Layer OpenClaw plugins jev-claw and jev-harness, plus bundled typesafe/jev-latest decisionModel. Tools, config, and when to route vs gate.",
    whyJev:
      "OpenClaw orchestrates sessions, channels, tools, and generative providers. Many steps are still classification: which model tier, whether to run a shell command, whether the agent is stuck. Jev answers those with probabilities; plugins map answers to routes and gates.",
    sections: [
      {
        h: "What OpenClaw is",
        body:
          "OpenClaw is an assistant operating system: multi-channel agents, tool execution, and pluggable providers. Third-party plugins extend tools and policies without replacing the host runtime. See https://docs.openclaw.ai for host documentation.",
      },
      {
        h: "Official TypeSafe decision models in OpenClaw",
        body:
          "OpenClaw merged bundled TypeSafe Jev models as an opt-in decisionModel provider (for example typesafe/jev-latest or typesafe/jev-1.13.0). The role stays disabled until selected. An optional typesafe_evaluate tool returns typed scores or probabilities after validation. Credentials use the host SecretRef pattern; billing follows TypeSafe API usage.",
      },
      {
        h: "jev-claw: typed model routing",
        body:
          "The jev-claw plugin (documented on openclawdir.com) exposes jev_route: a single tool that classifies task_type, complexity, and risk, then returns route, confidence, needs_second_opinion, and reasons. Inputs include task text, changed_files, previous_attempts, and test_status. Routing is a classification problem; Jev returns fixed labels with probabilities rather than free-form routing prose.",
      },
      {
        h: "jev-harness: policy and gates",
        body:
          "The jev-harness OpenClaw plugin wraps AntonioCoppe/jev-harness (npm library) for the decide layer: shell exec gates, tool allow/deny, model cost routing, inbox triage, browser next action, and stuck-agent recovery. OpenClaw keeps generative work on Claude, Codex, or other providers; this plugin applies Choice/Score/Noul plus confidence thresholds and shadow mode.",
        code: {
          lang: "json5",
          content: `{
  plugins: {
    entries: {
      "jev-harness": {
        enabled: true,
        config: {
          mode: "live",
          gateExec: true,
          gateTools: false,
          toolAllowlist: ["web_search", "read"],
          knownSafeCommands: ["ls", "pwd", "git status", "git diff"],
        },
      },
    },
  },
}`,
        },
      },
      {
        h: "Choose jev-claw vs jev-harness vs decisionModel",
        body:
          "Use jev-claw when you need multi-model routing labels (cheap vs frontier, second opinion). Use jev-harness when you need pre-tool or pre-shell gates with recipes and shadow evals. Use the bundled decisionModel provider when you want host-native typed evaluation via typesafe_evaluate without a separate plugin tool surface.",
      },
      envSection("OpenClaw plugin processes"),
      {
        h: "Pitfalls",
        body:
          "jev-claw documents OpenClaw >= 2026.9.0 and Node 24+. Prefer TYPESAFE_API_KEY in the environment or ~/.config/typesafe/api_key where the plugin supports it. jev-harness is not affiliated with TypeSafe or OpenClaw Foundation; read license and maintenance on GitHub. Start in shadow mode when tuning policies so Jev logs actions without changing live behavior.",
      },
    ],
    faq: [
      {
        question: "Does Jev replace OpenClaw's chat model?",
        answer:
          "No. Plugins and decisionModel roles handle structured decisions. Generative coding and conversation stay on your selected OpenClaw providers.",
      },
      {
        question: "Where is jev-harness source?",
        answer:
          "The npm package and GitHub repo are github.com/AntonioCoppe/jev-harness. The OpenClaw plugin page describes how it maps recipes to plugin tools.",
      },
      {
        question: "What routes does jev_route return?",
        answer:
          "openclawdir documents route labels such as cheap, main, architect, debugger, reviewer, claude-builder, claude-critic, and frontier, plus task_type and risk enums. Verify the current table in the plugin listing before hard-coding policies.",
      },
      {
        question: "Can I run both jev-claw and jev-harness?",
        answer:
          "Yes, with clear ownership: routing vs gating. Avoid duplicate gates on the same action without coordinating policy order in OpenClaw config.",
      },
    ],
    relatedCatalogSlugs: ["antoniocoppe-jev-harness"],
    relatedAgentSlugs: ["hermes", "claude-code-desktop-cowork"],
    sources: [
      { label: "OpenClaw docs", url: "https://docs.openclaw.ai" },
      { label: "jev-claw plugin listing", url: "https://openclawdir.com/plugins/jev-claw-zp0spu" },
      { label: "jev-harness plugin listing", url: "https://openclawdir.com/plugins/jev-harness-7xg6sd" },
      { label: "jev-harness library README", url: "https://github.com/AntonioCoppe/jev-harness" },
      { label: "OpenClaw Chronicles: TypeSafe decision models", url: "https://openclawchronicles.com/posts/openclaw-2026-9-19-typesafe-decision-models/" },
    ],
  },

  "claude-code-desktop-cowork": {
    slug: "claude-code-desktop-cowork",
    title: "Claude Code, Desktop, and Cowork + Jev",
    tagline: "Plugins, MCP connectors, and TypeSafe skills on Anthropic's agent stack.",
    seoTitle: "Claude Code and Cowork + Jev: MCP and skills",
    seoDescription:
      "Wire Jev into Claude Code and Cowork using typesafe-ai/skills, jev-judge-mcp, typesafe-mcp evaluate, and jevwire. Env keys, install commands, and Cowork Customize notes.",
    whyJev:
      "Claude products already support MCP connectors and skills. Jev fits where Claude would otherwise guess a label in prose: moderation, routing, verification, and pre-tool gates. TypeSafe publishes an official agent skill; community MCP servers expose evaluate or judge tools.",
    sections: [
      {
        h: "What this stack is",
        body:
          "Claude Code is Anthropic's terminal agent for software work. Claude Desktop includes Cowork, an agentic workspace that shares Claude Code's architecture for multi-step knowledge work on local files. Cowork loads connectors (MCP), skills, and plugins from Customize on claude.ai, synced at session start. It does not read Claude Code's ~/.claude directory unless you add the same capability in Customize.",
      },
      {
        h: "Official TypeSafe agent skill",
        body:
          "typesafe-ai/skills is the maintained skill for designing System One workflows. Claude Code can install it as a marketplace plugin; other agents use npx skills add.",
        code: {
          lang: "bash",
          content: `claude plugin marketplace add typesafe-ai/skills
claude plugin install typesafe@typesafe-ai

# Other agents:
npx skills add typesafe-ai/skills --skill typesafe-ai`,
        },
      },
      {
        h: "jev-judge-mcp (single judge tool)",
        body:
          "gecm0/jev-judge-mcp registers one MCP tool, judge, for narrow typed questions over evidence you supply. Claude Code can install marketplace + plugin typesafe@jev in one step (server and skill bundled). Also supports generic stdio MCP config for Desktop.",
        code: {
          lang: "bash",
          content: `claude plugin marketplace add gecm0/jev-judge-mcp
claude plugin install typesafe@jev

npx skills add gecm0/jev-judge-mcp --skill jev
npx skills add typesafe-ai/skills --skill typesafe-ai`,
        },
      },
      {
        h: "typesafe-mcp evaluate (Go MCP server)",
        body:
          "itsmostafa/typesafe-mcp exposes an evaluate tool and can register with Claude Code, Claude Desktop, and Codex via evaluate setup mcp. It targets POST /v1/systemone (or OpenRouter decisions when configured).",
        code: {
          lang: "bash",
          content: `curl -fsSL https://raw.githubusercontent.com/itsmostafa/typesafe-mcp/main/install.sh | sh
TYPESAFE_API_KEY=your-key evaluate setup mcp`,
        },
      },
      {
        h: "jevwire hooks (Brainwires)",
        body:
          "Brainwires/jevwire ships MCP tools (jev_evaluate, jev_rank, jev_verify, jev_gate_action, and others) plus a Claude Code plugin whose hooks run at harness boundaries. Install via /plugin marketplace add Brainwires/jevwire and set TYPESAFE_API_KEY in plugin settings.",
      },
      {
        h: "Cowork-specific notes",
        body:
          "Cowork supports the same connectors and skills model as other Claude products: add MCP servers in Customize, enable skills, or install role plugins from Anthropic's knowledge-work-plugins repo. Pair a Jev MCP connector with typesafe-ai/skills the same way Canva or Notion ship connector plus skill playbooks. Cowork changelog documents on-demand MCP tool loading (toolSearchEnabled) to reduce context from large tool schemas.",
      },
      envSection("Claude Code, Desktop, and Cowork sessions"),
      {
        h: "Pitfalls",
        body:
          "Do not install jev-judge-mcp twice (plugin plus manual claude mcp add) or you will duplicate servers. Codex config may embed literal keys in TOML; prefer exporting TYPESAFE_API_KEY in the launching shell when possible. jev-judge-mcp does not load .env files. For Cowork, skills that exist only under ~/.claude must be added in Customize to appear in Cowork sessions.",
      },
    ],
    faq: [
      {
        question: "Does Cowork use Claude Code MCP config on disk?",
        answer:
          "Cowork syncs enabled connectors and skills from Customize on your claude.ai account at session start, not from ~/.claude automatically.",
      },
      {
        question: "Which MCP should I pick?",
        answer:
          "jev-judge-mcp if you want one opinionated judge tool and skill. typesafe-mcp if you want a single evaluate tool with multi-client setup script. jevwire if you want hook-based gates plus multiple tools.",
      },
      {
        question: "Can Desktop use the same plugin marketplace entries as Code?",
        answer:
          "MCP connectors are supported across Claude products; exact UI paths differ. Follow each README for Claude Code vs Desktop registration.",
      },
      {
        question: "Where is Claude MCP documentation?",
        answer:
          "See code.claude.com/docs for MCP quickstart and connector patterns.",
      },
      {
        question: "Does the TypeSafe skill call the API by itself?",
        answer:
          "The skill teaches workflow design and points to docs. You still need an SDK, gateway, or MCP tool for live inference.",
      },
    ],
    relatedCatalogSlugs: [
      "typesafe-ai-skills",
      "itsmostafa-typesafe-mcp",
      "brainwires-jevwire",
      "rashedint32-jev-mcp",
      "belazy167-typesafe-mod",
      "shivampansuriya-jev-skill-gate",
    ],
    relatedAgentSlugs: ["codex-and-opencode", "cursor-mcp-and-skills"],
    sources: [
      { label: "typesafe-ai/skills README", url: "https://github.com/typesafe-ai/skills" },
      { label: "TypeSafe agent skill docs", url: "https://docs.typesafe.ai/agent-skill" },
      { label: "jev-judge-mcp README", url: "https://github.com/gecm0/jev-judge-mcp" },
      { label: "typesafe-mcp README", url: "https://github.com/itsmostafa/typesafe-mcp" },
      { label: "Cowork overview", url: "https://claude.com/docs/cowork/overview" },
      { label: "Claude MCP quickstart", url: "https://code.claude.com/docs/en/mcp-quickstart" },
    ],
  },

  "codex-and-opencode": {
    slug: "codex-and-opencode",
    title: "Codex and OpenCode + Jev",
    tagline: "jev-judge on the CLI, evaluate setup, and routers that treat Jev as traffic control.",
    seoTitle: "Codex and OpenCode + Jev: judge MCP and routers",
    seoDescription:
      "Add jev-judge-mcp to Codex and OpenCode, use typesafe-mcp evaluate setup, and explore jev-codex-router. MCP config shapes, skills, and fail-open routing patterns.",
    whyJev:
      "Codex and OpenCode spend quota on big models for small forks in the road. Jev classifies the next step, scores skill relevance, or judges evidence before you pay for another full reasoning pass.",
    sections: [
      {
        h: "What Codex and OpenCode are",
        body:
          "OpenAI Codex is a coding agent with CLI and desktop clients that support MCP servers via config (for example ~/.codex/config.toml). OpenCode is an open agent stack with mcp add helpers and opencode.jsonc configuration. Both can load stdio MCP servers and agent skills from SKILL.md directories.",
      },
      {
        h: "jev-judge-mcp install",
        body:
          "gecm0/jev-judge-mcp documents first-class Codex and OpenCode lines. Register stdio npx -y jev-judge-mcp, install the jev skill, and add typesafe-ai as a companion skill.",
        code: {
          lang: "bash",
          content: `codex mcp add jev -- npx -y jev-judge-mcp
opencode mcp add jev -- npx -y jev-judge-mcp

npx skills add gecm0/jev-judge-mcp --skill jev
npx skills add typesafe-ai/skills --skill typesafe-ai`,
        },
      },
      {
        h: "Example Codex MCP table",
        body:
          "If you configure by hand, Codex uses a [mcp_servers.jev] table. Prefer environment export for secrets instead of literals when your client version allows it.",
        code: {
          lang: "toml",
          content: `[mcp_servers.jev]
command = "npx"
args = ["-y", "jev-judge-mcp"]
# Codex may require env literals in some versions; exporting TYPESAFE_API_KEY in the parent shell is safer.`,
        },
      },
      {
        h: "typesafe-mcp evaluate",
        body:
          "The Go evaluate CLI can register the same MCP server with Codex in one step: TYPESAFE_API_KEY=... evaluate setup mcp. OpenRouter keys work when documented in the README.",
      },
      {
        h: "jev-codex-router",
        body:
          "0xNatoshi/jev-codex-router is a Codex Router extension that classifies each turn with Jev and selects model plus reasoning effort, fail-open on errors. It is separate from jev-judge-mcp but shows the same pattern: Jev on the routing edge, native Codex execution behind it.",
      },
      {
        h: "Using judge well",
        body:
          "The bundled jev skill teaches the one-second test: ask factors Jev can answer at a glance, fan out parallel questions, and compose the final decision in code. judge rejects obvious generative requests; supply evidence, not homework for Jev to write.",
      },
      envSection("Codex and OpenCode launch environment"),
      {
        h: "Pitfalls",
        body:
          "Restart the client after MCP changes so judge appears in the tool list. TYPESAFE_MODEL pins a version; jev-latest follows TypeSafe's moving alias. Without a key, jev-judge-mcp lists the tool but fails fast with a clear error. Do not confuse OpenCode demo projects in the showcase with official OpenCode MCP docs; verify commands on github.com/gecm0/jev-judge-mcp.",
      },
    ],
    faq: [
      {
        question: "Claude Code plugin vs Codex mcp add?",
        answer:
          "Claude uses marketplace plugins; Codex uses codex mcp add or TOML. The same jev-judge-mcp package backs both via stdio.",
      },
      {
        question: "OpenCode v2 config shape?",
        answer:
          "jev-judge-mcp README references opencode.jsonc with mcp.servers.jev and type local. Use opencode mcp add when available so the CLI writes the correct shape for your version.",
      },
      {
        question: "Can Jev write code for me in Codex?",
        answer:
          "No. judge is for typed judgments over supplied evidence. Let Codex's primary model generate code.",
      },
      {
        question: "What is jev/auto in jev-codex-router?",
        answer:
          "The router exposes a curated model entry that forwards through a local Jev classification server before selecting native Codex models. See the router README for ports and kill switch behavior.",
      },
    ],
    relatedCatalogSlugs: [
      "0xnatoshi-jev-codex-router",
      "itsmostafa-typesafe-mcp",
      "brainwires-jevwire",
    ],
    relatedAgentSlugs: ["claude-code-desktop-cowork", "cursor-mcp-and-skills"],
    sources: [
      { label: "jev-judge-mcp README", url: "https://github.com/gecm0/jev-judge-mcp" },
      { label: "typesafe-mcp README", url: "https://github.com/itsmostafa/typesafe-mcp" },
      { label: "jev-codex-router README", url: "https://github.com/0xNatoshi/jev-codex-router" },
      { label: "typesafe-ai/skills", url: "https://github.com/typesafe-ai/skills" },
    ],
  },

  "cursor-mcp-and-skills": {
    slug: "cursor-mcp-and-skills",
    title: "Cursor, Grok, and agent skills + Jev",
    tagline: "MCP in Cursor settings, TypeSafe skills in the agent, no imaginary Grok-only APIs.",
    seoTitle: "Cursor agents + Jev: MCP servers and skills",
    seoDescription:
      "Add jev-mcp to Cursor MCP config, install typesafe-ai/skills for Cloud Agents, and use Jev beside Grok or other models without custom Grok Bot APIs.",
    whyJev:
      "Cursor agents and Grok-powered bots still need gates: which skill to load, whether a command is safe, whether to escalate. Jev does that with probabilities; the editor's model does the talking.",
    sections: [
      {
        h: "What Cursor provides",
        body:
          "Cursor is an AI-native editor with chat, Cloud Agents, MCP server configuration, and agent skills (SKILL.md) loaded for compatible agent modes. There is no separate documented Grok Bot API for Jev: when you use Grok as a model inside Cursor or related X integrations, wire Jev the same way you would for any other model (MCP tools and skills).",
      },
      {
        h: "Register Jev MCP in Cursor",
        body:
          "Community MCP servers document a Cursor mcpServers block. blakestone-x/jev-mcp is a common starting point (classify, score, check via uvx). Set TYPESAFE_API_KEY in the env block or your shell.",
        code: {
          lang: "json",
          content: `{
  "mcpServers": {
    "jev": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/blakestone-x/jev-mcp@v0.2.1", "jev-mcp"],
      "env": { "TYPESAFE_API_KEY": "..." }
    }
  }
}`,
        },
      },
      {
        h: "Agent skills in Cursor",
        body:
          "Install TypeSafe's official skill so the agent learns System One patterns before calling tools:",
        code: {
          lang: "bash",
          content: `npx skills add typesafe-ai/skills --skill typesafe-ai
# Optional judge playbook:
npx skills add gecm0/jev-judge-mcp --skill jev`,
        },
      },
      {
        h: "jevwire and other MCP toolkits",
        body:
          "Brainwires/jevwire documents multiple tools (jev_evaluate, jev_rank, jev_verify, jev_gate_action) and npm package jevwire for Streamable MCP. rashedInt32/jev-mcp and burnigtm/jev-mcp are alternate servers listed in the directory; compare tool surfaces before picking one.",
      },
      {
        h: "Grok in the loop",
        body:
          "Demos such as pixelml-av-grok-jev show Grok generating answers while Jev filters evidence and checks support. That pattern is application-level (RAG plus refiner), not a Cursor-built Grok feature. In Cursor, you might use Grok as the chat model while Jev MCP tools handle decide steps; keep responsibilities split.",
      },
      {
        h: "Cloud Agents and keys",
        body:
          "Cloud Agents need secrets in the environment the remote worker uses, not only your laptop shell. Follow Cursor documentation for MCP and env injection on cloud runs. Rotate keys if they ever appear in committed mcp.json.",
      },
      envSection("Cursor MCP and agent processes"),
      {
        h: "Pitfalls",
        body:
          "Pin MCP package versions (git tags or npm versions) so builds do not drift. MCP tools are not automatic: the model must call them unless you use a separate hook-based plugin on Claude Code. Avoid stuffing every Jev MCP schema into context when you only need judge; pick one server. Read each server's license and data handling before sending production content.",
      },
    ],
    faq: [
      {
        question: "Is there a Grok Bot-only Jev SDK?",
        answer:
          "We did not find one. Use standard TypeSafe credentials and documented MCP or HTTP APIs regardless of which chat model Cursor selects.",
      },
      {
        question: "Cursor vs Claude Code for jev-judge?",
        answer:
          "jev-judge-mcp targets Claude Code, Codex, and OpenCode explicitly. Cursor users typically register the same stdio server manually in MCP settings.",
      },
      {
        question: "Which jev-mcp fork?",
        answer:
          "blakestone-x/jev-mcp documents Cursor config. arunav25 and rashedInt32 forks add benchmarking or extra tools; read README diffs on the catalog detail pages.",
      },
      {
        question: "Skills vs MCP in Cursor?",
        answer:
          "Skills steer prompting and workflow design. MCP executes typed calls. Use both when the agent needs to know when to judge and a tool to do it.",
      },
      {
        question: "Gateway instead of direct TypeSafe?",
        answer:
          "See /learn/vercel-ai-gateway for AI_GATEWAY_API_KEY and model ids when your stack already routes through Vercel.",
      },
    ],
    relatedCatalogSlugs: [
      "blakestone-x-jev-mcp",
      "brainwires-jevwire",
      "rashedint32-jev-mcp",
      "typesafe-ai-skills",
      "browser-use-jev-ultrafast",
    ],
    relatedAgentSlugs: ["claude-code-desktop-cowork", "hermes", "cline-and-roo", "github-copilot-agent"],
    sources: [
      { label: "blakestone-x/jev-mcp README", url: "https://github.com/blakestone-x/jev-mcp" },
      { label: "typesafe-ai/skills", url: "https://github.com/typesafe-ai/skills" },
      { label: "jev-judge-mcp README", url: "https://github.com/gecm0/jev-judge-mcp" },
      { label: "Cursor MCP docs", url: "https://docs.cursor.com/context/mcp" },
      { label: "TypeSafe System One docs", url: "https://docs.typesafe.ai/concepts/system-one" },
    ],
  },
};

export const agentGuides: Record<AgentGuideSlug, AgentGuide> = {
  ...agentGuidesBatch1,
  ...agentGuidesBatch2,
};

export function getAgentGuide(slug: string): AgentGuide | undefined {
  if (!(agentGuideSlugs as readonly string[]).includes(slug)) return undefined;
  return agentGuides[slug as AgentGuideSlug];
}

export function agentGuidePath(slug?: string): string {
  if (!slug || slug === agentGuidesHubSlug) return `/guides/${agentGuidesHubSlug}`;
  return `/guides/${agentGuidesHubSlug}/${slug}`;
}
