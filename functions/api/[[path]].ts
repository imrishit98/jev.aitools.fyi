import { agentJsonError } from "../../src/lib/agent-surface";

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const subpath = url.pathname.replace(/^\/api\/?/, "") || "(root)";

  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return agentJsonError(
      "method_not_allowed",
      `Method ${context.request.method} is not supported on this directory API surface.`,
      "Use GET on documented discovery URLs in /openapi.json, or expect JSON errors from unknown /api/* routes.",
      405,
    );
  }

  return agentJsonError(
    "not_found",
    `No API route matches /api/${subpath}.`,
    "See /openapi.json for agent-facing GET endpoints (search-index.json, llms.txt, sitemap.xml, .well-known/jev-directory.json).",
    404,
  );
};
