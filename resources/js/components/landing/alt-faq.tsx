'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from '@inertiajs/react';
import {
  HelpCircle,
  Clock,
  Upload,
  Users,
  Link2,
  Shield,
  Sparkles,
  Languages,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How accurate is an AI-generated buyer persona?',
    a: 'Personaitor surfaces every insight with citations and confidence scores, so stakeholders see exactly where each claim comes from. You can compare variants, edit any field, and lock approved versions to reduce bias and drift.',
  },
  {
    q: 'What inputs can I use to create a customer persona?',
    a: 'Paste interview transcripts, upload survey CSVs, drop CRM/support snippets, or start from a one-line product brief. Personaitor normalizes signals — dedupes and tags — then maps them into pains, JTBD, triggers, objections, and messaging angles.',
  },
  {
    q: 'How long does it take to generate a persona?',
    a: 'Most teams get a first high-quality buyer persona draft in under 60 seconds. From there you can refine fields, attach sources, and publish a shareable canvas to the rest of the company.',
  },
  {
    q: 'Can my marketing and product team collaborate on personas?',
    a: 'Yes — invite teammates to comment, suggest changes, and approve final personas. Version history tracks every edit, and you can lock official versions for launches across PM, UX, and growth.',
  },
  {
    q: 'What integrations and exports do you support?',
    a: 'Export personas to Figma, Notion, or CSV, or share a live embeddable link. Use embeds to keep roadmaps, design specs, ad briefs, and SEO content synced to the latest customer persona automatically.',
  },
  {
    q: 'Is my customer data secure and private?',
    a: 'We use industry-standard encryption in transit and at rest. Project data stays scoped to your workspace, you can delete sources or personas at any time, and we never use your private data to train models unless you explicitly opt in.',
  },
  {
    q: 'Does Personaitor support multiple languages?',
    a: 'Yes — inputs and outputs work across major languages. For best accuracy, keep each project in one primary language; you can still localize messaging angles per market or campaign.',
  },
  {
    q: 'What results can I expect from using AI personas?',
    a: 'Teams typically see faster time-to-insight, sharper landing-page and ad copy, better onboarding activation, and higher win rates on UX experiments. Personaitor is built to produce briefs that directly guide what ships.',
  },
];

const FAQ = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-6xl px-6 py-16 md:py-16"
      aria-labelledby="faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mb-8">
        <Badge variant="secondary" className="rounded-full">FAQ</Badge>
        <h2
          id="faq-heading"
          className="mt-4 flex items-center gap-2 text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          <HelpCircle className="h-6 w-6" aria-hidden="true" />
          AI persona generator — frequently asked questions
        </h2>
        <p className="mt-3 max-w-[72ch] text-[var(--muted-foreground)]">
          Common questions about creating buyer personas with Personaitor — accuracy,
          supported inputs, team collaboration, integrations, data security, languages,
          and the outcomes you can expect.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full self-stretch divide-y rounded-xl border text-left">
        <AccordionItem value="accuracy">
          <AccordionTrigger className="px-4 py-3">
            How accurate is an AI-generated buyer persona?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            PERSONAAITOR surfaces insights with <strong>citations</strong> and <strong>confidence scores</strong>,
            so stakeholders can see where a claim comes from. You can compare variants, edit any field,
            and lock approved versions to reduce bias and drift.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="inputs">
          <AccordionTrigger className="px-4 py-3">
            What inputs can I use to create a customer persona?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            Paste interview notes, upload survey CSVs, add CRM/support snippets, or start from a brief.
            PERSONAAITOR normalizes signals (dedupes &amp; tags) and maps them into pains, JTBD, triggers,
            objections, and messaging angles.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Upload className="mr-1 inline h-3 w-3" /> CSV / text</span>
              <span className="rounded-full border px-2.5 py-1">CRM notes</span>
              <span className="rounded-full border px-2.5 py-1">Support threads</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="speed">
          <AccordionTrigger className="px-4 py-3">
            How long does it take to generate a persona?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            Most teams get a first high-quality draft in <strong>under a minute</strong>. From there,
            you can refine fields, attach sources, and publish a shareable canvas.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Clock className="mr-1 inline h-3 w-3" /> &lt;60s draft</span>
              <span className="rounded-full border px-2.5 py-1">Live preview</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="collab">
          <AccordionTrigger className="px-4 py-3">
            Can my marketing and product team collaborate on personas?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            Yes—invite teammates to comment, suggest changes, and approve final personas.
            Version history keeps track of who changed what, and you can lock official versions for launches.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Users className="mr-1 inline h-3 w-3" /> Comments</span>
              <span className="rounded-full border px-2.5 py-1">Approvals</span>
              <span className="rounded-full border px-2.5 py-1">Version control</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="integrations">
          <AccordionTrigger className="px-4 py-3">
            What integrations and exports do you support?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            Export personas to <strong>Figma, Notion, CSV</strong>, or share a live, embeddable link.
            Use embeds to keep roadmaps, specs, and campaigns synced to the latest persona.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Link2 className="mr-1 inline h-3 w-3" /> Live embeds</span>
              <span className="rounded-full border px-2.5 py-1">Figma</span>
              <span className="rounded-full border px-2.5 py-1">Notion</span>
              <span className="rounded-full border px-2.5 py-1">CSV</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger className="px-4 py-3">
            Is my customer data secure and private?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            We use industry-standard encryption in transit and at rest. Project data stays private to your workspace,
            and you can delete sources and personas at any time. We do not use your private data to train models unless
            you explicitly opt in.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Shield className="mr-1 inline h-3 w-3" /> Encryption</span>
              <span className="rounded-full border px-2.5 py-1">Granular access</span>
              <span className="rounded-full border px-2.5 py-1">Data deletion</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger className="px-4 py-3">
            Does Personaitor support multiple languages?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            Yes—inputs and outputs can work across major languages. For best results, keep each project in a single
            primary language; you can still localize messaging angles per market.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Languages className="mr-1 inline h-3 w-3" /> Multilingual</span>
              <span className="rounded-full border px-2.5 py-1">Localized angles</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="value">
          <AccordionTrigger className="px-4 py-3">
            What results can I expect from using AI personas?
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm text-[var(--muted-foreground)]">
            Teams typically see faster time-to-insight, clearer roadmaps, and higher win rates for UX and copy tests.
            PERSONAAITOR focuses on actionable briefs so your personas directly guide what ships.
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1"><Sparkles className="mr-1 inline h-3 w-3" /> Time-to-insight ↓</span>
              <span className="rounded-full border px-2.5 py-1">Alignment ↑</span>
              <span className="rounded-full border px-2.5 py-1">Test velocity ↑</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* CTA beneath */}
      <div className="mt-8">
        <Link href="/contact">
          <Button className="rounded-full">
            Didn’t see your question? Ask us →
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FAQ;
