/**
 * Refresh remote poster + video URLs from X tweets (fxtwitter API).
 * Writes src/data/showcase-demo-media.json — no binaries in public/demos.
 * In-app playback: ShowcaseDemoVideo sets referrerPolicy=no-referrer (twimg 403s with site Referer).
 *
 * Run: node scripts/sync-showcase-demo-media.mjs
 * Optional: --force to refetch all; default skips ids already present.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "showcase-demo-media.json");
const force = process.argv.includes("--force");

/** Prefer ≤720p MP4; fall back to 1080p; never pick 4K first. */
function pickMp4Url(formats, prefer1080 = false) {
  const mp4s = (formats ?? [])
    .filter((f) => f.container === "mp4" && f.url)
    .sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0));

  if (prefer1080) {
    const at1080 =
      mp4s.find((f) => /1920x1080|1080x1920|1206x720|1280x720/.test(f.url)) ??
      mp4s.find((f) => /1080/.test(f.url));
    if (at1080) return at1080.url;
  }

  const with720 = mp4s.filter((f) =>
    /[^0-9]720x|x720[^0-9]|1280x720|1206x720|1252x720|958x720|640x360/.test(
      f.url,
    ),
  );
  if (with720.length) {
    return with720.sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0].url;
  }

  const at1080 = mp4s.find((f) => /1080x|1920x/.test(f.url));
  if (at1080) return at1080.url;

  return mp4s[mp4s.length - 1]?.url ?? mp4s[0]?.url;
}

/** Keep in sync with showcaseDemoFetchHints in showcase-demos.ts */
const DEMO_SPECS = [
  { id: "tanstack-ai-decide-tanstack", tweetId: "2101659024890765819" },
  { id: "smart-copy-paste-marcus-lowe", tweetId: "2101476399488160013" },
  { id: "ploy-jev-websites-bryantchou", tweetId: "2101485995669770522" },
  { id: "clera-jobs-sebastianscott", tweetId: "2101429879078330390" },
  { id: "ui-flow-capture-omarjpeg", tweetId: "2101047036863037753" },
  { id: "rtrvr-jev-bkalisetty", tweetId: "2100693198175928707" },
  { id: "jev-codes-kushwho", tweetId: "2101103318386758011" },
  { id: "your-signal-fabioangela79", tweetId: "2101013867627159592" },
  { id: "computer-use-speed-savboj", tweetId: "2100545295201288678" },
  { id: "jev-captcha-arbitrage-kenonews", tweetId: "2101656436136661163" },
  { id: "laya-mlx-lonely-mh", tweetId: "2101626594452492450" },
  { id: "browser-ultrafast-gregpr07", tweetId: "2100411066966749359" },
  { id: "json-render-ctatedev", tweetId: "2101022101750571357", prefer1080: true },
  { id: "spreadsheets-intent-dabit3", tweetId: "2100780008193020049" },
  { id: "zillow-venturetwins", tweetId: "2101341075684434245" },
  { id: "magic-jev-ball-acharyaagamya", tweetId: "2101129105676861621" },
  { id: "canada-measure-plan", tweetId: "2101315424247820309" },
  { id: "find-in-page-jiayao", tweetId: "2101108866713063804" },
  { id: "typeahead-ui-mikegee", tweetId: "2101098282655338995" },
  { id: "jevform-tamirspiritt", tweetId: "2101079101997982037" },
  { id: "jargon-pigeon-prkeshari", tweetId: "2101048015720951975" },
  { id: "ask-jev-waynesutton", tweetId: "2100487878992388279" },
  { id: "gmail-intent-dabit3", tweetId: "2100960281769738433" },
  { id: "traffic-guard-gnumanth", tweetId: "2100963107552280754" },
  { id: "higgsfield-routing", tweetId: "2101022133753430365" },
  { id: "opencode-tetris-tanaysoni", tweetId: "2101020844092756072" },
  { id: "snack-scoring-nikunj", tweetId: "2101006585481073093" },
  { id: "designer-heystefan", tweetId: "2101369117496521042" },
  { id: "context-compaction-tamarajtran", tweetId: "2100694549362553153" },
  { id: "jev-chess-qibinlou", tweetId: "2100676619815862464" },
  { id: "ad-blocker-iam-zachi", tweetId: "2100529273186472318" },
  { id: "pkg-gate-gnumanth", tweetId: "2100405456187564201" },
  { id: "code-review-gate-kunal", tweetId: "2101027586587738151", posterOnly: true },
  { id: "lurk-mxfp4", tweetId: "2101070906852298910" },
  { id: "ryze-irabukht", tweetId: "2101375295152652372" },
  { id: "seo-cost-hamonpaulm", tweetId: "2101265909826609278" },
  { id: "dub-malicious-urls-steventey", tweetId: "2101706435898069093" },
  { id: "flutter-genui-jev-abdallahsh07", tweetId: "2101719364450046351" },
  { id: "chat-negative-comments-developedbyed", tweetId: "2101628206478512341" },
  { id: "avec-email-priority-jnnnthnn", tweetId: "2101399331115077760" },
  { id: "atonomi-monetization-everestchris6", tweetId: "2101706320261128398" },
  { id: "twitter-bookmarks-alexchristou", tweetId: "2101674202361221376" },
  { id: "toothless-addressee-ashutoshpuro97", tweetId: "2101660362882085299" },
  { id: "openrouter-news-brands-k2sbhai", tweetId: "2101408270128935071" },
  { id: "pixelml-av-grok-jev-seanphan", tweetId: "2101398226654171359" },
  { id: "egghead-procurement-sakai1910", tweetId: "2101536551360704770" },
  { id: "hypit-ugc-styles-hypitai", tweetId: "2101686320909426977" },
  { id: "x-reply-skip-itspavangk", tweetId: "2101388322077917388" },
  { id: "opencode-palette-sonnylazuardi", tweetId: "2101699901461864664" },
  { id: "moongotchi-trading-bot-moongotchi", tweetId: "2101320141065609294" },
  { id: "nhtsa-complaints-kanaworks", tweetId: "2101509756737462446" },
  { id: "docjev-jerryjliu0", tweetId: "2101738281046294552" },
  { id: "jev-fifa-rebuild-shubhankar", tweetId: "2101830589620056160" },
  { id: "jev-dodge-realtime-abolbuild", tweetId: "2100509548339408972" },
  { id: "jev-doom-realtime-ziwenxu", tweetId: "2100039609958727756" },
  { id: "typesafe-mario-faadilhshaik", tweetId: "2100086301894881578" },
  { id: "jev-shootout-goalie-peytoncasper", tweetId: "2101724157587357977" },
  { id: "jev-as-judge-kylejeong", tweetId: "2101832317862056149" },
  { id: "jev-agent-economics-mika", tweetId: "2101745157846823228" },
  { id: "jevrls-supabase-carolmonroe", tweetId: "2101747586126557230" },
  { id: "logview-semantic-iurysza", tweetId: "2101770705155010568" },
  { id: "jevarcade-seven-games-thisiskp", tweetId: "2101846703091376219" },
  { id: "jev-trader-jarrodwatts", tweetId: "2100356151468585346" },
  { id: "1kpapers-nutlope", tweetId: "2100426999546184123" },
  { id: "pg-jev-iam-zachi", tweetId: "2100679300756435135" },
  { id: "ai-slop-detector-kraayenjon", tweetId: "2101157548346794059" },
  { id: "superx-post-scoring-robj3d3", tweetId: "2100722975645598191" },
];

async function main() {
  let existing = {};
  try {
    existing = JSON.parse(await fs.readFile(OUT, "utf8"));
  } catch {
    /* fresh */
  }

  const out = { ...existing };

  for (const spec of DEMO_SPECS) {
    if (!force && out[spec.id]?.posterUrl) {
      console.log(`skip ${spec.id} (already in JSON)`);
      continue;
    }

    console.log(`fetch ${spec.id} (${spec.tweetId})…`);
    const api = await fetch(`https://api.fxtwitter.com/status/${spec.tweetId}`);
    if (!api.ok) {
      console.warn(`  HTTP ${api.status}`);
      continue;
    }
    const json = await api.json();
    const allMedia = json.tweet?.media?.all ?? [];
    const videoMedia = allMedia.find((m) => m.type === "video" || m.formats?.length);
    const imageMedia = allMedia.find((m) => m.type === "photo" || m.type === "image");

    const articleCover =
      json.tweet?.article?.cover_media?.media_info?.original_img_url ?? "";

    const posterUrl =
      videoMedia?.thumbnail_url ??
      imageMedia?.url ??
      imageMedia?.thumbnail_url ??
      articleCover ??
      "";

    if (!posterUrl) {
      console.warn(`  no poster for ${spec.id}`);
      continue;
    }

    if (spec.posterOnly) {
      out[spec.id] = { posterUrl, posterOnly: true };
      console.log(`  poster-only`);
      continue;
    }

    const videoUrl =
      pickMp4Url(videoMedia?.formats, spec.prefer1080) ?? videoMedia?.url;
    if (!videoUrl) {
      console.warn(`  no video for ${spec.id}`);
      out[spec.id] = { posterUrl, posterOnly: true };
      continue;
    }

    out[spec.id] = { posterUrl, videoUrl };
    console.log(`  ok`);
  }

  await fs.writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${OUT} (${Object.keys(out).length} demos)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
