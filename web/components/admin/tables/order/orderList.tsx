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
import { OrderListItem } from "@/types";


interface OrderListTableProps {
    data: OrderListItem[];
    refetch?: () => void;
}
export default function OrderListTable({ data, refetch }: OrderListTableProps) {
    const t = useTranslations("admin.table");
    const tOrder = useTranslations("admin.table.order");

    const columns: ColumnDef<OrderListItem>[] = [
        {
            accessorKey: "no",
            header: "#",
            enableSorting: true,
            cell: ({ row }) => <>{row.index + 1}</>,
        },
        {
            accessorKey: "orderId",
            header: tOrder("orderId"),
            enableSorting: true,
        },
        {
            accessorKey: "customer",
            header: tOrder("customer"),
            enableSorting: true,
        },
        {
            accessorKey: "total",
            header: tOrder("total"),
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: tOrder("status"),
            enableSorting: true,
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
