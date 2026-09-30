import type { APIRoute } from "astro";
import { agentHubMarkdown, markdownFileResponse } from "@/lib/guide-markdown";

export const GET: APIRoute = () =>
  markdownFileResponse(agentHubMarkdown(), "/guides/jev-with-ai-agents");
