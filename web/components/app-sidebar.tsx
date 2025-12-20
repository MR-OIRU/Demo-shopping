import { LayoutDashboard, ShoppingCart, Package } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import AppLogo from "./app-logo"
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { NavItem } from "@/types";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTranslations } from "next-intl/server";

export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  const user = session?.user ?? null;
  const t = await getTranslations('admin');

  const mainNavItems: NavItem[] = [
    {
      title: t("dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("product"),
      href: "/admin/product",
      icon: Package,
    },
    {
      title: t("order"),
      href: "/admin/order",
      icon: ShoppingCart,
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter className="border-t">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}