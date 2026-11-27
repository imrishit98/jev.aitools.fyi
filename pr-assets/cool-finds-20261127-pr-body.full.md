- Researchers searching for WePocketModel or WePM get a single page that explains Tencent's on-device model does embeddings, everyday generation, and typed judgments in one download, with links to the open code, weights, and technical report.
- The page compares that all-in-one local stack to Valen (decisions only), Jeveration (image generation), and Cloudflare Clef (hosted decision API) so readers do not confuse roles.
- Benchmark numbers on the page come from the authors' November 2026 report and the project README, including decision averages and memory guidance, without claiming this site is affiliated with Tencent or TypeSafe.
- Explore and integration category counts, search, sitemap, and crawler manifests now include the new listing alongside an updated Valen cross-link.
- Desktop and mobile screenshots in this pull request show the finished detail page layout for reviewers who do not run the site locally.

SEO/LLM impact: One answer-first `/tools/` profile for WePocketModel with sourced metrics, FAQ entries, structured sections, and internal links to Valen, Jeveration, and Clef should improve retrieval for on-device unified multimodal model intents.

**Technical details**

- Published profile `tencent-wepocketmodel` in `src/data/product-profiles.ts` (`firstSeen: 2026-11-27`).
- Catalog supplement row, editorial blurb, and marketing override; Valen `relatedSlugs` and `howJevIsUsed` cross-link back (Jeveration copy untouched).
- `src/data/lastmod-manifest.json` bumps for `/tools/tencent-wepocketmodel`, `/tools/liuziyu77-valen`, `/categories/integrations`, and `/explore`.
- `public/.well-known/jev-directory.json` catalog 637, detail pages 305.
- Cross-links in profile: `liuziyu77-valen`, `carol-lyh-jeveration`, `cloudflare-clef`, plus `yinsongxu-llm2jev` and `mapika-decider`.

**Meta character counts**

| slug | metaTitle (<=60) | metaDescription (<=160) |
|------|------------------|-------------------------|
| tencent-wepocketmodel | 47 | 152 |

**Screenshots (desktop and mobile)**

| Profile | Desktop | Mobile |
|---------|---------|--------|
| WePM | ![tencent-wepocketmodel desktop](/opt/cursor/artifacts/tencent-wepocketmodel-desktop.png) | ![tencent-wepocketmodel mobile](/opt/cursor/artifacts/tencent-wepocketmodel-mobile.png) |

**Build proof (`pnpm lastmod:update`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`)**

Full build log: [pr-assets/cool-finds-20261127-build.log](pr-assets/cool-finds-20261127-build.log)

`pnpm exec tsc --noEmit` still reports pre-existing TypeScript issues in unrelated components; the production `pnpm build` pipeline (including meta checks and `verify-seo-artifacts.mjs`) completed successfully.

```
SEO artifacts OK: sitemap index + 4 child maps, 367 URLs (305 detail), catalog 637, redirects 642.
verify-markdown-negotiation: ok
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
```