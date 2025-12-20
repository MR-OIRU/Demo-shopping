import AppLogoIcon from "./app-logo-icon";

export default function AppLogo() {
    return (
        <div className="flex w-full items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 text-sidebar-primary-foreground shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                <AppLogoIcon className="size-5 fill-current text-white" />
                <span className="pointer-events-none absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold leading-tight">
                        Shop Backoffice
                    </span>
                </div>
                <span className="block truncate text-xs text-muted-foreground">
                    Dashboard & Operations
                </span>
            </div>
        </div>
    );
}
