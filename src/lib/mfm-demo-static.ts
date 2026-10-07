/** Canonical demo URL (no trailing slash; matches site `trailingSlash: "never"`). */
export const MFM_DEMO_CANONICAL_PATH = "/demos/my-first-million";

/**
 * Static asset file (not a directory index). Must not pretty-URL to the canonical path
 * or Assets + _redirects will loop when the worker/function fetches it.
 */
export const MFM_DEMO_HTML_ASSET_PATH = "/demos/mfm-jev-search-shell.html";

/** Pretty URL for the shell asset (no .html); must stay noindex. */
export const MFM_DEMO_SHELL_PUBLIC_PATH = MFM_DEMO_HTML_ASSET_PATH.replace(
  /\.html$/,
  "",
);

const ASSET_REQUEST_HEADER_NAMES = [
  "accept",
  "accept-encoding",
  "accept-language",
  "if-modified-since",
  "if-none-match",
  "cache-control",
] as const;

function headersForInternalAssetFetch(request: Request): Headers {
  const out = new Headers();
  for (const name of ASSET_REQUEST_HEADER_NAMES) {
    const value = request.headers.get(name);
    if (value) {
      out.set(name, value);
    }
  }
  return out;
}

/** Canonical demo URL must not inherit shell asset noindex from dist/_headers. */
function headersForCanonicalDemoResponse(assetHeaders: Headers): Headers {
  const headers = new Headers(assetHeaders);
  headers.delete("x-robots-tag");
  headers.set("content-type", "text/html; charset=utf-8");
  return headers;
}

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
      headers: headersForInternalAssetFetch(request),
    },
  );
  const asset = await fetchAsset(assetRequest);
  if (asset.status === 304) {
    return new Response(null, {
      status: 304,
      headers: headersForCanonicalDemoResponse(asset.headers),
    });
  }
  if (!asset.ok) {
    return asset;
  }

  const headers = headersForCanonicalDemoResponse(asset.headers);
  if (request.method === "HEAD") {
    return new Response(null, { status: asset.status, headers });
  }
  return new Response(asset.body, { status: asset.status, headers });
}
