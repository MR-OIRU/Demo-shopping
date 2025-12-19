import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { AboutSection } from "@/components/home/about-section";
import { ProductList } from "@/components/products/product-list";
import { mockProducts } from "@/lib/data/products";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('common');

  return (
    <div className="w-full">
      <HeroSection />

      <FeaturedProducts products={mockProducts} />

      <AboutSection />

      <section id="all-products" className="container mx-auto px-4 py-16">
        <div className="mb-10 space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('products')}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
           {t('subheading')}
          </p>
        </div>

        <ProductList products={mockProducts} />
      </section>
    </div>
  );
}
