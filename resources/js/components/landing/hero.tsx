'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AuroraBackground } from '@/components/ui/shadcn-io/aurora-background';
import { Link } from '@inertiajs/react';
import { ArrowUpRight, CirclePlay } from 'lucide-react';

const Hero = () => {
    return (
        <AuroraBackground>
            <section
                id="hero"
                aria-labelledby="hero-heading"
                className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-10 px-6 pt-36 pb-16 sm:pt-40 md:grid-cols-2 md:items-center md:pt-48"
            >
                {/* LEFT: Text column */}
                <div className="flex flex-col items-start text-left">
                    <Badge className="rounded-full border-none bg-primary py-1">
                        Free AI Persona Generator · Built for SaaS, UX &amp; Marketing
                    </Badge>

                    <h1
                        id="hero-heading"
                        className="mt-6 max-w-[22ch] text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl"
                    >
                        The AI Persona Generator that turns ideas into buyers.
                    </h1>

                    <p className="mt-6 max-w-[60ch] text-base sm:text-lg">
                        Create research-backed <strong>buyer personas</strong>, ICPs, and customer
                        avatars in under 60 seconds. Get pains, triggers, objections, JTBD, and
                        high-converting messaging angles for your landing pages, onboarding flows,
                        SEO content, and paid ads on Facebook, LinkedIn &amp; Google.
                    </p>

                    <div className="mt-6 w-full max-w-[60ch] rounded-xl border bg-white/70 p-4 text-sm backdrop-blur-xs">
                        <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                                <p className="font-semibold">Input</p>
                                <p className="text-muted-foreground">
                                    “Analytics tool for early-stage SaaS founders who hate dashboards.”
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Output</p>
                                <p className="text-muted-foreground">
                                    Persona with ICP, pains, buying triggers, objections, and ad angles.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row">
                        <Link href="/register" aria-label="Start generating personas — free signup">
                            <Button size="lg" className="rounded-full text-base">
                                Generate a persona free
                                <ArrowUpRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/register" aria-label="Try Personaitor in 30 seconds">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full text-base shadow-none"
                            >
                                Try it in 30 seconds
                                <CirclePlay className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground">
                        No credit card required • 1 free persona on signup • Cancel anytime
                    </p>
                </div>

                {/* RIGHT: Product preview card */}
                <Card className="p-2 overflow-hidden border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
                    <CardContent className="p-0">
                        <div className="relative aspect-[16/11] max-h-[48vh] w-full overflow-hidden rounded-xl sm:aspect-[16/10] md:aspect-[16/9]">
                            <img
                                src="/img/persona-3.png"
                                alt="Personaitor AI persona generator dashboard showing ICP, pains, triggers and ad angles"
                                className="h-full w-full object-cover"
                                width={1280}
                                height={720}
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between px-3 py-2">
                        <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">
                            Real-time persona insights • Editable templates
                        </p>
                        <Link href="/register" aria-label="Get 1 free persona">
                            <Button size="sm" variant="ghost" className="h-8 gap-1 px-2 sm:px-3">
                                Get 1 free persona
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </section>
        </AuroraBackground>
    );
};

export default Hero;
