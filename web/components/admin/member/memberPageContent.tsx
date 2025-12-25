"use client";

import { useMembers } from "@/hooks/use-member";
import MemberListTable from "../tables/member/memberList";

export default function MemberPageContent() {
      const { data, refetch } = useMembers();

    return (
        <div className="p-6">
            <div className="grid grid-cols-1">
                <MemberListTable data={data || []} refetch={refetch} />
            </div>
        </div>
    );
}
