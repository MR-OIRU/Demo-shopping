"use client";

import type { Table as TanTable } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { useTranslations } from "next-intl";

interface DataTableProps<TData> {
    table: TanTable<TData>;
    showToolbar?: boolean;
    showPagination?: boolean;
    refetch?: () => void;
}

export function DataTable<TData>({
    table,
    showToolbar = false,
    showPagination = false,
    refetch,
}: DataTableProps<TData>) {
    const t = useTranslations('admin.table');
    return (
        <div className="space-y-3">
            {showToolbar && <DataTableToolbar table={table} refetch={refetch} />}

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.columnDef.enableSorting;
                                    const isSorted = header.column.getIsSorted();

                                    return (
                                        <TableHead
                                            key={header.id}
                                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                            className={
                                                canSort ? "cursor-pointer transition-colors select-none" : "cursor-default"
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {canSort && (
                                                    <ArrowUpDown
                                                        size={14}
                                                        className={`transition-transform ${isSorted === "asc"
                                                                ? "rotate-180"
                                                                : isSorted === "desc"
                                                                    ? "rotate-0"
                                                                    : "opacity-50"
                                                            }`}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    {t("noResults")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {showPagination && <DataTablePagination table={table} />}
        </div>
    );
}
