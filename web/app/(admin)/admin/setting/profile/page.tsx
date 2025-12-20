import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";

export default function SettingProfilePage() {
    const t = useTranslations('admin');
    return (
        <>
            <AppSidebarHeader breadcrumbs={t('settingProfile')} />
        </>
    );
}
