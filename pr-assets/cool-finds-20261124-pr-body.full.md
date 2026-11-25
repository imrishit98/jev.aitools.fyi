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

```
> jev-directory@0.1.0 prebuild /agent/repos/jev.aitools.fyi
> pnpm run sync:public-fonts && pnpm run generate:og && pnpm run generate:search-index && pnpm run generate:openapi


> jev-directory@0.1.0 sync:public-fonts /agent/repos/jev.aitools.fyi
> node scripts/sync-public-fonts.mjs


> jev-directory@0.1.0 generate:og /agent/repos/jev.aitools.fyi
> tsx scripts/generate-og-images.ts

Generating Open Graph images…
  listings 50/304
  listings 100/304
  listings 150/304
  listings 200/304
  listings 250/304
  listings 300/304
  listings 304/304
Done. 324 images in public/og/

> jev-directory@0.1.0 generate:search-index /agent/repos/jev.aitools.fyi
> tsx scripts/generate-search-index.ts

Wrote 636 search index entries to public/search-index.json

> jev-directory@0.1.0 generate:openapi /agent/repos/jev.aitools.fyi
> node scripts/generate-openapi.mjs

Wrote /agent/repos/jev.aitools.fyi/public/openapi.json

> jev-directory@0.1.0 build /agent/repos/jev.aitools.fyi
> node scripts/lastmod-manifest.mjs --check && node scripts/check-meta-length.mjs && node scripts/verify-demo-asset-sizes.mjs --public-only && node scripts/verify-showcase-video-referrer-policy.mjs && node scripts/verify-agent-guide-catalog-links.mjs && astro build && node scripts/write-redirects.mjs && node scripts/write-md-headers.mjs && node scripts/check-meta-uniqueness.mjs && node scripts/verify-explore-seo.mjs && node scripts/verify-not-found-seo.mjs && node scripts/verify-seo-artifacts.mjs && node scripts/verify-markdown-negotiation.mjs && node scripts/verify-demo-asset-sizes.mjs --dist-only

lastmod manifest OK: 366 URLs
Meta length OK (482 source fields, titles <= 60, descriptions <= 160).
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
Showcase video referrer policy OK (ShowcaseDemoVideo + no raw <video> in card/lightbox).
verify-agent-guide-catalog-links: ok
14:33:01 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:33:01 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [types] Generated 35ms
14:33:01 [build] output: "static"
14:33:01 [build] mode: "static"
14:33:01 [build] directory: /agent/repos/jev.aitools.fyi/dist/
14:33:01 [build] Collecting build info...
14:33:01 [build] ✓ Completed in 83ms.
14:33:01 [build] Building static entrypoints...
14:33:01 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:33:01 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:33:01 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:33:01 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:33:01 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:33:01 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:33:01 [vite] ✓ built in 475ms
14:33:02 [WARN] [vite] [plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
14:33:02 [vite] ✓ built in 352ms
14:33:02 [build] Rearranging server assets...

 generating static routes 
14:33:02   ├─ /404.html (+31ms) 
14:33:02   ├─ /about.html (+12ms) 
14:33:02   ├─ /alternatives/cloudflare-clef.md (+3ms) 
14:33:02   ├─ /alternatives/kev.md (+2ms) 
14:33:02   ├─ /alternatives/openai-decisions-api.md (+1ms) 
14:33:02   ├─ /alternatives/perplexity-pplx-decider.md (+2ms) 
14:33:02   ├─ /alternatives/mapika-decider.md (+1ms) 
14:33:02   ├─ /alternatives/strands-decider.md (+2ms) 
14:33:02   ├─ /alternatives/vev.md (+2ms) 
14:33:02   ├─ /alternatives/fastino-gliner-decide.md (+1ms) 
14:33:02   ├─ /alternatives/semif.md (+2ms) 
14:33:02   ├─ /alternatives/clm-8b.md (+1ms) 
14:33:02   ├─ /alternatives/liquid-d1.md (+1ms) 
14:33:02   ├─ /alternatives/von.md (+1ms) 
14:33:02   ├─ /alternatives/cloudflare-clef.html (+6ms) 
14:33:02   ├─ /alternatives/kev.html (+5ms) 
14:33:02   ├─ /alternatives/openai-decisions-api.html (+5ms) 
14:33:02   ├─ /alternatives/perplexity-pplx-decider.html (+4ms) 
14:33:02   ├─ /alternatives/mapika-decider.html (+4ms) 
14:33:02   ├─ /alternatives/strands-decider.html (+4ms) 
14:33:02   ├─ /alternatives/vev.html (+5ms) 
14:33:02   ├─ /alternatives/fastino-gliner-decide.html (+15ms) 
14:33:02   ├─ /alternatives/semif.html (+6ms) 
14:33:02   ├─ /alternatives/clm-8b.html (+4ms) 
14:33:02   ├─ /alternatives/liquid-d1.html (+52ms) 
14:33:02   ├─ /alternatives/von.html (+4ms) 
14:33:02   ├─ /alternatives.html (+5ms) 
14:33:02   ├─ /alternatives.md (+2ms) 
14:33:02   ├─ /apps/browser-use-jev-ultrafast.html (+20ms) 
14:33:02   ├─ /apps/jarrodwatts-jev-trader.html (+8ms) 
14:33:02   ├─ /apps/awlevin-typesafe-computer-use.html (+7ms) 
14:33:02   ├─ /apps/usenotra-notra.html (+5ms) 
14:33:02   ├─ /apps/droidrun-mobile-jev.html (+6ms) 
14:33:02   ├─ /apps/jkudish-jev-browser.html (+5ms) 
14:33:02   ├─ /apps/kitze-unclutter.html (+5ms) 
14:33:02   ├─ /apps/chetaslua-jevmeter.html (+8ms) 
14:33:02   ├─ /apps/realzachi-typesafe-adblock.html (+5ms) 
14:33:02   ├─ /apps/wy-coliney-jev-browser-use.html (+5ms) 
14:33:02   ├─ /apps/moritzkremb-jev-voice-browser.html (+6ms) 
14:33:02   ├─ /apps/brainstormity-jev-moderation-bot.html (+5ms) 
14:33:02   ├─ /apps/ellipsis-dev-blink.html (+5ms) 
14:33:02   ├─ /apps/monteduro-killmyidea.html (+7ms) 
14:33:02   ├─ /apps/bunsdev-typesafe-ai-playground.html (+5ms) 
14:33:02   ├─ /apps/abovecolin-ha-jev.html (+5ms) 
14:33:02   ├─ /apps/arielweinberger-jev-autopilot.html (+4ms) 
14:33:02   ├─ /apps/ranjan2829-askjev.html (+4ms) 
14:33:02   ├─ /apps/sufianetaouil-every.html (+4ms) 
14:33:02   ├─ /apps/reachjalil-jev-tree.html (+5ms) 
14:33:02   ├─ /apps/hellogumbo-should-ai-kill-us-all.html (+5ms) 
14:33:02   ├─ /apps/nickthompson480-typesafe-ai-playground.html (+5ms) 
14:33:02   ├─ /apps/jackalope-dev-jackalope.html (+5ms) 
14:33:02   ├─ /apps/bunsdev-clarity-judge.html (+4ms) 
14:33:02   ├─ /apps/tanaypadar-gpt-vs-jev.html (+5ms) 
14:33:02   ├─ /apps/joevidev-ui-generator-instinct-jev.html (+4ms) 
14:33:02   ├─ /apps/little-planet-labs-jev-playground.html (+6ms) 
14:33:02   ├─ /apps/eriestra-browser-use-olympics.html (+4ms) 
14:33:02   ├─ /apps/krw82-jev-playwright-mcp.html (+4ms) 
14:33:02   ├─ /apps/coriew-jevtest.html (+4ms) 
14:33:02   ├─ /apps/marissafamularo-citation-verifier.html (+4ms) 
14:33:02   ├─ /apps/dmx-to.html (+4ms) 
14:33:02   ├─ /apps/jev-classifier.html (+4ms) 
14:33:02   ├─ /apps/charlyhno-eng-jev-document-classification.html (+5ms) 
14:33:02   ├─ /apps/0xarx-jevegis.html (+5ms) 
14:33:02   ├─ /apps/hemanth-pkg-gate.html (+5ms) 
14:33:02   ├─ /apps/cpaczek-s1s.html (+4ms) 
14:33:02   ├─ /apps/cbetz-extremely-specific-council.html (+4ms) 
14:33:02   ├─ /apps/asfarsadewa-human-compiler.html (+5ms) 
14:33:02   ├─ /apps/narulaskaran-jev-data-questions.html (+4ms) 
14:33:02   ├─ /apps/wustep-jev-playground.html (+5ms) 
14:33:02   ├─ /apps/ndolinschi-jevplay.html (+4ms) 
14:33:02   ├─ /apps/wesecureyou-jev-test.html (+4ms) 
14:33:02   ├─ /apps/jordiparracrespo-typesafe-ai-trading-showcase.html (+4ms) 
14:33:02   ├─ /apps/shifros-search-function-test.html (+4ms) 
14:33:02   ├─ /apps/yes-no.html (+4ms) 
14:33:02   ├─ /apps/classifier-dev.html (+5ms) 
14:33:02   ├─ /apps/ploy-ai.html (+7ms) 
14:33:02   ├─ /apps/dub-co.html (+5ms) 
14:33:02   ├─ /apps/avec-ai.html (+5ms) 
14:33:02   ├─ /apps/pixelml-com.html (+5ms) 
14:33:02   ├─ /apps/hypit-ai.html (+4ms) 
14:33:02   ├─ /apps/egghead-smart-procurement.html (+5ms) 
14:33:02   ├─ /apps/docjev.html (+6ms) 
14:33:02   ├─ /apps/socai-io-jev-social.html (+6ms) 
14:33:02   ├─ /apps/mfm-jev-search.html (+6ms) 
14:33:02   ├─ /apps/kylejeong-jev-as-judge.html (+5ms) 
14:33:02   ├─ /apps/carolmonroe-jevrls.html (+5ms) 
14:33:02   ├─ /apps/virlo-ai.html (+7ms) 
14:33:02   ├─ /apps/stealads-ai.html (+6ms) 
14:33:02   ├─ /apps/lahfir-agent-desktop.html (+5ms) 
14:33:02   ├─ /apps/nutlope-1kpapers.html (+6ms) 
14:33:02   ├─ /apps/kraayenjon-ai-slop-detector.html (+5ms) 
14:33:02   ├─ /apps/robj3d3-superx-post-scoring.html (+7ms) 
14:33:02   ├─ /apps/nailthy62-drape-virtual-try-on.html (+5ms) 
14:33:02   ├─ /apps/trungdq88-youtube-sponsor-detection.html (+5ms) 
14:33:03   ├─ /apps/iannuttall-internal-links.html (+5ms) 
14:33:03   ├─ /apps/sdras-jev-webmcp-extension.html (+5ms) 
14:33:03   ├─ /apps/jev-chat-jev-chat-jarvis.html (+6ms) 
14:33:03   ├─ /apps/sac-y-jev-cu.html (+5ms) 
14:33:03   ├─ /apps/anishfn-shapeshift.html (+5ms) 
14:33:03   ├─ /apps/milind-soni-tiptour-macos.html (+4ms) 
14:33:03   ├─ /apps/jev-chat-jev-chat-windows.html (+5ms) 
14:33:03   ├─ /apps/openbyteinc-quantdinger.html (+8ms) 
14:33:03   ├─ /apps/agricidaniel-jev-seo.html (+5ms) 
14:33:03   ├─ /apps/extend-hq-jevbox.html (+5ms) 
14:33:03   ├─ /apps/eliot5566-jev-paper-radar.html (+5ms) 
14:33:03   ├─ /apps/budecosystem-bud-decision-studio.html (+4ms) 
14:33:03   ├─ /apps/shhivv-arc-cua.html (+5ms) 
14:33:03   ├─ /apps/backmeupplz-jev-antispam-bot.html (+5ms) 
14:33:03   ├─ /apps/buer2233-jev-ui-test.html (+5ms) 
14:33:03   ├─ /benchmarks/theoleecj-semif.html (+5ms) 
14:33:03   ├─ /benchmarks/vinnylarouge-jevlike.html (+4ms) 
14:33:03   ├─ /benchmarks/iammrduncan-typesafe-ai-benchmark.html (+4ms) 
14:33:03   ├─ /benchmarks/r-ms-mini-jev.html (+5ms) 
14:33:03   ├─ /benchmarks/rorshopping-jev-on-a-laptop.html (+5ms) 
14:33:03   ├─ /benchmarks/olanotolu-jevbetter.html (+5ms) 
14:33:03   ├─ /benchmarks/goodrahstar-jev-column-race.html (+5ms) 
14:33:03   ├─ /benchmarks/kikoncuo-jevfire.html (+5ms) 
14:33:03   ├─ /benchmarks/mahlernim-jev-korean-benchmark.html (+4ms) 
14:33:03   ├─ /benchmarks/aabolfazl-typesafe-local.html (+4ms) 
14:33:03   ├─ /benchmarks/docxology-daf-jev.html (+5ms) 
14:33:03   ├─ /benchmarks/zhuyansen-jev-search-rerank-eval.html (+4ms) 
14:33:03   ├─ /benchmarks/zhengxuyu-litjev.html (+4ms) 
14:33:03   ├─ /benchmarks/heman10x-ngu-verdict-open-jev.html (+4ms) 
14:33:03   ├─ /benchmarks/foadsf-jev-for-engineers.html (+4ms) 
14:33:03   ├─ /benchmarks/monglong0214-jev-gate.html (+4ms) 
14:33:03   ├─ /benchmarks/antoniocoppe-jev-harness.html (+3ms) 
14:33:03   ├─ /benchmarks/akashpriyadarshii-jev-curate.html (+5ms) 
14:33:03   ├─ /benchmarks/anessbelbati-jev-rerank-bench.html (+4ms) 
14:33:03   ├─ /benchmarks/altryne-jevify.html (+4ms) 
14:33:03   ├─ /benchmarks/zsavage8-padflow-jev-evals.html (+4ms) 
14:33:03   ├─ /benchmarks/lab-dados-jev-anotacao-sentencas.html (+4ms) 
14:33:03   ├─ /benchmarks/dnakhoa-jev-deferred-crispification.html (+4ms) 
14:33:03   ├─ /benchmarks/sypherin-jev-trace-classifier.html (+4ms) 
14:33:03   ├─ /benchmarks/myokoym-misereru-slide-jev.html (+4ms) 
14:33:03   ├─ /benchmarks/zefir1990-openjev-experiments.html (+4ms) 
14:33:03   ├─ /benchmarks/parallel-constrained-decoding-qwen2-5-1b-rlcd.html (+4ms) 
14:33:03   ├─ /benchmarks/akash-kamat-system-one-gemma.html (+4ms) 
14:33:03   ├─ /benchmarks/aliceroselia-typesafe-chess-eval.html (+4ms) 
14:33:03   ├─ /benchmarks/tianyucodings-nanojev.html (+4ms) 
14:33:03   ├─ /benchmarks/bespokelabsai-nimble.html (+6ms) 
14:33:03   ├─ /benchmarks/apolinario-decision-index.html (+4ms) 
14:33:03   ├─ /benchmarks/fastino-gliner-decide.html (+4ms) 
14:33:03   ├─ /benchmarks/contrastive-lm-clm-8b.html (+4ms) 
14:33:03   ├─ /categories/official.html (+6ms) 
14:33:03   ├─ /categories/sdks.html (+11ms) 
14:33:03   ├─ /categories/integrations.html (+13ms) 
14:33:03   ├─ /categories/agent-tooling.html (+23ms) 
14:33:03   ├─ /categories/browser-computer-use.html (+8ms) 
14:33:03   ├─ /categories/applications.html (+14ms) 
14:33:03   ├─ /categories/games.html (+9ms) 
14:33:03   ├─ /categories/playgrounds.html (+10ms) 
14:33:03   ├─ /categories/benchmarks.html (+15ms) 
14:33:03   ├─ /categories/guides.html (+9ms) 
14:33:03   ├─ /contact.html (+3ms) 
14:33:03   ├─ /developers.html (+3ms) 
14:33:03   ├─ /explore.html (+36ms) 
14:33:03   ├─ /for-agents.html (+5ms) 
14:33:03   ├─ /games/fhshaik-typesafe-mario.html (+5ms) 
14:33:03   ├─ /games/romanslack-jev-drone.html (+4ms) 
14:33:03   ├─ /games/lukaske-jev-doom-agent.html (+4ms) 
14:33:03   ├─ /games/hollow-creek.html (+5ms) 
14:33:03   ├─ /games/jev-arcade.html (+4ms) 
14:33:03   ├─ /games/icohen007-jev-play-ping-pong.html (+4ms) 
14:33:03   ├─ /games/iammusham-jev-snake.html (+4ms) 
14:33:03   ├─ /games/0x963d-last-exit.html (+4ms) 
14:33:03   ├─ /games/vnmoorthy-siege.html (+3ms) 
14:33:03   ├─ /games/shubhankar-jev-fifa.html (+5ms) 
14:33:03   ├─ /games/enoyola-jev-grand-prix.html (+5ms) 
14:33:03   ├─ /games/muhammadaq1-before-the-fall-jev.html (+4ms) 
14:33:03   ├─ /games/muratcanberber-jev-the-fish-game.html (+4ms) 
14:33:03   ├─ /games/thumay9700-jev-plays.html (+4ms) 
14:33:03   ├─ /games/thisiskp-jevarcade.html (+5ms) 
14:33:03   ├─ /games/marcelpociot-wordshift.html (+4ms) 
14:33:03   ├─ /games/standardagents-jevpilot.html (+6ms) 
14:33:03   ├─ /games/jevdoom-jev-arcade.html (+4ms) 
14:33:03   ├─ /games/christianmat-jev-pokemon.html (+4ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/hermes.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/openclaw.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/codex-and-opencode.md (+0ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/langchain-langgraph.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/cline-and-roo.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/github-copilot-agent.md (+1ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/devin-desktop.md (+0ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/browser-computer-use.md (+0ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/hermes.html (+4ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/openclaw.html (+3ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.html (+3ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/codex-and-opencode.html (+3ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.html (+4ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/langchain-langgraph.html (+3ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/cline-and-roo.html (+3ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/github-copilot-agent.html (+4ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/devin-desktop.html (+4ms) 
14:33:03   ├─ /guides/jev-with-ai-agents/browser-computer-use.html (+3ms) 
14:33:03   ├─ /guides/jev-with-ai-agents.html (+4ms) 
14:33:03   ├─ /guides/jev-with-ai-agents.md (+1ms) 
14:33:03   ├─ /guides/abdelstark-awesome-typesafe.html (+4ms) 
14:33:03   ├─ /guides/yibie-awesome-jev.html (+4ms) 
14:33:03   ├─ /guides/logicrw-awesome-jev-projects.html (+4ms) 
14:33:03   ├─ /guides/omnijev-awesome-jev.html (+4ms) 
14:33:03   ├─ /guides/ainews-jev-a-system-one-model-that-only-decides.html (+4ms) 
14:33:03   ├─ /guides/jev-plays-minecraft-r-accelerate.html (+4ms) 
14:33:03   ├─ /guides/jev-system-one-models-explained-datacamp.html (+4ms) 
14:33:03   ├─ /guides/one-judge-call-vs-twelve-dimension-scores.html (+4ms) 
14:33:03   ├─ /guides/typed-decisions-not-chat.html (+4ms) 
14:33:03   ├─ /guides/networkchuck-jev-guide.html (+5ms) 
14:33:03   ├─ /guides/socialwithaayan-ten-jev-repos.html (+4ms) 
14:33:03   ├─ /guides/datawhalechina-jev-cookbook.html (+4ms) 
14:33:03   ├─ /guides/openai-decisions-api.html (+4ms) 
14:33:03   ├─ /guides.html (+4ms) 
14:33:03   ├─ /learn/laya-vs-jev/compare.md (+1ms) 
14:33:03   ├─ /learn/laya-vs-jev/what-is-laya.md (+1ms) 
14:33:03   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.md (+1ms) 
14:33:03   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.md (+1ms) 
14:33:03   ├─ /learn/laya-vs-jev/migration-and-coexistence.md (+1ms) 
14:33:03   ├─ /learn/laya-vs-jev/privacy-and-agents.md (+1ms) 
14:33:03   ├─ /learn/laya-vs-jev/compare.html (+4ms) 
14:33:03   ├─ /learn/laya-vs-jev/what-is-laya.html (+3ms) 
14:33:03   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.html (+3ms) 
14:33:03   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.html (+2ms) 
14:33:03   ├─ /learn/laya-vs-jev/migration-and-coexistence.html (+2ms) 
14:33:03   ├─ /learn/laya-vs-jev/privacy-and-agents.html (+2ms) 
14:33:03   ├─ /learn/laya-vs-jev.html (+4ms) 
14:33:03   ├─ /learn/laya-vs-jev.md (+1ms) 
14:33:03   ├─ /learn/jev-typesafe.md (+1ms) 
14:33:03   ├─ /learn/system-one.md (+1ms) 
14:33:03   ├─ /learn/jev-vs-llm-classification.md (+0ms) 
14:33:03   ├─ /learn/vercel-ai-gateway.md (+0ms) 
14:33:03   ├─ /learn/where-to-run-jev.md (+0ms) 
14:33:03   ├─ /learn/use-cases.md (+0ms) 
14:33:03   ├─ /learn/jev-typesafe.html (+3ms) 
14:33:03   ├─ /learn/system-one.html (+3ms) 
14:33:03   ├─ /learn/jev-vs-llm-classification.html (+3ms) 
14:33:03   ├─ /learn/vercel-ai-gateway.html (+3ms) 
14:33:03   ├─ /learn/where-to-run-jev.html (+3ms) 
14:33:03   ├─ /learn/use-cases.html (+3ms) 
14:33:03   ├─ /learn.html (+4ms) 
14:33:03   ├─ /llms-full.txt (+6ms) 
14:33:03   ├─ /llms.txt (+3ms) 
14:33:03   ├─ /privacy/archive.html (+3ms) 
14:33:03   ├─ /privacy.html (+4ms) 
14:33:03   ├─ /robots.txt (+3ms) 
14:33:03   ├─ /sdks/typesafe-ai-skills.html (+4ms) 
14:33:03   ├─ /sdks/typesafe-ai-typesafe-sdk-js.html (+3ms) 
14:33:03   ├─ /sdks/typesafe-ai-system-one-adapter-python.html (+3ms) 
14:33:03   ├─ /sdks/typesafe-ai-typesafe-sdk-python.html (+4ms) 
14:33:03   ├─ /sdks/jomatsu-zod-jev.html (+4ms) 
14:33:03   ├─ /sdks/saibimajdi-typesafeai-dotnet-sdk.html (+3ms) 
14:33:03   ├─ /sdks/inanna-malick-jev-dsl.html (+4ms) 
14:33:03   ├─ /sdks/mateonunez-jod.html (+5ms) 
14:33:03   ├─ /sdks/nshkrdotcom-typesafe-sdk.html (+4ms) 
14:33:03   ├─ /sdks/gaurav-gosain-jev-go.html (+4ms) 
14:33:03   ├─ /sdks/abovecolin-jevclient.html (+4ms) 
14:33:03   ├─ /sdks/documentation.html (+3ms) 
14:33:03   ├─ /sdks/quick-start.html (+4ms) 
14:33:03   ├─ /sdks/playground.html (+4ms) 
14:33:03   ├─ /sdks/http-api-reference.html (+5ms) 
14:33:03   ├─ /sdks/primitives.html (+4ms) 
14:33:03   ├─ /sdks/patterns.html (+4ms) 
14:33:03   ├─ /sdks/cookbooks.html (+4ms) 
14:33:03   ├─ /sdks/smart-home-demo.html (+4ms) 
14:33:03   ├─ /sdks/workflow-evals.html (+4ms) 
14:33:03   ├─ /sdks/introducing-system-one-models-and-jev.html (+4ms) 
14:33:03   ├─ /sdks/valksor-typesafe-sdk-go.html (+4ms) 
14:33:03   ├─ /sdks/valksor-typesafe-sdk-php.html (+5ms) 
14:33:03   ├─ /sdks/classifier-dev-cli.html (+4ms) 
14:33:03   ├─ /sdks/pypi-jev-cli.html (+4ms) 
14:33:03   ├─ /sdks/langchain-ai-langchain-typesafe.html (+4ms) 
14:33:03   ├─ /sdks/peterfriese-system-one-foundation-models.html (+4ms) 
14:33:03   ├─ /showcase.html (+25ms) 
14:33:03   ├─ /sitemap-guides.xml (+2ms) 
14:33:03   ├─ /sitemap-learn.xml (+2ms) 
14:33:03   ├─ /sitemap-listings.xml (+4ms) 
14:33:03   ├─ /sitemap-static.xml (+2ms) 
14:33:03   ├─ /sitemap.xml (+3ms) 
14:33:03   ├─ /submit.html (+5ms) 
14:33:03   ├─ /terms.html (+3ms) 
14:33:03   ├─ /tools/vercel-eve.html (+4ms) 
14:33:03   ├─ /tools/tamaratran-fast-jev-compaction.html (+4ms) 
14:33:03   ├─ /tools/vercel-labs-ai-cli.html (+5ms) 
14:33:03   ├─ /tools/thruwire-foreman.html (+5ms) 
14:33:03   ├─ /tools/devagrawal09-jev-review.html (+4ms) 
14:33:03   ├─ /tools/realzachi-pg-jev.html (+5ms) 
14:33:03   ├─ /tools/y0usaf-pi-jev.html (+4ms) 
14:33:03   ├─ /tools/gargpratyush-jev-router.html (+4ms) 
14:33:03   ├─ /tools/niazmorshed2007-jev-review.html (+5ms) 
14:33:03   ├─ /tools/mapika-decider.html (+4ms) 
14:33:03   ├─ /tools/dbreunig-building-with-jev-skill.html (+4ms) 
14:33:03   ├─ /tools/jkudish-jev-mcp.html (+4ms) 
14:33:03   ├─ /tools/itsmostafa-typesafe-mcp.html (+3ms) 
14:33:03   ├─ /tools/devmortimer-pi-warden.html (+3ms) 
14:33:03   ├─ /tools/superagents-lab-jev-search.html (+5ms) 
14:33:03   ├─ /tools/dicklesworthstone-skillranker.html (+4ms) 
14:33:03   ├─ /tools/mrnugget-jev-shell-history.html (+4ms) 
14:33:03   ├─ /tools/0xnatoshi-jev-codex-router.html (+3ms) 
14:33:03   ├─ /tools/wundercorp-loki.html (+3ms) 
14:33:03   ├─ /tools/jexp-neo4jev.html (+4ms) 
14:33:03   ├─ /tools/compozy-yoshi.html (+4ms) 
14:33:03   ├─ /tools/jomatsu-pi-jev-auto-mode.html (+5ms) 
14:33:03   ├─ /tools/blakestone-x-jev-mcp.html (+4ms) 
14:33:03   ├─ /tools/danrwilloughby-snifftest.html (+4ms) 
14:33:03   ├─ /tools/decrux9812-typesafe-skill-router.html (+3ms) 
14:33:03   ├─ /tools/arunav25-jev-mcp.html (+3ms) 
14:33:03   ├─ /tools/brainwires-jevwire.html (+4ms) 
14:33:03   ├─ /tools/frostney-clean-code-review.html (+3ms) 
14:33:03   ├─ /tools/keeltrace-hermes-jev.html (+4ms) 
14:33:03   ├─ /tools/anpicasso-hermes-jev-approvals.html (+4ms) 
14:33:03   ├─ /tools/tylerjharden-ailerix.html (+3ms) 
14:33:03   ├─ /tools/leepokai-jev-guard.html (+4ms) 
14:33:03   ├─ /tools/rashedint32-jev-mcp.html (+3ms) 
14:33:03   ├─ /tools/caiovicentino-jev-shield.html (+3ms) 
14:33:03   ├─ /tools/shivampansuriya-jev-skill-gate.html (+3ms) 
14:33:03   ├─ /tools/molis-ai-jev-workbench.html (+5ms) 
14:33:03   ├─ /tools/iamvatsalpatel-tiershift.html (+4ms) 
14:33:03   ├─ /tools/belazy167-typesafe-mod.html (+4ms) 
14:33:03   ├─ /tools/bestagentkits-jev-skillful.html (+4ms) 
14:33:03   ├─ /tools/jev-on-vercel-ai-gateway.html (+4ms) 
14:33:03   ├─ /tools/dommonte-n8n-nodes-typesafe-ai.html (+4ms) 
14:33:03   ├─ /tools/vercel-ai-sdk-provider.html (+4ms) 
14:33:03   ├─ /tools/legacybridge-tech-pi-typesafe-jev.html (+4ms) 
14:33:03   ├─ /tools/aniruddh-krovvidi-switchboard.html (+4ms) 
14:33:03   ├─ /tools/classifier-dev-mcp.html (+4ms) 
14:33:03   ├─ /tools/openrouter-typesafe-jev-1-13.html (+4ms) 
14:33:03   ├─ /tools/cloudflare-workers-ai-typesafe-jev.html (+4ms) 
14:33:03   ├─ /tools/kushwho-jev-codes.html (+5ms) 
14:33:03   ├─ /tools/tanstack-ai-decide.html (+5ms) 
14:33:03   ├─ /tools/iurysza-logview-jev.html (+6ms) 
14:33:03   ├─ /tools/box-jev-incident-triage.html (+4ms) 
14:33:03   ├─ /tools/workday-sana-jev-generative-ui.html (+4ms) 
14:33:04   ├─ /tools/uipath-typesafe-jev-connector.html (+4ms) 
14:33:04   ├─ /tools/motherduck-prompt-jev.html (+4ms) 
14:33:04   ├─ /tools/openbmb-minicpm-ocr-jev.html (+4ms) 
14:33:04   ├─ /tools/mbzuai-oryx-eo-jev.html (+5ms) 
14:33:04   ├─ /tools/kerpopule-hermes-jev-skills.html (+4ms) 
14:33:04   ├─ /tools/kitfunso-hippo-memory.html (+4ms) 
14:33:04   ├─ /tools/juspay-neurolink.html (+4ms) 
14:33:04   ├─ /tools/uehaj-jev-semgrep.html (+3ms) 
14:33:04   ├─ /tools/tamaratran-jev-pruner.html (+3ms) 
14:33:04   ├─ /tools/hyperspaceai-jevcache.html (+5ms) 
14:33:04   ├─ /tools/featherless-simple-jev.html (+4ms) 
14:33:04   ├─ /tools/miuuyy-astra-ares.html (+4ms) 
14:33:04   ├─ /tools/coldteadotai-abide.html (+4ms) 
14:33:04   ├─ /tools/qkal-canny.html (+4ms) 
14:33:04   ├─ /tools/nidhi-singh02-agent-router.html (+4ms) 
14:33:04   ├─ /tools/togethercomputer-tev1.html (+5ms) 
14:33:04   ├─ /tools/jaredpalmer-kev.html (+4ms) 
14:33:04   ├─ /tools/wfzyx-von.html (+4ms) 
14:33:04   ├─ /tools/samuelfaj-distill.html (+4ms) 
14:33:04   ├─ /tools/sutro-sh-jev-align.html (+4ms) 
14:33:04   ├─ /tools/nokia-applied-research-anyjev.html (+4ms) 
14:33:04   ├─ /tools/githubnext-localjev.html (+5ms) 
14:33:04   ├─ /tools/typellm-typellm.html (+4ms) 
14:33:04   ├─ /tools/rizzo-ai-academy-rizzo-flow.html (+4ms) 
14:33:04   ├─ /tools/tianyucodings-jevharness.html (+4ms) 
14:33:04   ├─ /tools/ollaya-dev-ollaya.html (+4ms) 
14:33:04   ├─ /tools/liuziyu77-valen.html (+5ms) 
14:33:04   ├─ /tools/receptron-laya.html (+4ms) 
14:33:04   ├─ /tools/dzhng-jevgrep.html (+3ms) 
14:33:04   ├─ /tools/logan-markewich-jeff.html (+4ms) 
14:33:04   ├─ /tools/mizorewww-laya-coreml.html (+4ms) 
14:33:04   ├─ /tools/alex314618-create-jevrev.html (+4ms) 
14:33:04   ├─ /tools/avinash-jetwani-jevmem.html (+4ms) 
14:33:04   ├─ /tools/hitsz-tmg-jevembed.html (+4ms) 
14:33:04   ├─ /tools/deepopen-com-deepopen.html (+4ms) 
14:33:04   ├─ /tools/qybaihe-mu.html (+4ms) 
14:33:04   ├─ /tools/mode-io-vllm-jev.html (+4ms) 
14:33:04   ├─ /tools/disler-ten-levels-of-jev.html (+4ms) 
14:33:04   ├─ /tools/charlesfeng0314-jev-sees.html (+5ms) 
14:33:04   ├─ /tools/uditakhourii-quicksilver.html (+4ms) 
14:33:04   ├─ /tools/aurorainfra-grev.html (+4ms) 
14:33:04   ├─ /tools/codegirl-007-jevlint.html (+4ms) 
14:33:04   ├─ /tools/junma11-medjev.html (+4ms) 
14:33:04   ├─ /tools/vectifyai-jev-doc-search.html (+3ms) 
14:33:04   ├─ /tools/statelyai-jevspresso.html (+5ms) 
14:33:04   ├─ /tools/tomerglick57-jevstiller.html (+4ms) 
14:33:04   ├─ /tools/raphaelmansuy-edgextract.html (+4ms) 
14:33:04   ├─ /tools/sheltercosmo-jev4pg.html (+4ms) 
14:33:04   ├─ /tools/posthog-jeeves.html (+3ms) 
14:33:04   ├─ /tools/vinilana-jev-gateway.html (+4ms) 
14:33:04   ├─ /tools/tsale-jevline.html (+4ms) 
14:33:04   ├─ /tools/0814wdwd-solo-jev.html (+4ms) 
14:33:04   ├─ /tools/luobosibing2-dsh-jev-plugin.html (+4ms) 
14:33:04   ├─ /tools/yinsongxu-llm2jev.html (+4ms) 
14:33:04   ├─ /tools/dorkitude-webctl.html (+4ms) 
14:33:04   ├─ /tools/mordavid-nucleisniper.html (+5ms) 
14:33:04   ├─ /tools/rayenmlayeh-jevcrawl.html (+4ms) 
14:33:04   ├─ /tools/liqiiiii-jeva.html (+4ms) 
14:33:04   ├─ /tools/feder-cr-jevos.html (+4ms) 
14:33:04   ├─ /tools/mcg-nju-videojev.html (+4ms) 
14:33:04   ├─ /tools/openlayer-ai-jevals.html (+4ms) 
14:33:04   ├─ /tools/deepaleph-jevreel.html (+5ms) 
14:33:04   ├─ /tools/disler-pi-durable-news-agent.html (+4ms) 
14:33:04   ├─ /tools/nandhakishorm-laya.html (+3ms) 
14:33:04   ├─ /tools/cloudflare-clef.html (+3ms) 
14:33:04   ├─ /tools/perplexity-pplx-decider.html (+3ms) 
14:33:04   ├─ /tools/liquidai-d1-3b.html (+3ms) 
14:33:04   ├─ /tools/strands-labs-strands-decider.html (+3ms) 
14:33:04   ├─ /tools/undrgrnd-labs-hunch.html (+4ms) 
14:33:04   ├─ /tools/a2sys-ai-jevfetch.html (+4ms) 
14:33:04   ├─ /tools/mattt-anydecisionmodel.html (+4ms) 
14:33:04   ├─ /tools/omnijev-flide.html (+4ms) 
14:33:04   ├─ /tools/agent-labs-dev-fastbrowse.html (+4ms) 
14:33:04   ├─ /tools/qbeka-jev-job-search.html (+4ms) 
14:33:04   ├─ /tools/native-bond-lab-jev-interaction.html (+5ms) 
14:33:04   ├─ /tools/storytold-autocraft.html (+4ms) 
14:33:04   ├─ /tools/autonomous-ai-lamp-os.html (+4ms) 
14:33:04   ├─ /tools/carol-lyh-jeveration.html (+4ms) 
14:33:04   ├─ /your-privacy-choices.html (+3ms) 
14:33:04   ├─ /index.html (+9ms) 
14:33:04 ✓ Completed in 2.11s.

14:33:04 [build] ✓ Completed in 2.97s.
14:33:04 [build] 366 page(s) built in 3.08s
14:33:04 [build] Complete!
Wrote dist/_redirects (641 redirect rules incl. /items hub)
Wrote dist/_routes.json (invoke Pages Functions + middleware on all paths)
Verified dist/index.html present (static homepage at /)
Wrote dist/_headers (37 markdown rules + 2 MFM shell noindex rules)
Meta uniqueness OK across 366 indexable HTML files (367 total HTML). Descriptions are <= 160 characters and do not end in ",." ":." or ";.".
Explore SEO policy checks OK.
verify-not-found-seo: ok
SEO artifacts OK: sitemap index + 4 child maps, 366 URLs (304 detail), catalog 636, redirects 641.
verify-markdown-negotiation: ok
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
```
