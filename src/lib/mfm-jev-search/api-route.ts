import {
  handleHealth,
  handlePile,
  handleSearch,
  type MfmSearchEnv,
} from "./search-service";

const MFM_API_RE =
  /^\/demos\/my-first-million\/api\/(health|pile|search)\/?$/;

/**
 * Shared MFM demo API router for Cloudflare Pages Functions and Workers + assets.
 * Returns null when the request is not an MFM API route.
 */
function asHeadIfNeeded(request: Request, response: Response): Response {
  if (request.method !== "HEAD") {
    return response;
  }
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}

export async function dispatchMfmApi(
  request: Request,
  env: MfmSearchEnv,
): Promise<Response | null> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return null;
  }

  const url = new URL(request.url);
  const match = url.pathname.match(MFM_API_RE);
  if (!match) {
    return null;
  }

  const route = match[1];
  switch (route) {
    case "health":
      return asHeadIfNeeded(request, await handleHealth(env));
    case "pile":
      return asHeadIfNeeded(request, await handlePile(url.searchParams.get("n")));
    case "search":
      return asHeadIfNeeded(
        request,
        await handleSearch(url.searchParams.get("q") || "", env),
      );
    default:
      return null;
  }
}
