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
            'plans' => $products
        ]);
    }

    public function terms(){
        return Inertia::render('home/terms');
    }

    public function privacy(){
        return Inertia::render('home/privacy');
    }
}
