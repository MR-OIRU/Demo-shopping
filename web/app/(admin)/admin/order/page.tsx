import OrderPageContent from "@/components/admin/order/orderPageContent";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";

export default function OrderPage() {
    const t = useTranslations('admin.orderPage');
    return (
        <>
            <AppSidebarHeader breadcrumbs={t('breadcrumbs')} />
            <OrderPageContent/>
        </>
    );
}
