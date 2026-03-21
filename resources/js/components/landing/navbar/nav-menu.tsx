import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { router } from '@inertiajs/react';
import { NavigationMenuProps } from '@radix-ui/react-navigation-menu';
// import Link from "next/link";

const headerLinks = [
    { title: 'Features', href: route('home') + '#features' },
    { title: 'Pricing', href: route('home') + '#pricing' },
    { title: 'FAQ', href: route('home') + '#faq' },
    { title: 'Testimonials', href: route('home') + '#testimonials' },
];

export const NavMenu = (props: NavigationMenuProps) => {
    const handleAnchorClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();

        // Separate path and hash
        const hashIndex = href.indexOf('#');
        const path = hashIndex > -1 ? href.substring(0, hashIndex) : href;
        const hash = hashIndex > -1 ? href.substring(hashIndex) : '';

        // Already on the same page? Just scroll
        if (window.location.pathname === path) {
            const el = document.getElementById(hash.replace('#', ''));
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        // Use Inertia to visit path + hash
        router.visit(path + hash, {
            preserveScroll: true,
            onSuccess: () => {
                // Ensure the element exists after DOM render
                setTimeout(() => {
                    const el = document.getElementById(hash.replace('#', ''));
                    if (el)
                        el.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                        });
                }, 50); // small delay
            },
        });
    };

    const handleVisit = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        router.visit(href);
    };

    return (
        <NavigationMenu viewport={false} {...props}>
            <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
                {headerLinks.map(({ title, href }) => (
                    <NavigationMenuItem key={title}>
                        <NavigationMenuLink asChild>
                            <a
                                href={href}
                                onClick={(e) => handleAnchorClick(e, href)}
                            >
                                {title}
                            </a>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <a
                            href="/blog"
                            onClick={(e) => handleVisit(e, '/blog')}
                        >
                            Blog
                        </a>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Free tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="w-[240px] p-2">
                            <NavigationMenuLink asChild>
                                <a
                                    href="/free/persona-builder"
                                    onClick={(e) =>
                                        handleVisit(e, '/free/persona-builder')
                                    }
                                    className="block rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    Free Persona Builder
                                </a>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                                <a
                                    href="/free/utm-builder"
                                    onClick={(e) =>
                                        handleVisit(e, '/free/utm-builder')
                                    }
                                    className="block rounded-sm p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                >
                                    Free UTM Builder
                                </a>
                            </NavigationMenuLink>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};
