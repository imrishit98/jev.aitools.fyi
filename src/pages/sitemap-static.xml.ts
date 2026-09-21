import type { APIRoute } from "astro";
import { generateSitemapStaticXml } from "@/lib/sitemap-xml";

export const GET: APIRoute = () =>
  new Response(generateSitemapStaticXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
