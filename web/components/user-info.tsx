import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getRoleMeta } from '@/lib/role-mate';
import { AppUser } from '@/next-auth';
import { Badge } from './ui/badge';

export function UserInfo({ user, showEmail = false }: { user: AppUser; showEmail?: boolean }) {
    const initials =
        (user.username ?? "U")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join("") || "U";

    const roleMeta = getRoleMeta(user.role);

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {initials}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-semibold">
                        {user.username}
                    </span>

                    {roleMeta && (
                        <Badge
                            variant={roleMeta.badgeVariant}
                            className="shrink-0 h-5 px-2 text-[10px] font-semibold tracking-wide"
                        >
                            {roleMeta.label}
                        </Badge>
                    )}
                </div>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </>
    );
}
