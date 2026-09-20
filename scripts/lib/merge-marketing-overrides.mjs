import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ATTRIBUTION_RE = /awesomejev|indexed from|sourced from/i;

export function mergeMarketingOverrides(catalogPath) {
  const overridesPath = path.join(
    __dirname,
    "../../src/data/catalog-marketing-overrides.json",
  );
  const raw = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const overrides = fs.existsSync(overridesPath)
    ? JSON.parse(fs.readFileSync(overridesPath, "utf8"))
    : {};

  const merged = raw.map((item) => {
    let next = { ...item };
    const patch = overrides[next.slug];
    if (patch) next = { ...next, ...patch };

    if (next.verifiedNote && ATTRIBUTION_RE.test(next.verifiedNote)) {
      delete next.verifiedNote;
    }
    if (next.sourceNote && ATTRIBUTION_RE.test(next.sourceNote)) {
      delete next.sourceNote;
    }
    return next;
  });

  fs.writeFileSync(catalogPath, JSON.stringify(merged, null, 0));
}
