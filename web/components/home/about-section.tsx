"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck, Truck, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  const t = useTranslations("client.home");

  const features = [
    {
      icon: Award,
      title: t("qualityProducts"),
      description: t("qualityProductsDesc"),
    },
    {
      icon: Truck,
      title: t("fastDelivery"),
      description: t("fastDeliveryDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("securePayment"),
      description: t("securePaymentDesc"),
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("aboutTitle")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("aboutDescription")}
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <h3 className="text-2xl font-semibold text-center mb-8">
            {t("whyChooseUs")}
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 transition-all hover:shadow-lg hover:border-primary/50"
                >
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
