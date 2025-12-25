import MemberPageContent from "@/components/admin/member/memberPageContent";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";

export default function MemberPage() {
    const t = useTranslations('admin.memberPage');
    return (
        <>
            <AppSidebarHeader breadcrumbs={t('breadcrumbs')} />
            <MemberPageContent/>
        </>
    );
}
