'use client';

import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface CampaignFormProps {
  campaign?: Campaign | null;
  mode: 'create' | 'edit';
  personas: Persona[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Campaigns', href: '/app/campaigns' },
];

export default function CampaignForm({ campaign, mode, personas }: CampaignFormProps) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: campaign?.name ?? '',
    description: campaign?.description ?? '',
    status: campaign?.status ?? 'draft',
    start_date: campaign?.start_date ?? '',
    end_date: campaign?.end_date ?? '',
    personas: campaign?.personas?.map((p) => p.id.toString()) ?? [],
  });

  const personaOptions: MultiSelectOption[] = React.useMemo(
    () => personas.map((p) => ({ label: p.name, value: String(p.id) })),
    [personas],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      post('/app/campaigns', { preserveScroll: true });
    } else {
      put(`/app/campaigns/${campaign!.id}`, { preserveScroll: true });
    }
  };

  return (
    <AppLayout breadcrumbs={[...breadcrumbs, { title: mode === 'create' ? 'Create' : 'Edit', href: '#' }]}>
      <Head title={`${mode === 'create' ? 'Create' : 'Edit'} Campaign`} />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'create' ? 'Create' : 'Edit'} Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Campaign Name...' />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={data.description ?? ''}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="Campaign Description..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="rounded border p-2 w-full"
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  type="date"
                  id="start_date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                />
              </div>

              {/* End Date */}
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  type="date"
                  id="end_date"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                />
              </div>

              {/* Personas MultiSelect */}
              <div className="md:col-span-2">
                <Label>Personas</Label>
                <MultiSelect
                  options={personaOptions}
                  placeholder="Select personas…"
                  defaultValue={data.personas}
                  onValueChange={(values) => setData('personas', values)}
                />
                {errors.personas && <p className="text-xs text-red-500 mt-1">{errors.personas}</p>}
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
