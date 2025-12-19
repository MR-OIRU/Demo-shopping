import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../globals.css'
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import Providers from "../providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Shop - Online Shopping Store",
    description: "Modern online shopping experience with the best products",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale")?.value;
    const initialLocale = localeCookie === "en" ? "en" : "th";
    return (
        <html lang={initialLocale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                    >
                        <SidebarProvider>
                            <AppSidebar />
                            <main>
                                <SidebarTrigger />
                                {children}
                            </main>
                        </SidebarProvider>
                    </ThemeProvider>
                    <Toaster richColors duration={2000} />
                </Providers>
            </body>
        </html>
    );
}
