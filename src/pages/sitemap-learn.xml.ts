import type { APIRoute } from "astro";
import { generateSitemapLearnXml } from "@/lib/sitemap-xml";

export const GET: APIRoute = () =>
  new Response(generateSitemapLearnXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
