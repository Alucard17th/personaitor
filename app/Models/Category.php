<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'color', 'description'];

    public function personas()
    {
        return $this->belongsToMany(Persona::class)->withTimestamps();
    }
}
