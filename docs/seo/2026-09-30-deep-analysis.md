# SEO and LLM citation analysis, 30 Sep 2026

**Retrieved:** 2026-09-30 09:38 EDT, from the read-only pull in `uploads/data.json` (Cloudflare RUM and Google Search Console).
**Previous report:** `uploads/jev-analytics-2026-09-27.md` (retrieved 2026-09-27 about 10:10 EDT).
**Property:** `sc-domain:jev.aitools.fyi`. GSC `firstIncompleteDate` is 2026-09-28, so 28 Sep through 30 Sep are preliminary. 30 Sep in this pull is only the early morning (0 clicks, 6 impressions).
**No Google APIs were called for this note.** Counts below are from the file.

## 1. Why clicks are falling, and where the upside is

### The 7 day total

The 7 complete days **23 Sep through 29 Sep** are **399 clicks and 7,678 impressions** (5.2% click rate, impression-weighted position 6.5). That is the same window as the Cloudflare "last 7 days" block: RUM pageviews on those dates sum to 916, which matches the device total in the file.

| Date | Clicks | Impressions | Click rate | Position | State |
|---|---:|---:|---:|---:|---|
| 23 Sep | 90 | 1,396 | 6.4% | 7.0 | final, peak clicks |
| 24 Sep | 74 | 1,111 | 6.7% | 6.9 | final |
| 25 Sep | 59 | 1,245 | 4.7% | 6.5 | final |
| 26 Sep | 39 | 1,083 | 3.6% | 5.9 | final |
| 27 Sep | 40 | 911 | 4.4% | 6.4 | final |
| 28 Sep | 59 | 1,060 | 5.6% | 6.4 | preliminary |
| 29 Sep | 38 | 872 | 4.4% | 6.2 | preliminary |

Clicks fell from 90 on 23 Sep to 40 on the completed 27 Sep, then 38 on preliminary 29 Sep. Position got a bit better (about 7.0 to about 6.2). Impressions eased from about 1,400 to about 870 to 1,100. The week still totals 399 clicks only because the peak day is inside it.

The 27 Sep report's fresh window (21 Sep through 27 Sep) was 411 clicks and 7,867 impressions, and it ended on a partial 27 Sep (1 click). Those same dates in this pull are **453 clicks and 8,766 impressions**, because 26 Sep and 27 Sep filled in (39 and 40 clicks, not 36 and 1). The scary "1 click" day was incomplete data. The real pattern is a step down from the 22 to 23 Sep peak (83 and 90 clicks) into a 38 to 59 click range.

Human pageviews (RUM, production) on the same days: 201, 146, 140, 92, 75, 149, 113. The weekend was the low point (26 Sep 92, 27 Sep 75). 28 Sep bounced to 149, then 29 Sep eased to 113. Search clicks did not bounce as hard as pageviews. Early September days in this file (19 to 22 Sep) are sampled lower than the exact table in the 27 Sep report. Do not read those as a new drop. 23 Sep through 26 Sep match that earlier exact report.

28 day GSC total in this file: 567 clicks, 11,554 impressions, position 6.7.

### Where the clicks actually are

The page export is capped at 15 rows: **370 clicks and 4,346 impressions**. The other 29 clicks in the 399 sit on long tail URLs below that cap. Query rows are also capped at 15 and cover only 141 of 399 clicks (35%). The rest are anonymized.

| Page | Clicks | Impressions | Click rate | Position |
|---|---:|---:|---:|---:|
| GitHub Copilot guide | 254 | 1,680 | 15.1% | 4.4 |
| Hermes guide, with slash | 32 | 699 | 4.6% | 7.6 |
| Hermes guide, no slash | 12 | 148 | 8.1% | 6.6 |
| Hermes, both URLs | 44 | 847 | 5.2% | 7.5 |
| Laya vs Jev compare (slash URL) | 8 | 488 | 1.6% | 7.3 |
| Homepage | 4 | 280 | 1.4% | 6.4 |
| Codex and OpenCode guide | 5 | 208 | 2.4% | 7.9 |
| Shapeshift | 6 | 196 | 3.1% | 5.8 |
| OmniJev guide | 5 | 145 | 3.4% | 7.4 |
| AnyJev | 3 | 116 | 2.6% | 7.6 |

Copilot is 254 of 399 clicks (64%) at a 15.1% click rate and position 4.4. That page is the control. Do not rewrite it for the sake of rewriting it.

Named queries in the 15 row export:

| Query | Clicks | Impressions | Click rate | Position |
|---|---:|---:|---:|---:|
| github copilot jev | 34 | 193 | 17.6% | 3.5 |
| jev github copilot | 24 | 128 | 18.8% | 2.7 |
| jev copilot | 14 | 73 | 19.2% | 4.9 |
| hermes jev | 13 | 121 | 10.7% | 7.1 |
| jev hermes | 7 | 105 | 6.7% | 7.6 |
| jev with hermes | 3 | 19 | 15.8% | 8.4 |
| jev hermes agent | 2 | 28 | 7.1% | 8.8 |
| omnijev | 5 | 105 | 4.8% | 7.3 |

Copilot queries sit around positions 2.7 to 4.9 with click rates of 18% to 25% on the bigger ones. Hermes queries sit around positions 7 to 8 with click rates of 7% to 11%, except the small "jev with hermes" row (16% on 19 impressions). People who search Hermes are finding the page and often not clicking. That is a snippet problem more than a ranking collapse.

No Laya, Leya, or Lyla query is in this week's top 15 query rows. The compare page still has 488 impressions, so the demand is real and mostly anonymized. The 27 Sep report is the last place those spellings were named ("jev vs leya", "leya vs jev", and similar, all at 0 clicks then). This pull cannot refresh those query rows.

### Upside, using this week's impressions

Rough extra clicks if the click rate moved, holding impressions still:

| Page | Now | If the click rate reached | Extra clicks |
|---|---:|---|---:|
| Hermes, both URLs | 44 clicks at 5.2% | 8% (still below Copilot, fairer for position 7.5) | about 24 |
| Hermes, both URLs | 44 | 10% | about 41 |
| Laya compare | 8 clicks at 1.6% | 5% | about 16 |
| Homepage | 4 clicks at 1.4% | 4% | about 7 |
| Codex and OpenCode guide | 5 clicks at 2.4% | 6% | about 8 |
| Shapeshift | 6 clicks at 3.1%, already position 5.8 | 8% | about 10 |
| OmniJev guide | 5 clicks at 3.4% | 8% | about 7 |

Hermes is the largest lever. Laya is the clearest snippet mismatch: position 7.3 should not produce a 1.6% click rate. Shapeshift already ranks near position 6 with a weak click rate, so the title is the suspect, but this pull does not name its queries.

Category hubs that led the 27 Sep impression list (benchmarks, agent tooling) are not in this week's top 15 pages. Either their impressions fell, or they sit under the row cap. This note does not invent a current impression count for them.

### Referrals, 23 to 29 Sep (RUM)

The referrer list sums to 916, so it is the full set, not a top 10 cutoff.

| Host | Pageviews |
|---|---:|
| www.google.com | 444 |
| Direct / none | 312 |
| jev.aitools.fyi (internal) | 105 |
| bing.com + www.bing.com | 23 |
| duckduckgo.com | 10 |
| chatgpt.com | 3 |
| t.co | 2 |
| Yahoo | 2 |
| google.com.au | 2 |
| google.com.hk | 4 |
| kagi.com | 1 |
| Teams CDN | 8 |

Google family is 450 pageviews (49%). **ChatGPT sent 3.** No Perplexity, Claude, Gemini, or Copilot host appears. The 27 Sep report had 10 chatgpt.com pageviews since launch and 0 new ones in the prior delta. Three of those, or a newer three, landed in this 7 day window. LLM citation is not a traffic source yet.

Devices: desktop 738 (81%), mobile 174 (19%), tablet 4. The top 8 countries are not a full total (they sum to 551 of 916): US 248, India 73, Germany 50, China 38, Spain 38, Canada 37, Japan 34, UK 33.

Top paths are a top 15 only (627 of 916 pageviews). Copilot guide 277 plus a slash variant 40. Hermes 58 plus slash 17. Home 55. Explore 51. Laya compare 21.

## 2. Technical SEO audit

### Titles and metas

Rendered titles are capped at 60 characters and meta descriptions at 160, in `src/lib/seo.ts` (`withBrand` and `trimMetaDescription`). That cap was silent. A 63 character `metaTitle` was chopped in the results page, and a 174 character description was cut at the last space. Google was not showing the sentence we wrote.

Before this change, 50 source fields named `metaTitle`, `metaDescription`, `seoTitle`, or `seoDescription` were over those caps. Examples called out in the brief:

- `classifier-dev` meta description was 161 characters.
- `kerpopule-hermes-jev-skills` meta title was 62, and the listing enrichment description was 177.
- `awlevin-typesafe-computer-use` meta title was 63.

This change shortens every one of those fields, rewrites the Hermes and Laya compare metas for the queries above, and adds `scripts/check-meta-length.mjs` to `pnpm build`. The check fails when a source title field is over 60 or a source description field is over 160. It also scans the static title and description strings in `src/lib/seo.ts`.

Auto generated listing descriptions can still be trimmed at render time. OmniJev's rendered description currently ends "Reading queue from." That is proposed copy below, not a named meta field, so it was left alone.

### Canonicals

Canonicals are absolute `https://jev.aitools.fyi` URLs with no trailing slash (`trailingSlash: "never"`). `/explore` with `?q=` or `?sort=` stays `noindex, follow` and points canonical at `/explore`. A category-only explore URL 301s to `/categories/<slug>`. That behavior is already tested in `scripts/verify-explore-seo.mjs` and was not loosened.

GSC still reports the Hermes slash URL (699 impressions) and the no-slash URL (148) as separate rows. The site already 301s `/*/` to the no-slash path. Both rows should be watched until Google consolidates them. Do not add a second redirect for the same path.

### Internal links

High traffic guides already listed related tools at the bottom of the article. Category hubs were one button ("Agent tooling category") after the FAQ. Crawlers and people met the links late.

This change adds an "In the directory" link row after the answer box on every agent guide and every Laya vs Jev guide. Hermes links to `/categories/agent-tooling` and the detail pages for hermes-jev-approvals, typesafe-skill-router, hermes-jev, jev-mcp, and typesafe-mcp. The Copilot guide links to agent tooling plus its related MCP and skills pages. The compare page links to the Laya hub, System One, the Jev primer, `/categories/benchmarks`, `/categories/sdks`, and the Laya, ollaya, and Laya-CoreML listings. Links have no trailing slash. Index-only listings are skipped so the module does not point at a 404.

### JSON-LD

Already present before this change:

- `WebSite` and `Organization` on every page.
- `BreadcrumbList` on guides, learn, categories, and listings.
- `FAQPage` on agent guides, Laya guides, category hubs, the homepage, and product profiles that have FAQs.
- `Article` on learn topics, agent guides, and Laya guides.
- `SoftwareApplication` (or `CreativeWork` for guide listings) on detail pages.
- `ItemList` on the homepage, explore, and category grids.

Gaps this change closes:

- Article nodes had no `dateModified`. They now use the same editorial date as the sitemap.
- `SoftwareApplication` now includes `dateModified` when the listing has `updatedAt`.
- The agent guide hub and the Laya hub now have an `ItemList` of the child guides.

Still open: learn primers have no FAQ block, so they cannot emit `FAQPage` without new copy. That is listed in section 4.

### Sitemap lastmod

`lastmod` used to be the source file's modification time, or `new Date()` when a listing had no `updatedAt`. A checkout or an unrelated edit stamped every guide in a shared file as "changed today." Google treats that as noise.

Lastmod is now a `YYYY-MM-DD` date. Listings use `updatedAt`, or 2026-09-19 when that field is missing. Guides, learn pages, and category hubs use editorial dates in `src/lib/content-dates.ts`. Hermes, the Laya compare page, and the other pages whose meta copy changed in this pass are 2026-09-30. Untouched agent guides stay 2026-09-26. The build checks that every lastmod matches that date shape, and that `.md` and `llms-full.txt` are not in the sitemap.

### Thin and duplicate pages

The catalog is 572 listings. 241 have detail pages. 331 are explore-only. 2 were demoted as near-duplicates. Explore-only cards link out. They are not in the sitemap. That policy is doing its job.

Duplicate URL shapes that still collect impressions:

- Hermes with and without a trailing slash, as above.
- The 27 Sep report also saw `/explore?q=` and `/explore?sort=` collecting impressions. Those URLs are noindex now. They are not in this week's top 15 pages. Historical impressions can linger in GSC after noindex.

`/learn/jev-typesafe` was called out on 27 Sep for "official documentation" queries at a 0% click rate. A directory primer cannot satisfy "official docs." The page should keep sending people to TypeSafe's docs. Do not stuff "official documentation" into the title.

## 3. LLM citation readiness

ChatGPT is the only LLM referrer (3 pageviews). Crawlers can still fetch the site. The 27 Sep report already showed PerplexityBot, OAI-SearchBot, ClaudeBot, and GPTBot hitting the host. Referrals and crawls are different things. The citation surface was thin in a few specific ways.

| Piece | Before | This change |
|---|---|---|
| `llms.txt` | Present, with counts, guides, FAQ, and spec lines | Now points at `llms-full.txt` and at Hermes, Copilot, and Laya markdown |
| `llms-full.txt` | Missing | New. Dated spec facts, directory manifest, answer-first guide text, FAQs, sources |
| Markdown alternates | Homepage and 404 only, via `Accept: text/markdown` | Same negotiation on guide and learn URLs, plus a `.md` copy with `noindex` and a canonical link back to the HTML URL |
| Answer-first | Tagline, then a "Why Jev" or "Key point" box | Markdown and `llms-full.txt` lead with the meta description, then the answer box |
| FAQ blocks | On agent guides, Laya guides, categories, home, and many profiles | Unchanged. Learn primers still have no FAQ |
| Stable facts with sources and dates | Spec sheet on the site, sources at the bottom of guides, no checked date in the LLM file | `llms-full.txt` says checked 2026-09-30 and points at TypeSafe docs for latency and price. Those figures are TypeSafe's, not measurements from this site |
| Directory JSON | `/.well-known/jev-directory.json` | Now also lists `llms_full_txt` |
| Robots | `User-agent: *` / `Allow: /` only | Explicit allow for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended, plus comments pointing at both LLM files |

`.md` URLs are `noindex` so they do not compete with the HTML canonical. Crawlers that follow `llms.txt` can still read them. Negotiated markdown on the HTML URL is the same document, so it is not noindexed.

Outbound links in markdown use `?ref=jev.aitools.fyi`, except hosts that already skip the ref (X and image CDNs). Sponsor slots are unchanged and still use `utm_source=outbid.fyi`.

## 4. Copy changes not made

These are the next snippet tests. They are not in this change. Character counts are for the proposed string.

### Homepage

**Now** (title, 50 characters): Jev Directory: demos, tools, and featured listings

**Now** (description, 138 characters): Browse SDKs, integrations, and demos built on TypeSafe Jev. Watch builder clips, skim featured listings, and explore the curated tool map.

**Issue:** 280 impressions, 4 clicks, 1.4% click rate, position 6.4. The 27 Sep report tied "jev ai website" and "jev homepage" to this URL at 0 clicks. The title reads like an internal brand, not an answer.

**Solution** (title, 49 characters): Jev tools directory: SDKs, agents, and demos

**Solution** (description, 145 characters): A curated map of Jev tools: SDKs, MCP servers, agent guides, and demos. Independent of TypeSafe. Start with Copilot, Hermes, or the full catalog.

### Hermes headline

**Now** (visible H1, 18 characters): Hermes Agent + Jev

**Issue:** The meta title now leads with "Hermes Jev" and "Jev with Hermes." The H1 still does not. People who click, and models that quote the H1, see a different phrase than the query.

**Solution** (H1, 34 characters): Hermes Jev: Jev with Hermes Agent

### Laya compare headline and key point

**Now** (visible H1): Laya vs Jev: comparison overview

**Now** (key point, includes TypeSafe): Pick Laya when you need on-prem or edge inference with open weights. Pick Jev when you want a managed System One API, gateway routing, and TypeSafe's hosted release cycle. Hybrid stacks are normal, not cheating.

**Issue:** The meta title now says both "Laya vs Jev" and "Jev vs Laya." The H1 does not say "Jev vs Laya." The key point names TypeSafe, which this pass kept out of the title and the headline on purpose. Searchers comparing the two products often do not type the company name.

**Solution** (H1, 33 characters): Laya vs Jev, and Jev vs Laya

**Solution** (key point, 155 characters): Pick Laya when you need open weights on your own machines. Pick hosted Jev when you want a managed decision API and gateway routing. Using both is normal.

### Codex and OpenCode guide

**Now** (title, 47 characters): Codex and OpenCode + Jev: judge MCP and routers

**Now** (description, 132 characters): Add jev-judge-mcp to Codex and OpenCode, plus typesafe-mcp evaluate and jev-codex-router. MCP config, skills, and fail-open routing.

**Issue:** 208 impressions, 5 clicks, 2.4% click rate, position 7.9. The description was only shortened to fit 160 characters. It still leads with a package name, not the job.

**Solution** (title, 46 characters): Jev with Codex and OpenCode: MCP and routing

**Solution** (description, 132 characters): Use Jev with Codex and OpenCode to judge tool calls and pick a route. MCP setup, skills, and a router that fails open if Jev errors.

### OmniJev guide

**Now** (title, 42 characters): awesome-jev (OmniJev): Jev community guide

**Now** (description, 152 characters, chopped): awesome-jev (OmniJev) in the Jev ecosystem. Papers, open reproductions and independent evaluations behind System One models and Jev. Reading queue from.

**Issue:** The page has 145 impressions, 5 clicks, 3.4% click rate, position 7.4. The query "omnijev" has 105 impressions, 5 clicks, 4.8%, position 7.3. The description dies mid sentence because the listing body is trimmed to 160 characters.

**Solution** (title, 40 characters): OmniJev: papers and evals behind Jev

**Solution** (description, 140 characters): OmniJev (awesome-jev) collects papers, open reproductions, and independent evals behind System One and Jev. A reading list, not the official docs.

### Shapeshift

**Now** (title, 51 characters): Shapeshift: Jev intent fan-out for morphing text UI

**Now** (description, 148 characters): anishfn/shapeshift uses parallel Jev questions plus deterministic parsers for one-box UI morphing. Offline default, live at shapeshiftui.vercel.app.

**Issue:** 196 impressions, 6 clicks, 3.1% click rate, position 5.8. Position is already good. This week's query export does not name the queries, so the title should stay honest and not invent a keyword.

**Solution** (title, 48 characters): Shapeshift: one box, many Jev intent cards

**Solution** (description, 139 characters): Shapeshift fans one text box out into events, lists, and timers with parallel Jev questions. Offline by default. Live demo at shapeshiftui.vercel.app.

### AnyJev

**Now** (title, 57 characters): AnyJev: turn open LLMs into calibrated Jev-style deciders

**Now** (description, 152 characters): nokia-applied-research/AnyJev fits heads on vLLM hidden states, fixes option-order flips at L0, and documents BANKING77 calibration tables. PyPI anyjev.

**Issue:** The page has 116 impressions, 3 clicks, 2.6%, position 7.6. The named query "anyjev" is only 17 impressions at position 16.7, so most impressions are other queries. The title is accurate and already uses the product name. A rewrite can wait until the queries are visible.

**Solution:** Leave it until the next GSC pull shows the hidden queries. Do not guess them.

### Copilot guide

**Now** (title, 42 characters): GitHub Copilot Agent + Jev: MCP in VS Code

**Issue:** 254 clicks, 15.1% click rate, position 4.4. This is the page carrying the site.

**Solution:** Do not change the title in the next pass. If Hermes and Laya move, revisit Copilot only with a side by side test.

### Learn primers, FAQ

**Now:** Learn topics have a definition and sections. They do not have an FAQ block, so there is no `FAQPage` JSON-LD.

**Issue:** Models quote FAQ blocks. The primers are the pages that should answer "what is Jev" in a short Q&A. Adding questions is new copy, so it was not done here.

**Solution:** Add 3 questions per primer, each answer under 2 sentences, sourced from the section text that is already on the page. Start with `/learn/jev-typesafe` and `/learn/system-one`.
