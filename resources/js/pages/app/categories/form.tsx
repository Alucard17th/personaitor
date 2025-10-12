import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BreadcrumbItem } from "@/types";
import { dashboard } from "@/routes";

type Category = { id:number; name:string; slug:string; color?:string|null; description?:string|null };

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: dashboard().url },
  { title: "Categories", href: "/app/categories" },
];

export default function CategoryForm({ category, mode }: { category: Category|null; mode: 'create'|'edit' }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    color: category?.color ?? "",
    description: category?.description ?? "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'create') {
      post(route('categories.store'));
    } else {
      put(route('categories.update', category!.id));
    }
  }

  return (
    <AppLayout breadcrumbs={[...breadcrumbs, { title: mode==='create'?'Create':'Edit', href:'#' }]}>
      <Head title={`${mode==='create'?'Create':'Edit'} Category`} />
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>{mode==='create'?'Create':'Edit'} Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e)=>setData('name', e.target.value)} placeholder="Category Name..." />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="slug">Slug (optional)</Label>
                <Input id="slug" value={data.slug} onChange={(e)=>setData('slug', e.target.value)} placeholder="Category Slug..." />
                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input id="color" type="color" value={data.color as string} onChange={(e)=>setData('color', e.target.value)} className="h-10 p-1"/>
                {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" className="w-full rounded-md border p-2" rows={4}
                  value={data.description as string}
                  onChange={(e)=>setData('description', e.target.value)}
                  placeholder="Category Description..."
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="submit" disabled={processing}>
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