import { buildOpenApiSpec } from "../../src/lib/agent-surface";

export const onRequest: PagesFunction = () => {
  const spec = buildOpenApiSpec();
  const lines = [
    "openapi: 3.1.0",
    "info:",
    `  title: ${JSON.stringify(spec.info.title)}`,
    `  version: "${spec.info.version}"`,
    `  description: ${JSON.stringify(spec.info.description)}`,
    "servers:",
    ...spec.servers.map((s) => `  - url: ${s.url}`),
    "paths:",
    "  /openapi.json:",
    "    get:",
    "      operationId: getOpenApiJson",
    "      summary: OpenAPI document (JSON canonical)",
    "      responses:",
    '        "200":',
    "          description: OpenAPI JSON",
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
