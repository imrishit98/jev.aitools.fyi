import { categoryCanonicalFromExploreParams } from "@/lib/explore-canonical";
import { applyNoindexFollowHeaders } from "@/lib/not-found-seo";
import { absoluteUrl } from "@/lib/seo";

export type ExploreSeoAction =
  | { kind: "index" }
  | { kind: "redirect"; path: string }
  | { kind: "noindex"; canonicalPath: string };

/** True for `/explore`, `/explore/`, and static `explore.html` asset paths. */
export function isExplorePath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  if (normalized === "/explore") return true;
  return normalized === "/explore.html";
}

export function exploreSeoAction(search: string): ExploreSeoAction {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  if (!raw) return { kind: "index" };

  const params = new URLSearchParams(raw);
  const categoryPath = categoryCanonicalFromExploreParams(params);
  if (categoryPath) {
    return { kind: "redirect", path: categoryPath };
  }

  return { kind: "noindex", canonicalPath: "/explore" };
}

/** Patch prerendered explore HTML for filtered/search URLs (noindex + canonical). */
export function patchExploreHtmlForNoindex(html: string, canonicalPath: string): string {
  const canonical = absoluteUrl(canonicalPath);
  let out = html.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/i,
    '<meta name="robots" content="noindex, follow">',
  );
  out = out.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonical}">`,
  );
  out = out.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${canonical}">`,
  );
  return out;
}

/**
 * Explore SEO for Workers and Pages middleware. Returns a response when this
 * request should not fall through unchanged (category 301 or noindex HTML).
 */
export async function tryExploreSeoResponse(
  request: Request,
  url: URL,
  fetchBareExplore: () => Promise<Response>,
): Promise<Response | null> {
  if (!isExplorePath(url.pathname)) return null;

  const action = exploreSeoAction(url.search);
  if (action.kind === "redirect") {
    return Response.redirect(new URL(action.path, url.origin).toString(), 301);
  }

  if (
    action.kind === "noindex" &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    const response = await fetchBareExplore();
    if (!response.ok) return response;
    const html = await response.text();
    const patched = patchExploreHtmlForNoindex(html, action.canonicalPath);
    const headers = new Headers(response.headers);
    headers.set("content-type", "text/html; charset=utf-8");
    headers.delete("content-length");
    applyNoindexFollowHeaders(headers);
    return new Response(patched, { status: response.status, headers });
  }

  return null;
}
