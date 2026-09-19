import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  applyTheme,
  getResolvedTheme,
  getStoredTheme,
  initThemeListeners,
  setTheme,
} from "@/lib/theme";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    applyTheme(getStoredTheme());
    initThemeListeners();
    setIsDark(getResolvedTheme() === "dark");
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        className="size-9 shrink-0"
        aria-hidden
        tabIndex={-1}
        disabled
      />
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="size-9 shrink-0"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        setIsDark(next === "dark");
      }}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
