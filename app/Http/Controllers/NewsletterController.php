<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsletterSubscription;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate(
            [
                'email' => 'required|email|unique:newsletter_subscriptions,email',
            ],
            [
                'email.required' => 'Please enter your email address.',
                'email.email' => 'Please enter a valid email address.',
                'email.unique' => 'You are already subscribed to our newsletter.',
            ]
        );

        NewsletterSubscription::create([
            'email' => $request->email,
        ]);

        // Redirect back with flash
        return redirect()->back()->with('flash', ['status' => 'Subscribed successfully!']);
    }
}
