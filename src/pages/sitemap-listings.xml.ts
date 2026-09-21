import type { APIRoute } from "astro";
import { generateSitemapListingsXml } from "@/lib/sitemap-xml";

export const GET: APIRoute = () =>
  new Response(generateSitemapListingsXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
