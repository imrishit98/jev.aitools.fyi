import type { APIRoute } from "astro";
import { generateRobotsTxt } from "@/lib/sitemap-xml";

export const GET: APIRoute = () =>
  new Response(generateRobotsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
