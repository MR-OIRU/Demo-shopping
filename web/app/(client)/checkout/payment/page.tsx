"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CreditCard, Building2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { useCartStore } from "@/lib/store/cart-store";
import { ShippingAddress } from "@/types";

const EMPTY_ADDR: ShippingAddress = {
  fullName: "", phoneNumber: "", addressLine: "", city: "",
  postalCode: "", country: "",
};

export default function PaymentPage() {
  const router = useRouter();
  const t = useTranslations("client.checkout");
  const tCommon = useTranslations("client.common");
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [shippingAddress] = useState<ShippingAddress>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("shippingAddress");
      if (raw) {
        try { return JSON.parse(raw) as ShippingAddress; } catch { }
      }
    }
    return EMPTY_ADDR;
  });

  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  const handlePlaceOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    const order = {
      orderNumber,
      items,
      total: getTotalPrice(),
      paymentMethod,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("lastOrder", JSON.stringify(order));
    clearCart();
    router.push("/checkout/success");
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <CheckoutSteps currentStep="payment" />

      <h1 className="text-xl sm:text-3xl font-bold m-3 text-center sm:text-left">{t("payment")}</h1>

      <div className="flex flex-col lg:flex-row gap-6 m-3">
        <div className="flex flex-col flex-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("paymentMethod")}</CardTitle>
              <CardDescription>
                {t('paymentMethodTitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="creditCard" id="creditCard" />
                  <Label
                    htmlFor="creditCard"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{t("creditCard")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('creditCardSubtitle')}
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                  <Label
                    htmlFor="bankTransfer"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <Building2 className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{t("bankTransfer")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('bankTransferSubtitle')}
                      </p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label
                    htmlFor="cod"
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <Banknote className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{t("cod")}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('codSubtitle')}
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("shippingAddress")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm">
                <div>
                  {t("fullName")}
                  <p className="text-muted-foreground ml-3"> {shippingAddress.fullName}</p>
                </div>
                <div>
                  {t("phoneNumber")}
                  <p className="text-muted-foreground ml-3">
                    {shippingAddress.phoneNumber}
                  </p>
                </div>
                <div>
                  {t("addressLine")}
                  <p className="text-muted-foreground ml-3">
                    {shippingAddress.addressLine} {shippingAddress.city} {shippingAddress.postalCode}
                  </p>
                </div>
                <div>
                  {t("country")}
                  <p className="text-muted-foreground ml-3">
                    {shippingAddress.country}
                  </p>
                </div>
              </div>
              <Button
                variant="link"
                className="px-0 mt-2"
                onClick={() => router.push("/cart")}
              >
                Change address
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col flex-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {tCommon("subtotal")}
                  </span>
                  <span>฿{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("shipping")}
                  </span>
                  <span>฿0</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{t("grandTotal")}</span>
                <span className="text-primary">
                  ฿{getTotalPrice().toLocaleString()}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
              >
                {t("placeOrder")}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/cart")}
              >
                {t('back')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
