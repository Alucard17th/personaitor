"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          // use your tokens for base canvas & text
          "relative flex h-[100vh] flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)]",
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              /* Brand-driven stripes (OKLCH). We mix a few tints to create soft motion bands. */
              "--aurora":
                "repeating-linear-gradient(100deg,\
                  var(--primary) 10%,\
                  color-mix(in oklch, var(--primary) 65%, white 35%) 15%,\
                  var(--secondary) 20%,\
                  color-mix(in oklch, var(--accent) 70%, white 30%) 25%,\
                  color-mix(in oklch, var(--primary) 55%, var(--accent) 45%) 30%)",

              /* Subtle film grain bands for light & dark, tied to your tokens */
              "--dark-gradient":
                "repeating-linear-gradient(100deg,\
                  color-mix(in oklch, var(--foreground) 85%, black 15%) 0%,\
                  color-mix(in oklch, var(--foreground) 85%, black 15%) 7%,\
                  transparent 10%,\
                  transparent 12%,\
                  color-mix(in oklch, var(--foreground) 85%, black 15%) 16%)",

              "--white-gradient":
                "repeating-linear-gradient(100deg,\
                  color-mix(in oklch, var(--background) 100%, white 0%) 0%,\
                  color-mix(in oklch, var(--background) 100%, white 0%) 7%,\
                  transparent 10%,\
                  transparent 12%,\
                  color-mix(in oklch, var(--background) 100%, white 0%) 16%)",

              /* helpful aliases if you ever want to tweak quickly */
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            // animated layer + pseudo-element, palette-aware
            className={cn(
              [
                "pointer-events-none absolute -inset-[10px] filter will-change-transform",
                "[background-image:var(--white-gradient),var(--aurora)]",
                "[background-size:300%,_200%]",
                "[background-position:50%_50%,50%_50%]",
                "opacity-50 blur-[10px]",
                // invert makes the stripe blend pop on light backgrounds; we keep it gentle
                "invert",
                // dark mode swaps film grain to dark bands and disables invert
                "dark:[background-image:var(--dark-gradient),var(--aurora)]",
                "dark:invert-0",

                // the animated pseudo-element
                'after:content-[""] after:absolute after:inset-0',
                "after:[background-image:var(--white-gradient),var(--aurora)]",
                "after:[background-size:200%,_100%]",
                "after:[background-position:50%_50%,50%_50%]",
                "after:[background-attachment:fixed]",
                "after:mix-blend-difference",
                "after:animate-aurora",
                "after:dark:[background-image:var(--dark-gradient),var(--aurora)]",
              ].join(" "),
              showRadialGradient &&
                // vignette mask to frame your headline/CTAs
                "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]"
            )}
          />
        </div>

        {/* content above the background */}
        <div className="relative z-10">{children}</div>
      </div>
    </main>
  );
};
