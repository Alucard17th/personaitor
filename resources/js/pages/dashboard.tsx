import { usePage } from '@inertiajs/react';
import { CustomTable } from '@/components/dashboard/table';
import { ChartLineLinear } from '@/components/ui/Charts/chart-line-linear';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

// Define custom types
interface PersonaRow {
    id: string;
    name: string;
    favorite: boolean;
    created_at?: string | null;
}

type Pagination<T> = {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
};

// Extend Inertia's PageProps type to include additional custom properties
interface PageProps extends Record<string, unknown> {  // Add an index signature here
    personas: Pagination<PersonaRow>;
    favorite_personas: Array<Pick<PersonaRow, 'id' | 'name' | 'favorite'>>;
    products: ProductLite[];
}

interface ProductLite {
    id: string;
    name: string;
}

// Example chart data
const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { personas, favorite_personas, products } = usePage<PageProps>().props;  // Get all props from Inertia page

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Card Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl">
                        <Card className="p-4">
                            <CardHeader>
                                <CardTitle>Card 1</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>This is card 1 content.</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="rounded-xl">
                        <Card className="p-4">
                            <CardHeader>
                                <CardTitle>Card 2</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>This is card 2 content.</p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="rounded-xl">
                        <Card className="p-4">
                            <CardHeader>
                                <CardTitle>Card 3</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>This is card 3 content.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Chart */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <ChartLineLinear
                        title="Line Chart - Linear"
                        description="January - June 2024"
                        chartData={chartData}
                        chartConfig={chartConfig}
                    />
                </div>
                {/* Pass all required props to the CustomTable component */}
                <CustomTable personas={personas} favorite_personas={favorite_personas} products={products} />
            </div>
        </AppLayout>
    );
}
