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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Link, useForm } from '@inertiajs/react';
import {
    ArrowUpDown,
    Download,
    Pencil,
    Star,
    StarOff,
    Trash,
} from 'lucide-react';
import React from 'react';

// tanstack table
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

type PersonaRow = {
    id: string;
    name: string;
    favorite: boolean;
    created_at?: string | null;
};
type ProductLite = { id: string; name: string };

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

interface PageProps {
    personas: Pagination<PersonaRow>;
    favorite_personas: Array<Pick<PersonaRow, 'id' | 'name' | 'favorite'>>;
    products?: ProductLite[];
    flash?: any; // Replace with the correct type
}

export function CustomTable({ personas }: PageProps) {
    const { post, delete: destroy, processing } = useForm();

    function toggleFavorite(id: string) {
        post(`/app/personas/${id}/toggle-favorite`, { preserveScroll: true });
    }

    function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this persona?')) return;
        destroy(`/app/personas/${id}`, { preserveScroll: true });
    }

    // ---- TanStack setup
    const data = React.useMemo(() => personas.data, [personas.data]);

    const columns = React.useMemo<ColumnDef<PersonaRow>[]>(
        () => [
            // SELECT COLUMN (checkboxes)
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
            // NAME
            {
                accessorKey: 'name',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
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
            // CREATED
            {
                accessorKey: 'created_at',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Created <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const v = row.getValue('created_at') as
                        | string
                        | null
                        | undefined;
                    return <div>{v ? new Date(v).toLocaleString() : '-'}</div>;
                },
            },
            // ACTIONS (favorite / edit / download / delete)
            {
                id: 'actions',
                enableHiding: false,
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => {
                    const p = row.original;
                    return (
                        <div className="flex justify-end gap-2">
                            {/* Favorite toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(p.id)}
                                disabled={processing}
                                title={p.favorite ? 'Unfavorite' : 'Favorite'}
                                aria-label={
                                    p.favorite ? 'Unfavorite' : 'Favorite'
                                }
                            >
                                {p.favorite ? (
                                    <Star className="h-4 w-4 fill-current" />
                                ) : (
                                    <StarOff className="h-4 w-4" />
                                )}
                            </Button>

                            {/* Edit icon */}
                            <Link href={`/app/personas/${p.id}/edit`}>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    title="Edit"
                                    aria-label="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </Link>

                            {/* Download dropdown (JSON/CSV) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        title="Download"
                                        aria-label="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        Export
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={`/app/personas/${p.id}/export.json`}
                                            title="Download JSON"
                                        >
                                            JSON
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={`/app/personas/${p.id}/export.csv`}
                                            title="Download CSV"
                                        >
                                            CSV
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Delete icon */}
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete(p.id)}
                                disabled={processing}
                                title="Delete"
                                aria-label="Delete"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
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
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    return (
        <>
            {/* Title */}
            <div className="p-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    Personas
                </h2>
            </div>
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
                        {table.getRowModel().rows?.length ? (
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

            {/* Pagination links */}
            {personas.links?.length > 1 && (
                <nav className="mt-4 flex flex-wrap gap-2">
                    {personas.links.map((l, i) => {
                        const isDisabled = l.url === null;
                        return (
                            <Link
                                key={i}
                                href={l.url || '#'}
                                preserveScroll
                                className={`rounded-md border px-3 py-1 text-sm ${l.active ? 'bg-foreground text-background' : ''} ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
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
        </>
    );
}
