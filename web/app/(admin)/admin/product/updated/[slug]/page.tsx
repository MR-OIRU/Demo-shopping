import ProductActionContent from "@/components/admin/product/created-updated/productActionContent";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { useTranslations } from "next-intl";


type PageProps = {
    params: {
        slug: string;
    };
};

export default function UpdatedProductPage({ params }: PageProps) {
    const t = useTranslations('admin.productPage');
    const productId = params.slug;
    return (
        <>
            <AppSidebarHeader breadcrumbs={t('breadcrumbUpdated')} />
            <ProductActionContent id={productId}/>
        </>
    );
}
