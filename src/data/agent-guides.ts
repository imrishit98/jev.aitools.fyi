import type { FaqEntry } from "@/data/faq";

export type AgentGuideSource = { label: string; url: string };

export type AgentGuideSection = {
  h: string;
  body: string;
  code?: { lang: string; content: string };
};

export type AgentGuide = {
  slug: string;
  title: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  whyJev: string;
  sections: AgentGuideSection[];
  faq: FaqEntry[];
  relatedCatalogSlugs: string[];
  relatedAgentSlugs?: string[];
  sources: AgentGuideSource[];
};

export const agentGuidesHubSlug = "jev-with-ai-agents";

export const agentGuideSlugs = [
  "hermes",
  "openclaw",
  "claude-code-desktop-cowork",
  "codex-and-opencode",
  "cursor-mcp-and-skills",
  "langchain-langgraph",
  "cline-and-roo",
  "github-copilot-agent",
  "devin-desktop",
  "browser-computer-use",
] as const;

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

const envSection = (agent: string): AgentGuideSection => ({
  h: "Environment keys",
  body: `Create a key at https://console.typesafe.ai/ (or route through Vercel AI Gateway / OpenRouter where the integration documents it). Export TYPESAFE_API_KEY in the environment for ${agent}. Some MCP clients accept AI_GATEWAY_API_KEY when using gateway-hosted Jev models; follow that integration's README. Never commit keys into repos or paste them into chat logs.`,
  code: {
    lang: "bash",
    content: `export TYPESAFE_API_KEY="tsk_..."
# Optional pin:
export TYPESAFE_MODEL="jev-latest"`,
  },
});

export const agentGuides: Record<AgentGuideSlug, AgentGuide> = {
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
      "ussyverse-hermes-jev-router",
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
      "opencode-browser-use-powered-by-jev",
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

  "langchain-langgraph": {
    slug: "langchain-langgraph",
    title: "LangChain and LangGraph + Jev",
    tagline:
      "TypeSafeClassifier in your graph, experimental middleware for routing and Auto Mode gates, no fake chat classifiers.",
    seoTitle: "LangChain + Jev: typesafe classifier and middleware",
    seoDescription:
      "Install langchain-typesafe, use Choice, Score, and Noul with TypeSafeClassifier, and add ModelRouterMiddleware or AutoModeMiddleware. LangChain blog patterns, pitfalls, and catalog links.",
    whyJev:
      "LangGraph loops burn a full LLM call every time you need a label, a route, or a pre-tool risk check. Jev returns typed probabilities in one parallel request. The official langchain-typesafe package wraps that as a LangChain Runnable plus optional agent middleware, so your Python harness stays boring and your bills stay smaller.",
    sections: [
      {
        h: "What LangChain and LangGraph give you",
        body:
          "LangChain is the provider-agnostic composition layer for agents: tools, messages, runnables, and tracing. LangGraph adds durable state machines on top when you need checkpoints and branching. Jev does not replace either stack. It sits on the decide edges where you would otherwise prompt a chat model for YES/NO or pick-one answers.",
      },
      {
        h: "Install langchain-typesafe",
        body:
          "The PyPI package langchain-typesafe is maintained by LangChain. Set TYPESAFE_API_KEY before invoking. For experimental middleware (ModelRouterMiddleware, AutoModeMiddleware), install the experimental extra documented on PyPI.",
        code: {
          lang: "bash",
          content: `uv add langchain-typesafe
# Middleware (APIs under langchain_typesafe.experimental may change):
uv add "langchain-typesafe[experimental]"
export TYPESAFE_API_KEY="tsk_..."`,
        },
      },
      {
        h: "TypeSafeClassifier and parallel questions",
        body:
          "TypeSafeClassifier is a LangChain Runnable. Pass a ClassifierRequest with state (text, structured JSON, or LangChain messages) and a questions map built from Choice, Score, and Noul helpers. invoke and ainvoke return separate answer objects per question. System One evaluates questions in parallel, so adding nouls costs little compared to chaining chat calls.",
        code: {
          lang: "python",
          content: `from langchain_typesafe import Choice, Noul, Score, TypeSafeClassifier

classifier = TypeSafeClassifier()

result = classifier.invoke({
    "state": "Deploy failed twice; customers see 500s. Can someone look now?",
    "questions": {
        "department": Choice(
            instructions="Which team should own this?",
            criteria={
                "billing": "Payments or subscriptions",
                "technical": "Product or integration failure",
            },
        ),
        "urgent": Noul(instructions="Does this need attention right now?"),
        "severity": Score(
            instructions="How severe is the outage?",
            criteria=["low", "medium", "high"],
        ),
    },
})`,
        },
      },
      {
        h: "ModelRouterMiddleware (model pick once per run)",
        body:
          "LangChain's Building a Harness with Jev post walks through ModelRouterMiddleware: define ModelChoice entries with model ids and criteria, add instructions for cost-aware routing, and attach the middleware when you create_agent. The router classifies the latest human message once per agent run and stores the full ChoiceAnswer in agent state so probabilities remain visible in traces.",
        code: {
          lang: "python",
          content: `from langchain.agents import create_agent
from langchain_typesafe.experimental.middleware import (
    ModelChoice,
    ModelRouterMiddleware,
)

router = ModelRouterMiddleware(
    choices={
        "fast": ModelChoice(
            model="openai:gpt-5-mini",
            criteria="Simple, well-scoped tasks.",
        ),
        "powerful": ModelChoice(
            model="openai:gpt-5",
            criteria="Architecture and high-stakes debugging.",
        ),
    },
    instructions="Choose the least costly model that can complete the task.",
)

agent = create_agent("openai:gpt-5-mini", middleware=[router])`,
        },
      },
      {
        h: "AutoModeMiddleware (block risky tools)",
        body:
          "AutoModeMiddleware classifies configured tools before execution. Pass tool names or BaseTool instances, tune NoulCriteria for what counts as risky versus read-only, and let Jev return a ToolMessage error when risk crosses the threshold. This mirrors the harness gate pattern described in LangChain's Jev post, but stays in your open Python code instead of a closed IDE plugin.",
        code: {
          lang: "python",
          content: `from langchain_typesafe import NoulCriteria
from langchain_typesafe.experimental.middleware import AutoModeMiddleware

auto_mode = AutoModeMiddleware(
    tools=["bash"],
    criteria=NoulCriteria(
        true="The call writes, deletes, publishes, or changes access.",
        false="The call only reads public or user-provided data.",
    ),
)`,
        },
      },
      {
        h: "LangGraph nodes without middleware",
        body:
          "When you already have a LangGraph node, call TypeSafeClassifier directly inside the node. Keep state serialization explicit: BaseMessage lists are converted to role/content objects automatically, but business fields you add stay yours. Compose final branching in Python using thresholds on nouls and choice probabilities, not by parsing model prose.",
      },
      envSection("LangChain agent processes and notebooks"),
      {
        h: "Pitfalls",
        body:
          "Experimental middleware APIs may change without notice; pin versions in production. TypeSafeClassifier is not a text generator: do not ask it to draft user emails. Catch TypeSafeRateLimitError when you need retry metadata; LangChain model errors still apply for shared handling. Read the LangChain blog post for product claims; this guide sticks to integration shapes from PyPI and public docs.",
      },
    ],
    faq: [
      {
        question: "Does langchain-typesafe require LangGraph?",
        answer:
          "No. TypeSafeClassifier works in any Runnable pipeline. Middleware targets LangChain create_agent flows documented on PyPI.",
      },
      {
        question: "Where is the official LangChain Jev walkthrough?",
        answer:
          "LangChain published Building a Harness with Jev at langchain.com/blog/building-a-harness-with-jev with routing and Auto Mode examples.",
      },
      {
        question: "Can I route models every turn instead of once per run?",
        answer:
          "ModelRouterMiddleware documents once-per-run classification of the latest human message. For per-turn routing in other hosts, see directory routers such as jev-codex-router or OpenClaw jev-claw.",
      },
      {
        question: "LangChain vs MCP for the same gate?",
        answer:
          "Middleware runs inside your Python service. MCP reflex tools (system1-mcp fast_guard, typesafe-mcp evaluate) attach to IDE agents. Pick the surface your operator actually uses.",
      },
      {
        question: "What model id should I pass?",
        answer:
          "TypeSafeClassifier uses TypeSafe defaults unless you override them in client configuration. Pin jev-latest or a versioned id to match your compliance notes.",
      },
    ],
    relatedCatalogSlugs: [
      "jvsteiner-jevex",
      "vercel-eve",
      "classifier-dev",
      "typesafe-ai-skills",
      "antoniocoppe-jev-harness",
    ],
    relatedAgentSlugs: ["openclaw", "codex-and-opencode", "cursor-mcp-and-skills"],
    sources: [
      { label: "Building a Harness with Jev (LangChain)", url: "https://www.langchain.com/blog/building-a-harness-with-jev" },
      { label: "langchain-typesafe on PyPI", url: "https://pypi.org/project/langchain-typesafe" },
      { label: "LangChain TypeSafe integration docs", url: "https://docs.langchain.com/oss/python/integrations/providers/typesafe" },
      { label: "TypeSafe System One concepts", url: "https://docs.typesafe.ai/concepts/system-one" },
    ],
  },

  "cline-and-roo": {
    slug: "cline-and-roo",
    title: "Cline and Roo Code + Jev",
    tagline: "MCP reflex tools in the VS Code sidebar agent. system1-mcp installer or typed evaluate servers.",
    seoTitle: "Cline and Roo + Jev: MCP reflex and evaluate",
    seoDescription:
      "Wire Jev into Cline and Roo via system1-mcp uvx install, itsmostafa/typesafe-mcp, or jev-mcp. cline_mcp_settings.json, tool surfaces, env keys, and pitfalls.",
    whyJev:
      "Cline and Roo are VS Code agents that happily run terminal commands if you let them. That is exactly when you want a reflex layer: block destructive rm -rf moments, pick among three config files, or verify test output without another 2k-token monologue.",
    sections: [
      {
        h: "What Cline and Roo are",
        body:
          "Cline is an open VS Code extension agent with MCP server management in the Cline panel (stacked servers icon, Configure tab). Roo Code is a popular fork with a similar MCP story and compatible mcpServers JSON. Both speak stdio MCP and can load community servers alongside built-in tools. Cline CLI reads ~/.cline/data/settings/cline_mcp_settings.json (see Cline configuration docs on GitHub).",
      },
      {
        h: "Fastest path: system1-mcp installer",
        body:
          "The system1-mcp PyPI package documents uvx system1-mcp install with autodetection for Cline, Roo Code, Cursor, Claude Desktop, Windsurf, and other hosts. It registers four reflex tools: fast_guard, fast_judge, fast_verify, and fast_score. Keys resolve from TYPESAFE_API_KEY, ~/.system1/config.json, or workspace .env per the README.",
        code: {
          lang: "bash",
          content: `uvx system1-mcp install
# Or non-interactive:
uvx system1-mcp install --api-key tsk_...
uvx system1-mcp doctor`,
        },
      },
      {
        h: "Manual MCP block (Cline / Roo)",
        body:
          "If you prefer hand-edited JSON, open Cline MCP Servers, Configure MCP Servers, and add an mcpServers entry. Roo uses the same top-level mcpServers shape in its MCP settings UI. Prefer env interpolation (${env:TYPESAFE_API_KEY}) where supported instead of pasting secrets into committed files.",
        code: {
          lang: "json",
          content: `{
  "mcpServers": {
    "system1": {
      "command": "uvx",
      "args": ["system1-mcp"],
      "env": {
        "TYPESAFE_API_KEY": "\${env:TYPESAFE_API_KEY}"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
        },
      },
      {
        h: "typesafe-mcp evaluate (single evaluate tool)",
        body:
          "itsmostafa/typesafe-mcp exposes evaluate for POST /v1/systemone shaped calls. Install via the project install.sh, then evaluate setup mcp when the README documents your client. Tool names differ from system1-mcp: you get a general evaluate surface rather than fast_guard presets.",
        code: {
          lang: "bash",
          content: `curl -fsSL https://raw.githubusercontent.com/itsmostafa/typesafe-mcp/main/install.sh | sh
export TYPESAFE_API_KEY="tsk_..."
evaluate setup mcp`,
        },
      },
      {
        h: "blakestone-x/jev-mcp (classify, score, check)",
        body:
          "blakestone-x/jev-mcp documents Cursor-style uvx git installs and exposes jev-oriented tools (classify, score, check) for agents that want lower-level System One calls. Compare tool schemas before enabling two Jev servers at once, or the model will drown in duplicates.",
      },
      {
        h: "Teach the agent to call reflex tools",
        body:
          "MCP registration alone does not force usage. system1-mcp ships AGENTS.md guidance: call fast_guard before shell commands, fast_judge when choosing among candidates, fast_verify on logs. Paste the snippet into your repo CLAUDE.md, AGENTS.md, or Cline custom instructions so the reflex layer runs on the hot path.",
      },
      envSection("Cline, Roo, and uvx MCP child processes"),
      {
        h: "Pitfalls",
        body:
          "Cline CLI MCP paths differ from the VS Code extension file; verify ~/.cline/data/settings/cline_mcp_settings.json for CLI runs. Restart or reconnect MCP after edits. fast_* tools are advisory: your harness still owns final execution. Do not enable both system1-mcp and a second full Jev MCP server unless you need both tool shapes.",
      },
    ],
    faq: [
      {
        question: "Does Roo use the same MCP file as Cline?",
        answer:
          "Roo documents its own MCP settings path in the Roo UI, but the JSON schema matches Claude-style mcpServers blocks. system1-mcp install targets both when autodetect succeeds.",
      },
      {
        question: "fast_guard vs evaluate?",
        answer:
          "fast_guard is a preset shell safety tool in system1-mcp. evaluate is the generic System One caller in typesafe-mcp. Pick presets for IDE reflexes, evaluate when you design custom question maps in code.",
      },
      {
        question: "Can Cline auto-approve Jev tools?",
        answer:
          "Cline MCP settings support autoApprove lists per server. Only auto-approve read-only tools you trust; keep fast_guard approval on if your policy requires human eyes on blocks.",
      },
      {
        question: "Where are Cline MCP docs?",
        answer:
          "See Cline docs/mcp/mcp-overview.mdx on GitHub for Configure MCP Servers, remote streamableHttp servers, and CLI notes.",
      },
      {
        question: "Roo-only features?",
        answer:
          "Roo adds product-specific modes and prompts, but Jev wiring is the same MCP contract. Re-run system1-mcp doctor after Roo updates if tools disappear.",
      },
    ],
    relatedCatalogSlugs: [
      "itsmostafa-typesafe-mcp",
      "blakestone-x-jev-mcp",
      "rashedint32-jev-mcp",
      "typesafe-ai-skills",
    ],
    relatedAgentSlugs: ["cursor-mcp-and-skills", "github-copilot-agent", "devin-desktop"],
    sources: [
      { label: "system1-mcp on PyPI", url: "https://pypi.org/project/system1-mcp" },
      { label: "system1-mcp README", url: "https://github.com/ericmaddox/system1-mcp" },
      { label: "typesafe-mcp README", url: "https://github.com/itsmostafa/typesafe-mcp" },
      { label: "Cline MCP overview", url: "https://github.com/cline/cline/blob/main/docs/mcp/mcp-overview.mdx" },
      { label: "Cline CLI configuration", url: "https://github.com/cline/cline/blob/main/docs/cline-cli/configuration.mdx" },
    ],
  },

  "github-copilot-agent": {
    slug: "github-copilot-agent",
    title: "GitHub Copilot Agent Mode + Jev",
    tagline: "VS Code Agent chat with MCP servers key servers, not mcpServers.",
    seoTitle: "GitHub Copilot Agent + Jev: MCP in VS Code",
    seoDescription:
      "Add system1-mcp or typesafe-mcp to .vscode/mcp.json for Copilot Agent mode. servers vs mcpServers, Ask vs Agent, cloud agent constraints, and env keys.",
    whyJev:
      "Copilot Agent mode can run terminal commands and MCP tools in a loop. That is powerful and slightly terrifying. Jev gives you fast_guard-style reflexes or evaluate-shaped checks so the agent pauses on destructive commands instead of narrating its way into rm -rf.",
    sections: [
      {
        h: "Ask mode vs Agent mode",
        body:
          "GitHub documents Copilot Chat modes in VS Code. Ask mode is Q&A without autonomous tool loops. Agent mode lets Copilot plan, invoke tools, and run commands until the task completes. MCP tools attach to Agent mode (and related agent surfaces), not to lightweight Ask completions. Pick Agent when you want Jev gates on the execution path.",
      },
      {
        h: "VS Code MCP config uses servers",
        body:
          "VS Code reads .vscode/mcp.json (workspace) or user MCP configuration. The top-level key is servers, not mcpServers. Cursor and Claude Desktop configs pasted verbatim will silently fail in VS Code. Use MCP: Add Server or edit the file, click Start, and trust the server when prompted.",
        code: {
          lang: "json",
          content: `{
  "servers": {
    "system1": {
      "command": "uvx",
      "args": ["system1-mcp"],
      "env": {
        "TYPESAFE_API_KEY": "\${input:typesafe-api-key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "typesafe-api-key",
      "description": "TypeSafe API key for Jev (never commit literals)"
    }
  ]
}`,
        },
      },
      {
        h: "Install system1-mcp for Copilot",
        body:
          "system1-mcp install autodetects VS Code style hosts. For teams, commit a workspace mcp.json with inputs or env references, and document TYPESAFE_API_KEY in your onboarding doc (not in chat). Tools exposed: fast_guard, fast_judge, fast_verify, fast_score.",
        code: {
          lang: "bash",
          content: `export TYPESAFE_API_KEY="tsk_..."
uvx system1-mcp install
uvx system1-mcp doctor`,
        },
      },
      {
        h: "typesafe-mcp alternative",
        body:
          "When you want a single evaluate tool that mirrors POST /v1/systemone, install itsmostafa/typesafe-mcp and register the stdio server in servers with the same command/args pattern as other MCP packages. Pair with typesafe-ai/skills so Copilot learns when to call evaluate.",
      },
      {
        h: "Copilot CLI and cloud coding agent",
        body:
          "GitHub documents separate MCP locations for Copilot CLI (~/.copilot/mcp-config.json with mcpServers) and cloud coding agents (repository settings, not always .vscode/mcp.json). Before relying on Jev in GitHub's cloud agent, read the current GitHub docs for which MCP hosts are supported; constraints change faster than local VS Code.",
      },
      {
        h: "Visual Studio and enterprise",
        body:
          "Visual Studio 2026+ ships Copilot agent features with MCP support aligned to the same Model Context Protocol. Enterprise admins may gate MCP via chat.mcp.access policies documented in VS Code. Test in a sandbox repo before rolling reflex tools org-wide.",
      },
      envSection("VS Code Copilot Agent and MCP child processes"),
      {
        h: "Pitfalls",
        body:
          "Never store live API keys in mcp.json committed to git; use inputs, env vars, or secret stores. Copilot CLI does not read .vscode/mcp.json. After MCP edits, restart servers from the MCP list. Agent mode can still ignore tools unless your custom instructions mention fast_guard before shell execution.",
      },
    ],
    faq: [
      {
        question: "Why did my Cursor MCP config not work?",
        answer:
          "VS Code requires servers as the root key. Rename mcpServers to servers and reload MCP.",
      },
      {
        question: "Does Copilot Agent call Jev automatically?",
        answer:
          "Not guaranteed. Register MCP tools and add repo instructions (AGENTS.md) that require fast_guard before destructive commands.",
      },
      {
        question: "Can I use jev-judge-mcp?",
        answer:
          "Yes via stdio npx -y jev-judge-mcp in servers if you prefer a single judge tool. See the Claude/Codex guide for install lines.",
      },
      {
        question: "Cloud agent MCP support?",
        answer:
          "GitHub documents MCP for cloud coding agents separately from local VS Code. Verify the latest GitHub docs before assuming system1-mcp runs in cloud sessions.",
      },
      {
        question: "Where is official Copilot MCP documentation?",
        answer:
          "See GitHub Docs: Extending Copilot Chat with MCP (docs.github.com/copilot/customizing-copilot/using-model-context-protocol/extending-copilot-chat-with-mcp).",
      },
    ],
    relatedCatalogSlugs: [
      "itsmostafa-typesafe-mcp",
      "blakestone-x-jev-mcp",
      "typesafe-ai-skills",
      "brainwires-jevwire",
    ],
    relatedAgentSlugs: ["cline-and-roo", "cursor-mcp-and-skills", "devin-desktop", "codex-and-opencode"],
    sources: [
      { label: "Extending Copilot Chat with MCP", url: "https://docs.github.com/en/copilot/customizing-copilot/using-model-context-protocol/extending-copilot-chat-with-mcp" },
      { label: "system1-mcp on PyPI", url: "https://pypi.org/project/system1-mcp" },
      { label: "typesafe-mcp README", url: "https://github.com/itsmostafa/typesafe-mcp" },
      { label: "VS Code MCP configuration reference", url: "https://code.visualstudio.com/docs/copilot/chat/mcp-servers" },
    ],
  },

  "devin-desktop": {
    slug: "devin-desktop",
    title: "Devin Desktop + Jev",
    tagline: "Windsurf became Devin Desktop. MCP reflex beside Devin Local, Claude, and Codex agents.",
    seoTitle: "Devin Desktop + Jev: MCP reflex on the IDE",
    seoDescription:
      "Pair Jev with Devin Desktop (ex-Windsurf) via system1-mcp MCP install, multi-agent ACP surfaces, and catalog MCP listings. No invented native plugins.",
    whyJev:
      "Devin Desktop is a command center for many agents at once. Each agent can still cheerfully run the wrong shell command. A shared MCP reflex layer (fast_guard, evaluate, or classify tools) gives every model the same calibrated gate without waiting for a vendor-specific Jev plugin.",
    sections: [
      {
        h: "Devin Desktop and the Windsurf rename",
        body:
          "Cognition rebranded Windsurf to Devin Desktop: same IDE foundation, new Agent Command Center (Spaces, boards, multi-session management). devin.ai/desktop states existing plans, extensions, and settings migrate over the air. JetBrains Windsurf builds remain available separately per their FAQ.",
      },
      {
        h: "ACP and multiple agents",
        body:
          "Devin Desktop advertises Agent Client Protocol (ACP) support so you can run Devin Local, Claude, Codex, and custom agents in one surface. Jev does not replace those models. It sits in MCP tools they can all call: one reflex install, many agent personalities.",
      },
      {
        h: "Verified path: system1-mcp",
        body:
          "We did not find a first-party Devin-native Jev plugin in public READMEs. The verified integration is MCP: system1-mcp install lists Windsurf in its autodetected IDE set (the pre-rename name Devin Desktop inherited). Use uvx system1-mcp install or manual mcpServers blocks per your host's MCP docs.",
        code: {
          lang: "bash",
          content: `export TYPESAFE_API_KEY="tsk_..."
uvx system1-mcp install
uvx system1-mcp doctor`,
        },
      },
      {
        h: "Manual MCP entry",
        body:
          "Devin Desktop continues Windsurf-style MCP configuration for extensions and MCP servers shown on the marketing site (Slack, Linear, Stripe, and others). Add a local stdio server alongside them:",
        code: {
          lang: "json",
          content: `{
  "mcpServers": {
    "system1": {
      "command": "uvx",
      "args": ["system1-mcp"],
      "env": {
        "TYPESAFE_API_KEY": "\${env:TYPESAFE_API_KEY}"
      }
    }
  }
}`,
        },
      },
      {
        h: "Community MCP listings",
        body:
          "Devin Desktop's ecosystem page highlights third-party MCP servers. itsmostafa/typesafe-mcp and blakestone-x/jev-mcp are directory listings you can register the same way as other MCP integrations. Read each README for tool names (evaluate vs classify vs fast_guard).",
      },
      {
        h: "Spaces and shared context",
        body:
          "Spaces share git worktrees and context across agents. Put AGENTS.md reflex rules in the repo so every agent session in a Space sees the same fast_guard instructions, not just one local chat thread.",
      },
      envSection("Devin Desktop MCP subprocesses"),
      {
        h: "Pitfalls",
        body:
          "Installer strings may still say Windsurf while the product says Devin Desktop; rerun doctor after major upgrades. Do not assume cloud Devin sessions share your laptop MCP config. MCP tools are advisory: Spaces with parallel agents need consistent policy text or one agent may approve what another blocked.",
      },
    ],
    faq: [
      {
        question: "Is there an official Devin Jev extension?",
        answer:
          "We did not find one in public READMEs indexed here. Use MCP servers documented on PyPI or the catalog.",
      },
      {
        question: "Windsurf MCP configs after rename?",
        answer:
          "Devin Desktop FAQ says settings carry over OTA. Validate MCP entries with system1-mcp doctor after updating.",
      },
      {
        question: "Devin Local vs Desktop Jev?",
        answer:
          "Cloud Devin products use different connector models. This guide focuses on Desktop MCP on your machine.",
      },
      {
        question: "Can I use LangChain middleware instead?",
        answer:
          "Only inside Python services you control. Desktop agents need MCP or HTTP tools, not in-process LangChain middleware.",
      },
      {
        question: "Which tool preset should I pick?",
        answer:
          "system1-mcp fast_* tools for IDE reflexes. typesafe-mcp evaluate when you design custom parallel questions.",
      },
    ],
    relatedCatalogSlugs: [
      "itsmostafa-typesafe-mcp",
      "blakestone-x-jev-mcp",
      "brainwires-jevwire",
      "typesafe-ai-skills",
    ],
    relatedAgentSlugs: ["cline-and-roo", "github-copilot-agent", "cursor-mcp-and-skills"],
    sources: [
      { label: "Devin Desktop", url: "https://devin.ai/desktop" },
      { label: "system1-mcp README", url: "https://github.com/ericmaddox/system1-mcp" },
      { label: "system1-mcp on PyPI", url: "https://pypi.org/project/system1-mcp" },
      { label: "typesafe-mcp README", url: "https://github.com/itsmostafa/typesafe-mcp" },
    ],
  },

  "browser-computer-use": {
    slug: "browser-computer-use",
    title: "Browser and computer-use agents + Jev",
    tagline: "Jev picks the next click or risk gate; the small LLM types only when the DOM demands it.",
    seoTitle: "Browser agents + Jev: ultrafast ops and gates",
    seoDescription:
      "Pair Jev with Browser Use and computer-use stacks: typed next-action Choice, risk nouls, catalog demos browser-use-jev-ultrafast and awlevin-typesafe-computer-use.",
    whyJev:
      "Browser agents tempt you to let a frontier model read the entire DOM every step. That is slow, expensive, and oddly good at clicking the wrong button with confidence. Jev classifies the next operation, scores risk, and verifies success with parallel nouls while a tiny model handles literal typing.",
    sections: [
      {
        h: "The ultrafast pattern",
        body:
          "Directory demos such as browser-use-jev-ultrafast describe a split brain: Jev chooses the browser operation and target in one System One call; a small LLM only appears when the page needs text entry. LangChain's Jev post highlights similar fractions-of-a-cent browser loops from the community. The pattern is always the same: decide with Jev, generate language only when necessary.",
      },
      {
        h: "Question shapes on the loop",
        body:
          "Typical harnesses ask a Choice for the next action enum (click, scroll, type, wait, done), Score for urgency or layout complexity, and Noul checks for login walls, captchas, or destructive confirmations. Pack them into one System One request so step latency stays flat as you add gates.",
        code: {
          lang: "json",
          content: `{
  "state": {
    "url": "https://example.com/checkout",
    "visible_text": "Confirm purchase $499",
    "last_action": "click_pay"
  },
  "questions": {
    "next_op": {
      "type": "choice",
      "instructions": "Pick the safest next browser operation",
      "criteria": {
        "confirm": "Proceed only if policy allows",
        "back": "Return to cart review",
        "halt": "Stop and ask the human"
      }
    },
    "high_risk": {
      "type": "noul",
      "instructions": "Would this step spend money or delete data?"
    }
  }
}`,
        },
      },
      {
        h: "Catalog projects to study",
        body:
          "browser-use-jev-ultrafast is the flagship Browser Use plus Jev demo in this directory. awlevin-typesafe-computer-use and computer-use-built-on-jev show computer-use variants. opencode-browser-use-powered-by-jev wires similar ideas into OpenCode. Read each repo README for install and model requirements before production use.",
      },
      {
        h: "MCP reflex for operator agents",
        body:
          "When the browser driver runs inside an IDE agent (Cursor, Cline, Copilot), attach system1-mcp or typesafe-mcp so the operator can fast_guard risky shell commands around the automation script, fast_verify log lines, or evaluate custom nouls on scraped text before clicking.",
      },
      {
        h: "Risk gates humans still want",
        body:
          "Even perfect classifiers should not auto-submit wire transfers. Keep hard blocks in code for domains you never automate, and use Jev probabilities as soft gates (thresholds, second opinion routes) documented in /learn/system-one.",
      },
      envSection("browser automation runners and MCP sidecars"),
      {
        h: "Pitfalls",
        body:
          "DOM snapshots leak PII into TypeSafe state; redact before sending. Computer-use stacks change quickly; pin browser-use and driver versions when you fork a demo. Do not treat demo throughput claims as your SLA. Verify captcha and 2FA handling in your own environment.",
      },
    ],
    faq: [
      {
        question: "Does Jev drive the browser directly?",
        answer:
          "No. Your harness calls Jev for decisions, then invokes Playwright, Browser Use, or OS automation APIs based on the typed answer.",
      },
      {
        question: "Where is browser-use-jev-ultrafast?",
        answer:
          "Listed in this directory under browser-computer-use category with a live demo link when the maintainer provides one.",
      },
      {
        question: "Computer use vs browser only?",
        answer:
          "Computer-use agents add OS-level actions. The same Choice, Score, and Noul pattern applies; state payloads just include screenshots or accessibility trees.",
      },
      {
        question: "Can I combine with LangChain middleware?",
        answer:
          "Yes in Python services. AutoModeMiddleware can block risky tool calls in the agent graph while Jev also picks browser ops in a custom node.",
      },
      {
        question: "OpenClaw jev-harness browser recipes?",
        answer:
          "jev-harness documents browser next-action recipes for OpenClaw. See the OpenClaw guide for plugin config; this guide focuses on Browser Use style repos in the catalog.",
      },
    ],
    relatedCatalogSlugs: [
      "browser-use-jev-ultrafast",
      "awlevin-typesafe-computer-use",
      "computer-use-built-on-jev",
      "opencode-browser-use-powered-by-jev",
      "jkudish-jev-browser",
    ],
    relatedAgentSlugs: ["openclaw", "langchain-langgraph", "cursor-mcp-and-skills"],
    sources: [
      { label: "Building a Harness with Jev (browser mention)", url: "https://www.langchain.com/blog/building-a-harness-with-jev" },
      { label: "TypeSafe System One docs", url: "https://docs.typesafe.ai/concepts/system-one" },
      { label: "Browser Use project", url: "https://github.com/browser-use/browser-use" },
    ],
  },
};

export function getAgentGuide(slug: string): AgentGuide | undefined {
  if (!(agentGuideSlugs as readonly string[]).includes(slug)) return undefined;
  return agentGuides[slug as AgentGuideSlug];
}

export function agentGuidePath(slug?: string): string {
  if (!slug || slug === agentGuidesHubSlug) return `/guides/${agentGuidesHubSlug}`;
  return `/guides/${agentGuidesHubSlug}/${slug}`;
}
