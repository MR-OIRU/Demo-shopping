import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function UserMenuContent({ openDialog }: { openDialog: () => void }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('admin');

    const handleLogout = async () => {
        if (loading) return;

        try {
            setLoading(true);
            await signOut({ redirect: false });
            router.push("/login");
            router.refresh();
        } catch {
        } finally {
            setLoading(false);
        }
    };
    return (
        <>

            <DropdownMenuGroup>
                <DropdownMenuItem
                    className='cursor-pointer'
                    onSelect={(e) => {
                        e.preventDefault();
                        openDialog();
                    }}>
                    <Settings className="hover:text-white" />
                    {t('settingProfile')}
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    handleLogout();
                }}
                disabled={loading}
                className="cursor-pointer"
            >
                <LogOut className="size-4" />
                {loading ? t('loggingOut') : t('logout')}
            </DropdownMenuItem>
        </>
    );
}
