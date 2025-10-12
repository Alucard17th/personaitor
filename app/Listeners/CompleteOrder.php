<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use App\Models\Product;
use Laravel\Paddle\Cashier;
use Laravel\Paddle\Events\TransactionCompleted;

class CompleteOrder
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the incoming Cashier webhook event.
     */
    public function handle(TransactionCompleted $event): void
    {
        \Log::info('Payment completed Payment completed');
        \Log::info($event->payload);

        if($event->payload['event_type'] !== 'transaction.completed') return;

        $userId = $event->payload['data']['custom_data']['user_id'] ?? null;
        $paddlePriceId = $event->payload['data']['custom_data']['paddle_price_id'] ?? null;
 
        $user = User::findOrFail($userId);
        $product = Product::where('paddle_price_id', $paddlePriceId)->first();

        \Log::info('[Paddle] Resolved user & product', [
            'user' => [
                'id'       => $user->id,
                'email'    => $user->email,
                'name'     => $user->name,
                'quantity_before' => $user->quantity ?? null,
                'Is_Subscribed' => $user->subscribed(),
            ],
            'product' => [
                'id'              => $product->id,
                'name'            => $product->name,
                'paddle_price_id' => $product->paddle_price_id,
                'quantity'        => $product->quantity,
                'price'           => $product->price,
            ],
        ]);
 
        $user->update(['quantity' => $user->quantity + $product->quantity]);

    }
}
