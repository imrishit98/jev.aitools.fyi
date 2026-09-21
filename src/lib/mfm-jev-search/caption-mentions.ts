import type { MfmVideo } from "./hybrid-recall";

function queryTerms(query: string) {
  return String(query || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter(
      (t) =>
        t.length >= 2 &&
        !["the", "and", "for", "from", "with", "that", "this", "are", "was", "you"].includes(t),
    );
}

export function formatTimestamp(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function parseTs(ts: string) {
  const m = String(ts)
    .trim()
    .match(/(?:(\d+):)?(\d{2}):(\d{2})[,.](\d{1,3})/);
  if (!m) return null;
  const h = Number(m[1] || 0);
  const min = Number(m[2]);
  const sec = Number(m[3]);
  const ms = Number(String(m[4]).padEnd(3, "0"));
  return h * 3600 + min * 60 + sec + ms / 1000;
}

type Cue = { startSec: number; endSec: number; text: string };

function parseSrtOrVtt(raw: string): Cue[] {
  const blocks = raw.replace(/\r/g, "").split(/\n\n+/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (lines.length < 2) continue;
    let timeLine = lines[0];
    let textLines = lines.slice(1);
    if (/^\d+$/.test(lines[0]) && lines[1]) {
      timeLine = lines[1];
      textLines = lines.slice(2);
    }
    if (timeLine.startsWith("WEBVTT") || timeLine.startsWith("NOTE")) continue;
    const tm = timeLine.match(/(\S+)\s*-->\s*(\S+)/);
    if (!tm) continue;
    const startSec = parseTs(tm[1]);
    const endSec = parseTs(tm[2]);
    if (startSec == null) continue;
    const text = textLines
      .join(" ")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    cues.push({ startSec, endSec: endSec ?? startSec, text });
  }
  return cues;
}

function cuesFromCaptions(captions: string): Cue[] {
  const raw = (captions || "").trim();
  if (!raw) return [];
  if (/-->/.test(raw)) return parseSrtOrVtt(raw);
  return [];
}

/**
 * Find query mention timestamps from embedded SRT/VTT in catalog captions.
 */
export function findCaptionMentions(
  video: MfmVideo,
  query: string,
  { limit = 5, youtubeUrl }: { limit?: number; youtubeUrl?: string } = {},
) {
  const terms = queryTerms(query);
  if (!video?.id || !terms.length) return [];
  const cues = cuesFromCaptions(video.captions || "");
  if (!cues.length) return [];

  const hits: {
    startSec: number;
    endSec: number;
    t: string;
    text: string;
    youtubeUrl: string;
  }[] = [];
  const seen = new Set<number>();

  for (const cue of cues) {
    const lower = cue.text.toLowerCase();
    const matched = terms.filter((t) => lower.includes(t));
    if (!matched.length) continue;
    if (terms.length > 1 && !terms.every((t) => lower.includes(t))) continue;
    const key = Math.floor(cue.startSec);
    if (seen.has(key)) continue;
    seen.add(key);
    const start = Math.floor(cue.startSec);
    const base = youtubeUrl || video.url || `https://www.youtube.com/watch?v=${video.id}`;
    const sep = base.includes("?") ? "&" : "?";
    hits.push({
      startSec: start,
      endSec: Math.floor(cue.endSec || cue.startSec),
      t: formatTimestamp(start),
      text: cue.text.slice(0, 140),
      youtubeUrl: `${base}${sep}t=${start}s`,
    });
    if (hits.length >= limit) break;
  }

  return hits.slice(0, limit);
}
