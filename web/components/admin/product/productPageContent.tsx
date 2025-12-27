"use client";

import { useProducts } from "@/hooks/use-product";
import ProductListTable from "../tables/product/productList";
import { useMemo, useState } from "react";
import { ProductTabValue } from "@/types";
import { ProductTabs } from "@/components/shared/status/product";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductPageContent() {
    const [statusTab, setStatusTab] = useState<ProductTabValue>("all");
    const { data, refetch } = useProducts();

    const PRODUCT_TABS = ProductTabs();

    const filteredData = useMemo(() => {
        if (statusTab === "all") return data ?? [];
        return (data ?? []).filter((item) => item.status === statusTab);
    }, [data, statusTab]);

    return (
        <Card>
            <CardContent className="flex flex-col gap-3">
                <div className="flex flex-col xl:flex-row justify-between gap-3">
                    <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as ProductTabValue)}>
                        <TabsList className="grid grid-cols-3 h-fit w-full gap-3">
                            {PRODUCT_TABS.map((item) => (
                                <TabsTrigger className="cursor-pointer" key={item.value} value={item.value}>
                                    {item.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="grid grid-cols-1">
                    <ProductListTable data={filteredData || []} refetch={refetch} />
                </div>
            </CardContent>
        </Card>
    );
}
