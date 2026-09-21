# Contributing

Thanks for helping improve **Jev.aitools.fyi** (the public **Jev Directory**).

## Submit a listing

The fastest path is the site form: [jev.aitools.fyi/submit](https://jev.aitools.fyi/submit). It opens a structured GitHub issue with the fields we need to review your project.

## Code changes

1. Fork and clone [github.com/imrishit98/jev.aitools.fyi](https://github.com/imrishit98/jev.aitools.fyi).
2. `pnpm install` and `pnpm dev`.
3. Keep user-facing copy free of third-party index attribution. Do not use em dashes in new marketing copy.
4. Run `pnpm build` before opening a pull request.
5. Showcase videos: Cloudflare Workers rejects assets over 25 MiB. `pnpm fetch:demos` skips downloads over 20 MiB; use `remoteVideoUrl` / `remotePosterUrl` on the demo in `src/data/showcase-demos.ts` (tweet `video.twimg.com` MP4, prefer 720p). `scripts/verify-demo-asset-sizes.mjs` runs on build.

## Catalog data

Most listings come from `src/data/catalog.json`, regenerated via maintainer scripts documented in [README.md](./README.md). Hand edits should go through marketing overrides when possible.

## Questions

Open a GitHub issue or use Submit on the live site.
