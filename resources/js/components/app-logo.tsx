import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { appName } = usePage().props as unknown as { appName: string };

    return (
        <div className="flex items-center">
            <div className="flex aspect-square w-8 h-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="w-5 h-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 flex-1 text-left text-sm">
                <span className="truncate font-semibold leading-tight">{appName}</span>
            </div>
        </div>
    );
}
