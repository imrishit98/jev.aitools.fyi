import {
  forAgentsMarkdownBody,
  homeMarkdownBody,
  notFoundMarkdownBody,
  prefersMarkdownAccept,
} from "@/lib/agent-surface";
import { NOINDEX_FOLLOW_ROBOTS } from "@/lib/not-found-seo";

export function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "/index.html";
}

function mergeVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((p) => p.trim().toLowerCase());
  if (parts.includes(value.toLowerCase())) return existing;
  return `${existing}, ${value}`;
}

/** Response headers for negotiated Markdown (homepage and 404). */
export function markdownResponseHeaders(status: number): HeadersInit {
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    "Cache-Control": status === 404 ? "no-store" : "public, max-age=300",
    ...(status === 404
      ? {
          "CDN-Cache-Control": "no-store",
          "X-Robots-Tag": NOINDEX_FOLLOW_ROBOTS,
        }
      : { "CDN-Cache-Control": "public, max-age=300" }),
  };
}

export function markdownResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: markdownResponseHeaders(status),
  });
}

export function withVaryAccept(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Vary", mergeVary(headers.get("Vary"), "Accept"));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function homeMarkdownBodyForUrl(url: URL): string {
  const view = url.searchParams.get("view");
  return view === "agent" || view === "agents"
    ? forAgentsMarkdownBody()
    : homeMarkdownBody();
}

/** Handle GET/HEAD `/` when Accept prefers Markdown. Returns null to fall through. */
export function tryHomeMarkdownResponse(request: Request, url: URL): Response | null {
  if (!isHomePath(url.pathname)) return null;
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (!prefersMarkdownAccept(request.headers.get("Accept"))) return null;

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 200,
      headers: markdownResponseHeaders(200),
    });
  }
  return markdownResponse(homeMarkdownBodyForUrl(url));
}

/** After static/assets fetch: Markdown 404 when appropriate. */
export function tryNotFoundMarkdownResponse(
  request: Request,
  url: URL,
  assetResponse: Response,
): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (assetResponse.status !== 404) return null;
  if (!prefersMarkdownAccept(request.headers.get("Accept"))) return null;

  if (request.method === "HEAD") {
    return new Response(null, {
      status: 404,
      headers: markdownResponseHeaders(404),
    });
  }
  return markdownResponse(notFoundMarkdownBody(url.pathname), 404);
}
