import {
  isHomePath,
  tryHomeMarkdownResponse,
  tryNotFoundMarkdownResponse,
  withVaryAccept,
} from "../src/lib/markdown-negotiation";

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  const markdownHome = tryHomeMarkdownResponse(request, url);
  if (markdownHome) return markdownHome;

  const response = await next();

  const markdown404 = tryNotFoundMarkdownResponse(request, url, response);
  if (markdown404) return markdown404;

  if (
    isHomePath(url.pathname) &&
    (request.method === "GET" || request.method === "HEAD")
  ) {
    return withVaryAccept(response);
  }

  return response;
};
