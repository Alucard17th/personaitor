'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import {
  Upload,
  Sparkles,
  Share2,
  CheckCircle2,
  ArrowRight,
  Building2,
  Briefcase,
  Activity,
  GraduationCap,
  ShoppingCart,
  Cpu,
  BarChart3,
  Shield,
  Users,
} from 'lucide-react';

const HowAndIndustries = () => {
  return (
    <section
      id="how"
      className="mx-auto w-full max-w-6xl px-6 py-16 md:py-16 flex flex-col items-center justify-center text-center"
      aria-labelledby="how-heading"
    >
      {/* ===== How it works ===== */}
      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">How it works</Badge>
        <h2
          id="how-heading"
          className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          From raw inputs to personas your team can ship with
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          PERSONAAITOR converts interviews, surveys, CRM notes, and briefs into living personas—
          complete with pains, JTBD, triggers, objections, and messaging angles.
        </p>
      </div>

      <div className="grid items-start gap-8 md:grid-cols-2">
        {/* Product visual */}
        <Card className="overflow-hidden border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xs supports-[backdrop-filter]:bg-[var(--card)]/60">
          <CardContent className="p-0">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
              {/* Swap to a <video> when ready */}
              <img
                src="/images/product-canvas.png"
                alt="PERSONAAITOR canvas: pains, JTBD, objections, and messaging angles"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </CardContent>
          <CardHeader className="space-y-1">
            <CardTitle className="text-base">Persona Canvas &amp; Insights</CardTitle>
            <p className="text-sm text-[var(--muted-foreground)]">
              Auto-structured insights with citations, confidence scoring, and export options (Figma / Notion / CSV).
            </p>
          </CardHeader>
        </Card>

        {/* Steps + how it solves */}
        <div className="grid gap-4">
          {/* Step 1 */}
          <Card className="border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex flex-row items-start gap-3">
              <Upload className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="text-base">1) Ingest &amp; normalize</CardTitle>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Drop interviews, survey CSVs, CRM notes, or a quick brief. We parse, de-dup, and normalize signals.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Solves: guesswork &amp; bias</p>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">citations</span>
                <span className="rounded-full border px-2.5 py-1">confidence scores</span>
                <span className="rounded-full border px-2.5 py-1">deduplication</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex flex-row items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="text-base">2) Generate &amp; align</CardTitle>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Produce JTBD, pains, triggers, objections, messaging angles, and task-ready briefs for PM/UX/growth.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Solves: pretty-but-useless personas</p>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">brief templates</span>
                <span className="rounded-full border px-2.5 py-1">acceptance criteria</span>
                <span className="rounded-full border px-2.5 py-1">examples</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border border-[var(--border)] bg-[var(--card)]/80">
            <CardHeader className="flex flex-row items-start gap-3">
              <Share2 className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <CardTitle className="text-base">3) Share &amp; ship</CardTitle>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Comments, versions, approvals, and embeddable live links keep everyone on the same page.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Solves: stale &amp; siloed PDFs</p>
              <div className="flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                <span className="rounded-full border px-2.5 py-1">Figma/Notion/CSV</span>
                <span className="rounded-full border px-2.5 py-1">live embeds</span>
                <span className="rounded-full border px-2.5 py-1">version control</span>
              </div>
            </CardContent>
          </Card>

          {/* Bridge CTAs */}
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="#industries">
              <Button className="rounded-full">
                Industries we serve <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="outline" className="rounded-full">
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Industries we serve ===== */}
      <div id="industries" className="mt-16 md:mt-24">
        <Badge variant="secondary" className="rounded-full">Industries we serve</Badge>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for B2B teams across complex buying cycles
        </h3>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          PERSONAAITOR adapts to different roles, ACVs, and sales motions—so your personas reflect how your market really buys.
        </p>

        <ul
          role="list"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <Building2 className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">SaaS &amp; Platforms</p>
              <p className="text-sm text-[var(--muted-foreground)]">Multi-persona journeys, PLG + sales-assist, layered objections.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <Cpu className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">DevTools &amp; Data</p>
              <p className="text-sm text-[var(--muted-foreground)]">IC developer + exec buyer; security/compliance concerns.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <BarChart3 className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">Analytics &amp; BI</p>
              <p className="text-sm text-[var(--muted-foreground)]">Value proof, integrations, implementation effort clarity.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <Shield className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">FinTech &amp; Security</p>
              <p className="text-sm text-[var(--muted-foreground)]">Risk mitigation, auditability, procurement alignment.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <Users className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">HRTech &amp; People Ops</p>
              <p className="text-sm text-[var(--muted-foreground)]">Employee/manager personas, change management angles.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <GraduationCap className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">EdTech &amp; Training</p>
              <p className="text-sm text-[var(--muted-foreground)]">Learner/instructor/admin needs; outcomes &amp; adoption.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <Activity className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">HealthTech</p>
              <p className="text-sm text-[var(--muted-foreground)]">Clinical vs. admin buyers; compliance-first narratives.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <Briefcase className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">Professional Services</p>
              <p className="text-sm text-[var(--muted-foreground)]">Service packaging, ICP clarity, offer-to-outcome mapping.</p>
            </div>
          </li>
          <li role="listitem" className="flex items-start gap-3 rounded-xl border p-4">
            <ShoppingCart className="mt-1 h-5 w-5" aria-hidden="true" />
            <div>
              <p className="font-medium">B2B eCommerce</p>
              <p className="text-sm text-[var(--muted-foreground)]">Buyer committees, integration dependencies, ROI proof.</p>
            </div>
          </li>
        </ul>

        {/* Bridge to Pricing */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="#pricing">
            <Button className="rounded-full">See pricing</Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" className="rounded-full">See sample personas</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowAndIndustries;
