/**
 * Submit sitemap URLs to IndexNow (https://www.indexnow.org/documentation).
 *
 * Examples:
 *   pnpm run indexnow -- --dry-run
 *   pnpm run indexnow -- --smoke
 *   pnpm run indexnow
 */
import { createRequire } from "node:module";
import { resolve } from "node:path";

const HOST = "jev.aitools.fyi";
const SITE = `https://${HOST}`;
const KEY = "42c30ebcb44a4430a2cfbafde58a4f44";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10_000;

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const smoke = args.has("--smoke");

const root = resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);

async function loadSitemapUrls() {
  const viteEntry = require.resolve("vite", {
    paths: [require.resolve("astro")],
  });
  const { createServer } = await import(viteEntry);
  const vite = await createServer({
    configFile: resolve(root, "astro.config.mjs"),
    resolve: { alias: { "@": resolve(root, "src") } },
    logLevel: "error",
  });
  const sitemapMod = await vite.ssrLoadModule("/src/lib/sitemap-xml.ts");
  await vite.close();
  return sitemapMod.collectAllSitemapLocs();
}

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

async function postBatch(urlList) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return res;
}

async function main() {
  let urlList;
  if (smoke) {
    urlList = [`${SITE}/`, `${SITE}/sitemap.xml`];
  } else {
    urlList = await loadSitemapUrls();
  }

  const unique = [...new Set(urlList)];
  console.log(
    `IndexNow: ${unique.length} URL(s) from ${smoke ? "smoke list" : "sitemap helpers"}.`,
  );

  if (dryRun) {
    console.log("Dry run only; no POST to IndexNow.");
    return;
  }

  const batches = chunk(unique, BATCH_SIZE);
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const res = await postBatch(batch);
    const detail = res.status === 202 || res.status === 200
      ? "accepted"
      : await res.text().catch(() => "");
    console.log(
      `Batch ${i + 1}/${batches.length}: HTTP ${res.status} (${batch.length} URLs)${detail && detail !== "accepted" ? ` — ${detail.slice(0, 200)}` : ""}`,
    );
    if (!res.ok && res.status !== 202) {
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
