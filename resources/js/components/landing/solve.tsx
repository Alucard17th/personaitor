'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import {
  BrainCog,
  Sparkles,
  ClipboardList,
  Share2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const Solve = () => {
  return (
    <section
      id="solve"
      className="mx-auto w-full max-w-6xl px-6 py-16 md:py-16 flex flex-col items-center justify-center text-center"
      aria-labelledby="solve-heading"
    >
      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">How we solve those issues</Badge>
        <h2
          id="solve-heading"
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          From pains to predictable outcomes
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          PERSONAAITOR turns scattered research into living, actionable personas—so PM, UX, and growth
          can ship with confidence.
        </p>
      </div>

      <ul
        role="list"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Fix for Pain #1 — Guesswork & bias */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex items-start gap-3">
              <BrainCog className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <CardTitle asChild>
                <h3 className="text-base">Fix #1 — Evidence over opinions</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">What we do</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--muted-foreground)]">
                  <li>Ingest interviews, surveys, CRM notes, and support threads.</li>
                  <li>Normalize signals with citations &amp; confidence scoring.</li>
                  <li>Compare variants to reduce bias and surface consensus.</li>
                </ul>
              </div>
              <div className="rounded-md border p-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Outcome
                </p>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Credible personas stakeholders trust. Time-to-insight ↓ ~70%.
                </p>
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Fix for Pain #2 — Pretty but useless */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex items-start gap-3">
              <ClipboardList className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <CardTitle asChild>
                <h3 className="text-base">Fix #2 — Actionable, not academic</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">What we do</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--muted-foreground)]">
                  <li>Auto-generate JTBD, pains, triggers, objections, and messaging angles.</li>
                  <li>Create task-ready briefs for UX flows, roadmap epics, and ad/copy tests.</li>
                  <li>Include examples and acceptance criteria to unblock execution.</li>
                </ul>
              </div>
              <div className="rounded-md border p-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Outcome
                </p>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Faster alignment from strategy → shipping. CTR ↑, adoption ↑.
                </p>
              </div>
            </CardContent>
          </Card>
        </li>

        {/* Fix for Pain #3 — Stale & siloed */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex items-start gap-3">
              <Share2 className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <CardTitle asChild>
                <h3 className="text-base">Fix #3 — A living source of truth</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium">What we do</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--muted-foreground)]">
                  <li>Comments, versions, approvals, and shareable persona canvases.</li>
                  <li>Exports to Figma/Notion/CSV + embeddable live links.</li>
                  <li>Auto-sync updates so teams never ship from stale decks.</li>
                </ul>
              </div>
              <div className="rounded-md border p-3">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Outcome
                </p>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  One current persona for PM, UX, and growth. Review cycles ↓, duplication ↓.
                </p>
              </div>
            </CardContent>
          </Card>
        </li>
      </ul>

      {/* Bridge CTAs */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="#how">
          <Button className="rounded-full">
            See how it works <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="#industries">
          <Button variant="outline" className="rounded-full">
            Industries we serve
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Solve;