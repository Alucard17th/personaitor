<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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

        return Inertia::render('dashboard', [
            'personas'           => $personas,
            'favorite_personas'  => $favorite_personas,
        ]);
    }
}
