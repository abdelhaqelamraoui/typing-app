"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { LanguageCode } from "@/lib/languages";
import { STRINGS } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ language = "en" }: { language?: LanguageCode }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={STRINGS[language].toggleDarkMode}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
