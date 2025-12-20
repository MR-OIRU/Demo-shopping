"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useCartStore } from "@/lib/store/cart-store";
import { useTranslations } from "next-intl";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShippingSchema } from "@/schema/shopping.schema";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const t = useTranslations('client.common');
  const tCheckout = useTranslations('client.checkout');
  const router = useRouter();

  const form = useForm<ShippingSchema>({
    resolver: zodResolver(ShippingSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      addressLine: "",
      city: "",
      postalCode: "",
      country: "Thailand",
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("shippingAddress");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
      } catch (err) {
        console.error("Failed to parse saved address:", err);
      }
    }
  }, [form]);

  const onSubmit = (values: ShippingSchema) => {
    localStorage.setItem("shippingAddress", JSON.stringify(values));
    router.push("/checkout/payment");
  };

  const onSubmitError = () => {
    toast.error("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
  };

  return (
    <div className="container mx-auto my-6">
      <CheckoutSteps currentStep="cart" />

      <div className="mt-6 flex items-center justify-between p-3">
        <h1 className="text-3xl font-bold tracking-tight">{tCheckout('cart')}</h1>
        <Button variant="ghost" onClick={clearCart}>
          Clear All
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 p-3">
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
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
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

        <div className="lg:col-span-1 space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onSubmitError)}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{tCheckout('shippingAddress')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="fullName">
                            {tCheckout("fullName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="fullName"
                              placeholder="กรอกชื่อ-นามสกุล"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="phoneNumber">
                            {tCheckout("phoneNumber")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="phoneNumber"
                              type="tel"
                              placeholder="0XX-XXX-XXXX"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="addressLine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="addressLine">
                            {tCheckout("addressLine")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="addressLine"
                              placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="city">
                              {tCheckout("city")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="city"
                                placeholder="จังหวัด"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="postalCode">
                              {tCheckout("postalCode")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="postalCode"
                                placeholder="10XXX"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="country">
                            {tCheckout("country")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              id="country"
                              disabled
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>


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
                    type="submit"
                    disabled={items.length === 0}
                  >
                    {tCheckout('proceedToPayment')}
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">{t('continueShopping')}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

