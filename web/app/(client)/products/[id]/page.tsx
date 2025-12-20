"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart, ArrowLeft, Package, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart-store";
import { mockProducts } from "@/lib/data/products";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("client.common");
  const tProduct = useTranslations("client.product");
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="container px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(tProduct("addedToCart"));
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("continueShopping")}
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border-2">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {tProduct("outOfStock")}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6 ">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </Badge>
                <Badge
                  variant={product.inStock ? "default" : "destructive"}
                  className="gap-1"
                >
                  <Package className="h-3 w-3" />
                  {product.inStock ? tProduct("inStock") : tProduct("outOfStock")}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  ฿{product.price.toLocaleString()}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {tProduct("description")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>

            <Separator />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-sm uppercase tracking-wide">
                  {t("quantity")}:
                </span>
                <div className="flex items-center border-2 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="px-6 py-2 font-semibold min-w-[60px] text-center border-x-2">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full text-base gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {t("addToCart")}
              </Button>

              {!product.inStock && (
                <p className="text-sm text-muted-foreground text-center">
                  This product is currently out of stock
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related or Additional Info Section */}
        <Separator className="my-12" />

        <div className="grid sm:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                On orders over ฿1,000
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Price</h3>
              <p className="text-sm text-muted-foreground">
                Guaranteed best prices
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
