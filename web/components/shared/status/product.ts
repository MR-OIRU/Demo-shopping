"use client";

import { useTranslations } from "next-intl";
import { ProductTabValue } from "@/types";

export function ProductTabs() {
  const t = useTranslations("admin.productPage.status");

  return [
    { value: "all", label: t("all") },
    { value: "active", label: t("active") },
    { value: "inactive", label: t("inactive") },
  ] as const satisfies readonly { value: ProductTabValue; label: string }[];
}
