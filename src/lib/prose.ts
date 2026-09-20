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

function splitLongBlock(block: string, maxChars: number): string[] {
  const sentences = block.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  if (!sentences || sentences.length <= 1) {
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
