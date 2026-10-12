# Jev alternatives: popularity research

Prepared Oct 11, 2026, 9 PM ET for jev.aitools.fyi (repo imrishit98/jev.aitools.fyi, main at 5f646c3, Oct 10). Research and planning only. Nothing was changed in the repo, posted, or sent.

**Method.** "Alternative" means something a team would use *instead of* hosted TypeSafe Jev to answer Choice / Score / Noul questions. That covers open-weight decision models and hosted decision APIs. Runtimes and wrappers (Ollaya, vLLM-Jev, Bud Decision Studio, laya-coreml) and apps built *on* Jev are left out, because they sit alongside a model rather than replacing it. Each candidate is scored on six signals:

1. **X / Twitter.** 7-day post counts from the X API `counts/recent` endpoint (window Oct 5 00:00 UTC to Oct 12 01:00 UTC, i.e. Oct 4 8 PM to Oct 11 9 PM ET), plus the launch posts with the most engagement. 13 counts/search calls in total (about 15 of the 1,000 daily reads). Nothing was posted.
2. **GitHub.** Stars and forks from the public REST API, pulled live Oct 11, 2026 ~9 PM ET.
3. **Hugging Face.** "Downloads last month" and likes from the public model API, pulled live Oct 11.
4. **Search demand.** Our own GSC export (`/workspace/jev-gsc/oct11/perf.json`, Sep 11 to Oct 8; site data starts Sep 18) plus Google autocomplete (`suggestqueries.google.com`, Oct 11).
5. **Hacker News.** Story points and comment counts from the HN Firebase API.
6. **Third-party "Jev alternatives" roundups**, and whether each candidate appears in them.

X counts are directional only. Query noise varies by name ("WaterSheep" turned out to be mostly an unrelated username, and "openai jev" also catches general comparison chatter), and the window is only 7 days, which favours recent launches.

## Ranked top 10

| # | Alternative | Maker / type | Key evidence (all pulled Oct 11 unless dated) |
|---|---|---|---|
| 1 | **Laya** | Convai Innovations (NandhaKishorM). Open weights, Apache-2.0, 421M/322M encoders | Most-starred repo in the category: **32,351 stars / 2,892 forks** ([GitHub](https://github.com/NandhaKishorM/laya)). HF `convaiinnovations/laya` **44,088 downloads / 5,492 likes** ([HF](https://huggingface.co/convaiinnovations/laya)). X: **358 posts in 7 days**. Two viral "self-hosted Laya" posts reached **114,632** and **53,456** impressions ([1](https://x.com/hanghuang_/status/2105324037903679931), [2](https://x.com/tonychang430/status/2106051650292994255)). Our biggest competitor query cluster: "jev vs laya" and misspellings (leya, lyla, lyra, layla) add up to ~1,100 impressions across our Laya pages, and Google autocomplete suggests "jev vs laya". Every roundup lists it. |
| 2 | **Cloudflare Clef / Clef-flash** (+ Clef-omni) | Cloudflare. Open weights (Apache-2.0, 27B / 9B) **and** hosted on Workers AI, Jev-API compatible | X: **1,469 posts in 7 days**, the highest of any named model. HF clef **14,351 dl / 2,028 likes**, clef-flash **22,123 dl / 756 likes** ([HF](https://huggingface.co/Cloudflare/clef)). HN launch **641 points / 218 comments** ([HN](https://news.ycombinator.com/item?id=49923692)). Also on Ollama. Price $0.24 (Clef) and $0.038 (Clef-flash) per M input tokens, which puts flash below Jev's $0.042 ([CF changelog](https://developers.cloudflare.com/changelog/product/workers-ai/)). |
| 3 | **Kev** | Jared Palmer. Open weights, Apache-2.0, Qwen-based 0.5B to 27B, `/v1/systemone` server | **8,942 stars / 591 forks** ([GitHub](https://github.com/jaredpalmer/kev)). HF kev-4b **21,656 dl**, kev-0.8b **17,660 dl** ([HF](https://huggingface.co/jaredpalmer)). X **132 posts in 7 days**. Kev 27B is **#6 (58.8)** on Decision Index 0.3 ([benchlm mirror](https://benchlm.ai/benchmarks/decisionindex)). HN story ([HN](https://news.ycombinator.com/item?id=49783999)). Our `/tools/jaredpalmer-kev` page had 362 impressions. In 6+ roundups. |
| 4 | **OpenAI Decisions API** | OpenAI. Closed, hosted, `POST /v1/decisions`, gpt-6-luna only, public beta since Oct 6 | Autocomplete's **#1 "jev vs" suggestion is "jev vs openai"**. HN **391 points / 231 comments** ([HN](https://news.ycombinator.com/item?id=49984025)). X **~2,039 posts in 7 days** (noisy query). $0.10 per M input tokens, takes images ([OpenAI docs via Spybara snapshot](https://spybara.com/openai/api/history/docs/en/2026-10-06-2258..2026-10-07-0657/guides/decisions/), [OpenAI community](https://community.openai.com/t/decisions-api-is-now-available-in-public-beta/1403877)). |
| 5 | **Perplexity pplx-decider** (v1.1-27b) | Perplexity. Open weights (Apache-2.0, Qwen3.8-27B) plus hosted API at $0.02 per M input | **#1 on Decision Index 0.3 (62.75, above hosted Jev's 60.11)** ([Decision Index Space](https://huggingface.co/spaces/multimodalart/jev-decision-index), [summary](https://tomrochette.com/agents/hybrid-execution/decision-index/index.md)). HF v1.1 **2,221 dl / 122 likes**, v1 **2,338 / 118**. X **243 posts in 7 days**. Price and announcement: [Perplexity community](https://community.perplexity.ai/t/pplx-decider-v1-1-27b-our-updated-open-weights-multimodal-decision-model-is-now-available/6286/1), [API docs](https://docs.perplexity.ai/api-reference/decisions-post). |
| 6 | **Decider** (Mapika) | Mapika. Open weights, Apache-2.0, Qwen3.5 0.8B/2B/4B (+35B-A3B variants), `decider-ai` on PyPI | **Most-downloaded model in the category: decider-2b 331,532 dl** (plus 4b 26,899 and 0.8b 15,125) ([HF](https://huggingface.co/Mapika/decider-2b)). **1,124 stars** ([GitHub](https://github.com/Mapika/decider)). Featured in the most-shared community ranking, which had **71,211 impressions** ([X](https://x.com/ItsCuthulhu/status/2101491913866055821)). Our `/tools/mapika-decider` page had 214 impressions, and the query "mapika decider" had 9. |
| 7 | **GLiNER2.5-Decide** (Fastino) | Fastino Labs. Open weights, Apache-2.0, 340M encoder, CPU-friendly, plus hosted API | HF **90,464 dl / 404 likes** ([HF](https://huggingface.co/fastino/GLiNER2.5-Decide)). Launch post **162,245 impressions / 1,411 likes** ([X](https://x.com/fastinoAI/status/2103188985292157353)). James Briggs' comparison says the tiny GLiNER models "performed phenomenally" (via [madewithjev](https://madewithjev.com/categories/open-source)). Fastino's larger GLiDE is #2 on Decision Index 0.3 (60.21) but its weights are **not shipped yet**. |
| 8 | **SemIf-OpenJev** | TheoLeeCJ. MIT, reads option logits off open models you host | **4,783 stars / 348 forks** ([GitHub](https://github.com/TheoLeeCJ/SemIf-OpenJev); the old `TheoLeeCJ/SemIf` URL redirects there). #3 in Pinggy's "5 best" ([Pinggy](https://pinggy.io/blog/best_open_source_jev_alternatives_self_hosted_decision_models/)). Used as a comparison baseline in Fastino's launch. X: 67 posts in 7 days (SemIf + OpenJev terms combined). |
| 9 | **CLM-8B** (Contrastive-LM) | Stanford / NVIDIA-affiliated team (per launch coverage). Apache-2.0, Qwen3-8B base | The **single biggest launch post in the category: 1,059,820 impressions / 5,551 likes / 6,828 bookmarks** ([X](https://x.com/jackyk02/status/2102905335925424285)). **2,980 stars** ([GitHub](https://github.com/Contrastive-LM/CLM)). HF **4,367 dl / 764 likes**. Caveat: an independent 400-decision test scored it **41.0%** ([choy.in](https://choy.in/blog/open-source-jev-alternatives)), so the page needs a careful "claims vs independent tests" framing. X dropped to 51 posts in 7 days, which suggests the buzz is fading. |
| 10 | **Liquid d1-3B** | Liquid AI. Open weights under the **LFM 1.0 license (not Apache)**, 3B multimodal | HF **10,843 dl / 300 likes** ([HF](https://huggingface.co/LiquidAI/d1-3B)). Card claims "best decision model under 10B on Decision Index 0.2.1 (48.57)" and 8 ms per decision on an RTX 4090 (vendor claim). In Arize's benchmark headline ([Arize](https://arize.com/blog/decision-model-benchmark/)). Lab-model X query: 781 posts in 7 days (combined d1/Matilda/Intern-Decision/Strands/System1 terms, so not d1 alone). |

### Runners-up (#11 to #16), in case Rishit wants a swap

| Candidate | Evidence |
|---|---|
| **von** (wfzyx) | HF **106,915 dl** ([HF](https://huggingface.co/wfzyx/von)), 883 stars, Apache-2.0. Madewithjev calls it "a sub-15 ms local drop-in alternative". Low social signal. |
| **NanoJev** | **2,529 stars** ([GitHub](https://github.com/TianyuCodings/NanoJev)), MIT, 0.6B. In Pinggy's top 5 and madewithjev's top-starred list. 21 GSC impressions. |
| **AnyJev** (Nokia) | 1,190 stars. Avi Chawla post with 56,050 impressions ([X](https://x.com/_avichawla/status/2103393403207901217)). Our page had 168 impressions. It's a library that turns any LLM into a decision model, not a model itself. |
| **Simple Jev** (Featherless) | 600 stars. #2 in the community ranking above. Our page had 104 impressions. |
| **AutoJev 27B** | Ranked #1 in a community ranking ([X](https://x.com/ItsCuthulhu/status/2102551440904397144)) and 56.4 on Decision Index 0.2.1 per [llmconfigurator](https://llmconfigurator.com/en/guides/decision-models/open-models-beyond-ollama). I could not verify an official repo or card, so it's left out until a primary source is found. |
| **imajev-4b** | Best open model (95.0%) in one independent test ([choy.in](https://choy.in/blog/open-source-jev-alternatives)). Popularity signal not found. |

Also seen but low or unverified: WaterSheep (12 stars; its X "mentions" are almost all self-promotional replies from the author, [example](https://x.com/TheSamratDutta/status/2106016515460039004)), Beam Open Jev Playground ([beam.cloud/playground](https://beam.cloud/playground)), djev (221 stars), Matilda Jev (Maincode), Intern-Decision (Shanghai AI Lab), Strands Decider 2B (AWS), System1 Models (EU hosting), Tev (Together). The last few are named on [madewithjev](https://madewithjev.com/categories/open-source) and [infrabase](https://infrabase.ai/blog/decision-models-explained) but I didn't verify them against primary sources.

## Search demand (Google)

- **Google autocomplete, Oct 11.**
  - "jev vs" suggests: openai, laya, llm, claude, astra, bert, opus.
  - "jev alternative" suggests: "jev alternatives".
  - "open source jev" suggests: "open source jev model", "open source jev alternative".
  - "best jev alternative" exists as a suggestion.
  - "jev vs clef" has no suggestion yet.
  - Takeaway: there is a hub query ("jev alternatives", "open source jev alternative") plus two head-to-head queries (OpenAI, Laya). Kev and Clef suggestions are swamped by unrelated meanings (KEV = CISA vulnerability list, clef = music).
- **Our GSC, Sep 11 to Oct 8.**
  - **Zero impressions for "jev alternative(s)"**, so we don't rank for the hub term at all today.
  - Laya-family queries total about 400 impressions with 1 click. Laya pages get about 1,100 impressions combined at roughly 0.8% CTR. Two cannibalization issues: Google holds both `/learn/laya-vs-jev/compare` and `/learn/laya-vs-jev/compare/`, and the hub and compare pages compete for the same queries.
  - Smaller competitor-name clusters: nimble 31, anyjev 25, nanojev 21, decider 16, kev 14 (impressions).
  - Listing pages already earn impressions: kev 362, decider 214, anyjev 168, simple-jev 104.
- **Competing SERP pages** that already target "jev alternatives":
  - [madewithjev.com/categories/open-source](https://madewithjev.com/categories/open-source) (172 builds; a strong, vote-based directory)
  - [pinggy.io](https://pinggy.io/blog/best_open_source_jev_alternatives_self_hosted_decision_models/)
  - [choy.in](https://choy.in/blog/open-source-jev-alternatives) (its own DecideBench)
  - [llmconfigurator](https://llmconfigurator.com/en/guides/decision-models/open-models-beyond-ollama)
  - [infrabase.ai](https://infrabase.ai/blog/decision-models-explained)
  - [101aitools](https://101aitools.com/guides/compare-jev-vs-laya-vs-cloudflare-clef)
  - [ankitaglawe.com](https://ankitaglawe.com/guides/open-source-jev-model)
  - [flaviocopes.com/clef](https://flaviocopes.com/clef/)
  - [ntorres.dev](https://ntorres.dev/blog/openai-decisions-api-vs-jev)
  - Implication: thin listicles won't win. Our edge is the catalog depth (488+ listings), the dated facts tied to sources, and the per-alternative "how to switch from Jev" detail.

## Independent benchmark sources (for comparison tables)

- **Decision Index 0.3.1** by apolinário (Hugging Face), [Space](https://huggingface.co/spaces/multimodalart/jev-decision-index), kit [apolinario/decision-index](https://github.com/apolinario/decision-index) (MIT).
  - The board was regenerated Oct 10 and has 117 configurations.
  - Top of the board: pplx-decider v1.1 62.75; Fastino GLiDE 60.21; Jev 60.11; Torchcast 27B 59.91; deck31b 59.03; Kev 27B 58.78.
  - These numbers come from a secondary summary ([tomrochette.com](https://tomrochette.com/agents/hybrid-execution/decision-index/index.md), [benchlm.ai](https://benchlm.ai/benchmarks/decisionindex)). **The build must read the Space directly before quoting anything.**
- **DecideBench** ([choy.in](https://choy.in/blog/open-source-jev-alternatives)): one author, 400 decisions. Treat it as a secondary source.
- **S1Bench live** ([bench.jakecuth.com](http://bench.jakecuth.com)): live board that rendered empty when fetched. Not usable as a static citation.
- **Vendor tables** (Clef card, d1 card, Fastino launch) are vendor claims and must be labelled that way. The site already has this rule in the Laya hub ("do not treat vendor comparison tables as independent audits").

## What the site already has

- **Laya:** `/learn/laya-vs-jev` hub plus 6 subpages, including `/compare`, in `src/data/laya-vs-jev-guides.ts`. It has markdown twins (`.md`), and it's listed in `llms.txt` and in `llms-full.txt`. JSON-LD on it: BreadcrumbList, Article and FAQPage.
  - Laya's **upstream repo NandhaKishorM/laya is not a catalog listing**. Only ports and clients are listed: receptron-laya, laya-coreml, ollaya.
- **Listing detail pages exist for:**
  - `/tools/jaredpalmer-kev`
  - `/tools/mapika-decider`
  - `/benchmarks/theoleecj-semif` (the catalog still has the old repo URL and stale stars: 3,844 and 1,491 in two duplicate entries vs 4,783 live)
  - `/tools/wfzyx-von`
  - `/tools/nokia-applied-research-anyjev`
  - `/tools/featherless-simple-jev`
  - `/tools/posthog-jeeves`
  - `/benchmarks/tianyucodings-nanojev`
- **No listing at all** for Cloudflare Clef, pplx-decider, OpenAI Decisions API, GLiNER2.5-Decide, CLM-8B or Liquid d1-3B. Clef appears only in passing in other profiles.
- **Stale catalog star counts:** kev 6,740 (catalog) vs 8,942 (live). The catalog `stars` values are snapshots.
- **No `/alternatives` route exists.** `/alternatives`, `/jev-alternatives`, `/learn/alternatives` and `/compare` all return 404 today.
- **Repo conventions found:**
  - `src/lib/meta-limits.ts`: META_TITLE_MAX 60, META_DESCRIPTION_MAX 160, and `collectRawMetaFields()` audits all titles.
  - `withBrand()` appends " | Jev" (6 characters) and silently truncates anything over 60, **so source titles must be 54 characters or less**.
  - `stripEmDash`.
  - `src/lib/outbound-attribution.ts` `withOutboundRef()` adds `?ref=jev.aitools.fyi` but skips x.com and twitter.com.
  - `src/lib/content-dates.ts` holds editorial lastmod dates.
  - `src/lib/sitemap-xml.ts` (learn URLs go in `sitemap-learn.xml`).
  - `src/lib/llms-content.ts`.
  - JSON-LD helpers in `src/components/json-ld.tsx`: breadcrumb, FAQPage, Article variants, ItemList, SoftwareApplication, WebPage.
  - The trailing-slash 301 rule is in `src/lib/redirects.ts`.
  - The content policy (`docs/seo-content-policy.md`) requires at least ~300 words of original guidance on learn pages, and gives Jev's voice as "System One (Choice / Score / Noul), not a chat LLM", "no em dashes" and "independent from TypeSafe".

## Raw sources and calls

- GitHub REST `/repos/{owner}/{repo}` for 26 repos (unauthenticated).
- HF `/api/models/{id}` and `/api/models?author=`.
- X: 1 relevancy search for alternatives, 1 WaterSheep sample (written to `/workspace/agent-tools/1675fe6f-...txt`), 1 batch read of 6 posts by ID, and 11 `counts/recent` calls.
- Google autocomplete: 9 queries.
- HN Firebase API: 5 items.
- Web searches and fetches as linked above.
- GSC: existing `/workspace/jev-gsc/oct11/perf.json`. Not re-pulled, since it's from today and already covers data through Oct 8.
