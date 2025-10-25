import { ProductList } from "@/components/products/product-list";
import { mockProducts } from "@/lib/data/products";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('common');

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('products')}
        </h1>
        <p className="text-muted-foreground">
          Discover our curated collection of premium products
        </p>
      </div>

      <ProductList products={mockProducts} />
    </div>
  );
}
