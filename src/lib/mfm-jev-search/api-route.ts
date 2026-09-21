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
export async function dispatchMfmApi(
  request: Request,
  env: MfmSearchEnv,
): Promise<Response | null> {
  if (request.method !== "GET") {
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
      return handleHealth(env);
    case "pile":
      return handlePile(url.searchParams.get("n"));
    case "search":
      return handleSearch(url.searchParams.get("q") || "", env);
    default:
      return null;
  }
}
