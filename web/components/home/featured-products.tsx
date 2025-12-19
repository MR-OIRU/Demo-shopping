"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("common");

  const featuredProducts = products.slice(0, 4);

  return (
    <section id="products" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("featuredProducts")}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {t("products")}
            </p>
          </div>

          <Link href="#all-products" className="hidden sm:block">
            <Button variant="ghost" className="gap-2 group">
              {t("viewAllProducts")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="#all-products">
            <Button variant="outline" className="gap-2 group">
              {t("viewAllProducts")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
