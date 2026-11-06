- Visitors get a full comparison page for Strands Decider so they can see how Amazon Strands Labs open checkpoints line up against hosted Jev before they change stacks.
- Readers can explore hunch, a CPU sidecar that learns from teacher calls such as Jev, graduates when cross validation agrees, then keeps auditing against the teacher.
- The site documents jevfetch as a single URL reader that returns quoted documentation blocks with TypeSafe Jev gates, separate from search ranking tools and multi page crawlers.
- The alternatives hub now lists twelve decision models and adds a Strands row with public GitHub adoption text pulled from the shared metrics file.
- The public directory manifest and explore counts reflect three new detail pages so partner and agent surfaces show matching listing and detail totals.

SEO/LLM impact: Dedicated hub and tool pages with dated verification, canonical tables, and consistent outbound ref handling should improve retrieval for Strands Decider, hunch, and jevfetch intents and reduce conflation with nearby tools.

**Technical details**

- New alternative slug `strands-decider` in `alternatives-slugs.ts`, full entry in `alternatives-pages.ts`, hub row and copy in `alternatives-hub.ts`, GitHub stars row and fact sources in `alternatives-metrics.json` and `alternative-fact-sources.ts`, listing link map in `alternatives-listing-link.ts`, catalog supplement row with deep link to `/alternatives/strands-decider`.
- Published profiles for `undrgrnd-labs-hunch`, `a2sys-ai-jevfetch`, and `strands-labs-strands-decider` in `product-profiles.ts` with `firstSeen: 2026-11-06`, jevfetch TypeSafe disclosure, and related slugs limited to existing detail pages.
- Editorial blurbs in `editorial-blurbs.ts`; `lastmod-manifest.json` bumps; `public/.well-known/jev-directory.json` catalog 625, detail pages 294.
- `scripts/verify-seo-artifacts.mjs` updated for twelve decision models in the alternatives hub H1 and stale eleven model guard text.

**Build proof (`pnpm build`, full log)**

```

> jev-directory@0.1.0 prebuild /agent/repos/jev.aitools.fyi
> pnpm run sync:public-fonts && pnpm run generate:og && pnpm run generate:search-index && pnpm run generate:openapi


> jev-directory@0.1.0 sync:public-fonts /agent/repos/jev.aitools.fyi
> node scripts/sync-public-fonts.mjs


> jev-directory@0.1.0 generate:og /agent/repos/jev.aitools.fyi
> tsx scripts/generate-og-images.ts

Generating Open Graph images…
  listings 50/294
  listings 100/294
  listings 150/294
  listings 200/294
  listings 250/294
  listings 294/294
Done. 314 images in public/og/

> jev-directory@0.1.0 generate:search-index /agent/repos/jev.aitools.fyi
> tsx scripts/generate-search-index.ts

Wrote 625 search index entries to public/search-index.json

> jev-directory@0.1.0 generate:openapi /agent/repos/jev.aitools.fyi
> node scripts/generate-openapi.mjs

Wrote /agent/repos/jev.aitools.fyi/public/openapi.json

> jev-directory@0.1.0 build /agent/repos/jev.aitools.fyi
> node scripts/lastmod-manifest.mjs --check && node scripts/check-meta-length.mjs && node scripts/verify-demo-asset-sizes.mjs --public-only && node scripts/verify-showcase-video-referrer-policy.mjs && node scripts/verify-agent-guide-catalog-links.mjs && astro build && node scripts/write-redirects.mjs && node scripts/write-md-headers.mjs && node scripts/check-meta-uniqueness.mjs && node scripts/verify-explore-seo.mjs && node scripts/verify-not-found-seo.mjs && node scripts/verify-seo-artifacts.mjs && node scripts/verify-markdown-negotiation.mjs && node scripts/verify-demo-asset-sizes.mjs --dist-only

lastmod manifest OK: 355 URLs
Meta length OK (460 source fields, titles <= 60, descriptions <= 160).
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
Showcase video referrer policy OK (ShowcaseDemoVideo + no raw <video> in card/lightbox).
verify-agent-guide-catalog-links: ok
16:05:31 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
16:05:31 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [types] Generated 36ms
16:05:31 [build] output: "static"
16:05:31 [build] mode: "static"
16:05:31 [build] directory: /agent/repos/jev.aitools.fyi/dist/
16:05:31 [build] Collecting build info...
16:05:31 [build] ✓ Completed in 88ms.
16:05:31 [build] Building static entrypoints...
16:05:31 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
16:05:31 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
16:05:31 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
16:05:31 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
16:05:31 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
16:05:31 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
16:05:31 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
16:05:32 [vite] ✓ built in 534ms
16:05:32 [WARN] [vite] [plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
16:05:32 [vite] ✓ built in 421ms
16:05:32 [build] Rearranging server assets...

 generating static routes 
16:05:32   ├─ /404.html (+31ms) 
16:05:32   ├─ /about.html (+12ms) 
16:05:32   ├─ /alternatives/cloudflare-clef.md (+3ms) 
16:05:32   ├─ /alternatives/kev.md (+1ms) 
16:05:32   ├─ /alternatives/openai-decisions-api.md (+2ms) 
16:05:32   ├─ /alternatives/perplexity-pplx-decider.md (+2ms) 
16:05:32   ├─ /alternatives/mapika-decider.md (+1ms) 
16:05:32   ├─ /alternatives/strands-decider.md (+2ms) 
16:05:32   ├─ /alternatives/fastino-gliner-decide.md (+2ms) 
16:05:32   ├─ /alternatives/semif.md (+1ms) 
16:05:32   ├─ /alternatives/clm-8b.md (+1ms) 
16:05:32   ├─ /alternatives/liquid-d1.md (+1ms) 
16:05:32   ├─ /alternatives/von.md (+2ms) 
16:05:32   ├─ /alternatives/cloudflare-clef.html (+7ms) 
16:05:32   ├─ /alternatives/kev.html (+5ms) 
16:05:32   ├─ /alternatives/openai-decisions-api.html (+5ms) 
16:05:32   ├─ /alternatives/perplexity-pplx-decider.html (+4ms) 
16:05:32   ├─ /alternatives/mapika-decider.html (+4ms) 
16:05:32   ├─ /alternatives/strands-decider.html (+4ms) 
16:05:32   ├─ /alternatives/fastino-gliner-decide.html (+6ms) 
16:05:32   ├─ /alternatives/semif.html (+5ms) 
16:05:32   ├─ /alternatives/clm-8b.html (+5ms) 
16:05:32   ├─ /alternatives/liquid-d1.html (+4ms) 
16:05:32   ├─ /alternatives/von.html (+3ms) 
16:05:32   ├─ /alternatives.html (+5ms) 
16:05:32   ├─ /alternatives.md (+2ms) 
16:05:32   ├─ /apps/browser-use-jev-ultrafast.html (+21ms) 
16:05:32   ├─ /apps/jarrodwatts-jev-trader.html (+19ms) 
16:05:32   ├─ /apps/awlevin-typesafe-computer-use.html (+12ms) 
16:05:32   ├─ /apps/usenotra-notra.html (+64ms) 
16:05:32   ├─ /apps/droidrun-mobile-jev.html (+7ms) 
16:05:32   ├─ /apps/jkudish-jev-browser.html (+5ms) 
16:05:32   ├─ /apps/kitze-unclutter.html (+5ms) 
16:05:32   ├─ /apps/chetaslua-jevmeter.html (+8ms) 
16:05:32   ├─ /apps/realzachi-typesafe-adblock.html (+5ms) 
16:05:32   ├─ /apps/wy-coliney-jev-browser-use.html (+8ms) 
16:05:32   ├─ /apps/moritzkremb-jev-voice-browser.html (+6ms) 
16:05:32   ├─ /apps/brainstormity-jev-moderation-bot.html (+5ms) 
16:05:33   ├─ /apps/ellipsis-dev-blink.html (+6ms) 
16:05:33   ├─ /apps/monteduro-killmyidea.html (+6ms) 
16:05:33   ├─ /apps/bunsdev-typesafe-ai-playground.html (+5ms) 
16:05:33   ├─ /apps/abovecolin-ha-jev.html (+9ms) 
16:05:33   ├─ /apps/arielweinberger-jev-autopilot.html (+5ms) 
16:05:33   ├─ /apps/ranjan2829-askjev.html (+5ms) 
16:05:33   ├─ /apps/sufianetaouil-every.html (+4ms) 
16:05:33   ├─ /apps/reachjalil-jev-tree.html (+5ms) 
16:05:33   ├─ /apps/hellogumbo-should-ai-kill-us-all.html (+5ms) 
16:05:33   ├─ /apps/nickthompson480-typesafe-ai-playground.html (+4ms) 
16:05:33   ├─ /apps/jackalope-dev-jackalope.html (+8ms) 
16:05:33   ├─ /apps/bunsdev-clarity-judge.html (+5ms) 
16:05:33   ├─ /apps/tanaypadar-gpt-vs-jev.html (+5ms) 
16:05:33   ├─ /apps/joevidev-ui-generator-instinct-jev.html (+4ms) 
16:05:33   ├─ /apps/little-planet-labs-jev-playground.html (+5ms) 
16:05:33   ├─ /apps/eriestra-browser-use-olympics.html (+5ms) 
16:05:33   ├─ /apps/krw82-jev-playwright-mcp.html (+5ms) 
16:05:33   ├─ /apps/coriew-jevtest.html (+6ms) 
16:05:33   ├─ /apps/marissafamularo-citation-verifier.html (+5ms) 
16:05:33   ├─ /apps/dmx-to.html (+5ms) 
16:05:33   ├─ /apps/jev-classifier.html (+5ms) 
16:05:33   ├─ /apps/charlyhno-eng-jev-document-classification.html (+4ms) 
16:05:33   ├─ /apps/0xarx-jevegis.html (+4ms) 
16:05:33   ├─ /apps/hemanth-pkg-gate.html (+6ms) 
16:05:33   ├─ /apps/cpaczek-s1s.html (+6ms) 
16:05:33   ├─ /apps/cbetz-extremely-specific-council.html (+5ms) 
16:05:33   ├─ /apps/asfarsadewa-human-compiler.html (+6ms) 
16:05:33   ├─ /apps/narulaskaran-jev-data-questions.html (+5ms) 
16:05:33   ├─ /apps/wustep-jev-playground.html (+5ms) 
16:05:33   ├─ /apps/ndolinschi-jevplay.html (+4ms) 
16:05:33   ├─ /apps/wesecureyou-jev-test.html (+5ms) 
16:05:33   ├─ /apps/jordiparracrespo-typesafe-ai-trading-showcase.html (+6ms) 
16:05:33   ├─ /apps/shifros-search-function-test.html (+5ms) 
16:05:33   ├─ /apps/yes-no.html (+4ms) 
16:05:33   ├─ /apps/classifier-dev.html (+6ms) 
16:05:33   ├─ /apps/ploy-ai.html (+5ms) 
16:05:33   ├─ /apps/dub-co.html (+5ms) 
16:05:33   ├─ /apps/avec-ai.html (+7ms) 
16:05:33   ├─ /apps/pixelml-com.html (+6ms) 
16:05:33   ├─ /apps/hypit-ai.html (+6ms) 
16:05:33   ├─ /apps/egghead-smart-procurement.html (+5ms) 
16:05:33   ├─ /apps/docjev.html (+6ms) 
16:05:33   ├─ /apps/socai-io-jev-social.html (+6ms) 
16:05:33   ├─ /apps/mfm-jev-search.html (+6ms) 
16:05:33   ├─ /apps/kylejeong-jev-as-judge.html (+5ms) 
16:05:33   ├─ /apps/carolmonroe-jevrls.html (+6ms) 
16:05:33   ├─ /apps/virlo-ai.html (+5ms) 
16:05:33   ├─ /apps/stealads-ai.html (+6ms) 
16:05:33   ├─ /apps/lahfir-agent-desktop.html (+5ms) 
16:05:33   ├─ /apps/nutlope-1kpapers.html (+5ms) 
16:05:33   ├─ /apps/kraayenjon-ai-slop-detector.html (+5ms) 
16:05:33   ├─ /apps/robj3d3-superx-post-scoring.html (+5ms) 
16:05:33   ├─ /apps/nailthy62-drape-virtual-try-on.html (+6ms) 
16:05:33   ├─ /apps/trungdq88-youtube-sponsor-detection.html (+5ms) 
16:05:33   ├─ /apps/iannuttall-internal-links.html (+5ms) 
16:05:33   ├─ /apps/sdras-jev-webmcp-extension.html (+5ms) 
16:05:33   ├─ /apps/jev-chat-jev-chat-jarvis.html (+5ms) 
16:05:33   ├─ /apps/sac-y-jev-cu.html (+6ms) 
16:05:33   ├─ /apps/anishfn-shapeshift.html (+5ms) 
16:05:33   ├─ /apps/milind-soni-tiptour-macos.html (+4ms) 
16:05:33   ├─ /apps/jev-chat-jev-chat-windows.html (+5ms) 
16:05:33   ├─ /apps/openbyteinc-quantdinger.html (+4ms) 
16:05:33   ├─ /apps/agricidaniel-jev-seo.html (+7ms) 
16:05:33   ├─ /apps/extend-hq-jevbox.html (+6ms) 
16:05:33   ├─ /apps/eliot5566-jev-paper-radar.html (+5ms) 
16:05:33   ├─ /apps/budecosystem-bud-decision-studio.html (+5ms) 
16:05:33   ├─ /apps/shhivv-arc-cua.html (+4ms) 
16:05:33   ├─ /benchmarks/theoleecj-semif.html (+7ms) 
16:05:33   ├─ /benchmarks/vinnylarouge-jevlike.html (+5ms) 
16:05:33   ├─ /benchmarks/iammrduncan-typesafe-ai-benchmark.html (+4ms) 
16:05:33   ├─ /benchmarks/r-ms-mini-jev.html (+4ms) 
16:05:33   ├─ /benchmarks/rorshopping-jev-on-a-laptop.html (+4ms) 
16:05:33   ├─ /benchmarks/olanotolu-jevbetter.html (+4ms) 
16:05:33   ├─ /benchmarks/goodrahstar-jev-column-race.html (+4ms) 
16:05:33   ├─ /benchmarks/kikoncuo-jevfire.html (+5ms) 
16:05:33   ├─ /benchmarks/mahlernim-jev-korean-benchmark.html (+4ms) 
16:05:33   ├─ /benchmarks/aabolfazl-typesafe-local.html (+4ms) 
16:05:33   ├─ /benchmarks/docxology-daf-jev.html (+4ms) 
16:05:33   ├─ /benchmarks/zhuyansen-jev-search-rerank-eval.html (+4ms) 
16:05:33   ├─ /benchmarks/zhengxuyu-litjev.html (+4ms) 
16:05:33   ├─ /benchmarks/heman10x-ngu-verdict-open-jev.html (+4ms) 
16:05:33   ├─ /benchmarks/foadsf-jev-for-engineers.html (+5ms) 
16:05:33   ├─ /benchmarks/monglong0214-jev-gate.html (+4ms) 
16:05:33   ├─ /benchmarks/antoniocoppe-jev-harness.html (+3ms) 
16:05:33   ├─ /benchmarks/akashpriyadarshii-jev-curate.html (+4ms) 
16:05:33   ├─ /benchmarks/anessbelbati-jev-rerank-bench.html (+4ms) 
16:05:33   ├─ /benchmarks/altryne-jevify.html (+4ms) 
16:05:33   ├─ /benchmarks/zsavage8-padflow-jev-evals.html (+4ms) 
16:05:33   ├─ /benchmarks/lab-dados-jev-anotacao-sentencas.html (+5ms) 
16:05:33   ├─ /benchmarks/dnakhoa-jev-deferred-crispification.html (+4ms) 
16:05:33   ├─ /benchmarks/sypherin-jev-trace-classifier.html (+4ms) 
16:05:33   ├─ /benchmarks/myokoym-misereru-slide-jev.html (+4ms) 
16:05:33   ├─ /benchmarks/zefir1990-openjev-experiments.html (+4ms) 
16:05:33   ├─ /benchmarks/parallel-constrained-decoding-qwen2-5-1b-rlcd.html (+4ms) 
16:05:33   ├─ /benchmarks/akash-kamat-system-one-gemma.html (+4ms) 
16:05:33   ├─ /benchmarks/aliceroselia-typesafe-chess-eval.html (+5ms) 
16:05:33   ├─ /benchmarks/tianyucodings-nanojev.html (+6ms) 
16:05:33   ├─ /benchmarks/bespokelabsai-nimble.html (+5ms) 
16:05:33   ├─ /benchmarks/apolinario-decision-index.html (+4ms) 
16:05:33   ├─ /benchmarks/fastino-gliner-decide.html (+4ms) 
16:05:33   ├─ /benchmarks/contrastive-lm-clm-8b.html (+4ms) 
16:05:33   ├─ /categories/official.html (+7ms) 
16:05:33   ├─ /categories/sdks.html (+9ms) 
16:05:33   ├─ /categories/integrations.html (+13ms) 
16:05:33   ├─ /categories/agent-tooling.html (+22ms) 
16:05:33   ├─ /categories/browser-computer-use.html (+8ms) 
16:05:33   ├─ /categories/applications.html (+14ms) 
16:05:33   ├─ /categories/games.html (+10ms) 
16:05:33   ├─ /categories/playgrounds.html (+9ms) 
16:05:33   ├─ /categories/benchmarks.html (+15ms) 
16:05:33   ├─ /categories/guides.html (+9ms) 
16:05:33   ├─ /contact.html (+4ms) 
16:05:33   ├─ /developers.html (+3ms) 
16:05:33   ├─ /explore.html (+35ms) 
16:05:33   ├─ /for-agents.html (+4ms) 
16:05:33   ├─ /games/fhshaik-typesafe-mario.html (+6ms) 
16:05:33   ├─ /games/romanslack-jev-drone.html (+5ms) 
16:05:33   ├─ /games/lukaske-jev-doom-agent.html (+4ms) 
16:05:33   ├─ /games/hollow-creek.html (+4ms) 
16:05:33   ├─ /games/jev-arcade.html (+4ms) 
16:05:33   ├─ /games/icohen007-jev-play-ping-pong.html (+4ms) 
16:05:33   ├─ /games/iammusham-jev-snake.html (+4ms) 
16:05:33   ├─ /games/0x963d-last-exit.html (+5ms) 
16:05:33   ├─ /games/vnmoorthy-siege.html (+4ms) 
16:05:33   ├─ /games/shubhankar-jev-fifa.html (+5ms) 
16:05:33   ├─ /games/enoyola-jev-grand-prix.html (+4ms) 
16:05:33   ├─ /games/muhammadaq1-before-the-fall-jev.html (+4ms) 
16:05:33   ├─ /games/muratcanberber-jev-the-fish-game.html (+4ms) 
16:05:33   ├─ /games/thumay9700-jev-plays.html (+4ms) 
16:05:33   ├─ /games/thisiskp-jevarcade.html (+5ms) 
16:05:33   ├─ /games/marcelpociot-wordshift.html (+4ms) 
16:05:33   ├─ /games/standardagents-jevpilot.html (+5ms) 
16:05:33   ├─ /games/jevdoom-jev-arcade.html (+4ms) 
16:05:33   ├─ /games/christianmat-jev-pokemon.html (+4ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/hermes.md (+2ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/openclaw.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/codex-and-opencode.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/langchain-langgraph.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/cline-and-roo.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/github-copilot-agent.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/devin-desktop.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/browser-computer-use.md (+1ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/hermes.html (+6ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/openclaw.html (+3ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.html (+4ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/codex-and-opencode.html (+3ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.html (+4ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/langchain-langgraph.html (+3ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/cline-and-roo.html (+3ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/github-copilot-agent.html (+3ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/devin-desktop.html (+3ms) 
16:05:33   ├─ /guides/jev-with-ai-agents/browser-computer-use.html (+4ms) 
16:05:33   ├─ /guides/jev-with-ai-agents.html (+4ms) 
16:05:33   ├─ /guides/jev-with-ai-agents.md (+1ms) 
16:05:33   ├─ /guides/abdelstark-awesome-typesafe.html (+4ms) 
16:05:33   ├─ /guides/yibie-awesome-jev.html (+3ms) 
16:05:33   ├─ /guides/logicrw-awesome-jev-projects.html (+4ms) 
16:05:33   ├─ /guides/omnijev-awesome-jev.html (+4ms) 
16:05:33   ├─ /guides/ainews-jev-a-system-one-model-that-only-decides.html (+4ms) 
16:05:33   ├─ /guides/jev-plays-minecraft-r-accelerate.html (+5ms) 
16:05:33   ├─ /guides/jev-system-one-models-explained-datacamp.html (+4ms) 
16:05:33   ├─ /guides/one-judge-call-vs-twelve-dimension-scores.html (+4ms) 
16:05:33   ├─ /guides/typed-decisions-not-chat.html (+4ms) 
16:05:33   ├─ /guides/networkchuck-jev-guide.html (+4ms) 
16:05:33   ├─ /guides/socialwithaayan-ten-jev-repos.html (+4ms) 
16:05:33   ├─ /guides/datawhalechina-jev-cookbook.html (+4ms) 
16:05:33   ├─ /guides/openai-decisions-api.html (+5ms) 
16:05:33   ├─ /guides.html (+4ms) 
16:05:33   ├─ /learn/laya-vs-jev/compare.md (+2ms) 
16:05:33   ├─ /learn/laya-vs-jev/what-is-laya.md (+1ms) 
16:05:33   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.md (+1ms) 
16:05:33   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.md (+1ms) 
16:05:33   ├─ /learn/laya-vs-jev/migration-and-coexistence.md (+1ms) 
16:05:33   ├─ /learn/laya-vs-jev/privacy-and-agents.md (+1ms) 
16:05:33   ├─ /learn/laya-vs-jev/compare.html (+3ms) 
16:05:33   ├─ /learn/laya-vs-jev/what-is-laya.html (+3ms) 
16:05:33   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.html (+2ms) 
16:05:33   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.html (+2ms) 
16:05:33   ├─ /learn/laya-vs-jev/migration-and-coexistence.html (+3ms) 
16:05:33   ├─ /learn/laya-vs-jev/privacy-and-agents.html (+2ms) 
16:05:33   ├─ /learn/laya-vs-jev.html (+3ms) 
16:05:33   ├─ /learn/laya-vs-jev.md (+2ms) 
16:05:33   ├─ /learn/jev-typesafe.md (+1ms) 
16:05:33   ├─ /learn/system-one.md (+0ms) 
16:05:33   ├─ /learn/jev-vs-llm-classification.md (+0ms) 
16:05:33   ├─ /learn/vercel-ai-gateway.md (+0ms) 
16:05:33   ├─ /learn/where-to-run-jev.md (+0ms) 
16:05:33   ├─ /learn/use-cases.md (+0ms) 
16:05:33   ├─ /learn/jev-typesafe.html (+3ms) 
16:05:33   ├─ /learn/system-one.html (+3ms) 
16:05:33   ├─ /learn/jev-vs-llm-classification.html (+3ms) 
16:05:33   ├─ /learn/vercel-ai-gateway.html (+3ms) 
16:05:33   ├─ /learn/where-to-run-jev.html (+3ms) 
16:05:33   ├─ /learn/use-cases.html (+3ms) 
16:05:33   ├─ /learn.html (+3ms) 
16:05:33   ├─ /llms-full.txt (+6ms) 
16:05:33   ├─ /llms.txt (+3ms) 
16:05:33   ├─ /privacy/archive.html (+3ms) 
16:05:33   ├─ /privacy.html (+3ms) 
16:05:33   ├─ /robots.txt (+2ms) 
16:05:33   ├─ /sdks/typesafe-ai-skills.html (+5ms) 
16:05:33   ├─ /sdks/typesafe-ai-typesafe-sdk-js.html (+4ms) 
16:05:33   ├─ /sdks/typesafe-ai-system-one-adapter-python.html (+4ms) 
16:05:33   ├─ /sdks/typesafe-ai-typesafe-sdk-python.html (+5ms) 
16:05:33   ├─ /sdks/jomatsu-zod-jev.html (+4ms) 
16:05:33   ├─ /sdks/saibimajdi-typesafeai-dotnet-sdk.html (+3ms) 
16:05:33   ├─ /sdks/inanna-malick-jev-dsl.html (+4ms) 
16:05:33   ├─ /sdks/mateonunez-jod.html (+4ms) 
16:05:33   ├─ /sdks/nshkrdotcom-typesafe-sdk.html (+4ms) 
16:05:33   ├─ /sdks/gaurav-gosain-jev-go.html (+4ms) 
16:05:33   ├─ /sdks/abovecolin-jevclient.html (+5ms) 
16:05:33   ├─ /sdks/documentation.html (+4ms) 
16:05:33   ├─ /sdks/quick-start.html (+3ms) 
16:05:33   ├─ /sdks/playground.html (+4ms) 
16:05:33   ├─ /sdks/http-api-reference.html (+3ms) 
16:05:33   ├─ /sdks/primitives.html (+3ms) 
16:05:33   ├─ /sdks/patterns.html (+3ms) 
16:05:33   ├─ /sdks/cookbooks.html (+3ms) 
16:05:33   ├─ /sdks/smart-home-demo.html (+5ms) 
16:05:33   ├─ /sdks/workflow-evals.html (+4ms) 
16:05:33   ├─ /sdks/introducing-system-one-models-and-jev.html (+4ms) 
16:05:34   ├─ /sdks/valksor-typesafe-sdk-go.html (+4ms) 
16:05:34   ├─ /sdks/valksor-typesafe-sdk-php.html (+4ms) 
16:05:34   ├─ /sdks/classifier-dev-cli.html (+4ms) 
16:05:34   ├─ /sdks/pypi-jev-cli.html (+4ms) 
16:05:34   ├─ /sdks/langchain-ai-langchain-typesafe.html (+5ms) 
16:05:34   ├─ /sdks/peterfriese-system-one-foundation-models.html (+4ms) 
16:05:34   ├─ /showcase.html (+24ms) 
16:05:34   ├─ /sitemap-guides.xml (+2ms) 
16:05:34   ├─ /sitemap-learn.xml (+2ms) 
16:05:34   ├─ /sitemap-listings.xml (+2ms) 
16:05:34   ├─ /sitemap-static.xml (+1ms) 
16:05:34   ├─ /sitemap.xml (+3ms) 
16:05:34   ├─ /submit.html (+6ms) 
16:05:34   ├─ /terms.html (+3ms) 
16:05:34   ├─ /tools/vercel-eve.html (+4ms) 
16:05:34   ├─ /tools/tamaratran-fast-jev-compaction.html (+4ms) 
16:05:34   ├─ /tools/vercel-labs-ai-cli.html (+4ms) 
16:05:34   ├─ /tools/thruwire-foreman.html (+4ms) 
16:05:34   ├─ /tools/devagrawal09-jev-review.html (+6ms) 
16:05:34   ├─ /tools/realzachi-pg-jev.html (+5ms) 
16:05:34   ├─ /tools/y0usaf-pi-jev.html (+4ms) 
16:05:34   ├─ /tools/gargpratyush-jev-router.html (+4ms) 
16:05:34   ├─ /tools/niazmorshed2007-jev-review.html (+3ms) 
16:05:34   ├─ /tools/mapika-decider.html (+4ms) 
16:05:34   ├─ /tools/dbreunig-building-with-jev-skill.html (+5ms) 
16:05:34   ├─ /tools/jkudish-jev-mcp.html (+4ms) 
16:05:34   ├─ /tools/itsmostafa-typesafe-mcp.html (+4ms) 
16:05:34   ├─ /tools/devmortimer-pi-warden.html (+3ms) 
16:05:34   ├─ /tools/superagents-lab-jev-search.html (+4ms) 
16:05:34   ├─ /tools/dicklesworthstone-skillranker.html (+4ms) 
16:05:34   ├─ /tools/mrnugget-jev-shell-history.html (+5ms) 
16:05:34   ├─ /tools/0xnatoshi-jev-codex-router.html (+4ms) 
16:05:34   ├─ /tools/wundercorp-loki.html (+4ms) 
16:05:34   ├─ /tools/jexp-neo4jev.html (+4ms) 
16:05:34   ├─ /tools/compozy-yoshi.html (+3ms) 
16:05:34   ├─ /tools/jomatsu-pi-jev-auto-mode.html (+3ms) 
16:05:34   ├─ /tools/blakestone-x-jev-mcp.html (+4ms) 
16:05:34   ├─ /tools/danrwilloughby-snifftest.html (+4ms) 
16:05:34   ├─ /tools/decrux9812-typesafe-skill-router.html (+4ms) 
16:05:34   ├─ /tools/arunav25-jev-mcp.html (+4ms) 
16:05:34   ├─ /tools/brainwires-jevwire.html (+4ms) 
16:05:34   ├─ /tools/frostney-clean-code-review.html (+4ms) 
16:05:34   ├─ /tools/keeltrace-hermes-jev.html (+4ms) 
16:05:34   ├─ /tools/anpicasso-hermes-jev-approvals.html (+3ms) 
16:05:34   ├─ /tools/tylerjharden-ailerix.html (+4ms) 
16:05:34   ├─ /tools/leepokai-jev-guard.html (+5ms) 
16:05:34   ├─ /tools/rashedint32-jev-mcp.html (+4ms) 
16:05:34   ├─ /tools/caiovicentino-jev-shield.html (+3ms) 
16:05:34   ├─ /tools/shivampansuriya-jev-skill-gate.html (+3ms) 
16:05:34   ├─ /tools/molis-ai-jev-workbench.html (+3ms) 
16:05:34   ├─ /tools/iamvatsalpatel-tiershift.html (+3ms) 
16:05:34   ├─ /tools/belazy167-typesafe-mod.html (+3ms) 
16:05:34   ├─ /tools/bestagentkits-jev-skillful.html (+3ms) 
16:05:34   ├─ /tools/jev-on-vercel-ai-gateway.html (+5ms) 
16:05:34   ├─ /tools/dommonte-n8n-nodes-typesafe-ai.html (+4ms) 
16:05:34   ├─ /tools/vercel-ai-sdk-provider.html (+3ms) 
16:05:34   ├─ /tools/legacybridge-tech-pi-typesafe-jev.html (+3ms) 
16:05:34   ├─ /tools/aniruddh-krovvidi-switchboard.html (+3ms) 
16:05:34   ├─ /tools/classifier-dev-mcp.html (+4ms) 
16:05:34   ├─ /tools/openrouter-typesafe-jev-1-13.html (+3ms) 
16:05:34   ├─ /tools/cloudflare-workers-ai-typesafe-jev.html (+4ms) 
16:05:34   ├─ /tools/kushwho-jev-codes.html (+4ms) 
16:05:34   ├─ /tools/tanstack-ai-decide.html (+4ms) 
16:05:34   ├─ /tools/iurysza-logview-jev.html (+4ms) 
16:05:34   ├─ /tools/box-jev-incident-triage.html (+4ms) 
16:05:34   ├─ /tools/workday-sana-jev-generative-ui.html (+4ms) 
16:05:34   ├─ /tools/uipath-typesafe-jev-connector.html (+5ms) 
16:05:34   ├─ /tools/motherduck-prompt-jev.html (+4ms) 
16:05:34   ├─ /tools/openbmb-minicpm-ocr-jev.html (+4ms) 
16:05:34   ├─ /tools/mbzuai-oryx-eo-jev.html (+4ms) 
16:05:34   ├─ /tools/kerpopule-hermes-jev-skills.html (+5ms) 
16:05:34   ├─ /tools/kitfunso-hippo-memory.html (+4ms) 
16:05:34   ├─ /tools/juspay-neurolink.html (+6ms) 
16:05:34   ├─ /tools/uehaj-jev-semgrep.html (+4ms) 
16:05:34   ├─ /tools/tamaratran-jev-pruner.html (+4ms) 
16:05:34   ├─ /tools/hyperspaceai-jevcache.html (+4ms) 
16:05:34   ├─ /tools/featherless-simple-jev.html (+4ms) 
16:05:34   ├─ /tools/miuuyy-astra-ares.html (+4ms) 
16:05:34   ├─ /tools/coldteadotai-abide.html (+4ms) 
16:05:34   ├─ /tools/qkal-canny.html (+4ms) 
16:05:34   ├─ /tools/nidhi-singh02-agent-router.html (+4ms) 
16:05:34   ├─ /tools/togethercomputer-tev1.html (+4ms) 
16:05:34   ├─ /tools/jaredpalmer-kev.html (+4ms) 
16:05:34   ├─ /tools/wfzyx-von.html (+5ms) 
16:05:34   ├─ /tools/samuelfaj-distill.html (+4ms) 
16:05:34   ├─ /tools/sutro-sh-jev-align.html (+5ms) 
16:05:34   ├─ /tools/nokia-applied-research-anyjev.html (+4ms) 
16:05:34   ├─ /tools/githubnext-localjev.html (+4ms) 
16:05:34   ├─ /tools/typellm-typellm.html (+4ms) 
16:05:34   ├─ /tools/rizzo-ai-academy-rizzo-flow.html (+5ms) 
16:05:34   ├─ /tools/tianyucodings-jevharness.html (+5ms) 
16:05:34   ├─ /tools/ollaya-dev-ollaya.html (+4ms) 
16:05:34   ├─ /tools/liuziyu77-valen.html (+4ms) 
16:05:34   ├─ /tools/receptron-laya.html (+4ms) 
16:05:34   ├─ /tools/dzhng-jevgrep.html (+5ms) 
16:05:34   ├─ /tools/logan-markewich-jeff.html (+4ms) 
16:05:34   ├─ /tools/mizorewww-laya-coreml.html (+4ms) 
16:05:34   ├─ /tools/alex314618-create-jevrev.html (+4ms) 
16:05:34   ├─ /tools/avinash-jetwani-jevmem.html (+4ms) 
16:05:34   ├─ /tools/hitsz-tmg-jevembed.html (+4ms) 
16:05:34   ├─ /tools/deepopen-com-deepopen.html (+5ms) 
16:05:34   ├─ /tools/qybaihe-mu.html (+5ms) 
16:05:34   ├─ /tools/mode-io-vllm-jev.html (+4ms) 
16:05:34   ├─ /tools/disler-ten-levels-of-jev.html (+4ms) 
16:05:34   ├─ /tools/charlesfeng0314-jev-sees.html (+4ms) 
16:05:34   ├─ /tools/uditakhourii-quicksilver.html (+4ms) 
16:05:34   ├─ /tools/aurorainfra-grev.html (+5ms) 
16:05:34   ├─ /tools/codegirl-007-jevlint.html (+4ms) 
16:05:34   ├─ /tools/junma11-medjev.html (+4ms) 
16:05:34   ├─ /tools/vectifyai-jev-doc-search.html (+4ms) 
16:05:34   ├─ /tools/statelyai-jevspresso.html (+4ms) 
16:05:34   ├─ /tools/tomerglick57-jevstiller.html (+4ms) 
16:05:34   ├─ /tools/raphaelmansuy-edgextract.html (+6ms) 
16:05:34   ├─ /tools/sheltercosmo-jev4pg.html (+5ms) 
16:05:34   ├─ /tools/posthog-jeeves.html (+4ms) 
16:05:34   ├─ /tools/vinilana-jev-gateway.html (+4ms) 
16:05:34   ├─ /tools/tsale-jevline.html (+4ms) 
16:05:34   ├─ /tools/0814wdwd-solo-jev.html (+4ms) 
16:05:34   ├─ /tools/luobosibing2-dsh-jev-plugin.html (+5ms) 
16:05:34   ├─ /tools/yinsongxu-llm2jev.html (+4ms) 
16:05:34   ├─ /tools/dorkitude-webctl.html (+4ms) 
16:05:34   ├─ /tools/mordavid-nucleisniper.html (+3ms) 
16:05:34   ├─ /tools/rayenmlayeh-jevcrawl.html (+4ms) 
16:05:34   ├─ /tools/liqiiiii-jeva.html (+4ms) 
16:05:34   ├─ /tools/feder-cr-jevos.html (+5ms) 
16:05:34   ├─ /tools/mcg-nju-videojev.html (+5ms) 
16:05:34   ├─ /tools/openlayer-ai-jevals.html (+4ms) 
16:05:34   ├─ /tools/deepaleph-jevreel.html (+4ms) 
16:05:34   ├─ /tools/disler-pi-durable-news-agent.html (+5ms) 
16:05:34   ├─ /tools/nandhakishorm-laya.html (+4ms) 
16:05:34   ├─ /tools/cloudflare-clef.html (+5ms) 
16:05:34   ├─ /tools/perplexity-pplx-decider.html (+4ms) 
16:05:34   ├─ /tools/liquidai-d1-3b.html (+4ms) 
16:05:34   ├─ /tools/strands-labs-strands-decider.html (+4ms) 
16:05:34   ├─ /tools/undrgrnd-labs-hunch.html (+4ms) 
16:05:34   ├─ /tools/a2sys-ai-jevfetch.html (+4ms) 
16:05:34   ├─ /your-privacy-choices.html (+4ms) 
16:05:34   ├─ /index.html (+10ms) 
16:05:34 ✓ Completed in 2.13s.

16:05:34 [build] ✓ Completed in 3.12s.
16:05:34 [build] 355 page(s) built in 3.23s
16:05:34 [build] Complete!
Wrote dist/_redirects (630 redirect rules incl. /items hub)
Wrote dist/_routes.json (invoke Pages Functions + middleware on all paths)
Verified dist/index.html present (static homepage at /)
Wrote dist/_headers (36 markdown rules + 2 MFM shell noindex rules)
Meta uniqueness OK across 355 indexable HTML files (356 total HTML). Descriptions are <= 160 characters and do not end in ",." ":." or ";.".
Explore SEO policy checks OK.
verify-not-found-seo: ok
SEO artifacts OK: sitemap index + 4 child maps, 355 URLs (294 detail), catalog 625, redirects 630.
verify-markdown-negotiation: ok
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
```
