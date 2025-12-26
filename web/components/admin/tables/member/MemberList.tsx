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
import { MemberListItem } from "@/types";
import { useTranslations } from "next-intl";
import { getRoleMeta } from "@/lib/role-mate";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTh } from "@/lib/format-date";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useDeleteMemberById, useMemberStatus } from "@/hooks/use-member";
import { PenSquareIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MemberDialog from "../../member/dialog/create-updated/memberDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface MemberListTableProps {
    data: MemberListItem[];
    refetch?: () => void;
}
export default function MemberListTable({ data, refetch }: MemberListTableProps) {
    const t = useTranslations("admin.table");
    const tMember = useTranslations("admin.table.member");

    const columns: ColumnDef<MemberListItem>[] = [
        {
            accessorKey: "no",
            header: "#",
            enableSorting: true,
            cell: ({ row }) => <>{row.index + 1}</>,
        },
        {
            accessorKey: "role",
            header: tMember("role"),
            enableSorting: true,
            cell: ({ row }) => {
                const roleMeta = getRoleMeta(row.original.role);

                if (!roleMeta) return null;

                return (
                    <Badge
                        variant={roleMeta.badgeVariant}
                        className="shrink-0 h-5 px-2 text-[10px] font-semibold tracking-wide"
                    >
                        {roleMeta.label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "profile",
            header: tMember("image"),
            cell: ({ row }) => {
                const imageUrl = row.original.profile;
                const username = row.original.username;

                const initials =
                    (username ?? "U")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((s) => s[0]?.toUpperCase())
                        .join("") || "U";

                return (
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                        {imageUrl ? (
                            <AvatarImage
                                src={imageUrl}
                                alt={username ?? "Username"}
                                className="object-cover"
                            />
                        ) : (
                            <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                {initials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                );
            },
        },

        { accessorKey: "username", header: tMember("username"), enableSorting: true },
        { accessorKey: "email", header: tMember("email"), enableSorting: true },
        { accessorKey: "phone", header: tMember("phone"), enableSorting: true },
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
            accessorKey: "lastLogin",
            header: tMember("lastLogin"),
            enableSorting: true,
            cell: ({ getValue }) => formatTh(getValue<string>()),
        },
        {
            accessorKey: "created",
            header: t("created"),
            enableSorting: true,
            cell: ({ getValue }) => formatTh(getValue<string>()),
        },
        {
            id: "action",
            header: t("action"),
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <EditAction id={row.original.id} />
                    <DeleteAction id={row.original.id} />
                </div>
            ),
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

    const { mutateAsync: updated } = useMemberStatus();
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

function EditAction({ id }: { id: string }) {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
    };

    return (
        <>
            <Button size="sm" className="cursor-pointer" onClick={() => handleOpenChange(true)}>
                <PenSquareIcon />
            </Button>

            <MemberDialog
                open={openDialog}
                onOpenChange={handleOpenChange}
                id={id}
            />
        </>
    );
}

function DeleteAction({ id }: { id: string }) {
    const t = useTranslations("admin.table.alert");
    const { mutateAsync: deleted, isPending } = useDeleteMemberById();
    const onDelete = async () => {
        try {
            await deleted(id);
        } catch {
            // handled by react-query onError
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="cursor-pointer">
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="cursor-pointer sm:w-[150px]">
                        {isPending ? t('deleting') : t('delete')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
