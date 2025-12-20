"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppUser } from '@/next-auth';
import { ChevronsUpDown } from 'lucide-react';
import { UserInfo } from './user-info';
import { UserMenuContent } from './user-menu-content';
import { useEffect, useState } from 'react';

export function NavUser({ user }: { user: AppUser | null }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { state } = useSidebar();
    const isMobile = useIsMobile();

    if (!user) return null;
    if (!mounted) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent cursor-pointer">
                            <UserInfo user={user} showEmail={true} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
