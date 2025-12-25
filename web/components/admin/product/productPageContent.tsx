"use client";

import { useProducts } from "@/hooks/use-product";
import ProductListTable from "../tables/product/productList";

export default function ProductPageContent() {
      const { data, refetch } = useProducts();

    return (
        <div className="p-6">
            <div className="grid grid-cols-1">
                <ProductListTable data={data || []} refetch={refetch} />
            </div>
        </div>
    );
}
