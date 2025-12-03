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
            <section className="relative mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-[calc(var(--header-h,4.5rem)+8rem)] pb-16 md:grid-cols-2 md:pt-[calc(var(--header-h,4.5rem)+8rem)]">
                {/* LEFT: Text column */}
                <div className="flex flex-col items-start text-left">
                    <Badge className="rounded-full border-none bg-primary py-1">
                        PERSONAAITOR v1.0 — AI Personas for Product, UX & Marketing 🚀
                    </Badge>

                    <h1 className="mt-6 max-w-[20ch] text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Generate Accurate User Personas Instantly
                    </h1>

                    <p className="mt-6 max-w-[60ch] text-base sm:text-lg">
                        PERSONAAITOR turns customer inputs, interviews, and market signals into accurate,
                        actionable personas—complete with pains, jobs-to-be-done, objections, and messaging
                        angles. Build better products and campaigns, faster.
                    </p>

                    <div className="mt-10 flex w-full flex-col gap-4 sm:flex-row">
                        <Link href="/login">
                            <Button
                                size="lg"
                                className="rounded-full text-base"
                            >
                                Generate My Persona{' '}
                                <ArrowUpRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full text-base shadow-none"
                            >
                                Learn How It Works{' '}
                                <CirclePlay className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT: Product preview card */}
                <Card className="p-2 overflow-hidden border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
                    <CardContent className="p-0">
                        <div className="relative aspect-[16/11] max-h-[48vh] w-full overflow-hidden rounded-xl sm:aspect-[16/10] md:aspect-[16/9]">
                            <img
                                src="/img/persona-3.png"
                                alt="Persona Generator – product in action"
                                className="h-full w-full object-cover"
                                loading="eager"
                                decoding="async"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between px-3 py-2">
                        <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">
                            Real-time persona insights • Editable templates
                        </p>
                        <Link href="/login">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 gap-1 px-2 sm:px-3"
                            >
                                Try the demo{' '}
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
