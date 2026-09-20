/**
 * Header nav contract checks at key viewport widths.
 * Run: node scripts/verify-header-nav.mjs (requires preview on :4321)
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.PREVIEW_URL ?? "http://127.0.0.1:4321/";
const OUT = join(process.cwd(), "artifacts", "header-nav-verify");
mkdirSync(OUT, { recursive: true });

const WIDTHS = [
  { w: 375, label: "mobile-375" },
  { w: 768, label: "tablet-768" },
  { w: 834, label: "tablet-834" },
  { w: 1024, label: "desktop-1024" },
  { w: 1280, label: "desktop-1280" },
];

async function probe(page) {
  return page.evaluate(() => {
    const header = document.querySelector("header");
    const nav = document.querySelector('nav[aria-label="Main"]');
    const moreBtn = header?.querySelector('[data-slot="dropdown-menu-trigger"]');
    const menuBtn = header?.querySelector('button[aria-label="Open menu"]');
    const row = header?.firstElementChild;
    let segmentOverlap = false;
    if (row) {
      const rects = [...row.children].map((c) => c.getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          if (
            a.width > 0 &&
            b.width > 0 &&
            a.left < b.right - 2 &&
            b.left < a.right - 2 &&
            a.top < b.bottom &&
            b.top < a.top + a.height
          ) {
            segmentOverlap = true;
          }
        }
      }
    }
    return {
      headerCount: document.querySelectorAll("header").length,
      headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
      rowOverflow: row ? row.scrollWidth > row.clientWidth + 2 : false,
      segmentOverlap,
      navVisible: nav ? nav.offsetParent !== null : false,
      moreVisible: moreBtn ? moreBtn.offsetParent !== null : false,
      menuBtnVisible: menuBtn ? menuBtn.offsetParent !== null : false,
    };
  });
}

const browser = await chromium.launch();
const failures = [];

for (const { w, label } of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  page.on("pageerror", (e) => failures.push(`${label}: ${e.message}`));
  await page.goto(BASE, { waitUntil: "networkidle" });

  const closed = await probe(page);
  await page.screenshot({ path: join(OUT, `${label}-closed.png`) });

  const isDesktop = w >= 1024;
  if (isDesktop) {
    if (!closed.navVisible) failures.push(`${label}: expected inline nav at lg+`);
    if (!closed.moreVisible) failures.push(`${label}: expected More at lg+`);
    if (closed.menuBtnVisible) failures.push(`${label}: hamburger should be hidden at lg+`);
    await page.getByRole("button", { name: "More" }).click();
    await page.waitForTimeout(400);
    const afterMore = await probe(page);
    if (afterMore.headerCount !== 1) failures.push(`${label}: header unmounted on More`);
    await page.screenshot({ path: join(OUT, `${label}-more-open.png`) });
    await page.keyboard.press("Escape");
  } else {
    if (closed.navVisible) failures.push(`${label}: inline nav must be hidden below lg`);
    if (closed.moreVisible) failures.push(`${label}: More must be hidden below lg`);
    if (!closed.menuBtnVisible) failures.push(`${label}: hamburger must show below lg`);
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(500);
    const open = await probe(page);
    if (open.headerCount !== 1) failures.push(`${label}: header unmounted on sheet open`);
    await page.screenshot({ path: join(OUT, `${label}-sheet-open.png`) });
    await page.keyboard.press("Escape");
  }

  if (closed.rowOverflow) failures.push(`${label}: header row horizontal overflow`);
  if (closed.segmentOverlap) failures.push(`${label}: header segments overlap`);

  console.log(label, closed);
  await page.close();
}

await browser.close();

if (failures.length) {
  console.error("\nFAILURES:");
  for (const f of failures) console.error(" -", f);
  process.exit(1);
}
console.log("\nAll header nav checks passed. Screenshots in", OUT);
