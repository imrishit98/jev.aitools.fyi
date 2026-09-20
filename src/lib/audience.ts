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
