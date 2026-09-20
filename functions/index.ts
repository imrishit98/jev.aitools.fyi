import {
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

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  const wantsMarkdown = prefersMarkdownAccept(request.headers.get("Accept"));
  const assetResponse = await next();

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
    return markdownResponse(homeMarkdownBody());
  }

  const headers = new Headers(assetResponse.headers);
  headers.set("Vary", mergeVary(headers.get("Vary"), "Accept"));
  return new Response(assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
};

function mergeVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((p) => p.trim().toLowerCase());
  if (parts.includes(value.toLowerCase())) return existing;
  return `${existing}, ${value}`;
}
