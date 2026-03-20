<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    //

    public function index(Request $request){
        $products = Product::all();
        return Inertia::render('home/index', [
            'seo' => [
                'title' => 'Personaitor',
                'description' => 'Build marketing personas, plan campaigns, and generate messaging faster with Personaitor.',
            ],
            'plans' => $products
        ]);
    }

    public function terms(){
        return Inertia::render('home/terms', [
            'seo' => [
                'title' => 'Terms of Use',
                'description' => 'Read the terms of use for Personaitor.',
            ],
        ]);
    }

    public function privacy(){
        return Inertia::render('home/privacy', [
            'seo' => [
                'title' => 'Privacy Policy',
                'description' => 'Read the privacy policy for Personaitor.',
            ],
        ]);
    }
}
