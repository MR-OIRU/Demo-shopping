"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { CartPopover } from "@/components/cart/cart-popover";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MobileNav } from "../nav-mobile";

export function Header() {
  const t = useTranslations("client.common");
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/#products", label: t("products") },
    { href: "/#about", label: t("about") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold transition-colors hover:text-primary"
          >
            <Store className="h-6 w-6" />
            <span className="text-lg font-bold">Shop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <CartPopover />
            <MobileNav
              links={navLinks}
              isActive={isActive}
              title={t("menu")}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
