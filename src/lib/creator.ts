export type SourcePlatform = "x" | "github" | "web";

export function normalizeHandle(handle: string) {
  return handle.replace(/^@/, "");
}

export function xProfileUrl(handle: string) {
  return `https://x.com/${normalizeHandle(handle)}`;
}

export function formatCreatorLabel(handle: string) {
  return `@${normalizeHandle(handle)}`;
}
