<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use DB;

class DashboardController extends Controller
{
    //
   public function index(Request $request): Response
    {
        $user = $request->user();

        $personas = $user->personas()
            ->latest()
            ->paginate(6)
            ->through(fn (Persona $p) => [
                'id'        => $p->id,
                'name'      => $p->name,
                'favorite'  => (bool) $p->favorite,
                'created_at'=> $p->created_at?->toIso8601String(),
            ]);

        $favorite_personas = $user->personas()
            ->where('favorite', 1)
            ->latest()
            ->take(6)
            ->get(['id','name','favorite']);
        
        $campaignsCount = $user->campaigns()->count();
        $categoriesCount = $user->categories()->count();
        $personasCount = $user->personas()->count();

        // Get personas created by month for the last 6 months
        $personasByMonth = $user->personas()
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subMonths(5)->startOfMonth())
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        // Format the chart data
        $chartData = $this->formatChartData($personasByMonth);

        return Inertia::render('dashboard', [
            'personas'           => $personas,
            'favorite_personas'  => $favorite_personas,
            'campaignsCount'     => $campaignsCount,
            'categoriesCount'    => $categoriesCount,
            'personasCount'      => $personasCount,
            'chartData'          => $chartData, // Add chart data
        ]);
    }

    /**
     * Format chart data with all months (including zeros for months with no personas)
     */
    private function formatChartData($personasByMonth): array
    {
        $months = [];
        $now = now();
        
        // Generate last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $months[$date->format('Y-m')] = [
                'year' => $date->year,
                'month' => $date->month,
                'month_name' => $date->format('F'),
                'count' => 0
            ];
        }

        // Fill in actual counts
        foreach ($personasByMonth as $data) {
            $key = $data->year . '-' . str_pad($data->month, 2, '0', STR_PAD_LEFT);
            if (isset($months[$key])) {
                $months[$key]['count'] = $data->count;
            }
        }

        // Convert to array format for the frontend
        return array_map(function ($monthData) {
            return [
                'month' => $monthData['month_name'],
                'personas' => $monthData['count']
            ];
        }, array_values($months));
    }
}
