# Plan: Jev alternatives pages on jev.aitools.fyi

Status: **draft plan, not reviewed** (see "Claude review" at the end). Research and evidence are in `research.md`. Nothing has been built and no PR or issue has been opened. Decisions marked **[Q]** are waiting on Rishit.

## 1. What we're building

- **One hub**, `/alternatives`, aimed at "jev alternatives", "best jev alternative", "open source jev alternative" and "open source jev model". GSC shows we have zero impressions for these today, while Google autocomplete shows people are searching them.
- **One page per alternative**, `/alternatives/<slug>`. Each page also serves "<X> vs Jev", so there is **one URL per competitor**, never separate "alternative" and "vs" pages. That avoids splitting authority the way `/learn/laya-vs-jev` and `/compare` already split today.
- **Laya [Q1]:** we already have a 7-page Laya hub, so we don't create `/alternatives/laya`.
  - The hub's Laya entry links to `/learn/laya-vs-jev/compare`, which we upgrade to the same template: verdict, table and dated facts.
  - To keep 10 *new* pages, add runner-up **von** (or NanoJev) as page 10.
  - Recommendation: yes. The alternative is a new Laya page that canonicalizes to the learn page, which adds nothing.

### Page list (slugs, target queries, titles, descriptions)

Source titles are kept at **54 characters or less**, because `withBrand()` appends " | Jev" and truncates anything over 60. Descriptions are 160 characters or less. All lengths below were checked by script, and none contain an em or en dash.

| # | URL | Primary / secondary queries | Title (len) | Description (len) |
|---|---|---|---|---|
| hub | `/alternatives` | jev alternatives; best jev alternative; open source jev alternative; open source jev model; self-hosted jev | Jev alternatives: 10 decision models compared (2026) (52) | The 10 most popular Jev alternatives, ranked by real adoption: Laya, Cloudflare Clef, Kev, OpenAI Decisions API and more. Prices, licenses, benchmarks. (151) |
| 1 | `/learn/laya-vs-jev/compare` (existing, upgraded) | jev vs laya (+ misspellings); laya alternative | keep current: "Laya vs Jev: open weights or a hosted API" | keep current |
| 2 | `/alternatives/cloudflare-clef` | clef vs jev; cloudflare decision model; clef-flash; jev compatible api | Cloudflare Clef vs Jev: open weights on Workers AI (50) | Clef and Clef-flash are Cloudflare's Apache-2.0 decision models with a Jev-compatible API. Compare price, context, speed, benchmarks and how to switch. (151) |
| 3 | `/alternatives/kev` | kev vs jev; kev jared palmer; self-hosted jev; kev-4b | Kev vs Jev: Jared Palmer's open decision models (47) | Kev is an open Jev-like model family on Qwen with a System One compatible server. Compare sizes, hardware, accuracy, license and migration from Jev. (148) |
| 4 | `/alternatives/openai-decisions-api` | jev vs openai; openai decisions api; gpt-6-luna decisions | OpenAI Decisions API vs Jev: price, speed, inputs (49) | OpenAI's Decisions API (gpt-6-luna, beta) vs TypeSafe Jev: request shape, image input, price per token, data controls and when each one fits. (141) |
| 5 | `/alternatives/perplexity-pplx-decider` | pplx-decider; perplexity decision model; pplx-decider vs jev | Perplexity pplx-decider vs Jev: open 27B decisions (50) | pplx-decider is Perplexity's Apache-2.0 27B decision model, hosted or self-run. Compare Decision Index scores, price, hardware and API with Jev. (144) |
| 6 | `/alternatives/mapika-decider` | decider-2b; mapika decider; decider vs jev | Decider vs Jev: Mapika's small open decision models (51) | Decider is an open System One model family on Qwen3.5, from 0.8B up. Compare speed, accuracy, hardware, license and the /v1/systemone server with Jev. (150) |
| 7 | `/alternatives/fastino-gliner-decide` | gliner2.5-decide; gliner decision model; fastino jev | GLiNER2.5-Decide vs Jev: a 340M local decision model (52) | Fastino's GLiNER2.5-Decide is a 340M Apache-2.0 encoder for typed decisions on CPU. Compare accuracy, speed, fine-tuning and hosting with Jev. (142) |
| 8 | `/alternatives/semif` | semif; semif openjev; semantic if open model | SemIf vs Jev: decisions from open model logits (46) | SemIf reads option logits from open models you host to answer Choice, Score and Noul. Compare setup, speed, calibration and license with Jev. (141) |
| 9 | `/alternatives/clm-8b` | clm-8b; contrastive language model; clm vs jev | CLM-8B vs Jev: a contrastive System One model (45) | CLM-8B from Contrastive-LM is an Apache-2.0 8B decision model with cached state and action embeddings. Compare claims, benchmarks and fit with Jev. (147) |
| 10 | `/alternatives/liquid-d1` | liquid d1-3b; d1 decision model; small multimodal decision model | Liquid d1-3B vs Jev: small multimodal decisions (47) | Liquid AI's d1-3B answers typed questions over text and images in one pass. Compare Decision Index score, latency, license terms and hardware with Jev. (151) |
| 11 | `/alternatives/von` (if Q1 = yes) | von decision model; von vs jev; local jev drop-in | von vs Jev: an Apache-2.0 local decision model (46) | von is a non-autoregressive System One model with order-invariant option scores. Compare local latency claims, setup, license and accuracy with Jev. (148) |

Every fact in these descriptions (licenses, sizes, compatibility) must be re-checked against the primary source at build time. The build agent should fix the copy if anything has changed. **H1** = the title without the "(2026)". The hub H1 is "Jev alternatives: the 10 most popular decision models".

## 2. Hub page outline (`/alternatives`)

1. **Answer-first summary**, 2 to 3 sentences an LLM can quote. Example: "The most popular Jev alternatives in October 2026 are Laya (open weights, local), Cloudflare Clef (open weights plus Workers AI hosting, Jev-compatible API) and Kev (open, System One compatible server). For a hosted API, Clef-flash, Perplexity pplx-decider and OpenAI's Decisions API are the main options."
   - Followed by a **"Last verified: <date>"** line and a "How we rank" link.
2. **Quick picks by need.** Cheapest hosted; best accuracy on the Decision Index; runs on a laptop CPU; drop-in `/v1/systemone`; multimodal; fully open license. Each pick is one line with a link.
3. **Ranked table of the 10.** Columns: Maker; Open weights? (license); Hosted API? (price per M input tokens); Jev API compatible?; Sizes; Inputs (text/image); Decision Index score (version + date); GitHub stars / HF downloads (as of date); link to our page.
4. **How we ranked.** The popularity method from `research.md` (X, GitHub, HF, search demand, HN, roundups), with the snapshot date. Not a quality score.
5. **Hosted vs self-hosted: how to choose.** Short decision guide. Links to `/learn/where-to-run-jev` and `/learn/system-one`.
6. **Switching from Jev.** What stays the same (the Choice/Score/Noul request shape for compatible servers) and what changes (calibration, option limits, context, thresholds). Links to `/learn/laya-vs-jev/migration-and-coexistence`.
7. **More open alternatives** (runners-up and the long tail). Links to the existing listing pages and to `/explore?…` filtered to open models.
8. **FAQ**, 6 to 8 entries, for example: "Is there an open-source Jev?", "Which Jev alternative is Jev-API compatible?", "Cheapest Jev alternative?", "Can I run a Jev alternative on CPU?", "Is Clef better than Jev?", "Is this site affiliated with TypeSafe?"
9. **Sources** list, with outbound links that carry `?ref=jev.aitools.fyi` (except x.com).

## 3. Per-alternative page template (`/alternatives/<slug>`)

Pages render from one typed data module. Sections, in order:

1. **Quick verdict.** A key-point box of 2 to 3 sentences: "Pick X when … Pick Jev when …" (same pattern as the Laya `keyPoint`).
2. **At a glance** comparison table, X vs Jev. Rows:
   - maker
   - release date
   - weights and license
   - hosted options and price per M input / output tokens
   - API shape (`/v1/systemone` compatible? exact differences)
   - question types and limits (options, questions per request, context)
   - inputs (text, JSON, images, video)
   - sizes and hardware needed
   - latency (stating whose measurement and what setup)
   - Decision Index score (version, date)
   - data handling (retention, region)
   - SDKs

   Every cell carries a source footnote.
3. **What it is.** 1 to 2 paragraphs from the README, model card or official docs. No marketing restated as fact.
4. **Accuracy and benchmarks.** An independent board (Decision Index) shown separately from vendor tables, each labelled. Caveats about measurement setups, like the existing benchmarks-and-fairness copy.
5. **When to choose X** and **when to stay on Jev.** 3 to 5 bullets each, concrete workloads.
6. **Pricing and licensing.** Exact numbers with "as of" dates. License name, plus any non-Apache terms (d1 uses LFM 1.0).
7. **Migrating from Jev to X.** A minimal request diff, e.g. change base URL, model id, field names (OpenAI uses `predicate` and a `questions` array). Plus calibration and threshold advice and a "run both in shadow" pattern. Code blocks only where the official docs show the shape.
8. **Using X with the Jev ecosystem.** Links to our listings for compatible tools, runtimes (Ollaya, vLLM-Jev, Ollama, SGLang) and SDKs that work against it.
9. **FAQ**, 4 to 6 entries, written as the queries people search ("Is X compatible with the Jev API?", "Is X free?", "X vs Jev: which is faster?", "Can I run X locally?").
10. **Other Jev alternatives.** Links to the hub and 3 sibling pages chosen by similarity (hosted ones link to hosted ones, small local to small local).
11. **Sources and "Last verified <date>"**, plus a "Spotted an error? /contact" line.

**Length target:** at least ~600 words of original copy per page. That's above the 300-word minimum for learn pages, and it guards against thin or duplicate content. Shared boilerplate (method, disclaimers) should stay under ~15% of a page.

## 4. Technical implementation (for the build agent later)

- **Data:**
  - New `src/data/alternatives.ts`. Typed `Alternative` with slug, title, seoTitle, seoDescription, h1, keyPoint, facts[], table rows, sections, faq, sources[] and lastVerified.
  - Each `facts[]` entry is `{ claim, value, sourceUrl, sourceLabel, checkedAt }`, so every table cell traces back to a source. Mirror the `LayaVsJevGuide` shape where possible.
  - Plus `src/data/alternatives-metrics.json`: a dated snapshot of stars, HF downloads and Decision Index scores, rendered as "as of <date>".
- **Routes:**
  - `src/pages/alternatives/index.astro`
  - `src/pages/alternatives/[slug].astro`
  - Markdown twins `src/pages/alternatives.md.ts` and `src/pages/alternatives/[slug].md.ts`, served at `/alternatives.md` and `/alternatives/<slug>.md`, with `markdownAlternate` set in BaseLayout like the learn pages.
- **SEO helpers:**
  - `alternativesHubSeo()` and `alternativePageSeo()` in `src/lib/seo.ts`, using `pageSeo` with type article and a canonical self-URL without a trailing slash (the existing `/*/ /:splat 301` rule covers slashes).
  - Register all new titles and descriptions in `collectRawMetaFields()` so the meta-limits check covers them.
- **JSON-LD** (existing helpers in `src/components/json-ld.tsx`):
  - Hub: `BreadcrumbList` + `Article` (or `WebPage`) + `ItemList` (10 `ListItem`s pointing at our pages) + `FAQPage`.
  - Detail pages: `BreadcrumbList` + `Article` (datePublished / dateModified from content-dates) + `FAQPage`.
  - Optionally `about: SoftwareApplication` for X and Jev, with name, url, applicationCategory and license **only**: no `aggregateRating`, no `offers` with made-up values, no review markup.
- **Sitemaps:**
  - Add `/alternatives` and the 10 pages to `sitemap-learn.xml` (or a new `sitemap-alternatives.xml` listed in the sitemap index), using lastmod from `content-dates.ts`. Also update `scripts/verify-seo-artifacts.mjs` counts. **This is a sitewide SEO change, so the PR review runs at the `important` tier.**
  - IndexNow pings and Search Console sitemap submission stay with Rishit (manual), as today.
- **llms.txt / llms-full.txt:**
  - Add a "Jev alternatives" section in `src/lib/llms-content.ts`: hub plus 10 links with one-line summaries, plus the `.md` twin URLs.
  - Include the full markdown in `llms-full.txt`.
- **Internal links:**
  - Into the hub from: home (one line in the learn/explore block), `/learn` index, `/learn/where-to-run-jev`, the Laya hub, and the existing listing pages for Kev, Decider, SemIf, von, NanoJev, AnyJev, Simple Jev and Jeeves ("See how Kev compares with Jev").
  - Each alternative page links to its listing page if one exists (e.g. `/alternatives/kev` ↔ `/tools/jaredpalmer-kev`).
  - Use different anchor text and intent: the listing targets the brand name, the alternatives page targets "vs Jev" / "alternative".
- **Catalog gaps [Q4]:**
  - Add listings for NandhaKishorM/laya (upstream), Cloudflare Clef, pplx-decider, GLiNER2.5-Decide, CLM-8B and Liquid d1-3B. OpenAI Decisions API could be a `guides` / `official`-style link entry.
  - Refresh stale stars: kev, SemIf. Fix the SemIf duplicate entries and its renamed repo URL.
- **Laya cleanup:** the trailing-slash 301 is already live (`/learn/laya-vs-jev/compare/` 301s to `/learn/laya-vs-jev/compare`, checked Oct 11). GSC still lists both from before. No code change needed; that will settle as Google recrawls.
- **Rules to enforce in code review:**
  - titles ≤60 after branding (source ≤54)
  - descriptions ≤160
  - zero em or en dashes
  - all outbound links through `withOutboundRef`
  - every fact matches its README, card or official docs
  - "independent, not affiliated" note on every page
  - no invented numbers

## 5. LLM-citation tactics

- **Answer first:** the first 2 sentences of each page answer the query outright, with names and numbers, and can be quoted as-is.
- **Fact tables in real HTML `<table>`**, with units and "as of" dates in cells. LLMs and AI Overviews pull these well.
- **A dated "Last verified Oct NN, 2026" line**, matched by Article `dateModified` and sitemap lastmod.
- **Primary citations inline:** official docs, HF cards, GitHub READMEs and the Decision Index. Vendor claims are labelled "vendor-reported".
- **Stable, descriptive URLs and headings** that match real queries ("Is Clef compatible with the Jev API?").
- **Markdown twins plus llms.txt entries**, so agent crawlers (Exa already crawls ~4,100 requests in 3 weeks) get clean text.
- **Consistent entity naming:** "Cloudflare Clef", "Perplexity pplx-decider", "OpenAI Decisions API", "TypeSafe Jev". Each one's first mention links to its official page.

## 6. Freshness

- **Snapshot file.** `alternatives-metrics.json` holds stars, downloads, prices and Decision Index scores, each with checkedAt. **[Q5]** Recommendation: refresh every 2 weeks through a bot-prepared PR (one commit) that Rishit merges. No build-time API fetching: Actions minutes are tight and APIs rate-limit.
- **Price and licence changes** need a manual re-check of the docs on each refresh. Clef-flash already changed price ($0.09 to $0.038), and OpenAI's Decisions API is beta and will reach GA "in the coming weeks".
- **Rank order review.** Re-check the ranking monthly. If a new model overtakes, swap it in, and keep the old page live, linked from "More alternatives".
- **Weekly report rule.** If this ends up in a regular GSC report, file suggestions as GitHub issues per the standing rule. Not part of this task.

## 7. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Thin or near-duplicate pages (10 pages on one template) | ≥600 words unique per page, page-specific migration and when-to-choose content, boilerplate under 15%, no auto-generated prose. |
| Cannibalizing existing listing pages and the Laya hub | One URL per competitor. Listing pages target the brand name, alternatives pages target "vs Jev". Laya stays on the learn hub. Cross-link both ways with distinct anchors. |
| Accuracy and fairness (vendor claims, fast-moving prices, beta APIs) | Every cell sourced and dated. Independent vs vendor benchmarks labelled. A "When to stay on Jev" section on every page. No "X is better than Jev" headline claims. A corrections contact. |
| Trademark wording | Use names descriptively only (nominative use). No logos unless the press kit allows it. No "official" wording. Keep the "independent, not affiliated with TypeSafe, Cloudflare, OpenAI, Perplexity…" line. Titles say "vs Jev", never "Jev killer". |
| Outdated numbers hurting trust | Snapshot dates shown in the UI. Fortnightly refresh. Last-verified line. |
| Sending traffic away from a Jev directory | Accepted trade-off: the hub keeps users in-site through the catalog, listing pages and Jev guides. Every page ends with ecosystem links. |
| Claims about CLM-8B, AutoJev and other hyped models | Use the "claims vs independent tests" framing. AutoJev is excluded until a primary source exists. |

## 8. Rollout

- **PR shape [Q6].** Recommendation: **1 PR** with the data module, the hub, 10 pages, twins, sitemap, llms and internal links, built by a Composer 2.5 cloud agent, one commit per round.
  - Claude review at **`important`** tier, because it changes sitewide sitemap and llms behaviour.
  - Context: the Jev Dev addendum checks, plus "verify each fact against the cited source URL" and "check titles stay ≤60 after the ' | Jev' suffix".
  - Proof from the agent: build output, page count, meta-limits script output, and a list of every fact with its source.
- **After merge.** Rishit submits sitemaps and pings IndexNow himself. We watch GSC at 2 and 4 weeks for "jev alternatives" impressions and for the "vs" queries.

## Decisions (Rishit, Oct 11, 2026)
1. Laya stays on the existing /learn/laya-vs-jev/compare page, upgraded to the new template; von becomes the 10th new alternatives page.
2. Closed hosted APIs (e.g. OpenAI Decisions API) are included, grouped separately from open models on the hub.
3. Show Decision Index scores with dates; vendor-reported numbers clearly labelled; no in-house benchmark.
4. Add the 6 missing listings and fix stale/duplicate entries (Kev, SemIf stars; SemIf old-repo duplicate) in the same build PR.
5. Stats and prices refresh every 2 weeks via PR.
6. Rollout: one build PR with everything, reviewed at tier important.
7. URL: /alternatives and /alternatives/<slug>.
