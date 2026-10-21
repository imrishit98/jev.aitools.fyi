- This adds IndyDevDan's always-on news filter that runs on a schedule and sorts stories into hype, useful facts, and actionable signal.
- The listing explains how repeated sweeps read dozens of feeds, drop noise, and keep only the top stories worth your attention.
- Readers see real cost numbers from the project's readme, including what the first big sweep costs versus later check-ins.
- The page links to related tools like the Ten Levels of Jev course and other news helpers already on the directory.
- Everything is written for curious non-coders first, with technical sourcing and an FAQ for people evaluating the project.

## Technical details

- **Slug:** `disler-pi-durable-news-agent` (category `agent-tooling`, detail page at `/tools/disler-pi-durable-news-agent`)
- **Source:** [disler/pi-durable-news-agent](https://github.com/disler/pi-durable-news-agent) (MIT, 89 stars on 2026-10-21)
- **Files:** `product-profiles.ts`, `catalog-supplement.json`, `editorial-blurbs.ts`, `public/.well-known/jev-directory.json` (+1 catalog / +1 detail)
- **Related slugs:** disler-ten-levels-of-jev, eliot5566-jev-paper-radar, hyperspaceai-jevcache, superagents-lab-jev-search
- **firstSeen:** 2026-10-21; append-style insert after `feder-cr-jevos` (rebases cleanly vs open PR #111)

## Build proof

`pnpm build` exit code **0**. Detail route generated: `/tools/disler-pi-durable-news-agent.html`.

Local preview (`serve dist`): page renders (screenshot below).

<img alt="Pi Durable News Agent detail page" src="/opt/cursor/artifacts/disler-pi-durable-news-agent-detail.png" />


<details>
<summary>Full `pnpm build` output</summary>

```

> jev-directory@0.1.0 prebuild /workspace
> pnpm run sync:public-fonts && pnpm run generate:og && pnpm run generate:search-index && pnpm run generate:openapi


> jev-directory@0.1.0 sync:public-fonts /workspace
> node scripts/sync-public-fonts.mjs


> jev-directory@0.1.0 generate:og /workspace
> tsx scripts/generate-og-images.ts

Generating Open Graph images…
  listings 50/282
  listings 100/282
  listings 150/282
  listings 200/282
  listings 250/282
  listings 282/282
Done. 302 images in public/og/

> jev-directory@0.1.0 generate:search-index /workspace
> tsx scripts/generate-search-index.ts

Wrote 613 search index entries to public/search-index.json

> jev-directory@0.1.0 generate:openapi /workspace
> node scripts/generate-openapi.mjs

Wrote /workspace/public/openapi.json

> jev-directory@0.1.0 build /workspace
> node scripts/check-meta-length.mjs && node scripts/verify-demo-asset-sizes.mjs --public-only && node scripts/verify-showcase-video-referrer-policy.mjs && node scripts/verify-agent-guide-catalog-links.mjs && astro build && node scripts/write-redirects.mjs && node scripts/write-md-headers.mjs && node scripts/check-meta-uniqueness.mjs && node scripts/verify-explore-seo.mjs && node scripts/verify-not-found-seo.mjs && node scripts/verify-seo-artifacts.mjs && node scripts/verify-markdown-negotiation.mjs && node scripts/verify-demo-asset-sizes.mjs --dist-only

Meta length OK (418 source fields, titles <= 60, descriptions <= 160).
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
Showcase video referrer policy OK (ShowcaseDemoVideo + no raw <video> in card/lightbox).
verify-agent-guide-catalog-links: ok
13:21:55 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [types] Generated 37ms
13:21:55 [build] output: "static"
13:21:55 [build] mode: "static"
13:21:55 [build] directory: /workspace/dist/
13:21:55 [build] Collecting build info...
13:21:55 [build] ✓ Completed in 81ms.
13:21:55 [build] Building static entrypoints...
13:21:55 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] warning: `optimizeDeps.esbuildOptions` option was specified by "vite:react-babel" plugin. This option is deprecated, please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [WARN] [vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions` but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies. Please use `optimizeDeps.rolldownOptions` instead.
13:21:55 [vite] ✓ built in 534ms
13:21:56 [WARN] [vite] [plugin builtin:vite-reporter] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rolldownOptions.output.codeSplitting to improve chunking: https://rolldown.rs/reference/OutputOptions.codeSplitting
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
13:21:56 [vite] ✓ built in 391ms
13:21:56 [build] Rearranging server assets...

 generating static routes 
13:21:56   ├─ /404.html (+39ms) 
13:21:56   ├─ /about.html (+11ms) 
13:21:56   ├─ /alternatives/cloudflare-clef.md (+3ms) 
13:21:56   ├─ /alternatives/kev.md (+2ms) 
13:21:56   ├─ /alternatives/openai-decisions-api.md (+1ms) 
13:21:56   ├─ /alternatives/perplexity-pplx-decider.md (+2ms) 
13:21:56   ├─ /alternatives/mapika-decider.md (+1ms) 
13:21:56   ├─ /alternatives/fastino-gliner-decide.md (+2ms) 
13:21:56   ├─ /alternatives/semif.md (+2ms) 
13:21:56   ├─ /alternatives/clm-8b.md (+1ms) 
13:21:56   ├─ /alternatives/liquid-d1.md (+1ms) 
13:21:56   ├─ /alternatives/von.md (+1ms) 
13:21:56   ├─ /alternatives/cloudflare-clef.html (+11ms) 
13:21:56   ├─ /alternatives/kev.html (+5ms) 
13:21:56   ├─ /alternatives/openai-decisions-api.html (+6ms) 
13:21:56   ├─ /alternatives/perplexity-pplx-decider.html (+5ms) 
13:21:56   ├─ /alternatives/mapika-decider.html (+5ms) 
13:21:56   ├─ /alternatives/fastino-gliner-decide.html (+4ms) 
13:21:56   ├─ /alternatives/semif.html (+6ms) 
13:21:56   ├─ /alternatives/clm-8b.html (+5ms) 
13:21:56   ├─ /alternatives/liquid-d1.html (+4ms) 
13:21:56   ├─ /alternatives/von.html (+6ms) 
13:21:56   ├─ /alternatives.html (+5ms) 
13:21:56   ├─ /alternatives.md (+2ms) 
13:21:56   ├─ /apps/browser-use-jev-ultrafast.html (+23ms) 
13:21:56   ├─ /apps/jarrodwatts-jev-trader.html (+11ms) 
13:21:56   ├─ /apps/awlevin-typesafe-computer-use.html (+8ms) 
13:21:56   ├─ /apps/usenotra-notra.html (+6ms) 
13:21:56   ├─ /apps/droidrun-mobile-jev.html (+7ms) 
13:21:56   ├─ /apps/jkudish-jev-browser.html (+5ms) 
13:21:56   ├─ /apps/kitze-unclutter.html (+6ms) 
13:21:56   ├─ /apps/chetaslua-jevmeter.html (+17ms) 
13:21:56   ├─ /apps/realzachi-typesafe-adblock.html (+10ms) 
13:21:56   ├─ /apps/wy-coliney-jev-browser-use.html (+58ms) 
13:21:56   ├─ /apps/moritzkremb-jev-voice-browser.html (+7ms) 
13:21:56   ├─ /apps/brainstormity-jev-moderation-bot.html (+5ms) 
13:21:56   ├─ /apps/ellipsis-dev-blink.html (+7ms) 
13:21:56   ├─ /apps/monteduro-killmyidea.html (+7ms) 
13:21:56   ├─ /apps/bunsdev-typesafe-ai-playground.html (+5ms) 
13:21:56   ├─ /apps/abovecolin-ha-jev.html (+9ms) 
13:21:56   ├─ /apps/arielweinberger-jev-autopilot.html (+5ms) 
13:21:56   ├─ /apps/ranjan2829-askjev.html (+6ms) 
13:21:56   ├─ /apps/sufianetaouil-every.html (+5ms) 
13:21:56   ├─ /apps/reachjalil-jev-tree.html (+5ms) 
13:21:56   ├─ /apps/hellogumbo-should-ai-kill-us-all.html (+5ms) 
13:21:56   ├─ /apps/nickthompson480-typesafe-ai-playground.html (+5ms) 
13:21:56   ├─ /apps/jackalope-dev-jackalope.html (+7ms) 
13:21:56   ├─ /apps/bunsdev-clarity-judge.html (+5ms) 
13:21:56   ├─ /apps/tanaypadar-gpt-vs-jev.html (+5ms) 
13:21:56   ├─ /apps/joevidev-ui-generator-instinct-jev.html (+5ms) 
13:21:56   ├─ /apps/little-planet-labs-jev-playground.html (+5ms) 
13:21:56   ├─ /apps/eriestra-browser-use-olympics.html (+5ms) 
13:21:56   ├─ /apps/krw82-jev-playwright-mcp.html (+5ms) 
13:21:56   ├─ /apps/coriew-jevtest.html (+7ms) 
13:21:56   ├─ /apps/marissafamularo-citation-verifier.html (+5ms) 
13:21:56   ├─ /apps/dmx-to.html (+5ms) 
13:21:56   ├─ /apps/jev-classifier.html (+5ms) 
13:21:56   ├─ /apps/charlyhno-eng-jev-document-classification.html (+5ms) 
13:21:56   ├─ /apps/0xarx-jevegis.html (+5ms) 
13:21:56   ├─ /apps/hemanth-pkg-gate.html (+8ms) 
13:21:56   ├─ /apps/cpaczek-s1s.html (+5ms) 
13:21:56   ├─ /apps/cbetz-extremely-specific-council.html (+5ms) 
13:21:56   ├─ /apps/asfarsadewa-human-compiler.html (+5ms) 
13:21:56   ├─ /apps/narulaskaran-jev-data-questions.html (+5ms) 
13:21:56   ├─ /apps/wustep-jev-playground.html (+5ms) 
13:21:56   ├─ /apps/ndolinschi-jevplay.html (+5ms) 
13:21:56   ├─ /apps/wesecureyou-jev-test.html (+7ms) 
13:21:56   ├─ /apps/jordiparracrespo-typesafe-ai-trading-showcase.html (+5ms) 
13:21:56   ├─ /apps/shifros-search-function-test.html (+5ms) 
13:21:56   ├─ /apps/yes-no.html (+4ms) 
13:21:56   ├─ /apps/classifier-dev.html (+6ms) 
13:21:56   ├─ /apps/ploy-ai.html (+6ms) 
13:21:56   ├─ /apps/dub-co.html (+7ms) 
13:21:56   ├─ /apps/avec-ai.html (+6ms) 
13:21:56   ├─ /apps/pixelml-com.html (+6ms) 
13:21:56   ├─ /apps/hypit-ai.html (+5ms) 
13:21:56   ├─ /apps/egghead-smart-procurement.html (+5ms) 
13:21:56   ├─ /apps/docjev.html (+7ms) 
13:21:56   ├─ /apps/socai-io-jev-social.html (+6ms) 
13:21:56   ├─ /apps/mfm-jev-search.html (+6ms) 
13:21:56   ├─ /apps/kylejeong-jev-as-judge.html (+6ms) 
13:21:56   ├─ /apps/carolmonroe-jevrls.html (+6ms) 
13:21:56   ├─ /apps/virlo-ai.html (+8ms) 
13:21:56   ├─ /apps/stealads-ai.html (+5ms) 
13:21:56   ├─ /apps/lahfir-agent-desktop.html (+5ms) 
13:21:56   ├─ /apps/nutlope-1kpapers.html (+6ms) 
13:21:56   ├─ /apps/kraayenjon-ai-slop-detector.html (+7ms) 
13:21:56   ├─ /apps/robj3d3-superx-post-scoring.html (+7ms) 
13:21:56   ├─ /apps/nailthy62-drape-virtual-try-on.html (+6ms) 
13:21:56   ├─ /apps/trungdq88-youtube-sponsor-detection.html (+6ms) 
13:21:56   ├─ /apps/iannuttall-internal-links.html (+6ms) 
13:21:56   ├─ /apps/sdras-jev-webmcp-extension.html (+5ms) 
13:21:56   ├─ /apps/jev-chat-jev-chat-jarvis.html (+7ms) 
13:21:56   ├─ /apps/sac-y-jev-cu.html (+5ms) 
13:21:56   ├─ /apps/anishfn-shapeshift.html (+6ms) 
13:21:56   ├─ /apps/milind-soni-tiptour-macos.html (+5ms) 
13:21:57   ├─ /apps/jev-chat-jev-chat-windows.html (+6ms) 
13:21:57   ├─ /apps/openbyteinc-quantdinger.html (+7ms) 
13:21:57   ├─ /apps/agricidaniel-jev-seo.html (+6ms) 
13:21:57   ├─ /apps/extend-hq-jevbox.html (+6ms) 
13:21:57   ├─ /apps/eliot5566-jev-paper-radar.html (+5ms) 
13:21:57   ├─ /apps/budecosystem-bud-decision-studio.html (+5ms) 
13:21:57   ├─ /apps/shhivv-arc-cua.html (+7ms) 
13:21:57   ├─ /benchmarks/theoleecj-semif.html (+6ms) 
13:21:57   ├─ /benchmarks/vinnylarouge-jevlike.html (+4ms) 
13:21:57   ├─ /benchmarks/iammrduncan-typesafe-ai-benchmark.html (+4ms) 
13:21:57   ├─ /benchmarks/r-ms-mini-jev.html (+6ms) 
13:21:57   ├─ /benchmarks/rorshopping-jev-on-a-laptop.html (+4ms) 
13:21:57   ├─ /benchmarks/olanotolu-jevbetter.html (+6ms) 
13:21:57   ├─ /benchmarks/goodrahstar-jev-column-race.html (+4ms) 
13:21:57   ├─ /benchmarks/kikoncuo-jevfire.html (+4ms) 
13:21:57   ├─ /benchmarks/mahlernim-jev-korean-benchmark.html (+4ms) 
13:21:57   ├─ /benchmarks/aabolfazl-typesafe-local.html (+4ms) 
13:21:57   ├─ /benchmarks/docxology-daf-jev.html (+4ms) 
13:21:57   ├─ /benchmarks/zhuyansen-jev-search-rerank-eval.html (+4ms) 
13:21:57   ├─ /benchmarks/zhengxuyu-litjev.html (+5ms) 
13:21:57   ├─ /benchmarks/heman10x-ngu-verdict-open-jev.html (+5ms) 
13:21:57   ├─ /benchmarks/foadsf-jev-for-engineers.html (+4ms) 
13:21:57   ├─ /benchmarks/monglong0214-jev-gate.html (+4ms) 
13:21:57   ├─ /benchmarks/antoniocoppe-jev-harness.html (+4ms) 
13:21:57   ├─ /benchmarks/akashpriyadarshii-jev-curate.html (+7ms) 
13:21:57   ├─ /benchmarks/anessbelbati-jev-rerank-bench.html (+4ms) 
13:21:57   ├─ /benchmarks/altryne-jevify.html (+6ms) 
13:21:57   ├─ /benchmarks/zsavage8-padflow-jev-evals.html (+5ms) 
13:21:57   ├─ /benchmarks/lab-dados-jev-anotacao-sentencas.html (+4ms) 
13:21:57   ├─ /benchmarks/dnakhoa-jev-deferred-crispification.html (+4ms) 
13:21:57   ├─ /benchmarks/sypherin-jev-trace-classifier.html (+4ms) 
13:21:57   ├─ /benchmarks/myokoym-misereru-slide-jev.html (+4ms) 
13:21:57   ├─ /benchmarks/zefir1990-openjev-experiments.html (+6ms) 
13:21:57   ├─ /benchmarks/parallel-constrained-decoding-qwen2-5-1b-rlcd.html (+6ms) 
13:21:57   ├─ /benchmarks/akash-kamat-system-one-gemma.html (+4ms) 
13:21:57   ├─ /benchmarks/aliceroselia-typesafe-chess-eval.html (+4ms) 
13:21:57   ├─ /benchmarks/tianyucodings-nanojev.html (+6ms) 
13:21:57   ├─ /benchmarks/bespokelabsai-nimble.html (+5ms) 
13:21:57   ├─ /benchmarks/apolinario-decision-index.html (+5ms) 
13:21:57   ├─ /benchmarks/fastino-gliner-decide.html (+6ms) 
13:21:57   ├─ /benchmarks/contrastive-lm-clm-8b.html (+4ms) 
13:21:57   ├─ /categories/official.html (+7ms) 
13:21:57   ├─ /categories/sdks.html (+10ms) 
13:21:57   ├─ /categories/integrations.html (+14ms) 
13:21:57   ├─ /categories/agent-tooling.html (+22ms) 
13:21:57   ├─ /categories/browser-computer-use.html (+12ms) 
13:21:57   ├─ /categories/applications.html (+13ms) 
13:21:57   ├─ /categories/games.html (+13ms) 
13:21:57   ├─ /categories/playgrounds.html (+9ms) 
13:21:57   ├─ /categories/benchmarks.html (+17ms) 
13:21:57   ├─ /categories/guides.html (+11ms) 
13:21:57   ├─ /contact.html (+4ms) 
13:21:57   ├─ /developers.html (+4ms) 
13:21:57   ├─ /explore.html (+36ms) 
13:21:57   ├─ /for-agents.html (+6ms) 
13:21:57   ├─ /games/fhshaik-typesafe-mario.html (+7ms) 
13:21:57   ├─ /games/romanslack-jev-drone.html (+6ms) 
13:21:57   ├─ /games/lukaske-jev-doom-agent.html (+5ms) 
13:21:57   ├─ /games/hollow-creek.html (+4ms) 
13:21:57   ├─ /games/jev-arcade.html (+4ms) 
13:21:57   ├─ /games/icohen007-jev-play-ping-pong.html (+5ms) 
13:21:57   ├─ /games/iammusham-jev-snake.html (+4ms) 
13:21:57   ├─ /games/0x963d-last-exit.html (+4ms) 
13:21:57   ├─ /games/vnmoorthy-siege.html (+4ms) 
13:21:57   ├─ /games/shubhankar-jev-fifa.html (+5ms) 
13:21:57   ├─ /games/enoyola-jev-grand-prix.html (+4ms) 
13:21:57   ├─ /games/muhammadaq1-before-the-fall-jev.html (+4ms) 
13:21:57   ├─ /games/muratcanberber-jev-the-fish-game.html (+5ms) 
13:21:57   ├─ /games/thumay9700-jev-plays.html (+5ms) 
13:21:57   ├─ /games/thisiskp-jevarcade.html (+6ms) 
13:21:57   ├─ /games/marcelpociot-wordshift.html (+5ms) 
13:21:57   ├─ /games/standardagents-jevpilot.html (+5ms) 
13:21:57   ├─ /games/jevdoom-jev-arcade.html (+6ms) 
13:21:57   ├─ /games/christianmat-jev-pokemon.html (+8ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/hermes.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/openclaw.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.md (+2ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/codex-and-opencode.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/langchain-langgraph.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/cline-and-roo.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/github-copilot-agent.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/devin-desktop.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/browser-computer-use.md (+1ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/hermes.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/openclaw.html (+3ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/claude-code-desktop-cowork.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/codex-and-opencode.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/cursor-mcp-and-skills.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/langchain-langgraph.html (+5ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/cline-and-roo.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/github-copilot-agent.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/devin-desktop.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents/browser-computer-use.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents.html (+4ms) 
13:21:57   ├─ /guides/jev-with-ai-agents.md (+2ms) 
13:21:57   ├─ /guides/abdelstark-awesome-typesafe.html (+4ms) 
13:21:57   ├─ /guides/yibie-awesome-jev.html (+5ms) 
13:21:57   ├─ /guides/logicrw-awesome-jev-projects.html (+4ms) 
13:21:57   ├─ /guides/omnijev-awesome-jev.html (+4ms) 
13:21:57   ├─ /guides/ainews-jev-a-system-one-model-that-only-decides.html (+4ms) 
13:21:57   ├─ /guides/jev-plays-minecraft-r-accelerate.html (+4ms) 
13:21:57   ├─ /guides/jev-system-one-models-explained-datacamp.html (+4ms) 
13:21:57   ├─ /guides/one-judge-call-vs-twelve-dimension-scores.html (+4ms) 
13:21:57   ├─ /guides/typed-decisions-not-chat.html (+6ms) 
13:21:57   ├─ /guides/socialwithaayan-ten-jev-repos.html (+4ms) 
13:21:57   ├─ /guides/datawhalechina-jev-cookbook.html (+6ms) 
13:21:57   ├─ /guides/openai-decisions-api.html (+4ms) 
13:21:57   ├─ /guides.html (+4ms) 
13:21:57   ├─ /learn/laya-vs-jev/compare.md (+2ms) 
13:21:57   ├─ /learn/laya-vs-jev/what-is-laya.md (+1ms) 
13:21:57   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.md (+1ms) 
13:21:57   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.md (+1ms) 
13:21:57   ├─ /learn/laya-vs-jev/migration-and-coexistence.md (+1ms) 
13:21:57   ├─ /learn/laya-vs-jev/privacy-and-agents.md (+1ms) 
13:21:57   ├─ /learn/laya-vs-jev/compare.html (+4ms) 
13:21:57   ├─ /learn/laya-vs-jev/what-is-laya.html (+4ms) 
13:21:57   ├─ /learn/laya-vs-jev/laya-mlx-apple-silicon.html (+4ms) 
13:21:57   ├─ /learn/laya-vs-jev/benchmarks-and-fairness.html (+3ms) 
13:21:57   ├─ /learn/laya-vs-jev/migration-and-coexistence.html (+3ms) 
13:21:57   ├─ /learn/laya-vs-jev/privacy-and-agents.html (+3ms) 
13:21:57   ├─ /learn/laya-vs-jev.html (+4ms) 
13:21:57   ├─ /learn/laya-vs-jev.md (+1ms) 
13:21:57   ├─ /learn/jev-typesafe.md (+1ms) 
13:21:57   ├─ /learn/system-one.md (+1ms) 
13:21:57   ├─ /learn/jev-vs-llm-classification.md (+1ms) 
13:21:57   ├─ /learn/vercel-ai-gateway.md (+0ms) 
13:21:57   ├─ /learn/where-to-run-jev.md (+0ms) 
13:21:57   ├─ /learn/use-cases.md (+0ms) 
13:21:57   ├─ /learn/jev-typesafe.html (+4ms) 
13:21:57   ├─ /learn/system-one.html (+3ms) 
13:21:57   ├─ /learn/jev-vs-llm-classification.html (+3ms) 
13:21:57   ├─ /learn/vercel-ai-gateway.html (+3ms) 
13:21:57   ├─ /learn/where-to-run-jev.html (+4ms) 
13:21:57   ├─ /learn/use-cases.html (+3ms) 
13:21:57   ├─ /learn.html (+4ms) 
13:21:57   ├─ /llms-full.txt (+6ms) 
13:21:57   ├─ /llms.txt (+3ms) 
13:21:57   ├─ /privacy/archive.html (+4ms) 
13:21:57   ├─ /privacy.html (+4ms) 
13:21:57   ├─ /robots.txt (+2ms) 
13:21:57   ├─ /sdks/typesafe-ai-skills.html (+4ms) 
13:21:57   ├─ /sdks/typesafe-ai-typesafe-sdk-js.html (+4ms) 
13:21:57   ├─ /sdks/typesafe-ai-system-one-adapter-python.html (+4ms) 
13:21:57   ├─ /sdks/typesafe-ai-typesafe-sdk-python.html (+4ms) 
13:21:57   ├─ /sdks/jomatsu-zod-jev.html (+4ms) 
13:21:57   ├─ /sdks/saibimajdi-typesafeai-dotnet-sdk.html (+4ms) 
13:21:57   ├─ /sdks/inanna-malick-jev-dsl.html (+6ms) 
13:21:57   ├─ /sdks/mateonunez-jod.html (+5ms) 
13:21:57   ├─ /sdks/nshkrdotcom-typesafe-sdk.html (+4ms) 
13:21:57   ├─ /sdks/gaurav-gosain-jev-go.html (+4ms) 
13:21:57   ├─ /sdks/abovecolin-jevclient.html (+4ms) 
13:21:57   ├─ /sdks/documentation.html (+4ms) 
13:21:57   ├─ /sdks/quick-start.html (+4ms) 
13:21:57   ├─ /sdks/playground.html (+6ms) 
13:21:57   ├─ /sdks/http-api-reference.html (+4ms) 
13:21:57   ├─ /sdks/primitives.html (+4ms) 
13:21:57   ├─ /sdks/patterns.html (+4ms) 
13:21:57   ├─ /sdks/cookbooks.html (+4ms) 
13:21:57   ├─ /sdks/smart-home-demo.html (+4ms) 
13:21:57   ├─ /sdks/workflow-evals.html (+4ms) 
13:21:57   ├─ /sdks/introducing-system-one-models-and-jev.html (+5ms) 
13:21:57   ├─ /sdks/valksor-typesafe-sdk-go.html (+4ms) 
13:21:57   ├─ /sdks/valksor-typesafe-sdk-php.html (+4ms) 
13:21:57   ├─ /sdks/classifier-dev-cli.html (+4ms) 
13:21:57   ├─ /sdks/pypi-jev-cli.html (+5ms) 
13:21:57   ├─ /sdks/langchain-ai-langchain-typesafe.html (+5ms) 
13:21:57   ├─ /sdks/peterfriese-system-one-foundation-models.html (+6ms) 
13:21:57   ├─ /showcase.html (+28ms) 
13:21:57   ├─ /sitemap-guides.xml (+3ms) 
13:21:57   ├─ /sitemap-learn.xml (+2ms) 
13:21:57   ├─ /sitemap-listings.xml (+3ms) 
13:21:57   ├─ /sitemap-static.xml (+2ms) 
13:21:57   ├─ /sitemap.xml (+3ms) 
13:21:57   ├─ /submit.html (+5ms) 
13:21:57   ├─ /terms.html (+5ms) 
13:21:57   ├─ /tools/vercel-eve.html (+5ms) 
13:21:57   ├─ /tools/tamaratran-fast-jev-compaction.html (+5ms) 
13:21:57   ├─ /tools/vercel-labs-ai-cli.html (+4ms) 
13:21:57   ├─ /tools/thruwire-foreman.html (+6ms) 
13:21:57   ├─ /tools/devagrawal09-jev-review.html (+5ms) 
13:21:57   ├─ /tools/realzachi-pg-jev.html (+8ms) 
13:21:57   ├─ /tools/y0usaf-pi-jev.html (+5ms) 
13:21:57   ├─ /tools/gargpratyush-jev-router.html (+4ms) 
13:21:57   ├─ /tools/niazmorshed2007-jev-review.html (+4ms) 
13:21:57   ├─ /tools/mapika-decider.html (+5ms) 
13:21:57   ├─ /tools/dbreunig-building-with-jev-skill.html (+4ms) 
13:21:57   ├─ /tools/jkudish-jev-mcp.html (+6ms) 
13:21:57   ├─ /tools/itsmostafa-typesafe-mcp.html (+4ms) 
13:21:57   ├─ /tools/devmortimer-pi-warden.html (+3ms) 
13:21:57   ├─ /tools/superagents-lab-jev-search.html (+4ms) 
13:21:57   ├─ /tools/dicklesworthstone-skillranker.html (+4ms) 
13:21:57   ├─ /tools/mrnugget-jev-shell-history.html (+4ms) 
13:21:57   ├─ /tools/0xnatoshi-jev-codex-router.html (+5ms) 
13:21:57   ├─ /tools/wundercorp-loki.html (+5ms) 
13:21:57   ├─ /tools/jexp-neo4jev.html (+4ms) 
13:21:57   ├─ /tools/compozy-yoshi.html (+4ms) 
13:21:57   ├─ /tools/jomatsu-pi-jev-auto-mode.html (+4ms) 
13:21:57   ├─ /tools/blakestone-x-jev-mcp.html (+4ms) 
13:21:57   ├─ /tools/danrwilloughby-snifftest.html (+4ms) 
13:21:57   ├─ /tools/decrux9812-typesafe-skill-router.html (+6ms) 
13:21:57   ├─ /tools/arunav25-jev-mcp.html (+4ms) 
13:21:57   ├─ /tools/brainwires-jevwire.html (+4ms) 
13:21:57   ├─ /tools/frostney-clean-code-review.html (+4ms) 
13:21:57   ├─ /tools/keeltrace-hermes-jev.html (+4ms) 
13:21:57   ├─ /tools/anpicasso-hermes-jev-approvals.html (+4ms) 
13:21:57   ├─ /tools/tylerjharden-ailerix.html (+4ms) 
13:21:57   ├─ /tools/leepokai-jev-guard.html (+5ms) 
13:21:57   ├─ /tools/rashedint32-jev-mcp.html (+4ms) 
13:21:57   ├─ /tools/caiovicentino-jev-shield.html (+4ms) 
13:21:57   ├─ /tools/shivampansuriya-jev-skill-gate.html (+4ms) 
13:21:58   ├─ /tools/molis-ai-jev-workbench.html (+4ms) 
13:21:58   ├─ /tools/iamvatsalpatel-tiershift.html (+4ms) 
13:21:58   ├─ /tools/belazy167-typesafe-mod.html (+4ms) 
13:21:58   ├─ /tools/bestagentkits-jev-skillful.html (+5ms) 
13:21:58   ├─ /tools/jev-on-vercel-ai-gateway.html (+4ms) 
13:21:58   ├─ /tools/dommonte-n8n-nodes-typesafe-ai.html (+4ms) 
13:21:58   ├─ /tools/vercel-ai-sdk-provider.html (+4ms) 
13:21:58   ├─ /tools/legacybridge-tech-pi-typesafe-jev.html (+4ms) 
13:21:58   ├─ /tools/aniruddh-krovvidi-switchboard.html (+4ms) 
13:21:58   ├─ /tools/classifier-dev-mcp.html (+4ms) 
13:21:58   ├─ /tools/openrouter-typesafe-jev-1-13.html (+6ms) 
13:21:58   ├─ /tools/cloudflare-workers-ai-typesafe-jev.html (+5ms) 
13:21:58   ├─ /tools/kushwho-jev-codes.html (+5ms) 
13:21:58   ├─ /tools/tanstack-ai-decide.html (+5ms) 
13:21:58   ├─ /tools/iurysza-logview-jev.html (+5ms) 
13:21:58   ├─ /tools/box-jev-incident-triage.html (+5ms) 
13:21:58   ├─ /tools/kerpopule-hermes-jev-skills.html (+6ms) 
13:21:58   ├─ /tools/kitfunso-hippo-memory.html (+5ms) 
13:21:58   ├─ /tools/juspay-neurolink.html (+5ms) 
13:21:58   ├─ /tools/uehaj-jev-semgrep.html (+5ms) 
13:21:58   ├─ /tools/tamaratran-jev-pruner.html (+4ms) 
13:21:58   ├─ /tools/hyperspaceai-jevcache.html (+5ms) 
13:21:58   ├─ /tools/featherless-simple-jev.html (+5ms) 
13:21:58   ├─ /tools/miuuyy-astra-ares.html (+5ms) 
13:21:58   ├─ /tools/coldteadotai-abide.html (+4ms) 
13:21:58   ├─ /tools/qkal-canny.html (+4ms) 
13:21:58   ├─ /tools/nidhi-singh02-agent-router.html (+5ms) 
13:21:58   ├─ /tools/togethercomputer-tev1.html (+4ms) 
13:21:58   ├─ /tools/jaredpalmer-kev.html (+5ms) 
13:21:58   ├─ /tools/wfzyx-von.html (+4ms) 
13:21:58   ├─ /tools/samuelfaj-distill.html (+4ms) 
13:21:58   ├─ /tools/sutro-sh-jev-align.html (+6ms) 
13:21:58   ├─ /tools/nokia-applied-research-anyjev.html (+4ms) 
13:21:58   ├─ /tools/githubnext-localjev.html (+4ms) 
13:21:58   ├─ /tools/typellm-typellm.html (+4ms) 
13:21:58   ├─ /tools/rizzo-ai-academy-rizzo-flow.html (+4ms) 
13:21:58   ├─ /tools/tianyucodings-jevharness.html (+6ms) 
13:21:58   ├─ /tools/ollaya-dev-ollaya.html (+5ms) 
13:21:58   ├─ /tools/liuziyu77-valen.html (+4ms) 
13:21:58   ├─ /tools/receptron-laya.html (+4ms) 
13:21:58   ├─ /tools/dzhng-jevgrep.html (+4ms) 
13:21:58   ├─ /tools/logan-markewich-jeff.html (+5ms) 
13:21:58   ├─ /tools/mizorewww-laya-coreml.html (+4ms) 
13:21:58   ├─ /tools/alex314618-create-jevrev.html (+4ms) 
13:21:58   ├─ /tools/avinash-jetwani-jevmem.html (+4ms) 
13:21:58   ├─ /tools/hitsz-tmg-jevembed.html (+5ms) 
13:21:58   ├─ /tools/deepopen-com-deepopen.html (+5ms) 
13:21:58   ├─ /tools/qybaihe-mu.html (+4ms) 
13:21:58   ├─ /tools/mode-io-vllm-jev.html (+4ms) 
13:21:58   ├─ /tools/disler-ten-levels-of-jev.html (+4ms) 
13:21:58   ├─ /tools/charlesfeng0314-jev-sees.html (+4ms) 
13:21:58   ├─ /tools/uditakhourii-quicksilver.html (+6ms) 
13:21:58   ├─ /tools/aurorainfra-grev.html (+4ms) 
13:21:58   ├─ /tools/codegirl-007-jevlint.html (+4ms) 
13:21:58   ├─ /tools/junma11-medjev.html (+4ms) 
13:21:58   ├─ /tools/vectifyai-jev-doc-search.html (+4ms) 
13:21:58   ├─ /tools/statelyai-jevspresso.html (+4ms) 
13:21:58   ├─ /tools/tomerglick57-jevstiller.html (+6ms) 
13:21:58   ├─ /tools/raphaelmansuy-edgextract.html (+5ms) 
13:21:58   ├─ /tools/sheltercosmo-jev4pg.html (+4ms) 
13:21:58   ├─ /tools/posthog-jeeves.html (+4ms) 
13:21:58   ├─ /tools/vinilana-jev-gateway.html (+4ms) 
13:21:58   ├─ /tools/tsale-jevline.html (+6ms) 
13:21:58   ├─ /tools/0814wdwd-solo-jev.html (+4ms) 
13:21:58   ├─ /tools/luobosibing2-dsh-jev-plugin.html (+4ms) 
13:21:58   ├─ /tools/yinsongxu-llm2jev.html (+4ms) 
13:21:58   ├─ /tools/dorkitude-webctl.html (+4ms) 
13:21:58   ├─ /tools/mordavid-nucleisniper.html (+4ms) 
13:21:58   ├─ /tools/rayenmlayeh-jevcrawl.html (+5ms) 
13:21:58   ├─ /tools/liqiiiii-jeva.html (+5ms) 
13:21:58   ├─ /tools/feder-cr-jevos.html (+4ms) 
13:21:58   ├─ /tools/disler-pi-durable-news-agent.html (+4ms) 
13:21:58   ├─ /tools/nandhakishorm-laya.html (+4ms) 
13:21:58   ├─ /tools/cloudflare-clef.html (+4ms) 
13:21:58   ├─ /tools/perplexity-pplx-decider.html (+6ms) 
13:21:58   ├─ /tools/liquidai-d1-3b.html (+4ms) 
13:21:58   ├─ /your-privacy-choices.html (+4ms) 
13:21:58   ├─ /index.html (+9ms) 
13:21:58 ✓ Completed in 2.23s.

13:21:58 [build] ✓ Completed in 3.20s.
13:21:58 [build] 342 page(s) built in 3.30s
13:21:58 [build] Complete!
Wrote dist/_redirects (618 redirect rules incl. /items hub)
Wrote dist/_routes.json (invoke Pages Functions + middleware on all paths)
Verified dist/index.html present (static homepage at /)
Wrote dist/_headers (35 markdown rules + 2 MFM shell noindex rules)
Meta uniqueness OK across 342 indexable HTML files (343 total HTML).
Explore SEO policy checks OK.
verify-not-found-seo: ok
SEO artifacts OK: sitemap index + 4 child maps, 342 URLs (282 detail), catalog 613, redirects 618.
verify-markdown-negotiation: ok
Demo assets OK (no video binaries under public/dist; nothing over 25 MiB under demos).
```

</details>
