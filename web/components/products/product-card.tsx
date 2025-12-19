"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCartStore } from "@/lib/store/cart-store";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartStore();
  const t = useTranslations('common');
  const tProduct = useTranslations('product');
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = items.some((item) => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg p-0">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 bg-background/80 backdrop-blur"
            >
              {tProduct('outOfStock')}
            </Badge>
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 text-white font-medium">
              <Eye className="h-5 w-5" />
              <span>{tProduct('viewDetail')}</span>
            </div>
          </div>
        </div>
      </Link>

      <CardHeader className="space-y-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
          {isInCart && (
            <Badge variant="secondary" className="shrink-0 gap-1">
              <Check className="h-3 w-3" />
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-1 text-sm">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t('price')}</span>
          <span className="text-xl font-bold">
            ฿{product.price.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 gap-2 items-end">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="flex-1 gap-2 cursor-pointer"
          variant={isAdding ? "secondary" : "default"}
        >
          {isAdding ? (
            <>
              <Check className="h-4 w-4" />
              {tProduct('addedToCart')}
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              {t('addToCart')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
