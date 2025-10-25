"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { mockProducts } from "@/lib/data/products";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const t = useTranslations("common");
  const tProduct = useTranslations("product");
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => window.history.back()}>Go Back</Button>
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
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              ฿{product.price.toLocaleString()}
            </p>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="font-semibold mb-2">{tProduct("description")}</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.inStock
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {product.inStock ? tProduct("inStock") : tProduct("outOfStock")}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">{t("quantity")}:</span>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-6 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
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
              className="w-full"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {t("addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
