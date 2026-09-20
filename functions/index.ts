import {
  forAgentsMarkdownBody,
  homeMarkdownBody,
  prefersMarkdownAccept,
} from "../src/lib/agent-surface";

function markdownResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      Vary: "Accept",
    },
  });
}

function mergeVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((p) => p.trim().toLowerCase());
  if (parts.includes(value.toLowerCase())) return existing;
  return `${existing}, ${value}`;
}

function withVary(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Vary", mergeVary(headers.get("Vary"), "Accept"));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return next();
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  const wantsMarkdown = prefersMarkdownAccept(request.headers.get("Accept"));

  if (wantsMarkdown) {
    if (request.method === "HEAD") {
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
        },
      });
    }
    const view = url.searchParams.get("view");
    const body =
      view === "agent" || view === "agents"
        ? forAgentsMarkdownBody()
        : homeMarkdownBody();
    return markdownResponse(body);
  }

  // HTML and other Accept values: serve static dist/index.html via the asset pipeline.
  const response = await next();
  return withVary(response);
};
