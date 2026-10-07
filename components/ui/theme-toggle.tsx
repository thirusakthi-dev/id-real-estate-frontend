"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        disabled
        className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground"
      >
        <span className="size-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    const html = document.documentElement;

    html.classList.add("theme-transition");

    setTheme(isDark ? "light" : "dark");

    window.setTimeout(() => {
      html.classList.remove("theme-transition");
    }, 300);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        inline-flex
        size-10
        items-center
        justify-center
        rounded-xl
        border
        border-border
        bg-surface
        text-foreground
        transition-colors
        duration-200
        hover:bg-surface-hover
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary
      "
    >
      {isDark ? (
        <Sun className="size-5" aria-hidden="true" />
      ) : (
        <Moon className="size-5" aria-hidden="true" />
      )}
    </button>
  );
}
