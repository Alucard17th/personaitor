import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

import HeadingSmall from '@/components/heading-small';
import { Badge } from '@/components/ui/badge';
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

import { ArrowUpDown, ChevronDown, Download } from 'lucide-react';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState, // ✅ add
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type Plan = {
    type?: string | null;
    status: 'none' | 'active' | 'canceling' | 'past_due' | 'paused';
    trial_ends_at?: string | null;
    ends_at?: string | null;
    paused_at?: string | null;
    quantity?: number | null;
} | null;

type PaymentEdge = { amount: string; date: string | null } | null;

type PaymentRow = {
    id: string;
    date: string | null;
    total: string; // includes currency, e.g. "€19.99"
    tax: string; // includes currency, e.g. "€0.00"
    pdf_url: string;
};

interface Props {
    plan: Plan;
    lastPayment: PaymentEdge;
    nextPayment: PaymentEdge;
    transactions: PaymentRow[];
}

/* -------------------------------------------------------------------------- */
/*                                 Breadcrumbs                                */
/* -------------------------------------------------------------------------- */

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Subscription',
        href: route('settings.subscription.show') as unknown as string,
    },
];

/* -------------------------------------------------------------------------- */
/*                               Page Component                               */
/* -------------------------------------------------------------------------- */

export default function Subscription({
    plan,
    lastPayment,
    nextPayment,
    transactions,
}: Props) {
    /* --------------------------- Badge tone by status -------------------------- */
    const tone =
        plan?.status === 'past_due'
            ? 'warning'
            : plan?.status === 'paused'
              ? 'secondary'
              : plan?.status === 'canceling'
                ? 'destructive'
                : plan?.status === 'active'
                  ? 'default'
                  : 'outline';

    /* ----------------------------- TanStack: data ------------------------------ */
    const data = React.useMemo<PaymentRow[]>(
        () => transactions ?? [],
        [transactions],
    );

    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    /* ---------------------------- TanStack: columns ---------------------------- */
    const columns = React.useMemo<ColumnDef<PaymentRow>[]>(
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
            // DATE
            {
                accessorKey: 'date',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Date <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const v = row.getValue('date') as string | null | undefined;
                    return <div>{v ?? '—'}</div>;
                },
            },
            // TOTAL
            {
                accessorKey: 'total',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Total <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="font-medium">
                        {row.getValue('total') as string}
                    </div>
                ),
            },
            // TAX
            {
                accessorKey: 'tax',
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === 'asc')
                        }
                    >
                        Tax <ArrowUpDown className="ml-1 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div>{row.getValue('tax') as string}</div>,
            },
            // INVOICE (Download)
            {
                id: 'invoice',
                header: () => <div className="text-right">Invoice</div>,
                cell: ({ row }) => {
                    const p = row.original;
                    return (
                        <div className="flex justify-end">
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
                                            href={p.pdf_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            title="Download PDF"
                                        >
                                            PDF
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                },
                enableHiding: false,
            },
        ],
        [],
    );

    /* ------------------------ TanStack: table state/hooks ---------------------- */
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
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination, // ✅ add
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(), // ✅ add
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        }, // ✅ add
    });

    /* ---------------------------------- UI ------------------------------------ */
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription" />

            <SettingsLayout>
                {/* Section: Overview */}
                <div className="space-y-6">
                    <HeadingSmall
                        title="Subscription"
                        description="Manage your plan and billing (Paddle)"
                    />

                    {/* Row: Current plan / Next & Last payment */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Current plan */}
                        <div className="space-y-3 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-lg font-semibold">
                                    {plan?.type ?? 'Default Subscription'}
                                </div>
                                <Badge
                                    variant={tone as any}
                                    className="capitalize"
                                >
                                    {plan?.status ?? 'none'}
                                </Badge>
                            </div>

                            <div className="grid gap-1 text-sm">
                                {plan?.trial_ends_at && (
                                    <div>
                                        <span className="text-muted-foreground">
                                            Trial ends:
                                        </span>{' '}
                                        {plan.trial_ends_at}
                                    </div>
                                )}
                                {plan?.ends_at && (
                                    <div>
                                        <span className="text-muted-foreground">
                                            Ends on:
                                        </span>{' '}
                                        {plan.ends_at}
                                    </div>
                                )}
                                {plan?.paused_at && (
                                    <div>
                                        <span className="text-muted-foreground">
                                            Paused at:
                                        </span>{' '}
                                        {plan.paused_at}
                                    </div>
                                )}
                                {typeof plan?.quantity === 'number' && (
                                    <div>
                                        <span className="text-muted-foreground">
                                            Seats:
                                        </span>{' '}
                                        {plan.quantity}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payments */}
                        <div className="space-y-3 rounded-lg border p-4">
                            <div className="text-lg font-semibold">Billing</div>
                            <div className="grid gap-2 text-sm">
                                <div>
                                    <span className="text-muted-foreground">
                                        Next payment:
                                    </span>{' '}
                                    {nextPayment ? (
                                        <>
                                            <span className="font-medium text-foreground">
                                                {nextPayment.amount}
                                            </span>
                                            {nextPayment.date
                                                ? ` on ${nextPayment.date}`
                                                : ''}
                                        </>
                                    ) : (
                                        '—'
                                    )}
                                </div>
                                <div>
                                    <span className="text-muted-foreground">
                                        Last payment:
                                    </span>{' '}
                                    {lastPayment ? (
                                        <>
                                            <span className="font-medium text-foreground">
                                                {lastPayment.amount}
                                            </span>
                                            {lastPayment.date
                                                ? ` on ${lastPayment.date}`
                                                : ''}
                                        </>
                                    ) : (
                                        '—'
                                    )}
                                </div>
                            </div>

                            {/* Update payment method (Paddle-hosted page) */}
                            <div className="pt-2">
                                <Button asChild variant="secondary">
                                    <a
                                        href={route(
                                            'settings.subscription.update_payment_method',
                                        )}
                                    >
                                        Update payment method
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-4 rounded-lg border p-4">
                        <div className="text-lg font-semibold">
                            Manage subscription
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {/* Active → pause / cancel / cancel now */}
                            {plan?.status === 'active' && (
                                <>
                                    <Form
                                        method="post"
                                        action={route(
                                            'settings.subscription.pause',
                                        )}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({
                                            processing,
                                            recentlySuccessful,
                                        }) => (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? 'Working…'
                                                        : 'Pause'}
                                                </Button>
                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out"
                                                    enterFrom="opacity-0"
                                                    leave="transition ease-in-out"
                                                    leaveTo="opacity-0"
                                                >
                                                    <p className="text-sm text-neutral-600">
                                                        Done
                                                    </p>
                                                </Transition>
                                            </div>
                                        )}
                                    </Form>

                                    <Form
                                        method="post"
                                        action={route(
                                            'settings.subscription.cancel',
                                        )}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({
                                            processing,
                                            recentlySuccessful,
                                        }) => (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="destructive"
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? 'Working…'
                                                        : 'Cancel at period end'}
                                                </Button>
                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out"
                                                    enterFrom="opacity-0"
                                                    leave="transition ease-in-out"
                                                    leaveTo="opacity-0"
                                                >
                                                    <p className="text-sm text-neutral-600">
                                                        Scheduled
                                                    </p>
                                                </Transition>
                                            </div>
                                        )}
                                    </Form>

                                    <Form
                                        method="post"
                                        action={route(
                                            'settings.subscription.cancel_now',
                                        )}
                                        options={{ preserveScroll: true }}
                                    >
                                        {({
                                            processing,
                                            recentlySuccessful,
                                        }) => (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="destructive"
                                                    disabled={processing}
                                                >
                                                    {processing
                                                        ? 'Working…'
                                                        : 'Cancel now'}
                                                </Button>
                                                <Transition
                                                    show={recentlySuccessful}
                                                    enter="transition ease-in-out"
                                                    enterFrom="opacity-0"
                                                    leave="transition ease-in-out"
                                                    leaveTo="opacity-0"
                                                >
                                                    <p className="text-sm text-neutral-600">
                                                        Canceled
                                                    </p>
                                                </Transition>
                                            </div>
                                        )}
                                    </Form>
                                </>
                            )}

                            {/* Paused → resume */}
                            {plan?.status === 'paused' && (
                                <Form
                                    method="post"
                                    action={route(
                                        'settings.subscription.resume',
                                    )}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing, recentlySuccessful }) => (
                                        <div className="flex items-center gap-2">
                                            <Button disabled={processing}>
                                                {processing
                                                    ? 'Working…'
                                                    : 'Resume'}
                                            </Button>
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600">
                                                    Resumed
                                                </p>
                                            </Transition>
                                        </div>
                                    )}
                                </Form>
                            )}

                            {/* Canceling (grace) → stop cancelation */}
                            {plan?.status === 'canceling' && (
                                <Form
                                    method="post"
                                    action={route(
                                        'settings.subscription.stop_cancelation',
                                    )}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ processing, recentlySuccessful }) => (
                                        <div className="flex items-center gap-2">
                                            <Button disabled={processing}>
                                                {processing
                                                    ? 'Working…'
                                                    : 'Stop cancelation'}
                                            </Button>
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-neutral-600">
                                                    Stopped
                                                </p>
                                            </Transition>
                                        </div>
                                    )}
                                </Form>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Note: You can stop a scheduled cancelation during
                            the grace period. After a full cancel, start a new
                            subscription to resume service.
                        </p>
                    </div>

                    {/* Invoices (TanStack table, inline) */}
                    <div className="space-y-3 rounded-lg border p-4">
                        <div className="text-lg font-semibold">Invoices</div>

                        {/* Controls (filter + column visibility) */}
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Filter by date or id…"
                                value={
                                    (table
                                        .getColumn('date')
                                        ?.getFilterValue() as string) ?? ''
                                }
                                onChange={(e) =>
                                    table
                                        .getColumn('date')
                                        ?.setFilterValue(e.target.value)
                                }
                                className="max-w-sm"
                            />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="ml-auto"
                                    >
                                        Columns{' '}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
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
                                                        column.toggleVisibility(
                                                            !!v,
                                                        )
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
                                                              header.column
                                                                  .columnDef
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
                                                    row.getIsSelected() &&
                                                    'selected'
                                                }
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
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

                        {/* Table footer (selection summary + pagination) */}
                        {/* Selection summary (same look) */}
                        <div className="mt-3 text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{' '}
                            {table.getFilteredRowModel().rows.length} row(s)
                            selected.
                        </div>

                        {/* Client-side pagination, styled like your server links */}
                        {(() => {
                            const pageIndex =
                                table.getState().pagination.pageIndex;
                            const pageCount = table.getPageCount();

                            type LinkItem = {
                                labelHtml: string; // use HTML to match « » … etc.
                                active?: boolean;
                                disabled?: boolean;
                                action?: () => void;
                            };

                            const links: LinkItem[] = [];

                            // « Previous
                            links.push({
                                labelHtml: '&laquo; Previous',
                                disabled: !table.getCanPreviousPage(),
                                action: () => table.previousPage(),
                            });

                            // Page numbers with smart ellipses (1 ... c-1 c c+1 ... N)
                            const pushPage = (i: number) =>
                                links.push({
                                    labelHtml: String(i + 1),
                                    active: i === pageIndex,
                                    action: () => table.setPageIndex(i),
                                });

                            if (pageCount <= 7) {
                                for (let i = 0; i < pageCount; i++) pushPage(i);
                            } else {
                                pushPage(0);
                                if (pageIndex > 2) {
                                    links.push({
                                        labelHtml: '&hellip;',
                                        disabled: true,
                                    });
                                }
                                const start = Math.max(1, pageIndex - 1);
                                const end = Math.min(
                                    pageCount - 2,
                                    pageIndex + 1,
                                );
                                for (let i = start; i <= end; i++) pushPage(i);
                                if (pageIndex < pageCount - 3) {
                                    links.push({
                                        labelHtml: '&hellip;',
                                        disabled: true,
                                    });
                                }
                                pushPage(pageCount - 1);
                            }

                            // Next »
                            links.push({
                                labelHtml: 'Next &raquo;',
                                disabled: !table.getCanNextPage(),
                                action: () => table.nextPage(),
                            });

                            return (
                                <nav
                                    className="mt-4 flex flex-wrap gap-2"
                                    role="navigation"
                                    aria-label="Pagination"
                                >
                                    {links.map((l, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={l.action}
                                            disabled={!!l.disabled}
                                            className={[
                                                'rounded-md border px-3 py-1 text-sm',
                                                l.active
                                                    ? 'bg-foreground text-background'
                                                    : '',
                                                l.disabled
                                                    ? 'pointer-events-none opacity-50'
                                                    : '',
                                            ].join(' ')}
                                            dangerouslySetInnerHTML={{
                                                __html: l.labelHtml,
                                            }}
                                        />
                                    ))}
                                </nav>
                            );
                        })()}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
