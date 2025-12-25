import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { LocaleProvider } from "@/components/providers/locale-provider";

export const metadata: Metadata = {
    title: "Shop - Online Shopping Store",
    description: "Modern online shopping experience with the best products",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const messages = await getMessages();
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale")?.value;
    const initialLocale = localeCookie === "en" ? "en" : "th";

    return (
        <html lang={initialLocale} suppressHydrationWarning>
            <body className="antialiased">
                <NextIntlClientProvider messages={messages}>
                    <LocaleProvider initialLocale={initialLocale}>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                            {children}
                            <Toaster
                                richColors
                                duration={2000}
                                toastOptions={{
                                    style: { whiteSpace: "pre-line" },
                                }}
                            />
                        </ThemeProvider>
                    </LocaleProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
