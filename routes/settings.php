<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SubscriptionController;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // SUBSCRIPTIONS
    Route::get('/settings/subscription', [SubscriptionController::class, 'show'])
        ->name('settings.subscription.show');

    // Management actions
    Route::post('/settings/subscription/cancel', [SubscriptionController::class, 'cancel'])
        ->name('settings.subscription.cancel');
    Route::post('/settings/subscription/cancel-now', [SubscriptionController::class, 'cancelNow'])
        ->name('settings.subscription.cancel_now');
    Route::post('/settings/subscription/stop-cancelation', [SubscriptionController::class, 'stopCancelation'])
        ->name('settings.subscription.stop_cancelation');

    Route::post('/settings/subscription/pause', [SubscriptionController::class, 'pause'])
        ->name('settings.subscription.pause');
    Route::post('/settings/subscription/resume', [SubscriptionController::class, 'resume'])
        ->name('settings.subscription.resume');

    // Paddle-hosted update PM page
    Route::get('/settings/subscription/update-payment-method', [SubscriptionController::class, 'updatePaymentMethod'])
        ->name('settings.subscription.update_payment_method');

    // Invoice PDF redirect
    Route::get('/billing/invoices/{transaction}', function (Transaction $transaction) {
        return $transaction->redirectToInvoicePdf(); // opens Paddle-hosted invoice PDF
    })->name('billing.invoice.pdf');
});
