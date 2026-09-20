import {
  forAgentsMarkdownBody,
  prefersMarkdownAccept,
} from "../../src/lib/agent-surface";

function markdownResponse(body: string): Response {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      Vary: "Accept",
    },
  });
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return next();
  }

  const wantsMarkdown = prefersMarkdownAccept(request.headers.get("Accept"));

  if (wantsMarkdown) {
    if (request.method === "HEAD") {
      return new Response(null, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          Vary: "Accept",
        },
      });
    }
    return markdownResponse(forAgentsMarkdownBody());
  }

  return next();
};
