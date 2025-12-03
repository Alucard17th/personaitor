'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Play, ArrowUpRight, Sparkles, ListChecks, MessageSquare } from 'lucide-react';

const ProductInAction = () => {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-6 pt-32 pb-16 md:pb-16 flex flex-col items-center justify-center text-center"
      aria-labelledby="product-in-action-heading"
    >
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">Product in Action</Badge>
        <h2
          id="product-in-action-heading"
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          See PERSONAAITOR do the work—for you
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          Turn messy notes, interview snippets, or a quick brief into a complete, research-backed
          persona—pains, JTBD, triggers, objections, and messaging angles included.
        </p>
      </div>

      {/* Media + bullets */}
      <div className="grid items-start gap-8 md:grid-cols-2">
        {/* Media card */}
        <Card className="overflow-hidden border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
          <CardContent className="p-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
              {/* Swap the <img> for a <video> if you have a demo clip */}
              {/* Example video block:
              <video
                src="/videos/personaitor-demo.mp4"
                poster="/images/product-in-action.png"
                className="h-full w-full object-cover"
                controls
                preload="metadata"
              /> */}
              <img
                src="/images/product-in-action.png"
                alt="PERSONAAITOR generating a persona canvas with pains, JTBD, and messaging angles"
                className="h-full w-full object-cover"
                loading="eager"
                decoding="async"
              />
              <button
                type="button"
                aria-label="Play 60-second demo"
                className="group absolute inset-0 grid place-items-center"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="inline-flex items-center gap-2 rounded-full border bg-black/60 px-4 py-2 text-white backdrop-blur transition group-hover:bg-black/80">
                  <Play className="h-4 w-4" /> Watch 60-sec demo
                </span>
              </button>

              {/* soft overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
            <p className="text-xs text-[var(--muted-foreground)] sm:text-sm">
              Auto-structured insights • Traceable sources • Editable persona canvas
            </p>
            <Link href="/register">
              <Button size="sm" variant="ghost" className="h-8 gap-1 px-2 sm:px-3">
                Start Free <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Value bullets + micro-metrics */}
        <div>
          <ul role="list" className="space-y-4">
            <li role="listitem" className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">From inputs to insight—instantly</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Paste interviews or drop a brief. PERSONAAITOR extracts pains, JTBD, triggers,
                  objections, and copy angles with citations.
                </p>
              </div>
            </li>
            <li role="listitem" className="flex items-start gap-3">
              <ListChecks className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Actionable, not academic</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Get task-ready briefs for product, UX, and growth—no more pretty decks that no one uses.
                </p>
              </div>
            </li>
            <li role="listitem" className="flex items-start gap-3">
              <MessageSquare className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Living personas for real teams</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Comments, versions, approvals, and exports to Figma/Notion/CSV keep everyone aligned.
                </p>
              </div>
            </li>
          </ul>

          {/* Micro stats */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="rounded-full border px-3 py-1">10× faster persona creation</span>
            <span className="rounded-full border px-3 py-1">−70% research synthesis time</span>
            <span className="rounded-full border px-3 py-1">120+ teams onboard</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register">
              <Button className="rounded-full">
                Generate My Persona <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" className="rounded-full">
                See Sample Personas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductInAction;