import { CustomTable } from '@/components/dashboard/table';
import { ChartLineLinear } from '@/components/ui/Charts/chart-line-linear';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    FolderTree,
    Megaphone,
    Plus,
    TrendingUp,
    Users,
} from 'lucide-react';

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
interface PageProps extends Record<string, unknown> {
    personas: Pagination<PersonaRow>;
    favorite_personas: Array<Pick<PersonaRow, 'id' | 'name' | 'favorite'>>;
    products: ProductLite[];
    campaignsCount: number;
    categoriesCount: number;
    personasCount: number;
    chartData: ChartDataItem[]; // Add chart data to props
}

interface ProductLite {
    id: string;
    name: string;
}

// Chart data interface
interface ChartDataItem {
    month: string;
    personas: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Card configuration for consistent styling and behavior
const cardConfig = {
    personas: {
        title: 'User Personas',
        description: 'Target audience profiles',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        action: 'Create Persona',
        trend: '+12%',
        href: '/app/personas/create',
    },
    categories: {
        title: 'Categories',
        description: 'Content organization',
        icon: FolderTree,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        action: 'Manage Categories',
        trend: '+5%',
        href: '/app/categories/create',
    },
    campaigns: {
        title: 'Campaigns',
        description: 'Active marketing campaigns',
        icon: Megaphone,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        action: 'Launch Campaign',
        trend: '+23%',
        href: '/app/campaigns/create',
    },
};

export default function Dashboard() {
    const {
        personas,
        favorite_personas,
        products,
        campaignsCount,
        categoriesCount,
        personasCount,
        chartData,
    } = usePage<PageProps>().props;

    // Calculate total personas created in the last 6 months for the chart subtitle
    const totalLastSixMonths = chartData.reduce(
        (sum, item) => sum + item.personas,
        0,
    );

    const statsCards = [
        {
            key: 'personas',
            count: personasCount,
            config: cardConfig.personas,
        },
        {
            key: 'categories',
            count: categoriesCount,
            config: cardConfig.categories,
        },
        {
            key: 'campaigns',
            count: campaignsCount,
            config: cardConfig.campaigns,
        },
    ];

    // 1) Keep the Chart config keyed as "personas"
    const chartConfig = {
        personas: {
            label: 'Personas Created',
            color: 'var(--chart-1)', // ensure it's a valid color string
        },
    };

    // 2) Make sure the transformed data uses the SAME key: "personas"
    const transformedChartData = chartData.map((item) => ({
        month: item.month,
        personas: item.personas, // <-- match chartConfig key
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Enhanced Card Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {statsCards.map(({ key, count, config }) => {
                        const Icon = config.icon;
                        return (
                            <Card
                                key={key}
                                className={`group cursor-pointer border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${config.borderColor} hover:border-current`}
                            >
                                <CardContent className="p-3">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div
                                            className={`rounded-lg p-2 ${config.bgColor}`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${config.color}`}
                                            />
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1 px-2 py-0.5 text-xs"
                                        >
                                            <TrendingUp className="h-3 w-3" />
                                            {config.trend}
                                        </Badge>
                                    </div>

                                    <CardTitle className="mb-1 text-2xl font-bold">
                                        {count}
                                    </CardTitle>

                                    <CardDescription className="mb-1 text-base font-semibold text-foreground">
                                        {config.title}
                                    </CardDescription>

                                    <p className="mb-3 text-sm text-muted-foreground">
                                        {config.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex h-auto items-center gap-1 p-0 text-sm hover:underline"
                                            onClick={() =>
                                                (window.location.href =
                                                    config.href)
                                            }
                                        >
                                            {config.action}
                                            <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                        <ArrowUpRight
                                            className={`h-3.5 w-3.5 ${config.color} opacity-0 transition-opacity group-hover:opacity-100`}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Chart with Real Data */}
                <div className="relative min-h-[400px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <ChartLineLinear
                        title="Personas Creation Trend"
                        description={`Last 6 months • Total: ${totalLastSixMonths} personas created`}
                        chartData={transformedChartData}
                        chartConfig={chartConfig}
                    />
                </div>

                {/* Quick Actions Section */}
                <Card className="border-2 border-gray-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Megaphone className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Button
                                className="flex h-12 items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() =>
                                    (window.location.href =
                                        '/app/personas/create')
                                }
                            >
                                <Users className="h-4 w-4" />
                                Create New Persona
                            </Button>

                            <Button
                                className="flex h-12 items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() =>
                                    (window.location.href =
                                        '/app/categories/create')
                                }
                            >
                                <FolderTree className="h-4 w-4" />
                                Add Category
                            </Button>

                            <Button
                                className="flex h-12 items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() =>
                                    (window.location.href =
                                        '/app/campaigns/create')
                                }
                            >
                                <Megaphone className="h-4 w-4" />
                                Launch Campaign
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Pass all required props to the CustomTable component */}
                <CustomTable
                    personas={personas}
                    favorite_personas={favorite_personas}
                    products={products}
                />
            </div>
        </AppLayout>
    );
}
