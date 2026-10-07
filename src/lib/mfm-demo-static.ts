/** Canonical demo URL (no trailing slash; matches site `trailingSlash: "never"`). */
export const MFM_DEMO_CANONICAL_PATH = "/demos/my-first-million";

/**
 * Static asset file (not a directory index). Must not pretty-URL to the canonical path
 * or Assets + _redirects will loop when the worker/function fetches it.
 */
export const MFM_DEMO_HTML_ASSET_PATH = "/demos/mfm-jev-search-shell.html";

export function isMfmDemoBarePath(pathname: string): boolean {
  return pathname === MFM_DEMO_CANONICAL_PATH;
}

/**
 * Serve the demo HTML at the canonical bare path (avoids Assets directory 307 loops).
 */
export async function tryMfmDemoBarePathResponse(
  request: Request,
  url: URL,
  fetchAsset: (assetRequest: Request) => Promise<Response>,
): Promise<Response | null> {
  if (!isMfmDemoBarePath(url.pathname)) {
    return null;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  const assetRequest = new Request(
    new URL(MFM_DEMO_HTML_ASSET_PATH, url.origin),
    {
      method: "GET",
      headers: request.headers,
    },
  );
  const asset = await fetchAsset(assetRequest);
  if (!asset.ok) {
    return asset;
  }

  const headers = new Headers(asset.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  if (request.method === "HEAD") {
    return new Response(null, { status: 200, headers });
  }
  return new Response(asset.body, { status: 200, headers });
}
