'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowUpDown, ChevronDown, Pencil, Trash } from 'lucide-react';
import React from 'react';

// TanStack
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

type Category = {
    id: number;
    name: string;
    slug: string;
    color?: string | null;
    description?: string | null;
    created_at?: string;
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

interface PageProps {
    categories: Pagination<Category>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Categories', href: '/app/categories' },
];

export default function CategoriesIndex({ categories }: PageProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        destroy(route('categories.destroy', id), { preserveScroll: true });
    };

    // TanStack table
    const data = React.useMemo(() => categories.data, [categories.data]);

    const columns = React.useMemo<ColumnDef<Category>[]>(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                'indeterminate')
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Name <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue('name')}</div>
                ),
            },
            {
                accessorKey: 'slug',
                header: 'Slug',
                cell: ({ row }) => <div>{row.getValue('slug') || '-'}</div>,
            },
            {
                accessorKey: 'color',
                header: 'Color',
                cell: ({ row }) => {
                    const color = row.getValue('color') as string | null;
                    return color ? (
                        <span
                            className="inline-block h-4 w-4 rounded"
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ) : (
                        '-'
                    );
                },
            },
            {
                id: 'actions',
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const c = row.original;
                    return (
                        <div className="flex justify-end gap-2">
                            <Link href={route('categories.edit', c.id)}>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    title="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(c.id)}
                                disabled={processing}
                                title="Delete"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                enableHiding: false,
            },
        ],
        [processing],
    );

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <Link href={route('categories.create')}>
                        <Button>New Category</Button>
                    </Link>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Filter by name…"
                        value={
                            (table
                                .getColumn('name')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(e) =>
                            table
                                .getColumn('name')
                                ?.setFilterValue(e.target.value)
                        }
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                Toggle columns
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter((c) => c.getCanHide())
                                .map((column) => (
                                    <DropdownMenuItem
                                        key={column.id}
                                        className="capitalize"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            column.toggleVisibility(
                                                !column.getIsVisible(),
                                            );
                                        }}
                                    >
                                        <Checkbox
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(v) =>
                                                column.toggleVisibility(!!v)
                                            }
                                            className="mr-2"
                                        />
                                        {column.id}
                                    </DropdownMenuItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Data table */}

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Selection summary */}
                <div className="mt-3 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>

                {/* Pagination */}
                {categories.links.length > 1 && (
                    <nav className="mt-4 flex flex-wrap gap-2">
                        {categories.links.map((l, i) => {
                            const isDisabled = l.url === null;
                            return (
                                <Link
                                    key={i}
                                    href={l.url || '#'}
                                    preserveScroll
                                    className={`rounded-md border px-3 py-1 text-sm ${
                                        l.active
                                            ? 'bg-foreground text-background'
                                            : ''
                                    } ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: l.label,
                                        }}
                                    />
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>
        </AppLayout>
    );
}
