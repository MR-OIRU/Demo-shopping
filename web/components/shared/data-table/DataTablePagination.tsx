"use client";

import type { Table as TanTable } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface DataTablePaginationProps<TData> {
    table: TanTable<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const pageSize = table.getState().pagination.pageSize;
    const t = useTranslations('admin.table');

    return (
        <div className="flex flex-col items-center justify-between gap-3 py-3 sm:flex-row">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>{t("rowsPerPage")}:</span>
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) => table.setPageSize(Number(value))}
                >
                    <SelectTrigger className="h-8 w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[5, 10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-muted-foreground text-sm">
                    {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")} {table.getPageCount() || 1}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t("previous")}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t("next")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
