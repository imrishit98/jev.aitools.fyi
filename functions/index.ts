import { withVaryAccept } from "../src/lib/markdown-negotiation";

/** Kept for route documentation; homepage negotiation runs in _middleware.ts (runs before static `/`). */
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const url = new URL(context.request.url);
  if (url.pathname !== "/" && url.pathname !== "/index.html") {
    return response;
  }
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return response;
  }
  return withVaryAccept(response);
};
