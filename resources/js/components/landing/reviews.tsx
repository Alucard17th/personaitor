'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Quote, Star, CheckCircle2 } from 'lucide-react';
import * as React from 'react';

const Reviews3: React.FC = () => {
  // Optional: JSON-LD aggregate rating for SEO (tweak numbers later)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'PERSONAAITOR',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '137',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        author: { '@type': 'Person', name: 'Leila Haddad' },
        reviewBody:
          'We went from messy interview notes to actionable personas in a day. Roadmap and messaging got way sharper.',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        author: { '@type': 'Person', name: 'Tom Álvarez' },
        reviewBody:
          'Personas that product, UX, and growth can all use—no more pretty decks nobody opens.',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5' },
        author: { '@type': 'Person', name: 'Sara Benyounes' },
        reviewBody:
          'Cut research synthesis time by ~70% and finally aligned the team on one living source of truth.',
      },
    ],
  };

  return (
    <section
      id="reviews"
      className="mx-auto w-full max-w-6xl px-6 py-16 md:py-16 flex flex-col items-center justify-center text-center"
      aria-labelledby="reviews-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">What customers say</Badge>
        <h2
          id="reviews-heading"
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Teams ship faster with PERSONAAITOR
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          Real outcomes from product, UX, and growth leaders using AI personas to guide roadmaps,
          experiences, and campaigns.
        </p>
      </div>

      <ul
        role="list"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Review 1 */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex flex-row items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Leila+Haddad"
                alt="Leila Haddad"
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Leila Haddad <CheckCircle2 className="ml-1 inline h-4 w-4 text-green-600" aria-label="Verified" /></p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">Head of Product • FinOps SaaS</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="relative text-sm">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5">
                  We went from messy interview notes to actionable personas in a day. Roadmap and messaging got way sharper.
                </p>
              </blockquote>
              <div className="text-xs text-[var(--muted-foreground)]">
                Result: faster prioritization &amp; clearer JTBD → feature adoption ↑
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Review 2 */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex flex-row items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Tom+Álvarez"
                alt="Tom Álvarez"
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Tom Álvarez <CheckCircle2 className="ml-1 inline h-4 w-4 text-green-600" aria-label="Verified" /></p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">Director of UX • Data Platform</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="relative text-sm">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5">
                  Personas that product, UX, and growth can all use—no more pretty decks nobody opens.
                </p>
              </blockquote>
              <div className="text-xs text-[var(--muted-foreground)]">
                Result: shared source of truth → design &amp; PM sync time ↓
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Review 3 */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex flex-row items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=Sara+Benyounes"
                alt="Sara Benyounes"
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Sara Benyounes <CheckCircle2 className="ml-1 inline h-4 w-4 text-green-600" aria-label="Verified" /></p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">VP Growth • Analytics SaaS</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="relative text-sm">
                <Quote className="absolute -left-1 -top-1 h-4 w-4 opacity-60" aria-hidden="true" />
                <p className="pl-5">
                  Cut research synthesis time by ~70% and finally aligned the team on one living source of truth.
                </p>
              </blockquote>
              <div className="text-xs text-[var(--muted-foreground)]">
                Result: time-to-insight ↓ • campaign launch velocity ↑
              </div>
            </CardContent>
          </Card>
        </li>
      </ul>

      {/* Bridge CTA to next section (3 PAIN POINTS) */}
      <div className="mt-8">
        <Link href="#pain">
          <Button className="rounded-full">See the 3 problems we fix</Button>
        </Link>
      </div>
    </section>
  );
};

export default Reviews3;
