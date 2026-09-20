import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSearchIndexEntries } from "../src/lib/search-index.ts";
import { getAllItems } from "../src/lib/items.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "search-index.json");

async function main() {
  const entries = buildSearchIndexEntries(getAllItems());
  await fs.writeFile(OUT, `${JSON.stringify(entries)}\n`, "utf8");
  console.log(`Wrote ${entries.length} search index entries to public/search-index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
