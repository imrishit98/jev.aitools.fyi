/**
 * Split long copy into readable paragraphs for detail pages and guides.
 * Preserves explicit `\n\n` breaks; otherwise splits on sentence boundaries.
 */
export function splitIntoParagraphs(text: string, maxChars = 280): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const blocks = normalized
    .split(/\n{2,}/)
    .map((b) => b.replace(/\n/g, " ").trim())
    .filter(Boolean);

  const out: string[] = [];
  for (const block of blocks) {
    if (block.length <= maxChars) {
      out.push(block);
      continue;
    }
    out.push(...splitLongBlock(block, maxChars));
  }
  return out;
}

/** Split on sentence punctuation only when followed by whitespace or end of string (keeps "2.0", "v1.2"). */
function splitIntoSentences(block: string): string[] {
  const sentences: string[] = [];
  let start = 0;
  for (let i = 0; i < block.length; i++) {
    const ch = block[i];
    if (ch !== "." && ch !== "!" && ch !== "?") continue;
    const next = block[i + 1];
    if (next !== undefined && !/\s/.test(next)) continue;
    const piece = block.slice(start, i + 1).trim();
    if (piece) sentences.push(piece);
    start = i + 1;
    while (start < block.length && /\s/.test(block[start]!)) start++;
    i = start - 1;
  }
  const rest = block.slice(start).trim();
  if (rest) sentences.push(rest);
  return sentences;
}

function splitLongBlock(block: string, maxChars: number): string[] {
  const sentences = splitIntoSentences(block);
  if (sentences.length <= 1) {
    return chunkByWords(block, maxChars);
  }

  const paragraphs: string[] = [];
  let current = "";

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChars && current) {
      paragraphs.push(current.trim());
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current.trim()) paragraphs.push(current.trim());
  return paragraphs.length > 0 ? paragraphs : [block];
}

function chunkByWords(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      chunks.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
