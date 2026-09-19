import type { APIRoute } from "astro";
import { generateSitemapXml } from "@/lib/sitemap-xml";

export const GET: APIRoute = () =>
  new Response(generateSitemapXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
