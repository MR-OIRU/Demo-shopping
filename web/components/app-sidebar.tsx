import { LayoutDashboard, ShoppingCart, Package, Users } from "lucide-react"
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
import { getTranslations } from "next-intl/server";

export async function AppSidebar() {
  const t = await getTranslations('admin');

  const mainNavItems: NavItem[] = [
    {
      title: t("dashboard"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("member"),
      href: "/admin/member",
      icon: Users,
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}