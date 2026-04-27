
import ProductActionContent from "@/components/admin/product/created-updated/productActionContent";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";

export default function InsertProductPage() {
    const t = useTranslations('admin.productPage');
    return (
        <>
            <AppSidebarHeader breadcrumbs={t('breadcrumbInsert')} />
            <ProductActionContent />
        </>
    );
}
