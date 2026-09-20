import {
  notFoundMarkdownBody,
  prefersMarkdownAccept,
} from "../src/lib/agent-surface";

function markdownResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": status === 404 ? "no-store" : "public, max-age=300",
      Vary: "Accept",
    },
  });
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  const wantsMarkdown = prefersMarkdownAccept(request.headers.get("Accept"));
  const response = await next();

  if (response.status === 404 && wantsMarkdown) {
    if (request.method === "HEAD") {
      return new Response(null, {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
        },
      });
    }
    return markdownResponse(notFoundMarkdownBody(url.pathname), 404);
  }

  return response;
};
