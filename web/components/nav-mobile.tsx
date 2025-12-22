"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type NavLink = {
  href: string;
  label: string;
};

type MobileNavSheetProps = {
  links: NavLink[];
  isActive: (href: string) => boolean;
  title?: string;
};

export function MobileNav({ links, isActive, title = "Menu" }: MobileNavSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="px-4 py-4 border-b">
          <div className="text-sm font-semibold">{title}</div>
        </div>

        <nav className="px-2 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
