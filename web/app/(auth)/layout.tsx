import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '../globals.css'
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Login - Online Shopping Store",
    description: "Login to your account to manage orders and shopping preferences",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("locale")?.value;
    const initialLocale = localeCookie === "th" ? "th" : "en";
    return (
        <html lang={initialLocale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
                </ThemeProvider>
                <Toaster richColors duration={2000} />
            </body>
        </html>
    );
}
