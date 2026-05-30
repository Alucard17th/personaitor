'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Brain, ListChecks, Share2 } from 'lucide-react';

const PainPoints3 = () => {
  return (
    <section
      id="pain"
      className="mx-auto w-full max-w-6xl px-6 py-16 md:py-16 flex flex-col items-center justify-center text-center"
      aria-labelledby="pain-heading"
    >
      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">Why most buyer personas fail</Badge>
        <h2
          id="pain-heading"
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Why traditional buyer personas don’t convert
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          If your customer personas live in dusty Google Docs, look pretty but don’t drive copy,
          or get forgotten the day after the workshop — you’re not alone. Here are the three
          reasons most marketing personas quietly fail, and what to do instead.
        </p>
      </div>

      <ul
        role="list"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Pain #1 */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex items-start gap-3">
              <Brain className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <CardTitle asChild>
                <h3 className="text-base">#1 — Guesswork beats real customer research</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <p><strong>Symptom:</strong> Interviews live in scattered docs; insights are inconsistent and untraceable.</p>
              <p><strong>Impact:</strong> Roadmaps drift; messaging misses; sales calls stall.</p>
              <p><strong>Feels like:</strong> “We think our ICP is X… but no one can prove it.”</p>
            </CardContent>
          </Card>
        </li>

        {/* Pain #2 */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex items-start gap-3">
              <ListChecks className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <CardTitle asChild>
                <h3 className="text-base">#2 — Pretty persona decks, zero impact on copy</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <p><strong>Symptom:</strong> Persona decks look great, but don’t guide UX flows, copy, or campaigns.</p>
              <p><strong>Impact:</strong> Teams revert to opinions; launches slow; adoption lags.</p>
              <p><strong>Feels like:</strong> “Nice slides—now what do we actually build or say?”</p>
            </CardContent>
          </Card>
        </li>

        {/* Pain #3 */}
        <li role="listitem">
          <Card className="h-full border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
            <CardHeader className="flex items-start gap-3">
              <Share2 className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <CardTitle asChild>
                <h3 className="text-base">#3 — Stale, siloed personas your team ignores</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <p><strong>Symptom:</strong> PDFs get buried; versions fragment across PM, UX, and growth.</p>
              <p><strong>Impact:</strong> Misalignment, duplicate work, and outdated assumptions.</p>
              <p><strong>Feels like:</strong> “Which persona is the latest—and where is it?”</p>
            </CardContent>
          </Card>
        </li>
      </ul>

      {/* Bridge CTA to "How we solve those issues" */}
      <div className="mt-8">
        <Link href="#solve">
          <Button size="lg" className="rounded-full">
            See how Personaitor fixes this →
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default PainPoints3;
