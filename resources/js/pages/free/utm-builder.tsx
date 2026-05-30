import Footer from '@/components/landing/footer';
import { Navbar } from '@/components/landing/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head } from '@inertiajs/react';
import { toast } from 'sonner';
import React, { useMemo, useState } from 'react';

type UtmState = {
    baseUrl: string;
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
};

type Built = {
    url: string;
    error?: string;
};

export default function FreeUtmBuilder() {
    const [utm, setUtm] = useState<UtmState>({
        baseUrl: '',
        source: '',
        medium: '',
        campaign: '',
        term: '',
        content: '',
    });

    const built = useMemo(() => buildUtmUrl(utm), [utm]);

    const requiredMissing = useMemo(() => {
        const missing: string[] = [];
        if (!utm.baseUrl.trim()) missing.push('Base URL');
        if (!utm.source.trim()) missing.push('utm_source');
        if (!utm.medium.trim()) missing.push('utm_medium');
        if (!utm.campaign.trim()) missing.push('utm_campaign');
        return missing;
    }, [utm.baseUrl, utm.source, utm.medium, utm.campaign]);

    const canCopy = requiredMissing.length === 0 && !built.error;

    const onCopy = async () => {
        if (!canCopy) {
            toast.error('Fill required fields first');
            return;
        }
        try {
            await navigator.clipboard.writeText(built.url);
            toast.success('Copied URL');
        } catch {
            fallbackCopyTextToClipboard(built.url);
            toast.success('Copied URL');
        }
    };

    const softwareJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Free UTM Builder',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description:
            'Free UTM link generator for Google Analytics (GA4), paid ads and email. Build clean tracked URLs with utm_source, utm_medium, utm_campaign, utm_term and utm_content.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    };

    return (
        <>
            <Head>
                <meta name="robots" content="index,follow" />
            </Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
            />
            <Navbar />
            <main className="xs:pt-20 px-6 pt-16 sm:pt-24 md:px-12 lg:px-24">
                <div className="mx-auto max-w-3xl space-y-6">
                    <header className="space-y-3">
                        <span className="inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium">
                            Free tool · No signup
                        </span>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Free UTM Builder — generate tracked campaign URLs
                        </h1>
                        <p className="max-w-[68ch] text-muted-foreground">
                            Build clean, analytics-ready URLs with <code>utm_source</code>,{' '}
                            <code>utm_medium</code>, <code>utm_campaign</code>,{' '}
                            <code>utm_term</code> and <code>utm_content</code>. Perfect for Google
                            Analytics (GA4), Facebook/LinkedIn ads, newsletter campaigns and SaaS
                            growth experiments — no sign-in required.
                        </p>
                    </header>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Inputs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="baseUrl">Base URL *</Label>
                                <Input
                                    id="baseUrl"
                                    placeholder="https://example.com/pricing"
                                    value={utm.baseUrl}
                                    onChange={(e) =>
                                        setUtm((p) => ({
                                            ...p,
                                            baseUrl: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="source">utm_source *</Label>
                                    <Input
                                        id="source"
                                        placeholder="twitter"
                                        value={utm.source}
                                        onChange={(e) =>
                                            setUtm((p) => ({
                                                ...p,
                                                source: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="medium">utm_medium *</Label>
                                    <Input
                                        id="medium"
                                        placeholder="social"
                                        value={utm.medium}
                                        onChange={(e) =>
                                            setUtm((p) => ({
                                                ...p,
                                                medium: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="campaign">
                                        utm_campaign *
                                    </Label>
                                    <Input
                                        id="campaign"
                                        placeholder="launch"
                                        value={utm.campaign}
                                        onChange={(e) =>
                                            setUtm((p) => ({
                                                ...p,
                                                campaign: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="term">utm_term</Label>
                                    <Input
                                        id="term"
                                        placeholder="keyword"
                                        value={utm.term}
                                        onChange={(e) =>
                                            setUtm((p) => ({
                                                ...p,
                                                term: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="content">utm_content</Label>
                                    <Input
                                        id="content"
                                        placeholder="cta_top"
                                        value={utm.content}
                                        onChange={(e) =>
                                            setUtm((p) => ({
                                                ...p,
                                                content: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {requiredMissing.length > 0 && (
                                <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
                                    Missing:
                                    <span className="ml-2 font-medium">
                                        {requiredMissing.join(', ')}
                                    </span>
                                </div>
                            )}

                            {built.error && (
                                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                    {built.error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Output</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-2">
                                <Label>Tracked URL</Label>
                                <Input readOnly value={built.url} />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    onClick={onCopy}
                                    disabled={!canCopy}
                                >
                                    Copy
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setUtm({
                                            baseUrl: '',
                                            source: '',
                                            medium: '',
                                            campaign: '',
                                            term: '',
                                            content: '',
                                        })
                                    }
                                >
                                    Reset
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Tip: use lowercase and underscores (e.g.
                                <code className="mx-1 rounded bg-muted px-1">
                                    black_friday
                                </code>
                                ).
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </>
    );
}

function sanitize(value: string) {
    return (value ?? '').trim();
}

function buildUtmUrl(state: UtmState): Built {
    const rawBase = sanitize(state.baseUrl);

    if (!rawBase) return { url: '' };

    let url: URL;
    try {
        url = new URL(rawBase);
    } catch {
        return {
            url: rawBase,
            error: 'Base URL is not a valid absolute URL (must start with http/https).',
        };
    }

    const source = sanitize(state.source);
    const medium = sanitize(state.medium);
    const campaign = sanitize(state.campaign);
    const term = sanitize(state.term);
    const content = sanitize(state.content);

    if (source) url.searchParams.set('utm_source', source);
    if (medium) url.searchParams.set('utm_medium', medium);
    if (campaign) url.searchParams.set('utm_campaign', campaign);
    if (term) url.searchParams.set('utm_term', term);
    if (content) url.searchParams.set('utm_content', content);

    return { url: url.toString() };
}

function fallbackCopyTextToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
    } catch {}
    document.body.removeChild(textarea);
}
