"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store/cart-store";
import { useTranslations } from "next-intl";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const t = useTranslations('common');
  const tCheckout = useTranslations('checkout');
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    postalCode: "",
    country: "Thailand",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProceedToPayment = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.addressLine || !formData.city || !formData.postalCode) {
      toast.error("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    localStorage.setItem("shippingAddress", JSON.stringify(formData));
    router.push('/checkout/payment');
  };

  return (
    <div className="container">
      {/* Checkout Steps */}
      <CheckoutSteps currentStep="cart" />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{tCheckout('cart')}</h1>
        <Button variant="ghost" onClick={clearCart}>
          Clear All
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2">
          {items.length === 0 ? (
            <Card className="text-center p-8 ">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('emptyCart')}</h2>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                          <p className="mt-2 text-lg font-bold">
                            ฿{item.price.toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">{t('remove')}</span>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {t('subtotal')}
                          </p>
                          <p className="text-lg font-bold">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>

        {/* Right Column: Address Form + Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Address Form */}
          <Card>
            <CardHeader>
              <CardTitle>{tCheckout('shippingAddress')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{tCheckout("fullName")}</Label>
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
                  <Label htmlFor="phoneNumber">{tCheckout("phoneNumber")}</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="addressLine">{tCheckout("addressLine")}</Label>
                  <Input
                    id="addressLine"
                    name="addressLine"
                    required
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">{tCheckout("city")}</Label>
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
                    <Label htmlFor="postalCode">{tCheckout("postalCode")}</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="10XXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{tCheckout("country")}</Label>
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

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('subtotal')}</span>
                  <span>฿{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{tCheckout('shipping')}</span>
                  <span>฿0</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{tCheckout('grandTotal')}</span>
                <span>฿{getTotalPrice().toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleProceedToPayment}
                disabled={items.length === 0}
              >
                {tCheckout('proceedToPayment')}
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">{t('continueShopping')}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
