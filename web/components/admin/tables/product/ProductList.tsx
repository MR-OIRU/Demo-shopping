"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table/DataTable";
import { useTranslations } from "next-intl";
import { formatTh } from "@/lib/format-date";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ProductListItem } from "@/types";
import { useProductStatus } from "@/hooks/use-product";


interface ProductListTableProps {
    data: ProductListItem[];
    refetch?: () => void;
}
export default function ProductListTable({ data, refetch }: ProductListTableProps) {
    const t = useTranslations("admin.table");
    const tProduct = useTranslations("admin.table.product");

    const columns: ColumnDef<ProductListItem>[] = [
        {
            accessorKey: "no",
            header: "#",
            enableSorting: true,
            cell: ({ row }) => <>{row.index + 1}</>,
        },
        {
            accessorKey: "image",
            header: tProduct("image"),
            enableSorting: true,
        },
        {
            accessorKey: "name",
            header: tProduct("name"),
            enableSorting: true,
        },
        {
            accessorKey: "price",
            header: tProduct("price"),
            enableSorting: true,
        },
        {
            accessorKey: "stock",
            header: tProduct("stock"),
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: t("status"),
            enableSorting: true,
            cell: ({ row }) => (
                <>
                    <SwitchChange status={row.original.status} id={row.original.id} />
                </>
            ),
        },
        {
            accessorKey: "created",
            header: t("created"),
            enableSorting: true,
            cell: ({ getValue }) => formatTh(getValue<string>()),
        },
        {
            accessorKey: "updated",
            header: t("updated"),
            enableSorting: true,
            cell: ({ getValue }) => formatTh(getValue<string>()),
        },
        {
            id: "action",
            header: t("action"),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return <DataTable table={table} showToolbar showPagination refetch={refetch} />;
}

function SwitchChange({ status, id }: { status: string; id: string }) {
    const [checked, setChecked] = useState(status === "active");
    const [isLoading, setIsLoading] = useState(false);

    const { mutateAsync: updated } = useProductStatus();
    const handleToggle = async (val: boolean) => {
        setChecked(val);
        try {
            setIsLoading(true);
            const newStatus = val ? "active" : "inactive";
            await updated({ id, status: newStatus });
        } catch {
            setChecked(!val);
        } finally {
            setIsLoading(false);
        }
    };

    return <Switch checked={checked} onCheckedChange={handleToggle} disabled={isLoading} />;
}
