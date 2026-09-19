import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";
import { categories } from "../src/data/categories-data.ts";
import { learnGuides } from "../src/data/learn-guides.ts";
import catalog from "../src/data/catalog.json";
import type { DirectoryItem } from "../src/data/types.ts";
import { loadOgFonts } from "./og/fonts.mjs";
import { OgImage, OG_HEIGHT, OG_WIDTH } from "./og/template.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "og");

const args = new Set(process.argv.slice(2));
const samplesOnly = args.has("--samples");

async function renderPng(
  element: ReturnType<typeof OgImage>,
  fonts: Awaited<ReturnType<typeof loadOgFonts>>,
) {
  const svg = await satori(element, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

async function writeOg(
  relativePath: string,
  element: ReturnType<typeof OgImage>,
  fonts: Awaited<ReturnType<typeof loadOgFonts>>,
) {
  const dest = path.join(OUT_DIR, relativePath);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const png = await renderPng(element, fonts);
  await fs.writeFile(dest, png);
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<void>,
) {
  let index = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const i = index++;
      await fn(items[i]!, i);
    }
  });
  await Promise.all(workers);
}

function sanitize(text: string) {
  return text
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .trim();
}

async function main() {
  console.log("Generating Open Graph images…");
  const fonts = await loadOgFonts();
  await fs.mkdir(OUT_DIR, { recursive: true });

  await writeOg(
    "home.png",
    OgImage({
      variant: "home",
      title: "Everything useful with Jev",
      subtitle:
        "SDKs, agents, demos, and integrations on TypeSafe System One.",
    }),
    fonts,
  );

  await writeOg(
    "default.png",
    OgImage({
      variant: "default",
      title: "Jev Directory",
      subtitle: "Curated listings for TypeSafe Jev and the ecosystem.",
    }),
    fonts,
  );

  await writeOg(
    "explore.png",
    OgImage({
      variant: "hub",
      title: "Explore the directory",
      subtitle: "Filter by category, collection, and tags.",
    }),
    fonts,
  );

  await writeOg(
    "learn/index.png",
    OgImage({
      variant: "learn",
      title: "Learn Jev",
      subtitle: "Guides on System One, TypeSafe, and integrations.",
    }),
    fonts,
  );

  for (const guide of Object.values(learnGuides)) {
    await writeOg(
      `learn/${guide.slug}.png`,
      OgImage({
        variant: "learn",
        title: sanitize(guide.title),
        subtitle: sanitize(guide.description),
      }),
      fonts,
    );
  }

  if (samplesOnly) {
    console.log("Sample OG images written to public/og/");
    return;
  }

  for (const cat of categories) {
    await writeOg(
      `categories/${cat.slug}.png`,
      OgImage({
        variant: "hub",
        title: sanitize(cat.title),
        subtitle: sanitize(cat.seoDescription || cat.description),
        badge: "Category",
      }),
      fonts,
    );
  }

  const items = catalog as DirectoryItem[];
  const catBySlug = new Map(categories.map((c) => [c.slug, c]));

  let done = 0;
  const total = items.length;
  await mapPool(items, 16, async (item) => {
    const cat = catBySlug.get(item.category);
    await writeOg(
      `items/${item.slug}.png`,
      OgImage({
        variant: "listing",
        title: sanitize(item.title),
        subtitle: sanitize(item.oneLiner),
        badge: cat ? sanitize(cat.title) : sanitize(item.category),
      }),
      fonts,
    );
    done += 1;
    if (done % 50 === 0 || done === total) {
      console.log(`  listings ${done}/${total}`);
    }
  });

  const samplesDir = path.join(ROOT, "docs", "og-samples");
  await fs.mkdir(samplesDir, { recursive: true });
  for (const name of ["home.png", "explore.png", "default.png"]) {
    await fs.copyFile(path.join(OUT_DIR, name), path.join(samplesDir, name));
  }
  const sampleItem = items.find((i) => i.featured) ?? items[0];
  if (sampleItem) {
    await fs.copyFile(
      path.join(OUT_DIR, `items/${sampleItem.slug}.png`),
      path.join(samplesDir, `item-${sampleItem.slug}.png`),
    );
  }
  const sampleCat = categories[0];
  if (sampleCat) {
    await fs.copyFile(
      path.join(OUT_DIR, `categories/${sampleCat.slug}.png`),
      path.join(samplesDir, `category-${sampleCat.slug}.png`),
    );
  }

  console.log(
    `Done. ${total + categories.length + Object.keys(learnGuides).length + 4} images in public/og/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
