"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Store, Mail, Phone, MapPin, Facebook, Instagram, Twitter, LinkIcon, ContactIcon, Dribbble } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("common");

  const footerLinks = [
    { href: "/", label: t("home") },
    { href: "/#products", label: t("products") },
    { href: "/#about", label: t("about") },
  ];

  const contactInfo = [
    { icon: Mail, text: "contact@shop.com" },
    { icon: Phone, text: "+66 12 345 6789" },
    { icon: MapPin, text: "Bangkok, Thailand" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-6">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <Store className="h-6 w-6" />
              <span>{t('shop')}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("about")}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <LinkIcon className="h-6 w-6" />
              {t('quickLinks')}
            </h3>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <ContactIcon/>
              {t("contact")}
            </h3>
            <ul>
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <Dribbble />
              {t("followUs")}
            </h3>
            <div className="flex gap-1 sm:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-primary hover:bg-primary/10"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <Separator/> 
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row p-6">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Shop. {t("allRightsReserved")}.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t('privacyPolicy')}
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t('termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
