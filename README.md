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

## Cloudflare Pages (free plan)

1. Connect the GitHub repo **imrishit98/jev.aitools.fyi** in Cloudflare Pages.
2. **Build command:** `pnpm install && pnpm build`
3. **Build output directory:** `dist`
4. **Environment variable:** `PUBLIC_SITE_URL=https://jev.aitools.fyi`
5. Add custom domain **jev.aitools.fyi** in Pages → Custom domains.

Local Pages simulation:

```bash
pnpm build
pnpm pages:dev
```

Or preview the static build:

```bash
pnpm preview
```

`wrangler.toml` is included for `wrangler pages dev dist`.

## Data

Listings are generated from the public [awesomejev.com](https://awesomejev.com) index:

```bash
curl -sL https://awesomejev.com/ -o /tmp/awesomejev.html
node scripts/generate-catalog.mjs
```

Output: `src/data/catalog.json` (488 entries at last ingest).

## SEO / LLM discovery

| Artifact | URL |
| --- | --- |
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| LLM map | `/llms.txt` |
| Publisher info | `/.well-known/jev-directory.json` |
| Default OG image | `/og.svg` |

## Routes

Home, faceted **Explore**, **488** item pages, category hubs, learn guides, submit, about.

## Affiliation

Curated by **aitools.fyi**. Not affiliated with TypeSafe AI unless a listing says otherwise.
