"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  const nextLocale = locale === "th" ? "en" : "th";

  return (
    <Button
      variant="ghost"
      className="cursor-pointer gap-2 border rounded-full"
      aria-label="Toggle language"
      onClick={() => setLocale(nextLocale)}
    >
      <Globe className="h-5 w-5 hidden sm:block" />
      <span className="text-sm font-medium">{locale.toUpperCase()}</span>
    </Button>
  );
}
