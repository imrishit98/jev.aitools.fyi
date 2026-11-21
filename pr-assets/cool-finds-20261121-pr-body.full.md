- Open source maintainers get a readable page on AutoCraft: how it mirrors GitHub into a local database, uses quick Jev decisions on duplicates, labels, and priority, and still requires a person to approve every write back to GitHub.
- That AutoCraft page also explains sandboxed fixes, merge batches, and what happens when Jev is turned off (Haiku takes the same triage steps with more Claude usage).
- Robot builders get a page on Physical AI Operating System (lampOS): local rules first on lamp voice and chat, then an optional Jev step for plain commands like lights and volume before the main agent handles harder requests.
- The lampOS page documents the default three second decision budget, example phrases from the project docs, and links to full duplex voice listings only where the intent differs (conversation control versus device routing).
- Explore and search now list two more tool detail pages, and the public directory counts match so partners and site maps stay aligned.

SEO/LLM impact: New answer-first profiles with dated GitHub facts, maintainer versus vendor attribution, FAQs, and cross-links should improve retrieval for GitHub backlog triage and physical robot voice intent queries without overlapping existing job search or duplex voice slugs.

**Technical details**

- Published profiles `storytold-autocraft` and `autonomous-ai-lamp-os` in `src/data/product-profiles.ts` (`firstSeen: 2026-11-21`).
- Catalog supplement rows in `src/data/catalog-supplement.json`; editorial blurbs in `src/data/editorial-blurbs.ts`.
- GitHub star rows in `src/data/alternatives-metrics.json` (snapshot date unchanged).
- `src/data/lastmod-manifest.json` bumps for `/tools/storytold-autocraft` and `/tools/autonomous-ai-lamp-os`, plus category and explore hashes.
- `public/.well-known/jev-directory.json` catalog 633, detail pages 301.
- Cross-links: AutoCraft to `eliot5566-jev-paper-radar`, `ellipsis-dev-blink`, `kylejeong-jev-as-judge`; lampOS to `native-bond-lab-jev-interaction`, `moritzkremb-jev-voice-browser`, `kerpopule-hermes-jev-skills`.

**Meta character counts**

| slug | metaTitle (<=60) | metaDescription (<=160) |
|------|------------------|-------------------------|
| storytold-autocraft | 41 | 138 |
| autonomous-ai-lamp-os | 45 | 136 |

**Build proof (`pnpm lastmod:update`, `pnpm lint`, `pnpm build`, full log)**

```
> pnpm lastmod:update && pnpm lint && pnpm build

> jev-directory@0.1.0 lastmod:update
lastmod manifest wrote 363 URLs (kept 358, bumped 5, added 0, pruned 0)

> jev-directory@0.1.0 lint
eslint (exit 0)

> jev-directory@0.1.0 prebuild /agent/repos/jev.aitools.fyi
> pnpm run sync:public-fonts && pnpm run generate:og && pnpm run generate:search-index && pnpm run generate:openapi


> jev-directory@0.1.0 sync:public-fonts /agent/repos/jev.aitools.fyi
> node scripts/sync-public-fonts.mjs


> jev-directory@0.1.0 generate:og /agent/repos/jev.aitools.fyi
> tsx scripts/generate-og-images.ts

Generating Open Graph images…
  listings 50/301
  listings 100/301
  listings 150/301
  listings 200/301
  listings 250/301
  listings 300/301
  listings 301/301
Done. 321 images in public/og/

> jev-directory@0.1.0 generate:search-index /agent/repos/jev.aitools.fyi
> tsx scripts/generate-search-index.ts

Wrote 633 search index entries to public/search-index.json

> jev-directory@0.1.0 generate:openapi /agent/repos/jev.aitools.fyi
> node scripts/generate-openapi.mjs

Wrote /agent/repos/jev.aitools.fyi/public/openapi.json

> jev-directory@0.1.0 build /agent/repos/jev.aitools.fyi
> node scripts/lastmod-manifest.mjs --check && node scripts/check-meta-length.mjs && node scripts/verify-demo-asset-sizes.mjs --public-only && node scripts/verify-showcase-video-referrer-policy.mjs && node scripts/verify-agent-guide-catalog-links.mjs && astro build && node scripts/write-redirects.mjs && node scripts/write-md-headers.mjs && node scripts/check-meta-uniqueness.mjs && node scripts/verify-explore-seo.mjs && node scripts/verify-not-found-seo.mjs && node scripts/verify-seo-artifacts.mjs && node scripts/verify-markdown-negotiation.mjs && node scripts/verify-demo-asset-sizes.mjs --dist-only

lastmod manifest OK: 363 URLs
Meta length OK (476 source fields, titles <= 60, descriptions <= 160).
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
Showcase video referrer policy OK (ShowcaseDemoVideo + no raw <video> in card/lightbox).
verify-agent-guide-catalog-links: ok
▶ Astro collects anonymous usage data.
  This information helps us improve Astro.
  Run "astro telemetry disable" to opt-out.
  https://astro.build/telemetry

17:25:04 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
17:25:04 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [types] Generated 164ms
17:25:04 [build] output: "static"
17:25:04 [build] mode: "static"
17:25:04 [build] directory: /agent/repos/jev.aitools.fyi/dist/
17:25:04 [build] Collecting build info...
17:25:04 [build] ✓ Completed in 215ms.
17:25:04 [build] Building static entrypoints...
17:25:04 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
17:25:04 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
17:25:04 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
17:25:04 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
17:25:04 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
17:25:04 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
17:25:04 [vite] ✓ built in 505ms
17:25:05 [WARN] [vite] [plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
17:25:05 [vite] ✓ built in 390ms
17:25:05 [build] Rearranging server assets...

 generating static routes 
17:25:05   ├─ /404.html (+32ms) 
17:25:05   ├─ /about.html (+12ms) 
17:25:05   ├─ /alternatives/cloudflare-clef.md (+3ms) 
17:25:05   ├─ /alternatives/kev.md (+2ms) 
17:25:05   ├─ /alternatives/openai-decisions-api.md (+1ms) 
17:25:05   ├─ /alternatives/perplexity-pplx-decider.md (+2ms) 
17:25:05   ├─ /alternatives/mapika-decider.md (+1ms) 
17:25:05   ├─ /alternatives/strands-decider.md (+2ms) 
17:25:05   ├─ /alternatives/vev.md (+2ms) 
17:25:05   ├─ /alternatives/fastino-gliner-decide.md (+4ms) 
17:25:05   ├─ /alternatives/semif.md (+1ms) 
17:25:05   ├─ /alternatives/clm-8b.md (+1ms) 
17:25:05   ├─ /alternatives/liquid-d1.md (+1ms) 
17:25:05   ├─ /alternatives/von.md (+1ms) 
17:25:05   ├─ /alternatives/cloudflare-clef.html (+7ms) 
17:25:05   ├─ /alternatives/kev.html (+5ms) 
17:25:05   ├─ /alternatives/openai-decisions-api.html (+5ms) 
17:25:05   ├─ /alternatives/perplexity-pplx-decider.html (+4ms) 
17:25:05   ├─ /alternatives/mapika-decider.html (+4ms) 
17:25:05   ├─ /alternatives/strands-decider.html (+5ms) 
17:25:05   ├─ /alternatives/vev.html (+6ms) 
17:25:05   ├─ /alternatives/fastino-gliner-decide.html (+19ms) 
17:25:05   ├─ /alternatives/semif.html (+52ms) 
17:25:05   ├─ /alternatives/clm-8b.html (+13ms) 
17:25:05   ├─ /alternatives/liquid-d1.html (+4ms) 
17:25:05   ├─ /alternatives/von.html (+4ms) 
17:25:05   ├─ /alternatives.html (+5ms) 
17:25:05   ├─ /alternatives.md (+2ms) 
17:25:05   ├─ /apps/browser-use-jev-ultrafast.html (+22ms) 
17:25:05   ├─ /apps/jarrodwatts-jev-trader.html (+7ms) 
17:25:05   ├─ /apps/awlevin-typesafe-computer-use.html (+7ms) 
17:25:05   ├─ /apps/usenotra-notra.html (+7ms) 
17:25:05   ├─ /apps/droidrun-mobile-jev.html (+7ms) 
17:25:05   ├─ /apps/jkudish-jev-browser.html (+7ms) 
17:25:05   ├─ /apps/kitze-unclutter.html (+6ms) 
17:25:05   ├─ /apps/chetaslua-jevmeter.html (+6ms) 
17:25:05   ├─ /apps/realzachi-typesafe-adblock.html (+5ms) 
17:25:05   ├─ /apps/wy-coliney-jev-browser-use.html (+6ms) 
17:25:05   ├─ /apps/moritzkremb-jev-voice-browser.html (+7ms) 
17:25:05   ├─ /apps/brainstormity-jev-moderation-bot.html (+6ms) 
17:25:05   ├─ /apps/ellipsis-dev-blink.html (+6ms) 
17:25:05   ├─ /apps/monteduro-killmyidea.html (+6ms) 
17:25:05   ├─ /apps/bunsdev-typesafe-ai-playground.html (+6ms) 
17:25:05   ├─ /apps/abovecolin-ha-jev.html (+6ms) 
17:25:05   ├─ /apps/arielweinberger-jev-autopilot.html (+4ms) 
17:25:05   ├─ /apps/ranjan2829-askjev.html (+6ms) 
17:25:05   ├─ /apps/sufianetaouil-every.html (+4ms) 
17:25:05   ├─ /apps/reachjalil-jev-tree.html (+4ms) 
17:25:05   ├─ /apps/hellogumbo-should-ai-kill-us-all.html (+5ms) 
17:25:05   ├─ /apps/nickthompson480-typesafe-ai-playground.html (+5ms) 
17:25:05   ├─ /apps/jackalope-dev-jackalope.html (+5ms) 
17:25:05   ├─ /apps/bunsdev-clarity-judge.html (+4ms) 
17:25:05   ├─ /apps/tanaypadar-gpt-vs-jev.html (+6ms) 
17:25:05   ├─ /apps/joevidev-ui-generator-instinct-jev.html (+4ms) 
17:25:05   ├─ /apps/little-planet-labs-jev-playground.html (+4ms) 
17:25:05   ├─ /apps/eriestra-browser-use-olympics.html (+5ms) 
17:25:05   ├─ /apps/krw82-jev-playwright-mcp.html (+4ms) 
17:25:05   ├─ /apps/coriew-jevtest.html (+4ms) 
17:25:05   ├─ /apps/marissafamularo-citation-verifier.html (+5ms) 
17:25:05   ├─ /apps/dmx-to.html (+6ms) 
17:25:05   ├─ /apps/jev-classifier.html (+5ms) 
17:25:05   ├─ /apps/charlyhno-eng-jev-document-classification.html (+6ms) 
17:25:05   ├─ /apps/0xarx-jevegis.html (+5ms) 
17:25:05   ├─ /apps/hemanth-pkg-gate.html (+6ms) 
17:25:05   ├─ /apps/cpaczek-s1s.html (+5ms) 
17:25:05   ├─ /apps/cbetz-extremely-specific-council.html (+5ms) 
17:25:05   ├─ /apps/asfarsadewa-human-compiler.html (+10ms) 
17:25:05   ├─ /apps/narulaskaran-jev-data-questions.html (+5ms) 
17:25:05   ├─ /apps/wustep-jev-playground.html (+5ms) 
17:25:05   ├─ /apps/ndolinschi-jevplay.html (+4ms) 
17:25:05   ├─ /apps/wesecureyou-jev-test.html (+4ms) 
17:25:05   ├─ /apps/jordiparracrespo-typesafe-ai-trading-showcase.html (+5ms) 
17:25:05   ├─ /apps/shifros-search-function-test.html (+6ms) 
17:25:05   ├─ /apps/yes-no.html (+6ms) 
17:25:05   ├─ /apps/classifier-dev.html (+5ms) 
17:25:05   ├─ /apps/ploy-ai.html (+5ms) 
17:25:05   ├─ /apps/dub-co.html (+5ms) 
17:25:05   ├─ /apps/avec-ai.html (+6ms) 
17:25:05   ├─ /apps/pixelml-com.html (+5ms) 
17:25:05   ├─ /apps/hypit-ai.html (+6ms) 
17:25:05   ├─ /apps/egghead-smart-procurement.html (+5ms) 
17:25:05   ├─ /apps/docjev.html (+6ms) 
17:25:05   ├─ /apps/socai-io-jev-social.html (+6ms) 
17:25:05   ├─ /apps/mfm-jev-search.html (+5ms) 
17:25:05   ├─ /apps/kylejeong-jev-as-judge.html (+6ms) 
17:25:05   ├─ /apps/carolmonroe-jevrls.html (+5ms) 
17:25:05   ├─ /apps/virlo-ai.html (+6ms) 
17:25:05   ├─ /apps/stealads-ai.html (+5ms) 
17:25:05   ├─ /apps/lahfir-agent-desktop.html (+5ms) 
17:25:05   ├─ /apps/nutlope-1kpapers.html (+6ms) 
17:25:05   ├─ /apps/kraayenjon-ai-slop-detector.html (+6ms) 
17:25:05   ├─ /apps/robj3d3-superx-post-scoring.html (+6ms) 
17:25:05   ├─ /apps/nailthy62-drape-virtual-try-on.html (+5ms) 
17:25:06   ├─ /apps/trungdq88-youtube-sponsor-detection.html (+7ms) 
17:25:06   ├─ /apps/iannuttall-internal-links.html (+7ms) 
17:25:06   ├─ /apps/sdras-jev-webmcp-extension.html (+5ms) 
17:25:06   ├─ /apps/jev-chat-jev-chat-jarvis.html (+6ms) 
17:25:06   ├─ /apps/sac-y-jev-cu.html (+5ms) 
17:25:06   ├─ /apps/anishfn-shapeshift.html (+5ms) 
17:25:06   ├─ /apps/milind-soni-tiptour-macos.html (+9ms) 
17:25:06   ├─ /apps/jev-chat-jev-chat-windows.html (+5ms) 
17:25:06   ├─ /apps/openbyteinc-quantdinger.html (+7ms) 
17:25:06   ├─ /apps/agricidaniel-jev-seo.html (+6ms) 
17:25:06   ├─ /apps/extend-hq-jevbox.html (+5ms) 
17:25:06   ├─ /apps/eliot5566-jev-paper-radar.html (+6ms) 
17:25:06   ├─ /apps/budecosystem-bud-decision-studio.html (+6ms) 
17:25:06   ├─ /apps/shhivv-arc-cua.html (+4ms) 
17:25:06   ├─ /benchmarks/theoleecj-semif.html (+6ms) 
17:25:06   ├─ /benchmarks/vinnylarouge-jevlike.html (+4ms) 
17:25:06   ├─ /benchmarks/iammrduncan-typesafe-ai-benchmark.html (+4ms) 
17:25:06   ├─ /benchmarks/r-ms-mini-jev.html (+6ms) 
17:25:06   ├─ /benchmarks/rorshopping-jev-on-a-laptop.html (+5ms) 
17:25:06   ├─ /benchmarks/olanotolu-jevbetter.html (+4ms) 
17:25:06   ├─ /benchmarks/goodrahstar-jev-column-race.html (+4ms) 
17:25:06   ├─ /benchmarks/kikoncuo-jevfire.html (+4ms) 
17:25:06   ├─ /benchmarks/mahlernim-jev-korean-benchmark.html (+4ms) 
17:25:06   ├─ /benchmarks/aabolfazl-typesafe-local.html (+4ms) 
17:25:06   ├─ /benchmarks/docxology-daf-jev.html (+6ms) 
17:25:06   ├─ /benchmarks/zhuyansen-jev-search-rerank-eval.html (+4ms) 
17:25:06   ├─ /benchmarks/zhengxuyu-litjev.html (+7ms) 
17:25:06   ├─ /benchmarks/heman10x-ngu-verdict-open-jev.html (+4ms) 
17:25:06   ├─ /benchmarks/foadsf-jev-for-engineers.html (+4ms) 
17:25:06   ├─ /benchmarks/monglong0214-jev-gate.html (+4ms) 
17:25:06   ├─ /benchmarks/antoniocoppe-jev-harness.html (+4ms) 
17:25:06   ├─ /benchmarks/akashpriyadarshii-jev-curate.html (+7ms) 
17:25:06   ├─ /benchmarks/anessbelbati-jev-rerank-bench.html (+5ms) 
17:25:06   ├─ /benchmarks/altryne-jevify.html (+4ms) 
17:25:06   ├─ /benchmarks/zsavage8-padflow-jev-evals.html (+4ms) 
17:25:06   ├─ /benchmarks/lab-dados-jev-anotacao-sentencas.html (+4ms) 
17:25:06   ├─ /benchmarks/dnakhoa-jev-deferred-crispification.html (+4ms) 
17:25:06   ├─ /benchmarks/sypherin-jev-trace-classifier.html (+4ms) 
17:25:06   ├─ /benchmarks/myokoym-misereru-slide-jev.html (+5ms) 
17:25:06   ├─ /benchmarks/zefir1990-openjev-experiments.html (+5ms) 
17:25:06   ├─ /benchmarks/parallel-constrained-decoding-qwen2-5-1b-rlcd.html (+4ms) 
17:25:06   ├─ /benchmarks/akash-kamat-system-one-gemma.html (+4ms) 
17:25:06   ├─ /benchmarks/aliceroselia-typesafe-chess-eval.html (+4ms) 
17:25:06   ├─ /benchmarks/tianyucodings-nanojev.html (+6ms) 
17:25:06   ├─ /benchmarks/bespokelabsai-nimble.html (+7ms) 
17:25:06   ├─ /benchmarks/apolinario-decision-index.html (+5ms) 
17:25:06   ├─ /benchmarks/fastino-gliner-decide.html (+4ms) 
17:25:06   ├─ /benchmarks/contrastive-lm-clm-8b.html (+5ms) 
17:25:06   ├─ /categories/official.html (+8ms) 
17:25:06   ├─ /categories/sdks.html (+13ms) 
17:25:06   ├─ /categories/integrations.html (+14ms) 
17:25:06   ├─ /categories/agent-tooling.html (+28ms) 
17:25:06   ├─ /categories/browser-computer-use.html (+8ms) 
17:25:06   ├─ /categories/applications.html (+15ms) 
17:25:06   ├─ /categories/games.html (+10ms) 
17:25:06   ├─ /categories/playgrounds.html (+11ms) 
17:25:06   ├─ /categories/benchmarks.html (+16ms) 
17:25:06   ├─ /categories/guides.html (+10ms) 
17:25:06   ├─ /contact.html (+4ms) 
17:25:06   ├─ /developers.html (+4ms) 
17:25:06   ├─ /explore.html (+40ms) 
17:25:06   ├─ /for-agents.html (+4ms) 
17:25:06   ├─ /games/fhshaik-typesafe-mario.html (+6ms) 
17:25:06   ├─ /games/romanslack-jev-drone.html (+4ms) 
17:25:06   ├─ /games/lukaske-jev-doom-agent.html (+4ms) 
17:25:06   ├─ /games/hollow-creek.html (+6ms) 
17:25:06   ├─ /games/jev-arcade.html (+5ms) 
17:25:06   ├─ /games/icohen007-jev-play-ping-pong.html (+4ms) 
17:25:06   ├─ /games/iammusham-jev-snake.html (+4ms) 
17:25:06   ├─ /games/0x963d-last-exit.html (+5ms) 
17:25:06   ├─ /games/vnmoorthy-siege.html (+4ms) 
17:25:06   ├─ /games/shubhankar-jev-fifa.html (+5ms) 
17:25:06   ├─ /games/enoyola-jev-grand-prix.html (+5ms) 
17:25:06   ├─ /games/muhammadaq1-before-the-fall-jev.html (+4ms) 
17:25:06   ├─ /games/muratcanberber-jev-the-fish-game.html (+4ms) 
17:25:06   ├─ /games/thumay9700-jev-plays.html (+5ms) 
17:25:06   ├─ /games/thisiskp-jevarcade.html (+4ms) 
17:25:06   ├─ /games/marcelpociot-wordshift.html (+4ms) 
17:25:06   ├─ /games/standardagents-jevpilot.html (+7ms) 
17:25:06   ├─ /games/jevdoom-jev-arcade.html (+5ms) 
17:25:06   ├─ /games/christianmat-jev-pokemon.html (+4ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/hermes.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/openclaw.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/codex-and-opencode.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/langchain-langgraph.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/cline-and-roo.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/github-copilot-agent.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/devin-desktop.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/browser-computer-use.md (+1ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/hermes.html (+5ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/openclaw.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/codex-and-opencode.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.html (+4ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/langchain-langgraph.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/cline-and-roo.html (+4ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/github-copilot-agent.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/devin-desktop.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents/browser-computer-use.html (+3ms) 
17:25:06   ├─ /guides/jev-with-ai-agents.html (+4ms) 
17:25:06   ├─ /guides/jev-with-ai-agents.md (+2ms) 
17:25:06   ├─ /guides/abdelstark-awesome-typesafe.html (+4ms) 
17:25:06   ├─ /guides/yibie-awesome-jev.html (+5ms) 
17:25:06   ├─ /guides/logicrw-awesome-jev-projects.html (+4ms) 
17:25:06   ├─ /guides/omnijev-awesome-jev.html (+4ms) 
17:25:06   ├─ /guides/ainews-jev-a-system-one-model-that-only-decides.html (+4ms) 
17:25:06   ├─ /guides/jev-plays-minecraft-r-accelerate.html (+4ms) 
17:25:06   ├─ /guides/jev-system-one-models-explained-datacamp.html (+4ms) 
17:25:06   ├─ /guides/one-judge-call-vs-twelve-dimension-scores.html (+4ms) 
17:25:06   ├─ /guides/typed-decisions-not-chat.html (+4ms) 
17:25:06   ├─ /guides/networkchuck-jev-guide.html (+6ms) 
17:25:06   ├─ /guides/socialwithaayan-ten-jev-repos.html (+5ms) 
17:25:06   ├─ /guides/datawhalechina-jev-cookbook.html (+5ms) 
17:25:06   ├─ /guides/openai-decisions-api.html (+4ms) 
17:25:06   ├─ /guides.html (+5ms) 
17:25:06   ├─ /learn/laya-vs-jev/compare.md (+1ms) 
17:25:06   ├─ /learn/laya-vs-jev/what-is-laya.md (+1ms) 
17:25:06   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.md (+1ms) 
17:25:06   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.md (+1ms) 
17:25:06   ├─ /learn/laya-vs-jev/migration-and-coexistence.md (+1ms) 
17:25:06   ├─ /learn/laya-vs-jev/privacy-and-agents.md (+1ms) 
17:25:06   ├─ /learn/laya-vs-jev/compare.html (+3ms) 
17:25:06   ├─ /learn/laya-vs-jev/what-is-laya.html (+3ms) 
17:25:06   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.html (+4ms) 
17:25:06   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.html (+3ms) 
17:25:06   ├─ /learn/laya-vs-jev/migration-and-coexistence.html (+3ms) 
17:25:06   ├─ /learn/laya-vs-jev/privacy-and-agents.html (+3ms) 
17:25:06   ├─ /learn/laya-vs-jev.html (+4ms) 
17:25:06   ├─ /learn/laya-vs-jev.md (+2ms) 
17:25:06   ├─ /learn/jev-typesafe.md (+1ms) 
17:25:06   ├─ /learn/system-one.md (+0ms) 
17:25:06   ├─ /learn/jev-vs-llm-classification.md (+1ms) 
17:25:06   ├─ /learn/vercel-ai-gateway.md (+0ms) 
17:25:06   ├─ /learn/where-to-run-jev.md (+0ms) 
17:25:06   ├─ /learn/use-cases.md (+0ms) 
17:25:06   ├─ /learn/jev-typesafe.html (+4ms) 
17:25:06   ├─ /learn/system-one.html (+3ms) 
17:25:06   ├─ /learn/jev-vs-llm-classification.html (+2ms) 
17:25:06   ├─ /learn/vercel-ai-gateway.html (+3ms) 
17:25:06   ├─ /learn/where-to-run-jev.html (+3ms) 
17:25:06   ├─ /learn/use-cases.html (+4ms) 
17:25:06   ├─ /learn.html (+5ms) 
17:25:06   ├─ /llms-full.txt (+6ms) 
17:25:06   ├─ /llms.txt (+4ms) 
17:25:06   ├─ /privacy/archive.html (+4ms) 
17:25:06   ├─ /privacy.html (+4ms) 
17:25:06   ├─ /robots.txt (+2ms) 
17:25:06   ├─ /sdks/typesafe-ai-skills.html (+4ms) 
17:25:06   ├─ /sdks/typesafe-ai-typesafe-sdk-js.html (+4ms) 
17:25:06   ├─ /sdks/typesafe-ai-system-one-adapter-python.html (+4ms) 
17:25:06   ├─ /sdks/typesafe-ai-typesafe-sdk-python.html (+4ms) 
17:25:06   ├─ /sdks/jomatsu-zod-jev.html (+4ms) 
17:25:06   ├─ /sdks/saibimajdi-typesafeai-dotnet-sdk.html (+4ms) 
17:25:06   ├─ /sdks/inanna-malick-jev-dsl.html (+4ms) 
17:25:06   ├─ /sdks/mateonunez-jod.html (+5ms) 
17:25:06   ├─ /sdks/nshkrdotcom-typesafe-sdk.html (+4ms) 
17:25:06   ├─ /sdks/gaurav-gosain-jev-go.html (+4ms) 
17:25:06   ├─ /sdks/abovecolin-jevclient.html (+4ms) 
17:25:06   ├─ /sdks/documentation.html (+4ms) 
17:25:06   ├─ /sdks/quick-start.html (+4ms) 
17:25:06   ├─ /sdks/playground.html (+4ms) 
17:25:06   ├─ /sdks/http-api-reference.html (+4ms) 
17:25:06   ├─ /sdks/primitives.html (+4ms) 
17:25:06   ├─ /sdks/patterns.html (+4ms) 
17:25:06   ├─ /sdks/cookbooks.html (+4ms) 
17:25:06   ├─ /sdks/smart-home-demo.html (+4ms) 
17:25:06   ├─ /sdks/workflow-evals.html (+4ms) 
17:25:06   ├─ /sdks/introducing-system-one-models-and-jev.html (+4ms) 
17:25:06   ├─ /sdks/valksor-typesafe-sdk-go.html (+4ms) 
17:25:06   ├─ /sdks/valksor-typesafe-sdk-php.html (+5ms) 
17:25:06   ├─ /sdks/classifier-dev-cli.html (+4ms) 
17:25:06   ├─ /sdks/pypi-jev-cli.html (+4ms) 
17:25:06   ├─ /sdks/langchain-ai-langchain-typesafe.html (+5ms) 
17:25:06   ├─ /sdks/peterfriese-system-one-foundation-models.html (+4ms) 
17:25:06   ├─ /showcase.html (+27ms) 
17:25:06   ├─ /sitemap-guides.xml (+2ms) 
17:25:06   ├─ /sitemap-learn.xml (+2ms) 
17:25:06   ├─ /sitemap-listings.xml (+4ms) 
17:25:06   ├─ /sitemap-static.xml (+2ms) 
17:25:06   ├─ /sitemap.xml (+3ms) 
17:25:06   ├─ /submit.html (+6ms) 
17:25:06   ├─ /terms.html (+3ms) 
17:25:06   ├─ /tools/vercel-eve.html (+4ms) 
17:25:06   ├─ /tools/tamaratran-fast-jev-compaction.html (+4ms) 
17:25:06   ├─ /tools/vercel-labs-ai-cli.html (+5ms) 
17:25:06   ├─ /tools/thruwire-foreman.html (+5ms) 
17:25:06   ├─ /tools/devagrawal09-jev-review.html (+6ms) 
17:25:06   ├─ /tools/realzachi-pg-jev.html (+5ms) 
17:25:06   ├─ /tools/y0usaf-pi-jev.html (+4ms) 
17:25:06   ├─ /tools/gargpratyush-jev-router.html (+4ms) 
17:25:06   ├─ /tools/niazmorshed2007-jev-review.html (+4ms) 
17:25:06   ├─ /tools/mapika-decider.html (+4ms) 
17:25:06   ├─ /tools/dbreunig-building-with-jev-skill.html (+4ms) 
17:25:06   ├─ /tools/jkudish-jev-mcp.html (+5ms) 
17:25:06   ├─ /tools/itsmostafa-typesafe-mcp.html (+3ms) 
17:25:06   ├─ /tools/devmortimer-pi-warden.html (+3ms) 
17:25:06   ├─ /tools/superagents-lab-jev-search.html (+5ms) 
17:25:06   ├─ /tools/dicklesworthstone-skillranker.html (+4ms) 
17:25:06   ├─ /tools/mrnugget-jev-shell-history.html (+4ms) 
17:25:06   ├─ /tools/0xnatoshi-jev-codex-router.html (+3ms) 
17:25:06   ├─ /tools/wundercorp-loki.html (+5ms) 
17:25:06   ├─ /tools/jexp-neo4jev.html (+4ms) 
17:25:06   ├─ /tools/compozy-yoshi.html (+3ms) 
17:25:06   ├─ /tools/jomatsu-pi-jev-auto-mode.html (+4ms) 
17:25:06   ├─ /tools/blakestone-x-jev-mcp.html (+4ms) 
17:25:06   ├─ /tools/danrwilloughby-snifftest.html (+4ms) 
17:25:06   ├─ /tools/decrux9812-typesafe-skill-router.html (+3ms) 
17:25:06   ├─ /tools/arunav25-jev-mcp.html (+4ms) 
17:25:06   ├─ /tools/brainwires-jevwire.html (+4ms) 
17:25:06   ├─ /tools/frostney-clean-code-review.html (+3ms) 
17:25:06   ├─ /tools/keeltrace-hermes-jev.html (+4ms) 
17:25:06   ├─ /tools/anpicasso-hermes-jev-approvals.html (+4ms) 
17:25:06   ├─ /tools/tylerjharden-ailerix.html (+3ms) 
17:25:06   ├─ /tools/leepokai-jev-guard.html (+4ms) 
17:25:06   ├─ /tools/rashedint32-jev-mcp.html (+3ms) 
17:25:06   ├─ /tools/caiovicentino-jev-shield.html (+4ms) 
17:25:07   ├─ /tools/shivampansuriya-jev-skill-gate.html (+4ms) 
17:25:07   ├─ /tools/molis-ai-jev-workbench.html (+4ms) 
17:25:07   ├─ /tools/iamvatsalpatel-tiershift.html (+4ms) 
17:25:07   ├─ /tools/belazy167-typesafe-mod.html (+4ms) 
17:25:07   ├─ /tools/bestagentkits-jev-skillful.html (+3ms) 
17:25:07   ├─ /tools/jev-on-vercel-ai-gateway.html (+3ms) 
17:25:07   ├─ /tools/dommonte-n8n-nodes-typesafe-ai.html (+5ms) 
17:25:07   ├─ /tools/vercel-ai-sdk-provider.html (+4ms) 
17:25:07   ├─ /tools/legacybridge-tech-pi-typesafe-jev.html (+4ms) 
17:25:07   ├─ /tools/aniruddh-krovvidi-switchboard.html (+5ms) 
17:25:07   ├─ /tools/classifier-dev-mcp.html (+4ms) 
17:25:07   ├─ /tools/openrouter-typesafe-jev-1-13.html (+4ms) 
17:25:07   ├─ /tools/cloudflare-workers-ai-typesafe-jev.html (+4ms) 
17:25:07   ├─ /tools/kushwho-jev-codes.html (+6ms) 
17:25:07   ├─ /tools/tanstack-ai-decide.html (+4ms) 
17:25:07   ├─ /tools/iurysza-logview-jev.html (+5ms) 
17:25:07   ├─ /tools/box-jev-incident-triage.html (+5ms) 
17:25:07   ├─ /tools/workday-sana-jev-generative-ui.html (+4ms) 
17:25:07   ├─ /tools/uipath-typesafe-jev-connector.html (+4ms) 
17:25:07   ├─ /tools/motherduck-prompt-jev.html (+5ms) 
17:25:07   ├─ /tools/openbmb-minicpm-ocr-jev.html (+4ms) 
17:25:07   ├─ /tools/mbzuai-oryx-eo-jev.html (+6ms) 
17:25:07   ├─ /tools/kerpopule-hermes-jev-skills.html (+4ms) 
17:25:07   ├─ /tools/kitfunso-hippo-memory.html (+4ms) 
17:25:07   ├─ /tools/juspay-neurolink.html (+4ms) 
17:25:07   ├─ /tools/uehaj-jev-semgrep.html (+5ms) 
17:25:07   ├─ /tools/tamaratran-jev-pruner.html (+4ms) 
17:25:07   ├─ /tools/hyperspaceai-jevcache.html (+5ms) 
17:25:07   ├─ /tools/featherless-simple-jev.html (+4ms) 
17:25:07   ├─ /tools/miuuyy-astra-ares.html (+4ms) 
17:25:07   ├─ /tools/coldteadotai-abide.html (+4ms) 
17:25:07   ├─ /tools/qkal-canny.html (+5ms) 
17:25:07   ├─ /tools/nidhi-singh02-agent-router.html (+4ms) 
17:25:07   ├─ /tools/togethercomputer-tev1.html (+5ms) 
17:25:07   ├─ /tools/jaredpalmer-kev.html (+5ms) 
17:25:07   ├─ /tools/wfzyx-von.html (+4ms) 
17:25:07   ├─ /tools/samuelfaj-distill.html (+4ms) 
17:25:07   ├─ /tools/sutro-sh-jev-align.html (+5ms) 
17:25:07   ├─ /tools/nokia-applied-research-anyjev.html (+5ms) 
17:25:07   ├─ /tools/githubnext-localjev.html (+6ms) 
17:25:07   ├─ /tools/typellm-typellm.html (+5ms) 
17:25:07   ├─ /tools/rizzo-ai-academy-rizzo-flow.html (+4ms) 
17:25:07   ├─ /tools/tianyucodings-jevharness.html (+4ms) 
17:25:07   ├─ /tools/ollaya-dev-ollaya.html (+5ms) 
17:25:07   ├─ /tools/liuziyu77-valen.html (+6ms) 
17:25:07   ├─ /tools/receptron-laya.html (+4ms) 
17:25:07   ├─ /tools/dzhng-jevgrep.html (+4ms) 
17:25:07   ├─ /tools/logan-markewich-jeff.html (+4ms) 
17:25:07   ├─ /tools/mizorewww-laya-coreml.html (+4ms) 
17:25:07   ├─ /tools/alex314618-create-jevrev.html (+4ms) 
17:25:07   ├─ /tools/avinash-jetwani-jevmem.html (+6ms) 
17:25:07   ├─ /tools/hitsz-tmg-jevembed.html (+5ms) 
17:25:07   ├─ /tools/deepopen-com-deepopen.html (+4ms) 
17:25:07   ├─ /tools/qybaihe-mu.html (+4ms) 
17:25:07   ├─ /tools/mode-io-vllm-jev.html (+4ms) 
17:25:07   ├─ /tools/disler-ten-levels-of-jev.html (+4ms) 
17:25:07   ├─ /tools/charlesfeng0314-jev-sees.html (+7ms) 
17:25:07   ├─ /tools/uditakhourii-quicksilver.html (+5ms) 
17:25:07   ├─ /tools/aurorainfra-grev.html (+5ms) 
17:25:07   ├─ /tools/codegirl-007-jevlint.html (+4ms) 
17:25:07   ├─ /tools/junma11-medjev.html (+4ms) 
17:25:07   ├─ /tools/vectifyai-jev-doc-search.html (+4ms) 
17:25:07   ├─ /tools/statelyai-jevspresso.html (+6ms) 
17:25:07   ├─ /tools/tomerglick57-jevstiller.html (+4ms) 
17:25:07   ├─ /tools/raphaelmansuy-edgextract.html (+4ms) 
17:25:07   ├─ /tools/sheltercosmo-jev4pg.html (+5ms) 
17:25:07   ├─ /tools/posthog-jeeves.html (+4ms) 
17:25:07   ├─ /tools/vinilana-jev-gateway.html (+5ms) 
17:25:07   ├─ /tools/tsale-jevline.html (+4ms) 
17:25:07   ├─ /tools/0814wdwd-solo-jev.html (+4ms) 
17:25:07   ├─ /tools/luobosibing2-dsh-jev-plugin.html (+4ms) 
17:25:07   ├─ /tools/yinsongxu-llm2jev.html (+5ms) 
17:25:07   ├─ /tools/dorkitude-webctl.html (+5ms) 
17:25:07   ├─ /tools/mordavid-nucleisniper.html (+5ms) 
17:25:07   ├─ /tools/rayenmlayeh-jevcrawl.html (+5ms) 
17:25:07   ├─ /tools/liqiiiii-jeva.html (+4ms) 
17:25:07   ├─ /tools/feder-cr-jevos.html (+5ms) 
17:25:07   ├─ /tools/mcg-nju-videojev.html (+4ms) 
17:25:07   ├─ /tools/openlayer-ai-jevals.html (+4ms) 
17:25:07   ├─ /tools/deepaleph-jevreel.html (+6ms) 
17:25:07   ├─ /tools/disler-pi-durable-news-agent.html (+5ms) 
17:25:07   ├─ /tools/nandhakishorm-laya.html (+4ms) 
17:25:07   ├─ /tools/cloudflare-clef.html (+4ms) 
17:25:07   ├─ /tools/perplexity-pplx-decider.html (+4ms) 
17:25:07   ├─ /tools/liquidai-d1-3b.html (+3ms) 
17:25:07   ├─ /tools/strands-labs-strands-decider.html (+4ms) 
17:25:07   ├─ /tools/undrgrnd-labs-hunch.html (+5ms) 
17:25:07   ├─ /tools/a2sys-ai-jevfetch.html (+4ms) 
17:25:07   ├─ /tools/mattt-anydecisionmodel.html (+4ms) 
17:25:07   ├─ /tools/omnijev-flide.html (+4ms) 
17:25:07   ├─ /tools/agent-labs-dev-fastbrowse.html (+4ms) 
17:25:07   ├─ /tools/qbeka-jev-job-search.html (+5ms) 
17:25:07   ├─ /tools/native-bond-lab-jev-interaction.html (+6ms) 
17:25:07   ├─ /tools/storytold-autocraft.html (+5ms) 
17:25:07   ├─ /tools/autonomous-ai-lamp-os.html (+4ms) 
17:25:07   ├─ /your-privacy-choices.html (+4ms) 
17:25:07   ├─ /index.html (+9ms) 
17:25:07 ✓ Completed in 2.29s.

17:25:07 [build] ✓ Completed in 3.22s.
17:25:07 [build] 363 page(s) built in 3.44s
17:25:07 [build] Complete!
Wrote dist/_redirects (638 redirect rules incl. /items hub)
Wrote dist/_routes.json (invoke Pages Functions + middleware on all paths)
Verified dist/index.html present (static homepage at /)
Wrote dist/_headers (37 markdown rules + 2 MFM shell noindex rules)
Meta uniqueness OK across 363 indexable HTML files (364 total HTML). Descriptions are <= 160 characters and do not end in ",." ":." or ";.".
Explore SEO policy checks OK.
verify-not-found-seo: ok
SEO artifacts OK: sitemap index + 4 child maps, 363 URLs (301 detail), catalog 633, redirects 638.
verify-markdown-negotiation: ok
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
```
