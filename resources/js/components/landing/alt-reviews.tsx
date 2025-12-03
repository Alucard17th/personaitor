'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const ReviewsAlt: React.FC = () => {
  const scrollerRef = React.useRef<HTMLUListElement | null>(null);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true); // assume true until measured

  const total = 4; // number of slides

  const scrollByCards = (dir: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  const updateNav = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;
    // a tiny tolerance helps with sub-pixel rounding
    const tol = 4;
    setCanPrev(left > tol);
    setCanNext(left < maxScroll - tol);
  }, []);

  // Keep buttons in sync with scroll/resize
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateNav);
    };

    updateNav(); // initial
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateNav);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateNav);
      cancelAnimationFrame(raf);
    };
  }, [updateNav]);

  // Optional JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'Review', author: { '@type': 'Person', name: 'Youssef K.' }, reviewRating: { '@type': 'Rating', ratingValue: '5' }, reviewBody: 'PERSONAAITOR cut our research synthesis time dramatically and gave PM/UX briefs we could ship with.' },
      { '@type': 'Review', author: { '@type': 'Person', name: 'Amira S.' }, reviewRating: { '@type': 'Rating', ratingValue: '5' }, reviewBody: 'Finally personas that drive decisions—not just pretty slides. Copy tests started winning faster.' },
      { '@type': 'Review', author: { '@type': 'Person', name: 'Daniel M.' }, reviewRating: { '@type': 'Rating', ratingValue: '5' }, reviewBody: 'Shared, living personas across product, UX, and growth. Alignment improved and cycles got shorter.' },
    ],
  };

  return (
    <section
      id="reviews-alt"
      className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-16 flex flex-col items-center justify-center text-center"
      aria-labelledby="reviews-alt-heading"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">Customer love</Badge>
        <h2 id="reviews-alt-heading" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          “This actually ships work”
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          Long-form pull-quotes with the KPIs that matter—speed to insight, alignment, and outcomes.
        </p>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous testimonials"
            disabled={!canPrev}
            onClick={() => scrollByCards('prev')}
            className={!canPrev ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next testimonials"
            disabled={!canNext}
            onClick={() => scrollByCards('next')}
            className={!canNext ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edge gradients (hidden when no more to scroll) */}
      {canPrev && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--background)] to-transparent" />
      )}
      {canNext && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--background)] to-transparent" />
      )}

      {/* Scroll-snap strip */}
      <ul
        ref={scrollerRef}
        role="list"
        aria-roledescription="carousel"
        className="overflow-hidden no-scrollbar grid snap-x snap-mandatory grid-flow-col auto-cols-[90%] gap-4 sm:auto-cols-[60%] md:auto-cols-[45%] lg:auto-cols-[33%]"
      >
        {/* Slide 1 */}
        <li role="listitem" className="snap-start" data-index={0} ref={(el) => (itemRefs.current[0] = el)}>
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/reviewers/youssef-k.jpg" alt="Youssef K." className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Youssef K.</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">PM • FinTech SaaS</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3.5 w-3.5 fill-current" />))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="relative">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5 text-sm">
                  PERSONAAITOR cut our research synthesis time dramatically and gave PM/UX briefs we could ship with.
                  The JTBD and objection angles mapped straight into the roadmap and copy tests.
                </p>
              </blockquote>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">−70% synthesis time</span>
                <span className="rounded-full border px-2.5 py-1">faster prioritization</span>
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Slide 2 */}
        <li role="listitem" className="snap-start" data-index={1} ref={(el) => (itemRefs.current[1] = el)}>
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/reviewers/amira-s.jpg" alt="Amira S." className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Amira S.</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">Head of UX • Analytics</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3.5 w-3.5 fill-current" />))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="relative">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5 text-sm">
                  Finally personas that drive decisions—not just slides. Our onboarding flow changes and
                  new headline tests started winning within two sprints.
                </p>
              </blockquote>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">CTR ↑</span>
                <span className="rounded-full border px-2.5 py-1">activation ↑</span>
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Slide 3 */}
        <li role="listitem" className="snap-start" data-index={2} ref={(el) => (itemRefs.current[2] = el)}>
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/reviewers/daniel-m.jpg" alt="Daniel M." className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Daniel M.</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">VP Growth • DevTools</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3.5 w-3.5 fill-current" />))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="relative">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5 text-sm">
                  Living personas across product, UX, and growth—no more hunting for PDF versions.
                  Review cycles shrank and campaigns stayed on-message.
                </p>
              </blockquote>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">review cycles ↓</span>
                <span className="rounded-full border px-2.5 py-1">team alignment ↑</span>
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Slide 4 */}
        <li role="listitem" className="snap-start" data-index={3} ref={(el) => (itemRefs.current[3] = el)}>
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/reviewers/samira-b.jpg" alt="Samira B." className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Samira B.</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">CMO • HR Tech</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3.5 w-3.5 fill-current" />))}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <blockquote className="relative">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5 text-sm">
                  PERSONAAITOR made persona updates a non-event—shared links, comments, and versioning
                  kept everyone on the same page.
                </p>
              </blockquote>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">maintenance effort ↓</span>
                <span className="rounded-full border px-2.5 py-1">consistency ↑</span>
              </div>
            </CardContent>
          </Card>
        </li>
      </ul>

      {/* Bridge CTA to next section */}
      <div className="mt-10">
        <Link href="#how">
          <Button className="rounded-full">How it works</Button>
        </Link>
      </div>
    </section>
  );
};

export default ReviewsAlt;
