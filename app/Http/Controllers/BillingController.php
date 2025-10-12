<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    // public function checkout(Request $request)
    // {
    //     $request->validate([
    //         'price_id' => ['required', 'string'], // Paddle Price ID, e.g. "pri_..."
    //     ]);

    //     $user = $request->user();
    //     $priceId = $request->string('price_id');

    //     // Create a Paddle checkout for a subscription to the "default" plan.
    //     // Cashier returns a RedirectResponse to Paddle’s hosted checkout;
    //     // we just need its URL for the overlay.
    //     $response = $user->newSubscription('default', $priceId)
    //         ->allowPromotionCodes() // optional
    //         ->checkout([
    //             'success_url' => route('billing.success'),
    //             'cancel_url'  => route('billing.cancel'),
    //         ]);

    //     // $response is a RedirectResponse pointing to Paddle's checkout URL.
    //     $url = method_exists($response, 'getTargetUrl')
    //         ? $response->getTargetUrl()
    //         : (string) $response; // fallback

    //     return response()->json(['url' => $url]);
    // }

    public function checkout(Request $request)
    {
        $user    = $request->user();
        $priceId = (string) $request->input('price_id'); // e.g. "pri_123"
        $type    = (string) $request->input('type', 'default');

        // Build a Cashier Paddle checkout
        $checkout = $user->subscribe($priceId, $type)
            ->customData(['user_id' => $user->id, 'paddle_price_id' => $priceId])
            ->returnTo(route('billing.success', [], true)); // absolute URL
            
        $customer = $user->customer;
        // Map to Paddle.Checkout.open(...) shape:

        $payload = [
            'items' => collect($checkout->items ?? [ ['price_id' => $priceId, 'quantity' => 1] ])
                ->map(fn ($i) => [
                    'priceId'  => $i['price_id'],        // camelCase for Paddle JS
                    'quantity' => $i['quantity'] ?? 1,
                ])->values()->all(),
            'customer' => [
                'id'    => optional($customer)->paddle_id,
                // 'email' => $user->email,
            ],
            'settings' => [
                'successUrl' => route('billing.success', [], true), // absolute
            ],
            'customData' => ['user_id' => $user->id, 'paddle_price_id' => $priceId],
        ];

        // Flash to session so Inertia can deliver it as a prop
        return back()->with('checkoutPayload', $payload);
    }

    public function success(Request $request)
    {
        // You could flash a message or just redirect back to the app
        return redirect()->to(route('dashboard', [], true))->with('status', 'Subscription active!');
    }

    public function cancel(Request $request)
    {
        return redirect()->to(route('dashboard', [], true))->with('status', 'Checkout canceled.');
    }
}
