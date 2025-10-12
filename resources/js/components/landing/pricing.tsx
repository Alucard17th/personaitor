'use client';

import InputError from '@/components/input-error';
import { Tabs, TabsList, TabsTrigger } from '@/components/landing/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { CircleHelp, Check } from 'lucide-react';
import * as React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const YEARLY_DISCOUNT = 20;

type Plan = {
    id?: number | string;
    name: string;
    description?: string;
    price: number | string;
    is_popular?: boolean;
    features: { title: string; tooltip?: string }[];
    paddle_price_id?: string;
};

type PricingProps = { plans: Plan[] };

const Pricing: React.FC<PricingProps> = ({ plans }) => {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const Paddle = (window as any).Paddle;

    const [selectedBillingPeriod, setSelectedBillingPeriod] = React.useState<
        'monthly' | 'yearly'
    >('monthly');
    const [checkoutPlanId, setCheckoutPlanId] = React.useState<string | null>(
        null,
    );
    const [showLoginModal, setShowLoginModal] = React.useState(false);

    const list = Array.isArray(plans) ? plans : [];

    // Listen for Google popup login success
    React.useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data?.type === 'google-login-success') {
                console.log('Event received:', event.data);
                const { checkoutPlanId } = event.data;
                setShowLoginModal(false);
                if (checkoutPlanId && Paddle) {
                    // Refresh Inertia props
                    router.reload({ only: ['auth'] });
                    openCheckout(checkoutPlanId);
                    setCheckoutPlanId(null);
                }
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [Paddle]);

    const openCheckout = (priceId: string) => {
        router.post(
            route('billing.checkout'),
            { price_id: priceId, type: 'default' },
            {
                preserveScroll: true,
                only: ['checkoutPayload'],
                onSuccess: (page: any) => {
                    const payload = page?.props?.checkoutPayload;
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
                                window.location.origin + '/billing/success',
                            ...payload?.settings,
                        },
                    };

                    Paddle.Checkout.open(merged);
                },
                onError: () => alert('Unable to start checkout.'),
            },
        );
    };

    const handleSubscribeClick = (plan: Plan) => {
        if (!user) {
            setCheckoutPlanId(plan.paddle_price_id || null);
            setShowLoginModal(true);
            return;
        }
        openCheckout(plan.paddle_price_id!);
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        if (checkoutPlanId) {
            openCheckout(checkoutPlanId);
            setCheckoutPlanId(null);
        }
    };

    return (
        <div
            id="pricing"
            className="xs:py-20 flex flex-col items-center justify-center px-6 py-12"
        >
            <h1 className="xs:text-4xl text-center text-3xl font-bold tracking-tight md:text-5xl">
                Pricing
            </h1>

            <Tabs
                value={selectedBillingPeriod}
                onValueChange={(v) => setSelectedBillingPeriod(v as any)}
                className="mt-8"
            >
                <TabsList className="h-11 rounded-full bg-primary/5 px-1.5">
                    <TabsTrigger
                        value="monthly"
                        className="rounded-full py-1.5"
                    >
                        Monthly
                    </TabsTrigger>
                    <TabsTrigger value="yearly" className="rounded-full py-1.5">
                        Yearly (Save {YEARLY_DISCOUNT}%)
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 text-center md:grid-cols-3 lg:grid-cols-3 px-8">
                {list.map((plan) => {
                    const basePrice = Number(plan.price) || 0;
                    const displayPrice =
                        selectedBillingPeriod === 'monthly'
                            ? basePrice
                            : Math.round(
                                  basePrice * (1 - YEARLY_DISCOUNT / 100),
                              );

                    return (
                        <div
                            key={plan.name}
                            className={cn(
                                'relative flex h-full flex-col rounded-xl border bg-white p-6 shadow-md',
                                {
                                    'border-[2px] border-primary':
                                        plan.is_popular,
                                },
                            )}
                        >
                            {!!plan.is_popular && (
                                <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                                    Most Popular
                                </Badge>
                            )}

                            <h3 className="text-lg font-medium">{plan.name}</h3>
                            <p className="mt-2 text-4xl font-bold">
                                ${displayPrice}
                                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                                    /month
                                </span>
                            </p>
                            {plan.description && (
                                <p className="mt-3 font-small text-muted-foreground">
                                    {plan.description}
                                </p>
                            )}
                            <ul className="mt-6 flex-1 space-y-1">
                                {plan.features?.map((feature: any) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-2 text-sm leading-6"
                                    >
                                        <Check className="mt-1 h-4 w-4 text-dark-600" />
                                        <span>{feature}</span>
                                        {feature.tooltip && (
                                            <Tooltip>
                                                <TooltipTrigger className="cursor-help">
                                                    <CircleHelp className="mt-1 h-4 w-4 text-gray-500" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {feature.tooltip}
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => handleSubscribeClick(plan)}
                                className={cn(
                                    'mt-8 w-full rounded-lg px-5 py-2.5', // <-- mt-auto pushes button to bottom
                                    plan.is_popular
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'border bg-black text-white hover:bg-gray-100 hover:text-black',
                                )}
                            >
                                {plan.is_popular
                                    ? 'Choose Popular Plan'
                                    : 'Start Free Trial'}
                            </Button>
                        </div>
                    );
                })}
            </div>

            {/* Login Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="w-full sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Login to Subscribe</DialogTitle>
                    </DialogHeader>
                    <LoginForm
                        checkoutPlanId={checkoutPlanId}
                        onSuccess={handleLoginSuccess}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

type LoginFormProps = { onSuccess: () => void; checkoutPlanId?: string | null };

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, checkoutPlanId }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        from_pricing_modal: '1', // signal for pricing modal
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login', { onSuccess });
    };

    const handleGoogleLogin = () => {
        if (checkoutPlanId)
            sessionStorage.setItem('from_pricing_plan_id', checkoutPlanId);
        window.open(
            `/auth/google/redirect-popup?plan_id=${checkoutPlanId}`,
            'GoogleLogin',
            'width=500,height=600',
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                <InputError message={errors.email} />

                <Input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                />
                <InputError message={errors.password} />

                <Button type="submit" disabled={processing}>
                    {processing ? 'Logging in…' : 'Login'}
                </Button>
            </form>

            <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="mt-2 flex w-full items-center justify-center gap-2"
            >
                <img src="/images/google-logo.svg" className="h-5 w-5" />
                Continue with Google
            </Button>
        </div>
    );
};

export default Pricing;
