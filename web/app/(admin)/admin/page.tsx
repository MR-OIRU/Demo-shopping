import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";
export default function DashboardPage() {
  const t = useTranslations('admin');
  return (
    <>
      <AppSidebarHeader breadcrumbs={t('dashboard')} />
    </>
  );
}
