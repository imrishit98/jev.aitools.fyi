# Jev Directory (`jev-directory`)

Curated public directory of the TypeSafe **Jev** (System One) ecosystem: SDKs, integrations, agent tooling, demos, games, benchmarks, and guides. Built for **[jev.aitools.fyi](https://jev.aitools.fyi)** as part of the [aitools.fyi](https://aitools.fyi) family (Southern East Inc.).

> **GitHub:** [github.com/imrishit98/jev.aitools.fyi](https://github.com/imrishit98/jev.aitools.fyi). Production hostname target **[jev.aitools.fyi](https://jev.aitools.fyi)**.

## Stack

- **Astro 5** (static output) + React islands for theme, search, explore filters
- Tailwind CSS 4 + shadcn/ui tokens
- pnpm

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

Optional canonical URL at build time:

```bash
PUBLIC_SITE_URL=https://jev.aitools.fyi pnpm build
```

## Production build

```bash
PUBLIC_SITE_URL=https://jev.aitools.fyi pnpm build
pnpm preview
```

Static output lives in `dist/` (all routes pre-rendered).

## Deploy (Cloudflare)

**Preferred:** Cloudflare **Pages** project connected to this repo ([imrishit98/jev.aitools.fyi](https://github.com/imrishit98/jev.aitools.fyi)).

| Setting | Value |
| --- | --- |
| Build command | `pnpm install && pnpm build` |
| Build output directory | `dist` |
| Deploy command | *(leave empty — do not use `npx wrangler deploy`)* |
| Environment variable | `PUBLIC_SITE_URL=https://jev.aitools.fyi` |
| Web Analytics (optional) | `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` — see below |

Add custom domain **jev.aitools.fyi** in Pages → Custom domains.

### Cloudflare Web Analytics

Cookieless page-view analytics via Cloudflare (not Google Analytics).

1. Cloudflare Dashboard → **Analytics & Logs** → **Web Analytics** → **Add site** (hostname **jev.aitools.fyi**).
2. Copy the site **token**.
3. In your Cloudflare **Pages** project → **Settings** → **Environment variables**, set `PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` to that token (Production, and Preview if desired).
4. Trigger a new deployment (rebuild). The beacon is injected site-wide only when this variable is non-empty; local `pnpm dev` / builds without the token omit the script.

`wrangler.toml` `[vars]` may document the name as a commented placeholder — do not commit a real token in the repo.

If you deploy with **Workers static assets** (`pnpm deploy` / `npx wrangler deploy`), `wrangler.toml` sets `[assets].directory` to `./dist` so the same build output is used.

Local Pages simulation:

```bash
pnpm build
pnpm pages:dev
```

Or preview the static build:

```bash
pnpm preview
```

Manual Pages upload: `pnpm pages:deploy` (after `pnpm build`).

## Data

Regenerate the catalog from saved HTML (maintainer workflow):

```bash
curl -sL https://awesomejev.com/ -o /tmp/awesomejev.html
node scripts/generate-catalog.mjs
```

The generator ingests a public community index HTML export; marketing copy and attribution stripping are applied via `src/data/catalog-marketing-overrides.json` and `src/lib/apply-catalog-overrides.ts`. The live site does not display third-party index attribution.

Output: `src/data/catalog.json` (494 entries at last ingest; hand-edited additions live beside awesomejev imports).

Hand-maintained ecosystem patches (classifier.dev, gateway pricing, PyPI `jev-cli`, and similar) can be reapplied with:

```bash
node scripts/apply-jev-resources.mjs
```

**SEO content policy:** see [docs/seo-content-policy.md](./docs/seo-content-policy.md). Most listings stay on Explore without a thin detail page; kept entries use category paths (`/tools/`, `/sdks/`, `/apps/`, and similar) in the sitemap. Legacy `/items/*` URLs 301 via `dist/_redirects`.

## SEO / LLM discovery

| Artifact | URL |
| --- | --- |
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| LLM map | `/llms.txt` |
| Publisher info | `/.well-known/jev-directory.json` |
| Default OG image | `/og/home.png` (PNG set generated at build; see `pnpm generate:og`) |
| OG samples (docs) | `docs/og-samples/` |

## Routes

Home, faceted **Explore**, **144** item detail pages (494 catalog entries), category hubs, learn guides (including where-to-run-jev), submit, about.

## Affiliation

Curated by **aitools.fyi**. Not affiliated with TypeSafe AI unless a listing says otherwise.
