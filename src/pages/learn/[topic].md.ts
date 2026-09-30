import type { APIRoute } from "astro";
import { learnGuideSlugs } from "@/data/learn-guides";
import { learnGuideMarkdown, markdownFileResponse } from "@/lib/guide-markdown";

export function getStaticPaths() {
  return learnGuideSlugs.map((topic) => ({ params: { topic } }));
}

export const GET: APIRoute = ({ params }) => {
  const body = learnGuideMarkdown(params.topic ?? "");
  if (!body) return new Response("Not found", { status: 404 });
  return markdownFileResponse(body, `/learn/${params.topic}`);
};
