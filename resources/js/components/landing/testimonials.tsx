import Marquee from "@/components/landing/ui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentProps } from "react";

const testimonials = [
  {
    id: 1,
    name: "SaaS landing page rewrite",
    designation: "Indie hacker",
    company: "Pre-launch",
    testimonial:
      "Started with a vague idea and ended with a persona + objections list. Used it to rewrite the hero + pricing copy and ship an A/B test the same day.",
    avatar: "/img/persona-1.png",
  },
  {
    id: 2,
    name: "Paid ads targeting",
    designation: "Growth",
    company: "SaaS",
    testimonial:
      "Used the persona’s pains + triggers to build 3 ad angles and 2 audiences. It turned ‘target everyone’ into a focused first campaign.",
    avatar: "/img/persona-1.png",
  },
  {
    id: 3,
    name: "Onboarding + activation",
    designation: "Product",
    company: "B2B",
    testimonial:
      "Mapped JTBD + objections into onboarding steps and tooltips. It gave us a concrete checklist for the first-run experience.",
    avatar: "/img/persona-1.png",
  },
  {
    id: 4,
    name: "Roadmap alignment",
    designation: "Founder",
    company: "Bootstrapped",
    testimonial:
      "Turned feature debates into ‘which job are we solving?’ decisions. The persona became the shared reference point across product and marketing.",
    avatar: "/img/persona-1.png",
  },
  {
    id: 5,
    name: "Cold email positioning",
    designation: "Sales",
    company: "Outbound",
    testimonial:
      "Pulled ‘language they use’ + objections into email variants. It sped up message testing and made follow-ups more specific.",
    avatar: "/img/persona-1.png",
  },
  {
    id: 6,
    name: "Investor deck clarity",
    designation: "Founder",
    company: "Pitching",
    testimonial:
      "Used the persona to tighten ‘who we’re for’ and ‘why now’ slides. It forced clarity on ICP and the core problem.",
    avatar: "/img/persona-1.png",
  },
];

const Testimonials = () => (
  <section
    id="testimonials"
    className="relative mx-auto w-full px-6 py-16 text-center md:py-16"
    aria-labelledby="testimonials-heading"
  >
    <div className="mb-8">
      <Badge variant="secondary" className="rounded-full">
        AI persona use cases
      </Badge>
      <h2
        id="testimonials-heading"
        className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        What you can do with an AI-generated buyer persona
      </h2>
      <p className="mt-3 mx-auto max-w-[72ch] text-[var(--muted-foreground)]">
        Rewrite landing page copy, brief paid-ad campaigns, sharpen cold outreach, design
        onboarding flows, align your roadmap, and pitch investors — all powered by one
        structured customer persona generated in minutes.
      </p>
    </div>

    <div className="relative">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[15%] bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[15%] bg-gradient-to-l from-[var(--background)] to-transparent" />

      <Marquee pauseOnHover className="[--duration:22s]">
        <TestimonialList />
      </Marquee>
      <Marquee pauseOnHover reverse className="mt-4 [--duration:24s]">
        <TestimonialList />
      </Marquee>
    </div>
  </section>
);

const TestimonialList = () => (
  <>
    {testimonials.map((t) => (
      <article
        key={t.id}
        className="
          min-w-[22rem] max-w-[26rem]
          rounded-xl border border-[var(--border)]
          bg-[var(--card)]/80 supports-[backdrop-filter]:bg-[var(--card)]/60 backdrop-blur
          p-5 text-left shadow-sm ring-1 ring-black/5
          transition hover:shadow-md
          mx-2
        "
      >
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="h-10 w-10 ring-1 ring-black/5">
              <AvatarImage src={t.avatar} alt={t.name} />
              <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)] text-sm">
                {t.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{t.name}</p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">
                {t.designation} • {t.company}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View on X"
            >
              <TwitterLogo className="h-4 w-4" />
            </a>
          </Button>
        </header>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--foreground)]">
          {t.testimonial}
        </p>
      </article>
    ))}
  </>
);

const TwitterLogo = (props: ComponentProps<"svg">) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="X"
    {...props}
  >
    <path
      fill="currentColor"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  </svg>
);

export default Testimonials;
