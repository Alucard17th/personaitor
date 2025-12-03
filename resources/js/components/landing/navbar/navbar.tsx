import { Button } from '@/components/ui/button';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { dashboard, login, logout, register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Logo } from '.././logo';
import { NavMenu } from './nav-menu';
import { NavigationSheet } from './navigation-sheet';

const Navbar = () => {
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };
    return (
        <nav className="xs:h-16 fixed inset-x-4 top-6 z-[999] mx-auto h-14 max-w-(--breakpoint-xl) rounded-full border bg-background/50 backdrop-blur-xs dark:border-slate-700/70">
            <div className="mx-auto flex h-full items-center justify-between px-4">
                <Link href="/">
                    <Logo />
                </Link>

                {/* Desktop Menu */}
                <NavMenu className="hidden md:block" />

                <div className="flex items-center gap-3">
                    {/* <ThemeToggle /> */}
                    {auth.user ? (
                        <>
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href={logout()}
                                as="button"
                                onClick={handleLogout}
                                data-test="logout-button"
                                className="inline-flex items-center gap-2 rounded-sm border border-red-400 bg-red-100 px-5 py-1.5 text-sm leading-normal text-red-700 hover:bg-red-200 dark:border-red-600 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                            >
                                <LogOut className="h-4 w-4" />
                                Log out
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                    <Button className="xs:inline-flex hidden">
                        Get Started
                    </Button>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <NavigationSheet />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
