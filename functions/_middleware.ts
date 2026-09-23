import { tryExploreSeoResponse } from "../src/lib/explore-seo";
import {
  isHomePath,
  tryHomeMarkdownResponse,
  tryNotFoundMarkdownResponse,
  withVaryAccept,
} from "../src/lib/markdown-negotiation";
import { tryNotFoundHtmlSeoResponse } from "../src/lib/not-found-seo";

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  const markdownHome = tryHomeMarkdownResponse(request, url);
  if (markdownHome) return markdownHome;

  const exploreResponse = await tryExploreSeoResponse(request, url, () =>
    next(
      new Request(new URL("/explore", url.origin), {
        method: request.method,
        headers: request.headers,
      }),
    ),
  );
  if (exploreResponse) return exploreResponse;

  const response = await next();

  const markdown404 = tryNotFoundMarkdownResponse(request, url, response);
  if (markdown404) return markdown404;

  const html404 = await tryNotFoundHtmlSeoResponse(request, url, response);
  if (html404) return html404;

  if (
    isHomePath(url.pathname) &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    return withVaryAccept(response);
  }

  return response;
};
