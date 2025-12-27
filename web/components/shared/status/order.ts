"use client";

import { useTranslations } from "next-intl";
import { OrderTabValue } from "@/types";

export function OrderTabs() {
  const t = useTranslations("admin.orderPage.status");

  return [
    { value: "all", label: t("all") },
    { value: "pending_payment", label: t("pending_payment") },
    { value: "paid", label: t("paid") },
    { value: "waiting_shipment", label: t("waiting_shipment") },
    { value: "shipped", label: t("shipped") },
    { value: "cancelled", label: t("cancelled") },
  ] as const satisfies readonly { value: OrderTabValue; label: string }[];
}
