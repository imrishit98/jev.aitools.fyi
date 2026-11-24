- Researchers get a plain-language page on Jeveration: one pass that draws a full 512-pixel picture using parallel image codes, with author-reported speed and quality tables and links to weights and demos.
- That page explains how this differs from decision-model listings that only score options (Valen) or playground diffusion experiments, so readers do not confuse generation with classification.
- Telegram group owners get a page on Jev Anti-Spam: add the bot as admin, no captcha for members, and high-confidence spam deletes while normal chat stays up if the service is down.
- That page documents the default delete threshold, split-message memory, and comparisons to captcha bots and full admin suites from the maintainer README.
- QA teams get a page on jev-ui-test: write cases in everyday language, let Jev pick real controls without fragile selectors, and keep pass or fail in ordinary test assertions with rich reports.

SEO/LLM impact: Three answer-first profiles (Jeveration single-pass image gen, captcha-free Telegram moderation, selector-free UI regression) with dated GitHub star counts, author- or maintainer-attributed metrics, FAQs, and cross-links should improve retrieval for those intents without overlapping EO-Jev or job-search slugs.

**Technical details**

- Published profiles `carol-lyh-jeveration` (`/tools/`), `backmeupplz-jev-antispam-bot` (`/apps/`), and `buer2233-jev-ui-test` (`/apps/`) in `src/data/product-profiles.ts` (`firstSeen: 2026-11-24`).
- Catalog supplement rows in `src/data/catalog-supplement.json`; editorial blurbs in `src/data/editorial-blurbs.ts`; marketing override for Jeveration in `catalog-marketing-overrides.json`.
- GitHub star rows in `src/data/alternatives-metrics.json` (snapshot date unchanged).
- `src/data/lastmod-manifest.json` bumps for three detail URLs plus category and explore hashes.
- `public/.well-known/jev-directory.json` catalog 636, detail pages 304.
- Cross-links: Jeveration to `wizhill05-typesafe-image-diffusion`, `liuziyu77-valen`; anti-spam to `brainstormity-jev-moderation-bot`, `bitnovus-jev-spam-eval`, `lambertsj-beatjev`; jev-ui-test to `browser-use-jev-ultrafast`, `agent-labs-dev-fastbrowse`.

**Meta character counts**

| slug | metaTitle (<=60) | metaDescription (<=160) |
|------|------------------|-------------------------|
| carol-lyh-jeveration | 44 | 154 |
| backmeupplz-jev-antispam-bot | 43 | 155 |
| buer2233-jev-ui-test | 45 | 155 |

**Screenshots (desktop and mobile)**

| Profile | Desktop | Mobile |
|---------|---------|--------|
| Jeveration | ![carol-lyh-jeveration desktop](/opt/cursor/artifacts/carol-lyh-jeveration-desktop.png) | ![carol-lyh-jeveration mobile](/opt/cursor/artifacts/carol-lyh-jeveration-mobile.png) |
| Jev Anti-Spam | ![backmeupplz-jev-antispam-bot desktop](/opt/cursor/artifacts/backmeupplz-jev-antispam-bot-desktop.png) | ![backmeupplz-jev-antispam-bot mobile](/opt/cursor/artifacts/backmeupplz-jev-antispam-bot-mobile.png) |
| jev-ui-test | ![buer2233-jev-ui-test desktop](/opt/cursor/artifacts/buer2233-jev-ui-test-desktop.png) | ![buer2233-jev-ui-test mobile](/opt/cursor/artifacts/buer2233-jev-ui-test-mobile.png) |

**Build proof (`pnpm lastmod:update`, `pnpm lint`, `pnpm build`, full log)**

See `pr-assets/cool-finds-20261124-build.log` in the branch for the complete output. Summary: lint exit 0; `lastmod manifest OK: 366 URLs`; `Meta length OK`; Astro built 366 pages; `SEO artifacts OK: sitemap ... catalog 636, redirects 641`.