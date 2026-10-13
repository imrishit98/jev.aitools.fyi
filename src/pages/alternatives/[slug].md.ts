import type { APIRoute } from "astro";
import { alternativeSlugs, getAlternative } from "@/data/alternatives";
import { alternativeMarkdown } from "@/lib/alternative-markdown";
import { markdownFileResponse } from "@/lib/guide-markdown";

export function getStaticPaths() {
  return alternativeSlugs.map((slug) => ({ params: { slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const alt = getAlternative(params.slug ?? "");
  if (!alt) return new Response("Not found", { status: 404 });
  const path = `/alternatives/${params.slug}`;
  return markdownFileResponse(alternativeMarkdown(alt, path), path);
};
