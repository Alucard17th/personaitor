import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import React from 'react';

type CheckoutButtonProps = {
  priceId: string;
  label?: string;
  className?: string;
  type?: string; // "default"
};

export function CheckoutButton({ priceId, label = 'Subscribe', className, type = 'default' }: CheckoutButtonProps) {
  const [loading, setLoading] = React.useState(false);

  function toAbs(url: string) {
    try { return new URL(url, window.location.origin).toString(); }
    catch { return new URL('/', window.location.origin).toString(); }
  }

  function openCheckout() {
    setLoading(true);
    const Paddle = (window as any).Paddle;

    router.post(
      route('billing.checkout'),
      { price_id: priceId, type },
      {
        preserveScroll: true,
        only: ['checkoutPayload'],
        onSuccess: (page: any) => {
          const payload = page?.props?.checkoutPayload;
          if (!payload) {
            console.error('No checkoutPayload in props:', page);
            alert('Unable to start checkout. Please try again.');
            return;
          }
          if (!Paddle) {
            alert('Paddle SDK not loaded');
            return;
          }

          // Ensure camelCase + absolute URLs
          const merged = {
            ...payload,
            items: Array.isArray(payload.items)
              ? payload.items.map((it: any) => ({ ...it, priceId: it.priceId ?? it.price_id }))
              : payload.items,
            settings: {
              displayMode: 'overlay',
              theme: 'light',
              successUrl: toAbs(payload?.settings?.successUrl ?? '/app/billing/success'),
              ...payload?.settings,
            },
          };

          // Must have items[] or transactionId
          if ((!merged.items || !merged.items.length) && !merged.transactionId) {
            console.error('Missing items[] or transactionId:', merged);
            alert('Checkout could not be started.');
            return;
          }

          console.log('Paddle.Checkout.open:', page?.props?.checkoutPayload);
          console.log('Paddle.Checkout.open:', merged);

          Paddle.Checkout.open(merged);
        },
        onError: () => alert('Unable to start checkout.'),
        onFinish: () => setLoading(false),
      }
    );
  }

  return (
    <Button onClick={openCheckout} disabled={loading} className={className}>
      {loading ? 'Loading…' : label}
    </Button>
  );
}
