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
    const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login');

    const list = Array.isArray(plans) ? plans : [];

    const listWithFree = React.useMemo(() => {
        const hasFree = list.some((p) => (Number(p.price) || 0) <= 0);
        if (hasFree) return list;

        const freePlan: Plan = {
            id: 'free',
            name: 'Free',
            description: 'Generate 1 persona free after signup.',
            price: 0,
            is_popular: false,
            features: [
                { title: '1 persona generation credit' },
                { title: 'Pains, triggers, objections, and angles' },
                { title: 'Export & editing in the builder' },
            ],
        };

        return [freePlan, ...list];
    }, [list]);

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
        const basePrice = Number(plan.price) || 0;
        if (basePrice <= 0) {
            if (user) {
                router.visit('/app/personas/create');
                return;
            }
            setCheckoutPlanId(null);
            setAuthMode('signup');
            setShowLoginModal(true);
            return;
        }
        if (!user) {
            setCheckoutPlanId(plan.paddle_price_id || null);
            setAuthMode('login');
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
        <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="flex flex-col items-center justify-center px-6 pb-16 md:pb-16 text-center"
        >
            <Badge variant="secondary" className="rounded-full">
                Pricing
            </Badge>
            <h2
                id="pricing-heading"
                className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
                Simple, transparent pricing
            </h2>
            <p className="mt-3 max-w-[60ch] text-[var(--muted-foreground)]">
                Start free. Upgrade only when personas start paying for themselves in clearer copy,
                better ads, and higher conversions.
            </p>

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

            <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 text-center md:grid-cols-2 lg:grid-cols-4 px-8">
                {listWithFree.map((plan) => {
                    const basePrice = Number(plan.price) || 0;
                    const isFree = basePrice <= 0;
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
                            {!plan.is_popular && isFree && (
                                <Badge variant="secondary" className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                                    Free
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
                                        key={feature?.title ?? String(feature)}
                                        className="flex items-start gap-2 text-sm leading-6"
                                    >
                                        <Check className="mt-1 h-4 w-4 text-dark-600" />
                                        <span>{feature?.title ?? String(feature)}</span>
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
                                {isFree
                                    ? 'Get 1 free persona'
                                    : plan.is_popular
                                      ? 'Choose Popular Plan'
                                      : 'Start Free Trial'}
                            </Button>
                        </div>
                    );
                })}
            </div>

            <p className="mt-6 text-xs text-[var(--muted-foreground)]">
                No credit card required to start • Cancel anytime • Secure checkout
            </p>

            {/* Login Modal */}
            <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                <DialogContent className="w-full sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {authMode === 'login'
                                ? 'Login to Subscribe'
                                : 'Create an account'}
                        </DialogTitle>
                    </DialogHeader>
                    {authMode === 'login' ? (
                        <LoginForm
                            checkoutPlanId={checkoutPlanId}
                            onSuccess={handleLoginSuccess}
                            onSignup={() => {
                                setAuthMode('signup');
                            }}
                        />
                    ) : (
                        <RegisterForm
                            checkoutPlanId={checkoutPlanId}
                            onSuccess={() => {
                                setShowLoginModal(false);
                                setAuthMode('login');
                            }}
                            onLogin={() => setAuthMode('login')}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
};

type LoginFormProps = {
    onSuccess: () => void;
    onSignup: () => void;
    checkoutPlanId?: string | null;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSignup, checkoutPlanId }) => {
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

            <button
                type="button"
                onClick={onSignup}
                className="text-sm text-muted-foreground underline underline-offset-4"
            >
                Don’t have an account? Sign up
            </button>
        </div>
    );
};

type RegisterFormProps = {
    onSuccess: () => void;
    onLogin: () => void;
    checkoutPlanId?: string | null;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
    onSuccess,
    onLogin,
    checkoutPlanId,
}) => {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        from_pricing_modal: string;
    }>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        from_pricing_modal: '1',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (checkoutPlanId)
            sessionStorage.setItem('from_pricing_plan_id', checkoutPlanId);
        post('/register', { onSuccess });
    };

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
                <InputError message={errors.name} />

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

                <Input
                    type="password"
                    placeholder="Confirm password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData('password_confirmation', e.target.value)
                    }
                    required
                />
                <InputError message={errors.password_confirmation} />

                <Button type="submit" disabled={processing}>
                    {processing ? 'Creating…' : 'Create account'}
                </Button>
            </form>

            <button
                type="button"
                onClick={onLogin}
                className="text-sm text-muted-foreground underline underline-offset-4"
            >
                Already have an account? Log in
            </button>
        </div>
    );
};

export default Pricing;
