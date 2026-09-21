# Jev.aitools.fyi (Jev Directory)

**Live site:** [https://jev.aitools.fyi](https://jev.aitools.fyi)

Curated public directory of the TypeSafe **Jev** (System One) ecosystem: SDKs, integrations, agent tooling, demos, games, benchmarks, and guides. Built for builders who want link-first discovery, honest star counts, and readable detail pages.

**Who it is for:** developers evaluating Jev tooling, agent authors wiring MCP and gateways, and maintainers who want a single indexable map of the ecosystem.

**Stack:** [Astro 5](https://astro.build) (static output), React islands (theme, search, explore), Tailwind CSS 4, deployed on **Cloudflare Pages** with repo-root **Pages Functions** for agent-friendly negotiation and JSON API errors.

**Repository:** [github.com/imrishit98/jev.aitools.fyi](https://github.com/imrishit98/jev.aitools.fyi)

![Homepage OG preview](https://jev.aitools.fyi/og/home.png)

## Quick start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

Production build:

```bash
PUBLIC_SITE_URL=https://jev.aitools.fyi pnpm build
pnpm preview
```

Static assets land in `dist/` (pre-rendered HTML). **`dist/index.html` must stay at the site root** so `/` returns 200 even when Pages Functions fail. `functions/index.ts` only overrides `/` when `Accept` prefers `text/markdown`; normal browsers get the static homepage via `next()`. **Do not ship a build that removes or moves `dist/index.html` unless you have verified Functions serve HTML on `/` in production.**

Agent routes live in [`functions/`](./functions/) at the repo root.

## Deploy (Cloudflare Pages)

Connect this repo to a Cloudflare **Pages** project.

| Setting | Value |
| --- | --- |
| Build command | `pnpm install && pnpm build` |
| Build output directory | `dist` |
| **Deploy command** | *(empty: Pages uploads `dist/` only)* |
| Environment variable | `PUBLIC_SITE_URL=https://jev.aitools.fyi` |
| Web Analytics (optional) | `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` |
| My First Million demo (optional) | `AI_GATEWAY_API_KEY` (Vercel AI Gateway for live Jev) |
| My First Million mock mode | Auto when no `AI_GATEWAY_API_KEY`; optional `JEV_MOCK=true` forces mock even with a key |

**Workers Builds (`pnpm deploy`):** Wrangler config is [`wrangler.toml`](./wrangler.toml) (`main`, `SITE_ASSETS`, `[vars] PUBLIC_SITE_URL`). `workers/site-and-assets.ts` handles dynamic routes (My First Million demo API at `/demos/my-first-million/api/*`) and passes other requests to the `SITE_ASSETS` binding (`dist/`). **`functions/`** still applies when you deploy via **Cloudflare Pages** git integration (`dist/_routes.json` runs Functions before static files). MFM handlers import the same module: `src/lib/mfm-jev-search/api-route.ts`.

Simulate production locally:

```bash
pnpm build
cp .dev.vars.example .dev.vars   # JEV_MOCK=true for search without a Gateway key
pnpm pages:dev
```

Live channel search demo: [https://jev.aitools.fyi/demos/my-first-million/](https://jev.aitools.fyi/demos/my-first-million/) (shortcut: [/mfm](https://jev.aitools.fyi/mfm); API under `/demos/my-first-million/api/*`).

Custom domain: **jev.aitools.fyi** in Pages → Custom domains.

## Agents and integrators

Human-readable overview: [/developers](https://jev.aitools.fyi/developers) on the live site.

The homepage and header include a **Human | Agent** switch (human is the default). Agents without JavaScript can follow **I'm an agent** to [/for-agents](https://jev.aitools.fyi/for-agents). With `Accept: text/markdown`, `GET /for-agents` and `GET /?view=agent` return Markdown crawl notes; normal browsers still get static HTML at `/` (HTTP 200).

| Artifact | URL |
| --- | --- |
| OpenAPI | `/openapi.json` |
| LLM map | `/llms.txt` |
| Sitemap | `/sitemap.xml` |
| Search index | `/search-index.json` |
| Publisher manifest | `/.well-known/jev-directory.json` |

`robots.txt` allows crawl; public pages use `index, follow`. The sitemap is linked from `robots.txt` and `llms.txt`.

### Verify agent checks (is-agentic)

After `pnpm build`, run Pages locally (`pnpm pages:dev`), then:

```bash
# 1) Markdown 404 (≥20 chars, links to /, llms.txt, sitemap)
curl -sS -L -i -H 'Accept: text/markdown' http://localhost:4321/__ora-404-probe | head -25

# 2) JSON API error shape
curl -sS http://localhost:4321/api/__ora-probe

# 3) Homepage Markdown negotiation + Vary
curl -sS -i -H 'Accept: text/markdown' http://localhost:4321/ | head -20
curl -sS -i -H 'Accept: text/html' http://localhost:4321/ | head -12
```

## Submit listings

Use [/submit](https://jev.aitools.fyi/submit) on the live site or see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Data and SEO

- Catalog: `src/data/catalog.json` (regenerate with maintainer scripts in `scripts/`).
- SEO policy: [docs/seo-content-policy.md](./docs/seo-content-policy.md).
- Legacy `/items/*` URLs 301 via `dist/_redirects`.

## License

[MIT](./LICENSE) unless a file states otherwise.

## Affiliation

Curated by [aitools.fyi](https://aitools.fyi) (Southern East Inc.). Not affiliated with TypeSafe AI unless a listing says otherwise.
