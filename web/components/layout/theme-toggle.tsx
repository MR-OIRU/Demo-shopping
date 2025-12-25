"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('client.common');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-10" />;

  const isDark = resolvedTheme === "dark";

  const getThemeLabel = () => {
    if (resolvedTheme === "light") return t('light');
    if (resolvedTheme === "dark") return t('dark');
    return t('system');
  };

  return (
    <Button
      variant="ghost"
      className="cursor-pointer border rounded-full"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />} <span className="text-sm font-medium hidden sm:block">{getThemeLabel()}</span>
    </Button>
  );
}
