/**
 * Hybrid recall: BM25 ∪ TF-IDF cosine ∪ char-trigram fuzzy → RRF.
 */

export const RRF_K = 60;
export const LANE_POOL = 24;

export type MfmVideo = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  chapters?: { title?: string }[];
  captions?: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
};

export function charTrigrams(text: string) {
  const s = `  ${(text || "").toLowerCase().replace(/\s+/g, " ").trim()}  `;
  const out = new Set<string>();
  for (let i = 0; i < s.length - 2; i++) out.add(s.slice(i, i + 3));
  return out;
}

function jaccard(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export function buildHybridIndex(
  videos: MfmVideo[],
  docs: Record<string, string[]>[],
  df: Map<string, number>,
  fieldWeights: Record<string, number>,
) {
  const N = videos.length || 1;
  const tfidf: Record<string, number>[] = [];
  const trigrams: Set<string>[] = [];

  for (let i = 0; i < videos.length; i++) {
    const doc = docs[i] || {};
    const weights = new Map<string, number>();
    for (const [field, w] of Object.entries(fieldWeights)) {
      const toks = doc[field] || [];
      for (const t of toks) {
        const n = df.get(t) || 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        weights.set(t, (weights.get(t) || 0) + w * idf);
      }
    }
    let norm = 0;
    for (const v of weights.values()) norm += v * v;
    norm = Math.sqrt(norm) || 1;
    const sparse: Record<string, number> = {};
    for (const [t, v] of weights) sparse[t] = v / norm;
    tfidf.push(sparse);

    const v = videos[i];
    const blob = [
      v.title || "",
      Array.isArray(v.tags) ? v.tags.join(" ") : "",
      (v.description || "").slice(0, 400),
      (v.chapters || []).map((c) => c.title || "").join(" "),
    ].join(" ");
    trigrams.push(charTrigrams(blob));
  }

  return { tfidf, trigrams };
}

function cosineSparse(q: Record<string, number>, doc: Record<string, number>) {
  let score = 0;
  for (const [t, w] of Object.entries(q)) {
    const d = doc[t];
    if (d) score += w * d;
  }
  return score;
}

export function tfidfSearch(
  queryTokens: string[],
  index: { tfidf: Record<string, number>[] },
  videos: MfmVideo[],
  limit = LANE_POOL,
) {
  if (!queryTokens.length || !index?.tfidf?.length) return [];
  const N = videos.length || 1;
  const qtf = new Map<string, number>();
  for (const t of queryTokens) qtf.set(t, (qtf.get(t) || 0) + 1);

  const dfApprox = new Map<string, number>();
  for (const t of qtf.keys()) {
    let n = 0;
    for (const doc of index.tfidf) if (doc[t] != null) n++;
    dfApprox.set(t, n);
  }
  const qSparse: Record<string, number> = {};
  let qNorm = 0;
  for (const [t, f] of qtf) {
    const n = dfApprox.get(t) || 0;
    const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
    const w = f * idf;
    qSparse[t] = w;
    qNorm += w * w;
  }
  qNorm = Math.sqrt(qNorm) || 1;
  for (const t of Object.keys(qSparse)) qSparse[t] /= qNorm;

  return index.tfidf
    .map((doc, i) => ({ video: videos[i], tfidf: cosineSparse(qSparse, doc), i }))
    .filter((s) => s.tfidf > 0)
    .sort((a, b) => b.tfidf - a.tfidf)
    .slice(0, limit);
}

export function trigramFuzzySearch(
  query: string,
  index: { trigrams: Set<string>[] },
  videos: MfmVideo[],
  limit = LANE_POOL,
) {
  const qTri = charTrigrams(query);
  if (qTri.size < 3 || !index?.trigrams?.length) return [];
  return index.trigrams
    .map((docTri, i) => ({ video: videos[i], fuzzy: jaccard(qTri, docTri), i }))
    .filter((s) => s.fuzzy > 0.06)
    .sort((a, b) => b.fuzzy - a.fuzzy)
    .slice(0, limit);
}

const LANE_WEIGHTS: Record<string, number> = {
  bm25: 1.25,
  tfidf: 1.0,
  fuzzy: 0.55,
  caption: 1.35,
};

export function rrfFuse(
  lists: { name: string; hits: { video: MfmVideo; bm25?: number; tfidf?: number; fuzzy?: number; caption?: number; proximity?: number; fieldHits?: Record<string, number> }[] }[],
  limit: number,
  k = RRF_K,
) {
  const scores = new Map<
    string,
    {
      video: MfmVideo;
      rrf: number;
      lanes: string[];
      bm25: number;
      tfidf: number;
      fuzzy: number;
      caption: number;
      fieldHits: Record<string, number>;
    }
  >();

  for (const { name, hits } of lists) {
    const laneW = LANE_WEIGHTS[name] ?? 1;
    hits.forEach((hit, rank) => {
      const id = hit.video.id;
      const add = laneW / (k + rank + 1);
      let row = scores.get(id);
      if (!row) {
        row = {
          video: hit.video,
          rrf: 0,
          lanes: [],
          bm25: 0,
          tfidf: 0,
          fuzzy: 0,
          caption: 0,
          fieldHits: hit.fieldHits || {},
        };
        scores.set(id, row);
      }
      row.rrf += add;
      if (!row.lanes.includes(name)) row.lanes.push(name);
      if (hit.bm25 != null) row.bm25 = Math.max(row.bm25, hit.bm25);
      if (hit.tfidf != null) row.tfidf = Math.max(row.tfidf, hit.tfidf);
      if (hit.fuzzy != null) row.fuzzy = Math.max(row.fuzzy, hit.fuzzy);
      if (hit.caption != null) row.caption = Math.max(row.caption || 0, hit.caption);
      if (hit.proximity != null) row.caption = Math.max(row.caption || 0, hit.proximity);
      if (hit.fieldHits) row.fieldHits = { ...row.fieldHits, ...hit.fieldHits };
    });
  }

  return [...scores.values()]
    .sort((a, b) => b.rrf - a.rrf || b.bm25 - a.bm25)
    .slice(0, limit);
}

export function captionProximitySearch(
  queryTokens: string[],
  videos: MfmVideo[],
  limit = LANE_POOL,
  window = 40,
) {
  const q = [...new Set(queryTokens.filter(Boolean))];
  if (q.length < 2) return [];
  const hits: { video: MfmVideo; proximity: number; proxDist: number }[] = [];
  for (const video of videos) {
    const cap = (video.captions || "").toLowerCase();
    if (!cap) continue;
    if (!q.every((t) => cap.includes(t))) continue;
    const toks = cap.replace(/[^\p{L}\p{N}\s]+/gu, " ").split(/\s+/).filter(Boolean);
    const positions = q.map((term) => {
      const idxs: number[] = [];
      toks.forEach((t, i) => {
        if (t === term) idxs.push(i);
      });
      return idxs;
    });
    if (positions.some((p) => !p.length)) continue;
    let best = Infinity;
    if (q.length === 2) {
      for (const a of positions[0]) for (const b of positions[1]) best = Math.min(best, Math.abs(a - b));
    } else {
      for (const a of positions[0]) {
        for (const b of positions[1]) {
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          if (hi - lo > window * 2) continue;
          let ok = true;
          for (let qi = 2; qi < positions.length; qi++) {
            if (!positions[qi].some((p) => p >= lo - window && p <= hi + window)) {
              ok = false;
              break;
            }
          }
          if (ok) best = Math.min(best, hi - lo);
        }
      }
    }
    if (!Number.isFinite(best) || best > window * 3) continue;
    const score =
      1 / (1 + best) +
      0.05 * q.reduce((s, t) => s + (toks.filter((x) => x === t).length > 0 ? 1 : 0), 0);
    hits.push({ video, proximity: score, proxDist: best });
  }
  return hits.sort((a, b) => b.proximity - a.proximity).slice(0, limit);
}

export function hybridRecall({
  originalQuery,
  expandedQuery,
  videos,
  index,
  bm25Fn,
  tokenizeFn,
  shortlistSize,
  lanePool = LANE_POOL,
}: {
  originalQuery: string;
  expandedQuery: string;
  videos: MfmVideo[];
  index: ReturnType<typeof buildHybridIndex>;
  bm25Fn: (query: string, limit: number) => { video: MfmVideo; bm25: number; fieldHits?: Record<string, number> }[];
  tokenizeFn: (text: string) => string[];
  shortlistSize: number;
  lanePool?: number;
}) {
  const t0 = performance.now();
  const bm25Hits = bm25Fn(expandedQuery || originalQuery, lanePool);
  const bm25Ms = Math.round(performance.now() - t0);

  const t1 = performance.now();
  const tfidfHits = tfidfSearch(tokenizeFn(expandedQuery || originalQuery), index, videos, lanePool);
  const tfidfMs = Math.round(performance.now() - t1);

  const t2 = performance.now();
  const fuzzyHits = trigramFuzzySearch(originalQuery, index, videos, lanePool);
  const fuzzyMs = Math.round(performance.now() - t2);

  const tProx = performance.now();
  const proxHits = captionProximitySearch(tokenizeFn(originalQuery), videos, lanePool);
  const proxMs = Math.round(performance.now() - tProx);

  const t3 = performance.now();
  const fused = rrfFuse(
    [
      { name: "bm25", hits: bm25Hits },
      { name: "tfidf", hits: tfidfHits },
      { name: "fuzzy", hits: fuzzyHits },
      { name: "caption", hits: proxHits.map((h) => ({ ...h, caption: h.proximity })) },
    ],
    shortlistSize,
  );
  const rrfMs = Math.round(performance.now() - t3);

  const cleaned = fused.filter((row) => {
    if (row.lanes.includes("bm25") || row.lanes.includes("tfidf") || row.lanes.includes("caption")) return true;
    return (row.fuzzy || 0) >= 0.22;
  });

  return {
    shortlist: cleaned.map((row) => ({
      video: row.video,
      bm25: row.bm25,
      fieldHits: row.fieldHits,
      tfidf: row.tfidf,
      fuzzy: row.fuzzy,
      caption: row.caption || 0,
      rrf: row.rrf,
      lanes: row.lanes,
    })),
    lanes: {
      bm25: bm25Hits.slice(0, 8).map((h) => ({
        id: h.video.id,
        title: h.video.title,
        score: Number(h.bm25.toFixed(4)),
      })),
      tfidf: tfidfHits.slice(0, 8).map((h) => ({
        id: h.video.id,
        title: h.video.title,
        score: Number(h.tfidf.toFixed(4)),
      })),
      fuzzy: fuzzyHits.slice(0, 8).map((h) => ({
        id: h.video.id,
        title: h.video.title,
        score: Number(h.fuzzy.toFixed(4)),
      })),
      caption: proxHits.slice(0, 8).map((h) => ({
        id: h.video.id,
        title: h.video.title,
        score: Number(h.proximity.toFixed(4)),
        dist: h.proxDist,
      })),
    },
    timings: {
      bm25Ms,
      tfidfMs,
      fuzzyMs,
      proxMs,
      rrfMs,
      recallMs: bm25Ms + tfidfMs + fuzzyMs + proxMs + rrfMs,
    },
  };
}
