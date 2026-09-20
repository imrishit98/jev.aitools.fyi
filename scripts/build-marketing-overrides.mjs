/**
 * Builds catalog-marketing-overrides.json for every indexable detail page.
 * Preserves existing hand-written entries; fills gaps with fact-grounded marketing copy.
 *
 * Run: node scripts/build-marketing-overrides.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const require = createRequire(import.meta.url);
const viteEntry = require.resolve("vite", {
  paths: [require.resolve("astro")],
});
const { createServer } = await import(viteEntry);
const vite = await createServer({
  configFile: resolve(root, "astro.config.mjs"),
  resolve: { alias: { "@": resolve(root, "src") } },
  logLevel: "error",
});
const itemsMod = await vite.ssrLoadModule("/src/lib/items.ts");
await vite.close();

const detail = itemsMod.getItemsWithDetailPages();
const HAND_ONE_LINERS = {
  "jarrodwatts-jev-trader":
    "One AI trade call every Monad block on Kuru MON-USDC, with Jev picking the move instead of a market essay.",
  "theoleecj-semif":
    "Semantic ifs on a home 3090: open models doing structured branches without pretending to be TypeSafe.",
  "vercel-eve":
    "Vercel's agent framework with Jev wired into the experimental evaluate path, so scoring stays typed.",
  "browser-use-jev-ultrafast":
    "Jev picks the browser op and DOM target in one shot; a tiny LLM only shows up when something needs typing.",
  "vercel-labs-ai-cli":
    "Vercel Labs terminal CLI that can point evaluate at Jev instead of another vibes-based judge.",
  "typesafe-ai-skills":
    "Official Claude Code / Codex skill pack for Jev primitives, patterns, and evaluation shape.",
  "typesafe-ai-system-one-adapter-python":
    "Drop-in TypeSafeClient replacement over OpenAI, Anthropic, and friends, still asking typed System One questions.",
};

const HAND_DESCRIPTIONS = {
  "workflow-evals": {
    oneLiner:
      "How TypeSafe benchmarks System One on real workflows, with numbers you can argue about in standup.",
    description:
      "Published methodology and per-model results for System One workflow evaluations. Use it when you need to compare latency, calibration, or task win rates against something official, not a screenshot from someone's laptop. Pair with the HTTP API reference when you are reproducing eval harnesses in your own repo.",
  },
  primitives: {
    description:
      "The doc page that finally separates the primitives: when to ask for a discrete label, a graded score, or a structured Noul object, and what comes back on the wire. Read it once and stop treating every Jev integration like a chat completion with extra steps. Your future self will thank you when thresholds live in code, not in prompt footnotes.",
  },
  patterns: {
    description:
      "TypeSafe's pattern catalog for production-shaped Jev workflows: parallel questions, composite scoring, intent routing, and the guardrail moves that keep agents from free-texting their way into incidents. Use it as a checklist when you review agent PRs, not as inspiration for another bespoke router.",
  },
  "typesafe-ai-typesafe-sdk-python": {
    description:
      "pip install typesafe-sdk and get maintained wrappers around POST /v1/systemone with Python-native ergonomics for Choice, Score, and Noul. Same contract as the JavaScript SDK, different packaging, equally allergic to stringly-typed agent output. Sync or async, notebooks or services, pick your poison.",
  },
};

const existingPath = resolve(root, "src/data/catalog-marketing-overrides.json");
const existing = {
  ...JSON.parse(readFileSync(existingPath, "utf8")),
  ...Object.fromEntries(
    Object.entries(HAND_ONE_LINERS).map(([slug, oneLiner]) => [
      slug,
      { ...(JSON.parse(readFileSync(existingPath, "utf8"))[slug] ?? {}), oneLiner },
    ]),
  ),
};
for (const [slug, patch] of Object.entries(HAND_DESCRIPTIONS)) {
  existing[slug] = { ...(existing[slug] ?? {}), ...patch };
}

const EM_DASH = /\u2014|\u2013/g;

function clean(text) {
  return text
    .replace(EM_DASH, ", ")
    .replace(/\s+/g, " ")
    .replace(/\.\.\./g, "")
    .trim();
}

function stripRoboticLead(text) {
  return text
    .replace(/^this is an?\s+/i, "")
    .replace(/^request and response contract for\s+/i, "")
    .trim();
}

const CATEGORY_PITCH = {
  official:
    "Canonical TypeSafe material: treat it like docs with personality, not a scraped index row.",
  sdks:
    "Same POST /v1/systemone contract, wrapped for your language so you stop hand-rolling JSON in prod.",
  integrations:
    "Glue code for gateways, agents, and platforms that should stay typed instead of chatty.",
  "agent-tooling":
    "Agent plumbing where probabilities beat regex on model output. Fork the pattern, not the prose.",
  "browser-computer-use":
    "Pick the next click from a finite action list, fast enough to feel like automation, not theatre.",
  applications:
    "A shipped workflow you can study before you bet your own traffic on the same gate style.",
  games:
    "Playable proof that discrete Jev choices beat joystick LLM improv. Fun demo, serious latency lesson.",
  playgrounds:
    "Sandbox first, invoice later: poke at Choice, Score, and Noul before you wire billing.",
  benchmarks:
    "Numbers, harnesses, and comparisons you can rerun on your hardware instead of trusting a screenshot.",
  guides:
    "Reading queue from builders: essays, lists, and launch threads to supplement official docs.",
};

function firstSentence(text) {
  const m = text.match(/^[^.!?]+[.!?]?/);
  return m ? m[0].trim() : text.slice(0, 120);
}

function punchyOneLiner(item, facts) {
  const hand = existing[item.slug]?.oneLiner;
  const sluggyPrefix = /^[a-z0-9.-]+\:\s/i;
  if (hand && hand.length >= 40 && !sluggyPrefix.test(hand)) return clean(hand);

  let lead = stripRoboticLead(firstSentence(facts));
  if (lead.endsWith(",")) lead = lead.slice(0, -1);
  if (lead.length > 155) {
    lead = `${lead.slice(0, 152).trim()}...`;
  }
  return clean(lead);
}

function expandDescription(item, facts, oneLiner) {
  const hand = existing[item.slug]?.description;
  if (hand && hand.length >= 180 && hand !== oneLiner) return clean(hand);

  const pitch = CATEGORY_PITCH[item.category] ?? CATEGORY_PITCH.integrations;
  const tagHint =
    item.tags?.length > 0
      ? ` Tags in the wild: ${item.tags.slice(0, 3).join(", ")}.`
      : "";

  let core = stripRoboticLead(facts);
  if (core === oneLiner || core.length < 60) {
    core = `${item.title} in the Jev ecosystem. ${facts}`;
  }

  const cta =
    item.demoUrl && item.repoUrl
      ? "Skim the repo for setup, then open the demo when you want proof before you merge anything."
      : item.repoUrl
        ? "The repo has install steps, env vars, and recent commits if you are deciding whether to depend on it."
        : "Follow the primary link for the author's latest notes and setup quirks.";

  const body = `${core} ${pitch}${tagHint} ${cta}`;
  return clean(body);
}

const DEMOTE_SLUGS = new Set([
  // Thin link-roundups better as explore-only outbound links
  "early-jev-tools-roundup",
  "hacker-news-launch-thread",
]);

const out = { ...existing };
let generated = 0;
let demoted = 0;

for (const item of detail) {
  if (DEMOTE_SLUGS.has(item.slug)) {
    out[item.slug] = { ...(out[item.slug] ?? {}), indexOnly: true };
    demoted++;
    continue;
  }

  if (
    out[item.slug]?.oneLiner &&
    out[item.slug]?.description &&
    out[item.slug].description.length >= 180 &&
    out[item.slug].oneLiner !== out[item.slug].description &&
    !/^[a-z0-9.-]+\:\s/i.test(out[item.slug].oneLiner)
  ) {
    continue;
  }

  const facts = clean(item.description || item.oneLiner || item.title);
  const oneLiner = punchyOneLiner(item, facts);
  const description = expandDescription(item, facts, oneLiner);

  out[item.slug] = {
    ...(out[item.slug] ?? {}),
    oneLiner,
    description,
  };
  generated++;
}

writeFileSync(existingPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  `Wrote ${Object.keys(out).length} overrides (${generated} generated/updated, ${demoted} demoted, ${Object.keys(existing).length} prior hand entries).`,
);
