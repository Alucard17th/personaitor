'use client';

import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect, type MultiSelectOption } from '@/components/multi-select';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface Persona {
  id: number;
  name: string;
}

interface Campaign {
  id: number;
  name: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  personas?: Persona[];
}

interface EditCampaignPageProps {
  campaign: Campaign;      // required for edit
  personas: Persona[];     // list for multiselect
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Campaigns', href: '/app/campaigns' },
];

export default function EditCampaignPage({ campaign, personas }: EditCampaignPageProps) {
  // state matches the create page (personas as string[])
  const { data, setData, put, processing, errors } = useForm({
    name: campaign?.name ?? '',
    description: campaign?.description ?? '',
    status: campaign?.status ?? 'draft',
    start_date: campaign?.start_date ?? '',
    end_date: campaign?.end_date ?? '',
    personas: campaign?.personas?.map((p) => p.id.toString()) ?? [],
  });

  const err = errors as Record<string, string | undefined>;
  const hasError = (k: string) => Boolean(err[k]);

  const personaOptions: MultiSelectOption[] = React.useMemo(
    () => personas.map((p) => ({ label: p.name, value: String(p.id) })),
    [personas],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/app/campaigns/${campaign.id}`, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={[...breadcrumbs, { title: 'Edit', href: '#' }]}>
      <Head title="Edit Campaign" />

      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Campaign</CardTitle>
          </CardHeader>

          <CardContent>
            {/* 🔔 Top error alert (same as create) */}
            {Object.keys(err).length > 0 && (
              <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-medium">Please fix the following:</p>
                <ul className="mt-1 list-disc pl-5">
                  {Object.values(err).map((m, i) => (m ? <li key={i}>{m}</li> : null))}
                </ul>
              </div>
            )}

            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Campaign Name..."
                  aria-invalid={hasError('name')}
                  aria-describedby={hasError('name') ? 'name-error' : undefined}
                  className={hasError('name') ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {hasError('name') && (
                  <p id="name-error" className="mt-1 text-xs text-red-500">{err.name}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className={`h-9 w-full rounded-md border border-foreground/30 bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-foreground/40 dark:bg-input/30 ${hasError('status') ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                  aria-invalid={hasError('status')}
                  aria-describedby={hasError('status') ? 'status-error' : undefined}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
                {hasError('status') && (
                  <p id="status-error" className="mt-1 text-xs text-red-500">{err.status}</p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  type="date"
                  id="start_date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                  aria-invalid={hasError('start_date')}
                  aria-describedby={hasError('start_date') ? 'start_date-error' : undefined}
                  className={hasError('start_date') ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {hasError('start_date') && (
                  <p id="start_date-error" className="mt-1 text-xs text-red-500">{err.start_date}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  type="date"
                  id="end_date"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                  aria-invalid={hasError('end_date')}
                  aria-describedby={hasError('end_date') ? 'end_date-error' : undefined}
                  className={hasError('end_date') ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {hasError('end_date') && (
                  <p id="end_date-error" className="mt-1 text-xs text-red-500">{err.end_date}</p>
                )}
              </div>

              {/* Description (Textarea) */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={data.description ?? ''}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Campaign Description..."
                  aria-invalid={hasError('description')}
                  aria-describedby={hasError('description') ? 'description-error' : undefined}
                  className={hasError('description') ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {hasError('description') && (
                  <p id="description-error" className="mt-1 text-xs text-red-500">{err.description}</p>
                )}
              </div>

              {/* Personas MultiSelect */}
              <div className="md:col-span-2">
                <Label>Personas</Label>
                {/* same wrapper / error styles as create */}
                <div className={`rounded-md border ${hasError('personas') ? 'border-destructive ring-1 ring-destructive/20' : 'border-transparent'}`}>
                  <MultiSelect
                    options={personaOptions}
                    placeholder="Select personas…"
                    defaultValue={data.personas}
                    onValueChange={(values) => setData('personas', values)}
                    aria-invalid={hasError('personas')}
                    aria-describedby={hasError('personas') ? 'personas-error' : undefined}
                  />
                </div>
                {hasError('personas') && (
                  <p id="personas-error" className="mt-1 text-xs text-red-500">{err.personas}</p>
                )}
              </div>

              {/* Submit */}
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="submit" size="sm" disabled={processing}>
                  {processing ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
