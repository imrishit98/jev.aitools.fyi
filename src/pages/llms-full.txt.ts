import type { APIRoute } from "astro";
import { generateLlmsFullTxt } from "@/lib/llms-content";

export const GET: APIRoute = () =>
  new Response(generateLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
