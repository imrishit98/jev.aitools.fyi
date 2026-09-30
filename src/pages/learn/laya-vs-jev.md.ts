import type { APIRoute } from "astro";
import { layaHubMarkdown, markdownFileResponse } from "@/lib/guide-markdown";

export const GET: APIRoute = () =>
  markdownFileResponse(layaHubMarkdown(), "/learn/laya-vs-jev");
