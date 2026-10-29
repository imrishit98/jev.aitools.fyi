# Contributing

Thanks for helping improve **Jev.aitools.fyi** (the public **Jev Directory**).

## Submit a listing

The fastest path is the site form: [jev.aitools.fyi/submit](https://jev.aitools.fyi/submit). It opens a structured GitHub issue with the fields we need to review your project.

## Code changes

1. Fork and clone [github.com/imrishit98/jev.aitools.fyi](https://github.com/imrishit98/jev.aitools.fyi).
2. `pnpm install` and `pnpm dev`.
3. Keep user-facing copy free of third-party index attribution. Do not use em dashes in new marketing copy.
4. Run `pnpm build` before opening a pull request.
5. Showcase videos are **never** committed. Add the demo in `src/data/showcase-demos.ts`, then run `pnpm sync:showcase-media` to refresh `src/data/showcase-demo-media.json` (posters + `video.twimg.com` MP4s via fxtwitter). Build fails if any `.mp4`/`.webm`/`.mov` appears under `public/` or `dist/`.

## Sitemap lastmod

Sitemap dates live in `src/data/lastmod-manifest.json`. Each URL stores a content hash and a `YYYY-MM-DD` lastmod. `pnpm build` checks those hashes first and fails if they drifted. When you change copy or data that a sitemap URL renders, run `pnpm lastmod:update` and commit the manifest with the copy. Static routes hash the page file, the local components that hold that page's copy, and the records the page shows: home demos and featured cards, showcase demos, learn and guide cards, the explore catalog, the submit form, and the legal copy in `src/lib/legal.ts`. A shared header, footer, or layout edit does not bump those hashes. A guide body edit bumps that guide's URL, and the hub only when a card title, tagline, or description changes. `/privacy`, `/terms`, and `/your-privacy-choices` keep the date from the ISO constants in `src/lib/legal.ts` that render "Last updated", even when the hash changes. A listing `updatedAt` that is a valid day later than the manifest date is used instead, so a listing can move forward without a manifest edit. An `updatedAt` later than the UTC day fails the build. The date is the day the content changed. It is not the build time.

## Catalog data

Most listings come from `src/data/catalog.json`, regenerated via maintainer scripts documented in [README.md](./README.md). Hand edits should go through marketing overrides when possible.

## Questions

Open a GitHub issue or use Submit on the live site.
