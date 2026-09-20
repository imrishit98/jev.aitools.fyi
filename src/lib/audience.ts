export type AudienceMode = "human" | "agent";

const STORAGE_KEY = "jev-directory-audience";

export function getStoredAudience(): AudienceMode {
  if (typeof window === "undefined") return "human";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "agent" ? "agent" : "human";
  } catch {
    return "human";
  }
}

export function setStoredAudience(mode: AudienceMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore quota / private mode */
  }
}

export const agentEntryPath = "/for-agents";

/** True for `/for-agents`, `/for-agents/`, and nested paths under that prefix. */
export function isAgentRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (normalized === agentEntryPath) return true;
  return normalized.startsWith(`${agentEntryPath}/`);
}

export function humanHomeHref(): string {
  return "/";
}
