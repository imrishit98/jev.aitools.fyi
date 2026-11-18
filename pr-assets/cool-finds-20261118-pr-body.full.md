- Students and new graduates hunting software roles can read how jev-job-search uses quick decisions to map form fields while a separate writer handles open answers, with every value read back from the browser before anything is sent.
- The same page explains which job boards are in scope today, what the tool refuses to do for you (signatures, captchas, passwords shown to models), and maintainer-reported cost notes clearly labeled as their experience, not independent directory tests.
- Builders of talking assistants get a full profile for Jev-Interaction: speech in, fast turn-taking decisions, any voice and language model out, with a public demo link and logged choices you can replay.
- That voice profile quotes vendor-published benchmark tables honestly, including places realtime models are still faster and where this stack leads on answer relevance and treating natural pauses.
- The public directory counts now list two more tools detail pages so explore, search, and partner manifests stay aligned.

SEO/LLM impact: New answer-first tool pages with dated facts, maintainer versus vendor attribution, FAQs, and cross-links should improve retrieval for open-source job autofill and full-duplex voice turn-taking intents while reducing conflation with resume scoring or generic browser agents.

**Technical details**

- Published profiles `qbeka-jev-job-search` and `native-bond-lab-jev-interaction` in `src/data/product-profiles.ts` (`firstSeen: 2026-11-18`).
- Catalog supplement rows in `src/data/catalog-supplement.json`; editorial blurbs in `src/data/editorial-blurbs.ts`.
- GitHub star rows in `src/data/alternatives-metrics.json` (snapshot date unchanged).
- `src/data/lastmod-manifest.json` bumps for `/tools/qbeka-jev-job-search` and `/tools/native-bond-lab-jev-interaction`.
- `public/.well-known/jev-directory.json` catalog 631, detail pages 299.
- Cross-links: job search to `awun8191-jev-resume-analyzer`, `agent-labs-dev-fastbrowse`, browser agents; interaction to `moritzkremb-jev-voice-browser`, `santos-sanz-jev-audio-beeper`.

**Build proof (`pnpm lint`, `pnpm build`, full log)**

```

> jev-directory@0.1.0 prebuild /agent/repos/jev.aitools.fyi
> pnpm run sync:public-fonts && pnpm run generate:og && pnpm run generate:search-index && pnpm run generate:openapi


> jev-directory@0.1.0 sync:public-fonts /agent/repos/jev.aitools.fyi
> node scripts/sync-public-fonts.mjs


> jev-directory@0.1.0 generate:og /agent/repos/jev.aitools.fyi
> tsx scripts/generate-og-images.ts

Generating Open Graph images…
  listings 50/299
  listings 100/299
  listings 150/299
  listings 200/299
  listings 250/299
  listings 299/299
Done. 319 images in public/og/

> jev-directory@0.1.0 generate:search-index /agent/repos/jev.aitools.fyi
> tsx scripts/generate-search-index.ts

Wrote 631 search index entries to public/search-index.json

> jev-directory@0.1.0 generate:openapi /agent/repos/jev.aitools.fyi
> node scripts/generate-openapi.mjs

Wrote /agent/repos/jev.aitools.fyi/public/openapi.json

> jev-directory@0.1.0 build /agent/repos/jev.aitools.fyi
> node scripts/lastmod-manifest.mjs --check && node scripts/check-meta-length.mjs && node scripts/verify-demo-asset-sizes.mjs --public-only && node scripts/verify-showcase-video-referrer-policy.mjs && node scripts/verify-agent-guide-catalog-links.mjs && astro build && node scripts/write-redirects.mjs && node scripts/write-md-headers.mjs && node scripts/check-meta-uniqueness.mjs && node scripts/verify-explore-seo.mjs && node scripts/verify-not-found-seo.mjs && node scripts/verify-seo-artifacts.mjs && node scripts/verify-markdown-negotiation.mjs && node scripts/verify-demo-asset-sizes.mjs --dist-only

lastmod manifest OK: 361 URLs
Meta length OK (472 source fields, titles <= 60, descriptions <= 160).
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
Showcase video referrer policy OK (ShowcaseDemoVideo + no raw <video> in card/lightbox).
verify-agent-guide-catalog-links: ok
14:24:19 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:24:19 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [types] Generated 34ms
14:24:19 [build] output: "static"
14:24:19 [build] mode: "static"
14:24:19 [build] directory: /agent/repos/jev.aitools.fyi/dist/
14:24:19 [build] Collecting build info...
14:24:19 [build] ✓ Completed in 81ms.
14:24:19 [build] Building static entrypoints...
14:24:19 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:24:19 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:24:19 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:24:19 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:24:19 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] warning: `esbuild` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `oxc` instead.
14:24:19 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
14:24:19 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
14:24:20 [vite] ✓ built in 488ms
14:24:20 [WARN] [vite] [plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
14:24:20 [vite] ✓ built in 354ms
14:24:20 [build] Rearranging server assets...

 generating static routes 
14:24:20   ├─ /404.html (+31ms) 
14:24:21   ├─ /about.html (+10ms) 
14:24:21   ├─ /alternatives/cloudflare-clef.md (+3ms) 
14:24:21   ├─ /alternatives/kev.md (+1ms) 
14:24:21   ├─ /alternatives/openai-decisions-api.md (+2ms) 
14:24:21   ├─ /alternatives/perplexity-pplx-decider.md (+1ms) 
14:24:21   ├─ /alternatives/mapika-decider.md (+2ms) 
14:24:21   ├─ /alternatives/strands-decider.md (+2ms) 
14:24:21   ├─ /alternatives/vev.md (+3ms) 
14:24:21   ├─ /alternatives/fastino-gliner-decide.md (+1ms) 
14:24:21   ├─ /alternatives/semif.md (+1ms) 
14:24:21   ├─ /alternatives/clm-8b.md (+1ms) 
14:24:21   ├─ /alternatives/liquid-d1.md (+1ms) 
14:24:21   ├─ /alternatives/von.md (+1ms) 
14:24:21   ├─ /alternatives/cloudflare-clef.html (+7ms) 
14:24:21   ├─ /alternatives/kev.html (+5ms) 
14:24:21   ├─ /alternatives/openai-decisions-api.html (+5ms) 
14:24:21   ├─ /alternatives/perplexity-pplx-decider.html (+4ms) 
14:24:21   ├─ /alternatives/mapika-decider.html (+4ms) 
14:24:21   ├─ /alternatives/strands-decider.html (+5ms) 
14:24:21   ├─ /alternatives/vev.html (+5ms) 
14:24:21   ├─ /alternatives/fastino-gliner-decide.html (+18ms) 
14:24:21   ├─ /alternatives/semif.html (+53ms) 
14:24:21   ├─ /alternatives/clm-8b.html (+5ms) 
14:24:21   ├─ /alternatives/liquid-d1.html (+4ms) 
14:24:21   ├─ /alternatives/von.html (+4ms) 
14:24:21   ├─ /alternatives.html (+5ms) 
14:24:21   ├─ /alternatives.md (+2ms) 
14:24:21   ├─ /apps/browser-use-jev-ultrafast.html (+22ms) 
14:24:21   ├─ /apps/jarrodwatts-jev-trader.html (+7ms) 
14:24:21   ├─ /apps/awlevin-typesafe-computer-use.html (+7ms) 
14:24:21   ├─ /apps/usenotra-notra.html (+5ms) 
14:24:21   ├─ /apps/droidrun-mobile-jev.html (+6ms) 
14:24:21   ├─ /apps/jkudish-jev-browser.html (+6ms) 
14:24:21   ├─ /apps/kitze-unclutter.html (+5ms) 
14:24:21   ├─ /apps/chetaslua-jevmeter.html (+6ms) 
14:24:21   ├─ /apps/realzachi-typesafe-adblock.html (+5ms) 
14:24:21   ├─ /apps/wy-coliney-jev-browser-use.html (+6ms) 
14:24:21   ├─ /apps/moritzkremb-jev-voice-browser.html (+7ms) 
14:24:21   ├─ /apps/brainstormity-jev-moderation-bot.html (+6ms) 
14:24:21   ├─ /apps/ellipsis-dev-blink.html (+5ms) 
14:24:21   ├─ /apps/monteduro-killmyidea.html (+6ms) 
14:24:21   ├─ /apps/bunsdev-typesafe-ai-playground.html (+5ms) 
14:24:21   ├─ /apps/abovecolin-ha-jev.html (+6ms) 
14:24:21   ├─ /apps/arielweinberger-jev-autopilot.html (+4ms) 
14:24:21   ├─ /apps/ranjan2829-askjev.html (+5ms) 
14:24:21   ├─ /apps/sufianetaouil-every.html (+4ms) 
14:24:21   ├─ /apps/reachjalil-jev-tree.html (+4ms) 
14:24:21   ├─ /apps/hellogumbo-should-ai-kill-us-all.html (+4ms) 
14:24:21   ├─ /apps/nickthompson480-typesafe-ai-playground.html (+4ms) 
14:24:21   ├─ /apps/jackalope-dev-jackalope.html (+5ms) 
14:24:21   ├─ /apps/bunsdev-clarity-judge.html (+4ms) 
14:24:21   ├─ /apps/tanaypadar-gpt-vs-jev.html (+6ms) 
14:24:21   ├─ /apps/joevidev-ui-generator-instinct-jev.html (+5ms) 
14:24:21   ├─ /apps/little-planet-labs-jev-playground.html (+4ms) 
14:24:21   ├─ /apps/eriestra-browser-use-olympics.html (+4ms) 
14:24:21   ├─ /apps/krw82-jev-playwright-mcp.html (+4ms) 
14:24:21   ├─ /apps/coriew-jevtest.html (+4ms) 
14:24:21   ├─ /apps/marissafamularo-citation-verifier.html (+5ms) 
14:24:21   ├─ /apps/dmx-to.html (+5ms) 
14:24:21   ├─ /apps/jev-classifier.html (+4ms) 
14:24:21   ├─ /apps/charlyhno-eng-jev-document-classification.html (+4ms) 
14:24:21   ├─ /apps/0xarx-jevegis.html (+4ms) 
14:24:21   ├─ /apps/hemanth-pkg-gate.html (+5ms) 
14:24:21   ├─ /apps/cpaczek-s1s.html (+4ms) 
14:24:21   ├─ /apps/cbetz-extremely-specific-council.html (+4ms) 
14:24:21   ├─ /apps/asfarsadewa-human-compiler.html (+6ms) 
14:24:21   ├─ /apps/narulaskaran-jev-data-questions.html (+5ms) 
14:24:21   ├─ /apps/wustep-jev-playground.html (+5ms) 
14:24:21   ├─ /apps/ndolinschi-jevplay.html (+4ms) 
14:24:21   ├─ /apps/wesecureyou-jev-test.html (+4ms) 
14:24:21   ├─ /apps/jordiparracrespo-typesafe-ai-trading-showcase.html (+4ms) 
14:24:21   ├─ /apps/shifros-search-function-test.html (+4ms) 
14:24:21   ├─ /apps/yes-no.html (+5ms) 
14:24:21   ├─ /apps/classifier-dev.html (+6ms) 
14:24:21   ├─ /apps/ploy-ai.html (+5ms) 
14:24:21   ├─ /apps/dub-co.html (+5ms) 
14:24:21   ├─ /apps/avec-ai.html (+5ms) 
14:24:21   ├─ /apps/pixelml-com.html (+5ms) 
14:24:21   ├─ /apps/hypit-ai.html (+6ms) 
14:24:21   ├─ /apps/egghead-smart-procurement.html (+5ms) 
14:24:21   ├─ /apps/docjev.html (+5ms) 
14:24:21   ├─ /apps/socai-io-jev-social.html (+5ms) 
14:24:21   ├─ /apps/mfm-jev-search.html (+5ms) 
14:24:21   ├─ /apps/kylejeong-jev-as-judge.html (+6ms) 
14:24:21   ├─ /apps/carolmonroe-jevrls.html (+5ms) 
14:24:21   ├─ /apps/virlo-ai.html (+5ms) 
14:24:21   ├─ /apps/stealads-ai.html (+5ms) 
14:24:21   ├─ /apps/lahfir-agent-desktop.html (+4ms) 
14:24:21   ├─ /apps/nutlope-1kpapers.html (+6ms) 
14:24:21   ├─ /apps/kraayenjon-ai-slop-detector.html (+5ms) 
14:24:21   ├─ /apps/robj3d3-superx-post-scoring.html (+5ms) 
14:24:21   ├─ /apps/nailthy62-drape-virtual-try-on.html (+6ms) 
14:24:21   ├─ /apps/trungdq88-youtube-sponsor-detection.html (+5ms) 
14:24:21   ├─ /apps/iannuttall-internal-links.html (+7ms) 
14:24:21   ├─ /apps/sdras-jev-webmcp-extension.html (+5ms) 
14:24:21   ├─ /apps/jev-chat-jev-chat-jarvis.html (+5ms) 
14:24:21   ├─ /apps/sac-y-jev-cu.html (+4ms) 
14:24:21   ├─ /apps/anishfn-shapeshift.html (+5ms) 
14:24:21   ├─ /apps/milind-soni-tiptour-macos.html (+9ms) 
14:24:21   ├─ /apps/jev-chat-jev-chat-windows.html (+5ms) 
14:24:21   ├─ /apps/openbyteinc-quantdinger.html (+7ms) 
14:24:21   ├─ /apps/agricidaniel-jev-seo.html (+6ms) 
14:24:21   ├─ /apps/extend-hq-jevbox.html (+5ms) 
14:24:21   ├─ /apps/eliot5566-jev-paper-radar.html (+6ms) 
14:24:21   ├─ /apps/budecosystem-bud-decision-studio.html (+5ms) 
14:24:21   ├─ /apps/shhivv-arc-cua.html (+4ms) 
14:24:21   ├─ /benchmarks/theoleecj-semif.html (+5ms) 
14:24:21   ├─ /benchmarks/vinnylarouge-jevlike.html (+4ms) 
14:24:21   ├─ /benchmarks/iammrduncan-typesafe-ai-benchmark.html (+5ms) 
14:24:21   ├─ /benchmarks/r-ms-mini-jev.html (+5ms) 
14:24:21   ├─ /benchmarks/rorshopping-jev-on-a-laptop.html (+5ms) 
14:24:21   ├─ /benchmarks/olanotolu-jevbetter.html (+4ms) 
14:24:21   ├─ /benchmarks/goodrahstar-jev-column-race.html (+4ms) 
14:24:21   ├─ /benchmarks/kikoncuo-jevfire.html (+4ms) 
14:24:21   ├─ /benchmarks/mahlernim-jev-korean-benchmark.html (+4ms) 
14:24:21   ├─ /benchmarks/aabolfazl-typesafe-local.html (+4ms) 
14:24:21   ├─ /benchmarks/docxology-daf-jev.html (+5ms) 
14:24:21   ├─ /benchmarks/zhuyansen-jev-search-rerank-eval.html (+4ms) 
14:24:21   ├─ /benchmarks/zhengxuyu-litjev.html (+6ms) 
14:24:21   ├─ /benchmarks/heman10x-ngu-verdict-open-jev.html (+4ms) 
14:24:21   ├─ /benchmarks/foadsf-jev-for-engineers.html (+3ms) 
14:24:21   ├─ /benchmarks/monglong0214-jev-gate.html (+4ms) 
14:24:21   ├─ /benchmarks/antoniocoppe-jev-harness.html (+4ms) 
14:24:21   ├─ /benchmarks/akashpriyadarshii-jev-curate.html (+5ms) 
14:24:21   ├─ /benchmarks/anessbelbati-jev-rerank-bench.html (+4ms) 
14:24:21   ├─ /benchmarks/altryne-jevify.html (+4ms) 
14:24:21   ├─ /benchmarks/zsavage8-padflow-jev-evals.html (+3ms) 
14:24:21   ├─ /benchmarks/lab-dados-jev-anotacao-sentencas.html (+4ms) 
14:24:21   ├─ /benchmarks/dnakhoa-jev-deferred-crispification.html (+4ms) 
14:24:21   ├─ /benchmarks/sypherin-jev-trace-classifier.html (+4ms) 
14:24:21   ├─ /benchmarks/myokoym-misereru-slide-jev.html (+5ms) 
14:24:21   ├─ /benchmarks/zefir1990-openjev-experiments.html (+4ms) 
14:24:21   ├─ /benchmarks/parallel-constrained-decoding-qwen2-5-1b-rlcd.html (+4ms) 
14:24:21   ├─ /benchmarks/akash-kamat-system-one-gemma.html (+4ms) 
14:24:21   ├─ /benchmarks/aliceroselia-typesafe-chess-eval.html (+4ms) 
14:24:21   ├─ /benchmarks/tianyucodings-nanojev.html (+4ms) 
14:24:21   ├─ /benchmarks/bespokelabsai-nimble.html (+5ms) 
14:24:21   ├─ /benchmarks/apolinario-decision-index.html (+4ms) 
14:24:21   ├─ /benchmarks/fastino-gliner-decide.html (+4ms) 
14:24:21   ├─ /benchmarks/contrastive-lm-clm-8b.html (+4ms) 
14:24:21   ├─ /categories/official.html (+6ms) 
14:24:21   ├─ /categories/sdks.html (+10ms) 
14:24:21   ├─ /categories/integrations.html (+12ms) 
14:24:21   ├─ /categories/agent-tooling.html (+23ms) 
14:24:21   ├─ /categories/browser-computer-use.html (+8ms) 
14:24:21   ├─ /categories/applications.html (+13ms) 
14:24:21   ├─ /categories/games.html (+9ms) 
14:24:21   ├─ /categories/playgrounds.html (+10ms) 
14:24:21   ├─ /categories/benchmarks.html (+15ms) 
14:24:21   ├─ /categories/guides.html (+9ms) 
14:24:21   ├─ /contact.html (+3ms) 
14:24:21   ├─ /developers.html (+4ms) 
14:24:21   ├─ /explore.html (+36ms) 
14:24:21   ├─ /for-agents.html (+4ms) 
14:24:21   ├─ /games/fhshaik-typesafe-mario.html (+6ms) 
14:24:21   ├─ /games/romanslack-jev-drone.html (+5ms) 
14:24:21   ├─ /games/lukaske-jev-doom-agent.html (+4ms) 
14:24:21   ├─ /games/hollow-creek.html (+5ms) 
14:24:21   ├─ /games/jev-arcade.html (+4ms) 
14:24:21   ├─ /games/icohen007-jev-play-ping-pong.html (+4ms) 
14:24:21   ├─ /games/iammusham-jev-snake.html (+4ms) 
14:24:21   ├─ /games/0x963d-last-exit.html (+4ms) 
14:24:21   ├─ /games/vnmoorthy-siege.html (+4ms) 
14:24:21   ├─ /games/shubhankar-jev-fifa.html (+5ms) 
14:24:21   ├─ /games/enoyola-jev-grand-prix.html (+6ms) 
14:24:21   ├─ /games/muhammadaq1-before-the-fall-jev.html (+4ms) 
14:24:21   ├─ /games/muratcanberber-jev-the-fish-game.html (+4ms) 
14:24:21   ├─ /games/thumay9700-jev-plays.html (+4ms) 
14:24:21   ├─ /games/thisiskp-jevarcade.html (+4ms) 
14:24:21   ├─ /games/marcelpociot-wordshift.html (+4ms) 
14:24:21   ├─ /games/standardagents-jevpilot.html (+6ms) 
14:24:21   ├─ /games/jevdoom-jev-arcade.html (+4ms) 
14:24:21   ├─ /games/christianmat-jev-pokemon.html (+4ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/hermes.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/openclaw.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/codex-and-opencode.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.md (+0ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/langchain-langgraph.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/cline-and-roo.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/github-copilot-agent.md (+1ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/devin-desktop.md (+0ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/browser-computer-use.md (+0ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/hermes.html (+4ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/openclaw.html (+3ms) 
14:24:21   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/codex-and-opencode.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.html (+4ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/langchain-langgraph.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/cline-and-roo.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/github-copilot-agent.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/devin-desktop.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents/browser-computer-use.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents.html (+3ms) 
14:24:22   ├─ /guides/jev-with-ai-agents.md (+2ms) 
14:24:22   ├─ /guides/abdelstark-awesome-typesafe.html (+4ms) 
14:24:22   ├─ /guides/yibie-awesome-jev.html (+4ms) 
14:24:22   ├─ /guides/logicrw-awesome-jev-projects.html (+4ms) 
14:24:22   ├─ /guides/omnijev-awesome-jev.html (+4ms) 
14:24:22   ├─ /guides/ainews-jev-a-system-one-model-that-only-decides.html (+3ms) 
14:24:22   ├─ /guides/jev-plays-minecraft-r-accelerate.html (+3ms) 
14:24:22   ├─ /guides/jev-system-one-models-explained-datacamp.html (+4ms) 
14:24:22   ├─ /guides/one-judge-call-vs-twelve-dimension-scores.html (+4ms) 
14:24:22   ├─ /guides/typed-decisions-not-chat.html (+3ms) 
14:24:22   ├─ /guides/networkchuck-jev-guide.html (+5ms) 
14:24:22   ├─ /guides/socialwithaayan-ten-jev-repos.html (+4ms) 
14:24:22   ├─ /guides/datawhalechina-jev-cookbook.html (+5ms) 
14:24:22   ├─ /guides/openai-decisions-api.html (+4ms) 
14:24:22   ├─ /guides.html (+4ms) 
14:24:22   ├─ /learn/laya-vs-jev/compare.md (+1ms) 
14:24:22   ├─ /learn/laya-vs-jev/what-is-laya.md (+1ms) 
14:24:22   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.md (+1ms) 
14:24:22   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.md (+1ms) 
14:24:22   ├─ /learn/laya-vs-jev/migration-and-coexistence.md (+1ms) 
14:24:22   ├─ /learn/laya-vs-jev/privacy-and-agents.md (+1ms) 
14:24:22   ├─ /learn/laya-vs-jev/compare.html (+3ms) 
14:24:22   ├─ /learn/laya-vs-jev/what-is-laya.html (+3ms) 
14:24:22   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.html (+3ms) 
14:24:22   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.html (+3ms) 
14:24:22   ├─ /learn/laya-vs-jev/migration-and-coexistence.html (+2ms) 
14:24:22   ├─ /learn/laya-vs-jev/privacy-and-agents.html (+2ms) 
14:24:22   ├─ /learn/laya-vs-jev.html (+4ms) 
14:24:22   ├─ /learn/laya-vs-jev.md (+1ms) 
14:24:22   ├─ /learn/jev-typesafe.md (+1ms) 
14:24:22   ├─ /learn/system-one.md (+0ms) 
14:24:22   ├─ /learn/jev-vs-llm-classification.md (+0ms) 
14:24:22   ├─ /learn/vercel-ai-gateway.md (+0ms) 
14:24:22   ├─ /learn/where-to-run-jev.md (+0ms) 
14:24:22   ├─ /learn/use-cases.md (+0ms) 
14:24:22   ├─ /learn/jev-typesafe.html (+3ms) 
14:24:22   ├─ /learn/system-one.html (+3ms) 
14:24:22   ├─ /learn/jev-vs-llm-classification.html (+2ms) 
14:24:22   ├─ /learn/vercel-ai-gateway.html (+3ms) 
14:24:22   ├─ /learn/where-to-run-jev.html (+3ms) 
14:24:22   ├─ /learn/use-cases.html (+3ms) 
14:24:22   ├─ /learn.html (+4ms) 
14:24:22   ├─ /llms-full.txt (+6ms) 
14:24:22   ├─ /llms.txt (+3ms) 
14:24:22   ├─ /privacy/archive.html (+3ms) 
14:24:22   ├─ /privacy.html (+4ms) 
14:24:22   ├─ /robots.txt (+2ms) 
14:24:22   ├─ /sdks/typesafe-ai-skills.html (+4ms) 
14:24:22   ├─ /sdks/typesafe-ai-typesafe-sdk-js.html (+3ms) 
14:24:22   ├─ /sdks/typesafe-ai-system-one-adapter-python.html (+3ms) 
14:24:22   ├─ /sdks/typesafe-ai-typesafe-sdk-python.html (+4ms) 
14:24:22   ├─ /sdks/jomatsu-zod-jev.html (+4ms) 
14:24:22   ├─ /sdks/saibimajdi-typesafeai-dotnet-sdk.html (+3ms) 
14:24:22   ├─ /sdks/inanna-malick-jev-dsl.html (+3ms) 
14:24:22   ├─ /sdks/mateonunez-jod.html (+5ms) 
14:24:22   ├─ /sdks/nshkrdotcom-typesafe-sdk.html (+4ms) 
14:24:22   ├─ /sdks/gaurav-gosain-jev-go.html (+4ms) 
14:24:22   ├─ /sdks/abovecolin-jevclient.html (+4ms) 
14:24:22   ├─ /sdks/documentation.html (+3ms) 
14:24:22   ├─ /sdks/quick-start.html (+3ms) 
14:24:22   ├─ /sdks/playground.html (+3ms) 
14:24:22   ├─ /sdks/http-api-reference.html (+4ms) 
14:24:22   ├─ /sdks/primitives.html (+4ms) 
14:24:22   ├─ /sdks/patterns.html (+3ms) 
14:24:22   ├─ /sdks/cookbooks.html (+3ms) 
14:24:22   ├─ /sdks/smart-home-demo.html (+3ms) 
14:24:22   ├─ /sdks/workflow-evals.html (+3ms) 
14:24:22   ├─ /sdks/introducing-system-one-models-and-jev.html (+4ms) 
14:24:22   ├─ /sdks/valksor-typesafe-sdk-go.html (+3ms) 
14:24:22   ├─ /sdks/valksor-typesafe-sdk-php.html (+5ms) 
14:24:22   ├─ /sdks/classifier-dev-cli.html (+4ms) 
14:24:22   ├─ /sdks/pypi-jev-cli.html (+3ms) 
14:24:22   ├─ /sdks/langchain-ai-langchain-typesafe.html (+4ms) 
14:24:22   ├─ /sdks/peterfriese-system-one-foundation-models.html (+4ms) 
14:24:22   ├─ /showcase.html (+24ms) 
14:24:22   ├─ /sitemap-guides.xml (+1ms) 
14:24:22   ├─ /sitemap-learn.xml (+3ms) 
14:24:22   ├─ /sitemap-listings.xml (+3ms) 
14:24:22   ├─ /sitemap-static.xml (+1ms) 
14:24:22   ├─ /sitemap.xml (+3ms) 
14:24:22   ├─ /submit.html (+5ms) 
14:24:22   ├─ /terms.html (+3ms) 
14:24:22   ├─ /tools/vercel-eve.html (+4ms) 
14:24:22   ├─ /tools/tamaratran-fast-jev-compaction.html (+5ms) 
14:24:22   ├─ /tools/vercel-labs-ai-cli.html (+4ms) 
14:24:22   ├─ /tools/thruwire-foreman.html (+4ms) 
14:24:22   ├─ /tools/devagrawal09-jev-review.html (+4ms) 
14:24:22   ├─ /tools/realzachi-pg-jev.html (+5ms) 
14:24:22   ├─ /tools/y0usaf-pi-jev.html (+4ms) 
14:24:22   ├─ /tools/gargpratyush-jev-router.html (+6ms) 
14:24:22   ├─ /tools/niazmorshed2007-jev-review.html (+4ms) 
14:24:22   ├─ /tools/mapika-decider.html (+4ms) 
14:24:22   ├─ /tools/dbreunig-building-with-jev-skill.html (+4ms) 
14:24:22   ├─ /tools/jkudish-jev-mcp.html (+4ms) 
14:24:22   ├─ /tools/itsmostafa-typesafe-mcp.html (+3ms) 
14:24:22   ├─ /tools/devmortimer-pi-warden.html (+4ms) 
14:24:22   ├─ /tools/superagents-lab-jev-search.html (+4ms) 
14:24:22   ├─ /tools/dicklesworthstone-skillranker.html (+4ms) 
14:24:22   ├─ /tools/mrnugget-jev-shell-history.html (+4ms) 
14:24:22   ├─ /tools/0xnatoshi-jev-codex-router.html (+3ms) 
14:24:22   ├─ /tools/wundercorp-loki.html (+4ms) 
14:24:22   ├─ /tools/jexp-neo4jev.html (+5ms) 
14:24:22   ├─ /tools/compozy-yoshi.html (+4ms) 
14:24:22   ├─ /tools/jomatsu-pi-jev-auto-mode.html (+3ms) 
14:24:22   ├─ /tools/blakestone-x-jev-mcp.html (+4ms) 
14:24:22   ├─ /tools/danrwilloughby-snifftest.html (+4ms) 
14:24:22   ├─ /tools/decrux9812-typesafe-skill-router.html (+3ms) 
14:24:22   ├─ /tools/arunav25-jev-mcp.html (+3ms) 
14:24:22   ├─ /tools/brainwires-jevwire.html (+4ms) 
14:24:22   ├─ /tools/frostney-clean-code-review.html (+4ms) 
14:24:22   ├─ /tools/keeltrace-hermes-jev.html (+3ms) 
14:24:22   ├─ /tools/anpicasso-hermes-jev-approvals.html (+3ms) 
14:24:22   ├─ /tools/tylerjharden-ailerix.html (+4ms) 
14:24:22   ├─ /tools/leepokai-jev-guard.html (+4ms) 
14:24:22   ├─ /tools/rashedint32-jev-mcp.html (+4ms) 
14:24:22   ├─ /tools/caiovicentino-jev-shield.html (+4ms) 
14:24:22   ├─ /tools/shivampansuriya-jev-skill-gate.html (+4ms) 
14:24:22   ├─ /tools/molis-ai-jev-workbench.html (+3ms) 
14:24:22   ├─ /tools/iamvatsalpatel-tiershift.html (+3ms) 
14:24:22   ├─ /tools/belazy167-typesafe-mod.html (+3ms) 
14:24:22   ├─ /tools/bestagentkits-jev-skillful.html (+3ms) 
14:24:22   ├─ /tools/jev-on-vercel-ai-gateway.html (+3ms) 
14:24:22   ├─ /tools/dommonte-n8n-nodes-typesafe-ai.html (+5ms) 
14:24:22   ├─ /tools/vercel-ai-sdk-provider.html (+4ms) 
14:24:22   ├─ /tools/legacybridge-tech-pi-typesafe-jev.html (+4ms) 
14:24:22   ├─ /tools/aniruddh-krovvidi-switchboard.html (+3ms) 
14:24:22   ├─ /tools/classifier-dev-mcp.html (+4ms) 
14:24:22   ├─ /tools/openrouter-typesafe-jev-1-13.html (+4ms) 
14:24:22   ├─ /tools/cloudflare-workers-ai-typesafe-jev.html (+4ms) 
14:24:22   ├─ /tools/kushwho-jev-codes.html (+5ms) 
14:24:22   ├─ /tools/tanstack-ai-decide.html (+5ms) 
14:24:22   ├─ /tools/iurysza-logview-jev.html (+4ms) 
14:24:22   ├─ /tools/box-jev-incident-triage.html (+4ms) 
14:24:22   ├─ /tools/workday-sana-jev-generative-ui.html (+4ms) 
14:24:22   ├─ /tools/uipath-typesafe-jev-connector.html (+4ms) 
14:24:22   ├─ /tools/motherduck-prompt-jev.html (+5ms) 
14:24:22   ├─ /tools/openbmb-minicpm-ocr-jev.html (+4ms) 
14:24:22   ├─ /tools/mbzuai-oryx-eo-jev.html (+4ms) 
14:24:22   ├─ /tools/kerpopule-hermes-jev-skills.html (+4ms) 
14:24:22   ├─ /tools/kitfunso-hippo-memory.html (+4ms) 
14:24:22   ├─ /tools/juspay-neurolink.html (+6ms) 
14:24:22   ├─ /tools/uehaj-jev-semgrep.html (+4ms) 
14:24:22   ├─ /tools/tamaratran-jev-pruner.html (+4ms) 
14:24:22   ├─ /tools/hyperspaceai-jevcache.html (+4ms) 
14:24:22   ├─ /tools/featherless-simple-jev.html (+4ms) 
14:24:22   ├─ /tools/miuuyy-astra-ares.html (+4ms) 
14:24:22   ├─ /tools/coldteadotai-abide.html (+5ms) 
14:24:22   ├─ /tools/qkal-canny.html (+4ms) 
14:24:22   ├─ /tools/nidhi-singh02-agent-router.html (+4ms) 
14:24:22   ├─ /tools/togethercomputer-tev1.html (+4ms) 
14:24:22   ├─ /tools/jaredpalmer-kev.html (+4ms) 
14:24:22   ├─ /tools/wfzyx-von.html (+5ms) 
14:24:22   ├─ /tools/samuelfaj-distill.html (+4ms) 
14:24:22   ├─ /tools/sutro-sh-jev-align.html (+4ms) 
14:24:22   ├─ /tools/nokia-applied-research-anyjev.html (+4ms) 
14:24:22   ├─ /tools/githubnext-localjev.html (+4ms) 
14:24:22   ├─ /tools/typellm-typellm.html (+4ms) 
14:24:22   ├─ /tools/rizzo-ai-academy-rizzo-flow.html (+5ms) 
14:24:22   ├─ /tools/tianyucodings-jevharness.html (+4ms) 
14:24:22   ├─ /tools/ollaya-dev-ollaya.html (+4ms) 
14:24:22   ├─ /tools/liuziyu77-valen.html (+5ms) 
14:24:22   ├─ /tools/receptron-laya.html (+4ms) 
14:24:22   ├─ /tools/dzhng-jevgrep.html (+5ms) 
14:24:22   ├─ /tools/logan-markewich-jeff.html (+4ms) 
14:24:22   ├─ /tools/mizorewww-laya-coreml.html (+4ms) 
14:24:22   ├─ /tools/alex314618-create-jevrev.html (+4ms) 
14:24:22   ├─ /tools/avinash-jetwani-jevmem.html (+4ms) 
14:24:22   ├─ /tools/hitsz-tmg-jevembed.html (+4ms) 
14:24:22   ├─ /tools/deepopen-com-deepopen.html (+5ms) 
14:24:22   ├─ /tools/qybaihe-mu.html (+4ms) 
14:24:22   ├─ /tools/mode-io-vllm-jev.html (+4ms) 
14:24:22   ├─ /tools/disler-ten-levels-of-jev.html (+4ms) 
14:24:22   ├─ /tools/charlesfeng0314-jev-sees.html (+4ms) 
14:24:22   ├─ /tools/uditakhourii-quicksilver.html (+4ms) 
14:24:22   ├─ /tools/aurorainfra-grev.html (+5ms) 
14:24:22   ├─ /tools/codegirl-007-jevlint.html (+4ms) 
14:24:22   ├─ /tools/junma11-medjev.html (+4ms) 
14:24:22   ├─ /tools/vectifyai-jev-doc-search.html (+4ms) 
14:24:22   ├─ /tools/statelyai-jevspresso.html (+4ms) 
14:24:22   ├─ /tools/tomerglick57-jevstiller.html (+4ms) 
14:24:22   ├─ /tools/raphaelmansuy-edgextract.html (+5ms) 
14:24:22   ├─ /tools/sheltercosmo-jev4pg.html (+4ms) 
14:24:22   ├─ /tools/posthog-jeeves.html (+4ms) 
14:24:22   ├─ /tools/vinilana-jev-gateway.html (+4ms) 
14:24:22   ├─ /tools/tsale-jevline.html (+4ms) 
14:24:22   ├─ /tools/0814wdwd-solo-jev.html (+4ms) 
14:24:22   ├─ /tools/luobosibing2-dsh-jev-plugin.html (+4ms) 
14:24:22   ├─ /tools/yinsongxu-llm2jev.html (+4ms) 
14:24:22   ├─ /tools/dorkitude-webctl.html (+4ms) 
14:24:22   ├─ /tools/mordavid-nucleisniper.html (+4ms) 
14:24:22   ├─ /tools/rayenmlayeh-jevcrawl.html (+4ms) 
14:24:22   ├─ /tools/liqiiiii-jeva.html (+5ms) 
14:24:22   ├─ /tools/feder-cr-jevos.html (+4ms) 
14:24:22   ├─ /tools/mcg-nju-videojev.html (+4ms) 
14:24:22   ├─ /tools/openlayer-ai-jevals.html (+4ms) 
14:24:22   ├─ /tools/deepaleph-jevreel.html (+4ms) 
14:24:22   ├─ /tools/disler-pi-durable-news-agent.html (+5ms) 
14:24:22   ├─ /tools/nandhakishorm-laya.html (+4ms) 
14:24:22   ├─ /tools/cloudflare-clef.html (+4ms) 
14:24:22   ├─ /tools/perplexity-pplx-decider.html (+4ms) 
14:24:22   ├─ /tools/liquidai-d1-3b.html (+5ms) 
14:24:22   ├─ /tools/strands-labs-strands-decider.html (+4ms) 
14:24:22   ├─ /tools/undrgrnd-labs-hunch.html (+5ms) 
14:24:22   ├─ /tools/a2sys-ai-jevfetch.html (+5ms) 
14:24:22   ├─ /tools/mattt-anydecisionmodel.html (+4ms) 
14:24:22   ├─ /tools/omnijev-flide.html (+4ms) 
14:24:22   ├─ /tools/agent-labs-dev-fastbrowse.html (+4ms) 
14:24:22   ├─ /tools/qbeka-jev-job-search.html (+4ms) 
14:24:22   ├─ /tools/native-bond-lab-jev-interaction.html (+5ms) 
14:24:22   ├─ /your-privacy-choices.html (+4ms) 
14:24:22   ├─ /index.html (+8ms) 
14:24:22 ✓ Completed in 2.09s.

14:24:22 [build] ✓ Completed in 2.97s.
14:24:22 [build] 361 page(s) built in 3.07s
14:24:22 [build] Complete!
Wrote dist/_redirects (636 redirect rules incl. /items hub)
Wrote dist/_routes.json (invoke Pages Functions + middleware on all paths)
Verified dist/index.html present (static homepage at /)
Wrote dist/_headers (37 markdown rules + 2 MFM shell noindex rules)
Meta uniqueness OK across 361 indexable HTML files (362 total HTML). Descriptions are <= 160 characters and do not end in ",." ":." or ";.".
Explore SEO policy checks OK.
verify-not-found-seo: ok
SEO artifacts OK: sitemap index + 4 child maps, 361 URLs (299 detail), catalog 631, redirects 636.
verify-markdown-negotiation: ok
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
```

**Screenshots (built site, `pnpm preview`)**

![qbeka-jev-job-search desktop](pr-assets/qbeka-jev-job-search-desktop.png)

![qbeka-jev-job-search mobile](pr-assets/qbeka-jev-job-search-mobile.png)

![native-bond-lab-jev-interaction desktop](pr-assets/native-bond-lab-jev-interaction-desktop.png)

![native-bond-lab-jev-interaction mobile](pr-assets/native-bond-lab-jev-interaction-mobile.png)
