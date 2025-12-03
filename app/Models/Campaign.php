<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'status', 'start_date', 'end_date', 'created_by', 'analytics',
    ];

    protected $casts = [
        'analytics' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function personas()
    {
        return $this->belongsToMany(Persona::class, 'campaign_persona');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

