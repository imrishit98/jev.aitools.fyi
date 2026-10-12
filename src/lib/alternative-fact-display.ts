/** Shown in facts tables when a value has no primary source. */
export const NOT_PUBLISHED_LABEL = "not published";

export function formatFactCell(value: string | undefined | null): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed || trimmed.toLowerCase() === NOT_PUBLISHED_LABEL) {
    return NOT_PUBLISHED_LABEL;
  }
  return trimmed;
}

export function isNotPublishedValue(value: string | undefined | null): boolean {
  return formatFactCell(value) === NOT_PUBLISHED_LABEL;
}
