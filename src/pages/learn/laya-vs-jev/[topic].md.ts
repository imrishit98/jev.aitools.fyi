import type { APIRoute } from "astro";
import { layaVsJevGuideSlugs } from "@/data/laya-vs-jev-guides";
import { layaGuideMarkdown, markdownFileResponse } from "@/lib/guide-markdown";

export function getStaticPaths() {
  return layaVsJevGuideSlugs.map((topic) => ({ params: { topic } }));
}

export const GET: APIRoute = ({ params }) => {
  const body = layaGuideMarkdown(params.topic ?? "");
  if (!body) return new Response("Not found", { status: 404 });
  return markdownFileResponse(body, `/learn/laya-vs-jev/${params.topic}`);
};
