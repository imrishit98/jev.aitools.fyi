import type { AgentGuideSection } from "@/data/agent-guides-types";

/** Shared env-keys section for agent integration guides. */
export function envSection(agent: string): AgentGuideSection {
  return {
    h: "Environment keys",
    body: `Create a key at https://console.typesafe.ai/ (or route through Vercel AI Gateway / OpenRouter where the integration documents it). Export TYPESAFE_API_KEY in the environment for ${agent}. Some MCP clients accept AI_GATEWAY_API_KEY when using gateway-hosted Jev models; follow that integration's README. Never commit keys into repos or paste them into chat logs.`,
    code: {
      lang: "bash",
      content: `export TYPESAFE_API_KEY="tsk_..."
# Optional pin:
export TYPESAFE_MODEL="jev-latest"`,
    },
  };
}
