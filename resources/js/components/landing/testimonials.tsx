import Marquee from "@/components/landing/ui/marquee";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComponentProps } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Thompson",
    designation: "Product Manager",
    company: "NextWave Labs",
    testimonial:
      "Persona Generator has completely changed how we approach user research. We can now generate accurate personas in minutes, saving hours of manual work.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "David Kim",
    designation: "Marketing Lead",
    company: "BrightMark Agency",
    testimonial:
      "The AI-powered personas give us deep insights into our audience. Campaign targeting has never been easier or more precise.",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    id: 3,
    name: "Laura Chen",
    designation: "UX Designer",
    company: "PixelCraft Studio",
    testimonial:
      "Generating user personas on the fly lets me design interfaces that truly resonate with users. It’s like having a mini research team in my pocket.",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    designation: "Founder & CEO",
    company: "StartSmart",
    testimonial:
      "Persona Generator helped us understand our early adopters and refine our product roadmap. We launched with confidence knowing our features matched real user needs.",
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
  },
  {
    id: 5,
    name: "Isabella Garcia",
    designation: "Growth Strategist",
    company: "ScaleUp Agency",
    testimonial:
      "With clear personas generated in seconds, our ad campaigns now convert at a much higher rate. The insights are actionable and precise.",
    avatar: "https://randomuser.me/api/portraits/women/35.jpg",
  },
  {
    id: 6,
    name: "Michael Brown",
    designation: "Product Designer",
    company: "Creative Loop",
    testimonial:
      "I can iterate on designs faster because I understand the user personas better. This tool bridges the gap between assumptions and real insights.",
    avatar: "https://randomuser.me/api/portraits/men/27.jpg",
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
        Customer love
      </Badge>
      <h2
        id="testimonials-heading"
        className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        “This actually ships work”
      </h2>
      <p className="mt-3 mx-auto max-w-[72ch] text-[var(--muted-foreground)]">
        Long-form pull-quotes with the KPIs that matter—speed to insight,
        alignment, and outcomes.
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
