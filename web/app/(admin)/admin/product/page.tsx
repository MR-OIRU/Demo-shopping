
import ProductPageContent from "@/components/admin/product/productPageContent";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";

export default function ProductPage() {
    const t = useTranslations('admin.productPage');
    return (
        <>
            <AppSidebarHeader breadcrumbs={t('breadcrumbs')} />
            <ProductPageContent/>
        </>
    );
}
