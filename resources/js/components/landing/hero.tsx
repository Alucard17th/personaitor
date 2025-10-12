import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CirclePlay } from 'lucide-react';
import LogoCloud from './logo-cloud';
import { Link } from "@inertiajs/react"

const Hero = () => {
    return (
        <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center px-6 py-20">
            <div className="flex items-center justify-center md:mt-6">
                <div className="max-w-2xl text-center">
                    <Badge className="rounded-full border-none bg-primary py-1">
                        v1.0.0 – AI Persona Generator 🚀
                    </Badge>
                    <h1 className="xs:text-4xl mt-6 max-w-[28ch] text-3xl leading-[1.2]! font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Generate Accurate User Personas Instantly
                    </h1>
                    <p className="xs:text-lg mt-6 max-w-[60ch]">
                        Understand your audience in seconds with AI-powered
                        persona generation. Build better products, campaigns,
                        and strategies effortlessly.
                    </p>
                    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/login">
                            <Button
                                size="lg"
                                className="w-full rounded-full text-base sm:w-auto"
                            >
                                Generate My Persona{' '}
                                <ArrowUpRight className="h-5! w-5!" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full rounded-full text-base shadow-none sm:w-auto"
                            >
                                Learn How It Works{' '}
                                <CirclePlay className="h-5! w-5!" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            {/* <LogoCloud className="mx-auto mt-24 max-w-3xl" /> */}
        </div>
    );
};

export default Hero;
