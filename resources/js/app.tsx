import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { route as routeFn } from 'ziggy-js';
import type { Page } from '@inertiajs/core';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

if (!(window as any).route) {
  (window as any).route = (name: string, params?: any, absolute?: boolean) =>
    routeFn(name, params, absolute, (window as any).Ziggy);
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const maybeResumeCheckout = (page: Page) => {
            const authUser = (page?.props as any)?.auth?.user;
            if (!authUser) return;

            const planId = sessionStorage.getItem('from_pricing_plan_id');
            if (!planId) return;

            sessionStorage.removeItem('from_pricing_plan_id');

            const tryOpen = () => {
                const Paddle = (window as any).Paddle;
                if (!Paddle) {
                    window.setTimeout(tryOpen, 300);
                    return;
                }

                const checkoutUrl = (window as any).route
                    ? (window as any).route('billing.checkout')
                    : routeFn(
                          'billing.checkout',
                          undefined,
                          false,
                          (window as any).Ziggy,
                      );

                router.post(
                    checkoutUrl,
                    { price_id: planId, type: 'default' },
                    {
                        preserveScroll: true,
                        only: ['checkoutPayload'],
                        onSuccess: (resp: any) => {
                            const payload = resp?.props?.checkoutPayload;
                            if (!payload) {
                                alert('Unable to start checkout.');
                                return;
                            }

                            const merged = {
                                ...payload,
                                items: Array.isArray(payload.items)
                                    ? payload.items.map((it: any) => ({
                                          ...it,
                                          priceId: it.priceId ?? it.price_id,
                                      }))
                                    : payload.items,
                                settings: {
                                    displayMode: 'overlay',
                                    theme: 'light',
                                    successUrl:
                                        payload?.settings?.successUrl ??
                                        window.location.origin +
                                            '/billing/success',
                                    ...payload?.settings,
                                },
                            };

                            Paddle.Checkout.open(merged);
                        },
                        onError: () => alert('Unable to start checkout.'),
                    },
                );
            };

            tryOpen();
        };

        // try on initial render
        maybeResumeCheckout((props as any)?.initialPage as Page);

        // and after any successful Inertia navigation (register/login redirects)
        router.on('success', (event: any) => {
            const page = event?.detail?.page as Page | undefined;
            if (page) maybeResumeCheckout(page);
        });

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
