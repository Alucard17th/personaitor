'use client'

import React from "react"
import { useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Persona {
  id: number
  name: string
}

interface CampaignFormProps {
  campaign?: any
  personas: Persona[]
  onSubmit: (data: any) => void
}

interface CampaignFormState {
  name: string
  description: string
  status: string
  start_date: string
  end_date: string
  personas: number[]
}

export default function CampaignForm({ campaign, personas, onSubmit }: CampaignFormProps) {
  const { data, setData, post, put, processing, errors } = useForm<CampaignFormState>({
  name: campaign?.name || '',
  description: campaign?.description || '',
  status: campaign?.status || 'draft',
  start_date: campaign?.start_date || '',
  end_date: campaign?.end_date || '',
  personas: campaign?.personas?.map((p: Persona) => p.id) || [],
})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(data)
  }

  const togglePersona = (id: number) => {
    const newPersonas = data.personas.includes(id)
      ? data.personas.filter((p: number) => p !== id)
      : [...data.personas, id]
    setData('personas', newPersonas)
  }

  return (
    <AppLayout>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
        <Label>Name</Label>
        <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Campaign Name" />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <Label>Description</Label>
        <Input value={data.description} onChange={e => setData('description', e.target.value)} />
        {errors.description && <p className="text-red-500">{errors.description}</p>}

        <Label>Status</Label>
        <select value={data.status} onChange={e => setData('status', e.target.value)} className="border rounded p-2">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>

        <Label>Start Date</Label>
        <Input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} />

        <Label>End Date</Label>
        <Input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} />

        <Label>Personas</Label>
        <div className="flex flex-wrap gap-2">
          {personas.map(p => (
            <div key={p.id} className="flex items-center gap-1">
              <Checkbox
                checked={data.personas.includes(p.id)}
                onCheckedChange={() => togglePersona(p.id)}
              />
              <span>{p.name}</span>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={processing}>
          {campaign ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </form>
    </AppLayout>
  )
}
