<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Paddle\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'quantity',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Include these computed attributes when converting to array/JSON.
     */
    protected $appends = [
        'is_subscribed',
        'can_generate',
        'plan',
        'on_trial',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function personas()
    {
        return $this->hasMany(Persona::class, 'user_id');
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class, 'created_by');
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function canGenerate()
    {   
        $quantity = $this->quantity;
        if($quantity > 0) {
            return true;
        }
        return false;
    }

    public function decreaseQuantity($quantity)
    {
        $this->quantity = $this->quantity - $quantity;
        $this->save();
    }

    public function getIsSubscribedAttribute(): bool { return $this->subscribed(); }
    public function getCanGenerateAttribute(): bool { return $this->canGenerate(); }
    public function getPlanAttribute(): ?string { return optional($this->subscription('default'))->paddle_price_id; }
    public function getOnTrialAttribute(): bool { return $this->onTrial(); }
}
