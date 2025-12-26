"use client";

import { useMembers } from "@/hooks/use-member";
import MemberListTable from "../tables/member/memberList";
import MemberDialog from "./dialog/create-updated/memberDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";

export default function MemberPageContent() {
    const { data, refetch } = useMembers();
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setOpenDialog(open);
    };
    return (
        <div className="p-6 grid grid-cols-1 gap-3">
            <div>
                <Button size="sm" className="cursor-pointer" onClick={() => handleOpenChange(true)}><UserPlus2 />เพิ่มข้อมูลสมาชิก</Button>
            </div>
            <div className="grid grid-cols-1">
                <MemberListTable data={data || []} refetch={refetch} />
            </div>
            <MemberDialog open={openDialog} onOpenChange={handleOpenChange} />
        </div>
    );
}
