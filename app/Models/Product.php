<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'features', 'paddle_price_id', 'price', 'quantity',
    ];

    protected $casts = [
        'features' => 'array',   // stores as JSON
    ];
}
