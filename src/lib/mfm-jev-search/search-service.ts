import { createGateway } from "@ai-sdk/gateway";
import { experimental_evaluate } from "ai";
import catalogJson from "../../data/mfm-channel-catalog.json";
import { findCaptionMentions } from "./caption-mentions";
import {
  buildHybridIndex,
  hybridRecall,
  type MfmVideo,
} from "./hybrid-recall";

export type MfmSearchEnv = {
  AI_GATEWAY_API_KEY?: string;
  JEV_MOCK?: string;
};

const MODEL_ID = "typesafe-ai/jev";
const EXISTS_THRESHOLD = 0.28;
const MATCH_THRESHOLD = 0.26;
const SHORTLIST_SIZE = 12;
const SCORE_WEIGHTS = { relevance: 0.4, topic: 0.25, hit: 0.35 };

const FIELD_WEIGHTS = {
  title: 4.0,
  chapters: 2.5,
  captions: 2.4,
  description: 1.2,
  tags: 1.0,
};

const CHANNEL_LABEL = "My First Million";
const CHANNEL_HANDLE = "@MyFirstMillionPod";

function tokenize(text: string) {
  return (text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function keepToken(t: string) {
  if (!t) return false;
  if (t.length >= 3) return true;
  return /^(tv|pc|ai|xr|vr|ar|ps|uk|us|id|3d|4k|hd|saas|mfm)$/i.test(t);
}

function chapterText(video: MfmVideo) {
  return (video.chapters || []).map((c) => c.title || "").join(" ");
}

function fieldTexts(video: MfmVideo) {
  return {
    title: video.title || "",
    chapters: chapterText(video),
    captions: (video.captions || "").slice(0, 120000),
    description: video.description || "",
    tags: Array.isArray(video.tags) ? video.tags.join(" ") : "",
  };
}

function captionSnippetsForQuery(captions: string, query: string, maxSnippets = 3, radius = 180) {
  const caps = (captions || "").trim();
  if (!caps) return [];
  const terms = tokenize(query).filter(keepToken);
  if (!terms.length) return [];
  const lower = caps.toLowerCase();
  const windows: { start: number; end: number; term: string }[] = [];
  for (const term of terms) {
    let from = 0;
    while (windows.length < maxSnippets * 3) {
      const idx = lower.indexOf(term, from);
      if (idx < 0) break;
      const start = Math.max(0, idx - radius);
      const end = Math.min(caps.length, idx + term.length + radius);
      windows.push({ start, end, term });
      from = idx + term.length;
    }
  }
  if (!windows.length) return [];
  windows.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const w of windows) {
    const last = merged[merged.length - 1];
    if (last && w.start <= last.end + 20) last.end = Math.max(last.end, w.end);
    else merged.push({ start: w.start, end: w.end });
  }
  return merged.slice(0, maxSnippets).map((w) => {
    const piece = caps.slice(w.start, w.end).replace(/\s+/g, " ").trim();
    const prefix = w.start > 0 ? "…" : "";
    const suffix = w.end < caps.length ? "…" : "";
    return prefix + piece + suffix;
  });
}

function candidateBlob(video: MfmVideo, query = "", maxChars = 2000) {
  const parts: string[] = [];
  parts.push(`Title: ${video.title}`);
  if (video.tags?.length) parts.push(`Tags: ${video.tags.slice(0, 12).join(", ")}`);
  const ch = chapterText(video);
  if (ch) parts.push(`Chapters: ${ch.slice(0, 300)}`);
  const desc = (video.description || "").trim();
  if (desc) parts.push(`Description: ${desc.slice(0, 500)}`);
  const caps = (video.captions || "").trim();
  if (caps) {
    const snips = captionSnippetsForQuery(caps, query);
    if (snips.length) {
      parts.push(`Transcript matches for "${query}":`);
      for (const s of snips) parts.push(`- ${s}`);
    } else {
      parts.push(`Transcript (start): ${caps.slice(0, 700)}`);
    }
  }
  let blob = parts.join("\n");
  if (blob.length > maxChars) blob = blob.slice(0, maxChars) + "…";
  return blob;
}

type CatalogShape = {
  videos: MfmVideo[];
  enrichStats?: Record<string, unknown>;
  generatedAt?: string;
};

const catalog = catalogJson as CatalogShape;
let videos: MfmVideo[] = catalog.videos || [];
let docs: Record<string, string[]>[] = [];
let df = new Map<string, number>();
let avgdl = 1;
let enrichStats: Record<string, unknown> | null = catalog.enrichStats || null;
let hybridIndex: ReturnType<typeof buildHybridIndex> | null = null;

function rebuildIndex() {
  docs = videos.map((v) => {
    const fields = fieldTexts(v);
    const out: Record<string, string[]> = {};
    for (const [k, text] of Object.entries(fields)) out[k] = tokenize(text);
    return out;
  });
  df = new Map();
  for (const doc of docs) {
    const seen = new Set<string>();
    for (const toks of Object.values(doc)) {
      for (const t of toks) seen.add(t);
    }
    for (const t of seen) df.set(t, (df.get(t) || 0) + 1);
  }
  const lengths = docs.map((d) => Object.values(d).reduce((s, toks) => s + toks.length, 0));
  avgdl = lengths.reduce((s, n) => s + n, 0) / Math.max(videos.length, 1) || 1;
  hybridIndex = buildHybridIndex(videos, docs, df, FIELD_WEIGHTS);
  rebuildEntityLexicon();
}

rebuildIndex();

const SYNONYMS: Record<string, string[]> = {
  acquisition: ["acquire", "microacquire", "buying businesses"],
  acquire: ["acquisition", "microacquire"],
  saas: ["software", "subscription"],
  startup: ["founder", "entrepreneur"],
  founder: ["startup", "entrepreneur"],
  entrepreneur: ["founder", "startup"],
  billionaire: ["wealth", "rich"],
  podcast: ["episode", "mfm"],
  episode: ["podcast", "show"],
  sam: ["sam parr"],
  shaan: ["shaan puri"],
  puri: ["shaan puri"],
  parr: ["sam parr"],
  nft: ["nfts", "crypto"],
  crypto: ["bitcoin", "blockchain"],
  vibe: ["topic", "theme"],
};

const INTENT_CRITERIA = {
  guest: "Looking for a specific person, guest, founder, or named individual",
  series: "Looking for an ongoing series or show format on the channel",
  game: "Looking for a game, console, or tech gadget topic",
  vibe: "Looking for a mood, topic, or business theme without a specific named guest",
  other: "General / unclear / mixed intent",
};

type EntityLex = { key: string; aliases: string[]; kind: "guest" | "series"; count: number };
let entityLexicon: EntityLex[] = [];

function rebuildEntityLexicon() {
  const handleCounts = new Map<string, number>();
  const seriesCounts = new Map<string, number>();
  for (const v of videos) {
    const title = v.title || "";
    for (const m of title.matchAll(/@([\w.]+)/g)) {
      const h = m[1].toLowerCase();
      handleCounts.set(h, (handleCounts.get(h) || 0) + 1);
    }
    const sm = title.match(/^([A-Za-z][A-Za-z0-9'’&/\- ]{2,40}?)\s*[-–—:]/);
    if (sm) {
      const s = sm[1].trim().toLowerCase();
      seriesCounts.set(s, (seriesCounts.get(s) || 0) + 1);
    }
  }
  const lex: EntityLex[] = [];
  for (const [h, n] of handleCounts) {
    if (n < 2) continue;
    const aliases = new Set([h, h.replace(/\./g, " ")]);
    lex.push({ key: h, aliases: [...aliases].filter(Boolean), kind: "guest", count: n });
  }
  const SERIES_STOP = new Set([
    "the",
    "and",
    "with",
    "for",
    "stories",
    "story",
    "season",
    "episode",
    "session",
    "things",
    "vids",
    "vid",
    "million",
    "first",
  ]);
  for (const [s, n] of seriesCounts) {
    if (n < 3) continue;
    const aliases = new Set([s]);
    for (const part of s.split(/\s+/)) {
      if (part.length > 3 && !SERIES_STOP.has(part)) aliases.add(part);
    }
    lex.push({ key: s, aliases: [...aliases], kind: "series", count: n });
  }
  lex.push(
    { key: "sam parr", aliases: ["sam", "sam parr", "samparr"], kind: "guest", count: 999 },
    { key: "shaan puri", aliases: ["shaan", "shaan puri", "shaanpuri"], kind: "guest", count: 999 },
    {
      key: "andrew wilkinson",
      aliases: ["andrew", "wilkinson", "andrew wilkinson"],
      kind: "guest",
      count: 999,
    },
    { key: "my first million", aliases: ["mfm", "my first million", "first million"], kind: "series", count: 999 },
  );
  entityLexicon = lex;
}

function fuzzyIncludes(hay: string, needle: string) {
  if (!needle || needle.length < 3) return false;
  if (hay.includes(needle)) return true;
  if (hay.includes(" ") || needle.length < 5) return false;
  return hay.startsWith(needle.slice(0, 4)) && Math.abs(hay.length - needle.length) <= 1;
}

function localExpand(query: string) {
  const qLower = query.toLowerCase();
  const tokens = tokenize(query);
  const expansions = new Set(tokens);
  const entities: { key: string; kind: string }[] = [];
  const synonymHits: { token: string; expansions: string[] }[] = [];

  const SERIES_CORE_TOKS = new Set([
    "ghost",
    "ghosts",
    "stories",
    "horror",
    "spooky",
    "scary",
    "lyric",
    "lyrics",
    "misheard",
    "song",
  ]);
  const hasDistinctive = tokens.some((t) => keepToken(t) && !SERIES_CORE_TOKS.has(t));
  const SERIES_SYN_KEYS = new Set(["ghost", "ghosts", "horror", "spooky", "lyric", "lyrics", "misheard"]);

  for (const tok of tokens) {
    const syns = SYNONYMS[tok];
    if (!syns) continue;
    if (hasDistinctive && SERIES_SYN_KEYS.has(tok)) continue;
    synonymHits.push({ token: tok, expansions: syns });
    for (const s of syns) for (const t of tokenize(s)) expansions.add(t);
  }

  for (const ent of entityLexicon) {
    const hit = ent.aliases.some((a) => {
      if (a.length < 3) return false;
      if (qLower.includes(a)) return true;
      if (tokens.includes(a)) return true;
      if (a.length < 6) return false;
      return tokens.some((t) => t.length >= 5 && (fuzzyIncludes(a, t) || fuzzyIncludes(t, a)));
    });
    if (!hit) continue;
    if (ent.kind === "series") {
      const distinctive = tokens.filter((t) => keepToken(t) && !SERIES_CORE_TOKS.has(t));
      const fullPhrase = ent.aliases.some((a) => a.includes(" ") && qLower.includes(a));
      if (distinctive.length && !fullPhrase) continue;
    }
    if (!entities.some((e) => e.key === ent.key)) {
      entities.push({ key: ent.key, kind: ent.kind });
      for (const a of ent.aliases) for (const t of tokenize(a)) if (keepToken(t)) expansions.add(t);
      for (const t of tokenize(ent.key)) if (keepToken(t)) expansions.add(t);
    }
  }

  return { tokens, expansions: [...expansions], entities, synonymHits };
}

function isMock(env: MfmSearchEnv) {
  return env.JEV_MOCK === "true" || env.JEV_MOCK === "1";
}

function hasLiveJev(env: MfmSearchEnv) {
  return Boolean(env.AI_GATEWAY_API_KEY?.trim()) && !isMock(env);
}

async function understandQuery(query: string, env: MfmSearchEnv) {
  const local = localExpand(query);
  const knownGuests = entityLexicon
    .filter((e) => e.kind === "guest")
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
    .map((e) => e.key)
    .join(", ");
  const knownSeries = entityLexicon
    .filter((e) => e.kind === "series")
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
    .map((e) => e.key)
    .join(", ");

  let intent = "other";
  let intentProbs: Record<string, number> = {};
  let understandMs = 0;
  let understandError: string | null = null;

  if (isMock(env)) {
    const q = query.toLowerCase();
    if (/sam|shaan|wilkinson|guest|with /.test(q)) intent = "guest";
    else if (/series|episode #|q&a/.test(q)) intent = "series";
    else if (/game|ps5|xbox|nintendo/.test(q)) intent = "game";
    else if (/vibe|topic|business idea/.test(q)) intent = "vibe";
    intentProbs = { [intent]: 0.85 };
  } else if (hasLiveJev(env)) {
    const gateway = createGateway({ apiKey: env.AI_GATEWAY_API_KEY! });
    const state = [
      `You classify a search query for the ${CHANNEL_LABEL} YouTube channel (${CHANNEL_HANDLE}).`,
      `User query: ${query}`,
      `Known recurring guests (sample): ${knownGuests || "(none)"}`,
      `Known series (sample): ${knownSeries || "(none)"}`,
      `Locally matched entities: ${local.entities.map((e) => `${e.kind}:${e.key}`).join(", ") || "(none)"}`,
      "Pick the single best primary intent.",
    ].join("\n");

    const questions = {
      intent: {
        type: "choice" as const,
        instructions: `What is the primary intent of the search query "${query}" for finding ${CHANNEL_LABEL} videos?`,
        criteria: INTENT_CRITERIA,
      },
    };

    const t0 = performance.now();
    try {
      const result = await experimental_evaluate({
        model: gateway.evaluationModel(MODEL_ID),
        state,
        questions,
      });
      understandMs = Math.round(performance.now() - t0);
      intent = result.answers.intent?.choice || "other";
      intentProbs = (result.answers.intent?.probabilities as Record<string, number>) || {};
    } catch (err) {
      understandMs = Math.round(performance.now() - t0);
      understandError = String((err as Error)?.message || err);
    }
  }

  const intentBoosts = new Set<string>();
  const SERIES_CORE = new Set([
    "ghost",
    "stories",
    "horror",
    "spooky",
    "scary",
    "lyric",
    "lyrics",
    "misheard",
    "song",
    "kaan",
    "masti",
    "kaanmasti",
    "snn",
  ]);
  const distinctive = local.tokens.filter((t) => keepToken(t) && !SERIES_CORE.has(t));
  if ((intent === "series" || intent === "vibe") && distinctive.length === 0) {
    if (/ghost|horror|spook|scary/i.test(query)) for (const t of tokenize("ghost stories")) intentBoosts.add(t);
    if (/lyric|mishear|song/i.test(query)) for (const t of tokenize("misheard lyrics")) intentBoosts.add(t);
  }
  if (intent === "game") {
    if (/play\s*station|\bps5\b|dual\s*sense|controller/i.test(query)) {
      for (const t of tokenize("playstation ps5 dualsense")) intentBoosts.add(t);
    }
  }
  if (intent === "guest") {
    for (const e of local.entities.filter((x) => x.kind === "guest")) {
      for (const t of tokenize(e.key)) intentBoosts.add(t);
    }
  }

  const expandedTerms = [...new Set([...local.expansions, ...intentBoosts])].filter(keepToken);
  const bm25Query = [...new Set([...local.tokens, ...expandedTerms])].filter(keepToken).join(" ");

  return {
    original: query,
    intent,
    intentProbabilities: intentProbs,
    entities: local.entities,
    synonymHits: local.synonymHits,
    expandedTerms,
    bm25Query,
    understandMs,
    understandError,
  };
}

function bm25Search(query: string, limit = SHORTLIST_SIZE) {
  const q = tokenize(query);
  if (!q.length || !hybridIndex) return [];
  const N = videos.length;
  const k1 = 1.2;
  const b = 0.75;

  return docs
    .map((doc, i) => {
      let score = 0;
      const fieldHits: Record<string, number> = {};
      for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
        const toks = doc[field] || [];
        if (!toks.length) continue;
        const tf = new Map<string, number>();
        for (const t of toks) tf.set(t, (tf.get(t) || 0) + 1);
        let fieldScore = 0;
        for (const term of q) {
          const f = tf.get(term) || 0;
          if (!f) continue;
          const n = df.get(term) || 0;
          const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
          const denom = f + k1 * (1 - b + b * (toks.length / Math.max(avgdl, 1)));
          fieldScore += idf * ((f * (k1 + 1)) / denom);
        }
        if (fieldScore > 0) {
          fieldHits[field] = Number(fieldScore.toFixed(4));
          score += weight * fieldScore;
        }
      }
      return { video: videos[i], bm25: score, fieldHits };
    })
    .filter((s) => s.bm25 > 0)
    .sort((a, b) => b.bm25 - a.bm25)
    .slice(0, limit);
}

function hybridSearch(originalQuery: string, expandedQuery: string, limit = SHORTLIST_SIZE) {
  if (!hybridIndex) throw new Error("Search index not ready");
  return hybridRecall({
    originalQuery,
    expandedQuery: expandedQuery || originalQuery,
    videos,
    index: hybridIndex,
    bm25Fn: bm25Search,
    tokenizeFn: tokenize,
    shortlistSize: limit,
  });
}

function buildState(query: string, shortlist: { video: MfmVideo }[]) {
  const lines = [
    `You are scoring ${CHANNEL_LABEL} YouTube videos for a channel-only search demo.`,
    `Search query: ${query}`,
    "",
    "Score each candidate independently. A video can all be weak matches — do not force a winner.",
    "Candidate videos (rich metadata: title, tags, chapters, description, transcript snippets):",
  ];
  for (const { video } of shortlist) {
    lines.push(`[${video.id}]`);
    lines.push(candidateBlob(video, query));
    lines.push("");
  }
  return lines.join("\n");
}

async function jevRankNoul(
  query: string,
  shortlist: { video: MfmVideo; bm25: number }[],
  intent: string,
  env: MfmSearchEnv,
) {
  const topicHint =
    intent === "guest"
      ? "Focus on whether the named person/guest is actually in or central to this video."
      : intent === "series"
        ? "Focus on whether this video belongs to the series or format the user wants."
        : intent === "game"
          ? "Focus on whether the game/console/gadget named is what this video is about."
          : intent === "vibe"
            ? "Focus on whether the mood/topic matches the vibe the user described."
            : "Focus on topical overlap with the query.";

  if (isMock(env)) {
    const maxBm25 = Math.max(...shortlist.map((s) => s.bm25), 1e-6);
    const byId: Record<
      string,
      {
        relevance: number;
        topic: number;
        hit: number;
        hitRaw: number;
        hitLabel: string;
        combined: number;
      }
    > = {};
    for (const { video, bm25 } of shortlist) {
      const norm = Math.min(1, bm25 / maxBm25);
      const rel = 0.35 + norm * 0.55;
      const topic = 0.3 + norm * 0.5;
      const hitRaw = norm > 0.65 ? 2 : norm > 0.25 ? 1 : 0;
      const hit = hitRaw / 2;
      const hitLabel = hitRaw < 0.5 ? "off_topic" : hitRaw < 1.5 ? "partial" : "direct_hit";
      const combined =
        SCORE_WEIGHTS.relevance * rel + SCORE_WEIGHTS.topic * topic + SCORE_WEIGHTS.hit * hit;
      byId[video.id] = { relevance: rel, topic, hit, hitRaw, hitLabel, combined };
    }
    const existsProbability = shortlist.length ? 0.72 : 0.1;
    return {
      jevMs: 4,
      state: buildState(query, shortlist),
      questions: { exists: { type: "boolean" } },
      model: MODEL_ID,
      existsProbability,
      byId,
      noulById: Object.fromEntries(Object.entries(byId).map(([id, s]) => [id, s.combined])),
      confidence: null,
      providerMetadata: { mock: true },
      scoreWeights: SCORE_WEIGHTS,
      intent,
    };
  }

  const gateway = createGateway({ apiKey: env.AI_GATEWAY_API_KEY! });
  const state = buildState(query, shortlist);

  const questions: Record<string, unknown> = {
    exists: {
      type: "boolean",
      instructions: `Does at least one candidate video match the search query "${query}"? Answer yes if the query topic, entity, or phrase is clearly present in title, description, chapters, OR transcript snippets — including brief spoken mentions. Answer no only when every candidate is unrelated keyword coincidence.`,
    },
  };

  for (const { video } of shortlist) {
    const id = video.id;
    questions[`rel_${id}`] = {
      type: "boolean",
      instructions: `Considering ONLY candidate [${id}] ("${video.title}"), is it relevant to the search query "${query}"? Use title, description, chapters, AND transcript snippets in state. Probability = match strength. Score independently.`,
    };
    questions[`topic_${id}`] = {
      type: "boolean",
      instructions: `Considering ONLY candidate [${id}] ("${video.title}"), does it match what the user is likely looking for with "${query}"? Intent hint: ${intent}. ${topicHint} Probability = strength of that match. Score independently.`,
    };
    questions[`hit_${id}`] = {
      type: "score",
      instructions: `Considering ONLY candidate [${id}] ("${video.title}"), how well does it satisfy the search query "${query}"?`,
      criteria: [
        "Off-topic — query entity/phrase is absent from title, description, chapters, and transcript snippets",
        "Partial — related or weakly mentioned, or only loose overlap",
        "Direct hit — query entity/place/phrase appears clearly in title/description OR in a transcript match snippet",
      ],
    };
  }

  const t0 = performance.now();
  const result = await experimental_evaluate({
    model: gateway.evaluationModel(MODEL_ID),
    state,
    questions: questions as Parameters<typeof experimental_evaluate>[0]["questions"],
  });
  const jevMs = Math.round(performance.now() - t0);

  const existsProbability = result.answers.exists?.probability ?? 0;
  const byId: Record<
    string,
    {
      relevance: number;
      topic: number;
      hit: number;
      hitRaw: number;
      hitLabel: string;
      combined: number;
      hitProbabilities?: unknown;
    }
  > = {};

  for (const { video } of shortlist) {
    const id = video.id;
    const rel = result.answers[`rel_${id}`]?.probability ?? 0;
    const topic = result.answers[`topic_${id}`]?.probability ?? 0;
    const hitAns = result.answers[`hit_${id}`];
    const hitRaw = typeof hitAns?.score === "number" ? hitAns.score : 0;
    const hitLevels = 3;
    const hit = Math.max(0, Math.min(1, hitRaw / (hitLevels - 1)));
    const hitLabel = hitRaw < 0.5 ? "off_topic" : hitRaw < 1.5 ? "partial" : "direct_hit";
    const combined =
      SCORE_WEIGHTS.relevance * rel + SCORE_WEIGHTS.topic * topic + SCORE_WEIGHTS.hit * hit;
    byId[id] = {
      relevance: rel,
      topic,
      hit,
      hitRaw,
      hitLabel,
      combined,
      hitProbabilities: hitAns?.probabilities || null,
    };
  }

  return {
    jevMs,
    state,
    questions,
    model: MODEL_ID,
    existsProbability,
    byId,
    noulById: Object.fromEntries(Object.entries(byId).map(([id, s]) => [id, s.combined])),
    confidence: result.providerMetadata?.typesafe?.confidence || null,
    providerMetadata: result.providerMetadata ?? null,
    scoreWeights: SCORE_WEIGHTS,
    intent,
  };
}

function enrichmentSnapshot() {
  const withDescription = videos.filter((v) => (v.description || "").trim()).length;
  const withCaptions = videos.filter((v) => (v.captions || "").trim()).length;
  return { withDescription, withCaptions, enrichStats };
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function handleHealth(env: MfmSearchEnv) {
  return jsonResponse({
    ok: true,
    videos: videos.length,
    live: hasLiveJev(env),
    mock: isMock(env),
    model: MODEL_ID,
    channel: CHANNEL_HANDLE,
    strategy:
      "query understand → hybrid (BM25∪TF-IDF∪fuzzy→RRF) → multi-question Jev + confidence gates",
    thresholds: { exists: EXISTS_THRESHOLD, match: MATCH_THRESHOLD },
    scoreWeights: SCORE_WEIGHTS,
    enrichment: enrichmentSnapshot(),
    catalogGeneratedAt: catalog.generatedAt,
  });
}

export function handlePile(nParam: string | null) {
  const n = Math.min(40, Math.max(20, Number(nParam || 30)));
  const scored = videos.map((v, i) => ({
    v,
    k: (v.id.charCodeAt(0) * 17 + v.id.charCodeAt(1) * 31 + i * 13) % 9973,
  }));
  scored.sort((a, b) => a.k - b.k);
  const items = scored.slice(0, n).map(({ v }) => ({
    id: v.id,
    title: v.title,
    thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
    url: v.url || `https://www.youtube.com/watch?v=${v.id}`,
  }));
  return jsonResponse({ count: items.length, items });
}

export async function handleSearch(q: string, env: MfmSearchEnv) {
  const totalT0 = performance.now();
  const query = (q || "").trim();
  if (!query) return jsonResponse({ error: "Missing q" }, 400);
  if (!hasLiveJev(env) && !isMock(env)) {
    return jsonResponse({ error: "AI_GATEWAY_API_KEY missing (set JEV_MOCK=true for local mock)" }, 503);
  }

  const understood = await understandQuery(query, env);
  const recallT0 = performance.now();
  const recall = hybridSearch(query, understood.bm25Query || query, SHORTLIST_SIZE);
  const shortlist = recall.shortlist;
  const bm25Ms = recall.timings.bm25Ms;
  const recallMs = Math.round(performance.now() - recallT0);
  const enrichment = enrichmentSnapshot();

  const baseDebug = {
    strategy:
      "query understand → hybrid recall (BM25∪TF-IDF∪fuzzy→RRF) → multi-question Jev + confidence gates",
    model: MODEL_ID,
    fieldWeights: FIELD_WEIGHTS,
    thresholds: { exists: EXISTS_THRESHOLD, match: MATCH_THRESHOLD },
    scoreWeights: SCORE_WEIGHTS,
    enrichment,
    understand: {
      original: understood.original,
      intent: understood.intent,
      intentProbabilities: understood.intentProbabilities,
      entities: understood.entities,
      synonymHits: understood.synonymHits,
      expandedTerms: understood.expandedTerms,
      bm25Query: understood.bm25Query,
      understandMs: understood.understandMs,
      understandError: understood.understandError,
    },
  };

  if (!shortlist.length) {
    return jsonResponse({
      query,
      results: [],
      mode: isMock(env) ? "mock" : "live",
      hasMatch: false,
      debug: {
        ...baseDebug,
        timings: {
          understandMs: understood.understandMs,
          bm25Ms,
          recallMs,
          ...recall.timings,
          jevMs: 0,
          totalMs: Math.round(performance.now() - totalT0),
        },
        shortlistSize: 0,
        hybrid: { lanes: recall.lanes, timings: recall.timings },
        shortlist: [],
        jev: {
          existsProbability: 0,
          relevantProbability: 0,
          noulById: {},
          gated: true,
          note: "No hybrid recall hits",
        },
        statePreview: "",
      },
    });
  }

  try {
    const jev = await jevRankNoul(query, shortlist, understood.intent || "other", env);
    const existsOk = jev.existsProbability >= EXISTS_THRESHOLD;

    const scored = shortlist
      .map(({ video, bm25, fieldHits, tfidf = 0, fuzzy = 0, rrf = 0, lanes = [] }) => {
        const multi = jev.byId[video.id] || {
          relevance: 0,
          topic: 0,
          hit: 0,
          hitLabel: "off_topic",
          combined: 0,
        };
        return {
          video,
          bm25,
          fieldHits,
          tfidf,
          fuzzy,
          rrf,
          lanes,
          multi,
          jev: multi.combined,
        };
      })
      .sort((a, b) => b.jev - a.jev || b.bm25 - a.bm25);

    let ranked: typeof scored = [];
    let gateNote: string | null = null;
    if (!existsOk) {
      gateNote = `exists Noul ${jev.existsProbability.toFixed(3)} < ${EXISTS_THRESHOLD} — no genuine match`;
      ranked = [];
    } else {
      ranked = scored.filter((s) => {
        if (s.jev < MATCH_THRESHOLD) return false;
        if (s.multi.hitLabel === "off_topic" && s.multi.relevance < 0.22) return false;
        return true;
      });
      if (!ranked.length) {
        const top = scored[0];
        const close =
          top &&
          top.jev >= MATCH_THRESHOLD * 0.9 &&
          top.multi.hitLabel !== "off_topic" &&
          top.multi.relevance >= 0.4;
        if (close) ranked = [top];
        else {
          gateNote = `exists passed but no candidate cleared combined>=${MATCH_THRESHOLD} with a non-off-topic hit`;
          ranked = [];
        }
      }
    }

    const totalMs = Math.round(performance.now() - totalT0);
    const hasMatch = ranked.length > 0;

    return jsonResponse({
      query,
      mode: isMock(env) ? "mock" : "live",
      hasMatch,
      results: ranked.map(({ video, bm25, fieldHits, multi, jev: jevScore }, i) => ({
        id: video.id,
        title: video.title,
        description: video.description || "",
        url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
        mentions: findCaptionMentions(video, query, {
          limit: 5,
          youtubeUrl: video.url || `https://www.youtube.com/watch?v=${video.id}`,
        }),
        thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
        duration: video.duration,
        tags: video.tags || [],
        hasCaptions: Boolean((video.captions || "").trim()),
        captionChars: (video.captions || "").length,
        descriptionChars: (video.description || "").length,
        bm25: Number(bm25.toFixed(4)),
        fieldHits,
        jev: Number(jevScore.toFixed(4)),
        scorePct: Math.round(jevScore * 100),
        multi: {
          relevance: Number(multi.relevance.toFixed(4)),
          topic: Number(multi.topic.toFixed(4)),
          hit: Number(multi.hit.toFixed(4)),
          hitLabel: multi.hitLabel,
          combined: Number(multi.combined.toFixed(4)),
        },
        rank: i + 1,
        isTopChoice: i === 0,
      })),
      debug: {
        ...baseDebug,
        timings: {
          understandMs: understood.understandMs,
          bm25Ms,
          recallMs,
          ...recall.timings,
          jevMs: jev.jevMs,
          totalMs,
        },
        shortlistSize: shortlist.length,
        hybrid: { lanes: recall.lanes, timings: recall.timings },
        shortlist: scored.map(
          ({ video, bm25, fieldHits, tfidf, fuzzy, rrf, lanes, multi, jev: jevScore }, i) => ({
            rank: i + 1,
            id: video.id,
            title: video.title,
            bm25: Number((bm25 || 0).toFixed(4)),
            tfidf: Number((tfidf || 0).toFixed(4)),
            fuzzy: Number((fuzzy || 0).toFixed(4)),
            rrf: Number((rrf || 0).toFixed(4)),
            lanes,
            fieldHits,
            jevProb: Number(jevScore.toFixed(4)),
            noul: Number(jevScore.toFixed(4)),
            relevance: Number(multi.relevance.toFixed(4)),
            topic: Number(multi.topic.toFixed(4)),
            hit: Number(multi.hit.toFixed(4)),
            hitLabel: multi.hitLabel,
            combined: Number(multi.combined.toFixed(4)),
            passedMatchGate: jevScore >= MATCH_THRESHOLD && multi.hitLabel !== "off_topic",
            descChars: (video.description || "").length,
            captionChars: (video.captions || "").length,
          }),
        ),
        jev: {
          relevantProbability: jev.existsProbability,
          existsProbability: jev.existsProbability,
          existsOk,
          gated: !existsOk || !hasMatch,
          gateNote,
          confidence: jev.confidence,
          noulById: jev.noulById,
          byId: jev.byId,
          scoreWeights: jev.scoreWeights,
          intent: jev.intent,
          bestChoice: hasMatch ? ranked[0].video.id : null,
        },
        statePreview: jev.state.slice(0, 1600),
        questions: jev.questions,
        providerMetadata: jev.providerMetadata,
      },
    });
  } catch (err) {
    console.error(err);
    return jsonResponse(
      {
        error: String((err as Error)?.message || err),
        hasMatch: false,
        results: [],
        debug: {
          ...baseDebug,
          timings: {
            understandMs: understood.understandMs,
            bm25Ms,
            jevMs: null,
            totalMs: Math.round(performance.now() - totalT0),
          },
          shortlist: shortlist.map(({ video, bm25, fieldHits }) => ({
            id: video.id,
            title: video.title,
            bm25: Number(bm25.toFixed(4)),
            fieldHits,
          })),
        },
      },
      502,
    );
  }
}
