const STORAGE_KEY = "jev-directory-theme";

export type ThemeSetting = "light" | "dark" | "system";

export function getStoredTheme(): ThemeSetting {
  if (typeof window === "undefined") return "system";
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function applyTheme(setting: ThemeSetting) {
  const root = document.documentElement;
  const dark =
    setting === "dark" ||
    (setting === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

export function setTheme(setting: ThemeSetting) {
  localStorage.setItem(STORAGE_KEY, setting);
  applyTheme(setting);
}

export function initThemeListeners() {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if (getStoredTheme() === "system") applyTheme("system");
  });
}

export function getResolvedTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
