import { siteConfig } from "@/lib/site";

const SITE = siteConfig.url.replace(/\/$/, "");

export function prefersMarkdownAccept(acceptHeader: string | null): boolean {
  if (!acceptHeader?.trim()) return false;
  const types = acceptHeader.split(",").map((part) => {
    const [rawMime, ...params] = part.trim().split(";");
    const mime = rawMime.trim().toLowerCase();
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "1") : 1;
    return { mime, q: Number.isFinite(q) ? q : 0 };
  });

  const score = (mime: string) => {
    const direct = types.find((t) => t.mime === mime);
    if (direct) return direct.q;
    const any = types.find((t) => t.mime === "*/*");
    return any ? any.q * 0.01 : 0;
  };

  return score("text/markdown") > score("text/html");
}

export function homeMarkdownBody(): string {
  return `# ${siteConfig.hostnameBrand} (${siteConfig.name})

> ${siteConfig.description}

${siteConfig.tagline}. This is the curated, link-first index for TypeSafe **Jev** (System One): SDKs, MCP servers, agent tooling, demos, games, benchmarks, and guides.

## Start here

- [Explore listings](${SITE}/explore)
- [Learn hub](${SITE}/learn)
- [Submit a project](${SITE}/submit)
- [About and disclaimer](${SITE}/about)
- [Developers and agents](${SITE}/developers)

## Agent-facing URLs

- [llms.txt](${SITE}/llms.txt): site map for LLMs
- [OpenAPI](${SITE}/openapi.json): machine-readable surface for this directory (not the TypeSafe inference API)
- [Sitemap](${SITE}/sitemap.xml)
- [Directory manifest](${SITE}/.well-known/jev-directory.json)
- [Search index JSON](${SITE}/search-index.json)

## JSON errors

Unknown routes under \`/api/*\` return structured JSON errors (\`application/json\`). See OpenAPI for shapes and probe paths.

Canonical: ${SITE}/
`;
}

export function notFoundMarkdownBody(pathname: string): string {
  const pathNote = pathname && pathname !== "/" ? `\n\nRequested path: \`${pathname}\`.` : "";
  return `# Not found

We looked everywhere polite and could not find that page on ${siteConfig.hostnameBrand} (${siteConfig.name}).${pathNote}

## Try these instead

- [Home](${SITE}/)
- [llms.txt](${SITE}/llms.txt)
- [Sitemap](${SITE}/sitemap.xml)
- [Learn guides](${SITE}/learn)
`;
}

export type AgentJsonErrorCode = "not_found" | "method_not_allowed";

export function agentJsonError(
  code: AgentJsonErrorCode,
  message: string,
  hint: string,
  status = 404,
): Response {
  return new Response(
    JSON.stringify({
      error: { code, message, hint },
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

export function buildOpenApiSpec() {
  return {
    openapi: "3.1.0",
    info: {
      title: `${siteConfig.name} — agent surface`,
      version: "1.0.0",
      description:
        "Read-only discovery endpoints for jev.aitools.fyi. This describes the directory site, not TypeSafe's Jev inference API.",
    },
    servers: [{ url: SITE }],
    paths: {
      "/": {
        get: {
          operationId: "getHome",
          summary: "Homepage",
          description:
            "HTML by default. With Accept: text/markdown, returns a Markdown overview (Vary: Accept).",
          parameters: [
            {
              name: "Accept",
              in: "header",
              required: false,
              schema: { type: "string" },
              examples: {
                markdown: { value: "text/markdown" },
                html: { value: "text/html" },
              },
            },
          ],
          responses: {
            "200": {
              description: "Homepage document",
              content: {
                "text/html": { schema: { type: "string" } },
                "text/markdown": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/llms.txt": {
        get: {
          operationId: "getLlmsTxt",
          summary: "LLM-oriented site guide",
          responses: {
            "200": {
              description: "Plain-text llms.txt",
              content: {
                "text/plain": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/sitemap.xml": {
        get: {
          operationId: "getSitemap",
          summary: "XML sitemap of indexable pages",
          responses: {
            "200": {
              description: "Sitemap XML",
              content: {
                "application/xml": { schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/search-index.json": {
        get: {
          operationId: "getSearchIndex",
          summary: "Client-side search index for listings",
          responses: {
            "200": {
              description: "Array of searchable listing entries",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["slug", "title", "href"],
                      properties: {
                        slug: { type: "string" },
                        title: { type: "string" },
                        oneLiner: { type: "string" },
                        href: { type: "string", format: "uri" },
                        category: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/.well-known/jev-directory.json": {
        get: {
          operationId: "getDirectoryManifest",
          summary: "Directory manifest for agents",
          responses: {
            "200": {
              description: "JSON manifest with counts and URL patterns",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["name", "url", "llms_txt", "sitemap"],
                    properties: {
                      name: { type: "string" },
                      url: { type: "string", format: "uri" },
                      catalog_listings: { type: "integer" },
                      detail_pages: { type: "integer" },
                      llms_txt: { type: "string", format: "uri" },
                      sitemap: { type: "string", format: "uri" },
                      openapi: { type: "string", format: "uri" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/openapi.json": {
        get: {
          operationId: "getOpenApiJson",
          summary: "This OpenAPI document",
          responses: {
            "200": {
              description: "OpenAPI 3.x JSON",
              content: {
                "application/json": {
                  schema: { type: "object" },
                },
              },
            },
          },
        },
      },
      "/api/{path}": {
        get: {
          operationId: "apiCatchAllGet",
          summary: "JSON error surface (GET)",
          parameters: [
            {
              name: "path",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "404": {
              description: "Structured not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AgentError" },
                },
              },
            },
          },
        },
        post: {
          operationId: "apiCatchAllPost",
          summary: "JSON error surface (POST)",
          parameters: [
            {
              name: "path",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "404": {
              description: "Structured not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/AgentError" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        AgentError: {
          type: "object",
          required: ["error"],
          properties: {
            error: {
              type: "object",
              required: ["code", "message", "hint"],
              properties: {
                code: { type: "string", enum: ["not_found", "method_not_allowed"] },
                message: { type: "string" },
                hint: { type: "string" },
              },
            },
          },
        },
      },
    },
  };
}
