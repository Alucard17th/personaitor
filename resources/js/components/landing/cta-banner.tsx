import { ArrowUpRight, Forward } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatedGridPattern } from "./ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";

export default function CTABanner() {
  return (
    <div className="px-6">
      <div className="relative overflow-hidden my-20 w-full bg-background text-foreground max-w-(--breakpoint-lg) mx-auto rounded-2xl py-10 md:py-16 px-6 md:px-14">
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
          <h3 className="text-3xl md:text-4xl font-semibold">
            Build Accurate Personas in Seconds
          </h3>
          <p className="mt-2 text-base md:text-lg">
            Stop guessing and start understanding your users. Generate AI-powered personas instantly to make smarter product and marketing decisions.
          </p>
        </div>

        <div className="relative z-0 mt-14 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link href="/login">
          <Button size="lg">
            Generate Your Persona <ArrowUpRight className="h-5 w-5" />
          </Button>
          </Link>
          <Button size="lg" variant="outline">
            Learn How It Works <Forward className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
