import type { APIRoute } from "astro";
import { agentGuideSlugs } from "@/data/agent-guides";
import { agentGuideMarkdown, markdownFileResponse } from "@/lib/guide-markdown";

export function getStaticPaths() {
  return agentGuideSlugs.map((agent) => ({ params: { agent } }));
}

export const GET: APIRoute = ({ params }) => {
  const body = agentGuideMarkdown(params.agent ?? "");
  if (!body) return new Response("Not found", { status: 404 });
  return markdownFileResponse(body, `/guides/jev-with-ai-agents/${params.agent}`);
};
