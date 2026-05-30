import { ArrowUpRight, Forward } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";

export default function CTABanner() {
  return (
    <div className="px-6">
      <section
        aria-labelledby="cta-banner-heading"
        className="relative overflow-hidden my-20 w-full bg-background text-foreground max-w-(--breakpoint-lg) mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14"
      >
        {/* Animated background patterns */}
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_right,white,rgba(255,255,255,0.6),transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_top_left,white,rgba(255,255,255,0.6),transparent)]",
            "inset-x-0 inset-y-0 h-[200%] skew-y-12"
          )}
        />

        {/* CTA content */}
        <div className="relative z-0 flex flex-col gap-3 text-center md:text-left">
          <h3
            id="cta-banner-heading"
            className="text-3xl md:text-4xl font-semibold"
          >
            Build data-backed buyer personas in under 60 seconds
          </h3>
          <p className="mt-2 text-base md:text-lg">
            Join thousands of founders, marketers, and product teams using Personaitor to replace
            guesswork with AI-generated personas that sharpen copy, ads, onboarding, and roadmaps.
          </p>
          <p className="mt-2 text-sm opacity-80">
            Free to start • No credit card required • 1 persona on us
          </p>
        </div>

        <div className="relative z-0 mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link href="/register" aria-label="Generate your free AI persona">
            <Button size="lg">
              Generate your free persona <ArrowUpRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#how" aria-label="Learn how Personaitor works">
            <Button size="lg" variant="outline">
              Learn how it works <Forward className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
