"use client";

import type { Table as TanTable } from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { RefreshCw } from "lucide-react";

interface DataTableToolbarProps<TData> {
    table: TanTable<TData>;
    refetch?: () => void;
}

export function DataTableToolbar<TData>({ table, refetch }: DataTableToolbarProps<TData>) {
    const [search, setSearch] = useState("");
    const t = useTranslations('admin.table');
    const handleSearch = (value: string) => {
        setSearch(value);
        table.setGlobalFilter(value || undefined);
    };

    const handleReset = () => {
        setSearch("");
        table.setGlobalFilter(undefined);
        if (refetch) refetch();
    };

    return (
        <div className="flex items-center justify-between gap-2">
            <Input
                placeholder={t("search")}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-[250px]"
            />
            <Button variant="outline" className="cursor-pointer" onClick={handleReset}>
                <RefreshCw className="w-4 h-4" />
                {t("refetch")}
            </Button>
        </div>
    );
}
