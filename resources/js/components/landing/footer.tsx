'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Link, router } from '@inertiajs/react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Logo } from './logo';

const footerLinks = [
    { title: 'Features', href: route('home') + '#features' },
    { title: 'Pricing', href: route('home') + '#pricing' },
    { title: 'FAQ', href: route('home') + '#faq' },
    { title: 'Testimonials', href: route('home') + '#testimonials' },
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Terms of Use', href: '/terms' },
];

function getStickyHeaderOffset(): number {
    const header =
        document.querySelector<HTMLElement>('[data-sticky-header]') ||
        document.querySelector<HTMLElement>('header.sticky') ||
        document.querySelector<HTMLElement>('header');
    return header?.offsetHeight ?? 72;
}

const Footer = () => {
    const emailRef = useRef<HTMLInputElement>(null);

    // Same-page smooth scroll with CSS scroll-margin (more reliable than manual scrollBy)
    const smoothScrollToId = useCallback((id: string) => {
        if (!id) return;
        const el = document.getElementById(id);
        if (!el) return;

        const offset = getStickyHeaderOffset();
        const previous = el.style.scrollMarginTop;
        el.style.scrollMarginTop = `${offset + 8}px`; // +8 for breathing room
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Clean up the temporary inline style after the scroll settles
        window.setTimeout(() => {
            el.style.scrollMarginTop = previous;
        }, 600);
    }, []);

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

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = emailRef.current?.value?.trim();
        if (!email) return;

        // Use a normal POST (fetch) here to avoid Inertia scroll side effects
        fetch(route('newsletter.subscribe'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ email }),
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}) as any);
                    throw new Error(
                        (data?.errors && data.errors.email) ||
                            'Failed to subscribe.',
                    );
                }
                toast.success('Subscribed successfully!');
                if (emailRef.current) emailRef.current.value = '';
            })
            .catch((err: any) =>
                toast.error(
                    err.message || 'Failed to subscribe. Please try again.',
                ),
            );
    };

    return (
        <footer className="dark mt-40 bg-background text-foreground dark:border-t">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-12 sm:flex-row xl:px-0">
                    <div>
                        {/* Logo */}
                        <Link href="/" aria-label="Go to homepage">
                            <Logo />
                        </Link>

                        <ul className="mt-6 flex flex-wrap items-center gap-4">
                            {footerLinks.map(({ title, href }) => (
                                <li key={title}>
                                    <a
                                        href={href}
                                        className="text-muted-foreground hover:text-foreground"
                                        onClick={(e) =>
                                            handleAnchorClick(e, href)
                                        }
                                    >
                                        {title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Subscribe Newsletter */}
                    <div className="w-full max-w-xs">
                        <h6 className="font-semibold">Stay up to date</h6>
                        <form
                            className="mt-4 flex items-center gap-2"
                            onSubmit={handleSubscribe}
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                required
                                ref={emailRef}
                                aria-label="Email address"
                                inputMode="email"
                                autoComplete="email"
                            />
                            <Button
                                type="submit"
                                aria-label="Subscribe to newsletter"
                            >
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-5 px-6 py-8 sm:flex-row xl:px-0">
                    <span className="text-center text-muted-foreground sm:text-start">
                        &copy; {new Date().getFullYear()}{' '}
                        <a
                            href="/"
                            className="underline-offset-2 hover:underline"
                        >
                            {import.meta.env.VITE_APP_NAME}
                        </a>
                        . All rights reserved.
                    </span>

                    <div className="flex items-center gap-5 text-muted-foreground">
                        <a
                            href="https://x.com/EddallalNordin"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Follow on X"
                        >
                            <TwitterIcon className="h-5 w-5" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/noureddine-eddallal-03aba3182"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Connect on LinkedIn"
                        >
                            <LinkedinIcon className="h-5 w-5" />
                        </a>
                        <a
                            href="https://github.com/Alucard17th"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View GitHub"
                        >
                            <GithubIcon className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
