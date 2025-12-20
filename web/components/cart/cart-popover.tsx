"use client";

import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/store/cart-store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function CartPopover() {
  const { items, removeItem, getTotalItems, getTotalPrice } = useCartStore();
  const t = useTranslations('client.common');
  const totalItems = getTotalItems();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative cursor-pointer border rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {totalItems}
            </Badge>
          )}
          <span className="sr-only">{t('cart')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{t('cart')}</h3>
            <span className="text-sm text-muted-foreground">
              {totalItems} {t('itemsInCart')}
            </span>
          </div>

          <Separator />

          {items.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t('emptyCart')}
            </div>
          ) : (
            <>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-lg border p-2 transition-colors hover:bg-accent"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium line-clamp-1">
                            {item.name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {t('quantity')}: {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>{t('total')}:</span>
                  <span className="text-lg">
                    ฿{getTotalPrice().toLocaleString()}
                  </span>
                </div>

                <div className="grid gap-2">
                  <Button asChild className="w-full">
                    <Link href="/cart">{t('viewCart')}</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">{t('continueShopping')}</Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
