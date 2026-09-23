export const NOINDEX_FOLLOW_ROBOTS = "noindex, follow";

/** True for the prerendered Astro 404 document (`/404`, `/404.html`). */
export function isNotFoundDocumentPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return normalized === "/404" || normalized === "/404.html";
}

export function patchNotFoundHtml(
  html: string,
  options?: { stripOpenGraphUrl?: boolean },
): string {
  let out = html.replace(
    /<meta name="robots" content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${NOINDEX_FOLLOW_ROBOTS}">`,
  );
  out = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>\s*/i, "");
  if (options?.stripOpenGraphUrl) {
    out = out.replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>\s*/i,
      "",
    );
  }
  return out;
}

export function applyNoindexFollowHeaders(headers: Headers): void {
  headers.set("X-Robots-Tag", NOINDEX_FOLLOW_ROBOTS);
}

/**
 * HTML 404 and `/404` document responses: noindex, no canonical to `/404`, optional og:url strip.
 */
export async function tryNotFoundHtmlSeoResponse(
  request: Request,
  url: URL,
  assetResponse: Response,
): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") return null;

  const is404Status = assetResponse.status === 404;
  const is404Document = isNotFoundDocumentPath(url.pathname);
  if (!is404Status && !is404Document) return null;

  const contentType = assetResponse.headers.get("content-type") ?? "";
  const looksHtml =
    contentType.includes("text/html") || is404Status || is404Document;
  if (!looksHtml) return null;

  const stripOpenGraphUrl = is404Status && !is404Document;

  if (request.method === "HEAD") {
    const headers = new Headers(assetResponse.headers);
    applyNoindexFollowHeaders(headers);
    return new Response(null, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers,
    });
  }

  const html = await assetResponse.text();
  const patched = patchNotFoundHtml(html, { stripOpenGraphUrl });
  const headers = new Headers(assetResponse.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.delete("content-length");
  applyNoindexFollowHeaders(headers);
  return new Response(patched, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}
