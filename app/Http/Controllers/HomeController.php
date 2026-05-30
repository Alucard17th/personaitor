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
                'title' => 'Personaitor — AI Persona Generator for SaaS, UX & Marketing',
                'description' => 'Turn a rough idea into a high-converting buyer persona in 30 seconds. Get pains, triggers, objections, JTBD and ad angles to power landing pages, onboarding, and paid campaigns.',
                'keywords' => 'AI persona generator, buyer persona, ICP, user persona, marketing persona, SaaS personas, customer avatar, JTBD, ad targeting, landing page copy',
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
