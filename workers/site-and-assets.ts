import { dispatchMfmApi } from "../src/lib/mfm-jev-search/api-route";
import type { MfmSearchEnv } from "../src/lib/mfm-jev-search/search-service";
import { tryExploreSeoResponse } from "../src/lib/explore-seo";
import {
  isHomePath,
  tryHomeMarkdownResponse,
  tryNotFoundMarkdownResponse,
  withVaryAccept,
} from "../src/lib/markdown-negotiation";
import { tryNotFoundHtmlSeoResponse } from "../src/lib/not-found-seo";

export interface Env extends MfmSearchEnv {
  SITE_ASSETS: Fetcher;
  PUBLIC_SITE_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const mfm = await dispatchMfmApi(request, env);
    if (mfm) {
      return mfm;
    }

    const url = new URL(request.url);

    const markdownHome = tryHomeMarkdownResponse(request, url);
    if (markdownHome) {
      return markdownHome;
    }

    const exploreResponse = await tryExploreSeoResponse(request, url, () =>
      env.SITE_ASSETS.fetch(
        new Request(new URL("/explore", url.origin), {
          method: request.method,
          headers: request.headers,
        }),
      ),
    );
    if (exploreResponse) {
      return exploreResponse;
    }

    const response = await env.SITE_ASSETS.fetch(request);

    const markdown404 = tryNotFoundMarkdownResponse(request, url, response);
    if (markdown404) {
      return markdown404;
    }

    const html404 = await tryNotFoundHtmlSeoResponse(request, url, response);
    if (html404) {
      return html404;
    }

    if (
      isHomePath(url.pathname) &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      return withVaryAccept(response);
    }

    return response;
  },
};
