<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

class SocialLoginController extends Controller
{
    public function redirect(Request $request)
    {
        // Store the "pricing modal" flag in session
        if ($request->query('from_pricing_modal')) {
            session(['from_pricing_modal' => true]);
        }
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'password' => bcrypt(str()->random(16)), // random password
            ]
        );

        Auth::login($user, true);

        // Redirect to special route if login came from pricing modal
        if (session()->pull('from_pricing_modal', false)) {
            return redirect('/pricing/checkout'); 
        }

        return redirect()->intended('/dashboard');
    }

    // Redirect to Google OAuth
    public function redirectPopup()
    {
        // store plan_id for checkout after login
        session(['from_pricing_plan_id' => request()->query('plan_id')]);

        return Socialite::driver('google')
            ->stateless()
            ->redirectUrl(route('google.callback-popup'))
            ->redirect();
    }

    // Handle callback from Google
    public function callbackPopup()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'password' => bcrypt(str()->random(16)), // random password
            ]
        );

        Auth::login($user, true);

        $planId = session()->pull('from_pricing_plan_id');

        // Return a simple JS page to communicate back to the popup
        return response()->view('auth.google-popup-callback', ['planId' => $planId]);
    }


}
