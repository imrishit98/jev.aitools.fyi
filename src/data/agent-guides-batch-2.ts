import type { AgentGuide } from "@/data/agent-guides-types";
import { envSection } from "@/data/agent-guides-env";

export const agentGuideBatch2Slugs = [
  "langchain-langgraph",
  "cline-and-roo",
  "github-copilot-agent",
  "devin-desktop",
  "browser-computer-use",
] as const;

export type AgentGuideBatch2Slug = (typeof agentGuideBatch2Slugs)[number];

export const agentGuidesBatch2: Record<AgentGuideBatch2Slug, AgentGuide> = {
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
