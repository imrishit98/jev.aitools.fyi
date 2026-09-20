/**
 * Download showcase demo posters + MP4s into public/demos/ from X tweet IDs.
 * Run: node scripts/fetch-demos.mjs
 * Requires network; safe to re-run (skips existing files unless --force).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "demos");
const force = process.argv.includes("--force");

/** Keep in sync with src/data/showcase-demos.ts showcaseDemoFetchHints */
const DEMO_SPECS = [
  { id: "tanstack-ai-decide-tanstack", tweetId: "2101659024890765819", prefer1080: false },
  { id: "smart-copy-paste-marcus-lowe", tweetId: "2101476399488160013", prefer1080: false },
  { id: "ploy-jev-websites-bryantchou", tweetId: "2101485995669770522", prefer1080: false },
  { id: "clera-jobs-sebastianscott", tweetId: "2101429879078330390", prefer1080: false },
  { id: "ui-flow-capture-omarjpeg", tweetId: "2101047036863037753", prefer1080: false },
  { id: "rtrvr-jev-bkalisetty", tweetId: "2100693198175928707", prefer1080: false },
  { id: "jev-codes-kushwho", tweetId: "2101103318386758011", prefer1080: false },
  { id: "your-signal-fabioangela79", tweetId: "2101013867627159592", prefer1080: false },
  { id: "computer-use-speed-savboj", tweetId: "2100545295201288678", prefer1080: false },
  { id: "jev-captcha-arbitrage-kenonews", tweetId: "2101656436136661163", prefer1080: false },
  { id: "laya-mlx-lonely-mh", tweetId: "2101626594452492450", prefer1080: false },
  { id: "browser-ultrafast-gregpr07", tweetId: "2100411066966749359", prefer1080: false },
  { id: "json-render-ctatedev", tweetId: "2101022101750571357", prefer1080: true },
  { id: "spreadsheets-intent-dabit3", tweetId: "2100780008193020049", prefer1080: false },
  { id: "zillow-venturetwins", tweetId: "2101341075684434245", prefer1080: false },
  { id: "magic-jev-ball-acharyaagamya", tweetId: "2101129105676861621", prefer1080: false },
  { id: "canada-measure-plan", tweetId: "2101315424247820309", prefer1080: false },
  { id: "find-in-page-jiayao", tweetId: "2101108866713063804", prefer1080: false },
  { id: "typeahead-ui-mikegee", tweetId: "2101098282655338995", prefer1080: false },
  { id: "jevform-tamirspiritt", tweetId: "2101079101997982037", prefer1080: false },
  { id: "jargon-pigeon-prkeshari", tweetId: "2101048015720951975", prefer1080: false },
  { id: "ask-jev-waynesutton", tweetId: "2100487878992388279", prefer1080: false },
  { id: "gmail-intent-dabit3", tweetId: "2100960281769738433", prefer1080: false },
  { id: "traffic-guard-gnumanth", tweetId: "2100963107552280754", prefer1080: false },
  { id: "higgsfield-routing", tweetId: "2101022133753430365", prefer1080: false },
  { id: "opencode-tetris-tanaysoni", tweetId: "2101020844092756072", prefer1080: false },
  { id: "snack-scoring-nikunj", tweetId: "2101006585481073093", prefer1080: false },
  { id: "designer-heystefan", tweetId: "2101369117496521042", prefer1080: false },
  { id: "context-compaction-tamarajtran", tweetId: "2100694549362553153", prefer1080: false },
  { id: "jev-chess-qibinlou", tweetId: "2100676619815862464", prefer1080: false },
  { id: "ad-blocker-iam-zachi", tweetId: "2100529273186472318", prefer1080: false },
  { id: "pkg-gate-gnumanth", tweetId: "2100405456187564201", prefer1080: false },
  { id: "code-review-gate-kunal", tweetId: "2101027586587738151", prefer1080: false, posterOnly: true },
  { id: "lurk-mxfp4", tweetId: "2101070906852298910", prefer1080: false },
  { id: "ryze-irabukht", tweetId: "2101375295152652372", prefer1080: false },
  { id: "seo-cost-hamonpaulm", tweetId: "2101265909826609278", prefer1080: false },
  { id: "dub-malicious-urls-steventey", tweetId: "2101706435898069093", prefer1080: false },
  { id: "flutter-genui-jev-abdallahsh07", tweetId: "2101719364450046351", prefer1080: false },
  { id: "chat-negative-comments-developedbyed", tweetId: "2101628206478512341", prefer1080: false },
  { id: "avec-email-priority-jnnnthnn", tweetId: "2101399331115077760", prefer1080: false },
  { id: "atonomi-monetization-everestchris6", tweetId: "2101706320261128398", prefer1080: false },
  { id: "twitter-bookmarks-alexchristou", tweetId: "2101674202361221376", prefer1080: false },
  {
    id: "toothless-addressee-ashutoshpuro97",
    tweetId: "2101660362882085299",
    prefer1080: false,
    maxDurationSec: 90,
  },
  { id: "openrouter-news-brands-k2sbhai", tweetId: "2101408270128935071", prefer1080: false },
  { id: "pixelml-av-grok-jev-seanphan", tweetId: "2101398226654171359", prefer1080: false },
  { id: "egghead-procurement-sakai1910", tweetId: "2101536551360704770", prefer1080: false },
  { id: "hypit-ugc-styles-hypitai", tweetId: "2101686320909426977", prefer1080: false },
  { id: "x-reply-skip-itspavangk", tweetId: "2101388322077917388", prefer1080: false },
  { id: "opencode-palette-sonnylazuardi", tweetId: "2101699901461864664", prefer1080: false },
  { id: "moongotchi-trading-bot-moongotchi", tweetId: "2101320141065609294", prefer1080: false },
  { id: "nhtsa-complaints-kanaworks", tweetId: "2101509756737462446", prefer1080: false },
  { id: "docjev-jerryjliu0", tweetId: "2101738281046294552", prefer1080: false },
];

function pickMp4Url(formats, prefer1080 = false) {
  const mp4s = (formats ?? [])
    .filter((f) => f.container === "mp4" && f.url)
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

  if (prefer1080) {
    const best = mp4s.find((f) => /1080x|1920x1080/.test(f.url)) ?? mp4s[0];
    return best?.url;
  }

  const with720 = mp4s.filter((f) =>
    /[^0-9]720x|x720[^0-9]|1280x720|1206x720|1252x720|722x720|1126x720|1104x720|890x720/.test(
      f.url,
    ),
  );
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
        const posterStat = await fs.stat(posterPath);
        if (demo.posterOnly && posterStat.size > 0) {
          console.log(`skip ${demo.id} (poster already present)`);
          continue;
        }
        const videoStat = await fs.stat(videoPath);
        if (posterStat.size > 0 && videoStat.size > 0) {
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
    const allMedia = json.tweet?.media?.all ?? [];
    const videoMedia = allMedia.find((m) => m.type === "video" || m.formats?.length);
    const imageMedia = allMedia.find((m) => m.type === "photo" || m.type === "image");

    if (!videoMedia && !imageMedia) {
      console.warn(`  no media on tweet ${tweetId}`);
      continue;
    }

    const posterUrl =
      videoMedia?.thumbnail_url ?? imageMedia?.url ?? imageMedia?.thumbnail_url;
    if (posterUrl) {
      const posterBytes = await download(posterUrl, posterPath);
      console.log(`  poster ${(posterBytes / 1024).toFixed(0)} KiB`);
    }

    if (demo.posterOnly) {
      console.log(`  poster-only demo`);
      continue;
    }

    const videoUrl =
      pickMp4Url(videoMedia?.formats, demo.prefer1080) ?? videoMedia?.url;
    if (!videoUrl) {
      console.warn(`  no video URL for ${tweetId}`);
      continue;
    }

    const videoBytes = await download(videoUrl, videoPath);
    console.log(`  video ${(videoBytes / 1024 / 1024).toFixed(1)} MiB`);

    if (demo.maxDurationSec) {
      const trimmed = path.join(dir, "video.trim.mp4");
      await execFileAsync("ffmpeg", [
        "-y",
        "-i",
        videoPath,
        "-t",
        String(demo.maxDurationSec),
        "-c",
        "copy",
        trimmed,
      ]);
      await fs.rename(trimmed, videoPath);
      const stat = await fs.stat(videoPath);
      console.log(`  trimmed to ${demo.maxDurationSec}s (${(stat.size / 1024 / 1024).toFixed(1)} MiB)`);
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
