import type { APIRoute } from "astro";
import { generateSitemapGuidesXml } from "@/lib/sitemap-xml";

export const GET: APIRoute = () =>
  new Response(generateSitemapGuidesXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
