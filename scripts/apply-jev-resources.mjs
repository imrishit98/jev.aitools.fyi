/**
 * One-shot catalog updates for Jev ecosystem resources (2026-09-19).
 * Run: node scripts/apply-jev-resources.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const catalogPath = resolve("src/data/catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const bySlug = new Map(catalog.map((item) => [item.slug, item]));

function upsert(item) {
  bySlug.set(item.slug, item);
}

function patch(slug, partial) {
  const existing = bySlug.get(slug);
  if (!existing) {
    console.warn(`skip patch: missing slug ${slug}`);
    return;
  }
  bySlug.set(slug, { ...existing, ...partial });
}

const verified = "Primary sources checked 2026-09-19.";

upsert({
  slug: "classifier-dev",
  title: "classifier.dev",
  oneLiner:
    "Zero-shot text classification over plain HTTP. Fast tier runs Jev; smart tier re-asks when confidence is below 0.7.",
  description:
    "classifier.dev is a hosted zero-shot text classifier: send labels and text, get calibrated scores back over REST with no account on the free tier. The fast tier uses Jev; the smart tier escalates uncertain items to a reasoning model (public smart requests cap at 200 inputs per call). OpenAPI lives at classifier.dev/openapi.json; llms.txt at classifier.dev/llms.txt. Measured on classifier.dev/benchmark (400 items each, live 2026-09-18): fast tier AG News 87.5% and emotion 61.8%; smart tier AG News 90.0% and emotion 62.7%. Free per-IP limits count classifications, not HTTP requests: fast 3,000/min and 20,000/day; smart 200/min and 2,000/day. Pro is $20/month with Bearer classifier_pro_... keys (fast 30,000/min and 200,000/day; smart 2,000/min and 20,000/day). The site states fast model cost about $0.005 per thousand classifications and smart escalations about $0.70 per thousand on its own pricing and benchmark pages. Privacy policy: text is not stored or logged; it is sent to the model provider only to classify.",
  category: "applications",
  tags: ["applications", "classification", "moderation", "mcp", "api"],
  language: "TypeScript",
  url: "https://classifier.dev",
  demoUrl: "https://classifier.dev",
  repoUrl: "https://github.com/mrmps/classifier-dev",
  postUrl: "https://classifier.dev/pricing",
  featured: true,
  badges: ["featured", "has-demo", "mcp"],
  creatorHandle: "michael_chomsky",
  sourcePlatform: "web",
  sourceNote: `https://classifier.dev/ and https://classifier.dev/pricing. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

upsert({
  slug: "classifier-dev-cli",
  title: "classifier-dev CLI",
  oneLiner:
    "Global npm CLI for classifier.dev batches, dimensions, and multi-label jobs from your terminal.",
  description:
    "Install with npm i -g classifier-dev (package classifier-dev on npm). The open source repo is github.com/mrmps/classifier-dev. It talks to the same classifier.dev REST API as the website, including fast and smart tiers, batch posts up to 1,000 inputs, and Pro keys via --api-key or CLASSIFY_API_KEY (CLASSIFIER_API_KEY also works per pricing docs). Handy when you want shell scripts that classify logs without standing up your own Jev stack.",
  category: "sdks",
  tags: ["sdk", "classification", "cli"],
  language: "TypeScript",
  url: "https://github.com/mrmps/classifier-dev",
  repoUrl: "https://github.com/mrmps/classifier-dev",
  demoUrl: "https://classifier.dev",
  creatorHandle: "michael_chomsky",
  sourcePlatform: "github",
  sourceNote: `https://classifier.dev/pricing (CLI section) and https://github.com/mrmps/classifier-dev. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

upsert({
  slug: "classifier-dev-mcp",
  title: "classifier.dev MCP",
  oneLiner:
    "Streamable HTTP MCP for classify_texts, dimensions, multi-label, and doc search. Free tier needs no API key.",
  description:
    "Two Streamable HTTP MCP endpoints from classifier.dev: https://classifier.dev/mcp exposes classify_texts, classify_dimensions, classify_multi_label, count_labels, and review_uncertain; https://classifier.dev/mcp/docs exposes list_docs, read_doc, and search_docs. Registry ids include dev.classifier/classifier and dev.classifier/docs. Setup guide: classifier.dev/mcp-setup. Free tier uses the same per-IP classification limits as the REST API (no key). Pro uses Bearer classifier_pro_... on MCP or REST. Agent skill install: npx skills add https://classifier.dev (well-known at /.well-known/agent-skills/index.json and /skill.md). Skills leaderboard: classifier.dev/skills.",
  category: "agent-tooling",
  tags: ["agent tooling", "mcp", "classification"],
  url: "https://classifier.dev/mcp",
  demoUrl: "https://classifier.dev/mcp-setup",
  repoUrl: "https://github.com/mrmps/classifier-dev",
  badges: ["mcp", "has-demo"],
  creatorHandle: "michael_chomsky",
  sourcePlatform: "web",
  sourceNote: `https://classifier.dev/mcp and https://classifier.dev/mcp-setup. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

upsert({
  slug: "openrouter-typesafe-jev-1-13",
  title: "OpenRouter Jev 1.13",
  oneLiner:
    "typesafe/jev-1.13 on OpenRouter Decisions API: $0.042/M input tokens, $0/M output, 32k context.",
  description:
    "OpenRouter lists typesafe/jev-1.13 (jev-latest alias family) for TypeSafe's structured decision model. Published pricing on openrouter.ai/typesafe/jev-1.13: $0.042 per million input tokens and $0 per million output tokens, with a 32,000 token context window. The model page notes release on Sep 18, 2026. Routing uses OpenRouter's Decisions API rather than chat completions. Bring OPENROUTER_API_KEY.",
  category: "integrations",
  tags: ["integrations", "routing", "sdk"],
  url: "https://openrouter.ai/typesafe/jev-1.13",
  demoUrl: "https://openrouter.ai/typesafe/jev-1.13",
  postUrl: "https://openrouter.ai/typesafe",
  badges: ["has-demo"],
  sourcePlatform: "web",
  sourceNote: `https://openrouter.ai/typesafe/jev-1.13. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

upsert({
  slug: "cloudflare-workers-ai-typesafe-jev",
  title: "Cloudflare Workers AI Jev",
  oneLiner:
    "Run typesafe/jev on Workers AI with Choice, Score, and Noul via env.AI.run.",
  description:
    "Cloudflare documents model id typesafe/jev for TypeSafe's structured evaluation model on Workers AI. Context window is listed as 32,000 tokens. Call pattern from Cloudflare docs: env.AI.run('typesafe/jev', { state, questions }) with noul, choice, and score question shapes. Dollar pricing is not published on the model page; Cloudflare points to dashboard pricing. TypeSafe's public list price elsewhere is $0.042 per million input tokens with output free (typesafe.ai blog Sep 15, 2026).",
  category: "integrations",
  tags: ["integrations", "sdk", "agents"],
  language: "TypeScript",
  url: "https://developers.cloudflare.com/ai/models/typesafe/jev/",
  demoUrl: "https://developers.cloudflare.com/ai/models/typesafe/jev/",
  badges: ["has-demo"],
  sourcePlatform: "official",
  sourceNote: `https://developers.cloudflare.com/ai/models/typesafe/jev/. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

upsert({
  slug: "pypi-jev-cli",
  title: "jev-cli (PyPI)",
  oneLiner:
    "Python CLI and stdio MCP for Jev with official, Vercel Gateway, and OpenRouter backends.",
  description:
    "PyPI package jev-cli (v0.6.2 at time of indexing): small CLI plus stdio MCP server for TypeSafe Jev. Providers documented on PyPI: official API with TYPESAFE_API_KEY, Vercel AI Gateway with AI_GATEWAY_API_KEY targeting typesafe-ai/jev, OpenRouter with OPENROUTER_API_KEY targeting typesafe/jev-1.13, plus custom endpoints. Install via pip from pypi.org/project/jev-cli/. Distinct from unrelated jev-cli repos on GitHub by other authors.",
  category: "sdks",
  tags: ["sdk", "mcp", "cli", "agents"],
  language: "Python",
  url: "https://pypi.org/project/jev-cli/",
  demoUrl: "https://pypi.org/project/jev-cli/",
  badges: ["mcp"],
  sourcePlatform: "web",
  sourceNote: `https://pypi.org/project/jev-cli/. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

patch("brainwires-jevwire", {
  oneLiner:
    "jevwire MCP and DecisionModel library for Jev evaluate, rank, verify, and gate tools (needs TYPESAFE_API_KEY).",
  description:
    "Brainwires jevwire packages a Jev decision layer for agents: Streamable MCP server, embeddable DecisionModel library, and a Claude Code plugin marketplace entry (Brainwires/jevwire). npm package jevwire; repo github.com/Brainwires/jevwire. Requires TYPESAFE_API_KEY for the official TypeSafe API. Documented MCP tools include jev_evaluate, jev_rank, jev_verify, jev_gate_action, jev_next_step, and jev_list_models. TypeSafe lists Jev at $0.042 per million input tokens with output free (Sep 15, 2026 launch post). Also indexed on Glama as jev-mcp by Brainwires.",
  tags: ["agent tooling", "mcp", "agents", "sdk"],
  badges: ["mcp"],
  sourceNote: `https://github.com/Brainwires/jevwire and https://glama.ai/mcp/servers/Brainwires/jev-mcp. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

patch("jev-on-vercel-ai-gateway", {
  oneLiner:
    "typesafe-ai/jev on Vercel AI Gateway: $0.042/M input, 32k context, AI SDK experimental_evaluate.",
  description:
    "Vercel AI Gateway hosts model id typesafe-ai/jev for System One style evaluate calls through the AI SDK, including experimental_evaluate and gateway.evaluationModel('typesafe-ai/jev'). Vercel's model page and KB guide list $0.042 per million input tokens with no output charge and a 32,000 token context window. AI Gateway billing: $5/month free credit then pay-as-you-go credits with no markup on model rates (vercel.com/docs/ai-gateway/pricing). Provider options can request ZDR / No Training per request. Good path when you want gateway routing before direct TypeSafe credentials.",
  featured: true,
  badges: ["has-demo", "featured"],
  postUrl: "https://vercel.com/kb/guide/typesafe-jev-and-ai-sdk",
  sourceNote: `https://vercel.com/ai-gateway/models/jev and https://vercel.com/kb/guide/typesafe-jev-and-ai-sdk. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

patch("vercel-ai-sdk-provider", {
  oneLiner:
    "@ai-sdk/typesafe-ai provider: TYPESAFE_AI_API_KEY, baseURL api.typesafe.ai/v1, evaluate helpers.",
  description:
    "Official Vercel AI SDK provider package @ai-sdk/typesafe-ai (docs at ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai). Configure TYPESAFE_AI_API_KEY and base URL https://api.typesafe.ai/v1. Supports experimental_evaluate flows with jev-latest and related aliases. Pair with Vercel AI Gateway model typesafe-ai/jev when you want gateway routing instead of direct TypeSafe credentials.",
  sourceNote: `https://ai-sdk.dev/providers/ai-sdk-providers/typesafe-ai. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

patch("http-api-reference", {
  oneLiner:
    "POST https://api.typesafe.ai/v1/systemone contract; Jev aliases include jev-latest and jev-1.13.x per docs.",
  description:
    "Canonical HTTP reference for TypeSafe System One. Endpoint POST https://api.typesafe.ai/v1/systemone accepts structured state and parallel Choice, Score, and Noul questions. Public pricing from TypeSafe's Sep 15, 2026 launch post: $0.042 per million input tokens, output tokens free. Model aliases documented across TypeSafe and gateway surfaces include jev-latest and jev-1.13 / jev-1.13.0 style ids; confirm exact strings in docs.typesafe.ai before you ship. End-to-end latency cited by TypeSafe: about 70 ms to 500 ms for typical batches.",
  featured: true,
  badges: ["official", "has-demo", "featured"],
  sourceNote: `https://docs.typesafe.ai/api and https://typesafe.ai/blog/introducing-system-one-models-and-jev. ${verified}`,
  updatedAt: "2026-09-19",
  detailPage: true,
});

const newSlugs = new Set([
  "classifier-dev",
  "classifier-dev-cli",
  "classifier-dev-mcp",
  "openrouter-typesafe-jev-1-13",
  "cloudflare-workers-ai-typesafe-jev",
  "pypi-jev-cli",
]);

const next = catalog.map((item) => bySlug.get(item.slug) ?? item);
for (const slug of newSlugs) {
  if (!catalog.some((item) => item.slug === slug)) {
    next.push(bySlug.get(slug));
  }
}
writeFileSync(catalogPath, JSON.stringify(next));
console.log(`catalog.json: ${next.length} listings (+${next.length - catalog.length} new)`);
