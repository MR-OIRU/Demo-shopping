import AdminProviders from "./providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppContent } from "@/components/app-content";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProviders>
            <SidebarProvider>
                <AppSidebar />
                <AppContent variant="sidebar">
                    {children}
                </AppContent>
            </SidebarProvider>
        </AdminProviders>
    );
}
