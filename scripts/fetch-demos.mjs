/**
 * Download showcase demo posters + MP4s into public/demos/ from X tweet IDs.
 * Run: node scripts/fetch-demos.mjs
 * Requires network; safe to re-run (skips existing files unless --force).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
/** Keep in sync with src/data/showcase-demos.ts */
const DEMO_SPECS = [
  { id: "json-render-ctatedev", tweetId: "2101022101750571357", prefer1080: true },
  { id: "zillow-venturetwins", tweetId: "2101341075684434245", prefer1080: false },
  { id: "designer-heystefan", tweetId: "2101369117496521042", prefer1080: false },
  { id: "canada-measure-plan", tweetId: "2101315424247820309", prefer1080: false },
  { id: "lurk-mxfp4", tweetId: "2101070906852298910", prefer1080: false },
  { id: "ryze-irabukht", tweetId: "2101375295152652372", prefer1080: false },
  { id: "seo-cost-hamonpaulm", tweetId: "2101265909826609278", prefer1080: false },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "demos");
const force = process.argv.includes("--force");

function pickMp4Url(formats, prefer1080 = false) {
  const mp4s = (formats ?? [])
    .filter((f) => f.container === "mp4" && f.url)
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

  if (prefer1080) {
    const best = mp4s.find((f) => /1080x|1920x1080/.test(f.url)) ?? mp4s[0];
    return best?.url;
  }

  const with720 = mp4s.filter((f) => /[^0-9]720x|x720[^0-9]|1280x720|1206x720|1252x720|722x720|1126x720/.test(f.url));
  if (with720.length) {
    return with720.sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0].url;
  }
  return mp4s[mp4s.length - 1]?.url ?? mp4s[0]?.url;
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, buf);
  return buf.length;
}

async function main() {
  for (const demo of DEMO_SPECS) {
    const tweetId = demo.tweetId;
    const dir = path.join(OUT, demo.id);
    const posterPath = path.join(dir, "poster.jpg");
    const videoPath = path.join(dir, "video.mp4");

    if (!force) {
      try {
        const [p, v] = await Promise.all([fs.stat(posterPath), fs.stat(videoPath)]);
        if (p.size > 0 && v.size > 0) {
          console.log(`skip ${demo.id} (already present)`);
          continue;
        }
      } catch {
        /* fetch */
      }
    }

    console.log(`fetch ${demo.id} (${tweetId})…`);
    const api = await fetch(`https://api.fxtwitter.com/status/${tweetId}`);
    const json = await api.json();
    const media = json.tweet?.media?.all?.[0];
    if (!media) {
      console.warn(`  no media on tweet ${tweetId}`);
      continue;
    }

    const prefer1080 = demo.prefer1080;
    const videoUrl = pickMp4Url(media.formats, prefer1080) ?? media.url;
    const posterUrl = media.thumbnail_url;

    const posterBytes = await download(posterUrl, posterPath);
    const videoBytes = await download(videoUrl, videoPath);
    console.log(
      `  poster ${(posterBytes / 1024).toFixed(0)} KiB, video ${(videoBytes / 1024 / 1024).toFixed(1)} MiB`,
    );
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
