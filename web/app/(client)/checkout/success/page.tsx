"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { Order } from "@/types";

export default function SuccessPage() {
  const router = useRouter();
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");

  // ✅ อ่าน localStorage ตอน mount (เฉพาะ client)
  const [order] = useState<Order | null>(() => {
    if (typeof window !== "undefined") {
      const lastOrder = localStorage.getItem("lastOrder");
      if (lastOrder) {
        try {
          return JSON.parse(lastOrder) as Order;
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // ✅ redirect ถ้าไม่มี order
  useEffect(() => {
    if (!order) router.push("/");
  }, [order, router]);

  if (!order) return null;

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <CheckoutSteps currentStep="success" />

      <div className="mt-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </div>

        <h1 className="text-3xl font-bold mb-2">{t("orderSuccess")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("thankYou")}
        </p>

        <Card className="text-left">
          <CardHeader>
            <CardTitle>{t("orderNumber")}</CardTitle>
            <CardDescription className="text-lg font-mono">
              {order.orderNumber}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tCommon("quantity")}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {tCommon("subtotal")}
                </span>
                <span>฿{order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span>฿0</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>{t("grandTotal")}</span>
              <span className="text-primary">
                ฿{order.total.toLocaleString()}
              </span>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                We ve sent an email confirmation to your inbox with all the
                order details. You can track your order status anytime.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">{t("backToHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
