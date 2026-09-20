# SEO content policy (pass 1)

This document defines which catalog entries receive static category detail pages (for example `/tools/[slug]`, `/sdks/[slug]`) and which stay **explore-only** (`indexOnly`).

## Goals

- Stop emitting hundreds of thin HTML URLs that restate a title and one line of copy.
- Keep crawl budget for listings with enough unique, useful body text.
- Preserve directory density on `/explore` and category hubs via cards that link out when there is no detail page.

## Rubric

### Detail page (KEEP)

Generate a category-scoped detail URL via `getItemPath()` (see pass 2 IA in `src/lib/item-paths.ts`), include in `sitemap.xml`, and require **≥ 400 characters** of unique body copy across `description`, notes, and auto/editorial blurbs unless catalog `editorialBlurb` already satisfies the threshold.

An item earns a detail page when **any** of the following hold (and it is not a duplicate demotion):

| Signal | Rule |
|--------|------|
| Long overview | `description` ≥ 400 characters |
| Rich overview | `description` ≥ 200 characters **and** rich signal score ≥ 2 |
| High signal | Featured, official badge/category, or ≥ 400 GitHub stars **and** `description` ≥ 80 characters |
| Strong links | Rich signal score ≥ 3 **and** `description` ≥ 100 characters |
| Live demo | `demoUrl` set **and** `description` ≥ 80 characters |
| Active repo | `repoUrl` **and** ≥ 100 stars **and** `description` ≥ 90 characters |
| SDK shelf | Category `sdks`, `repoUrl`, **and** `description` ≥ 120 characters |
| Moderate copy + links | `description` ≥ 150 characters **and** rich signal score ≥ 1 |

**Rich signal score** (implemented in `src/lib/content-policy.ts`):

- +2 live demo URL
- +1 distinct repo URL, announcement URL, verified/source note, badge, or 4+ tags (each counted once per type as in code)

**High-signal overrides:** catalog `detailPage: true` always keeps a detail page. Featured listings that pass the high-signal path receive an auto **editorial blurb** when body copy is still under 400 characters.

### Product profiles (rich detail pages)

Listings with a hand-written entry in `src/data/product-profiles.ts` always receive a detail page, count profile copy toward the 400-character body threshold, and render extended sections (problem, Jev usage, FAQ with JSON-LD, showcase embeds when `demoIds` match). Explore filter: `/explore?products=1`. Do not add a profile without enough verified facts for a thick page.

### Explore-only (`indexOnly`)

Default for stubs, one-liners, link-only guide entries, and listings that fail the rules above.

- Still listed on `/explore`, search, and category grids.
- Cards link to the primary external URL (no on-site detail page).
- Omitted from `sitemap.xml` item URLs.

**Catalog overrides:** `indexOnly: true` forces explore-only. `detailPage: true` forces a detail page.

### Duplicate demotion

If two or more listings share the same normalized overview text (first 160 characters), only the highest keeper score retains a detail page. Others are `indexOnly` to avoid near-duplicate SERP URLs.

### Learn and category hubs

Learn guides must carry **≥ ~300 words** of original Jev/TypeSafe guidance (see `src/data/learn-guides.ts`). Category hubs use expanded intros in `src/data/categories-data.ts` plus live listing grids.

## Implementation

- Policy: `src/lib/content-policy.ts`
- Enriched catalog load: `src/data/items/index.ts`
- Static paths + sitemap: `src/pages/{sdks,tools,apps,games,benchmarks,guides}/[slug].astro`, `src/lib/sitemap-xml.ts`, `src/lib/item-paths.ts`
- UI: `src/components/item-card.tsx` (detail vs external link)

## Page counts (pass 1 baseline)

Run `pnpm build` and inspect Astro route output, or log `contentPolicyStats` from `src/data/items/index.ts`.

| Metric | Before pass 1 | After pass 1 |
|--------|----------------|--------------|
| Catalog listings | 488 | 488 |
| Detail HTML pages | 488 | 131 |
| Explore-only (`indexOnly`) | 0 | 357 |
| Sitemap item URLs | 488 | 131 |
| Total static HTML routes (approx.) | ~508 | 151 |

Exact after counts are printed in the PR summary from the build on this branch.

## Voice and accuracy

- Jev is TypeSafe **System One** (Choice / Score / Noul), not a chat LLM.
- No em dashes in new copy.
- This directory is independent from TypeSafe AI unless a listing is official.
