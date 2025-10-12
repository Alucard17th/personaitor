<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $casts = [
        'data' => 'array',
        'settings' => 'array',
        'favorite' => 'boolean',
    ];

    public static function boot()
    {
        parent::boot();

        // static::created(function ($persona) {
        //     Activity::create(['type' => 'created', 'persona_id' => $persona->id]);
        // });

        // static::updated(function ($persona) {
        //     Activity::create(['type' => 'updated', 'persona_id' => $persona->id]);
        // });
    }

    public function categories()
    {
        return $this->belongsToMany(\App\Models\Category::class)->withTimestamps();
    }
}
