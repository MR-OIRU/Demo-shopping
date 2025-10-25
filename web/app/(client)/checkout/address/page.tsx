"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { useCartStore } from "@/lib/store/cart-store";

export default function AddressPage() {
  const router = useRouter();
  const t = useTranslations("checkout");
  const { items } = useCartStore();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "Thailand",
  });

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save address to local storage or state management
    localStorage.setItem("shippingAddress", JSON.stringify(formData));
    router.push("/checkout/payment");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <CheckoutSteps currentStep="cart" />

      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-6">{t("shippingAddress")}</h1>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>{t("shippingAddress")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="0XX-XXX-XXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressLine">{t("addressLine")}</Label>
                <Input
                  id="addressLine"
                  name="addressLine"
                  required
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">{t("city")}</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="จังหวัด"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">{t("postalCode")}</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="10XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t("country")}</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/cart")}
            >
              Back to Cart
            </Button>
            <Button type="submit" size="lg">
              {t("proceedToPayment")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
