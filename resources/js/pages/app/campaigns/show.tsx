'use client';

import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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

interface CampaignShowProps {
  campaign: Campaign;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Campaigns', href: '/app/campaigns' },
  { title: 'Show', href: '#' },
];

export default function CampaignShow({ campaign }: CampaignShowProps) {
  const personaOptions: MultiSelectOption[] = React.useMemo(
    () =>
      (campaign.personas ?? []).map((p) => ({
        label: p.name,
        value: String(p.id),
      })),
    [campaign.personas],
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Campaign – ${campaign.name}`} />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div>
              <Label>Name</Label>
              <p className="mt-1 text-gray-700">{campaign.name}</p>
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <p className="mt-1 text-gray-700">{campaign.status}</p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label>Description</Label>
              <p className="mt-1 text-gray-700">{campaign.description || '-'}</p>
            </div>

            {/* Start Date */}
            <div>
              <Label>Start Date</Label>
              <p className="mt-1 text-gray-700">{campaign.start_date || '-'}</p>
            </div>

            {/* End Date */}
            <div>
              <Label>End Date</Label>
              <p className="mt-1 text-gray-700">{campaign.end_date || '-'}</p>
            </div>

            
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
