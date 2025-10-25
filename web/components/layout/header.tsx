"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { CartPopover } from "@/components/cart/cart-popover";

export function Header() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Store className="h-6 w-6" />
          <span className="text-lg">Shop</span>
        </Link>

        <nav className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <CartPopover />
        </nav>
      </div>
    </header>
  );
}
