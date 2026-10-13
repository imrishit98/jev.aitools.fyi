import type { APIRoute } from "astro";
import { alternativesHub } from "@/data/alternatives";
import { alternativesHubMarkdown } from "@/lib/alternative-markdown";
import { markdownFileResponse } from "@/lib/guide-markdown";

export const GET: APIRoute = () => {
  return markdownFileResponse(alternativesHubMarkdown(alternativesHub), "/alternatives");
};
